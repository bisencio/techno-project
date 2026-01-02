if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}

import {
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from './lib/models.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Simple auth check - in production, use proper JWT validation
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        switch (req.method) {
            case 'GET':
                return await handleGet(req, res);
            case 'PATCH':
                return await handlePatch(req, res);
            case 'DELETE':
                return await handleDelete(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGet(req, res) {
    const { id, status, service, date, dateFrom, dateTo, search, limit, skip } = req.query;

    // Get single appointment by ID
    if (id) {
        const appointment = await getAppointmentById(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        return res.status(200).json({ appointment });
    }

    // Get list of appointments with filters
    const filters = {
        status,
        service,
        date,
        dateFrom,
        dateTo,
        search,
        limit: parseInt(limit) || 100,
        skip: parseInt(skip) || 0,
    };

    const result = await getAppointments(filters);
    return res.status(200).json(result);
}

async function handlePatch(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
    }

    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
    }

    const appointment = await updateAppointment(id, updates, 'admin');

    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.status(200).json({ success: true, appointment });
}

async function handleDelete(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Appointment ID is required' });
    }

    const deleted = await deleteAppointment(id);

    if (!deleted) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.status(200).json({ success: true });
}
