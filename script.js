/**
 * WAFF - Minimalist Menu
 * Modal Details, Desktop 3D Rotary Carousel & Mobile Horizontal Swipe Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Modal
  const menuRows = document.querySelectorAll('.menu-item-row');
  const modal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');

  // DOM Elements - Mobile Tabs & Carousel Slider
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
  const menuSlider = document.getElementById('menuSlider');
  const carouselStageWrap = document.querySelector('.carousel-stage-wrap');
  const menuCols = Array.from(document.querySelectorAll('.menu-col'));
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');

  // Drag tracking flag to prevent accidental click on mouse drag
  let wasDragging = false;

  // =========================================================================
  // Modal / Lightbox Logic (Zero Sound)
  // =========================================================================
  function openModal(row) {
    // If on desktop, only open modal if row belongs to the center active column
    if (window.innerWidth > 1024) {
      if (wasDragging) return;
      const parentCol = row.closest('.menu-col');
      if (!parentCol || !parentCol.classList.contains('carousel-center')) {
        return; // Clicking side cards rotates instead of opening modal
      }
    }

    const title = row.getAttribute('data-title') || '';
    const subtitle = row.getAttribute('data-subtitle') || '';
    const price = row.getAttribute('data-price') || '';
    const desc = row.getAttribute('data-desc') || '';
    const img = row.getAttribute('data-img') || '';

    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalPrice.textContent = price;
    modalDesc.textContent = desc;

    if (img) {
      modalImg.src = img;
      modalImg.alt = title;
      modalImg.style.display = 'block';
    } else {
      modalImg.style.display = 'none';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuRows.forEach(row => {
    row.addEventListener('click', (e) => {
      // Desktop side-column clicks should be handled by column rotation
      if (window.innerWidth > 1024) {
        const parentCol = row.closest('.menu-col');
        if (parentCol && !parentCol.classList.contains('carousel-center')) {
          return;
        }
      }
      openModal(row);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(row);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // =========================================================================
  // Desktop 3D Rotary Carousel (Center Waffles initially, Circular Depth)
  // =========================================================================
  // Order of categories in DOM: 0: Waffles, 1: Toppings, 2: Drinks, 3: Extras
  let activeCenterIdx = 0; // Waffles is in center initially

  function updateDesktopCarousel() {
    if (window.innerWidth <= 1024) return;

    menuCols.forEach((col, i) => {
      col.classList.remove('carousel-center', 'carousel-left', 'carousel-right', 'carousel-hidden');

      // Circular offset from current active center
      const offset = (i - activeCenterIdx + menuCols.length) % menuCols.length;

      if (offset === 0) {
        col.classList.add('carousel-center');
      } else if (offset === 1) {
        col.classList.add('carousel-right');
      } else if (offset === menuCols.length - 1) {
        col.classList.add('carousel-left');
      } else {
        col.classList.add('carousel-hidden');
      }
    });
  }

  function rotateCarousel(direction) {
    // direction: +1 (next / rightward orbit) or -1 (prev / leftward orbit)
    activeCenterIdx = (activeCenterIdx + direction + menuCols.length) % menuCols.length;
    updateDesktopCarousel();
  }

  // Prev / Next button click handlers
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      rotateCarousel(-1);
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      rotateCarousel(1);
    });
  }

  // Click on side columns rotates them directly into center
  menuCols.forEach((col) => {
    col.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 || wasDragging) return;

      if (col.classList.contains('carousel-left')) {
        e.stopPropagation();
        rotateCarousel(-1);
      } else if (col.classList.contains('carousel-right')) {
        e.stopPropagation();
        rotateCarousel(1);
      }
    });
  });

  // Mouse Drag / Swipe on Desktop
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseDeltaX = 0;
  const stageTarget = carouselStageWrap || menuSlider;

  if (stageTarget) {
    stageTarget.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 1024) return;
      if (e.target.closest('.carousel-arrow-btn')) return;

      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseDeltaX = 0;
      wasDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown || window.innerWidth <= 1024) return;
      mouseDeltaX = e.clientX - mouseStartX;
      if (Math.abs(mouseDeltaX) > 12) {
        wasDragging = true;
        stageTarget.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown || window.innerWidth <= 1024) return;
      isMouseDown = false;
      if (stageTarget) stageTarget.style.cursor = '';

      if (wasDragging && Math.abs(mouseDeltaX) > 45) {
        if (mouseDeltaX < -45) {
          // Dragged left -> rotate next (show right card)
          rotateCarousel(1);
        } else if (mouseDeltaX > 45) {
          // Dragged right -> rotate prev (show left card)
          rotateCarousel(-1);
        }
      }

      // Reset wasDragging after brief moment to block spurious click
      setTimeout(() => {
        wasDragging = false;
      }, 100);
    });
  }

  // Keyboard Left / Right Navigation on Desktop
  window.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 1024) return;
    if (modal && modal.classList.contains('is-open')) return;

    if (e.key === 'ArrowLeft') {
      rotateCarousel(-1);
    } else if (e.key === 'ArrowRight') {
      rotateCarousel(1);
    }
  });

  // =========================================================================
  // Mobile Horizontal Swipe & Tab Switcher (No Scrollbars, Smooth Transitions)
  // =========================================================================
  let currentTabIndex = 0;
  let isProgrammaticScroll = false;
  let scrollDebounceTimer = null;

  function setActiveTab(index) {
    currentTabIndex = Math.max(0, Math.min(index, mobileTabBtns.length - 1));
    mobileTabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentTabIndex);
    });
  }

  function goToTab(index) {
    if (index < 0 || index >= menuCols.length) return;
    setActiveTab(index);

    if (menuSlider && window.innerWidth <= 1024) {
      isProgrammaticScroll = true;
      const targetCol = menuCols[index];
      if (targetCol) {
        const targetLeft = targetCol.offsetLeft - menuSlider.offsetLeft;
        menuSlider.scrollTo({
          left: targetLeft,
          behavior: 'smooth'
        });
      }
      clearTimeout(scrollDebounceTimer);
      scrollDebounceTimer = setTimeout(() => {
        isProgrammaticScroll = false;
      }, 500);
    }
  }

  // Click handler for mobile tab buttons
  mobileTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabIdx = parseInt(btn.getAttribute('data-tab'), 10);
      if (!isNaN(tabIdx)) {
        goToTab(tabIdx);
      }
    });
  });

  // Scroll synchronization (tracks finger dragging & snap on mobile)
  if (menuSlider) {
    menuSlider.addEventListener('scroll', () => {
      if (window.innerWidth > 1024 || isProgrammaticScroll) return;

      clearTimeout(scrollDebounceTimer);
      scrollDebounceTimer = setTimeout(() => {
        const sliderLeft = menuSlider.scrollLeft;
        const colWidth = menuCols[0] ? menuCols[0].offsetWidth : menuSlider.clientWidth;
        const gap = 16;
        const computedIndex = Math.round(sliderLeft / (colWidth + gap));
        const safeIndex = Math.max(0, Math.min(computedIndex, menuCols.length - 1));

        if (safeIndex !== currentTabIndex) {
          setActiveTab(safeIndex);
        }
      }, 60);
    }, { passive: true });
  }

  // Touch Swipe Gesture on Mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (menuSlider) {
    menuSlider.addEventListener('touchstart', (e) => {
      if (window.innerWidth > 1024 || e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    menuSlider.addEventListener('touchend', (e) => {
      if (window.innerWidth > 1024 || e.changedTouches.length !== 1) return;
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds minimum distance
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Swipe Left -> Next Tab
          if (currentTabIndex < menuCols.length - 1) {
            goToTab(currentTabIndex + 1);
          }
        } else {
          // Swipe Right -> Previous Tab
          if (currentTabIndex > 0) {
            goToTab(currentTabIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  // Window resize handler: switch cleanly between desktop carousel & mobile tabs
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      updateDesktopCarousel();
    } else {
      setActiveTab(currentTabIndex);
    }
  });

  // Initialize Desktop Carousel
  updateDesktopCarousel();
});
