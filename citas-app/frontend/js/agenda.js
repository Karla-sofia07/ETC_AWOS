requireAuth();

const usuario = getUser();
document.getElementById("nombreUsuario").textContent = `${usuario.name} (${usuario.role})`;

if (usuario.role === "admin") {
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.remove("d-none"));
}

let servicios = [];

async function cargarServicios() {
  servicios = await apiRequest("/servicios?solo_activos=true");
  const select = document.getElementById("servicioId");
  select.innerHTML = servicios
    .map((s) => `<option value="${s.id}">${s.nombre} (${s.duracion_minutos} min - $${s.precio})</option>`)
    .join("");
}

function badgeEstado(estado) {
  return `<span class="badge badge-estado-${estado}">${estado}</span>`;
}

async function cargarCitas() {
  const fecha = document.getElementById("filtroFecha").value;
  const query = fecha ? `?fecha=${fecha}` : "";

  try {
    const citas = await apiRequest(`/citas${query}`);
    const tbody = document.getElementById("tablaCitas");

    if (citas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay citas registradas.</td></tr>`;
      return;
    }

    tbody.innerHTML = citas
      .map(
        (c) => `
      <tr>
        <td>${c.fecha}</td>
        <td>${c.hora.substring(0, 5)}</td>
        <td>${c.servicio?.nombre ?? "-"}</td>
        <td class="admin-only ${usuario.role === "admin" ? "" : "d-none"}">${c.cliente?.name ?? "-"}</td>
        <td>${badgeEstado(c.estado)}</td>
        <td>${c.notas ?? ""}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="abrirModalEditar(${c.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="cancelarCita(${c.id})" ${c.estado === "cancelada" ? "disabled" : ""}>Cancelar</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

function abrirModalNuevaCita() {
  document.getElementById("formCita").reset();
  document.getElementById("citaId").value = "";
  document.getElementById("tituloModalCita").textContent = "Nueva cita";
}

async function abrirModalEditar(id) {
  const cita = await apiRequest(`/citas/${id}`);
  document.getElementById("citaId").value = cita.id;
  document.getElementById("servicioId").value = cita.servicio_id;
  document.getElementById("fecha").value = cita.fecha;
  document.getElementById("hora").value = cita.hora.substring(0, 5);
  document.getElementById("notas").value = cita.notas ?? "";
  if (usuario.role === "admin") {
    document.getElementById("estado").value = cita.estado;
  }
  document.getElementById("tituloModalCita").textContent = "Editar cita";

  new bootstrap.Modal(document.getElementById("modalCita")).show();
}

async function cancelarCita(id) {
  if (!confirm("¿Seguro que deseas cancelar esta cita?")) return;
  try {
    await apiRequest(`/citas/${id}`, { method: "DELETE" });
    cargarCitas();
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

document.getElementById("formCita").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("citaId").value;
  const body = {
    servicio_id: document.getElementById("servicioId").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    notas: document.getElementById("notas").value,
  };

  if (usuario.role === "admin") {
    body.estado = document.getElementById("estado").value;
  }

  try {
    if (id) {
      await apiRequest(`/citas/${id}`, { method: "PUT", body });
    } else {
      await apiRequest("/citas", { method: "POST", body });
    }
    bootstrap.Modal.getInstance(document.getElementById("modalCita")).hide();
    cargarCitas();
  } catch (error) {
    if (error.errors) {
      mostrarErroresValidacion("alerta", error.errors);
    } else {
      mostrarAlerta("alerta", error.message);
    }
  }
});

document.getElementById("filtroFecha").addEventListener("change", cargarCitas);
document.getElementById("btnLimpiarFiltro").addEventListener("click", () => {
  document.getElementById("filtroFecha").value = "";
  cargarCitas();
});

cargarServicios().then(cargarCitas);
