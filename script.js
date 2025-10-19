// =========================
// script.js - Versi rapih & aman
// =========================

/*
  Struktur:
  1) initAOS
  2) heroParallax
  3) mobileMenu
  4) carouselModule
  5) contactFormHandler
  6) themeToggle
  7) modalModule
  8) bookingFormModule
*/

// Jalankan setelah DOM siap
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
    AOS.init();
  }
}

/* --------------------------
  2) Parallax hero (menggunakan rAF)
   -------------------------- */
function heroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const value = scrollY * 0.3; // nilai kecil = halus
        heroBg.style.transform = `translateY(${value}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // inisialisasi posisi
  onScroll();
}

/* --------------------------
  3) Hamburger menu untuk mobile
   -------------------------- */
function mobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const willOpen = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  // Tutup menu saat klik link (UX mobile)
  navMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------
  4) Carousel (prev/next + auto slide + pause on hover)
   -------------------------- */
function carouselModule() {
  const carouselInner = document.querySelector('.carousel-inner');
  const carouselItems = document.querySelectorAll('.carousel-item');
  // dukungan memilih tombol dengan atau tanpa .carousel-btn wrapper
  const prevBtn = document.querySelector('.carousel-btn.prev') || document.querySelector('.prev');
  const nextBtn = document.querySelector('.carousel-btn.next') || document.querySelector('.next');

  if (!carouselInner || carouselItems.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const intervalMs = 5000;

  function updateCarousel() {
    const translateX = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${translateX}%)`;
    // optional: update aria-live region or current indicator here
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

  // Auto-slide (hanya jika >1 item)
  function startAutoSlide() {
    if (carouselItems.length <= 1) return;
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      goNext();
    }, intervalMs);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // Pause saat hover atau fokus
  const carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', stopAutoSlide);
    carouselEl.addEventListener('focusin', stopAutoSlide);
    carouselEl.addEventListener('mouseleave', startAutoSlide);
    carouselEl.addEventListener('focusout', startAutoSlide);
  }

  // Start
  startAutoSlide();
  updateCarousel();
}

/* --------------------------
  5) Contact form simple handler
   -------------------------- */
function contactFormHandler() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: ganti alert dengan notifikasi custom / kirim ke backend
    alert('Terima kasih! Pesan Anda telah dikirim.');
    contactForm.reset();
  });
}

/* --------------------------
  6) Theme toggle (light/dark) + sinkronisasi preferensi
   -------------------------- */
function themeToggle() {
  const storageKey = 'theme'; // 'light' atau 'dark'
  const prefersDarkQuery = '(prefers-color-scheme: dark)';
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  if (!html) return;

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

  if (!toggleBtn) return;

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

  // Sinkron saat preferensi OS berubah (jika user belum menyimpan)
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
  7) Modal layanan (detail) dengan accessibility sederhana
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
    if (modalImg && data.img) modalImg.src = data.img;
    if (modalLink && data.link) modalLink.href = data.link || '#';

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

  document.querySelectorAll('.service-card .btn-secondary').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.target.closest('.service-card');
      if (!card) return;

      const title = card.querySelector('h3')?.textContent.trim() || '';
      const desc = card.querySelector('p')?.textContent.trim() || '';
      const img = card.querySelector('img')?.src || '';
      const page = btn.dataset.page || `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '')}.html`;

      openModal({
        title,
        desc: desc + ' Detail lengkap: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        img,
        link: page,
      });
    });
  });

  closeBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}


/* --------------------------
  8) Booking form dengan validasi sederhana
   -------------------------- */
function bookingFormModule() {
  const bookingForm = document.querySelector('.booking-form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    let isValid = true;

    for (const [key, value] of formData.entries()) {
      // Trim untuk deteksi input kosong; untuk tanggal/nomor bisa ditingkatkan
      if (typeof value === 'string' && value.trim() === '') {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      // Tampilkan pesan ringkas; bisa diganti dengan UI inline error
      alert('Mohon lengkapi semua field booking sebelum mengirim.');
      return;
    }

    // Simpan / kirim ke server di sini (TODO)
    alert('Booking berhasil dikirim! Kami akan menghubungi Anda segera.');
    bookingForm.reset();
  });
}

/* --------------------------
  End of file
   -------------------------- */
