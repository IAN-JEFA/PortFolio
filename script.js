// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // CV Download Functionality
    function openCV() {
        // Create a PDF download link (you'll need to upload the actual PDF file)
        const cvUrl = 'IAN_JEFA_CV.pdf'; // Replace with actual PDF file path
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = cvUrl;
        link.target = '_blank';
        link.download = 'IAN_JEFA_CV.pdf';
        link.rel = 'noopener noreferrer';
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download notice
        showDownloadNotice();
    }
    
    // Show download notice
    function showDownloadNotice() {
        // Create notice if it doesn't exist
        let notice = document.querySelector('.pdf-notice');
        if (!notice) {
            notice = document.createElement('div');
            notice.className = 'pdf-notice';
            notice.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>CV download started. If it doesn't open, check your downloads folder.</span>
            `;
            document.body.appendChild(notice);
        }
        
        // Show notice
        notice.classList.add('show');
        
        // Hide notice after 5 seconds
        setTimeout(() => {
            notice.classList.remove('show');
        }, 5000);
    }
    
    // Attach CV download functionality to all CV buttons
    const cvButtons = ['cvBtn', 'heroCvBtn', 'contactCvBtn', 'footerCvBtn'];
    
    cvButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', openCV);
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
        }
    });
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    function highlightNavLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Add active class to current nav link
    navLinksAll.forEach(link => {
        link.addEventListener('click', function() {
            navLinksAll.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Simple animation for skill tags on hover
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize with first nav link active
    if (navLinksAll.length > 0) {
        navLinksAll[0].classList.add('active');
    }
    
    // Add year to footer
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Ian Jefa. All rights reserved.`;
    }
});