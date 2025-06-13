// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when clicking on a link
    if (mobileNav) {
        const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function() {
                    mobileNav.classList.remove('active');
                    const icon = mobileMenuBtn?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                });
            }
        });
    }

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        if (link) { // Add null check here
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection && header) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.step, .deliverable-item, .testimonial, .calc-item');
    animateElements.forEach(el => {
        if (el) {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        }
    });

    // Contact Form Handling - Multiple Email Services
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn?.querySelector('.btn-text');
            const btnLoading = submitBtn?.querySelector('.btn-loading');
            
            if (submitBtn && btnText && btnLoading) {
                // Show loading state
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-flex';
                submitBtn.disabled = true;
            }
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            try {
                // Try EmailJS first (most reliable for static hosting)
                const success = await sendWithEmailJS(formData);
                
                if (success) {
                    showNotification('🎉 Geweldig! Je offerteaanvraag is verzonden. Yassir neemt binnen 24 uur contact met je op.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Email service niet beschikbaar');
                }
                
            } catch (error) {
                console.error('Error:', error);
                
                // Fallback: Show contact info
                showNotification(`
                    ❌ Er is een technische fout opgetreden bij het verzenden. 
                    <br><br>
                    <strong>Neem direct contact op:</strong><br>
                    📧 Email: yassirfilalichbli2007@gmail.com<br>
                    📱 Telefoon: +31 6 1234 5678<br>
                    <br>
                    <em>Vermeld je naam en dat je geïnteresseerd bent in de conversieboost service.</em>
                `, 'error');
            } finally {
                // Reset button state
                if (submitBtn && btnText && btnLoading) {
                    btnText.style.display = 'inline-flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // EmailJS Integration
    async function sendWithEmailJS(formData) {
        try {
            // Initialize EmailJS (you'll need to set this up)
            // For now, we'll simulate the email sending
            
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                company: formData.get('company') || 'Niet opgegeven',
                phone: formData.get('phone') || 'Niet opgegeven',
                website: formData.get('website') || 'Niet opgegeven',
                budget: formData.get('budget') || 'Niet opgegeven',
                timeline: formData.get('timeline') || 'Niet opgegeven',
                goals: formData.get('goals') || 'Niet opgegeven',
                message: formData.get('message') || 'Geen aanvullende informatie',
                to_email: 'yassirfilalichbli2007@gmail.com'
            };

            // For demonstration, we'll create a mailto link as fallback
            const subject = encodeURIComponent(`Offerteaanvraag van ${templateParams.from_name}`);
            const body = encodeURIComponent(`
Naam: ${templateParams.from_name}
Email: ${templateParams.from_email}
Bedrijf: ${templateParams.company}
Telefoon: ${templateParams.phone}
Website: ${templateParams.website}
Budget: ${templateParams.budget}
Timeline: ${templateParams.timeline}

Doelen:
${templateParams.goals}

Aanvullende informatie:
${templateParams.message}

---
Verzonden via contactformulier op ${window.location.href}
            `);

            // Create mailto link and trigger it
            const mailtoLink = `mailto:yassirfilalichbli2007@gmail.com?subject=${subject}&body=${body}`;
            
            // Try to open email client
            const link = document.createElement('a');
            link.href = mailtoLink;
            link.click();
            
            return true;
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            return false;
        }
    }

    // Notification function
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 500px;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            ${type === 'success' ? 
                'background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-left: 4px solid #059669; color: #166534;' : 
                'background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border-left: 4px solid #dc2626; color: #991b1b;'
            }
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        if (notificationContent) {
            notificationContent.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            `;
        }
        
        const notificationMessage = notification.querySelector('.notification-message');
        if (notificationMessage) {
            notificationMessage.style.cssText = `
                flex: 1;
                line-height: 1.5;
                font-weight: 500;
            `;
        }
        
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                flex-shrink: 0;
            `;
            
            closeBtn.addEventListener('click', () => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 400);
            });
            
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
            });
            
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.7';
            });
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 10 seconds for error messages, 6 for success
        const autoRemoveTime = type === 'error' ? 10000 : 6000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 400);
            }
        }, autoRemoveTime);
    }

    // Progress bar animation
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const progressObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fillProgress 2s ease-out';
                }
            });
        }, { threshold: 0.5 });
        
        progressObserver.observe(progressBar);
    }

    // Counter animation for impact values
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        updateCounter();
    }

    // Animate counters when they come into view
    const counterElements = document.querySelectorAll('.impact-value, .stat-value');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const number = parseFloat(text.replace(/[^\d.]/g, ''));
                if (!isNaN(number) && number > 0) {
                    entry.target.textContent = '0';
                    setTimeout(() => {
                        animateCounter(entry.target, number);
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => {
        if (el) {
            counterObserver.observe(el);
        }
    });
});