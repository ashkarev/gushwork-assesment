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
    },

    cacheElements() {
        this.header = document.getElementById('main-nav');
        this.modal = document.getElementById('callback-modal');
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

        // Generic modal triggers
        document.querySelectorAll('.contact-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });
    },

    initStickyHeader() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.header.classList.add('is-sticky');
            } else {
                this.header.classList.remove('is-sticky');
            }

            // Optional: Hide/Show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 500) {
                this.header.classList.add('nav-hidden');
            } else {
                this.header.classList.remove('nav-hidden');
            }
            lastScroll = currentScroll;
        });
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

        // Apple-style Zoom Interaction
        if (zoomSurface) {
            zoomSurface.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = zoomSurface.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                display.style.transformOrigin = `${x}% ${y}%`;
                display.style.transform = 'scale(1.5)';
            });

            zoomSurface.addEventListener('mouseleave', () => {
                display.style.transform = 'scale(1)';
            });
        }
    },

    initTabs() {
        const triggers = document.querySelectorAll('.tab-trigger');
        const title = document.getElementById('step-title');
        const desc = document.getElementById('step-desc');
        const img = document.getElementById('step-img');

        const processData = {
            1: {
                title: "High-Grade PE100 Material",
                desc: "We use only certified PE100 grade resin to guarantee maximum stress resistance and service life.",
                img: "assets/manufacturing-step.png"
            },
            2: {
                title: "Precision Extrusion",
                desc: "Advanced German-engineered extruders ensure uniform wall thickness and perfect circularity across all diameters.",
                img: "assets/1.png" // Using existing assets, ideally these would be unique
            },
            3: {
                title: "Controlled Vacuum Cooling",
                desc: "Multiple stage cooling tanks stabilize the pipe structure rapidly while maintaining dimensional integrity.",
                img: "assets/manufacturing-step.png"
            },
            4: {
                title: "Sizing & Calibration",
                desc: "Laser-guided sizing sleeves ensure the outer diameter meets strict international tolerances.",
                img: "assets/manufacturing-step.png"
            },
            5: {
                title: "Strict Quality Control",
                desc: "Every batch undergoes hydrostatic pressure testing and raw material analysis in our NABL accredited lab.",
                img: "assets/manufacturing-step.png"
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
                const content = document.querySelector('.panel-content');
                content.style.opacity = '0';
                
                setTimeout(() => {
                    title.textContent = data.title;
                    desc.textContent = data.desc;
                    // img.src = data.img; 
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
        const closeBtn = document.querySelector('.modal-dismiss');
        const form = document.getElementById('contact-form');

        if (!this.modal) return;

        this.openModal = () => {
            this.modal.classList.add('is-visible');
            this.body.style.overflow = 'hidden';
        };

        this.closeModal = () => {
            this.modal.classList.remove('is-visible');
            this.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', this.closeModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';

                // Simulate submission
                setTimeout(() => {
                    this.showFeedback('Thank you! Our engineer will call you shortly.', 'success');
                    form.reset();
                    this.closeModal();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1500);
            });
        }
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
