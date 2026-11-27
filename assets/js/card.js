// ==========================================
// CARD.JS v1.1 - DEKORIST Ürün Kartı Modülü
// Ortak: category.js + index.js (SV/EN i18n destekli)
// ==========================================

// ===== RENK EŞLEŞTİRME - İsveççe -> CSS =====
const COLOR_MAP = {
    'rod': '#D32F2F', 'röd': '#D32F2F', 'red': '#D32F2F',
    'bla': '#1976D2', 'blå': '#1976D2', 'blue': '#1976D2',
    'gron': '#388E3C', 'grön': '#388E3C', 'green': '#388E3C',
    'gul': '#FBC02D', 'yellow': '#FBC02D',
    'orange': '#F57C00',
    'rosa': '#E91E63', 'pink': '#E91E63',
    'lila': '#7B1FA2', 'purple': '#7B1FA2',
    'svart': '#212121', 'black': '#212121',
    'vit': '#FAFAFA', 'white': '#FAFAFA',
    'grå': '#9E9E9E', 'gra': '#9E9E9E', 'grey': '#9E9E9E', 'gray': '#9E9E9E',
    'brun': '#5D4037', 'brown': '#5D4037',
    'beige': '#D7CCC8',
    'turkos': '#00BCD4', 'turquoise': '#00BCD4',
    'guld': '#FFD700', 'gold': '#FFD700',
    'silver': '#C0C0C0',
    'bronze': '#CD7F32', 'brons': '#CD7F32',
    'krem': '#FFF8E1', 'cream': '#FFF8E1',
    'oliv': '#556B2F', 'olive': '#556B2F',
    'marin': '#1A237E', 'navy': '#1A237E', 'marinblå': '#1A237E',
    'mint': '#98FF98',
    'korall': '#FF7F50', 'coral': '#FF7F50',
    'vinröd': '#722F37', 'bordo': '#722F37', 'burgundy': '#722F37',
    'taupe': '#483C32',
    'mullvad': '#8B7355',
    'flerfargad': 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
    'flerfärgad': 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
    'multicolor': 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
    'randig': 'repeating-linear-gradient(90deg, #fff 0px, #fff 10px, #333 10px, #333 20px)',
    'striped': 'repeating-linear-gradient(90deg, #fff 0px, #fff 10px, #333 10px, #333 20px)',
    'prickig': 'radial-gradient(circle, #333 2px, transparent 2px)',
    'dotted': 'radial-gradient(circle, #333 2px, transparent 2px)',
    'blommig': 'linear-gradient(45deg, #FFB6C1, #FFF0F5)',
    'floral': 'linear-gradient(45deg, #FFB6C1, #FFF0F5)',
    'transparent': 'rgba(200,200,200,0.3)',
};

// Ürün objelerini ID ile saklayalım ki dil değişince kartlar yeniden çizilebilsin
const __productRegistry = new Map();

function getCardLang() {
    const l = window.DekoristLang?.getLang?.() || document.documentElement.lang || 'sv';
    return String(l).toLowerCase().startsWith('en') ? 'en' : 'sv';
}

function cardText(key, vars = {}, fallbackSv = '', fallbackEn = '') {
    if (window.DekoristLang?.t) {
        const translated = window.DekoristLang.t(key, vars);
        if (translated && translated !== key) return translated;
    }
    let raw = getCardLang() === 'en' ? fallbackEn : fallbackSv;
    Object.keys(vars).forEach(k => {
        raw = raw.replace(`{${k}}`, String(vars[k]));
    });
    return raw;
}

function getColorStyle(colorName) {
    if (!colorName) return '#ccc';
    const normalized = colorName.toLowerCase().trim();
    if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
    for (const [key, value] of Object.entries(COLOR_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) return value;
    }
    if (/^#[0-9A-F]{6}$/i.test(normalized)) return normalized;
    return '#ccc';
}

// ===== FİYAT HESAPLAMA =====
function getDisplayPrice(product) {
    return product.discount_price || product.base_price || 0;
}

function normalizeVariantSizeList(rawList, formatter) {
    if (!Array.isArray(rawList)) return [];
    const seen = new Set();
    const cleaned = [];

    rawList.forEach(item => {
        const formatted = formatter ? formatter(item) : String(item || '').trim();
        const normalized = formatted.replace(/\s+/g, ' ').trim();
        if (!normalized) return;
        if (normalized.toLowerCase() === 'standard') return;

        const key = normalized.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            cleaned.push(normalized);
        }
    });

    return cleaned;
}

function formatExtraSizeBadge(extraCount) {
    if (!extraCount || extraCount <= 0) return '';
    const label = extraCount === 1
        ? cardText('card.other_size', {}, '(1 storlekar)', '(1 other size)')
        : cardText('card.more_sizes', { count: extraCount }, `${extraCount} fler storlekar`, `${extraCount} more sizes`);
    return `<span class="variant-extra-badge">  ${escapeHtml(label)}</span>`;
}

// ===== VARYANT METNİ =====
function getVariantDisplayText(product) {
    if (!product) return '';

    const m2Widths = normalizeVariantSizeList(
        product.m2_available_widths,
        w => (w != null && String(w).trim() !== '' ? `${String(w).trim()} cm` : '')
    );
    if (product.m2_calculator_active && m2Widths.length > 0) {
        const extraHtml = formatExtraSizeBadge(m2Widths.length - 1);
        return `<span class="variant-main">${escapeHtml(m2Widths[0])}</span>${extraHtml}`;
    }

    const gardinMeasurements = normalizeVariantSizeList(
        product.gardin_measurements,
        m => (m ? `${String(m).replace('x', '×')} cm` : '')
    );
    if (product.gardin_calculator_active && gardinMeasurements.length > 0) {
        const extraHtml = formatExtraSizeBadge(gardinMeasurements.length - 1);
        return `<span class="variant-main">${escapeHtml(gardinMeasurements[0])}</span>${extraHtml}`;
    }

    const measurements = normalizeVariantSizeList(
        product.measurements,
        m => String(m || '')
    );
    if (measurements.length > 0) {
        const extraHtml = formatExtraSizeBadge(measurements.length - 1);
        return `<span class="variant-main">${escapeHtml(measurements[0])}</span>${extraHtml}`;
    }

    const variants = normalizeVariantSizeList(
        product.variants,
        v => (v && typeof v === 'object' ? v.size : v)
    );
    if (variants.length === 0) return '';

    const extraHtml = formatExtraSizeBadge(variants.length - 1);
    return `<span class="variant-main">${escapeHtml(variants[0])}</span>${extraHtml}`;
}

// ===== HTML ESCAPE =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== WISHLIST FONKSIYONLARI =====
function isInWishlist(productId) {
    try {
        const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        return wishlist.some(item => (typeof item === 'string' ? item : String(item.id)) === String(productId));
    } catch (e) {
        return false;
    }
}

function updateWishlistBadge() {
    try {
        const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const badge = document.querySelector('.wishlist-count-badge');
        if (badge) {
            badge.textContent = wishlist.length;
            badge.classList.toggle('visible', wishlist.length > 0);
        }
    } catch (e) {
        console.error('Wishlist badge hatasi:', e);
    }
}

function toggleWishlistItem(productId, name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const index = wishlist.findIndex(item => (typeof item === 'string' ? item : String(item.id)) === String(productId));

    const isAdding = index === -1;

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push({ id: productId, name: name, price: price, image: image });
    }

    localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    updateWishlistBadge();

    const addLabel = cardText('wishlist.add', {}, 'Lägg till favoriter', 'Add to wishlist');
    const removeLabel = cardText('wishlist.remove', {}, 'Ta bort från favoriter', 'Remove from wishlist');

    document.querySelectorAll(`[data-product-id="${productId}"] .wishlist-btn, .wishlist-btn[data-product-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', isAdding);
        btn.setAttribute('aria-label', isAdding ? removeLabel : addLabel);

        if (isAdding) {
            btn.classList.remove('animating');
            void btn.offsetWidth;
            btn.classList.add('animating');

            setTimeout(() => {
                btn.classList.remove('animating');
            }, 400);
        }

        const icon = btn.querySelector('.heart-icon');
        if (icon) {
            icon.style.fill = isAdding ? '#D30000' : 'none';
            icon.style.stroke = isAdding ? '#D30000' : '#111';
        }
    });
}

// ===== ÜRÜN KARTI OLUŞTURMA =====
function truncateWords(text, maxWords) {
    const fallbackName = cardText('card.product_fallback', {}, 'Produkt', 'Product');
    if (!text) return fallbackName;
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
}

// ===== EKRAN BOYUTUNA GÖRE KELİME SAYISI =====
function getMaxWords() {
    return window.innerWidth < 768 ? 2 : 3;
}

function createProductCard(product, isWishlisted) {
    if (product && product.id != null) {
        __productRegistry.set(String(product.id), product);
    }

    const resolvedWishlisted = typeof isWishlisted === 'boolean'
        ? isWishlisted
        : isInWishlist(product.id);

    const hasDiscount = product.discount_price && product.discount_price < product.base_price;
    const price = getDisplayPrice(product);

    const priceHTML = hasDiscount
        ? `<span class="current-price price-discount">${price.toLocaleString('sv-SE')} Kr</span>
           <span class="original-price">${(product.base_price || 0).toLocaleString('sv-SE')} Kr</span>`
        : `<span class="current-price">${price.toLocaleString('sv-SE')} Kr</span>`;

    const variantText = getVariantDisplayText(product);

    const cornerBadgeHTML = product.card_badge
        ? `<span class="card-corner-badge">${escapeHtml(product.card_badge)}</span>`
        : '';

    const secondaryBadgeHTML = product.card_badge_secondary
        ? `<span class="card-corner-badge-secondary">${escapeHtml(product.card_badge_secondary)}</span>`
        : '';

    const badgesWrapperHTML = (product.card_badge || product.card_badge_secondary)
        ? `<div class="card-badges-wrapper">${cornerBadgeHTML}${secondaryBadgeHTML}</div>`
        : '';

    const productUrl = product.slug
        ? '/produkt/' + encodeURIComponent(String(product.slug).trim())
        : '/produkt/index.html?id=' + encodeURIComponent(String(product.id));

    const colors = product.colors || [];
    const extraColorCount = Math.max(0, colors.length - 5);
    const colorsSuffix = cardText('card.colors_suffix', {}, 'färger', 'colors');

    const colorsHTML = colors.length > 0 ? `
        <div class="product-colors-wrapper">
            <div class="product-colors-swatches">
                ${colors.slice(0, 5).map(color => `
                    <span class="swatch-circle"
                          style="background: ${getColorStyle(color)};"
                          title="${escapeHtml(color)}"></span>
                `).join('')}
            </div>
            ${extraColorCount > 0 ? `<span class="color-count-text">${extraColorCount} ${escapeHtml(colorsSuffix)}</span>` : ''}
        </div>
    ` : '';

    const dealLabel = cardText('card.deal', {}, 'Deal', 'Deal');
    const wishlistAriaLabel = resolvedWishlisted
        ? cardText('wishlist.remove', {}, 'Ta bort från favoriter', 'Remove from wishlist')
        : cardText('wishlist.add', {}, 'Lägg till favoriter', 'Add to wishlist');

    return `<div class="product-card" data-product-id="${String(product.id)}" data-id="${String(product.id)}">
        <div class="image-box">
            <a href="${productUrl}">
                <img
                    data-src="${escapeHtml(product.image || '')}"
                    alt="${escapeHtml(product.name || '')}"
                    class="product-img"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
            </a>
            ${hasDiscount ? `<span class="discount-badge">${escapeHtml(dealLabel)}</span>` : ''}
            ${badgesWrapperHTML}
            <button class="wishlist-btn ${resolvedWishlisted ? 'active' : ''}"
                    data-product-id="${String(product.id)}"
                    aria-label="${escapeHtml(wishlistAriaLabel)}"
                    onclick="event.preventDefault(); event.stopPropagation(); toggleWishlistItem('${String(product.id)}', '${escapeHtml(product.name || '')}', ${price}, '${escapeHtml(product.image || '')}')">
                <svg class="heart-icon" viewBox="0 0 24 24" fill="${resolvedWishlisted ? '#D30000' : 'none'}" stroke="${resolvedWishlisted ? '#D30000' : '#111'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path class="heart-path" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="heart-burst">
                    <span class="dot d1"></span>
                    <span class="dot d2"></span>
                    <span class="dot d3"></span>
                    <span class="dot d4"></span>
                    <span class="dot d5"></span>
                    <span class="dot d6"></span>
                </span>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-title">${escapeHtml(truncateWords(product.name, getMaxWords()))}</h3>
            <div class="product-variants-row">
                ${variantText ? `<div class="product-variants">${variantText}</div>` : ''}
            </div>
            <div class="product-price">
                ${priceHTML}
            </div>
            ${colorsHTML}
        </div>
    </div>`;
}

// Dil değiştiğinde ekranda kayıtlı ürün kartlarını tazele
function refreshRenderedCards() {
    document.querySelectorAll('.product-card[data-product-id]').forEach(cardEl => {
        const pid = cardEl.getAttribute('data-product-id');
        const product = pid ? __productRegistry.get(String(pid)) : null;
        if (!product) return;

        const temp = document.createElement('div');
        temp.innerHTML = createProductCard(product, isInWishlist(product.id)).trim();
        const freshCard = temp.firstElementChild;
        if (!freshCard) return;

        // Zaten yüklenmiş görsel varsa src'yi koruyalım ki yeniden yüklenmesin
        const oldImg = cardEl.querySelector('img.product-img');
        const newImg = freshCard.querySelector('img.product-img');
        if (oldImg && newImg && (oldImg.classList.contains('loaded') || oldImg.src)) {
            newImg.src = oldImg.src;
            if (oldImg.classList.contains('loaded')) {
                newImg.classList.add('loaded');
                freshCard.querySelector('.image-box')?.classList.add('img-loaded');
            }
        }

        cardEl.replaceWith(freshCard);
    });

    initLazyImages();
}

window.addEventListener('dekorist:lang-change', () => {
    refreshRenderedCards();
});

// ===== LAZY LOADING (Profesyonel Resim Yükleme) =====
let imageObserver = null;

function initLazyImages() {
    if (imageObserver) {
        imageObserver.disconnect();
    }

    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.onload = function () {
                        img.classList.add('loaded');
                        const imageBox = img.closest('.image-box');
                        if (imageBox) {
                            imageBox.classList.add('img-loaded');
                        }
                    };

                    img.onerror = function () {
                        img.classList.add('error');
                        const imageBox = img.closest('.image-box');
                        if (imageBox) {
                            imageBox.classList.add('error-state');
                        }
                    };

                    img.src = src;
                }

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px',
        threshold: 0
    });

    document.querySelectorAll('img[data-src]:not(.loaded)').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== WISHLIST EVENT ATTACHMENT (Delegation) =====
function attachWishlistEvents(containerSelector) {
    const container = document.querySelector(containerSelector || '#product-grid');
    if (!container) return;

    container.removeEventListener('click', handleWishlistClick);
    container.addEventListener('click', handleWishlistClick);
}

function handleWishlistClick(e) {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const productId = btn.dataset.productId;
    if (!productId) return;

    const card = btn.closest('.product-card');
    const nameEl = card?.querySelector('.product-title');
    const priceEl = card?.querySelector('.current-price');
    const imgEl = card?.querySelector('img');

    const name = nameEl ? nameEl.textContent : '';
    const priceText = priceEl ? priceEl.textContent : '0';
    const price = parseFloat(priceText.replace(/[^0-9]/g, '')) || 0;
    const image = imgEl ? imgEl.getAttribute('data-src') || imgEl.src : '';

    toggleWishlistItem(productId, name, price, image);
}

// ===== GLOBAL EXPORTS =====
window.CardModule = {
    COLOR_MAP,
    getColorStyle,
    getDisplayPrice,
    getVariantDisplayText,
    escapeHtml,
    isInWishlist,
    updateWishlistBadge,
    toggleWishlistItem,
    createProductCard,
    refreshRenderedCards,
    initLazyImages,
    attachWishlistEvents,
    handleWishlistClick
};