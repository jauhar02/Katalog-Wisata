document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  heroParallax();
  mobileMenu();
  carouselModule();
  contactFormHandler();
  themeToggle();
  modalModule();
  bookingFormModule();
});

/* --------------------------
   1) Inisialisasi AOS (jika tersedia)
   -------------------------- */
function initAOS() {
  if (typeof AOS !== 'undefined' && AOS && typeof AOS.init === 'function') {
    AOS.init({ once: true });
  }
}

/* --------------------------
   2) Parallax hero (menggunakan rAF) - disable di mobile untuk performa
   -------------------------- */
function heroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || window.innerWidth <= 768) return; // disable di mobile

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const value = scrollY * 0.3; // halus
        heroBg.style.transform = `translateY(${value}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------
   3) Hamburger menu (mobile) + close when link clicked
   -------------------------- */
function mobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (!hamburger || !navMenu) return;

  function openCloseMenu() {
    const willOpen = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }

  hamburger.addEventListener('click', openCloseMenu);

  // Tutup menu saat klik link (lebih robust)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Optional: close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------
   4) Carousel (prev/next + auto slide + pause on hover + swipe support)
   -------------------------- */
function carouselModule() {
  const carouselInner = document.querySelector('.carousel-inner');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-btn.prev') || document.querySelector('.prev');
  const nextBtn = document.querySelector('.carousel-btn.next') || document.querySelector('.next');
  if (!carouselInner || carouselItems.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const intervalMs = 5000;

  function updateCarousel() {
    const translateX = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${translateX}%)`;
  }

  function goPrev() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : carouselItems.length - 1;
    updateCarousel();
  }

  function goNext() {
    currentIndex = currentIndex < carouselItems.length - 1 ? currentIndex + 1 : 0;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Swipe support for mobile
  let startX = 0;
  let endX = 0;
  carouselInner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  carouselInner.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) { // threshold 50px
      if (diff > 0) goNext(); // swipe left
      else goPrev(); // swipe right
    }
  }, { passive: true });

  function startAutoSlide() {
    if (carouselItems.length <= 1) return;
    stopAutoSlide();
    autoSlideTimer = setInterval(goNext, intervalMs);
  }
  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  const carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', stopAutoSlide);
    carouselEl.addEventListener('focusin', stopAutoSlide);
    carouselEl.addEventListener('mouseleave', startAutoSlide);
    carouselEl.addEventListener('focusout', startAutoSlide);
  }

  // start
  startAutoSlide();
  updateCarousel();

  // resize handler (keamanan untuk memastikan transform tetap benar)
  window.addEventListener('resize', () => {
    updateCarousel();
  });
}

/* --------------------------
   5) Contact form simple handler
   -------------------------- */
function contactFormHandler() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah dikirim.');
    contactForm.reset();
  });
}

/* --------------------------
   6) Theme toggle (light/dark)
   -------------------------- */
function themeToggle() {
  const storageKey = 'theme';
  const prefersDarkQuery = '(prefers-color-scheme: dark)';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  if (!html || !toggleBtn) return;

  function setToggleAppearance(btn, theme) {
    if (!btn) return;
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.title = theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap';
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia(prefersDarkQuery).matches) return 'dark';
    return 'light';
  }

  const initialTheme = getInitialTheme();
  html.setAttribute('data-theme', initialTheme);
  setToggleAppearance(toggleBtn, initialTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(storageKey, next);
    setToggleAppearance(toggleBtn, next);
  });

  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  // Sinkron preferensi OS jika user belum menyimpan pilihan
  if (window.matchMedia) {
    const mq = window.matchMedia(prefersDarkQuery);
    const listener = (e) => {
      if (!localStorage.getItem(storageKey)) {
        const newTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        setToggleAppearance(toggleBtn, newTheme);
      }
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', listener);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(listener);
    }
  }
}

/* --------------------------
   7) Modal layanan (detail)
   -------------------------- */
function modalModule() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  const modalContent = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.close');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  const modalLink = document.getElementById('modalLink');

  if (!modalContent || !closeBtn) return;

  function openModal(data = {}) {
    if (modalTitle && data.title) modalTitle.textContent = data.title;
    if (modalDesc && data.desc) modalDesc.textContent = data.desc;
    if (modalImg && data.img) modalImg.src = data.img || '';
    if (modalLink) modalLink.href = data.link || '#';

    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    modal._prevFocus = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (modal._prevFocus && typeof modal._prevFocus.focus === 'function') {
      modal._prevFocus.focus();
    }
  }

  // attach to service-card buttons
  document.querySelectorAll('.service-card .btn-secondary').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // Allow link navigation if user wants (e.g., external page) — we intercept to show modal
      e.preventDefault();
      const card = btn.closest('.service-card');
      if (!card) return;

      const title = card.querySelector('h3')?.textContent.trim() || '';
      const desc = card.querySelector('p')?.textContent.trim() || '';
      const img = card.querySelector('img')?.src || '';
      // prefer explicit data-page attribute if provided
      const dataPage = btn.dataset && btn.dataset.page ? btn.dataset.page : null;
      // if dataPage looks like anchor (#...), keep it; otherwise treat as page link
      const page = dataPage || (title ? `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '')}.html` : '#');

      openModal({
        title,
        desc: desc + ' Detail lengkap: ' + 'Silakan klik Pesan Sekarang untuk melanjutkan pemesanan.',
        img,
        link: page,
      });
    });
  });

  // close button
  closeBtn.addEventListener('click', closeModal);

  // close if click outside content
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // keyboard: Esc untuk tutup, Tab trap minimal (keep focus in modal)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
    if (e.key === 'Tab' && modal.getAttribute('aria-hidden') === 'false') {
      // minimal focus trap: keep focus within modal-content
      const focusable = modalContent.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* --------------------------
  8) Booking form dengan validasi sederhana + feedback visual
   -------------------------- */
function bookingFormModule() {
  const bookingForm = document.querySelector('.booking-form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    let isValid = true;
    let invalidFields = [];

    // Validasi sederhana dengan regex untuk email dan phone
    for (const [key, value] of formData.entries()) {
      const val = value.toString().trim();
      if (val === '') {
        isValid = false;
        invalidFields.push(key);
      } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        isValid = false;
        invalidFields.push(key);
      } else if (key === 'phone' && !/^\+?\d{10,15}$/.test(val)) {
        isValid = false;
        invalidFields.push(key);
      }
    }

    // Feedback visual: highlight field kosong/salah
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.remove('error');
    });
    invalidFields.forEach(key => {
      const field = bookingForm.querySelector(`[name="${key}"]`);
      if (field) field.classList.add('error');
    });

    if (!isValid) {
      // Toast notification alih-alih alert (lebih mobile-friendly)
      showToast('Mohon lengkapi semua field dengan benar sebelum mengirim.');
      return;
    }

    // TODO: kirim ke backend atau simpan
    showToast('Booking berhasil dikirim! Kami akan menghubungi Anda segera.');
    bookingForm.reset();
  });
}

// Helper function untuk toast notification
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: #fff;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1300;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
