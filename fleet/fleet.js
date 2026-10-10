/*
 * APS Fleet render: 360° viewer iframe + interior gallery + lightbox.
 *
 * Usage (Elementor HTML widget):
 *   <link rel="stylesheet" href="https://hookladder.github.io/aps-jet-fleet-wp-sync/fleet/fleet.css">
 *   <div id="aps-fleet" data-jet="VDN"></div>
 *   <script src="https://hookladder.github.io/aps-jet-fleet-wp-sync/fleet/fleet.js" defer></script>
 *
 * Any element with id="f_xxx" (e.g. f_vdn) switches the jet on click.
 * ?jet=XXX in the page URL overrides data-jet.
 */
(function () {
    // Absolute on purpose: WP Rocket re-hosts this script under /wp-content/cache/, so a path relative to it breaks
    const VIEWER = 'https://hookladder.github.io/aps-jet-fleet-wp-sync/viewer/AP_Viewer.html';
    const VIEWER_PARAMS = '&ext=webp&mode=eager';

    const WP = 'https://airpartners.takeflightgroup.com/wp-content/uploads/2026/03/';
    const GALLERY = {
        VDN: ['C-FVDN-Interior-02-Small.webp', 'C-FVDN-Interior-03-Small.webp', 'C-FVDN-Interior-04-Small.webp', 'C-FVDN-Interior-05-Small.webp', 'C-FVDN-Interior-08-Small.webp'],
        KAI: ['C-FKAI-Interior-02-Small.webp', 'C-FKAI-Interior-03-Small.webp', 'C-FKAI-Interior-04-Small.webp', 'C-FKAI-Interior-05-Small.webp', 'C-FKAI-Interior-08-Small.webp'],
        HHM: ['C-FHHM-510A8015_Final.webp', 'C-FHHM-510A8018_Final.webp', 'C-FHHM-510A8053_Final.webp', 'C-FHHM-510A8136_Final.webp', 'C-FHHM-510A8151_Final.webp'],
        TJO: ['C-GTJO-Interior-5.webp', 'C-GTJO-Interior-4.webp', 'C-GTJO-Interior-3.webp', 'C-GTJO-Interior-2.webp', 'C-GTJO-Interior-1.webp'],
        TLH: ['C-FTLH-Interior-02-Small.webp', 'C-FTLH-Interior-04-Small-1.webp', 'C-FTLH-Interior-05-Small.webp', 'C-FTLH-Interior-08-Small.webp', 'C-FTLH-Interior-10-Small.webp'],
        OAD: ['C-FOAD-Interior-02-Small.webp', 'C-FOAD-Interior-04-Small.webp', 'C-FOAD-Interior-05-Small.webp', 'C-FOAD-Interior-07-Small.webp', 'C-FOAD-Interior-08-Small.webp'],
        JDZ: ['C-FJDZ-Interior-02-Small.webp', 'C-FJDZ-Interior-03-Small-1.webp', 'C-FJDZ-Interior-05-Small.webp', 'C-FJDZ-Interior-07-Small.webp', 'C-FJDZ-Interior-08-Small.webp'],
        AXX: ['C-GAXX-New-Interior-02-Small.webp', 'C-GAXX-New-Interior-03-Small.webp', 'C-GAXX-New-Interior-05-Small.webp', 'C-GAXX-New-Interior-07-Small.webp', 'C-GAXX-New-Interior-08-Small.webp'],
        TJS: ['C-FTLH-Interior-07-Small.webp', 'C-FTLH-Interior-05-Small-1.webp', 'C-FTLH-Interior-04-Small-1-1.webp', 'C-FTLH-Interior-02-Small-1-1.webp', 'C-FTLH-Interior-00-Small.webp'],
        WRX: ['C-FWRX-Interior-02-Small.webp', 'C-FWRX-Interior-04-Small.webp', 'C-FWRX-Interior-05-Small.webp', 'C-FWRX-Interior-07-Small.webp', 'C-FWRX-Interior-08-Small.webp'],
        IAP: ['C-FIAP-Interior-02-Small-1.webp', 'C-FIAP-Interior-03-Small.webp', 'C-FIAP-Interior-04-Small.webp', 'C-FIAP-Interior-05-Small.webp', 'C-FIAP-Interior-07-Small.webp'],
        KHJ: ['C-FKHJ-Interior-02-Small.webp', 'C-FKHJ-Interior-03-Small.webp', 'C-FKHJ-Interior-04-Small.webp', 'C-FKHJ-Interior-05-Small.webp', 'C-FKHJ-Interior-07-Small.webp'],
        XLI: ['C-GXLI-Interior-01-Small.webp', 'C-GXLI-Interior-03-Small-1.webp', 'C-GXLI-Interior-05-Small.webp', 'C-GXLI-Interior-06-Small.webp', 'C-GXLI-Interior-07-Small.webp'],
        YMD: ['Edited-Interior-02-Small-2.webp', 'Edited-Interior-03-Small-2.webp', 'Edited-Interior-11-Small-2.webp', 'Edited-Interior-16-Small-1.webp', 'Edited-Interior-19-Small-2.webp'],
        XPG: ['C-GXPG-Interior-06-Small.webp', 'C-GXPG-Interior-05-Small.webp', 'C-GXPG-Interior-04-Small.webp', 'C-GXPG-Interior-03-Small.webp', 'C-GXPG-Interior-02-Small.webp'],
        AFK: ['C-FAFK-Interior-08-Small-1.webp', 'C-GAFK-Interior-07-Small.webp', 'C-GAFK-Interior-05-Small.webp', 'C-GAFK-Interior-03-Small.webp', 'C-GAFK-Interior-02-Small.webp']
    };

    const GAP = 15; // must match .carousel-track gap

    function init() {
        const root = document.getElementById('aps-fleet');
        if (!root) return;

        root.innerHTML = `
            <div class="iframe-fleet-container">
                <iframe id="target-fleet-iframe" loading="lazy" allow="fullscreen; xr-spatial-tracking"></iframe>
            </div>
            <div class="gallery-fleet">
                <h3 class="gallery-title">Interior Gallery</h3>
                <div class="gallery-fleet-container">
                    <button class="carousel-control prev-btn" type="button" aria-label="Previous">&#10094;</button>
                    <div class="carousel-viewport"><div class="carousel-track"></div></div>
                    <button class="carousel-control next-btn" type="button" aria-label="Next">&#10095;</button>
                </div>
            </div>`;

        const lightbox = document.createElement('div');
        lightbox.className = 'simple-lightbox-container';
        lightbox.innerHTML = `
            <div class="lightbox-wrapper">
                <button class="simple-lightbox-close" type="button" aria-label="Close">&times;</button>
                <button class="lightbox-nav prev-lb" type="button" aria-label="Previous">&#10094;</button>
                <img alt="">
                <button class="lightbox-nav next-lb" type="button" aria-label="Next">&#10095;</button>
            </div>`;
        document.body.appendChild(lightbox);

        const iframe = root.querySelector('iframe');
        const gallery = root.querySelector('.gallery-fleet');
        const viewport = root.querySelector('.carousel-viewport');
        const track = root.querySelector('.carousel-track');
        const prevBtn = root.querySelector('.prev-btn');
        const nextBtn = root.querySelector('.next-btn');
        const lbImg = lightbox.querySelector('img');

        let images = [];
        let slide = 0;
        let lbIndex = 0;

        // --- Lightbox ---
        const showLb = () => { lbImg.src = images[lbIndex]; };
        const openLb = (i) => { lbIndex = i; showLb(); lightbox.classList.add('is-open'); };
        const closeLb = () => { lightbox.classList.remove('is-open'); lbImg.src = ''; };
        const stepLb = (d) => { lbIndex = (lbIndex + d + images.length) % images.length; showLb(); };

        lightbox.querySelector('.simple-lightbox-close').addEventListener('click', closeLb);
        lightbox.querySelector('.prev-lb').addEventListener('click', () => stepLb(-1));
        lightbox.querySelector('.next-lb').addEventListener('click', () => stepLb(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'ArrowRight') stepLb(1);
            else if (e.key === 'ArrowLeft') stepLb(-1);
            else if (e.key === 'Escape') closeLb();
        });

        // --- Carousel ---
        function maxSlide() {
            const item = track.firstElementChild;
            if (!item) return 0;
            // round, not floor: offsetWidth truncates sub-pixels (3.99 visible must count as 4)
            const visible = Math.round((viewport.offsetWidth + GAP) / (item.offsetWidth + GAP)) || 1;
            return Math.max(0, images.length - visible);
        }

        function updateCarousel() {
            const item = track.firstElementChild;
            if (!item) return;
            slide = Math.min(slide, maxSlide());
            track.style.transform = `translateX(-${slide * (item.offsetWidth + GAP)}px)`;
            prevBtn.disabled = slide === 0;
            nextBtn.disabled = slide >= maxSlide();
        }

        prevBtn.addEventListener('click', () => { if (slide > 0) { slide--; updateCarousel(); } });
        nextBtn.addEventListener('click', () => { if (slide < maxSlide()) { slide++; updateCarousel(); } });
        window.addEventListener('resize', updateCarousel);

        // --- Jet switch ---
        function loadJet(code) {
            iframe.src = VIEWER + '?slug=EXT_' + code + VIEWER_PARAMS;
            iframe.title = 'Visualizer 3D - ' + code;

            images = (GALLERY[code] || []).map((f) => WP + f);
            gallery.hidden = !images.length;
            slide = 0;
            track.replaceChildren(...images.map((url, i) => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'carousel-item';
                img.alt = 'Interior ' + code + ' ' + (i + 1);
                img.loading = 'lazy';
                img.addEventListener('click', () => openLb(i));
                return img;
            }));
            requestAnimationFrame(updateCarousel);
        }

        const buttons = document.querySelectorAll('[id^="f_"]');
        buttons.forEach((btn) => btn.addEventListener('click', (e) => {
            const code = (btn.id.split('_')[1] || '').toUpperCase();
            if (code.length !== 3) return;
            e.preventDefault();
            buttons.forEach((b) => b.classList.remove('fleet-btn-active'));
            btn.classList.add('fleet-btn-active');
            loadJet(code);
        }));
        if (buttons[0]) buttons[0].classList.add('fleet-btn-active');

        const initial = new URLSearchParams(location.search).get('jet') || root.dataset.jet || 'VDN';
        loadJet(initial.toUpperCase());
    }

    // WP Rocket "Delay JS" may run this after DOMContentLoaded
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
