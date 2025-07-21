// /assets/js/public-appointments.js  →  v2.0  (notifications-first)

import { showNotification } from '/assets/js/notifications.js';

const API_BASE = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://www.domingueztechsolutions.com';

const SITE_KEY = 'domtech';
const token = localStorage.getItem('adminToken') || null;

/* ---------- Small inline helper for on-page status text ---------- */
function showResponse(message, success = true) {
  const box = document.getElementById('response-message');
  if (!box) return;
  box.textContent = message;
  box.style.color = success ? '#10b981' : '#ef4444';
  box.style.fontWeight = '600';
  setTimeout(() => (box.textContent = ''), 4000);
}

/* ---------- Fetch & render appointments ---------- */
async function fetchAppointments() {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `${API_BASE}/api/appointments?site=${SITE_KEY}`,
      { method: 'GET', headers }
    );

    const data = await res.json();
    const container = document.getElementById('appointments-container');
    container.innerHTML = '';

    if (!res.ok) {
      const errMsg = data?.error || 'Error loading appointments.';
      showResponse(errMsg, false);
      showNotification(`❌ ${errMsg}`, 'error');
      return;
    }

    if (!data.length) {
      container.innerHTML = '<p>No appointments found.</p>';
      return;
    }

    data.forEach((appt) => {
      const card = document.createElement('div');
      card.className = 'appointment-card';
      card.innerHTML = `
        <h3>${appt.name}</h3>
        <p><strong>Phone:</strong> ${appt.phone}</p>
        <p><strong>Email:</strong> ${appt.email || '—'}</p>
        <p><strong>Service:</strong> ${appt.service}</p>
        <p><strong>Message:</strong> ${appt.message || '—'}</p>
        <p><small>Submitted: ${new Date(appt.created_at).toLocaleString()}</small></p>
      `;

      /* admin-only delete button */
      if (token) {
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = '🗑️ Delete';
        delBtn.onclick = () => deleteAppointment(appt.id);
        card.appendChild(delBtn);
      }

      container.appendChild(card);
    });

    showNotification('✅ Appointments loaded.', 'success');
  } catch (err) {
    showResponse('Network error loading appointments.', false);
    showNotification(`❌ ${err.message}`, 'error');
  }
}

/* ---------- Delete appointment (admin only) ---------- */
async function deleteAppointment(id) {
  try {
    const res = await fetch(
      `${API_BASE}/api/appointments/${id}?site=${SITE_KEY}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.error || 'Error deleting appointment.';
      showResponse(msg, false);
      showNotification(`❌ ${msg}`, 'error');
      return;
    }

    showResponse('Appointment deleted successfully.', true);
    showNotification('✅ Appointment deleted.', 'success');
    fetchAppointments(); // refresh list
  } catch (err) {
    showResponse('Network error deleting appointment.', false);
    showNotification(`❌ ${err.message}`, 'error');
  }
}

/* ---------- Kick-off ---------- */
document.addEventListener('DOMContentLoaded', fetchAppointments);