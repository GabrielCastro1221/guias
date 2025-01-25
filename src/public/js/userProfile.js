document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const user = JSON.parse(userData);
    renderProfile(user);
  }

  const modal = document.getElementById("editModal");
  const buttons = {
    edit: document.querySelector(".edit-button"),
    close: document.querySelector(".modal .close"),
    logout: document.querySelector(".logout-button"),
    delete: document.querySelector(".delete-button"),
  };

  buttons.edit.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("name").value = user.name || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("avatar").value = user.photo || "";
    }
    modal.style.display = "block";
  });

  buttons.close.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  buttons.logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Toastify({
      text: "Sesión cerrada con éxito",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();
    window.location.href = "/login";
  });

  buttons.delete.addEventListener("click", async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!userData || !userData._id) {
      Toastify({
        text: "No se encontró el ID del usuario.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }
    if (!token) {
      Toastify({
        text: "No se proporcionó el token.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
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
            Toastify({
              text: "Cuenta eliminada con éxito",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: "#4CAF50",
            }).showToast();
            window.location.href = "/";
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

  const updateUser = async (id, userData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        Toastify({
          text: "Perfil actualizado con éxito",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
        localStorage.setItem("user", JSON.stringify(result.usuario));
        renderProfile(result.usuario);
        modal.style.display = "none";
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      Swal.fire("Error", "Hubo un error al actualizar el perfil.", "error");
    }
  };

  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const userData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      photo: document.getElementById("customFile").files[0],
    };
    updateUser(user._id, userData);
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

  const avatarImg = document.getElementById("avatar");
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

const tabs = document.getElementById("tabs");

const tabsData = [
  {
    class: "edit-button",
    icon: "ri-pencil-line",
    text: "Editar Perfil",
  },
  {
    class: "logout-button",
    icon: "ri-shut-down-line",
    text: "Cerrar sesión",
  },
  {
    class: "delete-button",
    icon: "ri-delete-bin-6-line",
    text: "Eliminar cuenta",
  },
];

const createTabs = () => {
  tabs.innerHTML = tabsData
    .map(
      (tab) =>
        `<button class="${tab.class}"> <i class="${tab.icon}"></i> ${tab.text}</button>`
    )
    .join("");
};

createTabs();
