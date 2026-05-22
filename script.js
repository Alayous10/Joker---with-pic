document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     1. INITIAL STATE & LANGUAGE CONFIGURATION
     ========================================== */
  const langToggleBtn = document.getElementById('lang-toggle');
  const serviceSelect = document.getElementById('form-service');
  
  // Supported languages
  let currentLang = localStorage.getItem('joker_lang') || 'en';
  
  // Apply language settings on load
  setLanguage(currentLang);
  
  // Lang Toggle Click Listener
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      localStorage.setItem('joker_lang', currentLang);
      setLanguage(currentLang);
    });
  }

  function setLanguage(lang) {
    const isRtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    
    // Select translation pack
    const dict = translations[lang] || translations['en'];
    
    // Update simple translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Use innerHTML for titles with spans / icons
        if (el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.classList.contains('translate-html')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Rebuild form options dynamically so they match language
    rebuildServiceDropdown(lang, dict);

    // Update toggling button text
    if (langToggleBtn) {
      langToggleBtn.textContent = dict['nav_lang'];
    }

    // Refresh Marquee Scroll Speed & Direction if necessary
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
      // Force redraw for marquee
      marquee.style.animation = 'none';
      setTimeout(() => {
        marquee.style.animation = '';
      }, 10);
    }
  }

  function rebuildServiceDropdown(lang, dict) {
    if (!serviceSelect) return;
    
    // Store current selection value
    const currentValue = serviceSelect.value;
    
    // List of services
    const services = [
      { id: 'construction', key: 'service_1_title' },
      { id: 'trading', key: 'service_2_title' },
      { id: 'usdt', key: 'service_3_title' },
      { id: 'car_uae', key: 'service_4_title' },
      { id: 'vehicles_kuwait', key: 'service_5_title' },
      { id: 'gac_uae', key: 'service_6_title' },
      { id: 'banking', key: 'service_7_title' },
      { id: 'hr', key: 'service_8_title' }
    ];
    
    // Clear
    serviceSelect.innerHTML = '';
    
    // Add default placeholder option
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = lang === 'ar' ? 'اختر الخدمة المطلوبة...' : 'Select service needed...';
    placeholderOpt.disabled = true;
    placeholderOpt.selected = !currentValue;
    serviceSelect.appendChild(placeholderOpt);
    
    // Append options
    services.forEach(srv => {
      const opt = document.createElement('option');
      opt.value = srv.id;
      opt.textContent = dict[srv.key];
      if (currentValue === srv.id) {
        opt.selected = true;
      }
      serviceSelect.appendChild(opt);
    });
  }

  /* ==========================================
     2. NAVIGATION & HAMBURGER MENU
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-item a');
  const navbar = document.querySelector('.navbar');

  // Sticky Navbar logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update active section on navigation links on scroll
    updateActiveNavLink();
  });

  // Hamburger Click Toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile navigation on link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Scroll Spy for Navbar
  const sections = document.querySelectorAll('section');
  function updateActiveNavLink() {
    let scrollPos = window.scrollY + 120; // offset for sticky nav
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-item a[href="#${id}"]`);
        if (activeLink) {
          activeLink.parentElement.classList.add('active');
        }
      }
    });
  }

  /* ==========================================
     3. SERVICE CARD ACTION & FILL FORM
     ========================================== */
  document.querySelectorAll('.card-request-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute('data-service-id');
      
      // Auto select service in form
      if (serviceSelect && serviceId) {
        serviceSelect.value = serviceId;
      }
      
      // Smooth scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Focus name input for user convenience
        setTimeout(() => {
          const nameInput = document.getElementById('form-name');
          if (nameInput) nameInput.focus();
        }, 800);
      }
    });
  });

  /* ==========================================
     4. HERO HTML5 CANVAS PARTICLES ENGINE
     ========================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Resize canvas
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle Class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 80;
        this.size = Math.random() * 3.5 + 1.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.decay = Math.random() * 0.005 + 0.002;
        
        // Joker Palette: Red, Green, or Amber sparks
        const colors = [
          'rgba(192, 57, 43, ', // Red
          'rgba(255, 32, 32, ',  // Bright Glow Red
          'rgba(30, 132, 73, ',  // Green
          'rgba(212, 175, 55, '  // Gold
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;
        
        if (this.alpha <= 0 || this.y < 0) {
          this.reset();
        }
      }
      
      draw() {
        ctx.save();
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.colorPrefix.includes('192') || this.colorPrefix.includes('255') 
          ? '#ff2020' 
          : (this.colorPrefix.includes('30') ? '#1e8449' : '#d4af37');
          
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.alpha + ')';
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Init particles list
    function initParticles() {
      const totalParticles = Math.min(60, Math.floor(canvas.width / 20));
      for (let i = 0; i < totalParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    
    // Loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================
     5. SCROLL TRIGGERED ANIMATIONS & COUNTERS
     ========================================== */
  const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right');
  
  // Animation on scroll observer
  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => animObserver.observe(el));
  
  // Counter statistics observer
  const statsRow = document.querySelector('.stats-row');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsRow) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const suffix = num.getAttribute('data-suffix') || '';
            animateCounter(num, target, suffix);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    counterObserver.observe(statsRow);
  }
  
  function animateCounter(element, target, suffix) {
    let start = 0;
    const duration = 2000; // 2 seconds counting animation
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);
      
      element.textContent = currentVal + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target + suffix;
      }
    }
    
    requestAnimationFrame(updateCount);
  }

  /* ==========================================
     6. FORM CONTROLLER & AUTO-REPLY SYSTEM
     ========================================== */
  const contactForm = document.getElementById('joker-contact-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalJokerIcon = document.querySelector('.modal-joker-icon');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Capture details
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const email = document.getElementById('form-email').value;
      const service = serviceSelect.value;
      const message = document.getElementById('form-message').value;
      
      // Basic validation check
      if (!name || !phone || !email || !service) {
        alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة!' : 'Please fill all required fields!');
        return;
      }
      
      // Save data locally to simulate requests database
      const requestData = {
        name,
        phone,
        email,
        service,
        message,
        timestamp: new Date().toISOString()
      };
      
      let existingRequests = JSON.parse(localStorage.getItem('joker_requests') || '[]');
      existingRequests.push(requestData);
      localStorage.setItem('joker_requests', JSON.stringify(existingRequests));
      
      // Dynamic rendering of ASCII success template in active locale
      const asciiContainer = document.getElementById('ascii-box-content');
      if (asciiContainer) {
        asciiContainer.innerHTML = buildAsciiCard(currentLang);
      }
      
      // Clear form inputs
      contactForm.reset();
      
      // Show custom success modal
      if (successModal) {
        successModal.classList.add('active');
        
        // Spin the joker 🃏 emoji card
        if (modalJokerIcon) {
          modalJokerIcon.classList.remove('spinning');
          void modalJokerIcon.offsetWidth; // trigger reflow
          modalJokerIcon.classList.add('spinning');
        }
      }
    });
  }

  // Close modal click
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (successModal) {
        successModal.classList.remove('active');
      }
    });
  }
  
  // Close modal when clicking on layout wrapper overlay
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  function buildAsciiCard(lang) {
    if (lang === 'ar') {
      return `╔══════════════════════════════════════╗
║  🃏 الجوكر استلم طلبك
║  
║  شكراً! الجوكر سيراجع طلبك        
║  وسيعود إليك قريباً.               
║  
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║  🃏 THE JOKER HAS RECEIVED YOUR REQUEST
║  
║  Thank you! The Joker will review your  
║  request and get back to you shortly.   
╚══════════════════════════════════════╝`;
    } else {
      return `╔══════════════════════════════════════╗
║  🃏 THE JOKER HAS RECEIVED YOUR REQUEST
║  
║  Thank you! The Joker will review your  
║  request and get back to you shortly.   
║  
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║  🃏 الجوكر استلم طلبك
║  
║  شكراً! الجوكر سيراجع طلبك        
║  وسيعود إليك قريباً.               
╚══════════════════════════════════════╝`;
    }
  }
});
