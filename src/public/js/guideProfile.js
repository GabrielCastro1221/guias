document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const target = this.getAttribute("data-target");

      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      document.getElementById(target).style.display = "block";

      tabs.forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");
    });
  });

  if (tabs.length > 0) {
    tabs[0].click();
  }

  const buttons = {
    logout: document.querySelector(".logout-button"),
    delete: document.querySelector(".delete-button"),
  };

  buttons.logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  });

  buttons.delete.addEventListener("click", async () => {
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
          const response = await fetch(`/api/v1/guides/${id}`, {
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
              background: "#4CAF50",
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

  const fetchGuideProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/v1/guides/profile/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        renderProfile(result.data);
      } else {
        console.error("Error al obtener el perfil:", result.message);
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  fetchGuideProfile();
});

const renderProfile = (data) => {
  document.getElementById("specialization").textContent =
    data.specialization || "No especificado";
  document.getElementById("guide-name").textContent =
    data.name || "No especificado";
  document.getElementById("bio").textContent = data.bio || "No especificado";

  const profileImage = document.getElementById("image");
  profileImage.src =
    data.photo ||
    "https://img.freepik.com/free-photo/cute-leaf-cartoon-illustration_23-2151411202.jpg";
  profileImage.alt = data.name || "Imagen de perfil";

  const educationList = document.querySelector(".education-list");
  educationList.innerHTML = "";
  data.education.forEach((edu) => {
    const li = document.createElement("li");
    li.classList.add("education-item");
    li.innerHTML = `
      <div>
        <span class="date">${edu.year}</span>
        <p class="degree">${edu.degree}</p>
      </div>
      <p class="university">${edu.institution}</p>
    `;
    educationList.appendChild(li);
  });

  const experienceList = document.querySelector(".experience-list");
  experienceList.innerHTML = "";
  data.experiences.forEach((exp) => {
    const li = document.createElement("li");
    li.classList.add("experience-item");
    li.innerHTML = `
      <div>
        <span class="date">${exp.years}</span>
        <p class="position">${exp.role}</p>
      </div>
      <p class="place">${exp.company}</p>
    `;
    experienceList.appendChild(li);
  });

  const toursList = document.querySelector("#tours");
  toursList.innerHTML = "";
  data.tours.forEach((tour) => {
    const div = document.createElement("div");
    div.classList.add("tour-item");
    div.innerHTML = `
      <article class="tour__card">
        <div class="popular__image">
          <a href="/tours/${tour._id}">
            <img src="${tour.img}" alt="${tour.title}" class="tour__img">
            <div class="popular__shadow"></div>
          </a>
        </div>
        <h2 class="tour__title">${tour.title}</h2>
        <p style="text-align: center; margin-bottom: 15px">Lugar: ${tour.location}</p>
        <div>
          <p class="tour__description" style="text-align: center; margin-bottom: 15px">${tour.description}</p>
        </div>
        <div class="actions-tour">
          <button class="btn-edit-tour">Editar tour</button>
          <button class="btn-gallery">Crear Galeria de fotos</button>
          <button class="btn-delete-tour" data-id="${tour._id}">Eliminar tour</button>
        </div>
      </article>  
    `;
    toursList.appendChild(div);
  });

  document.querySelectorAll(".btn-delete-tour").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const tourId = event.target.getAttribute("data-id");
      const token = localStorage.getItem("token");

      if (!token) {
        Toastify({
          text: "No se proporcionó el token.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#ff0000",
        }).showToast();
        return;
      }

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
            const response = await fetch(`/api/v1/tour/${tourId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const result = await response.json();

            if (response.ok) {
              Toastify({
                text: "Tour eliminado con éxito",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#4CAF50",
              }).showToast();
              event.target.closest(".tour-item").remove();
            } else {
              Toastify({
                text: `Error: ${result.message}`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                background: "#ff0000",
              }).showToast();
            }
          } catch (error) {
            console.error("Error al eliminar el tour:", error);
            Toastify({
              text: "Hubo un error al eliminar el tour. Intenta nuevamente.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              background: "#ff0000",
            }).showToast();
          }
        }
      });
    });
  });
};
