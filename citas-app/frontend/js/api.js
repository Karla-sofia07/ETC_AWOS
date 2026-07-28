// Ajusta esta URL según dónde levantes tu backend Laravel
const API_BASE_URL = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

function setSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "index.html";
  }
}

/**
 * Wrapper genérico de fetch hacia la API.
 * Agrega automáticamente el token si existe y maneja errores comunes.
 */
async function apiRequest(endpoint, { method = "GET", body = null } = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (response.status === 401) {
    clearSession();
    window.location.href = "index.html";
    return null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Ocurrió un error en la solicitud.");
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

function mostrarAlerta(contenedorId, mensaje, tipo = "danger") {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function mostrarErroresValidacion(contenedorId, errores) {
  if (!errores) return;
  const mensajes = Object.values(errores).flat().join("<br>");
  mostrarAlerta(contenedorId, mensajes, "danger");
}
