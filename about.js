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
        // Animasi untuk semua elemen yang memiliki class animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(function(element) {
            if (isInViewport(element)) {
                element.classList.add('visible');
                
                // Animasi skill bar saat skill column terlihat
                if (element.classList.contains('skill-column')) {
                    element.querySelectorAll('.skill-level').forEach(function(bar) {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            }
        });
    }
    
    // Check visibility saat halaman dimuat
    checkVisibility();
    
    // Check visibility saat scroll
    window.addEventListener('scroll', checkVisibility);
});
