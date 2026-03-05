import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import MailosaurClient from "mailosaur";
import { z } from "zod";
import { handleMailosaurError } from "../client.js";

export function registerServerTools(
  server: McpServer,
  client: MailosaurClient
): void {
  server.tool(
    "list_servers",
    "List all Mailosaur servers (inboxes). Use this to find server IDs.",
    {},
    async () => {
      try {
        const result = await client.servers.list();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleMailosaurError(error) }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "get_server",
    "Get details of a specific Mailosaur server, including name, message count, and configuration.",
    {
      serverId: z.string().describe("The server ID to retrieve"),
    },
    async ({ serverId }) => {
      try {
        const result = await client.servers.get(serverId);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: handleMailosaurError(error) }],
          isError: true,
        };
      }
    }
  );
}
