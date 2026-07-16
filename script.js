/* ===========================================================
   ZIAD BEAINO WOOD — SCRIPT.JS (Vanilla JS, no dependencies)
=========================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. PRELOADER
  --------------------------------------------------------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) {
      setTimeout(function () {
        pre.classList.add("hide");
      }, 250);
    }
  });

  /* ---------------------------------------------------------
     2. IMAGE FILE LISTS (edit here to add / remove images —
        the site rebuilds the galleries automatically)
  --------------------------------------------------------- */
  var COLLECTIONS = {
    lamaica: {
      folder: "Lamaica",
      files: ["50.png","56.png","69.png","31.png","60.png","75.png","59.png","71.png",
        "157.png","228.jpg","127.png","134.png","137.png","151.png","202.png","223.png",
        "208.png","209.png","224.png","207.png","411.png","410.png","300.png"]
    },
    glossy: {
      folder: "Glossy",
      files: ["white-glossy.png","light-grey-glossy.png","stone-grey-glossy.png",
        "dark-grey-glossy.png","creme-glossy.png","truffle-glossy.png",
        "beige-glossy.png","black-glossy.png"]
    },
    matt: {
      folder: "Matt",
      files: ["white-matt.png","beige-matt.png","cashmere-matt.png","light-grey-matt.png",
        "dark-grey-matt.png","grey-matt.png","light-blue-matt.png","navy-blue-matt.png",
        "green-matt.png","petrol-matt.png"]
    },
    "high-quality": {
      folder: "High-Quality",
      files: ["u566.png","u570.png","u544.png","u514.png","u191.png","u190.png","u171.png",
        "u162.png","u164.png","u119.png","u159.png","u148.png","u120.png","u2645.png",
        "u2644.png","u2508.png","u3824.png","u3189.png","u3188.png","u4810.png","u4439.png",
        "u4437.png","u10020.png","u6933.png","u4821.png","d70060.png","d70050.png",
        "d30511.png","d30220.png","d30180.png","d30160.png","d30100.png","d30090.png",
        "d30080.png","d20571.png","d20551.png","d20541.png","d20230.png","d20210.png",
        "d20200.png","d20150.png","d20130.png","d20120.png","d4822.png","d4454.png",
        "d4452.png","d4448.png","d4432.png","d4412.png","d4104.png","d4103.png","d4102.png",
        "d4100.png","d4096.png","d4095.png","d3821.png","d3820.png","d3818.png","d3813.png",
        "d3810.png","d3801.png","d3800.png","d3799.png","d3798.png","d3700.png","d3274.png",
        "d2831.png","d2568.png","d2506.png","d2293.png","d2240.png","d1096.png","d1094.png",
        "d853.png","d541.png"]
    },
    "side-project": {
      folder: "Side Project",
      files: ["01.jpg","02.png","03.png","04.jpg","05.jpg","06.jpg","07.jpg","08.jpg",
        "09.jpg","10.jpg","11.png","12.png","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg",
        "18.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg",
        "27.jpg","28.jpg","29.jpg","30.jpg","31.jpg","32.jpg","33.jpg","34.jpg","35.jpg"]
    }
  };

  var GRID_IDS = {
    lamaica: "lamaicaGrid",
    glossy: "glossyGrid",
    matt: "mattGrid",
    "high-quality": "hqGrid",
    "side-project": "sideGrid"
  };

  function labelFromFilename(name) {
    var base = name.replace(/\.[^/.]+$/, "");
    base = base.replace(/[-_]/g, " ").trim();
    return base.charAt(0).toUpperCase() + base.slice(1);
  }

  /* Flat list of every image, used by the lightbox for prev/next */
  var ALL_IMAGES = [];

  function buildGalleries() {
    Object.keys(COLLECTIONS).forEach(function (key) {
      var config = COLLECTIONS[key];
      var grid = document.getElementById(GRID_IDS[key]);
      if (!grid) return;

      var frag = document.createDocumentFragment();

      config.files.forEach(function (file) {
        var src = "image/" + config.folder + "/" + file;
        var label = labelFromFilename(file);

        var tile = document.createElement("div");
        tile.className = "tile loading";

        var img = document.createElement("img");
        img.src = src;
        img.alt = label;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 160;
        img.height = 160;
        img.addEventListener("load", function () { tile.classList.remove("loading"); });
        img.addEventListener("error", function () { tile.classList.remove("loading"); tile.classList.add("missing"); });

        var overlay = document.createElement("div");
        overlay.className = "tile-overlay";
        var span = document.createElement("span");
        span.textContent = label;
        overlay.appendChild(span);

        tile.appendChild(img);
        tile.appendChild(overlay);

        var globalIndex = ALL_IMAGES.length;
        tile.addEventListener("click", function () {
          openLightbox(globalIndex);
        });

        ALL_IMAGES.push({ src: src, caption: label + " — " + config.folder });

        frag.appendChild(tile);
      });

      grid.appendChild(frag);
    });
  }

  /* ---------------------------------------------------------
     3. LIGHTBOX
  --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentIndex = 0;

  function openLightbox(index) {
    if (!ALL_IMAGES.length) return;
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    var item = ALL_IMAGES[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    currentIndex = (currentIndex + delta + ALL_IMAGES.length) % ALL_IMAGES.length;
    renderLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", function () { stepLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { stepLightbox(1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------------------------------------------------------
     4. NAV TOGGLE (mobile)
  --------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  function closeNav() {
    mainNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------------------------------------------------------
     5. STICKY HEADER SHRINK ON SCROLL
  --------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     6. ACTIVE NAV LINK ON SCROLL (scrollspy)
  --------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id], .hero[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("active-link", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------------------------------------------------------
     7. SCROLL REVEAL ANIMATIONS
  --------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------
     8. CONTACT FORM (client-side only — no backend)
  --------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        formNote.textContent = "Please fill in the required fields.";
        formNote.style.color = "#b5473f";
        return;
      }
      formNote.style.color = "";
      formNote.textContent = "Thanks — your message has been received. We'll be in touch shortly.";
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     9. FOOTER YEAR
  --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     10. INIT
  --------------------------------------------------------- */
  buildGalleries();

})();
