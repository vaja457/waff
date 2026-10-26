/**
 * WAFF - Minimalist Menu
 * Modal / Lightbox Logic & Smooth Mobile Tabs (Sound Disabled)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const menuRows = document.querySelectorAll('.menu-item-row');
  const modal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');

  // Open Modal with Product Details
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

  // Close Modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Attach click listeners to all menu rows
  menuRows.forEach(row => {
    row.addEventListener('click', () => openModal(row));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(row);
      }
    });
  });

  // Close button click
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Click outside modal card to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Mobile Tabs Smooth Scrolling & Active State
  mobileTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      mobileTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const sections = [
    { id: 'colWaffles', tab: mobileTabBtns[0] },
    { id: 'colDrinks', tab: mobileTabBtns[1] },
    { id: 'colToppings', tab: mobileTabBtns[2] }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(({ id, tab }) => {
      const el = document.getElementById(id);
      if (el && tab) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          mobileTabBtns.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
        }
      }
    });
  }, { passive: true });
});
