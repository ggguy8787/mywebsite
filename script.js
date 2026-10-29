/* =============================================================
   Cikedis — static site behaviour (Optimized)
   Vanilla JS, no dependencies. Progressive enhancement:
   every feature degrades gracefully if JS is unavailable.
   ============================================================= */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/601164230805";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- WhatsApp links with pre-written order text ---------- */
  document.querySelectorAll("a[data-wa]").forEach(function (link) {
    var message = link.getAttribute("data-wa");
    if (!message) return;

    var rawHref = link.getAttribute("href") || WA_BASE;
    // 安全清理 URL，防止双斜杠或重复问号
    var cleanBase = rawHref.split("?")[0].replace(/\/+$/, "");
    link.setAttribute("href", cleanBase + "?text=" + encodeURIComponent(message));
  });

  /* ---------- Mobile navigation ---------- */
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
        // 延时关闭，保证平滑滚动体验
        setTimeout(closeNav, 150);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");
  var fab = document.getElementById("fab");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (fab) fab.classList.toggle("is-visible", y > 420);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.slice.call(
            el.parentElement ? el.parentElement.children : []
          );
          var index = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(index, 6) * 70 + "ms";
          el.classList.add("is-in");
          revealObserver.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Headline character animation (Optimized) ---------- */
  document.querySelectorAll("[data-split]").forEach(function (node) {
    var mode = node.getAttribute("data-split");
    var text = node.textContent.trim();
    if (!text) return;

    var className = mode === "pop" ? "pop-char" : "reveal-char";
    var frag = document.createDocumentFragment();

    text.split("").forEach(function (char, i) {
      var span = document.createElement("span");
      span.className = className;
      span.style.transitionDelay = i * 45 + "ms";
      span.textContent = char === " " ? "\u00A0" : char;
      frag.appendChild(span);
    });

    node.textContent = "";
    node.appendChild(frag);

    if (reduceMotion) {
      node.querySelectorAll("." + className).forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        node.querySelectorAll("." + className).forEach(function (el) {
          el.classList.add("is-in");
        });
      });
    });
  });

  /* ---------- Price count-up ---------- */
  function formatPrice(value) {
    return value.toFixed(2);
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = formatPrice(target);
      return;
    }

    var duration = 1100;
    var start = performance.now();

    function frame(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatPrice(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = formatPrice(target);
    }

    el.textContent = "0.00";
    requestAnimationFrame(frame);
  }

  var priceNodes = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  if (!("IntersectionObserver" in window)) {
    priceNodes.forEach(function (el) {
      el.textContent = formatPrice(parseFloat(el.getAttribute("data-count")));
    });
  } else {
    var priceObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          priceObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    priceNodes.forEach(function (el) {
      priceObserver.observe(el);
    });
  }

  /* ---------- Menu filtering ---------- */
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
        .some(function (card) {
          return !card.classList.contains("is-hidden");
        });
      group.style.display = visible ? "" : "none";
    });

    if (emptyNote) {
      var anyVisible = cards.some(function (card) {
        return !card.classList.contains("is-hidden");
      });
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

  /* ---------- Active nav link highlighting ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]')
  );
  var sections = navLinks
    .map(function (link) {
      var targetId = link.getAttribute("href");
      return targetId && targetId !== "#" ? document.querySelector(targetId) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* ---------- Click spark ---------- */
  if (!reduceMotion) {
    document.addEventListener("pointerdown", function (event) {
      // 避免在按钮和交互元素上重复触发或影响点击
      if (event.target.closest("button, a, input")) return;

      var spark = document.createElement("span");
      spark.className = "spark";
      spark.style.left = event.clientX + "px";
      spark.style.top = event.clientY + "px";
      spark.style.width = "22px";
      spark.style.height = "22px";
      spark.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-star" /></svg>';
      document.body.appendChild(spark);
      window.setTimeout(function () {
        spark.remove();
      }, 720);
    });
  }
})();
