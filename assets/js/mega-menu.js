function initDekoristMegaMenu() {
    if (window.__dekoristMegaMenuInitialized) return;
    window.__dekoristMegaMenuInitialized = true;

    const MENU_CONFIG = [
        { label: 'Mattor', href: '/mattor/', hasMega: true },
        { label: 'Gardiner', href: '/gardiner/', hasMega: true },
        { label: 'Soffor', href: '/soffor/', hasMega: true },
        { label: 'Bord & Stolar', href: '/bord-stolar/', hasMega: true },
        { label: 'REA', href: '/rea/', hasMega: true, sale: true }
    ];

    const MEGA_PANELS = {
        '/mattor/': {
            categorySlug: 'mattor',
            columns: [
                {
                    title: 'Kategorier',
                    links: [
                        { label: 'Alla mattor', href: '/mattor/', categorySlug: 'mattor' },
                        { label: 'Gångmattor', href: '/gangmattor/', categorySlug: 'gangmattor' },
                        { label: 'Badrumsmattor', href: '/badrumsmattor/', categorySlug: 'badrumsmattor' },
                        { label: 'Metervara', href: '/metervara/', categorySlug: 'metervara' }
                    ]
                },
                {
                    title: 'Stilar',
                    links: [
                        { label: 'Moderna mattor', href: '/mattor/?stil=modern', categorySlug: 'mattor' },
                        { label: 'Orientaliska mattor', href: '/mattor/?stil=orientalisk', categorySlug: 'mattor' },
                        { label: 'Skandinaviska mattor', href: '/mattor/?stil=skandinavisk', categorySlug: 'mattor' },
                        { label: 'Bohem mattor', href: '/mattor/?stil=bohem', categorySlug: 'mattor' }
                    ]
                }
            ],
            featured: {
                title: 'Utforska alla mattor',
                cta: 'Utforska →',
                image: '/assets/images/cat-orientaliska.webp',
                href: '/mattor/'
            }
        },
        '/gardiner/': {
            categorySlug: 'gardiner',
            columns: [
                {
                    title: 'Kategorier & typer',
                    links: [
                        { label: 'Alla gardiner', href: '/gardiner/', categorySlug: 'gardiner' },
                        { label: 'Linnegardiner', href: '/gardiner/?typ=linne', categorySlug: 'gardiner' },
                        { label: 'Mörkläggningsgardiner', href: '/gardiner/?typ=morklaggning', categorySlug: 'gardiner' },
                        { label: 'Ljusinsläpp & Skira', href: '/gardiner/?typ=skira', categorySlug: 'gardiner' }
                    ]
                }
            ],
            featured: {
                title: 'Stilrena gardiner',
                cta: 'Utforska →',
                image: '/assets/images/cat-gardiner.webp',
                href: '/gardiner/'
            }
        },
        '/soffor/': {
            categorySlug: 'soffor',
            columns: [
                {
                    title: 'Kategorier',
                    links: [
                        { label: 'Alla soffor', href: '/soffor/', categorySlug: 'soffor' },
                        { label: 'Hörnsoffor', href: '/soffor/?kategori=hornsoffor', categorySlug: 'soffor', subCategorySlug: 'hornsoffor' },
                        { label: '2-sits soffor', href: '/soffor/?kategori=2-sits-soffor', categorySlug: 'soffor', subCategorySlug: '2-sits-soffor' },
                        { label: '1-sits & Fåtöljer', href: '/soffor/?kategori=1-sits-fataloger', categorySlug: 'soffor', subCategorySlug: '1-sits-fataloger' },
                        { label: 'Soffgrupper', href: '/soffor/?kategori=soffgrupper', categorySlug: 'soffor', subCategorySlug: 'soffgrupper' }
                    ]
                }
            ],
            featured: {
                title: 'Soffor & Soffgrupper',
                cta: 'Utforska →',
                image: '/assets/images/soffor.webp',
                href: '/soffor/'
            }
        },
        '/bord-stolar/': {
            categorySlug: 'bord-stolar',
            columns: [
                {
                    title: 'Bord & stolar',
                    links: [
                        { label: 'Alla bord & stolar', href: '/bord-stolar/', categorySlug: 'bord-stolar' },
                        { label: 'Matbord', href: '/bord-stolar/?kategori=matbord', categorySlug: 'bord-stolar', subCategorySlug: 'matbord' },
                        { label: 'Soffbord', href: '/bord-stolar/?kategori=soffbord', categorySlug: 'bord-stolar', subCategorySlug: 'soffbord' },
                        { label: 'Sidobord', href: '/bord-stolar/?kategori=sidobord', categorySlug: 'bord-stolar', subCategorySlug: 'sidobord' },
                        { label: 'Stolar', href: '/bord-stolar/?kategori=stolar', categorySlug: 'bord-stolar', subCategorySlug: 'stolar' }
                    ]
                }
            ],
            featured: {
                title: 'Matbord, soffbord & stolar',
                cta: 'Utforska →',
                image: '/assets/images/chair.webp',
                href: '/bord-stolar/'
            }
        },
        '/rea/': {
            categorySlug: 'rea',
            columns: [
                {
                    title: 'Kampanjer & REA',
                    links: [
                        { label: 'Alla REA-produkter', href: '/rea/', categorySlug: 'rea' },
                        { label: 'REA Mattor', href: '/mattor/', categorySlug: 'mattor' },
                        { label: 'REA Gardiner', href: '/gardiner/', categorySlug: 'gardiner' }
                    ]
                }
            ],
            featured: {
                title: 'Upp till 50% REA',
                cta: 'Se fynd →',
                image: '/assets/images/cat-rea.webp',
                href: '/rea/'
            }
        }
    };

    const desktopList = document.getElementById('desktop-nav-list');
    const mobileList = document.querySelector('.mobile-nav-list');
    const panel = document.getElementById('mega-menu-panel');
    const header = document.getElementById('main-header');

    let activeHref = null;
    let openTimer = null;
    let closeTimer = null;
    const OPEN_DELAY_MS = 140;
    const CLOSE_DELAY_MS = 180;

    function escapeHtml(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function syncActiveMenuLink(targetHref) {
        if (!desktopList) return;
        desktopList.querySelectorAll('a[data-mega-href]').forEach(a => {
            const isCurrent = Boolean(targetHref) && a.getAttribute('data-mega-href') === targetHref;
            a.classList.toggle('mega-open', isCurrent);
            a.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
        });
    }

    if (desktopList) {
        desktopList.innerHTML = MENU_CONFIG.map(item => `
            <li>
                <a href="${escapeHtml(item.href)}"
                   class="${item.sale ? 'nav-sale' : ''} ${item.hasMega ? 'has-mega-menu' : ''}"
                   data-mega-href="${item.hasMega ? escapeHtml(item.href) : ''}"
                   ${item.hasMega ? 'aria-expanded="false"' : ''}>
                    ${escapeHtml(item.label)}
                </a>
            </li>
        `).join('');
    }

    if (mobileList) {
        const mobileBody = mobileList.closest('.mobile-menu-body') || mobileList.parentElement;
        let drillStage = mobileBody ? mobileBody.querySelector('.mobile-drill-stage') : null;

        if (mobileBody && !drillStage) {
            drillStage = document.createElement('div');
            drillStage.className = 'mobile-drill-stage';
            mobileBody.appendChild(drillStage);
        }

        function resetDrillStage() {
            mobileList.classList.remove('is-shifted');
            if (drillStage) {
                drillStage.classList.remove('is-open');
                setTimeout(() => {
                    if (!drillStage.classList.contains('is-open')) {
                        drillStage.innerHTML = '';
                    }
                }, 280);
            }
        }

        function showMainLevel() {
            resetDrillStage();
        }

        function presentDrillStage() {
            if (!drillStage) return;
            mobileList.classList.add('is-shifted');
            drillStage.classList.remove('is-open');
            void drillStage.offsetWidth;
            drillStage.classList.add('is-open');
        }

        function openSubLevel(mainItem) {
            if (!drillStage || !mainItem) return;
            const panelData = MEGA_PANELS[mainItem.href];
            if (!panelData) return;

            const subLinks = (panelData.columns || []).flatMap(col => col.links || []);

            drillStage.innerHTML = `
                <div class="mobile-drill-header">
                    <button type="button" class="mobile-drill-back" data-action="back-to-main">
                        ← Tillbaka
                    </button>
                </div>
                <div class="mobile-drill-title">${escapeHtml(mainItem.label)}</div>
                <ul class="mobile-drill-list">
                    ${subLinks.map(l => `
                        <li class="mobile-drill-row">
                            <a href="${escapeHtml(l.href)}" class="mobile-drill-link">${escapeHtml(l.label)}</a>
                        </li>
                    `).join('')}
                </ul>
            `;

            presentDrillStage();

            drillStage.querySelector('[data-action="back-to-main"]')?.addEventListener('click', showMainLevel);
        }

        mobileList.innerHTML = MENU_CONFIG.map((item, idx) => {
            const panelData = MEGA_PANELS[item.href];
            const hasSubItems = Boolean(item.hasMega && panelData && Array.isArray(panelData.columns) && panelData.columns.length > 0);

            if (!hasSubItems) {
                return `
                    <li class="mobile-drill-row">
                        <a href="${escapeHtml(item.href)}" class="mobile-drill-link ${item.sale ? 'mobile-sale' : ''}">${escapeHtml(item.label)}</a>
                    </li>
                `;
            }

            return `
                <li class="mobile-drill-row">
                    <a href="${escapeHtml(item.href)}" class="mobile-drill-link ${item.sale ? 'mobile-sale' : ''}">${escapeHtml(item.label)}</a>
                    <button type="button"
                            class="mobile-drill-next"
                            data-main-idx="${idx}"
                            aria-label="${escapeHtml(item.label)}">
                        ›
                    </button>
                </li>
            `;
        }).join('');

        mobileList.querySelectorAll('.mobile-drill-next').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-main-idx') || '-1', 10);
                const mainItem = MENU_CONFIG[idx];
                if (mainItem) openSubLevel(mainItem);
            });
        });

        const closeBtn = document.getElementById('close-mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        closeBtn?.addEventListener('click', showMainLevel);
        overlay?.addEventListener('click', showMainLevel);
    }

    if (!panel || !desktopList) return;

    function closePanel() {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        activeHref = null;
        syncActiveMenuLink(null);
    }

    function openPanel(href) {
        const data = MEGA_PANELS[href];
        if (!data) {
            closePanel();
            return;
        }
        clearTimeout(closeTimer);

        if (activeHref === href && panel.classList.contains('open')) {
            return;
        }

        const colsHtml = (data.columns || []).map(col => `
            <div class="mega-menu-col">
                <h4>${escapeHtml(col.title)}</h4>
                <ul>
                    ${(col.links || []).map(l => `
                        <li>
                            <a href="${escapeHtml(l.href)}" class="mega-sub-link">${escapeHtml(l.label)}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        const featHtml = data.featured ? `
            <a class="mega-menu-featured" href="${escapeHtml(data.featured.href)}">
                <img src="${escapeHtml(data.featured.image)}" alt="${escapeHtml(data.featured.title)}" loading="lazy">
                <div class="mega-menu-featured-caption">
                    <span>${escapeHtml(data.featured.title)}</span>
                    <span class="mega-menu-featured-cta">${escapeHtml(data.featured.cta || 'Utforska →')}</span>
                </div>
            </a>
        ` : '';

        panel.innerHTML = `<div class="mega-menu-inner">${colsHtml}${featHtml}</div>`;
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        activeHref = href;
        syncActiveMenuLink(href);
    }

    function scheduleOpenPanel(href) {
        clearTimeout(closeTimer);
        clearTimeout(openTimer);
        openTimer = setTimeout(() => {
            if (window.innerWidth > 1024) {
                openPanel(href);
            }
        }, OPEN_DELAY_MS);
    }

    function scheduleClosePanel() {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            closePanel();
        }, CLOSE_DELAY_MS);
    }

    desktopList.querySelectorAll('a[data-mega-href]').forEach(link => {
        const href = link.getAttribute('data-mega-href');
        if (!href) return;

        link.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) scheduleOpenPanel(href);
        });

        link.addEventListener('mouseleave', () => {
            clearTimeout(openTimer);
        });

        link.addEventListener('click', (e) => {
            if (window.innerWidth > 1024) {
                e.preventDefault();
                clearTimeout(openTimer);
                clearTimeout(closeTimer);
                if (activeHref === href && panel.classList.contains('open')) {
                    closePanel();
                } else {
                    openPanel(href);
                }
            }
        });
    });

    if (header) {
        header.addEventListener('mouseleave', () => {
            scheduleClosePanel();
        });
        header.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
        });
    }

    window.addEventListener('scroll', () => {
        clearTimeout(openTimer);
        if (panel.classList.contains('open')) closePanel();
    }, { passive: true });

    document.addEventListener('click', (e) => {
        clearTimeout(openTimer);
        if (!e.target.closest('#main-header')) closePanel();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearTimeout(openTimer);
            closePanel();
        }
    });
}

initDekoristMegaMenu();