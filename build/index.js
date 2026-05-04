#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
// Import modular components
import { generateTools } from "./modules/toolDefinitions.js";
import { handleGetNoteRequest, handleListChildrenNotesRequest, handleMoveNoteRequest, handleSyncSubtreeContentRequest } from "./modules/noteHandler.js";
import { handleSearchNotesRequest } from "./modules/searchHandler.js";
import { handleResolveNoteRequest } from "./modules/resolveHandler.js";
const TRILIUM_API_URL = process.env.TRILIUM_API_URL;
const TRILIUM_API_TOKEN = process.env.TRILIUM_API_TOKEN;
const PERMISSIONS = process.env.PERMISSIONS || "READ;WRITE";
if (!TRILIUM_API_TOKEN) {
    throw new Error("TRILIUM_API_TOKEN environment variable is required");
}
class TriliumServer {
    server;
    axiosInstance;
    allowedPermissions;
    constructor() {
        this.allowedPermissions = PERMISSIONS.split(';');
        this.server = new Server({
            name: "triliumnext-mcp",
            version: "0.3.17",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.axiosInstance = axios.create({
            baseURL: TRILIUM_API_URL,
            headers: {
                Authorization: TRILIUM_API_TOKEN
            }
        });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    hasPermission(permission) {
        return this.allowedPermissions.includes(permission);
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            // Generate standard tools based on permissions
            const tools = generateTools(this);
            return { tools };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            if (!request.params.arguments) {
                throw new McpError(ErrorCode.InvalidParams, "Arguments are required");
            }
            try {
                switch (request.params.name) {
                    case "get_note":
                        return await handleGetNoteRequest(request.params.arguments, this.axiosInstance, this);
                    case "list_children_notes":
                        return await handleListChildrenNotesRequest(request.params.arguments, this.axiosInstance, this);
                    case "move_note":
                        return await handleMoveNoteRequest(request.params.arguments, this.axiosInstance, this);
                    case "sync_subtree_content":
                        return await handleSyncSubtreeContentRequest(request.params.arguments, this.axiosInstance, this);
                    case "search_notes":
                        return await handleSearchNotesRequest(request.params.arguments, this.axiosInstance, this);
                    case "resolve_note_id":
                        return await handleResolveNoteRequest(request.params.arguments, this, this.axiosInstance);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new McpError(ErrorCode.InternalError, `TriliumNext API error: ${error.response?.data?.message || error.message}`);
                }
                throw error;
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("TriliumNext MCP server running on stdio");
    }
}
const server = new TriliumServer();
server.run().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
// Export helper functions for external use
export { buildNoteParams } from './utils/noteBuilder.js';
