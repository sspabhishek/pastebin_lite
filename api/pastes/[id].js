import { kv } from '../lib/redis.js';
import { nowMs } from '../lib/utils.js';

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
        if (paste.max_views) {
            const maxViews = Number(paste.max_views);
            const currentViews = Number(paste.views || 0);

            if (currentViews >= maxViews) {
                return res.status(404).json({ error: 'View limit exceeded' });
            }
        }

        // Atomic Increment
        // We only increment if constraints are passed.
        await kv.hincrby(key, 'views', 1);

        // Prepare response
        const response = {
            content: paste.content,
            remaining_views: null,
            expires_at: null,
        };

        if (paste.max_views) {
            // We just incremented, so remaining is max - (current + 1)
            const maxViews = Number(paste.max_views);
            const currentViews = Number(paste.views || 0) + 1; // +1 because we effectively just viewed it
            response.remaining_views = Math.max(0, maxViews - currentViews);
        }

        if (paste.expires_at) {
            response.expires_at = new Date(Number(paste.expires_at)).toISOString();
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('Get Paste Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
