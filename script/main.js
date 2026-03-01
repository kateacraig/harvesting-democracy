// Harvesting Democracy Website - Main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // Hamburger Menu
  // ==========================================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest("nav") && !e.target.closest(".hamburger")) {
      if (navMenu && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    }
  });

  // ==========================================
  // Endorsed Candidate Slider
  // ==========================================
  const carousel = document.querySelector(".candidate-carousel");
  const track = document.getElementById("candidateCarouselSlides");
  if (!carousel || !track) return;

  const originalSlides = Array.from(track.querySelectorAll(".carousel-slide"));
  if (originalSlides.length === 0) return;

  let slidesToShow = getSlidesToShow();
  let currentIndex = slidesToShow;
  let isTransitioning = false;

  function getSlidesToShow() {
    return window.innerWidth <= 460 ? 1 : 5;
  }

  // ← KEY FIX: Use pixel width of the carousel container, not percentages
  function getSlideWidth() {
    return carousel.offsetWidth / slidesToShow;
  }

  function setWidths() {
    const slideWidth = getSlideWidth();
    const allSlides = track.querySelectorAll(".carousel-slide");
    allSlides.forEach((s) => {
      s.style.flex = "0 0 " + slideWidth + "px";
      s.style.minWidth = slideWidth + "px";
      s.style.width = slideWidth + "px";
    });
  }

  function buildClones() {
    track.querySelectorAll(".clone").forEach((c) => c.remove());

    originalSlides.slice(0, slidesToShow).forEach((s) => {
      const clone = s.cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    });

    originalSlides.slice(-slidesToShow).forEach((s) => {
      const clone = s.cloneNode(true);
      clone.classList.add("clone");
      track.insertBefore(clone, track.firstChild);
    });
  }

  // ← KEY FIX: offset is now in pixels, not percentages
  function goTo(index, animate) {
    const slideWidth = getSlideWidth();
    const offset = -(index * slideWidth);
    track.style.transition = animate ? "transform 0.7s ease-in-out" : "none";
    track.style.transform = "translateX(" + offset + "px)";
  }

  function setup() {
    buildClones();
    setWidths();
    currentIndex = slidesToShow;
    goTo(currentIndex, false);
  }

  function next() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    goTo(currentIndex, true);

    setTimeout(function () {
      if (currentIndex >= originalSlides.length + slidesToShow) {
        currentIndex = slidesToShow;
        goTo(currentIndex, false);
      }
      isTransitioning = false;
    }, 750);
  }

  setup();
  setInterval(next, 1000); // ← 1 second loop as requested

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const newCount = getSlidesToShow();
      slidesToShow = newCount;
      setup();
    }, 250);
  });
}); // end DOMContentLoaded
