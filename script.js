// --- CONFIGURATION ---
// Get your Web3Forms Access Key from https://web3forms.com/ and paste it below
const WEB3FORMS_ACCESS_KEY = "aada2cd7-ed67-455f-bbdc-526f99afb507";

document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE MENU TOGGLE ---
  const mobileMenu = document.getElementById('mobile-menu');
  const menuTrigger = document.getElementById('mobile-menu-trigger');
  const menuClose = document.getElementById('mobile-menu-close');

  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // --- SMOOTH SCROLLING ---
  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Desktop Nav Links
  const navLinks = {
    'coresca-nav-link-programs': 'programs',
    'coresca-nav-link-benefits': 'benefits',
    'coresca-nav-link-testimonials': 'testimonials',
    'coresca-nav-link-contact': 'contact',
    'coresca-navbar-book-demo-btn': 'demo-form',
    'coresca-hero-book-demo-btn': 'demo-form',
    'coresca-hero-explore-programs-btn': 'programs'
  };

  Object.keys(navLinks).forEach(testId => {
    const btn = document.querySelector(`[data-testid="${testId}"]`);
    if (btn) {
      btn.addEventListener('click', () => scrollToSection(navLinks[testId]));
    }
  });

  // Mobile Nav Links
  const mobileButtons = document.querySelectorAll('.mobile-nav-link');
  mobileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      scrollToSection(targetId);
    });
  });

  // logo navigation (scroll to top)
  const logos = document.querySelectorAll('[data-testid="coresca-logo"]');
  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // --- PROGRAM CARD INQUIRE NOW ACTIONS ---
  // German, Spanish, Japanese, Italian, Portuguese card triggers
  const programCards = [
    { testId: 'coresca-program-card-german', value: 'German' },
    { testId: 'coresca-program-card-spanish', value: 'Spanish' },
    { testId: 'coresca-program-card-japanese', value: 'Japanese' },
    { testId: 'coresca-program-card-italian', value: 'Italian' },
    { testId: 'coresca-program-card-portuguese', value: 'Portuguese' }
  ];

  programCards.forEach(card => {
    const container = document.querySelector(`[data-testid="${card.testId}"]`);
    if (container) {
      const inquireBtn = container.querySelector('button');
      if (inquireBtn) {
        inquireBtn.addEventListener('click', () => {
          // Set the dropdown select value
          const select = document.getElementById('language');
          if (select) {
            select.value = card.value;
          }
          // Scroll to the demo form
          scrollToSection('demo-form');
        });
      }
    }
  });

  // Footer program list links
  const footerBtns = document.querySelectorAll('footer ul button');
  footerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim().toLowerCase();
      let val = 'German';
      if (text.includes('spanish')) val = 'Spanish';
      else if (text.includes('japanese')) val = 'Japanese';
      else if (text.includes('italian')) val = 'Italian';
      else if (text.includes('portuguese')) val = 'Portuguese';
      
      const select = document.getElementById('language');
      if (select) {
        select.value = val;
      }
      scrollToSection('demo-form');
    });
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Collapse all other FAQ items (Accordion mode)
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent && otherContent !== content) {
            otherContent.style.maxHeight = '0px';
            if (otherIcon) {
              otherIcon.classList.remove('rotate-180');
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          content.style.maxHeight = '0px';
          if (icon) {
            icon.classList.remove('rotate-180');
          }
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (icon) {
            icon.classList.add('rotate-180');
          }
        }
      });
    }
  });

  // --- INQUIRY FORM SUBMISSION ---
  const form = document.querySelector('#demo-form form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const language = document.getElementById('language').value;
      const message = document.getElementById('message').value.trim();

      const newInquiry = {
        id: 'inq-' + Date.now(),
        name,
        phone,
        email,
        language,
        message,
        date: new Date().toISOString()
      };

      // 1. Load existing inquiries from localStorage or empty array (Local Backup)
      let inquiries = [];
      try {
        const stored = localStorage.getItem('coresca_inquiries');
        inquiries = stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Error reading localStorage:', err);
      }

      inquiries.unshift(newInquiry);

      try {
        localStorage.setItem('coresca_inquiries', JSON.stringify(inquiries));
      } catch (err) {
        console.error('Error writing to localStorage:', err);
      }

      // Set button to loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtnSpan) {
          submitBtnSpan.textContent = 'Submitting Request...';
        }
      }

      // 2. Submit Email notification via Web3Forms
      if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE') {
        const payload = {
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Demo Inquiry: ${name} (${language})`,
          from_name: 'Coresca Website Form',
          name: name,
          phone: phone,
          email: email,
          language: language,
          message: message || 'No custom batch preference or message provided.'
        };

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Inquiry email dispatched successfully via Web3Forms.');
            // Reset form
            form.reset();
            // Show success Toast Alert
            showToast('Thank you!', 'Our team will reach out to you as soon as possible.');
          } else {
            console.error('Failed to dispatch inquiry email:', data.message);
            // Show error Toast Alert
            showToast('Submission Issue', `${data.message}. Please click verify link in your Web3Forms email!`);
          }
        })
        .catch(err => {
          console.error('Network error during Web3Forms inquiry dispatch:', err);
          showToast('Network Error', 'Please check your internet connection and try again.');
        })
        .finally(() => {
          // Restore button state
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        });
      } else {
        console.warn('Web3Forms Access Key is not configured. Email dispatch skipped.');
        // Reset form & show toast (fallback behavior)
        form.reset();
        showToast('Thank you!', 'Our team will reach out to you as soon as possible.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }

  // --- TOAST NOTIFICATION UTILITY ---
  function showToast(title, message) {
    // Check if a toast container already exists
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 md:px-0';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'bg-white text-slate-800 border-l-4 border-[#14B8A6] rounded-r-xl shadow-2xl p-4 flex items-start gap-3 transition-all duration-300 transform translate-y-10 opacity-0';
    toast.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';

    toast.innerHTML = `
      <div class="bg-teal-50 text-[#14B8A6] rounded-full p-1.5 shrink-0 mt-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-heading font-extrabold text-sm text-[#0A2540] leading-none mb-1">${title}</h4>
        <p class="font-body text-xs text-slate-500 leading-relaxed">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0" aria-label="Close Toast">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="12"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    // Animate slide-up & fade-in
    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Close button trigger
    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dismissToast(toast));
    }

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(toast);
    }, 4500);
  }

  function dismissToast(toast) {
    if (toast && toast.parentNode) {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }
});
