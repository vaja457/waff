/**
 * WAFF - Minimalist Menu
 * Modal Details & Mobile Horizontal Swipeable Tabs Controller
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

  // DOM Elements - Mobile Tabs & Slider
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');
  const menuSlider = document.getElementById('menuSlider');
  const menuCols = document.querySelectorAll('.menu-col');

  // =========================================================================
  // Modal / Lightbox Logic (Zero Sound)
  // =========================================================================
  function openModal(row) {
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
    row.addEventListener('click', () => openModal(row));
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

  // Click handler for tab buttons
  mobileTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabIdx = parseInt(btn.getAttribute('data-tab'), 10);
      if (!isNaN(tabIdx)) {
        goToTab(tabIdx);
      }
    });
  });

  // Scroll synchronization (tracks finger dragging & snap)
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

  // Touch Swipe Gesture (Quick Finger Flick Navigation)
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
});
