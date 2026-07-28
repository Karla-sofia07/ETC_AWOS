// Si ya hay sesión activa, redirige directo a la agenda
if (getToken() && (location.pathname.endsWith("index.html") || location.pathname === "/")) {
  window.location.href = "agenda.html";
}

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setSession(data.token, data.user);
      window.location.href = "agenda.html";
    } catch (error) {
      mostrarAlerta("alerta", error.message);
    }
  });
}

const formRegister = document.getElementById("formRegister");
if (formRegister) {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
      password_confirmation: document.getElementById("password_confirmation").value,
    };

    try {
      const data = await apiRequest("/auth/register", { method: "POST", body });
      setSession(data.token, data.user);
      window.location.href = "agenda.html";
    } catch (error) {
      if (error.errors) {
        mostrarErroresValidacion("alerta", error.errors);
      } else {
        mostrarAlerta("alerta", error.message);
      }
    }
  });
}

async function cerrarSesion() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch (e) {
    // Aunque falle la llamada, limpiamos la sesión local
  }
  clearSession();
  window.location.href = "index.html";
}
