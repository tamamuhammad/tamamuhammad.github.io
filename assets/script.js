const navLinks = document.querySelectorAll("nav .nav-inner ul a");
const nav = document.querySelector("nav .nav-inner ul");
const logo = document.querySelector("nav .nav-inner ul li#logo");
const logoImg = document.querySelector("nav .nav-inner ul li#logo img");
const themeToggleBtn = document.getElementById("theme-toggle");
const darkIcon = document.getElementById("theme-toggle-dark-icon");
const lightIcon = document.getElementById("theme-toggle-light-icon");
const contents = document.querySelectorAll(".content");
const temp = document.querySelector(".temp");
const form = document.querySelector(".contact-form");
const messageLink = document.querySelector("#footer a#contact-link");
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

  window.dispatchEvent(
    new CustomEvent("themeChanged", { detail: { isDark: isDarkMode } }),
  );
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
    if (e.id == "contact-link") {
      if (
        e.getAttribute("href").substring(1) ==
        nav.getAttribute("href").substring(1)
      ) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    } else {
      if (e == nav) {
        nav.classList.add("active");
      } else {
        nav.classList.remove("active");
      }
    }
  });

  contents.forEach((content) => {
    if (e.getAttribute("href").substring(1) == content.id) {
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

messageLink.addEventListener("click", () => {
  updateNav(messageLink);
  window.dispatchEvent(new Event("scroll"));
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.querySelector(".contact-form input#name").value.trim();
  const email = document
    .querySelector(".contact-form input#email")
    .value.trim();
  const subject = document.querySelector(".contact-form select#subject").value;
  const body = document
    .querySelector(".contact-form textarea#body")
    .value.trim();

  const button = form.querySelector("button[type='submit']");
  button.disabled = true;
  button.innerText = "Sending...";

  if (name && email && subject && body) {
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "2808d9a8-7db5-44e9-9300-e233c88a31df",
          name: name,
          from_name: name,
          email: email,
          subject: subject,
          message: body,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Pesan berhasil terkirim! Silahkan cek email Anda secara berkala.",
        );
        form.reset();
      } else {
        alert("Waduh, ada kesalahan saat mengirim pesan.");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan jaringan.");
    }
  } else {
    alert("Pastikan semua form sudah terisi dengan benar!");
  }
  button.disabled = false;
  button.innerText = "Send";
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
    let images = [];
    let loadedImages = 0;

    let targetFrameIndex = 0;
    let currentFrameIndex = 0;
    const easing = 0.1;

    const loadCanvasImages = (isDarkTheme) => {
      images = [];
      loadedImages = 0;
      targetFrameIndex = 0;
      currentFrameIndex = 0;

      let currentFrame;
      if (isDarkTheme) {
        frameCount = 108;
        currentFrame = (index) =>
          `assets/frames/dark/Presentation3_${index.toString().padStart(3, "0")}.png`;
      } else {
        frameCount = 92;
        currentFrame = (index) =>
          `assets/frames/light/Presentation2_${index.toString().padStart(3, "0")}.png`;
      }

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
    };

    loadCanvasImages(isDarkMode);

    window.addEventListener("themeChanged", (e) => {
      loadCanvasImages(e.detail.isDark);

      window.dispatchEvent(new Event("scroll"));
    });

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

    const updateCanvas = () => {
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * easing;

      const indexToDraw = Math.round(currentFrameIndex);
      if (
        images.length > 0 &&
        images[indexToDraw] &&
        loadedImages === frameCount
      ) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[indexToDraw], 0, 0);
      }

      window.requestAnimationFrame(updateCanvas);
    };

    window.requestAnimationFrame(updateCanvas);
  }
});
