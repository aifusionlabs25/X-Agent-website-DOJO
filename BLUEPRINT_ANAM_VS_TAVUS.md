# BLUEPRINT: Anam vs. Tavus Architecture

This document breaks down the fundamental differences between the legacy **Tavus** infrastructure and the new **Anam.ai** infrastructure for powering Live Interactive Video Agents on the X Agents platform.

---

## 🆚 1. Core Architectural Differences

The primary shift from Tavus to Anam represents a move from **managed iframes + third-party streaming** to a **native WebRTC SDK + direct engine integration**.

| Feature | Tavus (Legacy) | Anam (Current) |
| :--- | :--- | :--- |
| **Media Delivery** | Injected via Daily.co iFrame | Native `<video>` element via WebRTC |
| **Client Integration** | Standard generic Daily link embedding | Custom `@anam-ai/js-sdk` (Native React hooks/events) |
| **Authentication** | Server generates `conversation_url` | Server generates `sessionToken`, Client initializes SDK |
| **Transcript Access** | Asynchronous Webhooks | Real-time `MessageStreamEvent` via WebSocket |
| **Video UX** | Letterboxed inside iframe | `object-fit: contain/cover` directly controlled by CSS |
| **Latency** | Medium (Multiple network hops + RAG latency) | Low (Direct edge connection + optimized engine) |

---

## 🏗️ 2. The Tavus Flow (How it used to work)

In the Tavus model, the backend did all the heavy lifting to create a "Meeting Room", and the frontend simply loaded an iframe.

1. **User Action:** Clicks "Start Demo".
2. **Server Request:** `POST /api/tavus/route.ts` hits the Tavus API (`api.tavus.io/v2/conversations`).
3. **Payload:** We manually pass `custom_greeting`, `max_call_duration`, `properties`, and `webhook_urls`.
4. **Response:** Tavus returns a `conversation_url` (a link hosted on Daily.co's infrastructure).
5. **Client Render:** A third-party `Daily.co` library loads the URL into an iframe and attempts to negotiate camera/mic permissions inside the iframe sandbox.
6. **Data Flow:** Webhooks handle transcripts _after_ the session ends via an external POST to our `/api/webhook`.

**Pain Points with Tavus:**
- Lack of control over the video window styling.
- Browsers increasingly blocking iframe microphone access.
- Complex and untrustworthy webhook latency for transcripts.

---

## 🚀 3. The Anam Flow (How it works now)

In the Anam model, we control the WebRTC connection natively, giving us exact styling control and real-time data access.

### Step 1: Secure Token Generation
Instead of returning a full video URL, the server simply "blesses" the browser to start a session.
- **Client** calls `/api/anam-token` with the required `personaId`.
- **Server** calls `https://api.anam.ai/v1/auth/session-token` using the secret `ANAM_API_KEY`.
- **Server** returns a temporary JWT `sessionToken` back to the browser.

### Step 2: Native SDK Initialization
The browser takes over using the Anam Native SDK.
- **Client** initializes `@anam-ai/js-sdk` using the `sessionToken`.
- **WebRTC Binding:** The SDK directly attaches the video stream to our own local React element: `await anamClient.streamToVideoElement('persona-video');`.

### Step 3: Real-Time Event Bus
Because the connection is native, we have full access to real-time events that Tavus locked away.
```typescript
anamClient.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (event) => {
    // We get every single word spoken by the User OR the Agent in real-time.
    console.log(event.role, event.content);
});
```
This is how we currently build the transcript live in browser memory (`transcriptRef.current.push(...)`), completely bypassing the need for asynchronous webhooks to get the conversation text.

### Step 4: Graceful Teardown
When the session ends (`AnamEvent.CONNECTION_CLOSED`), the browser automatically POSTs the final compiled transcript array to our own `/api/save-transcript` route, ensuring 100% data capture reliability without relying on a third-party server retrying a webhook.

---

## ⚙️ 4. Persona Configuration Shift

### Tavus Codebase Configuration
Under Tavus, we often had to hardcode overrides directly in our `route.ts` API calls because their dashboard was unreliable. We would manually pass:
- `custom_greeting` to force the agent to speak first.
- `document_retrieval_strategy` to enforce latency rules.

### Anam Dashboard Configuration
Under Anam, **ALL behavioral configurations belong in the Anam Dashboard (`studio.anam.ai`).** 
- We do **not** configure system prompts, greetings, or patience levels in our codebase.
- The only data our application is aware of is the `personaId` used to link the player to the dashboard configuration. 
- If an agent's behavior needs changing, it must be edited inside the Anam Studio interface.

---

## 🎯 5. Summary of Improvements

1. **Zero Webhooks Needed:** Transcripts are captured natively in the browser and saved synchronously on disconnect.
2. **True Fullscreen:** Video is native. CSS filters, gradients, and custom play buttons can overlay flawlessly over the agent.
3. **No iFrame Security Blocks:** Microphone permissions are requested natively by the top-level domain (`xagent.aifusionlabs.app`), resulting in higher connection success rates and no strict browser sandbox blocking.
