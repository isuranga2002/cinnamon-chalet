/**
 * Cinnamon Chalet - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initMobileMenu();
  initStickyHeader();
  initBookingBar();
  initContactForm();
  initGalleryLightbox();
  initGalleryCarousel();
  initSmoothScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');

  if (!menuToggle || !mobileNav) return;

  function toggleMenu() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isOpen);
    mobileNav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  menuToggle.addEventListener('click', toggleMenu);

  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }

  // Close menu on link click
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/**
 * Sticky Header with Shadow on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Booking Bar Form - WhatsApp Integration
 */
function initBookingBar() {
  const bookingForm = document.querySelector('.booking-bar__form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const checkIn = document.getElementById('check-in')?.value || '';
    const checkOut = document.getElementById('check-out')?.value || '';
    const adults = document.getElementById('adults')?.value || '1';
    const children = document.getElementById('children')?.value || '0';

    // Format dates for display
    const checkInDate = checkIn ? new Date(checkIn).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : 'Not specified';

    const checkOutDate = checkOut ? new Date(checkOut).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : 'Not specified';

    // Create WhatsApp message
    const message = `Hello Cinnamon Chalet! 🏡

I would like to check availability for:

📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
👥 Adults: ${adults}
👶 Children: ${children}

Please let me know if you have availability. Thank you!`;

    // WhatsApp phone number (without + sign for URL)
    const phone = '94774005317';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  });

  // Set minimum date to today
  const checkInInput = document.getElementById('check-in');
  const checkOutInput = document.getElementById('check-out');

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);

    // Update check-out min date when check-in changes
    checkInInput.addEventListener('change', function () {
      checkOutInput.setAttribute('min', this.value);
      if (checkOutInput.value && checkOutInput.value < this.value) {
        checkOutInput.value = this.value;
      }
    });
  }
}

/**
 * Contact Form - Email (mailto) Integration
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const subject = document.getElementById('contact-subject')?.value || '';
    const message = document.getElementById('contact-message')?.value || '';

    // Email address to send to
    const toEmail = 'cinnamonchalet33@gmail.com';

    // Create email subject
    const emailSubject = `${subject} - Inquiry from ${name}`;

    // Create email body
    const emailBody = `Hello Cinnamon Chalet,

New Inquiry

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from Cinnamon Chalet Website Contact Form`;

    // Encode for mailto URL
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);

    // Open default email client
    window.location.href = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  });
}

/**
 * Gallery Lightbox
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__content img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Set current year in footer
 */
document.querySelectorAll('.current-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/**
 * Gallery Carousel
 */
function initGalleryCarousel() {
  const carousel = document.querySelector('.gallery-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!slides.length) return;

  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlides();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Auto-advance (optional - every 5 seconds)
  // setInterval(nextSlide, 5000);
}
