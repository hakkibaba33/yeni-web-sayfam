(function initDekoristLang() {
    if (window.DekoristLang) return;

    const STORAGE_KEY = 'dekorist_lang';
    const SUPPORTED = ['sv', 'en'];

    const DICTIONARY = {
        sv: {
            'nav.mattor': 'Mattor',
            'nav.gardiner': 'Gardiner',
            'nav.soffor': 'Soffor',
            'nav.bord_stolar': 'Bord & Stolar',
            'nav.rea': 'REA',
            'mega.popular_sizes': 'Populära storlekar',
            'mega.sizes': 'Storlekar',
            'mega.loading': 'Laddar...',
            'mega.see_all': 'Se alla →',
            'mega.explore': 'Utforska →',
            'mega.see_deals': 'Se fynd →',
            'mobile.back': '← Tillbaka',
            'mobile.visa_alla': 'Visa alla',
            'card.deal': 'Deal',
            'card.colors_suffix': 'färger',
            'card.other_size': '1 annan storlek',
            'card.more_sizes': '{count} fler storlekar',
            'wishlist.add': 'Lägg till favoriter',
            'wishlist.remove': 'Ta bort från favoriter'
        },
        en: {
            'nav.mattor': 'Rugs',
            'nav.gardiner': 'Curtains',
            'nav.soffor': 'Sofas',
            'nav.bord_stolar': 'Tables & Chairs',
            'nav.rea': 'SALE',
            'mega.popular_sizes': 'Popular sizes',
            'mega.sizes': 'Sizes',
            'mega.loading': 'Loading...',
            'mega.see_all': 'See all →',
            'mega.explore': 'Explore →',
            'mega.see_deals': 'See deals →',
            'mobile.back': '← Back',
            'mobile.visa_alla': 'View all',
            'card.deal': 'Deal',
            'card.colors_suffix': 'colors',
            'card.other_size': '1 other size',
            'card.more_sizes': '{count} more sizes',
            'wishlist.add': 'Add to wishlist',
            'wishlist.remove': 'Remove from wishlist'
        }
    };

    function readInitialLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && SUPPORTED.includes(saved)) return saved;
        } catch (e) {}
        const htmlLang = (document.documentElement.lang || '').toLowerCase();
        return htmlLang.startsWith('en') ? 'en' : 'sv';
    }

    let currentLang = readInitialLang();

    function applyDocumentLang(lang) {
        document.documentElement.setAttribute('lang', lang);
    }

    function t(key, vars = {}) {
        const table = DICTIONARY[currentLang] || DICTIONARY.sv;
        let str = table[key] ?? DICTIONARY.sv[key] ?? key;
        Object.keys(vars).forEach(k => {
            str = str.replace(`{${k}}`, String(vars[k]));
        });
        return str;
    }

    function applyDomTranslations(root = document) {
        root.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const attr = el.getAttribute('data-i18n-attr');
            const translated = t(key);
            if (attr) {
                el.setAttribute(attr, translated);
            } else {
                el.textContent = translated;
            }
        });
    }

    function updateSwitcherUI() {
        document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            const isActive = btnLang === currentLang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function setLang(nextLang) {
        if (!SUPPORTED.includes(nextLang) || nextLang === currentLang) return;
        currentLang = nextLang;
        try {
            localStorage.setItem(STORAGE_KEY, currentLang);
        } catch (e) {}
        applyDocumentLang(currentLang);
        applyDomTranslations();
        updateSwitcherUI();
        window.dispatchEvent(new CustomEvent('dekorist:lang-change', {
            detail: { lang: currentLang }
        }));
    }

    function renderSwitcher(containerSelector = '.header-right') {
        const container = document.querySelector(containerSelector);
        if (!container || container.querySelector('.lang-switcher')) return;

        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Language');
        switcher.innerHTML = `
            <button type="button" class="lang-switcher-btn ${currentLang === 'sv' ? 'active' : ''}" data-lang="sv">SV</button>
            <span class="lang-switcher-sep" aria-hidden="true">/</span>
            <button type="button" class="lang-switcher-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        `;

        switcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-switcher-btn');
            if (!btn) return;
            setLang(btn.getAttribute('data-lang'));
        });

        container.insertBefore(switcher, container.firstChild);
        updateSwitcherUI();
    }

    applyDocumentLang(currentLang);

    document.addEventListener('DOMContentLoaded', () => {
        renderSwitcher();
        applyDomTranslations();
    });

    window.DekoristLang = {
        getLang: () => currentLang,
        setLang,
        t,
        applyDomTranslations,
        renderSwitcher
    };
})();