(() => {
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav__link"),
    header = document.getElementById("header"),
    scrollUpBtn = document.getElementById("scroll-up"),
    sections = document.querySelectorAll("section[id]"),
    navList = document.querySelector(".nav__list");

  const links = [
    { href: "/", text: "Inicio" },
    { href: "/guias", text: "Nuestro Equipo" },
    { href: "/tours", text: "Tours" },
    { href: "/chat", text: "Chat Comunitario" },
    { href: "/blog", text: "Blog" },
  ];

  const createNavLinks = () => {
    navList.innerHTML = links
      .map(
        (link) =>
          `<li class="nav__item">
            <a href="${link.href}" class="nav__link">${link.text}</a>
          </li>`
      )
      .join("");
  };

  createNavLinks();

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const authButton = document.getElementById("auth-button");

  if (user) {
    authButton.textContent = "Perfil";
    if (user.role === "guia") {
      authButton.href = "/perfil-guia";
    } else if (user.role === "usuario") {
      authButton.href = "/perfil-usuario";
    } else if (user.role === "admin") {
      authButton.href = "/perfil-admin";
    }
  } else {
    authButton.textContent = "Ingresar";
    authButton.href = "/login";
  }

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    })
  );

  const handleBlurHeader = () => {
    if (window.scrollY >= 50) {
      header?.classList.add("blur-header");
    } else {
      header?.classList.remove("blur-header");
    }
  };

  const handleScrollUp = () => {
    if (window.scrollY >= 350) {
      scrollUpBtn?.classList.add("show-scroll");
    } else {
      scrollUpBtn?.classList.remove("show-scroll");
    }
  };

  const handleScrollActive = () => {
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight,
        sectionTop = section.offsetTop - 58,
        sectionId = section.getAttribute("id"),
        sectionLink = document.querySelector(
          `.nav__menu a[href*="${sectionId}"]`
        );

      if (
        scrollPosition > sectionTop &&
        scrollPosition <= sectionTop + sectionHeight
      ) {
        sectionLink?.classList.add("active-link");
      } else {
        sectionLink?.classList.remove("active-link");
      }
    });
  };

  window.addEventListener("scroll", () => {
    handleBlurHeader();
    handleScrollUp();
    handleScrollActive();
  });
})();
