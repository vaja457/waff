// ========================================================
// WAFF Admin Studio Controller (admin.js)
// Full Menu Management: CRUD, Image Upload, Password, Backups,
// Featured on Home Page Picker (up to 4 products)
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Authentication & UI Elements
  const loginScreen = document.getElementById('adminLoginScreen');
  const dashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('adminLoginForm');
  const passInput = document.getElementById('adminPassInput');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const togglePassBtn = document.getElementById('togglePassVisibilityBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const changePassBtn = document.getElementById('changePassBtn');

  // Stats Counters
  const statTotal = document.getElementById('statTotalCount');
  const statWaffles = document.getElementById('statWafflesCount');
  const statToppings = document.getElementById('statToppingsCount');
  const statDrinks = document.getElementById('statDrinksCount');
  const statExtras = document.getElementById('statExtrasCount');
  const statFeatured = document.getElementById('statFeaturedCount');

  // Pill Counters
  const pillAll = document.getElementById('pillCountAll');
  const pillWaffles = document.getElementById('pillCountWaffles');
  const pillToppings = document.getElementById('pillCountToppings');
  const pillDrinks = document.getElementById('pillCountDrinks');
  const pillExtras = document.getElementById('pillCountExtras');
  const pillFeatured = document.getElementById('pillCountFeatured');

  // Toolbar & Search
  const addProductBtn = document.getElementById('openAddProductModalBtn');
  const searchInput = document.getElementById('adminSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const exportBtn = document.getElementById('exportMenuBtn');
  const importFileInput = document.getElementById('importMenuFileInput');
  const resetBtn = document.getElementById('resetMenuBtn');

  // Filter Pills & Grid
  const catPills = document.querySelectorAll('.cat-pill');
  const productsGrid = document.getElementById('adminProductsGrid');
  const emptyState = document.getElementById('emptyState');

  // Product Modal
  const productModal = document.getElementById('productModalOverlay');
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');
  const formProductId = document.getElementById('formProductId');
  const formCategory = document.getElementById('formCategory');
  const formTitle = document.getElementById('formTitle');
  const formPrice = document.getElementById('formPrice');
  const formRating = document.getElementById('formRating');
  const formBadge = document.getElementById('formBadge');
  const formImageFile = document.getElementById('formImageFile');
  const formImageUrl = document.getElementById('formImageUrl');
  const imagePreviewImg = document.getElementById('imagePreviewImg');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  const formHeroImageFile = document.getElementById('formHeroImageFile');
  const formHeroImageUrl = document.getElementById('formHeroImageUrl');
  const heroImagePreviewImg = document.getElementById('heroImagePreviewImg');
  const heroPreviewPlaceholder = document.getElementById('heroPreviewPlaceholder');
  const formShortDesc = document.getElementById('formShortDesc');
  const formDetailedDesc = document.getElementById('formDetailedDesc');
  const formFeaturedHome = document.getElementById('formFeaturedHome');

  // Password Modal
  const passwordModal = document.getElementById('passwordModalOverlay');
  const changePassForm = document.getElementById('changePasswordForm');
  const currentPassInput = document.getElementById('currentPassInput');
  const newPassInput = document.getElementById('newPassInput');
  const confirmNewPassInput = document.getElementById('confirmNewPassInput');
  const passErrorBox = document.getElementById('passErrorBox');
  const closePassModalBtn = document.getElementById('closePassModalBtn');
  const cancelPassBtn = document.getElementById('cancelPassBtn');

  // Delete Modal
  const deleteModal = document.getElementById('deleteModalOverlay');
  const deleteItemTitleText = document.getElementById('deleteItemTitleText');
  const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // State Variables
  let menuItems = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let pendingDeleteId = null;

  // Initialize
  initApp();

  function initApp() {
    menuItems = getStoredMenu();

    // Check existing auth
    if (isAdminLoggedIn()) {
      showDashboard();
    } else {
      showLogin();
    }

    setupEventListeners();
  }

  function showLogin() {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
    if (loginErrorMsg) loginErrorMsg.style.display = 'none';
    if (passInput) {
      passInput.value = '';
      setTimeout(() => passInput.focus(), 150);
    }
  }

  function showDashboard() {
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    refreshAll();
    showToast('მოგესალმებით WAFF ადმინ პანელში!');
  }

  function setupEventListeners() {
    // Login form submit
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = passInput.value.trim();
        if (verifyAdminPassword(entered)) {
          setAdminLoggedIn(true);
          showDashboard();
        } else {
          loginErrorMsg.style.display = 'block';
          passInput.classList.add('error-shake');
          setTimeout(() => passInput.classList.remove('error-shake'), 500);
        }
      });
    }

    // Toggle password eye in login
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        togglePassBtn.textContent = type === 'password' ? '👁️' : '🙈';
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        setAdminLoggedIn(false);
        showLogin();
      });
    }

    // Open change password modal
    if (changePassBtn) {
      changePassBtn.addEventListener('click', () => {
        openChangePassModal();
      });
    }

    // Change password submit
    if (changePassForm) {
      changePassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = currentPassInput.value.trim();
        const n1 = newPassInput.value.trim();
        const n2 = confirmNewPassInput.value.trim();

        if (!verifyAdminPassword(cur)) {
          showPassError('მიმდინარე პაროლი არასწორია!');
          return;
        }

        if (n1.length < 4) {
          showPassError('ახალი პაროლი უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს!');
          return;
        }

        if (n1 !== n2) {
          showPassError('ახალი პაროლები ერთმანეთს არ ემთხვევა!');
          return;
        }

        setAdminPassword(n1);
        closeChangePassModal();
        showToast('პაროლი წარმატებით შეიცვალა!', 'success');
      });
    }

    if (closePassModalBtn) closePassModalBtn.addEventListener('click', closeChangePassModal);
    if (cancelPassBtn) cancelPassBtn.addEventListener('click', closeChangePassModal);

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        }
        renderProducts();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderProducts();
        searchInput.focus();
      });
    }

    // Category filter pills
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.category;
        renderProducts();
      });
    });

    // Product modal controls
    if (addProductBtn) addProductBtn.addEventListener('click', openAddModal);
    if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
    if (cancelProductBtn) cancelProductBtn.addEventListener('click', closeProductModal);

    // File upload -> Data URL (Menu Image)
    if (formImageFile) {
      formImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          formImageUrl.value = dataUrl;
          imagePreviewImg.src = dataUrl;
          imagePreviewImg.style.display = 'block';
          if (previewPlaceholder) previewPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      });
    }

    // URL input -> preview update (Menu Image)
    if (formImageUrl) {
      formImageUrl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          imagePreviewImg.src = val;
          imagePreviewImg.style.display = 'block';
          if (previewPlaceholder) previewPlaceholder.style.display = 'none';
        }
      });
    }

    // File upload -> Data URL (Hero Background-free Image)
    if (formHeroImageFile) {
      formHeroImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          formHeroImageUrl.value = dataUrl;
          heroImagePreviewImg.src = dataUrl;
          heroImagePreviewImg.style.display = 'block';
          if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      });
    }

    // URL input -> preview update (Hero Background-free Image)
    if (formHeroImageUrl) {
      formHeroImageUrl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          heroImagePreviewImg.src = val;
          heroImagePreviewImg.style.display = 'block';
          if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'none';
        }
      });
    }

    // Save product form
    if (productForm) {
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let priceVal = formPrice.value.trim();
        if (!priceVal.startsWith('₾')) {
          priceVal = `₾ ${priceVal.replace(/^[₾\s]+/, '')}`;
        }

        const id = formProductId.value;
        const isNew = !id;
        const willBeFeatured = formFeaturedHome ? formFeaturedHome.checked : false;

        // Check if user tries to feature more than 4 items
        const otherFeaturedCount = menuItems.filter(i => i.featuredHome && String(i.id) !== String(id)).length;
        if (willBeFeatured && otherFeaturedCount >= 4) {
          showToast('მთავარ გვერდზე უკვე 4 პროდუქტია არჩეული. ჯერ სხვა ამოიღეთ.', 'error');
          return;
        }

        const existingItem = id ? menuItems.find(i => String(i.id) === String(id)) : null;
        const chosenHeroImage = formHeroImageUrl.value.trim() || (existingItem && existingItem.heroImage) || formImageUrl.value.trim() || 'images/waffle-hero-1.png';

        const productData = {
          id: id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          category: formCategory.value,
          title: formTitle.value.trim(),
          price: priceVal,
          rating: formRating.value.trim() || '5.0',
          badge: formBadge.value.trim(),
          image: formImageUrl.value.trim() || 'images/thumb-1.jpg',
          heroImage: chosenHeroImage,
          shortDesc: formShortDesc.value.trim(),
          detailedDesc: formDetailedDesc.value.trim() || formShortDesc.value.trim(),
          featuredHome: willBeFeatured
        };

        if (isNew) {
          menuItems.unshift(productData);
          showToast(`„${productData.title}“ წარმატებით დაემატა!`);
        } else {
          const idx = menuItems.findIndex(i => String(i.id) === String(id));
          if (idx !== -1) {
            menuItems[idx] = { ...menuItems[idx], ...productData };
            showToast(`„${productData.title}“ განახლდა!`);
          }
        }

        saveMenu(menuItems);
        closeProductModal();
        refreshAll();
      });
    }

    // Delete modal confirmation
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        if (!pendingDeleteId) return;
        const itemToDelete = menuItems.find(i => String(i.id) === String(pendingDeleteId));
        const title = itemToDelete ? itemToDelete.title : 'პროდუქტი';

        menuItems = menuItems.filter(i => String(i.id) !== String(pendingDeleteId));
        saveMenu(menuItems);
        closeDeleteModal();
        refreshAll();
        showToast(`„${title}“ წაიშალა.`, 'info');
      });
    }

    if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Export JSON Backup
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(menuItems, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `waff_menu_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('მენიუს სარეზერვო ფაილი ჩამოიტვირთა!', 'success');
      });
    }

    // Import JSON Backup
    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported) && imported.length > 0) {
              menuItems = imported;
              saveMenu(menuItems);
              refreshAll();
              showToast(`წარმატებით იმპორტირდა ${imported.length} პროდუქტი!`, 'success');
            } else {
              showToast('არასწორი JSON ფორმატი!', 'error');
            }
          } catch (err) {
            showToast('ფაილის წაკითხვა ვერ მოხერხდა: ' + err.message, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Menu to defaults
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('დარწმუნებული ხართ? მენიუს (საწყის) მდგომარეობა აღდგება. ყველა ცვლილება გაუქმდება.')) {
          menuItems = resetToDefaultMenu();
          refreshAll();
          showToast('საწყისი მენიუ აღდგენილია!', 'info');
        }
      });
    }
  }

  function refreshAll() {
    updateCounters();
    renderProducts();
  }

  function updateCounters() {
    const total = menuItems.length;
    const waffles = menuItems.filter(i => i.category === 'ვაფლები').length;
    const toppings = menuItems.filter(i => i.category === 'ტოპინგები').length;
    const drinks = menuItems.filter(i => i.category === 'სასმელები').length;
    const extras = menuItems.filter(i => i.category === 'ექსტრა').length;
    const featured = menuItems.filter(i => i.featuredHome === true).length;

    if (statTotal) statTotal.textContent = total;
    if (statWaffles) statWaffles.textContent = waffles;
    if (statToppings) statToppings.textContent = toppings;
    if (statDrinks) statDrinks.textContent = drinks;
    if (statExtras) statExtras.textContent = extras;
    if (statFeatured) statFeatured.textContent = `${featured}/4`;

    if (pillAll) pillAll.textContent = total;
    if (pillWaffles) pillWaffles.textContent = waffles;
    if (pillToppings) pillToppings.textContent = toppings;
    if (pillDrinks) pillDrinks.textContent = drinks;
    if (pillExtras) pillExtras.textContent = extras;
    if (pillFeatured) pillFeatured.textContent = `${featured}/4`;
  }

  function renderProducts() {
    if (!productsGrid) return;

    let filtered = menuItems;

    // Filter by Category
    if (currentFilter === 'featured') {
      filtered = filtered.filter(item => item.featuredHome === true);
    } else if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category === currentFilter);
    }

    // Filter by Search
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const t = (item.title || '').toLowerCase();
        const c = (item.category || '').toLowerCase();
        const p = (item.price || '').toLowerCase();
        const d = (item.shortDesc || '').toLowerCase() + (item.detailedDesc || '').toLowerCase();
        return t.includes(searchQuery) || c.includes(searchQuery) || p.includes(searchQuery) || d.includes(searchQuery);
      });
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    productsGrid.innerHTML = filtered.map(item => {
      const displayPrice = item.price.startsWith('₾') ? item.price : `₾ ${item.price}`;
      const ratingText = item.rating ? `★ ${item.rating}` : '★ 5.0';
      const isFeatured = !!item.featuredHome;

      return `
        <article class="product-card" data-id="${item.id}">
          <div class="card-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='images/thumb-1.jpg'">
            ${isFeatured ? '<span class="card-featured-badge">⭐ მთავარზე</span>' : ''}
            <span class="card-category-tag">${item.category}</span>
            <span class="card-price-badge">${displayPrice}</span>
            ${item.badge ? `<span class="card-rating-badge">${item.badge}</span>` : `<span class="card-rating-badge">${ratingText}</span>`}
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.shortDesc || item.detailedDesc || 'აღწერა არ არის მითითებული.'}</p>
            <div class="card-actions">
              <button type="button" class="card-star-btn ${isFeatured ? 'is-featured' : ''}" data-action="toggle-featured" data-id="${item.id}" title="${isFeatured ? 'მთავარი გვერდიდან ამოღება' : 'მთავარ გვერდზე დამატება (4-დან ერთ-ერთი)'}">
                <span>⭐ ${isFeatured ? 'მთავარზეა' : 'მთავარზე'}</span>
              </button>
              <button type="button" class="card-action-btn edit-btn" data-action="edit" data-id="${item.id}">
                <span>✏️ რედაქტირება</span>
              </button>
              <button type="button" class="card-action-btn delete-btn" data-action="delete" data-id="${item.id}">
                <span>🗑️ წაშლა</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Quick-toggle Star Button
    productsGrid.querySelectorAll('.card-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const res = toggleFeaturedHome(btn.dataset.id);
        if (res.success) {
          menuItems = getStoredMenu();
          refreshAll();
          showToast(res.message, 'success');
        } else {
          showToast(res.message, 'error');
        }
      });
    });

    // Re-bind action buttons
    productsGrid.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(btn.dataset.id);
      });
    });

    productsGrid.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(btn.dataset.id);
      });
    });
  }

  function openAddModal() {
    productForm.reset();
    formProductId.value = '';
    productModalTitle.textContent = 'ახალი პროდუქტის დამატება';
    formCategory.value = (currentFilter !== 'all' && currentFilter !== 'featured') ? currentFilter : 'ვაფლები';
    formPrice.value = '';
    formRating.value = '5.0';
    formBadge.value = '';
    formImageUrl.value = 'images/thumb-1.jpg';
    imagePreviewImg.src = 'images/thumb-1.jpg';
    imagePreviewImg.style.display = 'block';
    if (previewPlaceholder) previewPlaceholder.style.display = 'none';

    formHeroImageUrl.value = '';
    heroImagePreviewImg.src = 'images/waffle-hero-1.png';
    heroImagePreviewImg.style.display = 'block';
    if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'none';

    if (formFeaturedHome) formFeaturedHome.checked = false;
    productModal.classList.add('is-active');
    productModal.setAttribute('aria-hidden', 'false');
  }

  function openEditModal(productId) {
    const item = menuItems.find(i => String(i.id) === String(productId));
    if (!item) return;

    formProductId.value = item.id;
    productModalTitle.textContent = `რედაქტირება: ${item.title}`;
    formCategory.value = item.category || 'ვაფლები';
    formTitle.value = item.title || '';
    formPrice.value = item.price || '';
    formRating.value = item.rating || '5.0';
    formBadge.value = item.badge || '';

    // Menu Image (Full photo with background)
    formImageUrl.value = item.image || '';
    imagePreviewImg.src = item.image || 'images/thumb-1.jpg';
    imagePreviewImg.style.display = 'block';
    if (previewPlaceholder) previewPlaceholder.style.display = 'none';

    // Hero Image (Transparent cutout for Home page)
    formHeroImageUrl.value = item.heroImage || '';
    heroImagePreviewImg.src = item.heroImage || item.image || 'images/waffle-hero-1.png';
    heroImagePreviewImg.style.display = 'block';
    if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'none';

    formShortDesc.value = item.shortDesc || '';
    formDetailedDesc.value = item.detailedDesc || '';
    if (formFeaturedHome) formFeaturedHome.checked = !!item.featuredHome;

    productModal.classList.add('is-active');
    productModal.setAttribute('aria-hidden', 'false');
  }

  function closeProductModal() {
    productModal.classList.remove('is-active');
    productModal.setAttribute('aria-hidden', 'true');
    productForm.reset();
  }

  function openChangePassModal() {
    changePassForm.reset();
    if (passErrorBox) passErrorBox.style.display = 'none';
    passwordModal.classList.add('is-active');
    passwordModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => currentPassInput.focus(), 150);
  }

  function closeChangePassModal() {
    passwordModal.classList.remove('is-active');
    passwordModal.setAttribute('aria-hidden', 'true');
    changePassForm.reset();
  }

  function showPassError(msg) {
    if (passErrorBox) {
      passErrorBox.textContent = msg;
      passErrorBox.style.display = 'block';
    }
  }

  function openDeleteModal(productId) {
    pendingDeleteId = productId;
    const target = menuItems.find(i => String(i.id) === String(productId));
    const title = target ? target.title : '';
    if (deleteItemTitleText) {
      deleteItemTitleText.textContent = `„${title}“`;
    }
    deleteModal.classList.add('is-active');
    deleteModal.setAttribute('aria-hidden', 'false');
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('is-active');
    deleteModal.setAttribute('aria-hidden', 'true');
    pendingDeleteId = null;
  }

  function showToast(message, type = 'default') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'info' ? 'ℹ️' : '🔔'}</span>
      <span class="toast-text">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
