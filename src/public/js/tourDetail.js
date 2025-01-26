document.addEventListener("DOMContentLoaded", () => {
  const galleryImages = document.querySelectorAll("#gallery img");
  const mainImg = document.querySelector("#main-img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      mainImg.src = img.src;
      galleryImages.forEach((image) => image.classList.remove("active"));
      img.classList.add("active");
    });
  });

  const infoButton = document.querySelector('button[data-target="info"]');
  const mapButton = document.querySelector('button[data-target="map"]');
  const infoSection = document.getElementById("info");
  const mapSection = document.getElementById("map");

  infoButton.addEventListener("click", () => {
    infoSection.style.display = "block";
    mapSection.style.display = "none";
  });

  mapButton.addEventListener("click", () => {
    infoSection.style.display = "none";
    mapSection.style.display = "block";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const location = document.querySelector(".address span").textContent.trim();
  const mapContainer = document.getElementById("map");
  const iframeContent = mapContainer.querySelector(".iframe-content iframe");

  if (location) {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsURL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCjXA4OOkF1mjXukeBn9v8JIjnRtkIcf2U&q=${encodedLocation}`;

    iframeContent.src = googleMapsURL;
  } else {
    console.error("No se encontró una ubicación válida.");
  }

  const tabs = document.querySelectorAll(".tabs button");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");

      document.querySelectorAll(".info-content > div").forEach((content) => {
        content.style.display = content.id === target ? "block" : "none";
      });
    });
  });
});
