# Figma Code Connect Setup Guide

This guide will walk you through setting up Figma Code Connect for this project.

## What is Figma Code Connect?

Figma Code Connect creates a bridge between your Figma designs and your codebase. When developers use Figma's Dev Mode, they'll see actual code snippets from your repository instead of generic generated code.

## Prerequisites

1. **Figma Account**: You need a Figma Organization or Enterprise plan
2. **Figma Personal Access Token**: Required for CLI authentication
3. **Design File**: Your Figma design system file with components

## Step-by-Step Setup

### Step 1: Get Your Figma Personal Access Token

1. Go to [Figma Settings > Personal Access Tokens](https://www.figma.com/settings)
2. Click "Create new token"
3. Name it (e.g., "Code Connect - SPSV Landing Page")
4. Select these scopes:
   - ✅ **Code Connect** (write)
   - ✅ **File content** (read)
5. Copy the token (you won't see it again!)

### Step 2: Install Figma Code Connect CLI

The CLI is already included in `package.json`. After running `npm install`, you can use:

```bash
npx figma connect
```

Or install globally:

```bash
npm install -g @figma/code-connect
```

### Step 3: Run Initial Setup

```bash
npx figma connect --token=YOUR_FIGMA_TOKEN
```

The interactive setup will ask you:

1. **Component directory**: Enter `./src/components`
2. **Figma file URL**: Paste your Figma design file URL
   - Format: `https://www.figma.com/design/FILE_KEY/File-Name`
   - You can find this in your Figma file's share menu
3. **Output directory**: Already set to `./src/figma` (from `figma.config.json`)

### Step 4: Map Your Components

The CLI will scan your components and help you map them to Figma components:

**Available Components in This Project:**
- `Button` - Located in `src/components/Button.tsx`
- `Input` - Located in `src/components/Input.tsx`
- `Hero` - Located in `src/components/Hero.tsx`
- `Form` - Located in `src/components/Form.tsx`
- `TrustBadge` - Located in `src/components/TrustBadge.tsx`

For each component, the CLI will:
1. Show you the component code
2. Ask you to select the matching Figma component
3. Help you map props to Figma component properties

### Step 5: Review Configuration

Your `figma.config.json` is already configured with:

```json
{
  "parser": "react",
  "include": ["src/components/**/*.tsx"],
  "exclude": ["**/*.test.tsx", "node_modules/**"],
  "output": "src/figma",
  "componentImport": {
    "from": "@/components"
  }
}
```

This means:
- ✅ React components are automatically detected
- ✅ All `.tsx` files in `src/components` are included
- ✅ Test files are excluded
- ✅ Mappings are saved to `src/figma/`

### Step 6: Publish Your Mappings

After mapping your components, publish them to Figma:

```bash
npm run figma:publish
# or
npx figma connect publish --token=YOUR_FIGMA_TOKEN
```

This uploads your component mappings to Figma so they appear in Dev Mode.

## Using Code Connect in Figma

### For Designers

1. Open your design file in Figma
2. Switch to **Dev Mode** (top right)
3. Select any component that's been mapped
4. You'll see:
   - Real code snippets from your codebase
   - Component props and usage examples
   - Import statements

### For Developers

1. When viewing designs in Dev Mode, you'll see actual code
2. Copy code snippets directly from Figma
3. Components match your codebase exactly
4. No more guessing or manual translation!

## Updating Mappings

When you update components in your code:

1. Make your code changes
2. Run `npm run figma:publish` to sync changes
3. Changes appear in Figma Dev Mode automatically

## Troubleshooting

### "Token not found" error
- Make sure you're using the correct token
- Verify token has Code Connect (write) scope

### "Component not found" error
- Check that your Figma file URL is correct
- Ensure the component exists in your Figma file
- Verify component names match (case-sensitive)

### Mappings not appearing in Figma
- Run `npm run figma:publish` again
- Check that you're in Dev Mode (not Design Mode)
- Refresh Figma

### Components not detected
- Verify components are in `src/components/`
- Check that files have `.tsx` extension
- Ensure components are exported correctly

## Best Practices

1. **Keep mappings updated**: Run `figma:publish` after code changes
2. **Use consistent naming**: Match Figma component names to code component names
3. **Document props**: Add JSDoc comments to help with mapping
4. **Version control**: Commit `src/figma/` directory to Git
5. **Team communication**: Share token securely (use environment variables)

## Environment Variables (Optional)

For better security, you can store your token in an environment variable:

```bash
# .env.local (not committed to Git)
FIGMA_TOKEN=your_token_here
```

Then use it:

```bash
npx figma connect publish --token=$FIGMA_TOKEN
```

## Next Steps

1. ✅ Set up your Figma design file
2. ✅ Run the initial setup
3. ✅ Map all components
4. ✅ Publish mappings
5. ✅ Test in Figma Dev Mode
6. ✅ Share with your team!

## Resources

- [Figma Code Connect Docs](https://www.figma.com/code-connect-docs/)
- [Code Connect CLI Reference](https://www.figma.com/code-connect-docs/cli/)
- [Figma Dev Mode Guide](https://help.figma.com/hc/en-us/articles/360055204533)
