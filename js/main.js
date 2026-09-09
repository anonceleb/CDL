// Café du L'Amour — small interaction layer, no framework.

(function () {
  "use strict";

  /* ---------- live open / closed status ---------- */
  // Hours: 8:00–23:00 daily, 8:00–23:30 Sat & Sun, closed all day Tuesday.
  function computeStatus(now) {
    var day = now.getDay(); // 0 Sun ... 2 Tue ... 6 Sat
    var minutes = now.getHours() * 60 + now.getMinutes();
    var OPEN = 8 * 60;
    var CLOSE_LATE = 23 * 60 + 30; // Sat/Sun
    var CLOSE_NORMAL = 23 * 60;    // everyone else
    var isLateNight = day === 6 || day === 0; // Sat, Sun

    if (day === 2) {
      return { open: false, label: "Closed today — back Wednesday, 8am" };
    }
    var close = isLateNight ? CLOSE_LATE : CLOSE_NORMAL;
    if (minutes >= OPEN && minutes < close) {
      var closeLabel = isLateNight ? "11:30pm" : "11pm";
      return { open: true, label: "Open now — until " + closeLabel };
    }
    if (minutes < OPEN) {
      return { open: false, label: "Opens today at 8am" };
    }
    return { open: false, label: "Closed — opens tomorrow at 8am" };
  }

  function paintStatus() {
    var els = document.querySelectorAll("[data-status-pill]");
    if (!els.length) return;
    var now = new Date();
    var status = computeStatus(now);
    els.forEach(function (el) {
      el.classList.remove("open", "closed");
      el.classList.add(status.open ? "open" : "closed");
      var textEl = el.querySelector("[data-status-text]");
      if (textEl) textEl.textContent = status.label;
    });
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ---------- highlight today's row in the hours table ---------- */
  (function () {
    var todayIdx = new Date().getDay(); // 0 Sun..6 Sat
    var row = document.querySelector('[data-day="' + todayIdx + '"]');
    if (row) row.classList.add("today");
  })();

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- order sheet (Zomato / Swiggy) ---------- */
  var sheet = document.querySelector("[data-order-sheet]");
  var openers = document.querySelectorAll("[data-order-open]");
  var closers = sheet ? sheet.querySelectorAll("[data-order-close]") : [];
  function openSheet(e) {
    if (e) e.preventDefault();
    if (!sheet) return;
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove("open");
    document.body.style.overflow = "";
  }
  openers.forEach(function (el) { el.addEventListener("click", openSheet); });
  closers.forEach(function (el) { el.addEventListener("click", closeSheet); });
  if (sheet) {
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet) closeSheet();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSheet();
    });
  }

  /* ---------- mobile fixed order bar: show after hero scrolls past ---------- */
  var orderBar = document.querySelector("[data-mobile-orderbar]");
  var hero = document.querySelector("[data-hero]");
  if (orderBar && hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          orderBar.classList.toggle("show", !entry.isIntersecting);
        });
      },
      { rootMargin: "-10% 0px 0px 0px" }
    );
    io.observe(hero);
  }
})();
