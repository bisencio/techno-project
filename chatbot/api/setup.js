if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}

import { setupMessengerProfile } from './lib/messenger.js';

export default async function handler(req, res) {
    // Only allow POST or GET for setup
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result = await setupMessengerProfile();

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Messenger profile setup complete'
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Setup error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
