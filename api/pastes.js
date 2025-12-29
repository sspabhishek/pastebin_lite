import { kv } from './lib/redis.js';
import { customAlphabet } from 'nanoid';
import { nowMs } from './lib/utils.js';

// Use a URL-safe alphabet for IDs
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { content, ttl_seconds, max_views } = req.body;

        // Validation
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
        }

        const paste = {
            content,
            created_at: nowMs(req),
            views: 0,
        };

        if (ttl_seconds !== undefined && ttl_seconds !== null) {
            const ttl = Number(ttl_seconds);
            if (!Number.isInteger(ttl) || ttl < 1) {
                return res.status(400).json({ error: 'ttl_seconds must be an integer >= 1' });
            }
            paste.ttl = ttl;
            // Store expires_at for strict deterministic testing
            paste.expires_at = nowMs(req) + (ttl * 1000);
        }

        if (max_views !== undefined && max_views !== null) {
            const views = Number(max_views);
            if (!Number.isInteger(views) || views < 1) {
                return res.status(400).json({ error: 'max_views must be an integer >= 1' });
            }
            paste.max_views = views;
        }

        const id = nanoid();
        const key = `paste:${id}`;

        // Save to Redis
        await kv.hset(key, paste);

        // If TTL is set, also set Redis expiry for auto-cleanup
        if (paste.ttl) {
            await kv.expire(key, paste.ttl);
        }

        // Return success
        // In strict architecture, we might not know the absolute URL yet, 
        // but the prompt example returns a full URL. We'll construct it based on headers or relative.
        // However, usually just ID is fine or relative /p/{id}.
        // Prompt asks for "url": "https://your-app.vercel.app/p/<id>"
        // We can try to infer host.
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers['host'];
        const url = `${protocol}://${host}/p/${id}`;

        return res.status(200).json({ id, url });
    } catch (error) {
        console.error('Create Paste Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
