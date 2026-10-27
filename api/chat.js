const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_LENGTH = 12000;
const DEFAULT_ALLOWED_ORIGINS = ["https://tummamadhu143-ai.github.io"];

function getAllowedOrigins() {
  const configured = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;
  const origins = new Set(configured);
  if (process.env.VERCEL_URL) origins.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    origins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  return origins;
}

function sendError(response, status, message) {
  return response.status(status).json({ error: message });
}

module.exports = async function handler(request, response) {
  const origin = request.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  response.setHeader("Vary", "Origin");
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Max-Age", "86400");
  } else if (origin) {
    return sendError(response, 403, "This website is not allowed to use the AI assistant.");
  }

  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return sendError(response, 405, "Use POST to send a chat message.");
  }
  if (!process.env.OPENAI_API_KEY) {
    return sendError(response, 503, "The AI service is not configured. Set the OPENAI_API_KEY server environment variable.");
  }

  let body = request.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return sendError(response, 400, "The request body must be valid JSON.");
    }
  }

  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return sendError(response, 400, `Send between 1 and ${MAX_MESSAGES} chat messages.`);
  }

  let totalLength = 0;
  for (const message of messages) {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return sendError(response, 400, "Each message must contain a supported role and text of at most 4000 characters.");
    }
    totalLength += message.content.length;
  }
  if (totalLength > MAX_TOTAL_LENGTH) {
    return sendError(response, 400, "The conversation is too long. Start a new conversation and try again.");
  }
  if (messages[messages.length - 1].role !== "user") {
    return sendError(response, 400, "The last chat message must be from the user.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful, clear study assistant for a university student. Answer questions across topics, explain concepts accessibly, and be honest when you are uncertain."
          },
          ...messages
        ],
        max_completion_tokens: 1200
      }),
      signal: controller.signal
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return sendError(response, 429, "The AI service is busy or its usage limit has been reached. Please try again later.");
      }
      if (upstream.status === 401 || upstream.status === 403) {
        return sendError(response, 503, "The AI service credentials are invalid or do not have access. Check the server configuration.");
      }
      return sendError(response, 502, "The AI service could not complete the request. Please try again.");
    }

    const result = await upstream.json();
    const reply = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return sendError(response, 502, "The AI service returned an empty response. Please try again.");
    }
    return response.status(200).json({ reply: reply.trim() });
  } catch (error) {
    if (error.name === "AbortError") {
      return sendError(response, 504, "The AI service took too long to respond. Please try again.");
    }
    console.error("AI chat request failed:", error.message);
    return sendError(response, 502, "Could not reach the AI service. Check the backend connection and try again.");
  } finally {
    clearTimeout(timeout);
  }
};
