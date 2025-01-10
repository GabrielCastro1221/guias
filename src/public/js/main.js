(() => {
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav__link"),
    header = document.getElementById("header"),
    scrollUpBtn = document.getElementById("scroll-up"),
    sections = document.querySelectorAll("section[id]");

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

  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 3000,
    delay: 400,
  });

  sr.reveal(`.home__data, .explore__data, .explore__user, .footer__container`);
  sr.reveal(`.home__card`, { delay: 600, distance: "100px", interval: 100 });
  sr.reveal(`.about__data, .join__image`, { origin: "right" });
  sr.reveal(`.about__image, .join__data`, { origin: "left" });
  sr.reveal(`.popular__card`, { interval: 200 });
})();
