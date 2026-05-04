/**
 * Search Handler Module
 * Centralized request handling for search operations
 */
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { handleSearchNotes } from "./searchManager.js";
/**
 * Handle search_notes tool requests
 */
export async function handleSearchNotesRequest(args, axiosInstance, permissionChecker) {
    if (!permissionChecker.hasPermission("READ")) {
        throw new McpError(ErrorCode.InvalidRequest, "Permission denied: Not authorized to search notes.");
    }
    try {
        const searchOperation = {
            text: args.text,
            searchCriteria: args.searchCriteria,
            limit: args.limit
        };
        const result = await handleSearchNotes(searchOperation, axiosInstance);
        const resultsText = JSON.stringify(result.results, null, 2);
        return {
            content: [{
                    type: "text",
                    text: `${result.debugInfo || ''}${resultsText}`
                }]
        };
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(ErrorCode.InvalidParams, error instanceof Error ? error.message : String(error));
    }
}
