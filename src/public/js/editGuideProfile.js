document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("editProfileModal");
  const btn = document.querySelector(".edit-btn");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = function () {
    modal.style.display = "block";
    populateForm();
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function populateForm() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.phone || "";
      document.getElementById("about").value = user.about || "";
      document.querySelector(".preview").src =
        user.photo ||
        "https://img.freepik.com/free-photo/cute-leaf-cartoon-illustration_23-2151411202.jpg";

      populateArrayFields("education-container", user.education || []);
      populateArrayFields("experience-container", user.experiences || []);
    }
  }

  function populateArrayFields(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    items.forEach((item) => {
      let value = "";

      if (typeof item === "object" && item !== null) {
        value = Object.values(item).join(" - ");
      } else {
        value = item;
      }

      addArrayField(containerId, value);
    });
  }

  function addArrayField(containerId, value = "") {
    const container = document.getElementById(containerId);
    const div = document.createElement("div");
    div.classList.add("array-item");
    div.innerHTML = `
      <input type="text" value="${value}" required>
      <button type="button" class="remove-item">X</button>
    `;

    container.appendChild(div);

    div.querySelector(".remove-item").addEventListener("click", function () {
      div.remove();
    });
  }

  document
    .getElementById("add-education")
    .addEventListener("click", function () {
      addArrayField("education-container");
    });

  document
    .getElementById("add-experience")
    .addEventListener("click", function () {
      addArrayField("experience-container");
    });

  document
    .querySelector(".form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      const userId = JSON.parse(localStorage.getItem("user"))._id;

      formData.append("name", document.getElementById("name").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("phone", document.getElementById("phone").value);
      formData.append("about", document.getElementById("about").value);
      formData.append(
        "education",
        JSON.stringify(getArrayValues("education-container"))
      );
      formData.append(
        "experiences",
        JSON.stringify(getArrayValues("experience-container"))
      );

      const photoInput = document.getElementById("customFile");
      if (photoInput.files.length > 0) {
        formData.append("photo", photoInput.files[0]);
      }

      try {
        const response = await fetch(`/api/v1/guides/${userId}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: "Perfil actualizado con éxito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#4CAF50",
          }).showToast();
          localStorage.setItem("user", JSON.stringify(result.guia));
          modal.style.display = "none";
          location.reload();
        } else {
          Toastify({
            text: result.message || "Error al actualizar",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            background: "#ff0000",
          }).showToast();
        }
      } catch (error) {
        console.error("Error:", error);
        Toastify({
          text: "Hubo un error al actualizar el perfil",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          background: "#ff0000",
        }).showToast();
      }
    });

  function getArrayValues(containerId) {
    return Array.from(
      document.getElementById(containerId).querySelectorAll("input")
    ).map((input) => {
      const values = input.value.split(" - ");

      if (containerId === "education-container") {
        return {
          institution: values[0] || "",
          degree: values[1] || "",
          year: values[2] || "",
        };
      } else if (containerId === "experience-container") {
        return {
          company: values[0] || "",
          role: values[1] || "",
          years: values[2] || "",
        };
      }

      return input.value;
    });
  }
});
