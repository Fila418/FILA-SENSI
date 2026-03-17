document.addEventListener("DOMContentLoaded", () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1200); // Small delay to show off the loader animation
    }

    // --- Data Initialization ---
    const defaultProducts = [
        // PC
        { id: 1, category: 'pc', title: 'PREMIUM FULL OPTIMIZE', priceLKR: 1500, priceUSD: 5, features: ['Windows tuning', 'Background service optimization', 'Gaming tweaks', 'GPU control panel tuning', 'Registry tweaks', 'Startup optimization', 'Latency reduction'], premium: true },
        { id: 2, category: 'pc', title: 'PUBG OPTIMIZE', priceLKR: 1000, priceUSD: 4, features: ['FPS boost tweaks', 'Input latency reduction', 'Sensitivity optimization', 'Performance stabilization'], premium: false },
        { id: 3, category: 'pc', title: 'PC GAME OPTIMIZATION', priceLKR: 1000, priceUSD: 4, features: ['GPU control panel optimization', 'Windows gaming tweaks', 'RAM usage optimization', 'FPS stability', 'Game configuration tuning'], premium: false },
        { id: 4, category: 'pc', title: 'INTERNET & NETWORK OPTIMIZATION', priceLKR: 500, priceUSD: 2, features: ['DNS optimization', 'Network adapter tuning', 'Ping reduction', 'Bandwidth management', 'Background network control'], premium: false },
        { id: 5, category: 'pc', title: 'STREAMER & CONTENT CREATOR OPTIMIZATION', priceLKR: 1500, priceUSD: 5, features: ['Streaming software configuration', 'Encoder performance tuning', 'Storage optimization', 'Background resource management', 'System stability improvements'], premium: true },
        { id: 6, category: 'pc', title: 'AI SERVICES', priceLKR: 500, priceUSD: 2, features: ['AI logo creation', 'Thumbnail design', 'Music generation', 'Content generation', 'AI automation setup'], premium: false },
        
        // Mobile
        { id: 7, category: 'mobile', title: 'NORMAL PACK', priceLKR: 1000, priceUSD: 4, features: ['Standard optimization', 'Battery usage tuning', 'Background process limit'], premium: false },
        { id: 8, category: 'mobile', title: 'PREMIUM MOBILE PACK', priceLKR: 1500, priceUSD: 5, features: ['Advanced gaming mode', 'Touch response improvement', 'Thermal management focus', 'Network priority tuning'], premium: true },
        
        // Courses
        { id: 9, category: 'courses', title: 'PC OPTIMIZATION COURSE', priceLKR: 12000, priceUSD: 40, features: ['Learn to start PC Optimization business', 'Step-by-step optimization methods', 'Improve performance', 'Build profitable service'], premium: true },
        { id: 10, category: 'courses', title: 'NORMAL COURSE', priceLKR: 5000, priceUSD: 17, features: ['For beginners', 'Basic PC optimization', 'Windows tuning', 'Gaming tweaks', 'Network optimization', 'Client service workflow'], premium: false },
        { id: 11, category: 'courses', title: 'PREMIUM COURSE', priceLKR: 8000, priceUSD: 27, features: ['Advanced training', 'Advanced system optimization', 'Premium gaming methods', 'Network latency reduction', 'Business strategies', 'Remote optimization', 'Client acquisition'], premium: true }
    ];

    if (!localStorage.getItem("fila_products")) {
        localStorage.setItem("fila_products", JSON.stringify(defaultProducts));
    }

    const defaultReviews = [
        { id: 1, name: "GamerBoy99", rating: 5, comment: "Amazing service! My ping dropped from 80ms to 20ms. Highly recommended.", status: 'approved' },
        { id: 2, name: "SniperPro", rating: 5, comment: "PUBG optimization works like magic. Smooth 90fps without drops.", status: 'approved' },
        { id: 3, name: "CasualPlayer", rating: 4, comment: "PC feels much faster now, good job guys.", status: 'approved' }
    ];

    if (!localStorage.getItem("fila_reviews")) {
        localStorage.setItem("fila_reviews", JSON.stringify(defaultReviews));
    }

    let products = JSON.parse(localStorage.getItem("fila_products"));
    let reviews = JSON.parse(localStorage.getItem("fila_reviews")).filter(r => r.status === 'approved');
    let currentCurrency = 'LKR';

    // --- Currency Toggle ---
    const currencyToggle = document.querySelector('.toggle-switch');
    const currencyLabels = document.querySelectorAll('.currency-label');

    currencyLabels.forEach(label => {
        label.addEventListener('click', () => {
            if (label.dataset.currency === 'LKR') {
                currencyToggle.classList.remove('usd');
                currentCurrency = 'LKR';
            } else {
                currencyToggle.classList.add('usd');
                currentCurrency = 'USD';
            }
            updateCurrencyUI();
            renderProducts(document.querySelector('.tab-btn.active').dataset.filter);
        });
    });

    currencyToggle.addEventListener('click', () => {
        currencyToggle.classList.toggle('usd');
        currentCurrency = currencyToggle.classList.contains('usd') ? 'USD' : 'LKR';
        updateCurrencyUI();
        renderProducts(document.querySelector('.tab-btn.active').dataset.filter);
    });

    function updateCurrencyUI() {
        currencyLabels.forEach(l => l.classList.remove('active'));
        document.querySelector(`.currency-label[data-currency="${currentCurrency}"]`).classList.add('active');
    }

    // --- Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    mobileBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });

    // --- Number Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger on scroll
    let counterAnimated = false;
    window.addEventListener('scroll', () => {
        const trustSection = document.getElementById('trust');
        if (!trustSection) return;
        const sectionPos = trustSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;
        
        if (sectionPos < screenPos && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    });

    // --- Services Renderer ---
    const servicesGrid = document.getElementById('services-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');

    function renderProducts(category) {
        servicesGrid.innerHTML = '';
        const filtered = products.filter(p => p.category === category);
        
        filtered.forEach(p => {
            const price = currentCurrency === 'LKR' ? `LKR ${p.priceLKR}` : `USD ${p.priceUSD}`;
            const featuresHTML = p.features.map(f => `<li>${f}</li>`).join('');
            const cardClass = p.premium ? 'service-card premium glassmorphism' : 'service-card glassmorphism';
            
            const card = document.createElement('div');
            card.className = cardClass;
            card.innerHTML = `
                <h3>${p.title}</h3>
                <div class="price">${price}</div>
                <ul class="features">
                    ${featuresHTML}
                </ul>
                <button class="btn-primary btn-buy" data-id="${p.id}" data-title="${p.title}" data-price="${price}">BUY NOW</button>
            `;
            servicesGrid.appendChild(card);
        });

        // Add event listeners to Buy buttons
        document.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openBuyModal(e.target.dataset.title, e.target.dataset.price);
            });
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });

    // Initial render
    renderProducts('pc');

    // --- Specific Modal Logic ---
    const modal = document.getElementById('buy-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const paymentSelect = document.getElementById('form-payment');
    const paymentInstructions = document.getElementById('payment-instructions');
    const bocDetails = document.getElementById('boc-details');
    const ezcashDetails = document.getElementById('ezcash-details');

    function openBuyModal(pkg, price) {
        document.getElementById('form-package').value = pkg;
        document.getElementById('form-price').value = price;
        modal.style.display = 'flex';
    }

    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    paymentSelect.addEventListener('change', (e) => {
        paymentInstructions.classList.remove('hidden');
        if (e.target.value === 'BOC BANK') {
            bocDetails.classList.remove('hidden');
            ezcashDetails.classList.add('hidden');
        } else if (e.target.value === 'Dialog Ez Cash') {
            bocDetails.classList.add('hidden');
            ezcashDetails.classList.remove('hidden');
        }
    });

    // --- Form Submit Order ---
    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const pkg = document.getElementById('form-package').value;
        const name = document.getElementById('form-name').value;
        const whatsapp = document.getElementById('form-whatsapp').value;
        const discord = document.getElementById('form-discord').value;
        const device = document.getElementById('form-device').value;
        const method = document.getElementById('form-payment').value;
        const price = document.getElementById('form-price').value;

        const message = `🔥 NEW ORDER – FILA SENSI 🔥
Name: ${name}
WhatsApp: ${whatsapp}
Discord: ${discord}
Device: ${device}
Selected Package: ${pkg} (${price})
Payment Method: ${method}`;

        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/94702487219?text=${encodedMsg}`, '_blank');
        modal.style.display = 'none';
        document.getElementById('order-form').reset();
        paymentInstructions.classList.add('hidden');
    });

    // --- Reviews Rendering & Logic ---
    const reviewSlider = document.getElementById('review-slider');
    let reviewIndex = 0;

    function renderReviews() {
        reviewSlider.innerHTML = '';
        if (reviews.length === 0) {
            reviewSlider.innerHTML = '<div class="review-card glassmorphism"><p>No reviews yet. Be the first!</p></div>';
            return;
        }

        reviews.forEach(r => {
            const stars = '&#9733;'.repeat(r.rating) + '&#9734;'.repeat(5 - r.rating);
            const rCard = document.createElement('div');
            rCard.className = 'review-card glassmorphism';
            rCard.innerHTML = `
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${r.comment}"</p>
                <p class="review-author">- ${r.name}</p>
            `;
            reviewSlider.appendChild(rCard);
        });

        updateSliderPosition();
    }

    function updateSliderPosition() {
        if(reviews.length > 0) {
            reviewSlider.style.transform = `translateX(-${reviewIndex * 100}%)`;
        }
    }

    document.querySelector('.next-btn').addEventListener('click', () => {
        if(reviews.length > 0) {
            reviewIndex = (reviewIndex + 1) % reviews.length;
            updateSliderPosition();
        }
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
        if(reviews.length > 0) {
            reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
            updateSliderPosition();
        }
    });

    // Auto slide
    setInterval(() => {
        if(reviews.length > 1) {
            reviewIndex = (reviewIndex + 1) % reviews.length;
            updateSliderPosition();
        }
    }, 5000);

    renderReviews();

    // Add Review
    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('review-name').value;
        const comment = document.getElementById('review-comment').value;
        const ratingEle = document.querySelector('input[name="rating"]:checked');
        const rating = ratingEle ? parseInt(ratingEle.value) : 5;

        // Save to local storage
        let allReviews = JSON.parse(localStorage.getItem('fila_reviews')) || [];
        const newReview = { id: Date.now(), name, rating, comment, status: 'approved' };
        allReviews.push(newReview);
        localStorage.setItem('fila_reviews', JSON.stringify(allReviews));

        reviews.push(newReview);
        renderReviews();

        alert("Review submitted successfully!");
        document.getElementById('review-form').reset();
    });

});
