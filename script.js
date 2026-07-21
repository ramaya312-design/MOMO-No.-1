/* ==========================================================================
   MOMO No. 1 Javascript
   Handles Theme Toggles, Floating Particles, Interactive Customizers,
   Shopping Cart Plate sheet, Scroll Reveal, and Fictional Form Submissions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Sticky Header & Active Nav Links
     -------------------------------------------------------------------------- */
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header Scroll shrink
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Nav active link updates
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. Light/Dark Mode Toggle
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  body.className = savedTheme;
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
      body.classList.replace('light-mode', 'dark-mode');
      localStorage.setItem('theme', 'dark-mode');
      updateThemeIcon('dark-mode');
    } else {
      body.classList.replace('dark-mode', 'light-mode');
      localStorage.setItem('theme', 'light-mode');
      updateThemeIcon('light-mode');
    }
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark-mode') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close nav on link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  /* --------------------------------------------------------------------------
     4. Sticky Banner Close Trigger
     -------------------------------------------------------------------------- */
  const stickyBanner = document.getElementById('sticky-banner');
  const closeBannerBtn = document.getElementById('close-banner');

  closeBannerBtn.addEventListener('click', () => {
    stickyBanner.style.display = 'none';
  });

  /* --------------------------------------------------------------------------
     5. Spawning Floating Momos in Hero background
     -------------------------------------------------------------------------- */
  const floatingContainer = document.getElementById('hero-floating-momos');
  
  if (floatingContainer) {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      createFloatingMomo();
    }
  }

  function createFloatingMomo() {
    const particle = document.createElement('div');
    particle.className = 'floating-momo-particle';
    particle.innerText = '🥟';
    
    // Random sizes, horizontal spots, animation offsets
    const scale = Math.random() * 0.8 + 0.5;
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 8; // 8 to 16s
    const delay = Math.random() * -15; // negative delay so particles start immediately at different stages

    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.transform = `scale(${scale})`;
    
    floatingContainer.appendChild(particle);
  }

  /* --------------------------------------------------------------------------
     6. Interactive Menu Options (Stuffing, Spicy Meter, Price Modifiers)
     -------------------------------------------------------------------------- */
  const menuCards = document.querySelectorAll('.menu-card');

  menuCards.forEach(card => {
    const basePrice = parseFloat(card.querySelector('.base-price').dataset.base);
    const priceDisplay = card.querySelector('.base-price');
    const stuffingButtons = card.querySelectorAll('[data-option="stuffing"] .pill');
    const spicySlider = card.querySelector('.spicy-slider');
    const spicyText = card.querySelector('.spicy-level-text');
    const cheeseCheckbox = card.querySelector('.extra-cheese-cb');

    let stuffingPriceMod = 0;
    let cheesePriceMod = 0;

    // Helper to calculate total card price
    function updateCardPrice() {
      const finalPrice = basePrice + stuffingPriceMod + cheesePriceMod;
      priceDisplay.innerText = finalPrice.toFixed(2);
    }

    // Stuffing selector handler
    stuffingButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stuffingButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        stuffingPriceMod = parseFloat(btn.dataset.priceMod);
        updateCardPrice();
      });
    });

    // Spicy slider handler
    if (spicySlider) {
      spicySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        let text = '';
        let className = '';

        switch(val) {
          case 1:
            text = 'Mild 🔥';
            className = 'lvl-mild';
            break;
          case 2:
            text = 'Medium 🔥🔥';
            className = 'lvl-medium';
            break;
          case 3:
            text = 'Spicy 🔥🔥🔥';
            className = 'lvl-spicy';
            break;
          case 4:
            text = 'Insane 🔥🔥🔥🔥';
            className = 'lvl-insane';
            break;
        }
        spicyText.innerText = text;
        spicyText.className = 'spicy-level-text ' + className;
      });
    }

    // Cheese checkbox handler
    if (cheeseCheckbox) {
      cheeseCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          cheesePriceMod = parseFloat(cheeseCheckbox.dataset.priceMod);
        } else {
          cheesePriceMod = 0;
        }
        updateCardPrice();
      });
    }
  });

  /* --------------------------------------------------------------------------
     7. Shopping Cart (Plate) State & Functionality
     -------------------------------------------------------------------------- */
  let cart = [];

  const cartTrigger = document.getElementById('cart-trigger');
  const cartModal = document.getElementById('cart-modal');
  const closeCartModalBtn = document.getElementById('close-cart-modal');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalSpan = document.getElementById('cart-subtotal');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartCountBadge = document.getElementById('cart-count');
  const cartPromoCallout = document.getElementById('cart-promo-msg');

  // Open/Close Cart
  cartTrigger.addEventListener('click', () => cartModal.classList.add('open'));
  closeCartModalBtn.addEventListener('click', () => cartModal.classList.remove('open'));
  
  // Close modal when clicking outside contents
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('open');
    }
  });

  // Clear plate
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartUI();
  });

  // Add Item click listener
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  addCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.menu-card');
      const id = card.dataset.momoId;
      const name = card.querySelector('.momo-name').innerText;
      
      const stuffingVal = card.querySelector('[data-option="stuffing"] .pill.active').innerText;
      const spicyVal = card.querySelector('.spicy-level-text').innerText;
      const hasCheese = card.querySelector('.extra-cheese-cb') ? card.querySelector('.extra-cheese-cb').checked : false;
      const price = parseFloat(card.querySelector('.base-price').innerText);
      
      addToCart(id, name, stuffingVal, spicyVal, hasCheese, price);
      
      // Fun visual micro-feedback: shake button on click
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = 'none';
      }, 150);
    });
  });

  function addToCart(id, name, stuffing, spicy, cheese, price) {
    // Generate unique composite key for item configuration
    const configKey = `${id}-${stuffing}-${spicy.replace(/\s+/g, '')}-${cheese}`;
    
    const existingIndex = cart.findIndex(item => item.configKey === configKey);
    
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        configKey,
        id,
        name,
        stuffing,
        spicy,
        cheese,
        price,
        qty: 1
      });
    }
    
    updateCartUI();
  }

  function updateCartUI() {
    // 1. Badge count
    const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);
    cartCountBadge.innerText = totalQty;
    
    // 2. Animate cart trigger badge on change
    cartCountBadge.style.transform = 'scale(1.3)';
    setTimeout(() => {
      cartCountBadge.style.transform = 'scale(1)';
    }, 200);

    // 3. Clear container list
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart-message">Your plate is currently empty! Head to the menu to add some flavor.</p>`;
      cartPromoCallout.classList.add('hidden');
      cartSubtotalSpan.innerText = '0.00';
      cartTotalSpan.innerText = '0.00';
      return;
    }

    // 4. Fill item elements
    let subtotal = 0;
    cart.forEach(item => {
      const itemCost = item.price * item.qty;
      subtotal += itemCost;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      
      const customsText = `${item.stuffing} stuffing, ${item.spicy}${item.cheese ? ', Extra Cheese 🧀' : ''}`;
      
      itemEl.innerHTML = `
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-customs">${customsText}</span>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-qty">
            <button class="qty-btn" data-key="${item.configKey}" data-action="decrease"><i class="fas fa-minus"></i></button>
            <span class="qty-number">${item.qty}</span>
            <button class="qty-btn" data-key="${item.configKey}" data-action="increase"><i class="fas fa-plus"></i></button>
          </div>
          <span class="cart-item-price">$${itemCost.toFixed(2)}</span>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // 5. Quantity modification listeners
    const qtyButtons = cartItemsContainer.querySelectorAll('.qty-btn');
    qtyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target.closest('.qty-btn');
        const key = button.dataset.key;
        const action = button.dataset.action;
        modifyCartQty(key, action);
      });
    });

    // 6. Promotional rules check (Any plate qualifies for 1 free cold drink per plate or 1 overall)
    // Banner requirements say: "Buy Any Plate of Momos & Get One FREE Cold Drink!"
    // We award 1 free cold drink for every single plate (total quantity ordered)
    if (totalQty > 0) {
      cartPromoCallout.classList.remove('hidden');
      cartPromoCallout.querySelector('.free-drink-count').innerText = totalQty;
    } else {
      cartPromoCallout.classList.add('hidden');
    }

    // 7. Calculate final totals
    cartSubtotalSpan.innerText = subtotal.toFixed(2);
    cartTotalSpan.innerText = subtotal.toFixed(2); // delivery is free!
  }

  function modifyCartQty(key, action) {
    const index = cart.findIndex(item => item.configKey === key);
    if (index === -1) return;

    if (action === 'increase') {
      cart[index].qty += 1;
    } else if (action === 'decrease') {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
    }
    updateCartUI();
  }

  // Checkout Sim
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    // Bollywood success alert dialogue
    alert(`🎉 BLOCKBUSTER ORDER CONFIRMED! 🎬\n\nYour fresh momos are rolling! They will travel down Haathi Pahad right to your doorstep.\nTotal amount: $${cartTotalSpan.innerText}\nPlus: ${cartCountBadge.innerText} FREE cold drink(s) are packed! 🥤\n\nThank you for choosing MOMO No. 1!`);
    
    cart = [];
    updateCartUI();
    cartModal.classList.remove('open');
  });

  /* --------------------------------------------------------------------------
     8. Scroll Reveal Feature (Intersection Observer)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Once visible, no need to track again
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* --------------------------------------------------------------------------
     9. Fictional Contact Form Handler
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      
      formFeedback.className = 'form-feedback-message success';
      formFeedback.innerHTML = `🎥 <strong>Dhamakedar Message Sent!</strong> Shukriya, ${name}! Your cinematic feedback has been received. Our team will review it under the extra hot lights! 🌶️`;
      
      contactForm.reset();
      
      // Auto-hide feedback after 8 seconds
      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 8000);
    });
  }
});
