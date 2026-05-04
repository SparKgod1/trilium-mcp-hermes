# triliumnext-mcp-minimal

A minimized TriliumNext MCP server variant for Hermes workflows.

## Included tools
- `resolve_note_id`
- `get_note`
- `list_children_notes`
- `search_notes`
- `move_note`
- `sync_subtree_content`

## Why this fork exists
- Reduces exposed MCP tool/schema size for better compatibility with Hermes MCP loading.
- Keeps the note-organization workflow tools while removing unrelated write/attribute tools.

## Run
```bash
export TRILIUM_API_URL=http://127.0.0.1:37840/etapi
export TRILIUM_API_TOKEN=your_token
export PERMISSIONS="READ;WRITE"
node build/index.js
```

## Notes
- This repo is derived from a local optimized copy of `triliumnext-mcp` version `0.3.17`.
- Current package metadata still uses the upstream package name unless you want me to rename it.
