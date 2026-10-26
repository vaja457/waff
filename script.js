/**
 * WAFF - ვაფლერიის მენიუ (Figma Single-Page Landing)
 * Audio & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sound state
  let soundEnabled = true;
  let audioCtx = null;
  const crunchAudio = new Audio('audio/crunch.mp3');
  crunchAudio.preload = 'auto';

  // DOM Elements
  const soundMiniBtn = document.getElementById('soundMiniBtn');
  const soundOnSvg = document.getElementById('soundOnSvg');
  const soundOffSvg = document.getElementById('soundOffSvg');
  const crunchMiniBtn = document.getElementById('crunchMiniBtn');
  const crunchElements = document.querySelectorAll('[data-crunch="true"]');
  const catPills = document.querySelectorAll('.cat-pill');

  // Resume Web Audio context if suspended
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Play Crisp Waffle Crunch Sound
  function playCrunchSound() {
    if (!soundEnabled) return;
    try {
      getAudioCtx();
      crunchAudio.currentTime = 0;
      crunchAudio.volume = 0.85;
      const playPromise = crunchAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Fallback to Web Audio synthesis if audio file playback blocked
          synthesizeCrunch();
        });
      }
    } catch (e) {
      synthesizeCrunch();
    }
  }

  // Web Audio Crunchy Burst Fallback
  function synthesizeCrunch() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Audio not permitted
    }
  }

  // Sound Toggle Button Handler
  if (soundMiniBtn) {
    soundMiniBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundOnSvg.style.display = 'block';
        soundOffSvg.style.display = 'none';
        soundMiniBtn.setAttribute('title', 'ხმის გამორთვა');
        playCrunchSound();
      } else {
        soundOnSvg.style.display = 'none';
        soundOffSvg.style.display = 'block';
        soundMiniBtn.setAttribute('title', 'ხმის ჩართვა');
      }
    });
  }

  // Mini Crunch Button in Header
  if (crunchMiniBtn) {
    crunchMiniBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playCrunchSound();
      triggerBounce(crunchMiniBtn);
    });
  }

  // Attach crunch sound and bounce to all interactive cards
  crunchElements.forEach(el => {
    el.addEventListener('click', () => {
      playCrunchSound();
      triggerBounce(el);
    });
  });

  // Brief playful bounce animation
  function triggerBounce(element) {
    element.style.transform = 'scale(0.97)';
    setTimeout(() => {
      element.style.transform = '';
    }, 120);
  }

  // Mobile Category Navigation Active Indicator on Scroll
  const sections = [
    { id: 'colWaffles', pill: catPills[0] },
    { id: 'colDrinks', pill: catPills[1] },
    { id: 'colToppings', pill: catPills[2] }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(({ id, pill }) => {
      const el = document.getElementById(id);
      if (el && pill) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          catPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        }
      }
    });
  }, { passive: true });

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      playCrunchSound();
    });
  });

  // Unlock audio on first user touch / click anywhere
  const unlockAudio = () => {
    getAudioCtx();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
});
