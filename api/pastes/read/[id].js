import { kv } from '../../../lib/redis.js';
import { nowMs } from '../../../lib/utils.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    try {
        const key = `paste:${id}`;
        const paste = await kv.hgetall(key);

        if (!paste) {
            return res.status(404).json({ error: 'Paste not found' });
        }

        const now = nowMs(req);

        // Check Time Expiry
        if (paste.expires_at) {
            if (now > Number(paste.expires_at)) {
                return res.status(404).json({ error: 'Paste expired' });
            }
        }

        // Check View Limit
        // For read-only (UI view), we technically allow viewing if it's not YET deleted/expired.
        // However, if the public API would return 404, we should arguably also return 404 here 
        // to strictly enforce the "unavailable" state.
        // BUT the requirement says: "If max_views = 1: first API fetch -> 200, second -> 404".
        // Visiting the URL to view the paste generally consumes a view if it's a "burn after reading" style.
        // The strict prompt requirement said: "Visiting /p/:id returns HTML containing the content".
        // And "Fetch a paste (API) ... counts as a view".
        // It implies visiting the UI MIGHT NOT count as a view if the prompt distinguishes "API fetch" vs "Visit URL".
        // Wait, the prompt says: "Paste with max_views = 1: first API fetch -> 200...".
        // It doesn't explicitly say UI visit DOES count, but usually for "burn after reading" it should.
        // However, the *User Correction* step explicitly said:
        // "HTML View Must NOT Increment Views. API fetch increments views. HTML page render does NOT."
        // So I must NOT increment here.

        // BUT, should I hide it if the limit is reached?
        // "Available" means not expired and not exceeded.
        // If views >= max_views, it is effectively unavailable.
        if (paste.max_views) {
            const maxViews = Number(paste.max_views);
            const currentViews = Number(paste.views || 0);

            if (currentViews >= maxViews) {
                return res.status(404).json({ error: 'View limit exceeded' });
            }
        }

        // NO Increment here.

        return res.status(200).json({
            content: paste.content,
            created_at: paste.created_at, // useful for UI
            views: paste.views
        });

    } catch (error) {
        console.error('Read Paste Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
