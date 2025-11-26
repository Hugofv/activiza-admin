# MCP (Model Context Protocol) Setup Guide

This guide explains how to configure MCP to help AI assistants work with both the web-admin and API projects.

## What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI assistants to understand and work with your codebase more effectively by providing structured access to project resources and context.

## Current Setup

The `mcp.json` file in the web-admin directory provides basic MCP configuration. However, for a more robust setup, you should configure MCP at the Cursor/IDE level.

## Recommended MCP Configuration

### Option 1: Cursor Settings (Recommended)

Add the following to your Cursor settings (`.cursorrules` or workspace settings):

```json
{
  "mcp": {
    "servers": {
      "web-admin": {
        "type": "filesystem",
        "path": "/Volumes/Dev/ativiza/web-admin"
      },
      "api": {
        "type": "filesystem",
        "path": "/Volumes/Dev/ativiza/api"
      }
    }
  }
}
```

### Option 2: Workspace Configuration

Create a `.cursor/workspace.json` file in the root directory (`/Volumes/Dev/ativiza/`):

```json
{
  "mcp": {
    "resources": [
      {
        "name": "web-admin",
        "type": "filesystem",
        "path": "./web-admin",
        "description": "React/TypeScript admin dashboard frontend"
      },
      {
        "name": "api",
        "type": "filesystem",
        "path": "./api",
        "description": "Node.js/Express API backend with Prisma"
      }
    ]
  }
}
```

## Benefits of MCP Integration

1. **Cross-Project Understanding**: AI assistants can understand both frontend and backend code
2. **Better Context**: When working on API integration, the AI can reference both projects
3. **Accurate Suggestions**: More accurate code suggestions based on actual API endpoints
4. **Type Safety**: Better understanding of data flow between frontend and backend

## Using MCP with AI Assistants

When MCP is properly configured, you can ask questions like:

- "How does the login flow work between the frontend and API?"
- "What endpoints are available for clients?"
- "Create a service for the payments endpoint"
- "Update the frontend to match the new API response structure"

The AI will have access to both codebases and can provide more accurate answers.

## Verification

To verify MCP is working:

1. Ask the AI assistant about code in the API project while in the web-admin project
2. The AI should be able to reference both projects
3. Check that the AI understands the relationship between frontend services and backend endpoints

## Troubleshooting

If MCP isn't working:

1. **Check Paths**: Ensure the paths in your MCP configuration are correct
2. **Restart Cursor**: Sometimes a restart is needed for MCP changes to take effect
3. **Check Permissions**: Ensure the AI assistant has read access to both project directories
4. **Verify Configuration**: Check that your MCP configuration file is in the correct location

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Cursor MCP Guide](https://cursor.sh/docs/mcp)

