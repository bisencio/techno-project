if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Simple authentication - in production, use proper hashing and JWT
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminToken = process.env.ADMIN_TOKEN;

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD not set in environment variables');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        if (username !== adminUsername || password !== adminPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return the admin token
        return res.status(200).json({
            success: true,
            token: adminToken,
            user: {
                username: adminUsername,
                role: 'admin',
            },
        });
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
