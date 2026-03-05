import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMailosaurClient } from "./client.js";
import { registerMessageTools } from "./tools/messages.js";
import { registerAnalysisTools } from "./tools/analysis.js";

export function createServer(
  apiKey: string,
  defaultServerId?: string
): McpServer {
  const server = new McpServer({
    name: "mcp-mailosaur",
    version: "0.1.0",
  });

  const client = createMailosaurClient(apiKey);

  registerMessageTools(server, client, defaultServerId);
  registerAnalysisTools(server, client);

  return server;
}
