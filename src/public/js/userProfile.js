document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    renderProfile(user);
  }

  const editButton = document.querySelector(".edit-button");
  const modal = document.getElementById("editModal");
  const closeModal = document.querySelector(".modal .close");

  editButton.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.phone || "";
    }
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    const updatedData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const user = JSON.parse(localStorage.getItem("user")) || {};
    const newUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUser));

    renderProfile(newUser);
    modal.style.display = "none";
  });
});

const renderProfile = (data) => {
  const profileContainer = document.querySelector(".perfil-usuario-body");

  const fields = {
    name: ".perfil-usuario-bio .titulo",
    email: ".lista-datos li:nth-child(2) span",
    phone: ".lista-datos li:nth-child(3) span",
    gender: ".lista-datos li:nth-child(4) span",
    role: ".lista-datos li:nth-child(5) span",
  };

  Object.keys(fields).forEach((key) => {
    const element = profileContainer.querySelector(fields[key]);
    if (element) {
      element.textContent = data[key] || "No especificado";
    }
  });

  const avatarImg = document.querySelector(".perfil-usuario-avatar img");
  if (avatarImg) {
    avatarImg.src = data.photo || "/assets/img/emptyAvatar.jpg";
  }

  const lista = document.querySelector(".lista-datos");
  lista.innerHTML = "";

  const datos = [
    {
      icono: "ri-user-line",
      texto: "Nombre",
      valor: data.name || "No especificado",
    },
    {
      icono: "ri-mail-line",
      texto: "Email",
      valor: data.email || "No especificado",
    },
    {
      icono: "ri-phone-line",
      texto: "Telefono",
      valor: data.phone || "No especificado",
    },
    {
      icono: "ri-men-line",
      texto: "Género",
      valor: data.gender || "No especificado",
    },
    {
      icono: "ri-user-settings-line",
      texto: "Rol",
      valor: data.role || "No especificado",
    },
  ];

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
};

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
