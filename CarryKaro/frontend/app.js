// Frontend JavaScript for CarryKaro

const apiBaseUrl = 'http://localhost:5000/api';

// Utility function to show messages
function showMessage(msg) {
  const messageEl = document.getElementById('message');
  if (messageEl) {
    messageEl.textContent = msg;
  }
}

// Home page login/signup logic
if (document.getElementById('auth-form')) {
  const authForm = document.getElementById('auth-form');
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggle-text');
  const formTitle = document.getElementById('form-title');
  const nameField = document.getElementById('name-field');
  const submitBtn = document.getElementById('submit-btn');

  let isLogin = true;

  toggleBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
      formTitle.textContent = 'Login';
      nameField.style.display = 'none';
      submitBtn.textContent = 'Login';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Signup';
    } else {
      formTitle.textContent = 'Signup';
      nameField.style.display = 'block';
      submitBtn.textContent = 'Signup';
      toggleText.textContent = 'Already have an account?';
      toggleBtn.textContent = 'Login';
    }
    showMessage('');
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const mobileNumber = document.getElementById('mobileNumber').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!mobileNumber || !password || (!isLogin && !name)) {
      showMessage('Please fill all required fields');
      return;
    }

    try {
      if (isLogin) {
        // Login
        const res = await fetch(`${apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('isAdmin', data.isAdmin);
          localStorage.setItem('isSeller', data.isSeller);
          localStorage.setItem('userLoggedIn', 'true');  // Set login flag for header
          window.location.href = 'products.html';
        } else {
          showMessage(data.message || 'Login failed');
        }
      } else {
        // Signup
        const res = await fetch(`${apiBaseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, mobileNumber, password }),
        });
        const data = await res.json();
        if (res.ok) {
          showMessage('Signup successful. Please login.');
          toggleBtn.click(); // switch to login
          authForm.reset();
          localStorage.removeItem('userLoggedIn'); // Ensure login flag cleared on signup
        } else {
          showMessage(data.message || 'Signup failed');
        }
      }
    } catch (err) {
      showMessage('Error connecting to server');
    }
  });
}

// Hamburger menu logic on products page
if (document.getElementById('hamburger-btn')) {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const logoutLink = document.getElementById('logout-link');

  hamburgerBtn.addEventListener('click', () => {
    if (hamburgerMenu.style.display === 'none') {
      hamburgerMenu.style.display = 'block';
    } else {
      hamburgerMenu.style.display = 'none';
    }
  });

  logoutLink.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });
}

// Profile page logic
if (document.getElementById('profile-name')) {
  document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('profileName') || 'N/A';
    const address = localStorage.getItem('profileAddress') || 'N/A';
    const contact = localStorage.getItem('profileContact') || 'N/A';

    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-address').textContent = address;
    document.getElementById('profile-contact').textContent = contact;
  });
}

// Checkout page logic to save profile info
if (document.getElementById('checkout-form')) {
  const checkoutForm = document.getElementById('checkout-form');
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const contact = document.getElementById('contact').value.trim();

    localStorage.setItem('profileName', name);
    localStorage.setItem('profileAddress', address);
    localStorage.setItem('profileContact', contact);

    // Proceed with order submission as before
    const paymentMode = document.getElementById('paymentMode').value;
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    if (Object.keys(cart).length === 0) {
      document.getElementById('message').textContent = 'Your cart is empty';
      return;
    }
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cart, name, address, contact, paymentMode }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem('cart');
        alert('Order placed successfully');
        window.location.href = 'products.html';
      } else {
        document.getElementById('message').textContent = data.message || 'Order failed';
      }
    } catch (err) {
      document.getElementById('message').textContent = 'Error connecting to server';
    }
  });
}

// Admin page logic to include GST number and seller signup
if (document.getElementById('admin-form')) {
  const adminForm = document.getElementById('admin-form');
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const gstNumber = document.getElementById('gstNumber') ? document.getElementById('gstNumber').value.trim() : '';

    if (!name || !description || !price || !imageUrl || !gstNumber) {
      document.getElementById('message').textContent = 'Please fill all fields including GST number';
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, imageUrl, gstNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        document.getElementById('message').textContent = 'Product added successfully';
        adminForm.reset();
      } else {
        document.getElementById('message').textContent = data.message || 'Failed to add product';
      }
    } catch (err) {
      document.getElementById('message').textContent = 'Error connecting to server';
    }
  });
}
