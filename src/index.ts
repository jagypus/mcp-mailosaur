#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main() {
  const apiKey = process.env.MAILOSAUR_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: MAILOSAUR_API_KEY environment variable is required.\n" +
        "Get your API key from https://mailosaur.com/app/account/api-access"
    );
    process.exit(1);
  }

  const defaultServerId = process.env.MAILOSAUR_SERVER_ID;
  const server = createServer(apiKey, defaultServerId);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("mcp-mailosaur server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
