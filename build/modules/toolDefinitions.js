/**
 * Minimal Tool Definition Module for Hermes-focused Trilium workflows
 */
export function createWriteTools() {
    return [
        {
            name: "move_note",
            description: "Move a note to a new parent.",
            inputSchema: {
                type: "object",
                properties: {
                    noteId: { type: "string" },
                    newParentNoteId: { type: "string" },
                    branchId: { type: "string" }
                },
                required: ["noteId", "newParentNoteId"]
            }
        },
        {
            name: "sync_subtree_content",
            description: "Recursively sync content from a source subtree into a target subtree by matching child notes with the same title.",
            inputSchema: {
                type: "object",
                properties: {
                    sourceRootNoteId: { type: "string" },
                    targetRootNoteId: { type: "string" },
                    dryRun: { type: "boolean", default: false },
                    recursive: { type: "boolean", default: true },
                    matchBy: { type: "string", enum: ["title"], default: "title" },
                    overwriteTitles: { type: "boolean", default: false },
                    createRevision: { type: "boolean", default: true },
                    skipMissingTargets: { type: "boolean", default: true }
                },
                required: ["sourceRootNoteId", "targetRootNoteId"]
            }
        }
    ];
}
export function createReadTools() {
    return [
        {
            name: "resolve_note_id",
            description: "Resolve a note title/name to its note ID.",
            inputSchema: {
                type: "object",
                properties: {
                    noteName: { type: "string" },
                    exactMatch: { type: "boolean", default: false },
                    maxResults: { type: "number", default: 10, minimum: 1, maximum: 10 },
                    autoSelect: { type: "boolean", default: false }
                },
                required: ["noteName"]
            }
        },
        {
            name: "get_note",
            description: "Get a note by ID, including blobId/contentHash and optional content.",
            inputSchema: {
                type: "object",
                properties: {
                    noteId: { type: "string" },
                    includeContent: { type: "boolean", default: true },
                    includeBinaryContent: { type: "boolean", default: false },
                    searchPattern: { type: "string" },
                    useRegex: { type: "boolean", default: true },
                    searchFlags: { type: "string", default: "gi" }
                },
                required: ["noteId"]
            }
        },
        {
            name: "list_children_notes",
            description: "List direct child notes of a parent note.",
            inputSchema: {
                type: "object",
                properties: {
                    noteId: { type: "string" }
                },
                required: ["noteId"]
            }
        },
        {
            name: "search_notes",
            description: "Search notes by keyword or structured criteria.",
            inputSchema: {
                type: "object",
                properties: {
                    text: { type: "string" },
                    searchCriteria: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                property: { type: "string" },
                                type: { type: "string", enum: ["label", "relation", "noteProperty"] },
                                op: { type: "string", enum: ["exists", "not_exists", "=", "!=", ">=", "<=", ">", "<", "contains", "starts_with", "ends_with", "regex"], default: "exists" },
                                value: { type: "string" },
                                logic: { type: "string", enum: ["AND", "OR"], default: "AND" }
                            },
                            required: ["property", "type"]
                        }
                    },
                    limit: { type: "number" }
                }
            }
        }
    ];
}
export function generateTools(permissionChecker) {
    const tools = [];
    if (permissionChecker.hasPermission("WRITE")) tools.push(...createWriteTools());
    if (permissionChecker.hasPermission("READ")) tools.push(...createReadTools());
    return tools;
}
