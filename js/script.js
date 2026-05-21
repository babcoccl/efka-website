/* 
   EFKA - Education Foundation of the Kennebunks and Arundel
   Shared Client-side Scripting
*/

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Mobile Menu Toggling
    // ----------------------------------------------------
    const navToggle = document.querySelector(".mobile-nav-toggle");
    const navContainer = document.querySelector(".nav-container");
    
    if (navToggle && navContainer) {
        navToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navContainer.classList.toggle("open");
            // Animate hamburger lines
            navToggle.classList.toggle("active");
        });
    }

    // Toggle sub-menus on mobile clicking
    const menuItemsWithChildren = document.querySelectorAll(".main-menu .menu-item");
    menuItemsWithChildren.forEach(item => {
        const hasDropdown = item.querySelector(".dropdown-menu");
        if (hasDropdown) {
            const mainLink = item.querySelector("a");
            
            mainLink.addEventListener("click", (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Don't navigate on first tap in mobile
                    item.classList.toggle("active-submenu");
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (navContainer && navContainer.classList.contains("open")) {
            if (!navContainer.contains(e.target) && !navToggle.contains(e.target)) {
                navContainer.classList.remove("open");
                navToggle.classList.remove("active");
            }
        }
    });

    // ----------------------------------------------------
    // 2. Sliding Quick Contact Widget Drawer
    // ----------------------------------------------------
    const quickContactTrigger = document.querySelector(".quick-contact-trigger");
    const quickContactDrawer = document.querySelector(".quick-contact-drawer");
    
    if (quickContactTrigger && quickContactDrawer) {
        quickContactTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            quickContactDrawer.classList.toggle("open");
            quickContactTrigger.classList.toggle("active");
        });
        
        // Prevent clicks inside drawer from closing it
        quickContactDrawer.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        
        // Close drawer when clicking outside
        document.addEventListener("click", () => {
            quickContactDrawer.classList.remove("open");
            quickContactTrigger.classList.remove("active");
        });
    }

    // ----------------------------------------------------
    // 3. FAQ Accordion Toggle Actions
    // ----------------------------------------------------
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isVisible = answer.style.display === "block";
            
            // Close all answers
            document.querySelectorAll(".faq-answer").forEach(ans => {
                ans.style.display = "none";
            });
            
            // Toggle clicked
            answer.style.display = isVisible ? "none" : "block";
        });
    });

    // ----------------------------------------------------
    // 4. Default Date Values for Forms
    // ----------------------------------------------------
    const submissionDateInput = document.querySelector('input[type="date"]');
    if (submissionDateInput && !submissionDateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        submissionDateInput.value = today;
    }

    // ----------------------------------------------------
    // 5. Client-Side Form Submissions & Confirmation Modal
    // ----------------------------------------------------
    const customForms = document.querySelectorAll("form.interactive-form:not(#quick-contact-form)");
    customForms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Simple validation check
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Find container to show success message
            const container = form.closest(".form-container") || form.parentElement;
            
            // Gather form labels & data for debug/auditing if needed
            const formData = new FormData(form);
            console.log("Form Submitted:", form.id);
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}: ${value}`);
            }

            // Animate transition to success screen
            container.style.opacity = 0;
            setTimeout(() => {
                container.innerHTML = `
                    <div class="form-success-message">
                        <div class="success-icon">✓</div>
                        <h2>Submission Received!</h2>
                        <p>Thank you for submitting your request. We have received your details and our team will get back to you shortly.</p>
                        <p class="text-muted" style="margin-top: 15px; font-size: 0.85rem;">For urgent matters, please reach out directly via contact details on our Contact Us page.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top: 25px;">Back to Home</a>
                    </div>
                `;
                container.style.transition = "opacity 0.5s ease";
                container.style.opacity = 1;
            }, 300);
        });
    });

    // Special handler for the Quick Contact footer drawer form
    const quickContactForm = document.getElementById("quick-contact-form");
    if (quickContactForm) {
        quickContactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!quickContactForm.checkValidity()) {
                quickContactForm.reportValidity();
                return;
            }
            
            const drawerBody = quickContactForm.parentElement;
            drawerBody.innerHTML = `
                <div style="text-align: center; padding: 20px 0; color: var(--text-dark);">
                    <div style="font-size: 2.5rem; color: var(--accent); margin-bottom: 10px;">✓</div>
                    <h4 style="color: var(--primary); margin-bottom: 8px;">Message Sent!</h4>
                    <p style="font-size: 0.8rem; line-height: 1.4; color: #555;">Thank you for reaching out. We will get back to you asap.</p>
                </div>
            `;
            
            // Close drawer automatically after 3 seconds
            setTimeout(() => {
                if (quickContactDrawer) {
                    quickContactDrawer.classList.remove("open");
                    quickContactTrigger.classList.remove("active");
                }
            }, 3000);
        });
    }
});
