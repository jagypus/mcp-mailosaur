import MailosaurClient from "mailosaur";

export function createMailosaurClient(apiKey: string): MailosaurClient {
  return new MailosaurClient(apiKey);
}

export function handleMailosaurError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("Authentication")) {
      return "Error: Invalid Mailosaur API key. Check your MAILOSAUR_API_KEY environment variable.";
    }
    if (msg.includes("Not Found")) {
      return "Error: Resource not found. The message or server ID may be invalid.";
    }
    return `Mailosaur API error: ${msg}`;
  }
  return `Unexpected error: ${String(error)}`;
}

export function resolveServerId(
  explicit: string | undefined,
  defaultId: string | undefined
): string {
  const id = explicit || defaultId;
  if (!id) {
    throw new Error(
      "Server ID is required. Either pass serverId as a parameter or set the MAILOSAUR_SERVER_ID environment variable."
    );
  }
  return id;
}
