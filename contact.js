// contact.js - Penanganan formulir kontak dan administrasi pesan

document.addEventListener('DOMContentLoaded', function() {
    // Elemen-elemen untuk bagian formulir kontak
    const contactForm = document.getElementById('contactForm');
    const contactSection = document.getElementById('contactSection');
    const thankYouSection = document.getElementById('thankYouSection');
    const backButton = document.getElementById('backButton');
    
    // Elemen-elemen untuk bagian admin
    const adminLink = document.getElementById('adminLink');
    const adminSection = document.getElementById('adminSection');
    const closeAdmin = document.getElementById('closeAdmin');
    const messagesContainer = document.getElementById('messagesContainer');
    const noMessages = document.getElementById('noMessages');
    const clearMessagesBtn = document.getElementById('clearMessages');
    
    // ===== BAGIAN KONTAK =====
    
    // Menangani pengiriman formulir
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Mendapatkan nilai dari form
            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const subjek = document.getElementById('subjek').value;
            const pesan = document.getElementById('pesan').value;
            
            // Validasi sederhana
            if (nama.length < 3) {
                alert('Nama harus minimal 3 karakter');
                return false;
            }
            
            if (!validateEmail(email)) {
                alert('Silakan masukkan alamat email yang valid');
                return false;
            }
            
            if (subjek.length < 3) {
                alert('Subjek harus minimal 3 karakter');
                return false;
            }
            
            if (pesan.length < 10) {
                alert('Pesan harus minimal 10 karakter');
                return false;
            }
            
            // Buat objek pesan untuk disimpan
            const messageData = {
                id: Date.now(),  // Membuat ID unik berdasarkan timestamp
                nama: nama,
                email: email,
                subjek: subjek,
                pesan: pesan,
                waktu: new Date().toLocaleString()
            };
            
            // Simpan pesan ke localStorage
            saveMessage(messageData);
            
            // Tampilkan pesan terima kasih
            showThankYouMessage();
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Tombol kembali di halaman terima kasih
    if (backButton) {
        backButton.addEventListener('click', function() {
            hideThankYouMessage();
        });
    }
    
    // ===== BAGIAN ADMIN =====
    
    // Toggle tampilan admin panel
    if (adminLink) {
        adminLink.addEventListener('click', function(event) {
            event.preventDefault();
            adminSection.style.display = 'block';
            contactSection.style.display = 'none';
            thankYouSection.style.display = 'none';
            
            // Tampilkan pesan-pesan yang tersimpan
            displayMessages();
        });
    }
    
    // Tutup panel admin
    if (closeAdmin) {
        closeAdmin.addEventListener('click', function() {
            adminSection.style.display = 'none';
            contactSection.style.display = 'block';
        });
    }
    
    // Hapus semua pesan
    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', function() {
            clearAllMessages();
        });
    }
    
    // Event listener untuk aksi pada pesan (hapus pesan)
    if (messagesContainer) {
        messagesContainer.addEventListener('click', function(event) {
            // Hapus pesan tertentu
            if (event.target.closest('.delete-btn')) {
                const button = event.target.closest('.delete-btn');
                const id = button.dataset.id;
                deleteMessage(id);
            }
            
            // Balas pesan (buka aplikasi email)
            if (event.target.closest('.reply-btn')) {
                const button = event.target.closest('.reply-btn');
                const email = button.dataset.email;
                window.location.href = `mailto:${email}`;
            }
        });
    }
    
    // ===== FUNGSI UTILITAS =====
    
    // Validasi email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Simpan pesan baru ke localStorage
    function saveMessage(messageData) {
        // Ambil pesan yang sudah ada di localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        // Tambahkan pesan baru
        messages.push(messageData);
        
        // Simpan kembali ke localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        console.log('Pesan berhasil disimpan:', messageData);
    }
    
    // Ambil semua pesan dari localStorage
    function getMessages() {
        return JSON.parse(localStorage.getItem('contactMessages')) || [];
    }
    
    // Tampilkan pesan dalam container
    function displayMessages() {
        if (!messagesContainer) return;
        
        const messages = getMessages();
        
        // Kosongkan container terlebih dahulu
        messagesContainer.innerHTML = '';
        
        // Jika tidak ada pesan, tampilkan pesan kosong
        if (messages.length === 0) {
            messagesContainer.appendChild(noMessages);
            return;
        }
        
        // Urutkan pesan dari yang terbaru
        messages.sort((a, b) => b.id - a.id);
        
        // Tambahkan setiap pesan ke container
        messages.forEach(message => {
            const messageCard = createMessageCard(message);
            messagesContainer.appendChild(messageCard);
        });
    }
    
    // Buat elemen kartu pesan
    function createMessageCard(message) {
        const card = document.createElement('div');
        card.className = 'message-card';
        card.dataset.id = message.id;
        
        card.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${escapeHTML(message.nama)}</div>
                <div class="message-time">${message.waktu}</div>
            </div>
            <div class="message-subject">${escapeHTML(message.subjek)}</div>
            <div class="message-body">${escapeHTML(message.pesan)}</div>
            <div class="message-email">
                <i class="fas fa-envelope"></i>
                ${escapeHTML(message.email)}
            </div>
            <div class="message-actions">
                <button class="message-btn reply-btn" data-email="${escapeHTML(message.email)}">
                    <i class="fas fa-reply"></i> Balas
                </button>
                <button class="message-btn delete-btn" data-id="${message.id}">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        `;
        
        return card;
    }
    
    // Fungsi keamanan untuk mencegah XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Hapus pesan tertentu
    function deleteMessage(id) {
        let messages = getMessages();
        
        // Filter pesan dengan ID yang cocok
        messages = messages.filter(message => message.id != id);
        
        // Simpan kembali ke localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Tampilkan ulang pesan
        displayMessages();
    }
    
    // Hapus semua pesan
    function clearAllMessages() {
        if (confirm('Apakah Anda yakin ingin menghapus semua pesan?')) {
            localStorage.removeItem('contactMessages');
            displayMessages();
        }
    }
    
    // Tampilkan pesan terima kasih
    function showThankYouMessage() {
        contactSection.style.display = 'none';
        adminSection.style.display = 'none';
        thankYouSection.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    // Sembunyikan pesan terima kasih
    function hideThankYouMessage() {
        thankYouSection.style.display = 'none';
        contactSection.style.display = 'block';
        adminSection.style.display = 'none';
    }
});