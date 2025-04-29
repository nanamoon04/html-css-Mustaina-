// contact.js - Penanganan formulir kontak dengan EmailJS dan animasi scroll

// Inisialisasi EmailJS dengan public key Anda
(function() {
    emailjs.init("f177BWx_Ra4rmjmrJ"); // Ganti dengan public key EmailJS Anda
})();

document.addEventListener('DOMContentLoaded', function() {
    // Elemen untuk bagian formulir kontak
    const contactForm = document.getElementById('contactForm');
    const contactSection = document.getElementById('contactSection');
    const thankYouSection = document.getElementById('thankYouSection');
    const backButton = document.getElementById('backButton');

    // Elemen untuk bagian admin
    const adminLink = document.getElementById('adminLink');
    const adminSection = document.getElementById('adminSection');
    const closeAdmin = document.getElementById('closeAdmin');
    const messagesContainer = document.getElementById('messagesContainer');
    const noMessages = document.getElementById('noMessages');
    const clearMessagesBtn = document.getElementById('clearMessages');

    // ===== BAGIAN FORMULIR KONTAK =====

    // Penanganan submit form
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Ambil data form
            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const subjek = document.getElementById('subjek').value;
            const pesan = document.getElementById('pesan').value;
            
            // Tampilkan status loading
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Mengirim...';
            
            // Siapkan parameter template
            const templateParams = {
                from_name: nama,
                reply_to: email,
                subject: subjek,
                message: pesan
            };
            
            // Kirim email menggunakan EmailJS
            emailjs.send('service_ozhez6k', 'template_4xqif1s', templateParams)
                .then(function(response) {
                    console.log('SUKSES!', response.status, response.text);
                    
                    // Sembunyikan form dan tampilkan pesan terima kasih
                    contactForm.reset();
                    contactSection.style.display = 'none';
                    thankYouSection.style.display = 'block';
                    
                    // Simpan pesan ke local storage untuk admin
                    saveMessage(nama, email, subjek, pesan);
                })
                .catch(function(error) {
                    console.log('GAGAL...', error);
                    alert('Gagal mengirim pesan. Silakan coba lagi nanti.');
                })
                .finally(function() {
                    // Kembalikan status tombol
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
        });
    }

    // Tombol kembali ke formulir - FIXED
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Sembunyikan thank you section
            thankYouSection.style.display = 'none';
            // Tampilkan contact section
            contactSection.style.display = 'block';
            
            // Log untuk debugging
            console.log('Back button clicked!');
            console.log('Thank You Section display:', thankYouSection.style.display);
            console.log('Contact Section display:', contactSection.style.display);
            
            // Force redraw contact section
            void contactSection.offsetWidth;
            
            // Reset form jika diperlukan
            if (contactForm) {
                contactForm.reset();
            }
            
            // Scroll ke contact section
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    } else {
        console.error('Back button not found in the DOM!');
    }

    // ===== BAGIAN ADMIN =====

    // Toggle bagian admin
    if (adminLink) {
        adminLink.addEventListener('click', function(event) {
            event.preventDefault();
            adminSection.style.display = 'block';
            loadMessages();
        });
    }

    // Tutup bagian admin
    if (closeAdmin) {
        closeAdmin.addEventListener('click', function() {
            adminSection.style.display = 'none';
        });
    }

    // Hapus semua pesan
    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua pesan?')) {
                localStorage.removeItem('contactMessages');
                loadMessages();
            }
        });
    }

    // ===== FUNGSI PEMBANTU =====

    // Simpan pesan ke local storage
    function saveMessage(nama, email, subjek, pesan) {
        const timestamp = new Date().toISOString();
        const newMessage = { nama, email, subjek, pesan, timestamp, read: false };
        
        let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(newMessage);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }

    // Muat pesan dari local storage
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = '';
            noMessages.style.display = 'block';
        } else {
            noMessages.style.display = 'none';
            
            // Urutkan pesan berdasarkan timestamp (terbaru dulu)
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Buat HTML untuk pesan
            let html = '';
            messages.forEach((msg, index) => {
                const date = new Date(msg.timestamp).toLocaleString();
                const readClass = msg.read ? 'read' : 'unread';
                
                html += `
                    <div class="message-card ${readClass}" data-index="${index}">
                        <div class="message-header">
                            <div class="message-sender">${msg.nama}</div>
                            <div class="message-time">${date}</div>
                        </div>
                        <div class="message-subject">${msg.subjek}</div>
                        <div class="message-body">${msg.pesan}</div>
                        <div class="message-email">
                            <i class="far fa-envelope"></i>
                            ${msg.email}
                        </div>
                        <div class="message-actions">
                            <button onclick="toggleRead(${index})" class="message-btn">
                                <i class="far ${msg.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                                ${msg.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                            </button>
                            <button onclick="deleteMessage(${index})" class="message-btn delete-btn">
                                <i class="far fa-trash-alt"></i>
                                Hapus
                            </button>
                        </div>
                    </div>
                `;
            });
            
            messagesContainer.innerHTML = html;
        }
    }

    // Tandai pesan sebagai sudah/belum dibaca
    window.toggleRead = function(index) {
        let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        if (messages[index]) {
            messages[index].read = !messages[index].read;
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
        }
    };

    // Hapus sebuah pesan
    window.deleteMessage = function(index) {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.splice(index, 1);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
        }
    };

    // ===== ANIMASI SCROLL =====

    // Tambahkan kelas fade-in-element pada elemen yang ingin dianimasikan saat scroll
    const elementsToAnimate = [
        document.querySelector('.contact-heading'),
        document.querySelector('.contact-info'),
        document.querySelector('footer'),
        ...document.querySelectorAll('.footer-col')
    ];

    // Tambahkan kelas ke elemen yang ingin dianimasikan
    elementsToAnimate.forEach(element => {
        if (element) {
            element.classList.add('fade-in-element');
        }
    });

    // Arah animasi untuk elemen informasi kontak
    const contactInfoElement = document.querySelector('.contact-info');
    if (contactInfoElement) contactInfoElement.classList.add('from-right');

    // Function untuk animasi scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in-element');
        
        elements.forEach(element => {
            // Posisi elemen relatif terhadap viewport
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Jika elemen sudah masuk ke viewport
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Jalankan animasi saat halaman dimuat
    setTimeout(animateOnScroll, 100);
    
    // Jalankan animasi saat scroll
    window.addEventListener('scroll', animateOnScroll);

    // Animasi form focus
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});