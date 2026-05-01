const navLinks = document.querySelectorAll("nav .nav-inner ul a");
const contents = document.querySelectorAll(".content");
const temp = document.querySelector(".temp");
const form = document.querySelector(".contact-form");
const nav = document.querySelector("nav .nav-inner ul");
const logo = document.querySelector("nav .nav-inner ul li#logo");
const logoImg = document.querySelector("nav .nav-inner ul li#logo img");
const themeToggleBtn = document.getElementById("theme-toggle");
const darkIcon = document.getElementById("theme-toggle-dark-icon");
const lightIcon = document.getElementById("theme-toggle-light-icon");
let isDarkMode = false;

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  darkIcon.classList.remove("hidden");
  isDarkMode = true;
} else {
  document.documentElement.classList.remove("dark");
  lightIcon.classList.remove("hidden");
  isDarkMode = false;
  logoImg.src = "assets/img/nav-icon-secondary.png";
}

// Event klik tombol
themeToggleBtn.addEventListener("click", function () {
  darkIcon.classList.toggle("hidden");
  lightIcon.classList.toggle("hidden");

  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      isDarkMode = true;
      logoImg.src = "assets/img/nav-icon.png";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      isDarkMode = false;
      logoImg.src = "assets/img/nav-icon-secondary.png";
    }
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      isDarkMode = false;
      logoImg.src = "assets/img/nav-icon-secondary.png";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      isDarkMode = true;
      logoImg.src = "assets/img/nav-icon.png";
    }
  }
});

window.addEventListener("scroll", () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollPercent = (window.scrollY / totalHeight) * 100;

  if (scrollPercent >= 4.5) {
    nav.classList.add("scrolled-nav");
    logo.classList.remove("logo");
  } else {
    nav.classList.remove("scrolled-nav");
    logo.classList.add("logo");
  }
});

function updateNav(e) {
  navLinks.forEach((nav) => {
    if (e == nav) {
      nav.classList.add("active");
    } else {
      nav.classList.remove("active");
    }
  });

  contents.forEach((content) => {
    if (e.innerHTML.toLowerCase() == content.id) {
      content.classList.remove("hidden");
    } else {
      content.classList.add("hidden");
    }
  });
}

navLinks.forEach((nav) => {
  nav.addEventListener("click", () => {
    updateNav(nav);
    window.dispatchEvent(new Event("scroll"));
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.querySelector(".contact-form input#name").value;
  const email = document.querySelector(".contact-form input#email").value;
  const subject = document.querySelector(".contact-form select#subject").value;
  const body = document.querySelector(".contact-form textarea#body").value;
  if (name && email && subject && body) {
    window.open(
      `mailto:maztamam67@gmail.com?subject=${subject}&body=Hi.%20My%20name%20is%20${name}%0D%0A%0D%0A${body}%20%3A%29`,
    );
  } else {
    alert("The input form is invalid!");
  }
});

fetch(
  "https://api.openweathermap.org/data/2.5/weather?q=Bantul,id&appid=446595f1123c96e84c9c6965efe508d7",
)
  .then((response) => response.json())
  .then((data) => {
    temp.innerHTML = Math.round(data.main.temp) - 273;
  })
  .catch((err) => console.log(err));

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.getElementById("about");
  const track = document.getElementById("canvas-track");
  const canvas = document.getElementById("scroll-canvas");
  const wrapper = document.getElementById("canvas-wrapper");

  if (track && canvas) {
    const context = canvas.getContext("2d");
    let frameCount;
    let currentFrame;

    if (isDarkMode) {
      frameCount = 108;
      currentFrame = (index) =>
        `assets/frames/dark/Presentation3_${index.toString().padStart(3, "0")}.png`;
    } else {
      frameCount = 92;
      currentFrame = (index) =>
        `assets/frames/light/Presentation2_${index.toString().padStart(3, "0")}.png`;
    }

    const images = [];
    let loadedImages = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedImages++;
        if (loadedImages === 1) {
          canvas.width = images[0].width;
          canvas.height = images[0].height;
          context.drawImage(images[0], 0, 0);
        }
      };
      images.push(img);
    }

    // 3. Logika Scroll
    let targetFrameIndex = 0;
    let currentFrameIndex = 0;
    const easing = 0.1; // Efek pegas

    window.addEventListener("scroll", () => {
      if (aboutSection.classList.contains("hidden")) return;

      const stickyOffset = 0;

      const rect = track.getBoundingClientRect();
      const scrollableDistance = rect.height - wrapper.offsetHeight;

      let scrollFraction = (stickyOffset - rect.top) / scrollableDistance;

      const isSticky = scrollFraction > 0 && scrollFraction < 1;

      if (isSticky) {
        wrapper.classList.add("lg:rounded-none");
        canvas.classList.add("lg:rounded-none");
      } else {
        wrapper.classList.remove("lg:rounded-none");
        canvas.classList.remove("lg:rounded-none");
      }

      if (scrollFraction < 0) scrollFraction = 0;
      if (scrollFraction > 1) scrollFraction = 1;

      targetFrameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount),
      );
    });

    // 4. Loop Animasi (Render Engine)
    const updateCanvas = () => {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * easing;

      const indexToDraw = Math.round(currentFrameIndex);
      if (images[indexToDraw] && loadedImages === frameCount) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas lama
        context.drawImage(images[indexToDraw], 0, 0); // Gambar frame baru
      }

      window.requestAnimationFrame(updateCanvas);
    };

    window.requestAnimationFrame(updateCanvas);
  }
});
