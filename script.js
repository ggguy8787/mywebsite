/* =============================================================
   Cikedis — static site behaviour (Flat structure)
   ============================================================= */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/601164230805";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  document.querySelectorAll("a[data-wa]").forEach(function (link) {
    var message = link.getAttribute("data-wa");
    if (!message) return;
    var rawHref = link.getAttribute("href") || WA_BASE;
    var cleanBase = rawHref.split("?")[0].replace(/\/+$/, "");
    link.setAttribute("href", cleanBase + "?text=" + encodeURIComponent(message));
  });

  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      mobileNav.classList.toggle("is-open", !open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setTimeout(closeNav, 150);
      });
    });
  }

  var header = document.getElementById("siteHeader");
  var fab = document.getElementById("fab");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-stuck", y > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".product-card"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".menu-group"));
  var emptyNote = document.getElementById("menuEmpty");

  function applyFilter(value) {
    cards.forEach(function (card) {
      var match = value === "all" || card.getAttribute("data-category") === value;
      card.classList.toggle("is-hidden", !match);
    });

    groups.forEach(function (group) {
      var visible = Array.prototype.slice
        .call(group.querySelectorAll(".product-card"))
        .some(function (card) { return !card.classList.contains("is-hidden"); });
      group.style.display = visible ? "" : "none";
    });

    if (emptyNote) {
      var anyVisible = cards.some(function (card) { return !card.classList.contains("is-hidden"); });
      emptyNote.classList.toggle("is-visible", !anyVisible);
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (other) {
        other.setAttribute("aria-pressed", other === chip ? "true" : "false");
      });
      applyFilter(chip.getAttribute("data-filter"));
    });
  });
})();
