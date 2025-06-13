// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const header = document.getElementById("header");

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", function () {
    mobileNav.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    if (mobileNav.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when clicking on a link
  const mobileNavLinks = mobileNav.querySelectorAll(".nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("active");
      const icon = mobileMenuBtn.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);

  // Add animation classes to elements
  const animateElements = document.querySelectorAll(
    ".step, .deliverable-item, .testimonial, .calc-item"
  );
  animateElements.forEach((el) => {
    el.classList.add("animate-on-scroll");
    observer.observe(el);
  });

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    // Show loading state
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(contactForm);

    try {
      // Send email using Formspree with correct configuration
      const response = await fetch("https://formspree.io/f/xpwzgqpb", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Success
        showNotification(
          "🎉 Bedankt! Je offerteaanvraag is verzonden. Yassir neemt binnen 24 uur contact met je op.",
          "success"
        );
        contactForm.reset();
      } else {
        // Handle Formspree errors
        const data = await response.json();
        if (data.errors) {
          throw new Error("Controleer je invoer en probeer opnieuw.");
        } else {
          throw new Error("Er is een fout opgetreden bij het verzenden.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification(
        "❌ Er is een fout opgetreden. Probeer het opnieuw of neem direct contact op via yassirfilalichbli2007@gmail.com",
        "error"
      );
    } finally {
      // Reset button state
      btnText.style.display = "inline-flex";
      btnLoading.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // Notification function
  function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
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
            max-width: 450px;
            padding: 1.25rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            ${
              type === "success"
                ? "background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-left: 4px solid #059669; color: #166534;"
                : "background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border-left: 4px solid #dc2626; color: #991b1b;"
            }
        `;

    const notificationContent = notification.querySelector(
      ".notification-content"
    );
    notificationContent.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        `;

    const notificationMessage = notification.querySelector(
      ".notification-message"
    );
    notificationMessage.style.cssText = `
            flex: 1;
            line-height: 1.5;
            font-weight: 500;
        `;

    const closeBtn = notification.querySelector(".notification-close");
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

    closeBtn.addEventListener("click", () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 400);
    });

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.opacity = "1";
    });

    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.opacity = "0.7";
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 7 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 400);
      }
    }, 7000);
  }

  // Progress bar animation
  const progressBar = document.querySelector(".progress-fill");
  if (progressBar) {
    const progressObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "fillProgress 2s ease-out";
          }
        });
      },
      { threshold: 0.5 }
    );

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
  const counterElements = document.querySelectorAll(
    ".impact-value, .stat-value"
  );
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("animated")
        ) {
          entry.target.classList.add("animated");
          const text = entry.target.textContent;
          const number = parseFloat(text.replace(/[^\d.]/g, ""));
          if (!isNaN(number) && number > 0) {
            entry.target.textContent = "0";
            setTimeout(() => {
              animateCounter(entry.target, number);
            }, 200);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => {
    counterObserver.observe(el);
  });
});
