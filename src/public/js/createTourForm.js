document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("createRentModal");
  const openModalButton = document.querySelector(".create-btn");
  const closeModalButton = modal.querySelector(".close-btn");
  const createForm = document.getElementById("createRentForm");

  const addImageButton = document.getElementById("add-image");
  const galleryContainer = document.getElementById("photo-inputs");

  openModalButton.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  addImageButton.addEventListener("click", () => {
    const currentInputs =
      galleryContainer.querySelectorAll("input[type='file']");
    if (currentInputs.length < 10) {
      const newInputContainer = document.createElement("div");
      newInputContainer.classList.add("file-input-container");

      const newInput = document.createElement("input");
      newInput.type = "file";
      newInput.name = "photos";
      newInput.accept = "image/*";
      newInput.classList.add("gallery-input");

      const newLabel = document.createElement("label");
      newLabel.classList.add("file-input-label");
      newLabel.innerHTML = '<i class="fas fa-plus"></i>';

      newInputContainer.appendChild(newInput);
      newInputContainer.appendChild(newLabel);
      galleryContainer.appendChild(newInputContainer);
    } else {
      Toastify({
        text: "No puedes agregar más de 10 fotos.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "red",
      }).showToast();
    }
  });

  const guideId = JSON.parse(localStorage.getItem("user"))._id;
  document.getElementById("guideId").value = guideId;

  createForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(createForm);

    try {
      const response = await fetch("/api/v1/tour", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status) {
        Toastify({
          text: "Tour creado con éxito",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "green",
        }).showToast();
        modal.style.display = "none";
        createForm.reset();
      } else {
        Toastify({
          text: `Error: ${result.message}`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "red",
        }).showToast();
      }
    } catch (error) {
      console.error("Error al crear el tour:", error);
      Toastify({
        text: "Ocurrió un error, inténtelo más tarde.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        background: "orange",
      }).showToast();
    }
  });
});
