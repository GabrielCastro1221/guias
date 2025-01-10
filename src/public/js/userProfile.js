document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    getUserProfile(token);
  }
});

const getUserProfile = async (token) => {
  try {
    const response = await fetch("/api/v1/users/profile/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/";
      } else {
        throw new Error("Error al obtener el perfil del usuario");
      }
    }

    const result = await response.json();
    if (result.success) {
      renderProfile(result.data);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const renderProfile = (data) => {
  const profileContainer = document.querySelector(".perfil-usuario-body");
  const fields = {
    name: ".perfil-usuario-bio .titulo",
    email: ".lista-datos li:nth-child(1) span",
    gender: ".lista-datos li:nth-child(2) span",
    role: ".lista-datos li:nth-child(3) span",
  };

  Object.keys(fields).forEach((key) => {
    const element = profileContainer.querySelector(fields[key]);
    if (element) {
      element.textContent = data[key] || "No especificado";
    }
  });

  const avatarImg = document.querySelector(".perfil-usuario-avatar img");
  if (avatarImg) {
    avatarImg.src =
      data.photo ||
      "https://img.freepik.com/free-photo/cute-leaf-cartoon-illustration_23-2151411202.jpg?t=st=1736541127~exp=1736544727~hmac=6caf1d4eef215a8e80c895ad6f4e4af2fec0ea6c60706de168c31ab7a192776d&w=740";
  }
};

const datos = [
  { icono: "fa-solid fa-envelope", texto: "Email", valor: "" },
  { icono: "fa-solid fa-venus-mars", texto: "Género", valor: "" },
  { icono: "fa-solid fa-address-book", texto: "Rol", valor: "" },
];

const avatarData = {
  imagenUrl:
    "https://vineview.com/wp-content/uploads/2017/07/avatar-no-photo-300x300.png",
  botonTexto: "Cambiar Avatar",
  botonIcono: "far fa-image",
};

const lista = document.querySelector(".lista-datos");

datos.forEach((dato) => {
  const li = document.createElement("li");
  const icono = document.createElement("i");
  icono.className = `${dato.icono} icono`;
  const texto = document.createTextNode(` ${dato.texto}: `);
  const span = document.createElement("span");
  span.textContent = dato.valor;
  li.appendChild(icono);
  li.appendChild(texto);
  li.appendChild(span);
  lista.appendChild(li);
});

const logoutButton = document.querySelector(".logout-button");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

const deleteButton = document.querySelector(".delete-button");

deleteButton.addEventListener("click", async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (!userData || !userData._id) {
    alert("No se encontró el ID del usuario.");
    return;
  }
  if (!token) {
    alert("No se proporcionó el token.");
    return;
  }
  const id = userData._id;

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/v1/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          Swal.fire("Eliminado!", result.message, "success").then(() => {
            window.location.href = "/";
          });
        } else {
          Swal.fire("Error", result.message, "error");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        Swal.fire("Error", "Hubo un error al eliminar la cuenta.", "error");
      }
    }
  });
});
