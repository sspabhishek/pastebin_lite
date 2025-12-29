# Pastebin Lite

A simple, secure, and ephemeral pastebin application built with **React (Vite)**, **Tailwind CSS**, and **Vercel Serverless Functions**.

Live URL: [Insert Deployed URL Here]

## Features

- **Create Pastes**: Share arbitrary text.
- **Constraints**:
  - **TTL (Time-to-Live)**: Auto-expirys pastes after a set duration.
  - **Max Views**: Burns the paste after a specific number of views.
- **Secure Handling**: Safe rendering of content.
- **Deterministic Testing**: Supports test mode for verified testing.

## Persistence Layer

This project uses **Redis** (via **Vercel KV**) for persistence.
- **Choice**: Redis is ideal for this use case because of its high performance, native support for key expiration (TTL), and atomic operations (`HINCRBY`) which are critical for accurate view counting concurrency.
- **Implementation**: We use Hash structures to store paste content, metadata, and view counters atomically.

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- Vercel CLI (`npm i -g vercel`)
- A Vercel project with KV Storage enabled (or a local Redis URL).

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd pastebin-lite
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file (or let Vercel pull it) with:
   ```
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   ```
   *If using Vercel CLI linked to a project, `vercel env pull` works best.*

4. **Run Development Server**:
   Since the app uses Vercel Serverless Functions for the backend, use the Vercel CLI to replicate the environment:
   ```bash
   vercel dev
   ```
   This will start the frontend (Vite) and the backend API at `http://localhost:3000`.

## Testing

The application supports deterministic testing via headers:
- `x-test-now-ms`: Overrides the server time for TTL checks (requires `TEST_MODE=1`).
"# pastebin_lite" 
