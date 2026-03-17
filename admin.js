document.addEventListener("DOMContentLoaded", () => {
    
    // --- Login Logic ---
    const loginForm = document.getElementById('admin-login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');

    const adminUser = "FILA";
    const adminPass = "4356";

    // Check session
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('admin-user').value;
        const p = document.getElementById('admin-pass').value;

        if (u === adminUser && p === adminPass) {
            sessionStorage.setItem('admin_logged_in', 'true');
            showDashboard();
        } else {
            loginError.style.display = 'block';
        }
    });

    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('admin_logged_in');
        loginContainer.style.display = 'flex';
        dashboardContainer.style.display = 'none';
        loginForm.reset();
        loginError.style.display = 'none';
    });

    function showDashboard() {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        loadProducts();
        loadReviews();
    }

    // --- Tabs Logic ---
    const tabProducts = document.getElementById('tab-products');
    const tabReviews = document.getElementById('tab-reviews');
    const secProducts = document.getElementById('products-section');
    const secReviews = document.getElementById('reviews-section');

    tabProducts.addEventListener('click', () => {
        tabProducts.classList.add('active');
        tabReviews.classList.remove('active');
        secProducts.style.display = 'block';
        secReviews.style.display = 'none';
    });

    tabReviews.addEventListener('click', () => {
        tabReviews.classList.add('active');
        tabProducts.classList.remove('active');
        secReviews.style.display = 'block';
        secProducts.style.display = 'none';
    });

    // --- Product Management Logic ---
    const productForm = document.getElementById('product-form');
    const prodListBody = document.getElementById('product-list-body');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const btnSaveProd = document.getElementById('btn-save-prod');

    function loadProducts() {
        prodListBody.innerHTML = '';
        let products = JSON.parse(localStorage.getItem('fila_products')) || [];

        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.title}</td>
                <td style="text-transform:uppercase;">${p.category}</td>
                <td>LKR ${p.priceLKR} / USD ${p.priceUSD}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${p.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${p.id})">Del</button>
                </td>
            `;
            prodListBody.appendChild(tr);
        });
    }

    window.deleteProduct = function(id) {
        if(confirm("Are you sure you want to delete this product?")) {
            let products = JSON.parse(localStorage.getItem('fila_products')) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem('fila_products', JSON.stringify(products));
            loadProducts();
        }
    }

    window.editProduct = function(id) {
        let products = JSON.parse(localStorage.getItem('fila_products')) || [];
        let p = products.find(x => x.id === id);
        if(!p) return;

        document.getElementById('prod-id').value = p.id;
        document.getElementById('prod-cat').value = p.category;
        document.getElementById('prod-title').value = p.title;
        document.getElementById('prod-lkr').value = p.priceLKR;
        document.getElementById('prod-usd').value = p.priceUSD;
        document.getElementById('prod-feat').value = p.features.join(', ');
        document.getElementById('prod-premium').checked = p.premium;
        
        btnCancelEdit.style.display = 'inline-block';
        btnSaveProd.innerText = 'UPDATE PRODUCT';
    }

    btnCancelEdit.addEventListener('click', () => {
        productForm.reset();
        document.getElementById('prod-id').value = '';
        btnCancelEdit.style.display = 'none';
        btnSaveProd.innerText = 'SAVE PRODUCT';
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('prod-id').value;
        const cat = document.getElementById('prod-cat').value;
        const title = document.getElementById('prod-title').value;
        const lkr = parseInt(document.getElementById('prod-lkr').value);
        const usd = parseInt(document.getElementById('prod-usd').value);
        const featStr = document.getElementById('prod-feat').value;
        const premium = document.getElementById('prod-premium').checked;

        const features = featStr.split(',').map(f => f.trim()).filter(f => f !== '');
        
        let products = JSON.parse(localStorage.getItem('fila_products')) || [];

        if(id) { // Update
            let index = products.findIndex(x => x.id === parseInt(id));
            if(index !== -1) {
                products[index] = { id: parseInt(id), category: cat, title, priceLKR: lkr, priceUSD: usd, features, premium };
            }
        } else { // Create
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, category: cat, title, priceLKR: lkr, priceUSD: usd, features, premium });
        }

        localStorage.setItem('fila_products', JSON.stringify(products));
        loadProducts();
        productForm.reset();
        document.getElementById('prod-id').value = '';
        btnCancelEdit.style.display = 'none';
        btnSaveProd.innerText = 'SAVE PRODUCT';
    });

    // --- Reviews Management Logic ---
    const reviewListBody = document.getElementById('review-list-body');

    function loadReviews() {
        reviewListBody.innerHTML = '';
        let reviews = JSON.parse(localStorage.getItem('fila_reviews')) || [];

        // Sort: pending first
        reviews.sort((a, b) => {
            if(a.status === 'pending' && b.status === 'approved') return -1;
            if(a.status === 'approved' && b.status === 'pending') return 1;
            return b.id - a.id;
        });

        reviews.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.name}</td>
                <td>${r.rating} / 5</td>
                <td>${r.comment}</td>
                <td><span style="color: ${r.status === 'pending'? '#ffb400' : '#00ff00'}">${r.status.toUpperCase()}</span></td>
                <td>
                    ${r.status === 'pending' ? `<button class="action-btn approve-btn" onclick="approveReview(${r.id})">Approve</button>` : ''}
                    <button class="action-btn delete-btn" onclick="deleteReview(${r.id})">Del</button>
                </td>
            `;
            reviewListBody.appendChild(tr);
        });
    }

    window.approveReview = function(id) {
        let reviews = JSON.parse(localStorage.getItem('fila_reviews')) || [];
        let index = reviews.findIndex(r => r.id === id);
        if(index !== -1) {
            reviews[index].status = 'approved';
            localStorage.setItem('fila_reviews', JSON.stringify(reviews));
            loadReviews();
        }
    }

    window.deleteReview = function(id) {
        if(confirm("Are you sure you want to delete this review?")) {
            let reviews = JSON.parse(localStorage.getItem('fila_reviews')) || [];
            reviews = reviews.filter(r => r.id !== id);
            localStorage.setItem('fila_reviews', JSON.stringify(reviews));
            loadReviews();
        }
    }

});
