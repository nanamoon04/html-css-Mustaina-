document.addEventListener("DOMContentLoaded", function() {
    // Fungsi untuk mendeteksi elemen yang terlihat di viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Fungsi untuk menampilkan elemen saat terlihat
    function checkVisibility() {
        // Animasi untuk elemen dengan class animate-on-scroll
        document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right, .quote-heading').forEach(function(element) {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Check visibility saat halaman dimuat
    checkVisibility();
    
    // Check visibility saat scroll
    window.addEventListener('scroll', checkVisibility);
    
    // Tambahkan event listener untuk gambar
    document.querySelectorAll('.project-box img, .experience-item img').forEach(function(img) {
        img.addEventListener('click', function() {
            // Reset animasi
            this.style.animation = 'none';
            // Trigger reflow
            void this.offsetWidth;
            // Tambahkan class animate__flip dari Animate.css
            this.classList.add('animate__animated', 'animate__flip');
            
            // Hapus class setelah animasi selesai
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__flip');
            }, 1000);
        });
    });
});