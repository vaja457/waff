/**
 * WAFF - Minimalist Landing Menu
 * Audio & Tab Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  let soundEnabled = true;
  let audioCtx = null;
  const crunchAudio = new Audio('audio/crunch.mp3');
  crunchAudio.preload = 'auto';

  const soundMiniBtn = document.getElementById('soundMiniBtn');
  const soundOnSvg = document.getElementById('soundOnSvg');
  const soundOffSvg = document.getElementById('soundOffSvg');
  const crunchElements = document.querySelectorAll('[data-crunch="true"]');
  const mobileTabBtns = document.querySelectorAll('.mobile-tab-btn');

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

  function playCrunchSound() {
    if (!soundEnabled) return;
    try {
      getAudioCtx();
      crunchAudio.currentTime = 0;
      crunchAudio.volume = 0.8;
      const p = crunchAudio.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch (e) {}
  }

  // Sound toggle button
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

  // Crunch sound on click
  crunchElements.forEach(el => {
    el.addEventListener('click', () => {
      playCrunchSound();
      el.style.opacity = '0.85';
      setTimeout(() => { el.style.opacity = '1'; }, 100);
    });
  });

  // Mobile Tabs
  mobileTabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      mobileTabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      playCrunchSound();
    });
  });

  // Unlock audio
  const unlockAudio = () => {
    getAudioCtx();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
});
