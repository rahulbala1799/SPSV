#!/usr/bin/env tsx

/**
 * Git Push & Vercel Deployment Monitor
 * 
 * This script monitors git pushes and checks Vercel deployment logs
 * 
 * Usage:
 *   npm run monitor:vercel              # Continuous monitoring (checks every 60s)
 *   npm run monitor:vercel -- --once    # One-time check
 *   npm run monitor:vercel -- --help    # Show help
 * 
 * Environment Variables Required:
 *   VERCEL_TOKEN - Your Vercel API token (get from https://vercel.com/account/tokens)
 *   VERCEL_PROJECT_ID - Your Vercel project ID (optional, will auto-detect)
 *   VERCEL_TEAM_ID - Your Vercel team ID (optional, for team projects)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  creator: {
    username: string;
  };
  meta?: {
    githubCommitSha?: string;
    githubCommitRef?: string;
    githubCommitMessage?: string;
  };
  target?: string;
}

interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
  ref?: string;
}

interface VercelBuildLog {
  id: string;
  message: string;
  timestamp: number;
  type: string;
}

class GitVercelMonitor {
  private vercelToken: string;
  private vercelProjectId?: string;
  private vercelTeamId?: string;
  private lastCheckedCommit?: string;
  private stateFile: string;
  private checkInterval: number = 60000; // 60 seconds

  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN || '';
    this.vercelProjectId = process.env.VERCEL_PROJECT_ID || '';
    this.vercelTeamId = process.env.VERCEL_TEAM_ID || '';
    this.stateFile = path.join(__dirname, '.git-vercel-monitor-state.json');

    if (!this.vercelToken) {
      console.error('❌ VERCEL_TOKEN environment variable is required!');
      console.error('Get your token from: https://vercel.com/account/tokens');
      process.exit(1);
    }
  }

  /**
   * Load the last checked commit from state file
   */
  private loadState(): void {
    try {
      if (fs.existsSync(this.stateFile)) {
        const state = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
        this.lastCheckedCommit = state.lastCheckedCommit;
        console.log(`📂 Loaded state: Last checked commit ${this.lastCheckedCommit}`);
      }
    } catch (error) {
      console.warn('⚠️  Could not load state file, starting fresh');
    }
  }

  /**
   * Save the last checked commit to state file
   */
  private saveState(commitHash: string): void {
    try {
      fs.writeFileSync(
        this.stateFile,
        JSON.stringify({ lastCheckedCommit: commitHash, timestamp: new Date().toISOString() }),
        'utf-8'
      );
    } catch (error) {
      console.error('⚠️  Could not save state file:', error);
    }
  }

  /**
   * Get recent git commits
   */
  private async getRecentCommits(limit: number = 10): Promise<GitCommit[]> {
    try {
      const { stdout } = await execAsync(
        `git log -${limit} --pretty=format:"%H|%h|%an|%ai|%s|%D"`
      );

      return stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, shortHash, author, date, message, ref] = line.split('|');
          return { hash, shortHash, author, date, message, ref: ref || undefined };
        });
    } catch (error: any) {
      console.error('❌ Error fetching git commits:', error.message);
      return [];
    }
  }

  /**
   * Get new commits since last check
   */
  private async getNewCommits(): Promise<GitCommit[]> {
    try {
      let command = 'git log --pretty=format:"%H|%h|%an|%ai|%s|%D"';
      
      if (this.lastCheckedCommit) {
        command += ` ${this.lastCheckedCommit}..HEAD`;
      } else {
        command += ' -10'; // Get last 10 if this is the first run
      }

      const { stdout } = await execAsync(command);
      
      if (!stdout.trim()) {
        return [];
      }

      return stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, shortHash, author, date, message, ref] = line.split('|');
          return { hash, shortHash, author, date, message, ref: ref || undefined };
        });
    } catch (error: any) {
      console.error('❌ Error fetching new commits:', error.message);
      return [];
    }
  }

  /**
   * Auto-detect Vercel project ID from vercel.json or .vercel
   */
  private async autoDetectProjectId(): Promise<string | undefined> {
    // Try .vercel/project.json first
    const vercelProjectFile = path.join(process.cwd(), '.vercel', 'project.json');
    if (fs.existsSync(vercelProjectFile)) {
      try {
        const projectData = JSON.parse(fs.readFileSync(vercelProjectFile, 'utf-8'));
        return projectData.projectId;
      } catch (error) {
        // Continue to next method
      }
    }

    // Try to get from Vercel API using project name
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const projectName = packageJson.name;
      
      const projects = await this.fetchVercelProjects();
      const project = projects.find((p: any) => p.name === projectName);
      
      return project?.id;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Fetch Vercel projects
   */
  private async fetchVercelProjects(): Promise<any[]> {
    const teamQuery = this.vercelTeamId ? `?teamId=${this.vercelTeamId}` : '';
    const response = await fetch(`https://api.vercel.com/v9/projects${teamQuery}`, {
      headers: {
        Authorization: `Bearer ${this.vercelToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.projects || [];
  }

  /**
   * Fetch Vercel deployments
   */
  private async fetchVercelDeployments(limit: number = 20): Promise<VercelDeployment[]> {
    if (!this.vercelProjectId) {
      this.vercelProjectId = await this.autoDetectProjectId();
      if (!this.vercelProjectId) {
        console.error('❌ Could not detect Vercel project ID. Please set VERCEL_PROJECT_ID environment variable.');
        return [];
      }
      console.log(`✅ Auto-detected Vercel project ID: ${this.vercelProjectId}`);
    }

    const teamQuery = this.vercelTeamId ? `&teamId=${this.vercelTeamId}` : '';
    const url = `https://api.vercel.com/v6/deployments?projectId=${this.vercelProjectId}&limit=${limit}${teamQuery}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.vercelToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch deployments: ${response.statusText}`);
      }

      const data = await response.json();
      return data.deployments || [];
    } catch (error: any) {
      console.error('❌ Error fetching Vercel deployments:', error.message);
      return [];
    }
  }

  /**
   * Fetch Vercel deployment logs
   */
  private async fetchDeploymentLogs(deploymentId: string): Promise<VercelBuildLog[]> {
    const teamQuery = this.vercelTeamId ? `?teamId=${this.vercelTeamId}` : '';
    const url = `https://api.vercel.com/v2/deployments/${deploymentId}/events${teamQuery}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.vercelToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }

      // Vercel returns NDJSON (newline-delimited JSON)
      const text = await response.text();
      const logs: VercelBuildLog[] = text
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(log => log !== null);

      return logs;
    } catch (error: any) {
      console.error(`❌ Error fetching deployment logs for ${deploymentId}:`, error.message);
      return [];
    }
  }

  /**
   * Match commits with deployments
   */
  private matchCommitsWithDeployments(
    commits: GitCommit[],
    deployments: VercelDeployment[]
  ): Map<string, VercelDeployment> {
    const matches = new Map<string, VercelDeployment>();

    for (const commit of commits) {
      const deployment = deployments.find(
        d => d.meta?.githubCommitSha?.startsWith(commit.shortHash) ||
             d.meta?.githubCommitSha === commit.hash
      );

      if (deployment) {
        matches.set(commit.hash, deployment);
      }
    }

    return matches;
  }

  /**
   * Format and display results
   */
  private async displayResults(commits: GitCommit[], deployments: VercelDeployment[]): Promise<void> {
    const matches = this.matchCommitsWithDeployments(commits, deployments);

    console.log('\n' + '='.repeat(80));
    console.log('📊 GIT PUSH & VERCEL DEPLOYMENT REPORT');
    console.log('='.repeat(80) + '\n');

    if (commits.length === 0) {
      console.log('✅ No new commits found since last check.');
      return;
    }

    console.log(`🔍 Found ${commits.length} new commit(s):\n`);

    for (const commit of commits) {
      console.log(`📝 Commit: ${commit.shortHash}`);
      console.log(`   Author: ${commit.author}`);
      console.log(`   Date: ${commit.date}`);
      console.log(`   Message: ${commit.message}`);

      const deployment = matches.get(commit.hash);

      if (deployment) {
        console.log(`\n   🚀 Vercel Deployment:`);
        console.log(`      Status: ${this.getStatusEmoji(deployment.state)} ${deployment.state.toUpperCase()}`);
        console.log(`      URL: https://${deployment.url}`);
        console.log(`      Deployment ID: ${deployment.uid}`);
        console.log(`      Created: ${new Date(deployment.created).toLocaleString()}`);
        console.log(`      Target: ${deployment.target || 'production'}`);

        // Fetch and display logs
        const logs = await this.fetchDeploymentLogs(deployment.uid);
        
        if (logs.length > 0) {
          console.log(`\n   📋 Recent Logs (last 10):`);
          const recentLogs = logs.slice(-10);
          
          for (const log of recentLogs) {
            const timestamp = new Date(log.timestamp).toLocaleTimeString();
            const icon = this.getLogIcon(log.type);
            console.log(`      ${icon} [${timestamp}] ${log.message}`);
          }

          // Check for errors
          const errors = logs.filter(log => 
            log.type === 'error' || 
            log.message.toLowerCase().includes('error') ||
            log.message.toLowerCase().includes('failed')
          );

          if (errors.length > 0) {
            console.log(`\n   ⚠️  ${errors.length} error(s) found in logs!`);
          }
        }
      } else {
        console.log(`\n   ⏳ Vercel Deployment: Not found or pending...`);
      }

      console.log('\n' + '-'.repeat(80) + '\n');
    }

    // Show recent deployments without matching commits
    const unmatchedDeployments = deployments.filter(
      d => !Array.from(matches.values()).some(m => m.uid === d.uid)
    ).slice(0, 5);

    if (unmatchedDeployments.length > 0) {
      console.log('📦 Recent Vercel Deployments (without local commits):\n');
      for (const deployment of unmatchedDeployments) {
        console.log(`   ${this.getStatusEmoji(deployment.state)} ${deployment.state} - ${deployment.meta?.githubCommitMessage || 'No message'}`);
        console.log(`      URL: https://${deployment.url}`);
        console.log(`      Commit: ${deployment.meta?.githubCommitSha?.substring(0, 7) || 'N/A'}`);
        console.log('');
      }
    }
  }

  /**
   * Get emoji for deployment status
   */
  private getStatusEmoji(state: string): string {
    const statusMap: { [key: string]: string } = {
      'READY': '✅',
      'BUILDING': '🔨',
      'ERROR': '❌',
      'QUEUED': '⏳',
      'CANCELED': '🚫',
      'INITIALIZING': '🔄',
    };
    return statusMap[state.toUpperCase()] || '❓';
  }

  /**
   * Get icon for log type
   */
  private getLogIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️',
      'command': '💻',
      'stdout': '📤',
      'stderr': '📛',
    };
    return iconMap[type] || '📝';
  }

  /**
   * Run a single check
   */
  async runOnce(): Promise<void> {
    console.log('🔍 Checking for new git pushes and Vercel deployments...\n');

    this.loadState();
    const commits = await this.getNewCommits();
    const deployments = await this.fetchVercelDeployments();

    await this.displayResults(commits, deployments);

    // Update state with the latest commit
    if (commits.length > 0) {
      this.saveState(commits[0].hash);
    }
  }

  /**
   * Run continuous monitoring
   */
  async runContinuous(): Promise<void> {
    console.log('🔄 Starting continuous monitoring...');
    console.log(`⏱️  Checking every ${this.checkInterval / 1000} seconds`);
    console.log('Press Ctrl+C to stop\n');

    this.loadState();

    while (true) {
      const commits = await this.getNewCommits();
      
      if (commits.length > 0) {
        const deployments = await this.fetchVercelDeployments();
        await this.displayResults(commits, deployments);
        this.saveState(commits[0].hash);
      } else {
        console.log(`✅ [${new Date().toLocaleTimeString()}] No new commits`);
      }

      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
    }
  }

  /**
   * Show help
   */
  static showHelp(): void {
    console.log(`
Git Push & Vercel Deployment Monitor
=====================================

Usage:
  npm run monitor:vercel              # Continuous monitoring
  npm run monitor:vercel -- --once    # One-time check
  npm run monitor:vercel -- --help    # Show this help

Environment Variables:
  VERCEL_TOKEN        Required - Your Vercel API token
                      Get it from: https://vercel.com/account/tokens
  
  VERCEL_PROJECT_ID   Optional - Your Vercel project ID
                      Will auto-detect if not provided
  
  VERCEL_TEAM_ID      Optional - Your Vercel team ID
                      Required only for team projects

Examples:
  # Export token and run
  export VERCEL_TOKEN="your_token_here"
  npm run monitor:vercel

  # One-time check
  npm run monitor:vercel -- --once

  # With custom project ID
  export VERCEL_PROJECT_ID="prj_xxxxx"
  npm run monitor:vercel
`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    GitVercelMonitor.showHelp();
    process.exit(0);
  }

  const monitor = new GitVercelMonitor();

  if (args.includes('--once')) {
    await monitor.runOnce();
  } else {
    await monitor.runContinuous();
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
