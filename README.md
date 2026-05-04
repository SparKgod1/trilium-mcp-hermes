# trilium-mcp-hermes

A compact, Hermes-optimized TriliumNext MCP server.

## Included tools
- `resolve_note_id`
- `get_note`
- `list_children_notes`
- `search_notes`
- `move_note`
- `sync_subtree_content`

## Why this fork exists
- Smaller MCP tool surface for better Hermes compatibility.
- Keeps the note-workflow tools needed for Trilium organization.

## Run
```bash
export TRILIUM_API_URL=http://127.0.0.1:37840/etapi
export TRILIUM_API_TOKEN=your_token
export PERMISSIONS="READ;WRITE"
node build/index.js
```

## Notes
- Derived from `triliumnext-mcp` `0.3.17`.
- Package/bin names now match the repository branding.
