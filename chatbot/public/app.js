// ============================================
// Configuration
// ============================================
const API_BASE = '';
let authToken = localStorage.getItem('authToken');

// ============================================
// State
// ============================================
let currentView = 'overview';
let appointments = [];
let editingAppointment = null;
let deletingAppointment = null;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set current date in header
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    // Check if logged in
    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }

    // Setup event listeners
    setupEventListeners();
});

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation
    document.querySelectorAll('.nav-item, [data-view]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) {
                switchView(view);
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Filters
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => loadAppointments(), 300);
        });
    }

    const filterStatus = document.getElementById('filter-status');
    const filterService = document.getElementById('filter-service');
    const filterDate = document.getElementById('filter-date');

    if (filterStatus) filterStatus.addEventListener('change', loadAppointments);
    if (filterService) filterService.addEventListener('change', loadAppointments);
    if (filterDate) filterDate.addEventListener('change', loadAppointments);

    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterStatus) filterStatus.value = '';
            if (filterService) filterService.value = '';
            if (filterDate) filterDate.value = '';
            loadAppointments();
        });
    }

    // Edit modal
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }

    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    if (modalClose) modalClose.addEventListener('click', closeEditModal);
    if (modalCancel) modalCancel.addEventListener('click', closeEditModal);

    // Delete modal
    const deleteConfirm = document.getElementById('delete-confirm');
    const deleteCancel = document.getElementById('delete-cancel');
    const deleteModalClose = document.getElementById('delete-modal-close');

    if (deleteConfirm) deleteConfirm.addEventListener('click', handleDeleteConfirm);
    if (deleteCancel) deleteCancel.addEventListener('click', closeDeleteModal);
    if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteModal);

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            closeEditModal();
            closeDeleteModal();
        });
    });
}

// ============================================
// Authentication
// ============================================
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');
    const btn = e.target.querySelector('button[type="submit"]');

    // Show loading
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Signing in...';
    errorEl.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and show dashboard
        authToken = data.token;
        localStorage.setItem('authToken', authToken);

        if (data.user?.username) {
            document.getElementById('user-name').textContent = data.user.username;
        }

        showDashboard();
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Sign In';
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    showLogin();
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Load initial data
    loadStats();
    loadAppointments();
}

// ============================================
// Navigation
// ============================================
function switchView(view) {
    currentView = view;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === view);
    });

    // Update page title
    const titles = {
        overview: 'Overview',
        appointments: 'Appointments',
    };
    document.getElementById('page-title').textContent = titles[view] || 'Dashboard';

    // Show/hide views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('hidden', v.id !== `view-${view}`);
    });

    // Close mobile sidebar
    document.querySelector('.sidebar')?.classList.remove('open');

    // Reload data if switching to appointments
    if (view === 'appointments') {
        loadAppointments();
    }
}

// ============================================
// API Helpers
// ============================================
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        handleLogout();
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

// ============================================
// Load Stats
// ============================================
async function loadStats() {
    try {
        const response = await apiRequest('/api/stats');
        const data = await response.json();

        if (response.ok) {
            document.getElementById('stat-today').textContent = data.today || 0;
            document.getElementById('stat-pending').textContent = data.pending || 0;
            document.getElementById('stat-completed').textContent = data.completed || 0;
            document.getElementById('stat-week').textContent = data.thisWeek || 0;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// ============================================
// Load Appointments
// ============================================
async function loadAppointments() {
    const params = new URLSearchParams();

    const search = document.getElementById('search-input')?.value;
    const status = document.getElementById('filter-status')?.value;
    const service = document.getElementById('filter-service')?.value;
    const date = document.getElementById('filter-date')?.value;

    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (service) params.append('service', service);
    if (date) params.append('date', date);

    try {
        const response = await apiRequest(`/api/appointments?${params}`);
        const data = await response.json();

        if (response.ok) {
            appointments = data.appointments || [];
            renderAppointments();

            // Update total count
            const totalCount = document.getElementById('total-count');
            if (totalCount) {
                totalCount.textContent = `${data.total || 0} total`;
            }
        }
    } catch (error) {
        console.error('Failed to load appointments:', error);
        showToast('Failed to load appointments', 'error');
    }
}

// ============================================
// Render Appointments
// ============================================
function renderAppointments() {
    // Render recent appointments (max 5)
    const recentTbody = document.getElementById('recent-tbody');
    if (recentTbody) {
        const recent = appointments.slice(0, 5);
        recentTbody.innerHTML = recent.length ? recent.map(renderRecentRow).join('') :
            '<tr><td colspan="5" class="table-empty">No appointments found</td></tr>';
    }

    // Render all appointments
    const appointmentsTbody = document.getElementById('appointments-tbody');
    if (appointmentsTbody) {
        appointmentsTbody.innerHTML = appointments.length ? appointments.map(renderAppointmentRow).join('') :
            '<tr><td colspan="7" class="table-empty">No appointments found</td></tr>';

        // Add event listeners to action buttons
        appointmentsTbody.querySelectorAll('.action-btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });

        appointmentsTbody.querySelectorAll('.action-btn-delete').forEach(btn => {
            btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
        });
    }
}

function renderRecentRow(appointment) {
    const dateStr = formatDate(appointment.appointmentDate);

    return `
    <tr>
      <td><span class="ref-number">${appointment.referenceNumber}</span></td>
      <td>${escapeHtml(appointment.fullName)}</td>
      <td>${escapeHtml(appointment.service)}</td>
      <td>${dateStr}</td>
      <td><span class="badge badge-${appointment.status}">${appointment.status}</span></td>
    </tr>
  `;
}

function renderAppointmentRow(appointment) {
    const dateStr = formatDate(appointment.appointmentDate);

    return `
    <tr>
      <td><span class="ref-number">${appointment.referenceNumber}</span></td>
      <td>${escapeHtml(appointment.fullName)}</td>
      <td>${escapeHtml(appointment.phoneNumber || '-')}</td>
      <td>${escapeHtml(appointment.service)}</td>
      <td>${dateStr}</td>
      <td><span class="badge badge-${appointment.status}">${appointment.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn-edit" data-id="${appointment._id}">Edit</button>
          <button class="action-btn action-btn-delete" data-id="${appointment._id}">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

// ============================================
// Edit Modal
// ============================================
function openEditModal(id) {
    const appointment = appointments.find(a => a._id === id);
    if (!appointment) return;

    editingAppointment = appointment;

    document.getElementById('edit-id').value = appointment._id;
    document.getElementById('edit-reference').value = appointment.referenceNumber;
    document.getElementById('edit-name').value = appointment.fullName;
    document.getElementById('edit-phone').value = appointment.phoneNumber || '';
    document.getElementById('edit-service').value = appointment.service;
    document.getElementById('edit-status').value = appointment.status;
    document.getElementById('edit-notes').value = appointment.notes || '';

    // Format date for datetime-local input
    const date = new Date(appointment.appointmentDate);
    const dateStr = date.toISOString().slice(0, 16);
    document.getElementById('edit-date').value = dateStr;

    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editingAppointment = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const updates = {
        fullName: document.getElementById('edit-name').value,
        phoneNumber: document.getElementById('edit-phone').value,
        service: document.getElementById('edit-service').value,
        status: document.getElementById('edit-status').value,
        appointmentDate: document.getElementById('edit-date').value,
        notes: document.getElementById('edit-notes').value,
    };

    try {
        const response = await apiRequest(`/api/appointments?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Appointment updated successfully', 'success');
            closeEditModal();
            loadAppointments();
            loadStats();
        } else {
            throw new Error(data.error || 'Failed to update appointment');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ============================================
// Delete Modal
// ============================================
function openDeleteModal(id) {
    const appointment = appointments.find(a => a._id === id);
    if (!appointment) return;

    deletingAppointment = appointment;
    document.getElementById('delete-reference').textContent = appointment.referenceNumber;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    deletingAppointment = null;
}

async function handleDeleteConfirm() {
    if (!deletingAppointment) return;

    const id = deletingAppointment._id;

    try {
        const response = await apiRequest(`/api/appointments?id=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Appointment deleted successfully', 'success');
            closeDeleteModal();
            loadAppointments();
            loadStats();
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete appointment');
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✓' : '✕';

    toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================
// Utilities
// ============================================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
