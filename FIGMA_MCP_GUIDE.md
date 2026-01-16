# Using Figma MCP Tools for Code Connect

Since you have the Figma MCP connected, we can set up Code Connect directly through the MCP tools instead of (or in addition to) the CLI.

## Available MCP Tools

The Figma MCP provides these tools for Code Connect:

1. **`mcp_Figma_add_code_connect_map`** - Map a Figma component to a code component
2. **`mcp_Figma_get_code_connect_map`** - Get existing mappings
3. **`mcp_Figma_get_design_context`** - Get design context and code from Figma
4. **`mcp_Figma_get_metadata`** - Get component structure from Figma

## How to Map Components Using MCP

### Step 1: Get Your Figma File Information

You need:
- **File Key**: Extract from your Figma file URL
  - URL format: `https://www.figma.com/design/FILE_KEY/File-Name`
  - Example: If URL is `https://www.figma.com/design/abc123/SPSV-Landing`, fileKey is `abc123`

- **Node ID**: The component ID in Figma
  - Select a component in Figma
  - Look at the URL: `?node-id=123:456` → nodeId is `123:456`
  - Or use the MCP tools to find it

### Step 2: Map Components

For each component, we'll use `mcp_Figma_add_code_connect_map` with:

```typescript
{
  nodeId: "123:456",           // Figma component node ID
  fileKey: "abc123",            // Your Figma file key
  source: "src/components/Button.tsx",  // Path to component
  componentName: "Button",      // Component name
  label: "React"                // Framework
}
```

## Components Ready to Map

Here are the components we've created that can be mapped:

1. **Button** → `src/components/Button.tsx`
2. **Input** → `src/components/Input.tsx`
3. **Hero** → `src/components/Hero.tsx`
4. **Form** → `src/components/Form.tsx`
5. **TrustBadge** → `src/components/TrustBadge.tsx`

## Quick Start

**Option 1: I can help you map components**
- Share your Figma file URL
- I'll extract the file key and help you find node IDs
- I'll create the mappings for you

**Option 2: You provide the information**
- Share your Figma file URL
- Select each component in Figma and share the node IDs
- I'll map them all at once

**Option 3: Use MCP to explore first**
- I can use `mcp_Figma_get_metadata` to see your Figma file structure
- Then we map components based on what we find

## Example Workflow

1. **Get file structure:**
   ```
   mcp_Figma_get_metadata(fileKey="abc123", nodeId="0:1")
   ```

2. **Map a component:**
   ```
   mcp_Figma_add_code_connect_map(
     nodeId="123:456",
     fileKey="abc123",
     source="src/components/Button.tsx",
     componentName="Button",
     label="React"
   )
   ```

3. **Verify mapping:**
   ```
   mcp_Figma_get_code_connect_map(fileKey="abc123", nodeId="123:456")
   ```

## Next Steps

Share your Figma file URL and I'll help you:
1. Extract the file key
2. Find component node IDs
3. Map all components to your code
4. Verify the mappings

Or if you prefer, I can guide you through using the MCP tools yourself!
