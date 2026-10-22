/**
 * WAFF - ვაფლის კლუბი
 * Interactive Horizontal Carousel, Audio & FiraGO Logic
 */

// Waffle Flavors Data
const waffleProducts = [
  {
    id: 1,
    name: "ბელგიური კლასიკა",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: 14.90,
    priceFormatted: "₾ 14.90",
    heroImage: "images/waffle-hero-1.png",
    thumbImage: "images/thumb-1.jpg"
  },
  {
    id: 2,
    name: "შოკოლადის ვულკანი",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: 16.50,
    priceFormatted: "₾ 16.50",
    heroImage: "images/waffle-hero-2.png",
    thumbImage: "images/thumb-2.jpg"
  },
  {
    id: 3,
    name: "კარამელი & პეკანი",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: 15.90,
    priceFormatted: "₾ 15.90",
    heroImage: "images/waffle-hero-3.png",
    thumbImage: "images/thumb-3.jpg"
  },
  {
    id: 4,
    name: "ტყის კენკრა",
    eyebrow: "საუკეთესო",
    title: "ვაფლის კლუბი",
    slogan: "შეიგრძენი გემო, შემოუერთდი კლუბს!",
    price: 15.50,
    priceFormatted: "₾ 15.50",
    heroImage: "images/waffle-hero-4.png",
    thumbImage: "images/thumb-4.jpg"
  }
];

// State
let currentSlide = 0;       // 0: მთავარი, 1: მენიუ, 2: ჩვენ შესახებ, 3: მაღაზია
let currentWaffleIndex = 0; // 0 to 3 (Featured waffle on Home slide)
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
const crunchPlayBtn = document.getElementById('crunchPlayBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundOnIcon = document.getElementById('soundOnIcon');
const soundOffIcon = document.getElementById('soundOffIcon');
const shadeBtns = document.querySelectorAll('.shade-btn');

// ========================================================
// Audio Synthesis (Web Audio API)
// ========================================================
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Subtle Bubble UI Click Sound
function playBubbleSound(freq = 600, duration = 0.08) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// 2. Authentic Waffle Crunch Audio (Uploaded by User)
const WAFFLE_CRUNCH_AUDIO_URI = "data:audio/mp3;base64,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";

// Audio Pool for Instant, Zero-Latency Crunch Playback
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
    crunchPoolIndex = (crunchPoolIndex + 1) % CRUNCH_POOL_SIZE;
    audio.currentTime = 0;
    audio.volume = 0.95;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        const fallback = new Audio(WAFFLE_CRUNCH_AUDIO_URI);
        fallback.volume = 0.95;
        fallback.play().catch(() => {});
      });
    }
  } catch (e) {}
}

// ========================================================
// Horizontal Slide Carousel Navigation (with Infinite Loop & Animated Rect Tab)
// ========================================================

// Function to update the animated sliding rectangle indicator in the navbar
function updateNavIndicator(slideIndex) {
  if (!navIndicatorBox || !navMenu || !navLinks[slideIndex]) return;

  const targetLink = navLinks[slideIndex];
  const menuRect = navMenu.getBoundingClientRect();
  const linkRect = targetLink.getBoundingClientRect();

  const left = linkRect.left - menuRect.left;
  const top = linkRect.top - menuRect.top;
  const width = linkRect.width;
  const height = linkRect.height;

  navIndicatorBox.style.left = `${left}px`;
  navIndicatorBox.style.top = `${top}px`;
  navIndicatorBox.style.width = `${width}px`;
  navIndicatorBox.style.height = `${height}px`;
  navIndicatorBox.style.opacity = '1';

  // Ensure the tab that the indicator is currently on has bright white text!
  // All other tabs have dark black/chocolate text!
  navLinks.forEach((link, idx) => {
    link.classList.toggle('is-indicated', idx === slideIndex);
  });

  // Trigger playful spring/pop animation on the rectangle
  navIndicatorBox.classList.remove('animating');
  void navIndicatorBox.offsetWidth; // Force CSS reflow
  navIndicatorBox.classList.add('animating');
}

// ========================================================
// Autoplay Carousel with Visual Time Progress in Dots
// ========================================================
const AUTOPLAY_DURATION = 5500; // 5.5 seconds per slide
let autoplayTimer = null;
let isAutoplayPaused = false;
let isAutoplayManuallyPaused = false;

function toggleAutoplay() {
  isAutoplayManuallyPaused = !isAutoplayManuallyPaused;
  const btn = document.getElementById('autoplayToggleBtn');
  const pauseIcon = document.getElementById('autoplayPauseIcon');
  const playIcon = document.getElementById('autoplayPlayIcon');
  const activeFill = document.querySelector('.site-dot-btn.active .dot-progress-fill');

  if (isAutoplayManuallyPaused) {
    clearTimeout(autoplayTimer);
    if (activeFill) activeFill.style.animationPlayState = 'paused';
    if (btn) {
      btn.classList.add('is-paused');
      btn.title = 'ავტომატური გადასვლის ჩართვა (Play)';
      btn.setAttribute('aria-label', 'ავტო-გადასვლის ჩართვა');
    }
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (playIcon) playIcon.style.display = 'block';
  } else {
    if (btn) {
      btn.classList.remove('is-paused');
      btn.title = 'ავტომატური გადასვლის შეჩერება (Pause)';
      btn.setAttribute('aria-label', 'ავტო-გადასვლის შეჩერება');
    }
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (playIcon) playIcon.style.display = 'none';
    startAutoplayProgress(currentSlide);
  }
}

function startAutoplayProgress(slideIndex = currentSlide) {
  clearTimeout(autoplayTimer);

  // Update 4 Bottom Center Dots with Time Progress Bar
  siteDotBtns.forEach((dot, idx) => {
    const isActive = idx === slideIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');

    const fill = dot.querySelector('.dot-progress-fill');
    if (fill) {
      fill.style.animation = 'none';
      if (isActive) {
        void fill.offsetWidth; // Force CSS reflow to start fresh from 0%
        fill.style.animation = `dotTimerFill ${AUTOPLAY_DURATION}ms linear forwards`;
        if (isAutoplayManuallyPaused) {
          fill.style.animationPlayState = 'paused';
        }
      }
    }
  });

  // Schedule auto-advance to next slide only if not manually paused!
  if (!isAutoplayManuallyPaused && !isAutoplayPaused) {
    autoplayTimer = setTimeout(() => {
      if (!isAutoplayManuallyPaused && !isAutoplayPaused) {
        nextSlide();
      }
    }, AUTOPLAY_DURATION);
  }
}

function goToSlide(slideIndex) {
  if (slideIndex < 0 || slideIndex > 3) return;
  currentSlide = slideIndex;

  playBubbleSound(520 + slideIndex * 70, 0.08);

  // Smooth Horizontal Translate with ease-out curve
  carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
  carouselTrack.style.transform = `translateX(-${slideIndex * 100}vw)`;

  // Update Top Navbar Active Tab & Gliding Rectangle Indicator
  navLinks.forEach((link, idx) => {
    link.classList.toggle('active', idx === slideIndex);
  });
  updateNavIndicator(slideIndex);

  // Update Bottom Center Dots with Animated Time Progress
  startAutoplayProgress(slideIndex);

  // Update Side Menu Drawers Visibility (Slide 0 -> Right, Slide 2 -> Left)
  updateSideDrawers(slideIndex);
}

// ========================================================
// Side Menu Drawers (Slide 0: Right -> Menu; Slide 2: Left -> Menu)
// ========================================================
function updateSideDrawers(slideIndex = currentSlide) {
  if (edgeDrawerRight) {
    const isSlide0 = (slideIndex === 0);
    edgeDrawerRight.classList.toggle('is-active', isSlide0);
    if (!isSlide0) edgeDrawerRight.classList.remove('is-visible');
  }
  if (edgeDrawerLeft) {
    const isSlide2 = (slideIndex === 2);
    edgeDrawerLeft.classList.toggle('is-active', isSlide2);
    if (!isSlide2) edgeDrawerLeft.classList.remove('is-visible');
  }
}

// Click drawer to navigate to Menu (Slide 1)
if (edgeDrawerRight) {
  edgeDrawerRight.addEventListener('click', () => {
    playBubbleSound(620, 0.08);
    goToSlide(1);
  });
}
if (edgeDrawerLeft) {
  edgeDrawerLeft.addEventListener('click', () => {
    playBubbleSound(620, 0.08);
    goToSlide(1);
  });
}

// Mousemove detection for edge triggers
window.addEventListener('mousemove', (e) => {
  const yInRange = (e.clientY >= 30 && e.clientY <= window.innerHeight - 30);

  // 1. Right drawer trigger on Slide 0 (მთავარი -> მენიუ)
  if (edgeDrawerRight && edgeDrawerRight.classList.contains('is-active')) {
    const distanceToRight = window.innerWidth - e.clientX;
    if (distanceToRight <= 80 && yInRange) {
      edgeDrawerRight.classList.add('is-visible');
    } else if (distanceToRight > 200 && !edgeDrawerRight.matches(':hover')) {
      edgeDrawerRight.classList.remove('is-visible');
    }
  }

  // 2. Left drawer trigger on Slide 2 (ჩვენ შესახებ -> მენიუ)
  if (edgeDrawerLeft && edgeDrawerLeft.classList.contains('is-active')) {
    const distanceToLeft = e.clientX;
    if (distanceToLeft <= 80 && yInRange) {
      edgeDrawerLeft.classList.add('is-visible');
    } else if (distanceToLeft > 200 && !edgeDrawerLeft.matches(':hover')) {
      edgeDrawerLeft.classList.remove('is-visible');
    }
  }
});

// Next / Prev slide helpers with LOOP (ლუპი)
function nextSlide() {
  if (currentSlide < 3) {
    goToSlide(currentSlide + 1);
  } else {
    // Loop back from last slide (Shop) to first slide (Home)
    goToSlide(0);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  } else {
    // Loop backwards from first slide (Home) to last slide (Shop)
    goToSlide(3);
  }
}

// ========================================================
// Home Section: Featured Waffle Selector (Bottom Left Cards)
// ========================================================
function setFeaturedWaffle(index) {
  if (index < 0 || index >= waffleProducts.length) return;
  currentWaffleIndex = index;
  const waffle = waffleProducts[index];

  // Play crunchy bite sound on waffle selection!
  playWaffleCrunchSound();

  // Switch image with fade/pop animation
  mainHeroWaffle.classList.add('switching');
  setTimeout(() => {
    mainHeroWaffle.src = waffle.heroImage;
    mainHeroWaffle.alt = waffle.name;
    mainHeroWaffle.onload = () => mainHeroWaffle.classList.remove('switching');
    setTimeout(() => mainHeroWaffle.classList.remove('switching'), 60);
  }, 200);

  // Update thumbnail card active state
  thumbCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });
}

// Menu Card click directly selects waffle and jumps to Shop
window.selectWaffleAndOrder = function(index) {
  setFeaturedWaffle(index);
  const radio = document.querySelector(`input[name="shopWaffle"][value="${index}"]`);
  if (radio) {
    radio.checked = true;
    updateRadioCardStyles();
    calcShopTotal();
  }
  goToSlide(3); // Jump to Shop slide
};

// ========================================================
// Event Listeners: Navigation, Dots, Arrows & Wheel
// ========================================================

// 1. Navbar Click & Hover -> Animate Sliding Rectangle & Horizontal Slide
navLinks.forEach((link, idx) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSlide = parseInt(link.dataset.slideTarget, 10);
    goToSlide(targetSlide);
  });

  link.addEventListener('mouseenter', () => {
    updateNavIndicator(idx);
  });
});

if (navMenu) {
  navMenu.addEventListener('mouseleave', () => {
    updateNavIndicator(currentSlide);
  });
}

window.addEventListener('resize', () => {
  updateNavIndicator(currentSlide);
});

// 2. Bottom Center Dots Click & Hover Pause
siteDotBtns.forEach(dot => {
  dot.addEventListener('click', () => {
    const slide = parseInt(dot.dataset.slide, 10);
    goToSlide(slide);
  });
});

if (bottomDotsNav) {
  bottomDotsNav.addEventListener('mouseenter', () => {
    if (isAutoplayManuallyPaused) return;
    isAutoplayPaused = true;
    clearTimeout(autoplayTimer);
    const activeFill = document.querySelector('.site-dot-btn.active .dot-progress-fill');
    if (activeFill) activeFill.style.animationPlayState = 'paused';
  });

  bottomDotsNav.addEventListener('mouseleave', () => {
    if (isAutoplayManuallyPaused) return;
    isAutoplayPaused = false;
    const activeFill = document.querySelector('.site-dot-btn.active .dot-progress-fill');
    if (activeFill) activeFill.style.animationPlayState = 'running';
    autoplayTimer = setTimeout(() => {
      if (!isAutoplayPaused && !isAutoplayManuallyPaused) nextSlide();
    }, 2800);
  });
}

// Autoplay Pause / Play Toggle Button
const autoplayToggleBtn = document.getElementById('autoplayToggleBtn');
if (autoplayToggleBtn) {
  autoplayToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playBubbleSound(480, 0.06);
    toggleAutoplay();
  });
}

// Pause autoplay when page is backgrounded / hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearTimeout(autoplayTimer);
  } else {
    startAutoplayProgress(currentSlide);
  }
});

// Reset timer when user interacts with form inputs (e.g. configuring waffle toppings in Shop)
document.addEventListener('change', (e) => {
  if (e.target.matches('input, select, textarea')) {
    startAutoplayProgress(currentSlide);
  }
});

// 3. Keyboard Navigation (Left / Right Arrows)
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

// 5. Mouse Wheel / Trackpad Horizontal Slide Navigation (No vertical page scroll)
window.addEventListener('wheel', (e) => {
  if (e.cancelable) e.preventDefault();

  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(delta) < 20 || isThrottled) return;

  isThrottled = true;
  if (delta > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
  setTimeout(() => { isThrottled = false; }, 750);
}, { passive: false });

// 6. Mouse Drag-To-Scroll & Touch Pull Interaction (მაუსის კლიკით გადასქროლვა და გამოქაჩვა)
let isPointerDown = false;
let isDragging = false;
let hasMoved = false;
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let dragStartTime = 0;
let suppressClickUntil = 0;

// Universal capture listener to stop clicks after a drag gesture
window.addEventListener('click', (e) => {
  if (Date.now() < suppressClickUntil) {
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

// Prevent browser default ghost image drag
window.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

const viewportEl = carouselViewport || window;

viewportEl.addEventListener('pointerdown', (e) => {
  // Only primary button (left mouse click) or touch/pen
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  // Don't drag if clicking directly on fixed UI controls
  if (e.target.closest('.main-header, .floating-toolbar, .bottom-center-dots, .carousel-nav-btn')) {
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

  // Pause autoplay timer while dragging
  clearTimeout(autoplayTimer);
  const activeFill = document.querySelector('.site-dot-btn.active .dot-progress-fill');
  if (activeFill) activeFill.style.animationPlayState = 'paused';
});

window.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;

  deltaX = e.clientX - startX;
  deltaY = e.clientY - startY;

  // Check if user is starting a horizontal drag motion
  if (!hasMoved) {
    const distSq = deltaX * deltaX + deltaY * deltaY;
    if (distSq > 36) { // ~6px threshold
      if (Math.abs(deltaX) >= Math.abs(deltaY) * 0.75) {
        hasMoved = true;
        isDragging = true;
        if (carouselViewport) carouselViewport.classList.add('is-dragging');
        document.body.classList.add('is-dragging');
        carouselTrack.style.transition = 'none';
      } else {
        // Vertical scroll motion in scrollable sections
        isPointerDown = false;
        return;
      }
    }
  }

  if (isDragging) {
    if (e.cancelable) e.preventDefault();

    // Natural elastic drag feel on boundary slides
    let effectiveDeltaX = deltaX;
    if ((currentSlide === 0 && deltaX > 0) || (currentSlide === 3 && deltaX < 0)) {
      effectiveDeltaX = deltaX * 0.42;
    }

    const currentOffsetPx = -currentSlide * window.innerWidth;
    carouselTrack.style.transform = `translateX(${currentOffsetPx + effectiveDeltaX}px)`;
  }
}, { passive: false });

function handlePointerUpOrCancel(e) {
  if (!isPointerDown && !isDragging) return;

  const wasDragging = isDragging;
  isPointerDown = false;
  isDragging = false;
  hasMoved = false;

  if (carouselViewport) carouselViewport.classList.remove('is-dragging');
  document.body.classList.remove('is-dragging');

  if (wasDragging) {
    suppressClickUntil = Date.now() + 200;
    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';

    const duration = Math.max(1, Date.now() - dragStartTime);
    const velocity = deltaX / duration;
    const distanceThreshold = Math.min(120, window.innerWidth * 0.08);

    // If dragged sufficiently far OR fast flick gesture -> Next / Prev with infinite LOOP
    if (deltaX < -distanceThreshold || velocity < -0.28) {
      nextSlide();
    } else if (deltaX > distanceThreshold || velocity > 0.28) {
      prevSlide();
    } else {
      // Revert back smoothly to current slide
      goToSlide(currentSlide);
    }
  } else {
    // Resume autoplay if just tapped without dragging
    const activeFill = document.querySelector('.site-dot-btn.active .dot-progress-fill');
    if (activeFill) activeFill.style.animationPlayState = 'running';
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(() => {
      if (!isAutoplayPaused) nextSlide();
    }, AUTOPLAY_DURATION);
  }
}

window.addEventListener('pointerup', handlePointerUpOrCancel);
window.addEventListener('pointercancel', handlePointerUpOrCancel);

// 7. Thumbnail Click in Hero Section
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

// 8. Hero Waffle Click -> Play Crunch Sound & Bounce
if (mainHeroWaffle) {
  mainHeroWaffle.addEventListener('click', () => {
    playWaffleCrunchSound();
    mainHeroWaffle.style.transform = 'scale(1.08)';
    setTimeout(() => { mainHeroWaffle.style.transform = ''; }, 200);
  });
}

// 9. Dedicated Crunch Play Button
if (crunchPlayBtn) {
  crunchPlayBtn.addEventListener('click', () => {
    playWaffleCrunchSound();
    crunchPlayBtn.style.transform = 'scale(0.92)';
    setTimeout(() => { crunchPlayBtn.style.transform = ''; }, 160);
  });
}

// 10. Sound Toggle
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundOnIcon.style.display = 'block';
      soundOffIcon.style.display = 'none';
      playWaffleCrunchSound();
    } else {
      soundOnIcon.style.display = 'none';
      soundOffIcon.style.display = 'block';
    }
  });
}

// 11. Theme Yellow Shade Switcher
shadeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playBubbleSound(680, 0.06);
    const theme = btn.dataset.theme;
    document.body.className = theme;
    shadeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    try { localStorage.setItem('waff-theme', theme); } catch(e) {}
  });
});

// Restore saved theme
try {
  const savedTheme = localStorage.getItem('waff-theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    shadeBtns.forEach(b => b.classList.toggle('active', b.dataset.theme === savedTheme));
  }
} catch(e) {}

// ========================================================
// Slide 3: Shop & Order Builder Calculation
// ========================================================
function updateRadioCardStyles() {
  document.querySelectorAll('.waffle-radio-card').forEach(card => {
    const input = card.querySelector('input');
    card.classList.toggle('active', input.checked);
  });
}

function calcShopTotal() {
  const checkedRadio = document.querySelector('input[name="shopWaffle"]:checked');
  const waffleIdx = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
  const basePrice = waffleProducts[waffleIdx].price;

  let toppingsTotal = 0;
  document.querySelectorAll('.topping-check-pill input:checked').forEach(cb => {
    toppingsTotal += parseFloat(cb.dataset.price);
  });

  const grandTotal = basePrice + toppingsTotal;
  const totalEl = document.getElementById('shopFinalTotal');
  if (totalEl) {
    totalEl.textContent = `₾ ${grandTotal.toFixed(2)}`;
  }
}

document.querySelectorAll('input[name="shopWaffle"]').forEach(radio => {
  radio.addEventListener('change', () => {
    playBubbleSound(640, 0.08);
    updateRadioCardStyles();
    calcShopTotal();
  });
});

document.querySelectorAll('.topping-check-pill input').forEach(cb => {
  cb.addEventListener('change', () => {
    playWaffleCrunchSound();
    calcShopTotal();
  });
});

window.submitShopOrder = function() {
  playWaffleCrunchSound();
  const btn = document.getElementById('shopSubmitBtn');
  if (btn) {
    btn.innerHTML = '<span>შეკვეთა მიღებულია! 🎉 მადლობა!</span>';
    btn.style.background = '#278838';
    setTimeout(() => {
      btn.innerHTML = '<span>შეკვეთის გაფორმება 🚀</span>';
      btn.style.background = '';
    }, 2400);
  }
};

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

// Initial setup
setFeaturedWaffle(0);
goToSlide(0);
calcShopTotal();

// Ensure navbar indicator aligns properly once webfonts & layout paint
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    updateNavIndicator(currentSlide);
  });
}
window.addEventListener('load', () => {
  updateNavIndicator(currentSlide);
});
