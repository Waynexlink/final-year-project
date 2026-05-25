(function () {
  let isInitialized = false;
  const preloadedImages = new Set(); // Track preloaded images

  // Utility logger — visible in Netlify production too
  function log(...args) {
    console.log("[gallery]", ...args);
  }

  // Capture errors too
  window.addEventListener("error", (err) => {
    console.error(
      "[gallery] Global error:",
      err.message,
      err.filename,
      err.lineno,
    );
  });

  // Reset flag when navigating away (Astro View Transitions)
  document.addEventListener("astro:before-preparation", () => {
    log("Navigation detected, resetting...");
    isInitialized = false;
    preloadedImages.clear();
  });

  // ✅ NEW: Preload images to eliminate first-switch delay
  function preloadImage(src) {
    if (preloadedImages.has(src)) return;

    const img = new Image();
    img.src = src;
    preloadedImages.add(src);
    log(`🔄 Preloading image: ${src}`);
  }

  function initGallery() {
    if (isInitialized) {
      log("Already initialized, skipping...");
      return;
    }

    const mainImage = document.getElementById("mainImage");
    const thumbnails = Array.from(document.querySelectorAll(".thumbnail"));
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    log("=== Gallery Debug Report ===");
    log("Main image element:", mainImage ? "✅ found" : "❌ missing");
    log("Thumbnails found:", thumbnails.length);
    log("Prev button:", !!prevBtn, "Next button:", !!nextBtn);

    // Log each thumbnail's data-fullsrc
    thumbnails.forEach((thumb, i) => {
      log(`Thumb[${i}] data-fullsrc:`, thumb.dataset.fullsrc || "(missing)");
    });

    // Abort early if something essential is missing
    if (!mainImage || thumbnails.length === 0) {
      log("❌ Missing required DOM elements. Aborting gallery init.");
      return;
    }

    isInitialized = true;
    let currentIndex = 0;

    // ✅ Preload all gallery images immediately
    thumbnails.forEach((thumb) => {
      const fullSrc = thumb?.dataset.fullsrc;
      if (fullSrc) {
        preloadImage(fullSrc);
      }
    });

    function setActiveThumbnail(index) {
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("thumbnail-active", i === index);
      });
    }

    function updateImage(index) {
      const thumb = thumbnails[index];
      const fullSrc = thumb?.dataset.fullsrc;
      if (!fullSrc) {
        log(`⚠️ Thumbnail ${index} missing data-fullsrc`);
        return;
      }

      // ✅ Set active thumbnail AFTER image loads (or immediately if cached)
      const newImg = new Image();
      newImg.onload = () => {
        if (mainImage.src !== fullSrc) {
          log(`✅ Image loaded, updating main image → ${fullSrc}`);
          mainImage.src = fullSrc;
        }
        currentIndex = index;
        setActiveThumbnail(index);
      };

      // If already cached, this will fire immediately
      newImg.src = fullSrc;

      // If image is already in browser cache, update immediately
      if (newImg.complete) {
        if (mainImage.src !== fullSrc) {
          log(`✅ Image cached, updating main image immediately → ${fullSrc}`);
          mainImage.src = fullSrc;
        }
        currentIndex = index;
        setActiveThumbnail(index);
      }
    }

    // Attach click listeners
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        log(`🖱️ Clicked thumbnail ${index}`);
        updateImage(index);
      });
    });

    // Arrow navigation
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        const newIndex =
          (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        log("⬅️ Prev clicked → index", newIndex);
        updateImage(newIndex);
      });

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % thumbnails.length;
        log("➡️ Next clicked → index", newIndex);
        updateImage(newIndex);
      });

    setActiveThumbnail(0);
    log("✅ Gallery initialized successfully");
    log("==============================");
  }

  // Run on load
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(initGallery, 100);
  } else {
    document.addEventListener("DOMContentLoaded", initGallery, { once: true });
  }

  // Re-init after Astro page transitions
  document.addEventListener("astro:page-load", () => {
    log("astro:page-load event fired, reinitializing...");
    setTimeout(initGallery, 100);
  });
})();
