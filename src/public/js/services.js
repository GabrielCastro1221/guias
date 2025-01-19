document.addEventListener("DOMContentLoaded", () => {
  const services = [
    {
      imgSrc: "/assets/img/service1.jpg",
      title: "Guias Turisticos Experimentados",
    },
    {
      imgSrc: "/assets/img/service2.jpg",
      title: "Visitas a Zonas Turisticas",
    },
    {
      imgSrc: "/assets/img/service3.jpg",
      title: "Aventuras Personalizadas",
    },
    {
      imgSrc: "/assets/img/service4.jpg",
      title: "Blog & Chat comunitario",
    },
  ];

  const servicesContainer = document.getElementById("services-container");

  services.forEach((service) => {
    const article = document.createElement("article");
    article.classList.add("home__card");

    const img = document.createElement("img");
    img.src = service.imgSrc;
    img.alt = "home images";
    img.classList.add("home__card-img");

    const h3 = document.createElement("h3");
    h3.classList.add("home__card-title");
    h3.textContent = service.title;

    const span = document.createElement("span");
    span.textContent = service.description;

    h3.appendChild(span);
    article.appendChild(img);
    article.appendChild(h3);
    article
      .appendChild(document.createElement("div"))
      .classList.add("home__card-shadow");

    servicesContainer.appendChild(article);
  });
});
