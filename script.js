/**
 * WAFF - ვაფლის კლუბი
 * Interactive Experience, Menu Showcase, Audio & Theme Logic
 */

// Featured Waffles Data for Hero Showcase (Slide 0)
const waffleProducts = [
  {
    id: 1,
    name: "ბელგიური კლასიკა",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: "₾ 14.90",
    heroImage: "images/waffle-hero-1.png",
    thumbImage: "images/thumb-1.jpg"
  },
  {
    id: 2,
    name: "შოკოლადის ვულკანი",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: "₾ 16.50",
    heroImage: "images/waffle-hero-2.png",
    thumbImage: "images/thumb-2.jpg"
  },
  {
    id: 3,
    name: "კარამელი & პეკანი",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: "₾ 15.90",
    heroImage: "images/waffle-hero-3.png",
    thumbImage: "images/thumb-3.jpg"
  },
  {
    id: 4,
    name: "ტყის კენკრა",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: "₾ 15.50",
    heroImage: "images/waffle-hero-4.png",
    thumbImage: "images/thumb-4.jpg"
  }
];

// State: 3 Slides (0: მთავარი, 1: მენიუ, 2: ჩვენ შესახებ)
let currentSlide = 0;
let currentWaffleIndex = 0;
let soundEnabled = true;
let audioCtx = null;
let isThrottled = false;

// DOM Elements
const carouselViewport = document.getElementById('carouselViewport');
const carouselTrack = document.getElementById('carouselTrack');
const navMenu = document.getElementById('navMenu');
const navIndicatorBox = document.getElementById('navIndicatorBox');
const navLinks = document.querySelectorAll('.nav-link');
const siteDotBtns = document.querySelectorAll('.site-dot-btn');
const bottomDotsNav = document.getElementById('bottomDotsNav');
const edgeDrawerRight = document.getElementById('edgeDrawerRight');
const edgeDrawerLeft = document.getElementById('edgeDrawerLeft');
const thumbCards = document.querySelectorAll('.thumb-card');
const mainHeroWaffle = document.getElementById('mainHeroWaffle');
const heroEyebrow = document.getElementById('heroEyebrow');
const heroSlogan = document.getElementById('heroSlogan');
const waffleFloater = document.getElementById('waffleFloater');
const stageContainer = document.getElementById('stageContainer');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundOnIcon = document.getElementById('soundOnIcon');
const soundOffIcon = document.getElementById('soundOffIcon');
const shadeBtns = document.querySelectorAll('.shade-btn');

// Menu & Modal Elements
const sectionMenu = document.getElementById('section-menu');
const menuItemCards = document.querySelectorAll('.menu-item-card');
const catPillBtns = document.querySelectorAll('.cat-pill-btn');
const menuModal = document.getElementById('menuModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalCategoryBadge = document.getElementById('modalCategoryBadge');
const modalBadge = document.getElementById('modalBadge');
const modalDesc = document.getElementById('modalDesc');

// ========================================================
// Audio Synthesis & Playback (Web Audio API & Authentic Crunch)
// ========================================================
function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function initAudioUnlock() {
  const unlock = () => {
    try {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
  };
  ['click', 'pointerdown', 'mousedown', 'keydown', 'wheel', 'touchstart'].forEach(type => {
    window.addEventListener(type, unlock, { passive: true });
  });
}
initAudioUnlock();

// 1. Subtle Bubble UI Note Sound (Clicks & Transitions)
function playBubbleSound(freq = 600, duration = 0.08) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// 2. Authentic Waffle Crunch Audio
const WAFFLE_CRUNCH_AUDIO_URI = "data:audio/mp3;base64,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";

const CRUNCH_POOL_SIZE = 4;
const crunchAudioPool = [];
let crunchPoolIndex = 0;

for (let i = 0; i < CRUNCH_POOL_SIZE; i++) {
  const audio = new Audio('audio/crunch.mp3');
  audio.preload = 'auto';
  audio.onerror = () => { audio.src = WAFFLE_CRUNCH_AUDIO_URI; };
  crunchAudioPool.push(audio);
}

function playWaffleCrunchSound() {
  if (!soundEnabled) return;
  try {
    const audio = crunchAudioPool[crunchPoolIndex];
    audio.currentTime = 0;
    audio.playbackRate = 0.95 + Math.random() * 0.15;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
    crunchPoolIndex = (crunchPoolIndex + 1) % CRUNCH_POOL_SIZE;
  } catch (e) {}
}

// ========================================================
// Hero Showcase: Featured Waffle Selector (Slide 0)
// ========================================================
function setFeaturedWaffle(index) {
  if (index < 0 || index >= waffleProducts.length) return;
  currentWaffleIndex = index;
  const waffle = waffleProducts[index];

  playBubbleSound(480 + index * 80, 0.08);

  thumbCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });

  if (heroEyebrow) heroEyebrow.textContent = waffle.eyebrow;
  if (heroSlogan) heroSlogan.textContent = waffle.slogan;

  if (mainHeroWaffle) {
    mainHeroWaffle.style.transform = 'scale(0.85) rotate(-5deg)';
    mainHeroWaffle.style.opacity = '0.3';
    setTimeout(() => {
      mainHeroWaffle.src = waffle.heroImage;
      mainHeroWaffle.alt = waffle.name;
      mainHeroWaffle.style.transform = 'scale(1) rotate(0deg)';
      mainHeroWaffle.style.opacity = '1';
    }, 180);
  }
}

// ========================================================
// Gliding Navigation Rectangle Indicator
// ========================================================
function updateNavIndicator(targetIndex = currentSlide) {
  if (!navIndicatorBox || !navLinks || navLinks.length === 0) return;
  const targetLink = navLinks[targetIndex];
  if (!targetLink) return;

  const linkRect = targetLink.getBoundingClientRect();
  const menuRect = navMenu.getBoundingClientRect();

  navIndicatorBox.style.left = `${linkRect.left - menuRect.left}px`;
  navIndicatorBox.style.top = `${linkRect.top - menuRect.top}px`;
  navIndicatorBox.style.width = `${linkRect.width}px`;
  navIndicatorBox.style.height = `${linkRect.height}px`;
  navIndicatorBox.style.opacity = '1';

  navLinks.forEach((link, idx) => {
    link.classList.toggle('is-indicated', idx === targetIndex);
  });
}

// Smooth gliding navigation indicator with continuous seamless mouse tracking
let currentHoveredNavIdx = null;

function getClosestNavIndex(clientX) {
  if (!navLinks || navLinks.length === 0) return currentSlide;
  let closestIdx = 0;
  let minDistance = Infinity;
  navLinks.forEach((link, idx) => {
    const rect = link.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dist = Math.abs(clientX - centerX);
    if (dist < minDistance) {
      minDistance = dist;
      closestIdx = idx;
    }
  });
  return closestIdx;
}

if (navMenu) {
  // Continuous tracking across the tabs and gaps: yellow pill follows the mouse without jitter
  navMenu.addEventListener('mousemove', (e) => {
    const closestIdx = getClosestNavIndex(e.clientX);
    if (currentHoveredNavIdx !== closestIdx) {
      currentHoveredNavIdx = closestIdx;
      updateNavIndicator(closestIdx);
      playBubbleSound(700 + closestIdx * 50, 0.05);
    }
  });

  // Smoothly return indicator to the active slide when mouse leaves the entire nav area
  navMenu.addEventListener('mouseleave', () => {
    currentHoveredNavIdx = null;
    updateNavIndicator(currentSlide);
  });

  // Clicking anywhere in the tab hit bridge navigates to the closest tab
  navMenu.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-link')) {
      const closestIdx = getClosestNavIndex(e.clientX);
      goToSlide(closestIdx);
    }
  });
}

// Direct link clicks
navLinks.forEach((link, idx) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(idx);
  });
});

window.addEventListener('resize', () => {
  updateNavIndicator(currentSlide);
  goToSlide(currentSlide);
});

// ========================================================
// 3 Slides Carousel Navigation (0: მთავარი, 1: მენიუ, 2: ჩვენ შესახებ)
// ========================================================
function goToSlide(slideIndex) {
  if (slideIndex < 0 || slideIndex > 2) return;
  isPointerDown = false;
  isDragging = false;
  currentSlide = slideIndex;

  if (slideIndex === 2) {
    const secAbout = document.getElementById('section-about');
    if (secAbout) secAbout.scrollTop = 0;
  } else if (slideIndex === 1) {
    const secMenu = document.getElementById('section-menu');
    if (secMenu) secMenu.scrollTop = 0;
  }

  playBubbleSound(520 + slideIndex * 90, 0.08);

  // Smooth Horizontal Translate across 3 slides
  carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
  carouselTrack.style.transform = `translateX(-${slideIndex * 100}vw)`;

  // Update Top Navbar Active Tab
  navLinks.forEach((link, idx) => {
    link.classList.toggle('active', idx === slideIndex);
  });
  updateNavIndicator(slideIndex);

  // Update Mobile Drawer Nav Active Tab
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === slideIndex);
  });

  // Update 3 Bottom Center Dots
  siteDotBtns.forEach((dot, idx) => {
    const isActive = (idx === slideIndex);
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update Persistent Left Category Rail Visibility (Active on Slide 1: Menu)
  const menuCategoryRail = document.getElementById('menuCategoryRail');
  if (menuCategoryRail) {
    menuCategoryRail.classList.toggle('is-visible', slideIndex === 1);
  }

  // If entering Menu tab, ensure Waffles category is shown directly and active
  if (slideIndex === 1) {
    if (sectionMenu) {
      sectionMenu.scrollTop = 0;
    }
    updateActiveCategoryRail();
  }
}

function nextSlide() {
  if (currentSlide < 2) {
    goToSlide(currentSlide + 1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

// Click handlers for bottom dots
siteDotBtns.forEach((dot) => {
  dot.addEventListener('click', () => {
    const slideIdx = parseInt(dot.dataset.slide, 10);
    goToSlide(slideIdx);
  });
});

// ========================================================
// Mobile Hamburger & Drawer Menu Controls
// ========================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
const mobileDrawerCloseBtn = document.getElementById('mobileDrawerCloseBtn');
const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

function openMobileDrawer() {
  if (!mobileDrawerOverlay) return;
  playBubbleSound(600, 0.06);
  mobileDrawerOverlay.classList.add('is-open');
  mobileDrawerOverlay.setAttribute('aria-hidden', 'false');
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.add('is-active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
}

function closeMobileDrawer() {
  if (!mobileDrawerOverlay) return;
  playBubbleSound(480, 0.05);
  mobileDrawerOverlay.classList.remove('is-open');
  mobileDrawerOverlay.setAttribute('aria-hidden', 'true');
  if (mobileMenuBtn) {
    mobileMenuBtn.classList.remove('is-active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    if (mobileDrawerOverlay && mobileDrawerOverlay.classList.contains('is-open')) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });
}

if (mobileDrawerCloseBtn) {
  mobileDrawerCloseBtn.addEventListener('click', closeMobileDrawer);
}
if (mobileDrawerBackdrop) {
  mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);
}

mobileNavItems.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetIdx = parseInt(btn.dataset.slideTarget, 10);
    goToSlide(targetIdx);
    closeMobileDrawer();
  });
});

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
  if (menuModal && menuModal.classList.contains('is-open')) {
    if (e.key === 'Escape') {
      closeMenuModal();
    }
    return;
  }
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// ========================================================
// Wheel Navigation: Allows natural vertical scroll on Menu!
// ========================================================
window.addEventListener('wheel', (e) => {
  // If user is on Slide 1 (Menu) or Slide 2 (About Us), allow natural vertical scroll without hindrance!
  if (currentSlide === 1 || currentSlide === 2) {
    return;
  }

  if (e.cancelable) e.preventDefault();
  if (isThrottled) return;

  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(delta) < 25) return;

  isThrottled = true;
  if (delta > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
  setTimeout(() => { isThrottled = false; }, 650);
}, { passive: false });

// ========================================================
// Touch / Mouse Drag Gesture for Slides
// ========================================================
let isPointerDown = false;
let isDragging = false;
let hasMoved = false;
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let dragStartTime = 0;
let suppressClickUntil = 0;

window.addEventListener('click', (e) => {
  if (Date.now() < suppressClickUntil) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

window.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

const viewportEl = carouselViewport || window;

viewportEl.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  // On Slide 1 (Menu) and Slide 2 (About Us), allow natural vertical scrolling & interaction.
  // Never initiate global horizontal slide drag from Slide 1 or Slide 2, avoiding empty space shifts.
  if (currentSlide === 1 || currentSlide === 2) {
    return;
  }

  // Don't drag if clicking directly on fixed UI controls, menu, rails or modals
  if (e.target.closest('.main-header, .quick-toolbar, .bottom-center-dots, .menu-modal-overlay, .category-nav-pills, #section-menu, .site-section.section-menu, #section-about, .site-section.section-about, .menu-category-rail, .category-carousel, .category-carousel-track, .menu-item-card, .mobile-drawer-overlay, .mobile-menu-btn')) {
    return;
  }

  isPointerDown = true;
  isDragging = false;
  hasMoved = false;
  startX = e.clientX;
  startY = e.clientY;
  deltaX = 0;
  deltaY = 0;
  dragStartTime = Date.now();
});

window.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;

  // If currently on Slide 1 or Slide 2, immediately cancel any global slide drag
  if (currentSlide === 1 || currentSlide === 2) {
    isPointerDown = false;
    isDragging = false;
    return;
  }

  deltaX = e.clientX - startX;
  deltaY = e.clientY - startY;

  if (!hasMoved) {
    const distSq = deltaX * deltaX + deltaY * deltaY;
    if (distSq > 36) {
      if (Math.abs(deltaX) >= Math.abs(deltaY) * 0.8) {
        hasMoved = true;
        isDragging = true;
        if (carouselViewport) carouselViewport.classList.add('is-dragging');
        document.body.classList.add('is-dragging');
        carouselTrack.style.transition = 'none';
      } else {
        isPointerDown = false;
        return;
      }
    }
  }

  if (isDragging) {
    if (e.cancelable) e.preventDefault();
    // Strictly forbid dragging past boundary slides into empty void
    if (currentSlide === 0 && deltaX > 0) deltaX = 0;
    if (currentSlide >= 2 && deltaX < 0) deltaX = 0;
    const currentOffsetPx = -currentSlide * window.innerWidth;
    carouselTrack.style.transform = `translateX(${currentOffsetPx + deltaX}px)`;
  }
}, { passive: false });

function handlePointerUpOrCancel() {
  if (!isPointerDown && !isDragging) return;

  const wasDragging = isDragging;
  isPointerDown = false;
  isDragging = false;
  hasMoved = false;

  if (carouselViewport) carouselViewport.classList.remove('is-dragging');
  document.body.classList.remove('is-dragging');

  if (wasDragging) {
    suppressClickUntil = Date.now() + 200;
    const duration = Math.max(1, Date.now() - dragStartTime);
    const velocity = deltaX / duration;
    const distanceThreshold = Math.min(100, window.innerWidth * 0.1);

    if (deltaX < -distanceThreshold || velocity < -0.28) {
      if (currentSlide < 2) {
        nextSlide();
      } else {
        carouselTrack.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        goToSlide(currentSlide);
      }
    } else if (deltaX > distanceThreshold || velocity > 0.28) {
      if (currentSlide > 0) {
        prevSlide();
      } else {
        carouselTrack.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        goToSlide(currentSlide);
      }
    } else {
      carouselTrack.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      goToSlide(currentSlide);
    }
  }
}

window.addEventListener('pointerup', handlePointerUpOrCancel);
window.addEventListener('pointercancel', handlePointerUpOrCancel);

// ========================================================
// Hero Showcase Thumbnail Click
// ========================================================
thumbCards.forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.dataset.waffleIndex, 10);
    setFeaturedWaffle(idx);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const idx = parseInt(card.dataset.waffleIndex, 10);
      setFeaturedWaffle(idx);
    }
  });
});

// Hero Waffle Click -> Play Crunch Sound & Bounce
if (mainHeroWaffle) {
  mainHeroWaffle.addEventListener('click', () => {
    playWaffleCrunchSound();
    mainHeroWaffle.style.transform = 'scale(1.08)';
    setTimeout(() => { mainHeroWaffle.style.transform = ''; }, 200);
  });
}

// Parallax 3D Tilt on Hero Visual
if (stageContainer) {
  stageContainer.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const rect = stageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 12;
    const rotY = (x / rect.width) * 14;

    if (waffleFloater) {
      waffleFloater.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    }
  });

  stageContainer.addEventListener('mouseleave', () => {
    if (waffleFloater) {
      waffleFloater.style.transform = '';
    }
  });
}

// ========================================================
// Menu Category Rail Navigation, ScrollSync & Carousel Controls
// ========================================================
const catRailBtns = document.querySelectorAll('.cat-rail-btn');
const categorySections = document.querySelectorAll('.menu-category-section');

function updateActiveCategoryRail() {
  if (!sectionMenu || categorySections.length === 0) return;
  const scrollPos = sectionMenu.scrollTop + 140;
  let currentCatId = 'cat-waffles';

  categorySections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) {
      currentCatId = sec.id;
    }
  });

  catRailBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === currentCatId);
  });
}

if (sectionMenu) {
  sectionMenu.addEventListener('scroll', updateActiveCategoryRail, { passive: true });
}

// Clicking a Category Rail button smoothly scrolls sectionMenu directly to that category
catRailBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playBubbleSound(660, 0.06);
    const targetCatId = btn.dataset.cat;
    const targetEl = document.getElementById(targetCatId);
    if (targetEl && sectionMenu) {
      sectionMenu.scrollTo({
        top: targetEl.offsetTop - 68,
        behavior: 'smooth'
      });
    }
  });
});

// Category Carousel Navigation (Arrow Buttons)
const carouselArrowBtns = document.querySelectorAll('.carousel-arrow-btn');
carouselArrowBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    playBubbleSound(720, 0.05);
    const targetCat = btn.dataset.target;
    const track = document.getElementById(`track-${targetCat}`);
    if (track) {
      const card = track.querySelector('.menu-item-card');
      const cardWidth = card ? (card.offsetWidth + 24) : 360;
      const direction = btn.classList.contains('prev') ? -1 : 1;
      track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    }
  });
});

// Horizontal Mouse Drag-to-Scroll for Carousel Tracks
const carouselTracks = document.querySelectorAll('.category-carousel-track');
carouselTracks.forEach(track => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  track.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  track.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.view-details-link') || e.target.closest('button')) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      track.classList.remove('is-dragging');
    }
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 6) {
      hasDragged = true;
    }
    track.scrollLeft = scrollLeft - walk;
  });

  // Prevent unwanted modal open click when user was swiping/dragging horizontally
  track.addEventListener('click', (e) => {
    if (hasDragged) {
      e.stopImmediatePropagation();
      e.preventDefault();
      hasDragged = false;
    }
  }, true);
});

// ========================================================
// Menu Product Cards & Lightbox Modal Popup
// ========================================================
function openMenuModal(card) {
  if (!menuModal) return;

  playWaffleCrunchSound();

  const title = card.dataset.title || '';
  const price = card.dataset.price || '';
  const image = card.dataset.image || '';
  const category = card.dataset.category || '';
  const detailedDesc = card.dataset.detailedDesc || card.dataset.shortDesc || '';
  const badge = card.dataset.badge || 'საფირმო რეცეპტი';

  if (modalTitle) modalTitle.textContent = title;
  if (modalPrice) modalPrice.textContent = price;
  if (modalCategoryBadge) modalCategoryBadge.textContent = category;
  if (modalBadge) modalBadge.textContent = badge;
  if (modalDesc) modalDesc.textContent = detailedDesc;
  if (modalImg) {
    modalImg.src = image;
    modalImg.alt = title;
  }

  menuModal.classList.add('is-open');
  menuModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-active');
}

function closeMenuModal() {
  if (!menuModal) return;
  playBubbleSound(480, 0.06);
  menuModal.classList.remove('is-open');
  menuModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-active');
}

menuItemCards.forEach(card => {
  card.addEventListener('click', () => {
    openMenuModal(card);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenuModal(card);
    }
  });
});

// Event delegation for menu cards
if (sectionMenu) {
  sectionMenu.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-item-card');
    if (card) {
      openMenuModal(card);
    }
  });
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeMenuModal);
}

if (menuModal) {
  menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
      closeMenuModal();
    }
  });
}

// ========================================================
// 3 Theme Switcher (Dark Obsidian, Caramel Sunset, Bakery Light)
// ========================================================
const mobileShadeBtns = document.querySelectorAll('.mobile-shade-btn');

function applyTheme(theme) {
  document.body.classList.remove('theme-honey', 'theme-transitional', 'theme-light');
  document.body.classList.add(theme);

  document.documentElement.classList.remove('theme-honey', 'theme-transitional', 'theme-light');
  document.documentElement.classList.add(theme);

  const themeColors = {
    'theme-honey': '#0B0711',
    'theme-transitional': '#24130A',
    'theme-light': '#FFFDF8'
  };
  const themeMeta = document.getElementById('themeColorMeta');
  if (themeMeta && themeColors[theme]) {
    themeMeta.setAttribute('content', themeColors[theme]);
  }

  shadeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  mobileShadeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === theme));

  updateNavIndicator(currentSlide);
  try { localStorage.setItem('waff-theme-v5', theme); } catch(e) {}
}

shadeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playBubbleSound(680, 0.06);
    applyTheme(btn.dataset.theme);
  });
});

mobileShadeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playBubbleSound(680, 0.06);
    applyTheme(btn.dataset.theme);
  });
});

// Restore saved theme on load
try {
  const savedTheme = localStorage.getItem('waff-theme-v5');
  if (savedTheme && ['theme-honey', 'theme-transitional', 'theme-light'].includes(savedTheme)) {
    applyTheme(savedTheme);
  }
} catch(e) {}

// Sound Effects Toggle Button (Desktop & Mobile Drawer)
const mobileSoundToggleBtn = document.getElementById('mobileSoundToggleBtn');
const mobileSoundStatusText = document.getElementById('mobileSoundStatusText');

function updateSoundUI() {
  if (soundOnIcon) soundOnIcon.style.display = soundEnabled ? 'block' : 'none';
  if (soundOffIcon) soundOffIcon.style.display = soundEnabled ? 'none' : 'block';
  if (mobileSoundStatusText) {
    mobileSoundStatusText.textContent = soundEnabled ? 'ჩართულია 🔔' : 'გამორთულია 🔕';
  }
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    updateSoundUI();
    if (soundEnabled) {
      playWaffleCrunchSound();
    }
  });
}

if (mobileSoundToggleBtn) {
  mobileSoundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    updateSoundUI();
    if (soundEnabled) {
      playWaffleCrunchSound();
    }
  });
}

// Initial setup
setFeaturedWaffle(0);
goToSlide(0);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    updateNavIndicator(currentSlide);
  });
}
window.addEventListener('load', () => {
  updateNavIndicator(currentSlide);
});

// ========================================================
// Dynamic Menu Rendering from menu-data.js (Live Admin Sync)
// ========================================================
function renderDynamicMenu() {
  if (typeof getStoredMenu !== 'function') return;
  const items = getStoredMenu();
  if (!Array.isArray(items) || items.length === 0) return;

  const categoryMap = {
    'ვაფლები': { trackId: 'track-cat-waffles', sectionId: 'cat-waffles', countNoun: 'სახეობა' },
    'ტოპინგები': { trackId: 'track-cat-toppings', sectionId: 'cat-toppings', countNoun: 'სახეობა' },
    'სასმელები': { trackId: 'track-cat-drinks', sectionId: 'cat-drinks', countNoun: 'სახეობა' },
    'ექსტრა': { trackId: 'track-cat-extras', sectionId: 'cat-extras', countNoun: 'სახეობა' }
  };

  Object.entries(categoryMap).forEach(([catName, cfg]) => {
    const catItems = items.filter(item => item.category === catName);
    const track = document.getElementById(cfg.trackId);
    const section = document.getElementById(cfg.sectionId);

    if (section) {
      const countBadge = section.querySelector('.cat-count-badge');
      if (countBadge) {
        countBadge.textContent = `${catItems.length} ${cfg.countNoun}`;
      }
    }

    if (track && catItems.length > 0) {
      track.innerHTML = catItems.map(item => {
        const ratingMatch = item.badge ? item.badge.match(/★\s*[\d.]+/) : null;
        const ratingPill = ratingMatch ? ratingMatch[0] : (item.rating ? `★ ${item.rating}` : '');
        return `
          <article class="menu-item-card" 
            data-id="${item.id}"
            data-category="${item.category}"
            data-title="${item.title}"
            data-price="${item.price}"
            data-image="${item.image}"
            data-short-desc="${item.shortDesc || ''}"
            data-detailed-desc="${item.detailedDesc || ''}"
            data-badge="${item.badge || ''}"
            tabindex="0"
            role="button"
          >
            <div class="item-card-media">
              <img src="${item.image}" alt="${item.title}" loading="lazy">
              <span class="item-price-tag">${item.price}</span>
              ${ratingPill ? `<span class="item-badge-pill">${ratingPill}</span>` : ''}
            </div>
            <div class="item-card-info">
              <h4 class="item-title">${item.title}</h4>
              <p class="item-desc">${item.shortDesc || ''}</p>
              <div class="item-card-footer">
                <span class="view-details-link">დეტალურად 🔍</span>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  });

  // Also update Slide 0 Hero Thumbnails from waffles
  const waffles = items.filter(i => i.category === 'ვაფლები');
  const thumbContainer = document.querySelector('.thumbnails-container');
  if (thumbContainer && waffles.length >= 4) {
    thumbContainer.innerHTML = waffles.slice(0, 4).map((w, idx) => `
      <div class="thumb-card ${idx === currentWaffleIndex ? 'active' : ''}" data-waffle-index="${idx}" tabindex="0" role="button" aria-label="${w.title}">
        <div class="thumb-img-box">
          <img src="${w.image}" alt="${w.title}">
        </div>
        <div class="thumb-info">
          <span class="thumb-name">${w.title}</span>
          <span class="thumb-price">${w.price}</span>
        </div>
      </div>
    `).join('');

    thumbContainer.querySelectorAll('.thumb-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.waffleIndex, 10);
        setFeaturedWaffle(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.dataset.waffleIndex, 10);
          setFeaturedWaffle(idx);
        }
      });
    });
  }
}

// Initial Dynamic Menu Render
renderDynamicMenu();

// Live update menu if modified in another tab via Admin Panel
window.addEventListener('storage', (e) => {
  if (e.key === 'waff_menu_items_v2') {
    renderDynamicMenu();
  }
});

// ========================================================
// Discrete Secret Admin Panel Triggers (Only for Owner)
// ========================================================
const secretModal = document.getElementById('adminSecretModal');
const secretForm = document.getElementById('adminSecretForm');
const secretInput = document.getElementById('secretAdminPassInput');
const secretError = document.getElementById('secretAdminErrorMsg');
const closeSecretBtn = document.getElementById('closeSecretModalBtn');

function openSecretAdminModal() {
  if (!secretModal) return;
  secretModal.style.display = 'flex';
  secretModal.setAttribute('aria-hidden', 'false');
  if (secretError) secretError.style.display = 'none';
  if (secretInput) {
    secretInput.value = '';
    setTimeout(() => secretInput.focus(), 120);
  }
}

function closeSecretAdminModal() {
  if (!secretModal) return;
  secretModal.style.display = 'none';
  secretModal.setAttribute('aria-hidden', 'true');
  if (window.location.hash === '#admin') {
    history.replaceState(null, null, window.location.pathname);
  }
}

if (closeSecretBtn) {
  closeSecretBtn.addEventListener('click', closeSecretAdminModal);
}

if (secretModal) {
  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) closeSecretAdminModal();
  });
}

if (secretForm) {
  secretForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = secretInput ? secretInput.value.trim() : '';
    if (typeof verifyAdminPassword === 'function' && verifyAdminPassword(pass)) {
      if (typeof setAdminLoggedIn === 'function') setAdminLoggedIn(true);
      window.location.href = 'admin.html';
    } else {
      if (secretError) secretError.style.display = 'block';
      if (secretInput) {
        secretInput.classList.add('error-shake');
        setTimeout(() => secretInput.classList.remove('error-shake'), 500);
      }
    }
  });
}

// Trigger 1: Triple Click / Tap on WAFF Logo within 1.2s
let logoTapCount = 0;
let logoTapTimer = null;
const brandLogo = document.querySelector('.brand-logo');
if (brandLogo) {
  brandLogo.addEventListener('click', (e) => {
    logoTapCount++;
    if (logoTapCount === 1) {
      logoTapTimer = setTimeout(() => {
        logoTapCount = 0;
      }, 1200);
    } else if (logoTapCount >= 3) {
      clearTimeout(logoTapTimer);
      logoTapCount = 0;
      e.preventDefault();
      e.stopPropagation();
      openSecretAdminModal();
    }
  });
}

// Trigger 2: Keyboard Shortcut (Ctrl + Shift + A or Cmd + Shift + A)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    openSecretAdminModal();
  }
});

// Trigger 3: URL Hash (#admin)
function checkAdminHash() {
  if (window.location.hash === '#admin') {
    openSecretAdminModal();
  }
}
checkAdminHash();
window.addEventListener('hashchange', checkAdminHash);

