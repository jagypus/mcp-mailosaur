# mcp-mailosaur

MCP server for [Mailosaur](https://mailosaur.com) email testing. Debug Playwright and other e2e test failures involving email with AI agents in VS Code, Claude Desktop, and other MCP clients.

## Quick Start

```bash
MAILOSAUR_API_KEY=your-key npx mcp-mailosaur
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MAILOSAUR_API_KEY` | Yes | Your Mailosaur API key ([get one here](https://mailosaur.com/app/account/api-access)) |
| `MAILOSAUR_SERVER_ID` | No | Default server ID — saves you from specifying it on every tool call |

### VS Code (Claude Code / Copilot)

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "mailosaur": {
      "command": "npx",
      "args": ["-y", "mcp-mailosaur"],
      "env": {
        "MAILOSAUR_API_KEY": "your-api-key",
        "MAILOSAUR_SERVER_ID": "your-server-id"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "mailosaur": {
      "command": "npx",
      "args": ["-y", "mcp-mailosaur"],
      "env": {
        "MAILOSAUR_API_KEY": "your-api-key",
        "MAILOSAUR_SERVER_ID": "your-server-id"
      }
    }
  }
}
```

## Available Tools

### Messages

| Tool | Description |
|------|-------------|
| `list_messages` | List messages in a server with pagination and optional `receivedAfter` filter |
| `get_message` | Get full message details by ID — HTML body, text body, headers, attachments |
| `search_messages` | Search for messages by sender, recipient, subject, or body text. Waits for matches with configurable timeout. |

### Servers

| Tool | Description |
|------|-------------|
| `list_servers` | List all Mailosaur servers to find server IDs |
| `get_server` | Get server details including name and message count |

### Analysis

| Tool | Description |
|------|-------------|
| `check_spam` | Run SpamAssassin analysis — score, triggered rules, pass/fail |
| `check_deliverability` | Check SPF, DKIM, DMARC, blocklists, and DNS records |

## Example Debugging Workflows

**"My e2e test says the verification email wasn't received"**

Ask your AI agent to search for the email:
> Search Mailosaur for emails sent to test-user@yourserver.mailosaur.net in the last 10 minutes

**"The email is being sent but might be landing in spam"**

> Check the spam score for message ID xxx

**"I want to verify the email content is correct"**

> Get the full details of the latest message in my Mailosaur inbox

## Development

```bash
git clone https://github.com/jagypus/mcp-mailosaur.git
cd mcp-mailosaur
npm install --ignore-scripts
npm run build
```

Test locally:

```bash
MAILOSAUR_API_KEY=your-key node dist/index.js
```

## License

MIT
