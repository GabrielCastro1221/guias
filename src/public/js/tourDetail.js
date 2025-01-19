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
