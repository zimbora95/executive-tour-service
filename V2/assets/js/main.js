/* =============================================================
   EXECUTIVE TOUR SERVICE — Motion Layer
   Awwwards-grade interactions: GSAP + Lenis + custom cursor +
   magnetic buttons + split-text + horizontal scroll + marquee +
   3D tilt + page transitions.
   Degrades gracefully without GSAP and respects reduced-motion.
   ============================================================= */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
    const hasLenis = typeof window.Lenis !== 'undefined';

    if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Utility
    const qs  = (s, r = document) => r.querySelector(s);
    const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp  = (a, b, t) => a + (b - a) * t;

    /* =========================================================
       1. LENIS SMOOTH SCROLL — synced with GSAP ticker
       ========================================================= */
    let lenis = null;
    if (hasLenis && !prefersReducedMotion) {
        document.documentElement.classList.add('has-lenis');
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
        });

        if (hasGSAP) {
            lenis.on('scroll', () => hasScrollTrigger && ScrollTrigger.update());
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
    }

    /* =========================================================
       2. STICKY NAV
       ========================================================= */
    const nav = qs('[data-nav]');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* =========================================================
       3. MOBILE DRAWER
       ========================================================= */
    const burger = qs('[data-burger]');
    const drawer = qs('[data-drawer]');
    if (burger && drawer) {
        const toggle = (force) => {
            const next = typeof force === 'boolean' ? force : !drawer.classList.contains('is-open');
            drawer.classList.toggle('is-open', next);
            burger.classList.toggle('is-open', next);
            burger.setAttribute('aria-expanded', String(next));
            document.body.style.overflow = next ? 'hidden' : '';
            if (lenis) next ? lenis.stop() : lenis.start();
        };
        burger.addEventListener('click', () => toggle());
        drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
        window.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
    }

    /* =========================================================
       4. TOPBAR CLOCK — Lisbon time, mono digits
       ========================================================= */
    const clock = qs('[data-clock]');
    if (clock) {
        const fmt = new Intl.DateTimeFormat('pt-PT', {
            timeZone: 'Europe/Lisbon',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        });
        const tick = () => { clock.textContent = fmt.format(new Date()).replace(/\s/g, ''); };
        tick();
        setInterval(tick, 1000);
    }

    /* =========================================================
       5. CUSTOM CURSOR (desktop, no reduced-motion)
       ========================================================= */
    const cursorRoot = qs('[data-cursor-root]');
    if (cursorRoot && !isTouch && !prefersReducedMotion) {
        document.documentElement.classList.add('has-cursor');
        const dot  = cursorRoot.querySelector('.custom-cursor__dot');
        const ring = cursorRoot.querySelector('.custom-cursor__ring');
        const label = cursorRoot.querySelector('.custom-cursor__label');
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const target = { x: pos.x, y: pos.y };
        const ringPos = { x: pos.x, y: pos.y };

        window.addEventListener('pointermove', (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
        }, { passive: true });

        const render = () => {
            // Dot snaps instantly; ring lerps for trailing motion.
            pos.x = target.x; pos.y = target.y;
            ringPos.x = lerp(ringPos.x, target.x, 0.18);
            ringPos.y = lerp(ringPos.y, target.y, 0.18);
            if (dot)  dot.style.transform  = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            if (ring) ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
            if (label) label.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        const hoverSelector = 'a, button, [data-cursor], .tour-card, .service-card, .pillar, input, textarea, select, [data-cursor-text]';
        document.addEventListener('pointerover', (e) => {
            const t = e.target.closest(hoverSelector);
            if (!t) return;
            cursorRoot.classList.add('is-hover');
            const txt = t.getAttribute('data-cursor-text');
            if (txt && label) {
                label.textContent = txt;
                cursorRoot.classList.add('has-label');
            }
        });
        document.addEventListener('pointerout', (e) => {
            const t = e.target.closest(hoverSelector);
            if (!t) return;
            cursorRoot.classList.remove('is-hover', 'has-label');
        });
        window.addEventListener('pointerdown', () => cursorRoot.classList.add('is-down'));
        window.addEventListener('pointerup',   () => cursorRoot.classList.remove('is-down'));
        window.addEventListener('blur',         () => cursorRoot.classList.remove('is-hover', 'has-label', 'is-down'));
    }

    /* =========================================================
       6. MAGNETIC BUTTONS — gentle pull toward cursor
       ========================================================= */
    if (!isTouch && !prefersReducedMotion && hasGSAP) {
        const magnets = qsa('.btn, .nav__cta a.btn, .link-line, [data-magnetic]');
        magnets.forEach((el) => {
            const strength = parseFloat(el.dataset.magnetic) || 0.35;
            const maxMove = 12;
            el.classList.add('is-magnetic');
            const onMove = (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                gsap.to(el, {
                    x: clamp(x * strength, -maxMove, maxMove),
                    y: clamp(y * strength, -maxMove, maxMove),
                    duration: 0.45,
                    ease: 'power3.out',
                });
            };
            const onLeave = () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            };
            el.addEventListener('pointermove', onMove);
            el.addEventListener('pointerleave', onLeave);
        });
    }

    /* =========================================================
       7. SPLIT TEXT — hero title + [data-split] headings
       ========================================================= */
    function splitHeading(el) {
        // Preserves inline HTML like <em>, <br> by walking text nodes.
        const walk = (node, wordList) => {
            node.childNodes.forEach((child) => {
                if (child.nodeType === 3) { // text
                    const txt = child.textContent;
                    const words = txt.split(/(\s+)/).filter(Boolean);
                    const frag = document.createDocumentFragment();
                    words.forEach((w) => {
                        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'split-word';
                        Array.from(w).forEach((c) => {
                            const charWrap = document.createElement('span');
                            charWrap.className = 'split-char-wrap';
                            charWrap.style.display = 'inline-block';
                            charWrap.style.overflow = 'hidden';
                            const charSpan = document.createElement('span');
                            charSpan.className = 'split-char';
                            charSpan.style.display = 'inline-block';
                            charSpan.textContent = c;
                            charWrap.appendChild(charSpan);
                            wordSpan.appendChild(charWrap);
                            wordList.push(charSpan);
                        });
                        frag.appendChild(wordSpan);
                    });
                    child.parentNode.replaceChild(frag, child);
                } else if (child.nodeType === 1) {
                    // Keep element (like <em> or <br>) — recurse into children if not <br>.
                    if (child.tagName !== 'BR') walk(child, wordList);
                }
            });
        };
        const chars = [];
        walk(el, chars);
        return chars;
    }

    if (hasGSAP && !prefersReducedMotion) {
        const splitTargets = qsa('.hero__title, [data-split]');
        splitTargets.forEach((el) => {
            const chars = splitHeading(el);
            if (!chars.length) return;
            el.classList.add('js-split-ready');
            gsap.set(chars, { yPercent: 110, opacity: 0 });
            const isHero = el.classList.contains('hero__title');
            if (isHero) {
                gsap.to(chars, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'expo.out',
                    stagger: 0.018,
                    delay: 0.15,
                });
            } else if (hasScrollTrigger) {
                gsap.to(chars, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'expo.out',
                    stagger: 0.016,
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                });
            } else {
                gsap.to(chars, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.016 });
            }
        });
    }

    /* =========================================================
       8. SCROLL REVEALS — fade/rise driven by ScrollTrigger
       ========================================================= */
    if (hasScrollTrigger && !prefersReducedMotion) {
        qsa('[data-reveal]').forEach((el) => {
            const variant = el.getAttribute('data-reveal');
            const delay = parseFloat((el.style.getPropertyValue('--delay') || '0').replace('s', '')) || 0;
            let from = { opacity: 0, y: 36 };
            if (variant === 'fade')         from = { opacity: 0, y: 0 };
            if (variant === 'slide-left')   from = { opacity: 0, x: -40 };
            if (variant === 'slide-right')  from = { opacity: 0, x: 40 };
            if (variant === 'scale')        from = { opacity: 0, scale: 0.96 };

            gsap.fromTo(el, from, {
                opacity: 1, x: 0, y: 0, scale: 1,
                duration: 1.1,
                ease: 'expo.out',
                delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 86%',
                    toggleActions: 'play none none none',
                },
                onStart: () => el.classList.add('is-visible'),
            });
        });
    } else {
        qsa('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    }

    /* =========================================================
       9. PARALLAX — hero media + tour card backgrounds
       ========================================================= */
    if (hasScrollTrigger && !prefersReducedMotion) {
        const heroImg = qs('.hero__media img');
        if (heroImg) {
            gsap.to(heroImg, {
                yPercent: 18,
                scale: 1.08,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }
        qsa('.tour-card__bg').forEach((bg) => {
            gsap.fromTo(bg, { yPercent: -12 }, {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.closest('.tour-card'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });
        // Generic parallax hook
        qsa('[data-parallax]').forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.3;
            gsap.fromTo(el, { yPercent: -10 * speed }, {
                yPercent: 10 * speed,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
    }

    /* =========================================================
       10. HORIZONTAL SCROLL PANELS (sections with [data-horizontal])
       ========================================================= */
    if (hasScrollTrigger && !prefersReducedMotion && window.innerWidth >= 900) {
        qsa('[data-horizontal]').forEach((section) => {
            const track = section.querySelector('[data-horizontal-track]');
            if (!track) return;
            const getDistance = () => track.scrollWidth - window.innerWidth;
            let distance = getDistance();

            const st = ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: () => `+=${getDistance()}`,
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const dist = getDistance();
                    gsap.set(track, { x: -dist * self.progress });
                    const progressLabel = section.querySelector('[data-horizontal-progress]');
                    if (progressLabel) {
                        const panels = track.querySelectorAll('.h-panel').length;
                        const current = Math.min(panels, Math.floor(self.progress * panels) + 1);
                        progressLabel.textContent = `${String(current).padStart(2, '0')} / ${String(panels).padStart(2, '0')}`;
                    }
                },
            });

            // Parallax inside panels
            section.querySelectorAll('.h-panel__bg').forEach((bg) => {
                gsap.fromTo(bg, { x: -40 }, {
                    x: 40, ease: 'none',
                    scrollTrigger: {
                        trigger: section, start: 'top top', end: () => `+=${getDistance()}`,
                        scrub: true, invalidateOnRefresh: true,
                    },
                });
            });

            window.addEventListener('resize', () => { distance = getDistance(); ScrollTrigger.refresh(); });
        });
    } else {
        // Mobile/reduced: let it scroll naturally as a column.
        qsa('[data-horizontal]').forEach((s) => s.classList.add('is-stacked'));
    }

    /* =========================================================
       11. MARQUEE — infinite loop reactive to scroll velocity
       ========================================================= */
    if (!prefersReducedMotion) {
        qsa('.marquee').forEach((el) => {
            const track = el.querySelector('.marquee__track');
            if (!track) return;
            const strip = track.querySelector('.marquee__strip');
            if (!strip) return;

            // Duplicate strip for seamless loop
            const clone = strip.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
            const clone2 = strip.cloneNode(true);
            clone2.setAttribute('aria-hidden', 'true');
            track.appendChild(clone2);

            if (hasGSAP) {
                let stripW = strip.offsetWidth;
                const buildTween = () => {
                    stripW = strip.offsetWidth;
                    return gsap.to(track, {
                        x: -stripW,
                        duration: stripW / 60, // 60px/sec base
                        ease: 'none',
                        repeat: -1,
                        modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % -stripW) },
                    });
                };
                let tween = buildTween();
                window.addEventListener('resize', () => { tween.kill(); gsap.set(track, { x: 0 }); tween = buildTween(); });

                // Reactive to scroll velocity
                if (hasScrollTrigger) {
                    ScrollTrigger.create({
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        onUpdate: (self) => {
                            const vel = clamp(self.getVelocity() / 400, -4, 4);
                            gsap.to(tween, { timeScale: 1 + vel, duration: 0.4, overwrite: true });
                        },
                    });
                }
            }
        });
    }

    /* =========================================================
       12. COUNTERS — ScrollTrigger driven
       ========================================================= */
    const counters = qsa('[data-counter]');
    if (counters.length && hasScrollTrigger && !prefersReducedMotion) {
        counters.forEach((el) => {
            const target = parseFloat(el.dataset.counter);
            const format = el.dataset.format || 'int';
            const obj = { v: 0 };
            gsap.to(obj, {
                v: target,
                duration: 2,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
                onUpdate: () => {
                    el.textContent = format === 'int'
                        ? Math.round(obj.v).toLocaleString()
                        : obj.v.toFixed(1);
                },
            });
        });
    } else if (counters.length) {
        counters.forEach((el) => { el.textContent = el.dataset.counter; });
    }

    /* =========================================================
       13. POINTER-AWARE GLOW (kept from v1)
       ========================================================= */
    qsa('[data-pointer-glow]').forEach(card => {
        card.addEventListener('pointermove', e => {
            const rect = card.getBoundingClientRect();
            const mx = ((e.clientX - rect.left) / rect.width) * 100;
            const my = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', `${mx}%`);
            card.style.setProperty('--my', `${my}%`);
        });
    });

    /* =========================================================
       14. 3D TILT — hero meta, service cards, value cards
       ========================================================= */
    if (hasGSAP && !isTouch && !prefersReducedMotion) {
        const tiltTargets = qsa('.hero__meta, .service-card, .value-card, [data-tilt]');
        tiltTargets.forEach((el) => {
            el.classList.add('is-tilting');
            const maxDeg = 6;
            const qX = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
            const qY = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                qX(dx * maxDeg);
                qY(-dy * maxDeg);
            });
            el.addEventListener('pointerleave', () => { qX(0); qY(0); });
            gsap.set(el, { transformPerspective: 1000, transformOrigin: 'center' });
        });
    }

    /* =========================================================
       15. TESTIMONIALS CAROUSEL (with GSAP crossfade if available)
       ========================================================= */
    const tCarousel = qs('[data-testimonials]');
    if (tCarousel) {
        const slides = tCarousel.querySelectorAll('[data-slide]');
        const dots = tCarousel.querySelectorAll('[data-dot]');
        let index = 0, timer;
        const go = (i) => {
            index = (i + slides.length) % slides.length;
            slides.forEach((s, n) => {
                const active = n === index;
                if (hasGSAP && !prefersReducedMotion) {
                    if (active) {
                        s.style.display = 'block';
                        gsap.fromTo(s, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
                    } else {
                        gsap.to(s, { opacity: 0, duration: 0.3, onComplete: () => { s.style.display = 'none'; } });
                    }
                } else {
                    s.style.display = active ? 'block' : 'none';
                }
                s.classList.toggle('is-active', active);
            });
            dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
        };
        const auto = () => { clearInterval(timer); timer = setInterval(() => go(index + 1), 6500); };
        dots.forEach((d, n) => d.addEventListener('click', () => { go(n); auto(); }));
        go(0); auto();
        tCarousel.addEventListener('pointerenter', () => clearInterval(timer));
        tCarousel.addEventListener('pointerleave', auto);
    }

    /* =========================================================
       16. BOOKING TABS
       ========================================================= */
    qsa('[data-tabs]').forEach(group => {
        const tabs = group.querySelectorAll('[data-tab]');
        const panels = document.querySelectorAll('[data-panel]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                tabs.forEach(t => t.classList.toggle('is-active', t === tab));
                panels.forEach(p => p.hidden = p.dataset.panel !== target);
            });
        });
    });

    /* =========================================================
       17. SCROLL-STORY PULL QUOTE — word-by-word illumination
       ========================================================= */
    if (hasScrollTrigger && !prefersReducedMotion) {
        qsa('[data-scroll-story]').forEach((quote) => {
            // Wrap words
            const raw = quote.innerHTML;
            // Replace bare words with span.ss-word, preserve <em>
            const walker = document.createTreeWalker(quote, NodeFilter.SHOW_TEXT);
            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);
            textNodes.forEach((tn) => {
                const parts = tn.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                parts.forEach((p) => {
                    if (/^\s+$/.test(p) || p === '') { frag.appendChild(document.createTextNode(p)); return; }
                    const sp = document.createElement('span');
                    sp.className = 'ss-word';
                    sp.textContent = p;
                    frag.appendChild(sp);
                });
                tn.parentNode.replaceChild(frag, tn);
            });
            const words = quote.querySelectorAll('.ss-word');
            ScrollTrigger.create({
                trigger: quote,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 0.8,
                onUpdate: (self) => {
                    const p = self.progress;
                    const lit = Math.floor(p * words.length);
                    words.forEach((w, i) => w.classList.toggle('is-lit', i <= lit));
                },
            });
        });
    } else {
        qsa('[data-scroll-story] .ss-word, [data-scroll-story]').forEach((el) => el.classList.add('is-lit'));
    }

    /* =========================================================
       18. CHAPTER MASK — numeral with image-through background pan
       ========================================================= */
    if (hasScrollTrigger && !prefersReducedMotion) {
        qsa('.chapter-mask__numeral').forEach((num) => {
            gsap.fromTo(num, { backgroundPositionY: '20%' }, {
                backgroundPositionY: '80%',
                ease: 'none',
                scrollTrigger: { trigger: num, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        });
    }

    /* =========================================================
       19. PAGE TRANSITIONS — slide up cream panel on internal link
       ========================================================= */
    const pt = qs('[data-page-transition]');
    if (pt && !prefersReducedMotion && hasGSAP) {
        // Park overlay below viewport; it only rides up on internal nav.
        gsap.set(pt, { yPercent: 100 });

        // Out: on internal link click
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (a.target === '_blank' || a.hasAttribute('download')) return;
            // Only same-origin, same-host HTML pages
            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return;
                if (url.pathname === window.location.pathname && url.hash) return;
            } catch (_) { return; }

            e.preventDefault();
            document.documentElement.classList.add('is-leaving');
            gsap.fromTo(pt, { yPercent: 100 }, {
                yPercent: 0,
                duration: 0.75,
                ease: 'power4.inOut',
                onComplete: () => { window.location.href = href; },
            });
        });
    }

    /* =========================================================
       20. TOUR CARD CORNER TICKER — wrap text in [data-ticker]
       ========================================================= */
    qsa('.tour-card__corner').forEach((corner) => {
        if (corner.querySelector('[data-ticker]')) return;
        const text = corner.textContent.trim();
        corner.textContent = '';
        const t = document.createElement('span');
        t.setAttribute('data-ticker', '');
        t.textContent = text;
        corner.appendChild(t);
    });

    /* =========================================================
       21. SMOOTH ANCHOR (use Lenis when available)
       ========================================================= */
    qsa('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            const target = qs(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) lenis.scrollTo(target, { offset: -100, duration: 1.4 });
            else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* =========================================================
       22. DEV GRID OVERLAY — press G
       ========================================================= */
    let grid = null;
    window.addEventListener('keydown', (e) => {
        if (e.key !== 'g' && e.key !== 'G') return;
        if (e.target.closest('input, textarea, select, [contenteditable]')) return;
        if (!grid) {
            grid = document.createElement('div');
            grid.className = 'dev-grid';
            for (let i = 0; i < 12; i++) {
                const c = document.createElement('div');
                c.className = 'dev-grid__col';
                grid.appendChild(c);
            }
            document.body.appendChild(grid);
        }
        grid.classList.toggle('is-on');
    });

    /* =========================================================
       23. GSAP refresh on full load (images, fonts)
       ========================================================= */
    if (hasScrollTrigger) {
        window.addEventListener('load', () => ScrollTrigger.refresh());
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
    }
})();

/* =============================================================
   V2 EDITORIAL REDESIGN — MOTION LAYER (appended April 2026)
   Hooks: hero cursor spotlight, availability pulse, route builder,
   services accordion, editorial-letter testimonials, audio hint.
   ============================================================= */
(() => {
    'use strict';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
    const qs  = (s, r = document) => r.querySelector(s);
    const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* ---------- Hero V2: noir cursor spotlight ---------- */
    const hero2 = qs('.hero-v2');
    if (hero2 && !isTouch && !prefersReducedMotion) {
        let raf = null;
        let tx = 50, ty = 40, cx = 50, cy = 40;
        const onMove = (e) => {
            const rect = hero2.getBoundingClientRect();
            tx = ((e.clientX - rect.left) / rect.width) * 100;
            ty = ((e.clientY - rect.top) / rect.height) * 100;
            if (!raf) raf = requestAnimationFrame(loop);
        };
        const loop = () => {
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            hero2.style.setProperty('--hx', `${cx}%`);
            hero2.style.setProperty('--hy', `${cy}%`);
            if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
                raf = requestAnimationFrame(loop);
            } else {
                raf = null;
            }
        };
        hero2.addEventListener('pointermove', onMove, { passive: true });
    }

    /* ---------- Hero V2: Lisbon clock (mono) ---------- */
    const heroClock = qs('[data-hero-clock]');
    if (heroClock) {
        const fmt = new Intl.DateTimeFormat('pt-PT', {
            timeZone: 'Europe/Lisbon',
            hour: '2-digit', minute: '2-digit', hour12: false,
        });
        const tick = () => { heroClock.textContent = fmt.format(new Date()).replace(/\s/g, ''); };
        tick();
        setInterval(tick, 1000 * 30);
    }

    /* ---------- Availability pill — rotating faux signals ---------- */
    const avail = qs('[data-availability]');
    if (avail) {
        const messages = [
            'Disponível agora · resposta em 15 min',
            'Online · motoristas em Lisboa',
            'Disponível hoje · Estoril · Lisboa',
            'Online · reservas até 23h',
        ];
        let i = 0;
        const label = avail.querySelector('.nav__availability-label');
        const rotate = () => {
            if (!label) return;
            label.style.transition = 'opacity 280ms ease';
            label.style.opacity = '0';
            setTimeout(() => {
                i = (i + 1) % messages.length;
                label.textContent = messages[i];
                label.style.opacity = '1';
            }, 300);
        };
        setInterval(rotate, 9000);
    }

    /* ---------- Hero bridge SVG: compute stroke length per path ---------- */
    qsa('.hero-v2__bridge path, .hero-v2__bridge line, .cta-v2__bridge path').forEach((p) => {
        try {
            const len = p.getTotalLength ? p.getTotalLength() : 1800;
            p.style.setProperty('--len', len);
        } catch (_) { /* non-length SVG elements */ }
    });

    /* ---------- Services V2 accordion ---------- */
    qsa('[data-service-row]').forEach((row) => {
        const trig = row.querySelector('.service-row__trigger');
        if (!trig) return;
        trig.addEventListener('click', () => {
            const open = row.classList.contains('is-open');
            qsa('[data-service-row].is-open').forEach((r) => r.classList.remove('is-open'));
            if (!open) row.classList.add('is-open');
            if (hasScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 680);
        });
    });

    /* ---------- Editorial Letter testimonials ---------- */
    const letter = qs('[data-letter]');
    if (letter) {
        const slides = qsa('.letter-slide', letter);
        const nav = qsa('[data-letter-nav]', letter);
        let idx = 0, timer;
        const go = (n) => {
            idx = (n + slides.length) % slides.length;
            slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            nav.forEach((b, i) => b.classList.toggle('is-active', i === idx));
        };
        nav.forEach((b, i) => b.addEventListener('click', () => { go(i); restart(); }));
        const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7500); };
        go(0); restart();
        letter.addEventListener('pointerenter', () => clearInterval(timer));
        letter.addEventListener('pointerleave', restart);
    }

    /* ---------- Route-builder SVG: draws as TOURS section enters ---------- */
    if (hasScrollTrigger && !prefersReducedMotion) {
        qsa('.tours-v2__route .route-line').forEach((p) => {
            try {
                const len = p.getTotalLength();
                p.style.setProperty('--rlen', len);
                gsap.fromTo(p,
                    { strokeDashoffset: len },
                    {
                        strokeDashoffset: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: p.closest('.tours-v2'),
                            start: 'top 85%',
                            end: 'bottom 40%',
                            scrub: 0.8,
                        },
                    });
            } catch (_) {}
        });
    }

    /* ---------- Hero audio hint: non-functional tooltip with feedback ---------- */
    qsa('[data-hero-audio]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
            const label = btn.querySelector('.hero-v2__audio-label');
            if (label) {
                const original = label.dataset.original || label.textContent;
                label.dataset.original = original;
                label.textContent = 'em breve · aguarde a viagem';
                setTimeout(() => { label.textContent = original; }, 2400);
            }
        });
    });

    /* ---------- Chapter index highlight based on scroll sections ---------- */
    if (hasScrollTrigger && !prefersReducedMotion) {
        const chapters = qsa('[data-chapter-link]');
        const targets = chapters.map((c) => {
            const id = c.getAttribute('data-chapter-link');
            return id ? document.getElementById(id) : null;
        });
        targets.forEach((t, i) => {
            if (!t) return;
            ScrollTrigger.create({
                trigger: t,
                start: 'top 60%',
                end: 'bottom 40%',
                onToggle: (self) => {
                    if (self.isActive) {
                        chapters.forEach((c) => c.classList.remove('is-active'));
                        chapters[i].classList.add('is-active');
                    }
                },
            });
        });
    }

    /* ---------- GSAP refresh safety after v2 DOM ---------- */
    if (hasScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 200);
})();


/* =============================================================
   EDITION 2026.04 — Awwwards overrides
   New nav behaviour · YouTube hero splits · Enhanced route
   ============================================================= */
(() => {
    'use strict';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
    const qs  = (s, r = document) => r.querySelector(s);
    const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* ---------- Nav: transparent over hero media, solid on scroll ---------- */
    const nav = qs('[data-nav]');
    const heroMedia = qs('.hero-2026, .hero--inner, [data-hero-media]');
    if (nav && heroMedia) {
        nav.classList.add('is-over-media');
        const onScroll = () => {
            const r = heroMedia.getBoundingClientRect();
            // Becomes "solid" once hero bottom crosses 70px into the top
            const past = r.bottom < 90;
            nav.classList.toggle('is-over-media', !past);
            nav.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    }

    /* ---------- HERO 2026: split-text char reveal ---------- */
    const heroTitle = qs('[data-hero-title]');
    if (heroTitle && !prefersReducedMotion && hasGSAP) {
        // Walk text nodes, wrap each char in ch-wrap > ch
        const wrapChars = (node) => {
            const nodes = Array.from(node.childNodes);
            nodes.forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    const words = child.textContent.split(/(\s+)/);
                    words.forEach((word) => {
                        if (/^\s+$/.test(word) || word === '') {
                            frag.appendChild(document.createTextNode(word));
                            return;
                        }
                        const wordWrap = document.createElement('span');
                        wordWrap.className = 'w';
                        Array.from(word).forEach((c) => {
                            const wrap = document.createElement('span');
                            wrap.className = 'ch-wrap';
                            const ch = document.createElement('span');
                            ch.className = 'ch';
                            ch.textContent = c;
                            wrap.appendChild(ch);
                            wordWrap.appendChild(wrap);
                        });
                        frag.appendChild(wordWrap);
                    });
                    child.parentNode.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR') {
                    wrapChars(child);
                }
            });
        };
        wrapChars(heroTitle);
        const chars = heroTitle.querySelectorAll('.ch');
        gsap.set(chars, { y: '105%', opacity: 0 });
        gsap.to(chars, {
            y: '0%',
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.022,
            delay: 0.35,
        });
    }

    /* ---------- HERO 2026: Lisbon clock ---------- */
    const heroClock = qs('[data-hero-clock]');
    if (heroClock) {
        const fmt = new Intl.DateTimeFormat('pt-PT', {
            timeZone: 'Europe/Lisbon',
            hour: '2-digit', minute: '2-digit', hour12: false,
        });
        const tick = () => { heroClock.textContent = fmt.format(new Date()).replace(/\s/g, ''); };
        tick();
        setInterval(tick, 15000);
    }

    /* ---------- Page-hero route animation (calc stroke length) ---------- */
    qsa('.page-hero__route .route-main, .page-hero__route path').forEach((p) => {
        try {
            const len = p.getTotalLength ? p.getTotalLength() : 0;
            if (len) p.style.setProperty('--plen', len);
        } catch (_) {}
    });

    /* ---------- Enhanced Tours route: moving vehicle along route-line ---------- */
    const routeLine = qs('.tours-v2__route .route-line');
    const vehicleGroup = qs('.tours-v2__route .route-vehicle');
    if (routeLine && vehicleGroup) {
        let len = 0;
        try { len = routeLine.getTotalLength(); } catch (_) { len = 0; }
        if (len > 0) {
            const place = (t) => {
                const pt = routeLine.getPointAtLength(Math.max(0, Math.min(len, t * len)));
                vehicleGroup.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
            };
            // Initial position at 0
            place(0);
            if (hasScrollTrigger && !prefersReducedMotion) {
                // Drive vehicle by tours section scroll progress
                ScrollTrigger.create({
                    trigger: '.tours-v2',
                    start: 'top 85%',
                    end: 'bottom 40%',
                    scrub: 0.8,
                    onUpdate: (self) => place(self.progress),
                });
            }
        }
    }

    /* ---------- Page transition: hide the transition overlay initial flash ---------- */
    // (Pre-existing behaviour retained — nothing to add.)

    /* ---------- GSAP refresh safety ---------- */
    if (hasScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 200);
})();
