requireAuth();

const usuario = getUser();
document.getElementById("nombreUsuario").textContent = `${usuario.name} (${usuario.role})`;
const esAdmin = usuario.role === "admin";
if (esAdmin) {
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.remove("d-none"));
}

async function cargarServicios() {
  try {
    const servicios = await apiRequest("/servicios");
    const contenedor = document.getElementById("listaServicios");

    contenedor.innerHTML = servicios
      .map(
        (s) => `
      <div class="col-md-4">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between">
            <h5>${s.nombre}</h5>
            ${s.activo ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>'}
          </div>
          <p class="text-muted small">${s.descripcion ?? ""}</p>
          <p class="mb-1"><strong>Duración:</strong> ${s.duracion_minutos} min</p>
          <p class="mb-2"><strong>Precio:</strong> $${s.precio}</p>
          <div class="admin-only ${esAdmin ? "" : "d-none"} d-flex gap-2 mt-auto">
            <button class="btn btn-sm btn-outline-primary" onclick="editarServicio(${s.id})">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(${s.id})">Eliminar</button>
          </div>
        </div>
      </div>`
      )
      .join("");
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

function abrirModalNuevoServicio() {
  document.getElementById("formServicio").reset();
  document.getElementById("servicioIdEdit").value = "";
  document.getElementById("activo").checked = true;
  document.getElementById("tituloModalServicio").textContent = "Nuevo servicio";
}

async function editarServicio(id) {
  const s = await apiRequest(`/servicios/${id}`);
  document.getElementById("servicioIdEdit").value = s.id;
  document.getElementById("nombre").value = s.nombre;
  document.getElementById("descripcion").value = s.descripcion ?? "";
  document.getElementById("duracion_minutos").value = s.duracion_minutos;
  document.getElementById("precio").value = s.precio;
  document.getElementById("activo").checked = s.activo;
  document.getElementById("tituloModalServicio").textContent = "Editar servicio";
  new bootstrap.Modal(document.getElementById("modalServicio")).show();
}

async function eliminarServicio(id) {
  if (!confirm("¿Eliminar este servicio?")) return;
  try {
    await apiRequest(`/servicios/${id}`, { method: "DELETE" });
    cargarServicios();
  } catch (error) {
    mostrarAlerta("alerta", error.message);
  }
}

document.getElementById("formServicio").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("servicioIdEdit").value;
  const body = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    duracion_minutos: Number(document.getElementById("duracion_minutos").value),
    precio: Number(document.getElementById("precio").value),
    activo: document.getElementById("activo").checked,
  };

  try {
    if (id) {
      await apiRequest(`/servicios/${id}`, { method: "PUT", body });
    } else {
      await apiRequest("/servicios", { method: "POST", body });
    }
    bootstrap.Modal.getInstance(document.getElementById("modalServicio")).hide();
    cargarServicios();
  } catch (error) {
    if (error.errors) {
      mostrarErroresValidacion("alerta", error.errors);
    } else {
      mostrarAlerta("alerta", error.message);
    }
  }
});

cargarServicios();
