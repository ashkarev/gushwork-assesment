/**
 * Mangalam Hope Pipes - Interaction Layer
 * Implementation of UI components, gallery logic, and smooth transitions.
 */

const MangalamUI = {
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initStickyHeader();
        this.initGallery();
        this.initTabs();
        this.initAccordion();
        this.initModal();
        this.initScrollReveal();
    },

    cacheElements() {
        this.header = document.getElementById('main-nav');
        this.datasheetModal = document.getElementById('datasheet-modal');
        this.quoteModal = document.getElementById('quote-modal');
        this.body = document.body;
    },

    bindEvents() {
        // Mobile menu toggle
        const menuBtn = document.querySelector('.menu-toggle');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                menuBtn.classList.toggle('active');
                document.querySelector('.desktop-links').classList.toggle('mobile-open');
            });
        }

        // Quote modal triggers (.contact-trigger)
        document.querySelectorAll('.contact-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openQuoteModal();
            });
        });

        // Datasheet modal triggers (.datasheet-trigger)
        document.querySelectorAll('.datasheet-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDatasheetModal();
            });
        });
    },

    initStickyHeader() {
        let lastScroll = 0;
        const threshold = 160;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Sticky logic
            if (currentScroll > threshold) {
                this.header.classList.add('is-sticky');
            } else {
                this.header.classList.remove('is-sticky');
            }

            // Hide/Show logic
            if (currentScroll > lastScroll && currentScroll > 600) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    },

    initGallery() {
        const display = document.getElementById('active-image');
        const thumbs = document.querySelectorAll('.thumb-node');
        const prevBtn = document.querySelector('.nav-prev');
        const nextBtn = document.querySelector('.nav-next');
        const zoomSurface = document.querySelector('.zoom-surface');
        
        if (!display) return;

        let currentIndex = 0;

        const updateDisplay = (index) => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[index].classList.add('active');
            
            // Add a slight fade transition effect
            display.style.opacity = '0.4';
            setTimeout(() => {
                display.src = thumbs[index].querySelector('img').src;
                display.style.opacity = '1';
            }, 150);
            
            currentIndex = index;
        };

        thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => updateDisplay(i));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex === 0) ? thumbs.length - 1 : currentIndex - 1;
                updateDisplay(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex === thumbs.length - 1) ? 0 : currentIndex + 1;
                updateDisplay(newIndex);
            });
        }

        // Smooth Zoom Interaction
        if (zoomSurface) {
            zoomSurface.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = zoomSurface.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                
                requestAnimationFrame(() => {
                    display.style.transformOrigin = `${x}% ${y}%`;
                    display.style.transform = 'scale(1.8)';
                });
            });

            zoomSurface.addEventListener('mouseleave', () => {
                display.style.transform = 'scale(1)';
            });
        }
    },

    initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    },

    initTabs() {
        const triggers = document.querySelectorAll('.step-pill');
        const title = document.getElementById('step-title');
        const desc = document.getElementById('step-desc');
        const img = document.getElementById('step-img');

        const processData = {
            1: {
                title: "High-Grade Raw Material Selection",
                desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
                features: ["PE100 grade material", "Optimal molecular weight distribution"]
            },
            2: {
                title: "Precision Extrusion",
                desc: "Our state-of-the-art extrusion lines melt the raw granules and form them into a continuous pipe with high precision.",
                features: ["Uniform wall thickness", "Melt temperature control"]
            },
            3: {
                title: "Controlled Cooling",
                desc: "Multiple stage cooling tanks stabilize the pipe structure rapidly while maintaining dimensional integrity.",
                features: ["Stress-free cooling", "Efficient heat transfer"]
            },
            4: {
                title: "Laser-Guided Sizing",
                desc: "Laser-guided sizing sleeves ensure the outer diameter meets strict international tolerances.",
                features: ["Micron-level accuracy", "Automated calibration"]
            },
            5: {
                title: "Quality Control",
                desc: "Every batch undergoes hydrostatic pressure testing and raw material analysis in our accredited lab.",
                features: ["NABL Standards", "Real-time monitoring"]
            },
            6: {
                title: "Automated Marking",
                desc: "Inkjet or laser marking of specifications, standards, and batch numbers for full traceability.",
                features: ["Permanent marking", "Clear readability"]
            },
            7: {
                title: "Precision Cutting",
                desc: "Swarfless cutting systems ensure clean, square ends for perfect jointing during installation.",
                features: ["Burr-free ends", "Standard lengths"]
            },
            8: {
                title: "Secure Packaging",
                desc: "Pipes are coiled or bundled securely to prevent damage during transport and storage.",
                features: ["UV protection", "Safe handling"]
            }
        };

        triggers.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.dataset.step;
                const data = processData[step];

                if (!data) return;

                // UI Update
                triggers.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');

                // Content Swap with animation
                const content = document.querySelector('.panel-inner');
                content.style.opacity = '0';
                
                setTimeout(() => {
                    title.textContent = data.title;
                    desc.textContent = data.desc;
                    
                    // Update checkmarks
                    const checkList = document.querySelector('.step-checkmarks');
                    checkList.innerHTML = data.features.map(f => `<li><span>${f}</span></li>`).join('');
                    
                    content.style.opacity = '1';
                }, 200);
            });
        });
    },

    initAccordion() {
        const items = document.querySelectorAll('.faq-node');
        
        items.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close others
                items.forEach(i => i.classList.remove('active'));
                
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        });
    },

    initModal() {
        // ---- Datasheet Modal ----
        if (this.datasheetModal) {
            const dsClose = document.getElementById('datasheet-modal-close');
            const dsForm = document.getElementById('datasheet-form');

            this.openDatasheetModal = () => {
                this.datasheetModal.classList.add('is-visible');
                this.body.style.overflow = 'hidden';
            };

            this.closeDatasheetModal = () => {
                this.datasheetModal.classList.remove('is-visible');
                this.body.style.overflow = '';
            };

            if (dsClose) dsClose.addEventListener('click', () => this.closeDatasheetModal());

            this.datasheetModal.addEventListener('click', (e) => {
                if (e.target === this.datasheetModal) this.closeDatasheetModal();
            });

            if (dsForm) {
                dsForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('datasheet-submit-btn');
                    const orig = btn.textContent;
                    btn.disabled = true;
                    btn.textContent = 'Sending...';
                    setTimeout(() => {
                        this.showFeedback('Catalogue sent! Check your inbox.', 'success');
                        dsForm.reset();
                        this.closeDatasheetModal();
                        btn.disabled = false;
                        btn.textContent = orig;
                    }, 1500);
                });
            }
        }

        // ---- Quote / Call Back Modal ----
        if (this.quoteModal) {
            const qClose = document.getElementById('quote-modal-close');
            const qForm = document.getElementById('quote-form');

            this.openQuoteModal = () => {
                this.quoteModal.classList.add('is-visible');
                this.body.style.overflow = 'hidden';
            };

            this.closeQuoteModal = () => {
                this.quoteModal.classList.remove('is-visible');
                this.body.style.overflow = '';
            };

            if (qClose) qClose.addEventListener('click', () => this.closeQuoteModal());

            this.quoteModal.addEventListener('click', (e) => {
                if (e.target === this.quoteModal) this.closeQuoteModal();
            });

            if (qForm) {
                qForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('quote-submit-btn');
                    const orig = btn.textContent;
                    btn.disabled = true;
                    btn.textContent = 'Submitting...';
                    setTimeout(() => {
                        this.showFeedback('Request received! Our expert will call you shortly.', 'success');
                        qForm.reset();
                        this.closeQuoteModal();
                        btn.disabled = false;
                        btn.textContent = orig;
                    }, 1500);
                });
            }
        }

        // Keyboard close (Escape)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.datasheetModal && this.datasheetModal.classList.contains('is-visible')) {
                    this.closeDatasheetModal();
                }
                if (this.quoteModal && this.quoteModal.classList.contains('is-visible')) {
                    this.closeQuoteModal();
                }
            }
        });
    },

    showFeedback(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};

// Start application
document.addEventListener('DOMContentLoaded', () => MangalamUI.init());
