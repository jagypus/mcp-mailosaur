import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import MailosaurClient from "mailosaur";
import { z } from "zod";
import { handleMailosaurError, resolveServerId } from "../client.js";

export function registerMessageTools(
  server: McpServer,
  client: MailosaurClient,
  defaultServerId?: string
): void {
  server.tool(
    "list_messages",
    "List messages in a Mailosaur server/inbox. Returns message summaries (not full content). Use get_message for full details.",
    {
      serverId: z
        .string()
        .optional()
        .describe(
          "Server/inbox ID. Falls back to MAILOSAUR_SERVER_ID env var."
        ),
      page: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Page index (0-based). Default: 0"),
      itemsPerPage: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Items per page. Default: 20"),
      receivedAfter: z
        .string()
        .optional()
        .describe(
          "ISO 8601 date. Only return messages received after this time."
        ),
      dir: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("Sort direction. Default: DESC (newest first)"),
    },
    async (params) => {
      try {
        const sid = resolveServerId(params.serverId, defaultServerId);
        const result = await client.messages.list(sid, {
          page: params.page ?? 0,
          itemsPerPage: params.itemsPerPage ?? 20,
          receivedAfter: params.receivedAfter
            ? new Date(params.receivedAfter)
            : undefined,
          dir: params.dir,
        });
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
    "get_message",
    "Get full message details by ID, including HTML body, text body, headers, attachments metadata, and processing results.",
    {
      messageId: z.string().describe("The message ID to retrieve"),
    },
    async ({ messageId }) => {
      try {
        const message = await client.messages.getById(messageId);
        return {
          content: [{ type: "text", text: JSON.stringify(message, null, 2) }],
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
    "search_messages",
    "Search for messages matching criteria. Can wait for a matching message to arrive (with configurable timeout). Useful for finding emails sent during e2e tests.",
    {
      serverId: z
        .string()
        .optional()
        .describe(
          "Server/inbox ID. Falls back to MAILOSAUR_SERVER_ID env var."
        ),
      sentTo: z
        .string()
        .optional()
        .describe("Email address the message was sent to"),
      sentFrom: z
        .string()
        .optional()
        .describe("Email address the message was sent from"),
      subject: z
        .string()
        .optional()
        .describe("Text to search for in the subject line"),
      body: z
        .string()
        .optional()
        .describe("Text to search for in the message body"),
      match: z
        .enum(["ALL", "ANY"])
        .optional()
        .describe(
          "Match mode: ALL criteria must match (default) or ANY criterion"
        ),
      timeout: z
        .number()
        .int()
        .optional()
        .describe(
          "Timeout in ms to wait for a matching message. Default: 10000 (10s). Set to 0 for instant search."
        ),
      receivedAfter: z
        .string()
        .optional()
        .describe(
          "ISO 8601 date. Only search messages received after this time."
        ),
      page: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Page index (0-based). Default: 0"),
      itemsPerPage: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Items per page. Default: 20"),
    },
    async (params) => {
      try {
        const sid = resolveServerId(params.serverId, defaultServerId);
        const criteria = {
          sentTo: params.sentTo,
          sentFrom: params.sentFrom,
          subject: params.subject,
          body: params.body,
          match: params.match,
        };
        const result = await client.messages.search(sid, criteria, {
          timeout: params.timeout ?? 10000,
          receivedAfter: params.receivedAfter
            ? new Date(params.receivedAfter)
            : undefined,
          page: params.page ?? 0,
          itemsPerPage: params.itemsPerPage ?? 20,
          errorOnTimeout: false,
        });
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
