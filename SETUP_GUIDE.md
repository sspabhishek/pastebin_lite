# Vercel KV (Redis) Setup Guide

This project uses **Vercel KV**, a serverless Redis solution, to store paste data. Follow these steps to set it up.

## Option 1: Using the Vercel Dashboard (Recommended)

1.  **Deploy the Project**:
    - Push your code to a Git repository (GitHub, GitLab, Bitbucket).
    - Import the project in the [Vercel Dashboard](https://vercel.com/new).
    - Deploy it (the initial build might fail or work but the app won't function without the DB).

2.  **Create a KV Database**:
    - Go to your Project in the Vercel Dashboard.
    - Click on the **Storage** tab.
    - Click **Create Database**.
    - Select **KV** (Redis).
    - Give it a name (e.g., `pastebin-lite-db`) and select a region (use the same region as your Functions if possible, e.g., US East).
    - Click **Create**.

3.  **Connect to Project**:
    - Once created, Vercel effectively links the environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) to your project deployment automatically.
    - **Redeploy** your application (Deployment -> Redeploy) so the new environment variables take effect.

## Option 2: Running Locally

To run the app locally with the real Vercel KV database:

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Link Project**:
    - In your project root (`c:\Users\abhis\OneDrive\Desktop\Agnitha`), run:
    ```bash
    vercel link
    ```
    - Follow the prompts to select the project you just created in the dashboard.

4.  **Pull Environment Variables**:
    - This downloads the `KV_*` secrets to a local `.env.development.local` file (or similar, Vercel handles this internally with `vercel dev`).
    ```bash
    vercel env pull .env.development.local
    ```

5.  **Run Development Server**:
    Use `vercel dev` instead of `npm run dev` to automatically load these Vercel-specific variables.
    ```bash
    vercel dev
    ```

## Option 3: Manual / Other Redis

If you prefer to use a different Redis provider (like Upstash directly or a local Redis):

1.  **Get Credentials**: You need the **REST API URL** and **Token** (assuming you use the `@vercel/kv` client which wraps Upstash).
    - *Note*: `@vercel/kv` is designed for HTTP-based Redis (Upstash). If you have a standard TCP Redis URL (e.g., `redis://localhost:6379`), you might need to use a different client library like `ioredis`, OR ensure you are using a compatible HTTP proxy.
    
    **For standard Redis (TCP)**:
    - If you want to use a local Redis instance without HTTP, you would need to change `api/lib/redis.js` to use `ioredis` instead of `@vercel/kv`.

    **Sticking to `@vercel/kv`**:
    - The easiest path is using Vercel KV or Upstash directly.
    - If using Upstash directly, copying `UPSTASH_REDIS_REST_URL` to `KV_REST_API_URL` and `UPSTASH_REDIS_REST_TOKEN` to `KV_REST_API_TOKEN` in your `.env` file works perfectly.

## Verification

To verify it's working:
1.  Run `vercel dev`.
2.  Go to `http://localhost:3000`.
3.  Create a Paste.
4.  If successful, the setup is correct!
