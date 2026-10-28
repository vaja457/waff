/**
 * WAFF - Minimalist Menu
 * Modal Details, Real-Time Interactive 3D Rotary Carousel & Mobile Horizontal Swipe Tabs
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
  let dragBlockTimer = null;

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
    row.addEventListener('click', () => {
      if (window.innerWidth > 1024) {
        if (wasDragging) return;
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
  // Desktop Real-Time 3D Rotary Carousel (Direct Mouse Drag Sync)
  // =========================================================================
  // Column order: 0: Waffles, 1: Toppings, 2: Drinks, 3: Extras
  let activeCenterIdx = 0; // Waffles initially in center
  let currentAngle = 0;
  let isDraggingMouse = false;
  let dragStartX = 0;
  let dragStartAngle = 0;
  let snapAnimationTimer = null;

  // Calculates 3D geometry for any continuous angle A
  function renderCarouselAngle(angle, withTransition = false) {
    if (window.innerWidth <= 1024) return;

    const stageTarget = carouselStageWrap || menuSlider;
    const stageWidth = stageTarget ? stageTarget.clientWidth : window.innerWidth;
    const Rx = Math.max(340, Math.min(435, stageWidth * 0.295));
    const Rz = 100;

    menuCols.forEach((col, i) => {
      // Relative angular offset from front center
      let rel = (i * 90 - angle) % 360;
      if (rel > 180) rel -= 360;
      if (rel < -180) rel += 360;

      const rad = rel * (Math.PI / 180);
      const cosVal = Math.cos(rad);
      const sinVal = Math.sin(rad);

      const x = sinVal * Rx;
      const z = (cosVal - 1) * Rz; // 0 at center, -100px at sides, -200px at back
      const scale = 0.70 + 0.30 * ((1 + cosVal) / 2); // 1.0 at center, 0.85 at sides, 0.70 at back
      const rotY = -sinVal * 13.5;

      let opacity;
      if (cosVal >= 0) {
        opacity = 0.55 + 0.45 * cosVal;
      } else {
        opacity = Math.max(0, 0.55 * Math.pow(1 + cosVal, 1.6));
      }

      const blur = Math.max(0, (1 - cosVal) * 3.5);
      const zIndex = Math.round(1 + 14 * ((1 + cosVal) / 2));

      if (withTransition) {
        col.style.transition = 'transform 0.48s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.42s ease, filter 0.42s ease';
      } else {
        col.style.transition = 'none';
      }

      col.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(2)}deg)`;
      col.style.filter = `blur(${blur.toFixed(1)}px)`;
      col.style.opacity = opacity.toFixed(3);
      col.style.zIndex = zIndex;
      col.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
      col.style.pointerEvents = Math.abs(rel) < 105 ? 'auto' : 'none';
      col.style.cursor = Math.abs(rel) < 15 ? 'default' : (Math.abs(rel) < 105 ? 'pointer' : 'default');
    });
  }

  // Updates helper CSS classes based on current activeCenterIdx
  function updateCarouselClasses() {
    if (window.innerWidth <= 1024) return;

    menuCols.forEach((col, i) => {
      col.classList.remove('carousel-center', 'carousel-left', 'carousel-right', 'carousel-hidden');
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

  // Smoothly snaps the carousel to a target angle and updates state
  function snapCarouselToAngle(targetAngle) {
    clearTimeout(snapAnimationTimer);

    renderCarouselAngle(targetAngle, true);

    snapAnimationTimer = setTimeout(() => {
      currentAngle = ((targetAngle % 360) + 360) % 360;
      activeCenterIdx = (Math.round(currentAngle / 90) % menuCols.length + menuCols.length) % menuCols.length;
      updateCarouselClasses();

      // Clear inline styles after snap transition finishes so CSS rules take over
      menuCols.forEach((col) => {
        col.style.transform = '';
        col.style.filter = '';
        col.style.opacity = '';
        col.style.zIndex = '';
        col.style.visibility = '';
        col.style.transition = '';
        col.style.cursor = '';
        col.style.pointerEvents = '';
      });
    }, 480);
  }

  function rotateCarousel(direction) {
    // direction: +1 (next / rightward) or -1 (prev / leftward)
    const baseAngle = activeCenterIdx * 90;
    const targetAngle = baseAngle + direction * 90;
    
    // Set starting position explicitly before transition
    renderCarouselAngle(baseAngle, false);
    
    // Force DOM reflow so transition animates smoothly
    void menuCols[0].offsetHeight;

    snapCarouselToAngle(targetAngle);
  }

  // Prev & Next Buttons
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

  // Clicking side columns rotates them into center
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

  // Real-Time Mouse Dragging & Gesture Sync
  const stageTarget = carouselStageWrap || menuSlider;

  if (stageTarget) {
    stageTarget.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 1024) return;
      if (e.target.closest('.carousel-arrow-btn')) return;

      isDraggingMouse = true;
      wasDragging = false;
      dragStartX = e.clientX;
      dragStartAngle = activeCenterIdx * 90;

      // Prepare cards for real-time tracking
      renderCarouselAngle(dragStartAngle, false);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingMouse || window.innerWidth <= 1024) return;

      const deltaX = e.clientX - dragStartX;

      if (Math.abs(deltaX) > 6) {
        wasDragging = true;
        stageTarget.style.cursor = 'grabbing';

        // Sensitivity: ~300px horizontal drag corresponds to 1 full 90deg step
        const angleDelta = -(deltaX / 300) * 90;
        const liveAngle = dragStartAngle + angleDelta;
        currentAngle = liveAngle;

        // Directly sync carousel in real-time with mouse movement!
        renderCarouselAngle(liveAngle, false);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDraggingMouse || window.innerWidth <= 1024) return;
      isDraggingMouse = false;
      if (stageTarget) stageTarget.style.cursor = '';

      if (wasDragging) {
        const deltaX = e.clientX - dragStartX;
        let targetAngle = dragStartAngle;

        // If dragged more than threshold, advance to next / prev
        if (deltaX < -35) {
          targetAngle = dragStartAngle + 90;
        } else if (deltaX > 35) {
          targetAngle = dragStartAngle - 90;
        } else {
          // Snap back to nearest 90-degree step
          targetAngle = Math.round(currentAngle / 90) * 90;
        }

        snapCarouselToAngle(targetAngle);

        // Keep wasDragging flag active briefly to block accidental item clicks
        clearTimeout(dragBlockTimer);
        dragBlockTimer = setTimeout(() => {
          wasDragging = false;
        }, 120);
      }
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

  mobileTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabIdx = parseInt(btn.getAttribute('data-tab'), 10);
      if (!isNaN(tabIdx)) {
        goToTab(tabIdx);
      }
    });
  });

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

  // Touch Swipe on Mobile
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

      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          if (currentTabIndex < menuCols.length - 1) {
            goToTab(currentTabIndex + 1);
          }
        } else {
          if (currentTabIndex > 0) {
            goToTab(currentTabIndex - 1);
          }
        }
      }
    }, { passive: true });
  }

  // Window Resize: Cleanly switch between Desktop 3D Rotary & Mobile Tabs
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      updateCarouselClasses();
    } else {
      // Clear any desktop inline styles on mobile
      menuCols.forEach((col) => {
        col.style.transform = '';
        col.style.filter = '';
        col.style.opacity = '';
        col.style.zIndex = '';
        col.style.visibility = '';
        col.style.transition = '';
        col.style.cursor = '';
        col.style.pointerEvents = '';
      });
      setActiveTab(currentTabIndex);
    }
  });

  // Initialize Desktop State
  updateCarouselClasses();
});
