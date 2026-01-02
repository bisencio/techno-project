import { connectToDatabase } from './mongodb.js';
import { ObjectId } from 'mongodb';

// ============================================
// APPOINTMENTS
// ============================================

export async function createAppointment(appointmentData) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    // Generate reference number
    const referenceNumber = await generateReferenceNumber();

    const appointment = {
        referenceNumber,
        senderId: appointmentData.senderId,
        service: appointmentData.service,
        appointmentDate: new Date(appointmentData.appointmentDate),
        fullName: appointmentData.fullName,
        phoneNumber: appointmentData.phoneNumber,
        status: 'pending',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
    };

    const result = await collection.insertOne(appointment);
    return { ...appointment, _id: result.insertedId };
}

export async function getAppointments(filters = {}) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.service) {
        query.service = filters.service;
    }

    if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);
        query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
    }

    if (filters.dateFrom && filters.dateTo) {
        query.appointmentDate = {
            $gte: new Date(filters.dateFrom),
            $lte: new Date(filters.dateTo),
        };
    }

    if (filters.search) {
        query.$or = [
            { fullName: { $regex: filters.search, $options: 'i' } },
            { referenceNumber: { $regex: filters.search, $options: 'i' } },
            { phoneNumber: { $regex: filters.search, $options: 'i' } },
        ];
    }

    const appointments = await collection
        .find(query)
        .sort({ appointmentDate: -1 })
        .limit(filters.limit || 100)
        .skip(filters.skip || 0)
        .toArray();

    const total = await collection.countDocuments(query);

    return { appointments, total };
}

export async function getAppointmentById(id) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    return await collection.findOne({ _id: new ObjectId(id) });
}

export async function getAppointmentByReference(referenceNumber) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    return await collection.findOne({ referenceNumber });
}

export async function getAppointmentsBySenderId(senderId, limit = 5) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    return await collection
        .find({ senderId })
        .sort({ appointmentDate: -1 })
        .limit(limit)
        .toArray();
}

export async function updateAppointment(id, updates, updatedBy = 'admin') {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    const allowedUpdates = ['service', 'appointmentDate', 'fullName', 'phoneNumber', 'status', 'notes'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
            filteredUpdates[key] = key === 'appointmentDate' ? new Date(updates[key]) : updates[key];
        }
    }

    filteredUpdates.updatedAt = new Date();
    filteredUpdates.updatedBy = updatedBy;

    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: filteredUpdates },
        { returnDocument: 'after' }
    );

    return result;
}

export async function deleteAppointment(id) {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}

async function generateReferenceNumber() {
    const { db } = await connectToDatabase();
    const collection = db.collection('counters');

    const year = new Date().getFullYear();
    const counterId = `appointments_${year}`;

    const result = await collection.findOneAndUpdate(
        { _id: counterId },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
    );

    const seq = result.seq.toString().padStart(5, '0');
    return `BRY-${year}-${seq}`;
}

// ============================================
// USER SESSIONS
// ============================================

const SESSION_EXPIRY_MINUTES = 30;

export async function getSession(senderId) {
    const { db } = await connectToDatabase();
    const collection = db.collection('sessions');

    const session = await collection.findOne({ senderId });

    // Check if session is expired (older than 30 minutes)
    if (session && session.lastUpdated) {
        const now = new Date();
        const lastUpdated = new Date(session.lastUpdated);
        const minutesElapsed = (now - lastUpdated) / (1000 * 60);

        if (minutesElapsed > SESSION_EXPIRY_MINUTES) {
            // Session expired, clear it
            await collection.deleteOne({ senderId });
            return null;
        }
    }

    return session;
}

export async function updateSession(senderId, updates) {
    const { db } = await connectToDatabase();
    const collection = db.collection('sessions');

    const result = await collection.findOneAndUpdate(
        { senderId },
        {
            $set: {
                ...updates,
                lastUpdated: new Date()
            }
        },
        { upsert: true, returnDocument: 'after' }
    );

    return result;
}

export async function clearSession(senderId) {
    const { db } = await connectToDatabase();
    const collection = db.collection('sessions');

    await collection.deleteOne({ senderId });
}

// ============================================
// STATISTICS
// ============================================

export async function getStats() {
    const { db } = await connectToDatabase();
    const collection = db.collection('appointments');

    const now = new Date();

    // Start of today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // End of today
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const [today, pending, completed, thisWeek, total] = await Promise.all([
        collection.countDocuments({
            appointmentDate: { $gte: startOfToday, $lte: endOfToday }
        }),
        collection.countDocuments({ status: 'pending' }),
        collection.countDocuments({ status: 'completed' }),
        collection.countDocuments({
            appointmentDate: { $gte: startOfWeek, $lte: endOfWeek }
        }),
        collection.countDocuments({}),
    ]);

    return { today, pending, completed, thisWeek, total };
}

// ============================================
// ADMIN AUTHENTICATION
// ============================================

export async function getAdminByUsername(username) {
    const { db } = await connectToDatabase();
    const collection = db.collection('admins');

    return await collection.findOne({ username });
}

export async function createAdmin(username, passwordHash, role = 'admin') {
    const { db } = await connectToDatabase();
    const collection = db.collection('admins');

    const admin = {
        username,
        passwordHash,
        role,
        createdAt: new Date(),
    };

    const result = await collection.insertOne(admin);
    return { ...admin, _id: result.insertedId };
}

// ============================================
// SERVICES CONFIGURATION
// ============================================

export const SERVICES = [
    {
        id: 'clearance',
        name: 'Barangay Clearance',
        icon: '📄',
        window: 'Window 1',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/1001/1001022.png'
    },
    {
        id: 'id',
        name: 'Barangay ID',
        icon: '🪪',
        window: 'Window 2',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/6530/6530181.png'
    },
    {
        id: 'health',
        name: 'Health Appointment',
        icon: '🏥',
        window: 'Window 3',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png'
    },
    {
        id: 'indigency',
        name: 'Certificate of Indigency',
        icon: '📋',
        window: 'Window 4',
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/4812/4812244.png'
    },
];

export function getServiceById(serviceId) {
    return SERVICES.find(s => s.id === serviceId);
}

export function getServiceByName(serviceName) {
    return SERVICES.find(s =>
        s.name.toLowerCase() === serviceName.toLowerCase() ||
        s.name.toLowerCase().includes(serviceName.toLowerCase())
    );
}
