'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navbar = document.querySelector("[data-navbar]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navToggleFunc = function () {
  navToggleBtn.classList.toggle("active");
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

navToggleBtn.addEventListener("click", navToggleFunc);
overlay.addEventListener("click", navToggleFunc);

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", navToggleFunc);
}



/**
 * header active on scroll
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active")
    : header.classList.remove("active");
});

/**
 * Theme toggle
 */
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('theme-toggle-icon');
  const toggleText = document.getElementById('theme-toggle-text');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', function(){
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('vehigo-theme', isDark ? 'dark' : 'light');
    if (toggleIcon) toggleIcon.setAttribute('name', isDark ? 'sunny-outline' : 'moon-outline');
     if (toggleText) toggleText.textContent = isDark ? 'Light' : 'Dark';
     toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
     toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
});

/**
 * Triggering navigation buttons scroll
 */

document.addEventListener("DOMContentLoaded", function () {
    const blogList = document.querySelector(".blog-list");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    const scrollAmount = 340; 

    rightArrow.addEventListener("click", () => {
      blogList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    leftArrow.addEventListener("click", () => {
      blogList.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  });