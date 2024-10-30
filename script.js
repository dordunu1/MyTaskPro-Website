// Image Modal Variables
let currentImageIndex = 0;
const images = document.querySelectorAll('.gallery-item img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

// Modal Functions
function openModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
    currentImageIndex = Array.from(images).findIndex(img => img.src === src);
    document.body.style.overflow = 'hidden';
    modal.classList.add('modal-active');
}

function closeModal() {
    modal.classList.remove('modal-active');
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }, 300);
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    modalImg.src = images[currentImageIndex].src;
    modalImg.classList.add('image-transition');
    setTimeout(() => modalImg.classList.remove('image-transition'), 300);
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if (modal.style.display === "flex") {
        if (e.key === "ArrowLeft") changeImage(-1);
        if (e.key === "ArrowRight") changeImage(1);
        if (e.key === "Escape") closeModal();
    }
});

// Initialize AOS and Smooth Scroll
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out'
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll event listener for header
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Feature Card Hover Effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Prevent Modal Close on Image Click
document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Close Modal on Outside Click
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Add Touch Support for Gallery
let touchStartX = 0;
let touchEndX = 0;

modalImg.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

modalImg.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left
            changeImage(1);
        } else {
            // Swiped right
            changeImage(-1);
        }
    }
}