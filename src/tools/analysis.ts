import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import MailosaurClient from "mailosaur";
import { z } from "zod";
import { handleMailosaurError } from "../client.js";

export function registerAnalysisTools(
  server: McpServer,
  client: MailosaurClient
): void {
  server.tool(
    "check_spam",
    "Run SpamAssassin analysis on a message. Returns spam score, rules triggered, and pass/fail result. Useful for debugging why emails land in spam.",
    {
      messageId: z.string().describe("The message ID to analyze"),
    },
    async ({ messageId }) => {
      try {
        const result = await client.analysis.spam(messageId);
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
    "check_deliverability",
    "Run deliverability analysis on a message. Returns SPF, DKIM, DMARC results, blocklist status, content analysis, and DNS records.",
    {
      messageId: z.string().describe("The message ID to analyze"),
    },
    async ({ messageId }) => {
      try {
        const result = await client.analysis.deliverability(messageId);
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
