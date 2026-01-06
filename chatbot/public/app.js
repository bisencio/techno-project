const API_BASE = '';

let authToken = localStorage.getItem('authToken');
let savedUserName = localStorage.getItem('userName') || 'Admin';

let currentView = 'overview';
let appointments = [];
let editingAppointment = null;
let deletingAppointment = null;

let activeModal = null;
let lastFocusedEl = null;

document.addEventListener('DOMContentLoaded', () => {
    applyInitialTheme();
    updateHeaderDate();
    setUserName(savedUserName);

    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }

    setupEventListeners();
});

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) togglePassword.addEventListener('click', handleTogglePassword);

    document.querySelectorAll('[data-view]').forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) switchView(view);
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
        document.addEventListener('click', (e) => {
            if (window.matchMedia('(max-width: 1024px)').matches) {
                const clickedInside = sidebar.contains(e.target) || menuToggle.contains(e.target);
                if (!clickedInside) {
                    sidebar.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => loadAppointments(), 250);
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

    const editForm = document.getElementById('edit-form');
    if (editForm) editForm.addEventListener('submit', handleEditSubmit);

    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    if (modalClose) modalClose.addEventListener('click', closeEditModal);
    if (modalCancel) modalCancel.addEventListener('click', closeEditModal);

    const deleteConfirm = document.getElementById('delete-confirm');
    const deleteCancel = document.getElementById('delete-cancel');
    const deleteModalClose = document.getElementById('delete-modal-close');

    if (deleteConfirm) deleteConfirm.addEventListener('click', handleDeleteConfirm);
    if (deleteCancel) deleteCancel.addEventListener('click', closeDeleteModal);
    if (deleteModalClose) deleteModalClose.addEventListener('click', closeDeleteModal);

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-close');
            if (type === 'edit') closeEditModal();
            if (type === 'delete') closeDeleteModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (activeModal === 'edit') closeEditModal();
            if (activeModal === 'delete') closeDeleteModal();
        }
        if (e.key === 'Tab') {
            trapFocus(e);
        }
    });
}

function updateHeaderDate() {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;

    dateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function setUserName(name) {
    const el = document.getElementById('user-name');
    if (el) el.textContent = name || 'Admin';
}

function handleTogglePassword() {
    const input = document.getElementById('password');
    const btn = document.getElementById('toggle-password');
    if (!input || !btn) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    btn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
    // Update the SVG icon
    btn.innerHTML = isPassword
        ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
             <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
        : `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
             <circle cx="12" cy="12" r="3"/>
           </svg>`;
    input.focus();
}

function showLogin() {
    document.getElementById('login-screen')?.classList.remove('hidden');
    document.getElementById('dashboard')?.classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');

    setUserName(localStorage.getItem('userName') || savedUserName);
    updateGreeting();
    loadStats();
    loadAppointments();
}

// Time-based greeting
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';

    const subtitle = document.getElementById('header-subtitle');
    const userName = localStorage.getItem('userName') || 'Admin';
    if (subtitle) {
        subtitle.innerHTML = `${greeting}, <strong>${escapeHtml(userName)}</strong>! 👋`;
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username')?.value?.trim();
    const password = document.getElementById('password')?.value ?? '';
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-submit');

    if (!username || !password) {
        if (errorEl) {
            errorEl.textContent = 'Please enter your username and password.';
            errorEl.classList.remove('hidden');
        }
        return;
    }

    setButtonLoading(btn, true, 'Signing in...');
    if (errorEl) errorEl.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await safeJson(response);

        if (!response.ok) {
            throw new Error(data?.error || 'Login failed');
        }

        authToken = data.token;
        localStorage.setItem('authToken', authToken);

        const name = data?.user?.username || username;
        localStorage.setItem('userName', name);
        savedUserName = name;
        setUserName(name);

        showDashboard();
        showToast('Signed in successfully', 'success');
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        }
        showToast('Sign in failed', 'error');
    } finally {
        setButtonLoading(btn, false, 'Sign In');
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    appointments = [];
    currentView = 'overview';
    showLogin();
}

function switchView(view) {
    currentView = view;

    document.querySelectorAll('.nav-item').forEach((item) => {
        const isActive = item.dataset.view === view;
        item.classList.toggle('active', isActive);
        if (isActive) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
    });

    const titles = { overview: 'Overview', appointments: 'Appointments' };
    document.getElementById('page-title').textContent = titles[view] || 'Dashboard';

    const subtitle = document.getElementById('header-subtitle');
    if (subtitle) {
        subtitle.textContent = view === 'appointments' ? 'Search, filter, and manage records' : 'Manage appointments efficiently';
    }

    document.querySelectorAll('.view').forEach((v) => {
        v.classList.toggle('hidden', v.id !== `view-${view}`);
    });

    document.querySelector('.sidebar')?.classList.remove('open');
    document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');

    if (view === 'appointments') loadAppointments();
}

async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (authToken) headers.Authorization = `Bearer ${authToken}`;

    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
        handleLogout();
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

async function loadStats() {
    setStatsLoading(true);
    try {
        const response = await apiRequest('/api/stats');
        const data = await safeJson(response);

        if (response.ok) {
            animateCounter('stat-today', data.today || 0);
            animateCounter('stat-pending', data.pending || 0);
            animateCounter('stat-completed', data.completed || 0);
            animateCounter('stat-week', data.thisWeek || 0);
        } else {
            showToast(data?.error || 'Failed to load stats', 'error');
        }
    } catch (error) {
        console.error(error);
    } finally {
        setStatsLoading(false);
    }
}

// Animated counter function
function animateCounter(elementId, targetValue, duration = 800) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const target = parseInt(targetValue, 10) || 0;
    if (target === 0) {
        el.textContent = '0';
        return;
    }

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (target - startValue) * easeOut);

        el.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

async function loadAppointments() {
    const params = new URLSearchParams();

    const search = document.getElementById('search-input')?.value?.trim();
    const status = document.getElementById('filter-status')?.value;
    const service = document.getElementById('filter-service')?.value;
    const date = document.getElementById('filter-date')?.value;

    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (service) params.append('service', service);
    if (date) params.append('date', date);

    setTablesLoading(true);

    try {
        const response = await apiRequest(`/api/appointments?${params.toString()}`);
        const data = await safeJson(response);

        if (response.ok) {
            appointments = Array.isArray(data.appointments) ? data.appointments : [];
            renderAppointments();

            const totalCount = document.getElementById('total-count');
            if (totalCount) totalCount.textContent = `${data.total || 0} total`;
        } else {
            showToast(data?.error || 'Failed to load appointments', 'error');
            appointments = [];
            renderAppointments();
        }
    } catch (error) {
        console.error(error);
        showToast('Failed to load appointments', 'error');
        appointments = [];
        renderAppointments();
    } finally {
        setTablesLoading(false);
    }
}

function renderAppointments() {
    const recentTbody = document.getElementById('recent-tbody');
    if (recentTbody) {
        const recent = [...appointments]
            .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
            .slice(0, 5);

        recentTbody.innerHTML = recent.length
            ? recent.map(renderRecentRow).join('')
            : '<tr><td colspan="5" class="table-empty">No appointments found</td></tr>';
    }

    const appointmentsTbody = document.getElementById('appointments-tbody');
    if (appointmentsTbody) {
        appointmentsTbody.innerHTML = appointments.length
            ? appointments.map(renderAppointmentRow).join('')
            : '<tr><td colspan="7" class="table-empty">No appointments found</td></tr>';

        appointmentsTbody.querySelectorAll('.action-btn-edit').forEach((btn) => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });

        appointmentsTbody.querySelectorAll('.action-btn-delete').forEach((btn) => {
            btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
        });
    }
}

function renderRecentRow(appointment) {
    const dateStr = formatDate(appointment.appointmentDate);
    const status = normalizeStatus(appointment.status);

    return `
    <tr>
      <td><span class="ref-number">${escapeHtml(appointment.referenceNumber || '')}</span></td>
      <td>${escapeHtml(appointment.fullName || '')}</td>
      <td>${escapeHtml(appointment.service || '')}</td>
      <td>${escapeHtml(dateStr)}</td>
      <td>${renderStatusBadge(status)}</td>
    </tr>
  `;
}

function renderAppointmentRow(appointment) {
    const dateStr = formatDate(appointment.appointmentDate);
    const status = normalizeStatus(appointment.status);
    const id = escapeHtml(appointment._id || '');

    return `
    <tr>
      <td><span class="ref-number">${escapeHtml(appointment.referenceNumber || '')}</span></td>
      <td>${escapeHtml(appointment.fullName || '')}</td>
      <td>${escapeHtml(appointment.phoneNumber || '-')}</td>
      <td>${escapeHtml(appointment.service || '')}</td>
      <td>${escapeHtml(dateStr)}</td>
      <td>${renderStatusBadge(status)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn-edit" type="button" data-id="${id}" aria-label="Edit appointment ${escapeHtml(appointment.referenceNumber || '')}">Edit</button>
          <button class="action-btn action-btn-delete" type="button" data-id="${id}" aria-label="Delete appointment ${escapeHtml(appointment.referenceNumber || '')}">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

function openEditModal(id) {
    const appointment = appointments.find((a) => a._id === id);
    if (!appointment) return;

    editingAppointment = appointment;

    document.getElementById('edit-id').value = appointment._id || '';
    document.getElementById('edit-reference').value = appointment.referenceNumber || '';
    document.getElementById('edit-name').value = appointment.fullName || '';
    document.getElementById('edit-phone').value = appointment.phoneNumber || '';
    document.getElementById('edit-service').value = appointment.service || 'Barangay Clearance';
    document.getElementById('edit-status').value = normalizeStatus(appointment.status);
    document.getElementById('edit-notes').value = appointment.notes || '';

    const d = new Date(appointment.appointmentDate);
    document.getElementById('edit-date').value = toLocalDatetimeValue(d);

    openModal('edit-modal', '#edit-name');
}

function closeEditModal() {
    closeModal('edit-modal');
    editingAppointment = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const btn = document.getElementById('edit-save');

    const localValue = document.getElementById('edit-date').value;
    const isoDate = localDatetimeToIso(localValue);

    const updates = {
        fullName: document.getElementById('edit-name').value.trim(),
        phoneNumber: document.getElementById('edit-phone').value.trim(),
        service: document.getElementById('edit-service').value,
        status: normalizeStatus(document.getElementById('edit-status').value),
        appointmentDate: isoDate,
        notes: document.getElementById('edit-notes').value,
    };

    setButtonLoading(btn, true, 'Saving...');
    try {
        const response = await apiRequest(`/api/appointments?id=${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });

        const data = await safeJson(response);

        if (response.ok) {
            showToast('Appointment updated successfully', 'success');
            closeEditModal();
            await loadAppointments();
            await loadStats();
        } else {
            throw new Error(data?.error || 'Failed to update appointment');
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(btn, false, 'Save Changes');
    }
}

function openDeleteModal(id) {
    const appointment = appointments.find((a) => a._id === id);
    if (!appointment) return;

    deletingAppointment = appointment;
    document.getElementById('delete-reference').textContent = appointment.referenceNumber || '';
    openModal('delete-modal', '#delete-confirm');
}

function closeDeleteModal() {
    closeModal('delete-modal');
    deletingAppointment = null;
}

async function handleDeleteConfirm() {
    if (!deletingAppointment) return;

    const id = deletingAppointment._id;
    const btn = document.getElementById('delete-confirm');

    setButtonLoading(btn, true, 'Deleting...');
    try {
        const response = await apiRequest(`/api/appointments?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });

        const data = await safeJson(response);

        if (response.ok) {
            showToast('Appointment deleted successfully', 'success');
            closeDeleteModal();
            await loadAppointments();
            await loadStats();
        } else {
            throw new Error(data?.error || 'Failed to delete appointment');
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setButtonLoading(btn, false, 'Delete');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const icon = type === 'success' ? '✓' : '✕';

    toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" type="button" aria-label="Dismiss">×</button>
  `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());

    container.appendChild(toast);

    const timer = setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 220);
    }, 4200);

    toast.addEventListener('mouseenter', () => clearTimeout(timer));
}

function renderStatusBadge(status) {
    const s = normalizeStatus(status);
    const label = s.charAt(0).toUpperCase() + s.slice(1);
    return `<span class="badge badge-${s}"><span class="badge-dot" aria-hidden="true"></span>${escapeHtml(label)}</span>`;
}

function normalizeStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'pending' || s === 'confirmed' || s === 'completed' || s === 'cancelled') return s;
    return 'pending';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function toLocalDatetimeValue(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function localDatetimeToIso(value) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

async function safeJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function setTablesLoading(isLoading) {
    const recentTbody = document.getElementById('recent-tbody');
    const apptTbody = document.getElementById('appointments-tbody');

    if (isLoading) {
        if (recentTbody) recentTbody.innerHTML = skeletonRows(5, 5);
        if (apptTbody) apptTbody.innerHTML = skeletonRows(6, 7);
    }
}

function setStatsLoading(isLoading) {
    const ids = ['stat-today', 'stat-pending', 'stat-completed', 'stat-week'];
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('skeleton-text', isLoading);
        if (isLoading) el.textContent = '—';
    });
}

function skeletonRows(rows, cols) {
    const cells = (count) =>
        Array.from({ length: count })
            .map(() => `<td><div class="skeleton-line"></div></td>`)
            .join('');
    return Array.from({ length: rows })
        .map(() => `<tr class="skeleton-row">${cells(cols)}</tr>`)
        .join('');
}

function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    const textEl = btn.querySelector('.btn-text');
    const loaderEl = btn.querySelector('.btn-loader');

    btn.disabled = isLoading;

    if (textEl && typeof text === 'string') textEl.textContent = text;
    if (loaderEl) loaderEl.classList.toggle('hidden', !isLoading);
}

function openModal(id, focusSelector) {
    const el = document.getElementById(id);
    if (!el) return;

    lastFocusedEl = document.activeElement;
    el.classList.remove('hidden');
    document.body.classList.add('no-scroll');

    activeModal = id === 'edit-modal' ? 'edit' : id === 'delete-modal' ? 'delete' : null;

    const focusEl = focusSelector ? el.querySelector(focusSelector) : null;
    setTimeout(() => (focusEl ? focusEl.focus() : el.querySelector('button, input, select, textarea')?.focus()), 0);
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.add('hidden');
    document.body.classList.remove('no-scroll');

    activeModal = null;

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
    }
    lastFocusedEl = null;
}

function trapFocus(e) {
    if (!activeModal) return;

    const modalEl = activeModal === 'edit' ? document.getElementById('edit-modal') : document.getElementById('delete-modal');
    if (!modalEl || modalEl.classList.contains('hidden')) return;

    const focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusables).filter((n) => !n.disabled && n.offsetParent !== null);
    if (!list.length) return;

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function applyInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeIcon(saved);
        return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    showToast(`Theme: ${next === 'dark' ? 'Dark' : 'Light'} mode`, 'success');
}

function updateThemeIcon(theme) {
    const iconEl = document.getElementById('theme-icon');
    if (!iconEl) return;

    if (theme === 'dark') {
        // Moon icon
        iconEl.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        `;
    } else {
        // Sun icon
        iconEl.innerHTML = `
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `;
    }
}