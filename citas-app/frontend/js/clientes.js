requireAuth();

const usuario = getUser();
document.getElementById("nombreUsuario").textContent = `${usuario.name} (${usuario.role})`;

if (usuario.role !== "admin") {
  // Esta sección es solo para administradores
  window.location.href = "agenda.html";
}

async function cargarClientes(filtro = "") {
  try {
    const query = filtro ? `?buscar=${encodeURIComponent(filtro)}` : "";
    const clientes = await apiRequest(`/clientes${query}`);
    const tbody = document.getElementById("tablaClientes");

    if (clientes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Sin resultados.</td></tr>`;
      return;
    }

    tbody.innerHTML = clientes
      .map(
        (c) => `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="verHistorial(${c.id}, '${c.name.replace(/'/g, "")}')">Historial</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

function badgeEstado(estado) {
  return `<span class="badge badge-estado-${estado}">${estado}</span>`;
}

async function verHistorial(clienteId, nombre) {
  try {
    const citas = await apiRequest(`/clientes/${clienteId}/historial`);
    const wrapper = document.getElementById("historialWrapper");

    if (citas.length === 0) {
      wrapper.innerHTML = `<p class="text-muted">${nombre} aún no tiene citas registradas.</p>`;
      return;
    }

    wrapper.innerHTML = `
      <h6 class="mb-3">Historial de ${nombre}</h6>
      <div class="table-responsive">
        <table class="table table-sm bg-white">
          <thead class="table-light"><tr><th>Fecha</th><th>Hora</th><th>Servicio</th><th>Estado</th></tr></thead>
          <tbody>
            ${citas
              .map(
                (c) => `<tr>
                  <td>${c.fecha}</td>
                  <td>${c.hora.substring(0, 5)}</td>
                  <td>${c.servicio?.nombre ?? "-"}</td>
                  <td>${badgeEstado(c.estado)}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

let timeoutBusqueda;
document.getElementById("buscar").addEventListener("input", (e) => {
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => cargarClientes(e.target.value), 300);
});

cargarClientes();
