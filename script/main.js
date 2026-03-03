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
  // Endorsed Candidate Carousel
  // ==========================================
  const candidateCarousel = document.querySelector(".candidate-carousel");
  const candidateCarouselSlides = document.getElementById(
    "candidateCarouselSlides"
  );
  const candidateSlides = candidateCarousel
    ? candidateCarousel.querySelectorAll(".carousel-slide")
    : [];

  if (
    candidateCarousel &&
    candidateCarouselSlides &&
    candidateSlides.length > 0
  ) {
    let candidateCurrentIndex = 0;
    let candidateSlidesToShow = getCandidateSlidesToShow();
    let candidateIsTransitioning = false;
    let candidateAutoAdvanceInterval;

    function setupCandidateInfiniteLoop() {
      const existingClones = candidateCarouselSlides.querySelectorAll(".clone");
      existingClones.forEach((clone) => clone.remove());

      for (let i = 0; i < candidateSlidesToShow; i++) {
        const clone = candidateSlides[i].cloneNode(true);
        clone.classList.add("clone");
        candidateCarouselSlides.appendChild(clone);
      }

      for (
        let i = candidateSlides.length - candidateSlidesToShow;
        i < candidateSlides.length;
        i++
      ) {
        const clone = candidateSlides[i].cloneNode(true);
        clone.classList.add("clone");
        candidateCarouselSlides.insertBefore(
          clone,
          candidateCarouselSlides.firstChild
        );
      }

      candidateCurrentIndex = candidateSlidesToShow;
      updateCandidateCarouselPosition(false);
    }

    function getCandidateSlidesToShow() {
      return window.innerWidth <= 460 ? 1 : 4;
    }

    function updateCandidateCarouselPosition(animate = true) {
      const slideWidth = 100 / candidateSlidesToShow;
      const offset = -candidateCurrentIndex * slideWidth;

      if (animate) {
        candidateCarouselSlides.style.transition = "transform 1s ease-in-out";
      } else {
        candidateCarouselSlides.style.transition = "none";
      }

      candidateCarouselSlides.style.transform = `translateX(${offset}%)`;
    }

    function candidateNextSlide() {
      if (candidateIsTransitioning) return;

      candidateIsTransitioning = true;
      candidateCurrentIndex++;
      updateCandidateCarouselPosition(true);

      setTimeout(() => {
        if (
          candidateCurrentIndex >=
          candidateSlides.length + candidateSlidesToShow
        ) {
          candidateCurrentIndex = candidateSlidesToShow;
          updateCandidateCarouselPosition(false);
        }
        candidateIsTransitioning = false;
      }, 1000);
    }

    let candidateResizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(candidateResizeTimeout);
      candidateResizeTimeout = setTimeout(() => {
        const newSlidesToShow = getCandidateSlidesToShow();
        if (newSlidesToShow !== candidateSlidesToShow) {
          candidateSlidesToShow = newSlidesToShow;
          setupCandidateInfiniteLoop();
        }
      }, 250);
    });

    setupCandidateInfiniteLoop();
    candidateAutoAdvanceInterval = setInterval(candidateNextSlide, 2000);
  }
}); // end DOMContentLoaded
