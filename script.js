document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger-menu');
  const nav = document.querySelector('.navigation');

  if (!burger || !nav) return;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('nav-open');
    burger.classList.toggle('fa-bars');
    burger.classList.toggle('fa-xmark');
  });

  document.querySelectorAll('.nav-a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      burger.classList.add('fa-bars');
      burger.classList.remove('fa-xmark');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('nav-open');
      burger.classList.add('fa-bars');
      burger.classList.remove('fa-xmark');
    }
  });
});

function getCart() {
  return JSON.parse(localStorage.getItem('essenceCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('essenceCart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) item.qty = 1;
  saveCart(cart);
  renderCart();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  const emptyMsg = document.getElementById('emptyCartMsg');
  const summaryBox = document.getElementById('summaryBox');
  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (summaryBox) summaryBox.style.display = 'none';
    updateCartCount();
    return;
  }

  container.style.display = 'flex';
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (summaryBox) summaryBox.style.display = 'block';

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.dataset.id = item.id;
    el.innerHTML = `
      <div class="cart-item-photo">
        <img src="${item.img}" alt="${item.name}" />
        <span class="cart-tag">${item.tag}</span>
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-size">${item.size}</p>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">$ ${(item.price * item.qty).toFixed(2)}</p>
        <div class="qty-box">
          <button class="qty-btn minus" aria-label="შემცირება">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn plus" aria-label="გაზრდა">+</button>
        </div>
      </div>
      <button class="remove-btn" aria-label="წაშლა">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    el.querySelector('.minus').addEventListener('click', () => changeQty(item.id, -1));
    el.querySelector('.plus').addEventListener('click', () => changeQty(item.id, 1));
    el.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.id));

    container.appendChild(el);
  });

  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  if (subtotalEl) subtotalEl.textContent = `$ ${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$ ${subtotal.toFixed(2)}`;

  updateCartCount();
}

// fragrance.html-ზე "კალათაში დამატება" ღილაკების გააქტიურება
function initAddToCartButtons() {
  document.querySelectorAll('.cart-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        size: btn.dataset.size,
        tag: btn.dataset.tag,
        price: parseFloat(btn.dataset.price),
        img: btn.dataset.img,
      };
      addToCart(item);

      const original = btn.textContent;
      btn.textContent = 'დამატებულია ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    });
  });
}

function initCheckoutButton() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;
  checkoutBtn.addEventListener('click', () => {
    localStorage.removeItem('essenceCart');
    alert('თქვენი შეკვეთა წარმატებით გაფორმდა! მადლობთ, რომ ირჩევთ ESSENCE-ს.');
    renderCart();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAddToCartButtons();
  initCheckoutButton();
  renderCart();
  updateCartCount();
});
// ===== ESSENCE contact-validation.js =====
// Contact ფორმის ვალიდაცია (frontend-only, backend არ არსებობს ჯერ)

function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return; // ეს გვერდი contact.html არაა

  const fields = {
    FirstName: {
      el: document.getElementById('FirstName'),
      validate(value) {
        const v = value.trim();
        if (!v) return 'გთხოვთ, შეიყვანოთ სახელი';
        if (v.length < 2) return 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს';
        if (!/^[a-zA-Zა-ჰ\s-]+$/.test(v)) return 'სახელი უნდა შეიცავდეს მხოლოდ ასოებს';
        return '';
      },
    },
    Email: {
      el: document.getElementById('Email'),
      validate(value) {
        const v = value.trim();
        if (!v) return 'გთხოვთ, შეიყვანოთ ელ-ფოსტა';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(v)) return 'გთხოვთ, შეიყვანოთ სწორი ელ-ფოსტა';
        return '';
      },
    },
    Message: {
      el: document.getElementById('Message'),
      validate(value) {
        const v = value.trim();
        if (!v) return 'გთხოვთ, დაწერეთ შეტყობინება';
        if (v.length < 10) return 'შეტყობინება ძალიან მოკლეა (მინ. 10 სიმბოლო)';
        if (v.length > 1000) return 'შეტყობინება ძალიან გრძელია (მაქს. 1000 სიმბოლო)';
        return '';
      },
    },
  };

  function showError(field, message) {
    const group = field.el.closest('.input-group');
    let errorEl = group.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.setAttribute('role', 'alert');
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    field.el.classList.toggle('invalid', Boolean(message));
    field.el.setAttribute('aria-invalid', Boolean(message));
  }

  // ვალიდაცია ველის დატოვებისას (blur) და შემდეგ ცოცხალი შესწორება input-ზე
  Object.values(fields).forEach((field) => {
    field.el.addEventListener('blur', () => {
      showError(field, field.validate(field.el.value));
    });
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('invalid')) {
        showError(field, field.validate(field.el.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;
    let firstInvalidField = null;

    Object.values(fields).forEach((field) => {
      const message = field.validate(field.el.value);
      showError(field, message);
      if (message) {
        hasError = true;
        if (!firstInvalidField) firstInvalidField = field.el;
      }
    });

    if (hasError) {
      firstInvalidField.focus();
      return;
    }

    // TODO: აქ უნდა მოხდეს რეალური fetch/backend გამოძახება,
    // როცა სერვერის მხარე გექნება მზად. ჯერჯერობით — მხოლოდ UI ფიდბექი.
    form.reset();
    Object.values(fields).forEach((field) => field.el.classList.remove('invalid'));
    document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));

    alert('თქვენი შეტყობინება წარმატებით გაიგზავნა!');
  });
}

document.addEventListener('DOMContentLoaded', initContactFormValidation);