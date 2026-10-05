// Memanggil File Audio MP3 Sirine & Boom dari Folder
const sirineAudio = new Audio('sirine.mp3');
const boomAudio = new Audio('boom.mp3');
boomAudio.loop = true;

function smoothVolume(audio, targetVolume, duration = 800) {
    const startVolume = audio.volume || 0;
    const startTime = performance.now();

    const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = startVolume + (targetVolume - startVolume) * eased;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

function fadeBoomForAppOpen(duration = 500) {
    if (!boomAudio) return;
    const startVolume = boomAudio.volume || 0.75;
    const startTime = performance.now();

    const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        boomAudio.volume = startVolume + (0.08 - startVolume) * eased;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

function playCountdownBeep(frequency = 660, duration = 140, volume = 0.04, type = 'square') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!window.countdownAudioCtx) {
        window.countdownAudioCtx = new AudioCtx();
    }

    const ctx = window.countdownAudioCtx;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration / 1000);
}

function playAppClickTone() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!window.appClickAudioCtx) {
        window.appClickAudioCtx = new AudioCtx();
    }

    const ctx = window.appClickAudioCtx;

    const createTone = (frequency, startTime, duration, volume, type) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.45, startTime + duration);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    };

    const startTime = ctx.currentTime;
    createTone(820, startTime, 0.12, 0.11, 'triangle');
    createTone(1120, startTime + 0.02, 0.09, 0.07, 'square');
    createTone(1420, startTime + 0.04, 0.07, 0.05, 'sawtooth');
}

function restoreBoomVolume(duration = 700) {
    if (!boomAudio) return;
    const startVolume = boomAudio.volume || 0.08;
    const startTime = performance.now();

    const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        boomAudio.volume = startVolume + (0.75 - startVolume) * eased;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

// Mengambil Elemen Modal & Iframe
const appModal = document.getElementById('appModal');
const appIframe = document.getElementById('appIframe');
const closeModalBtn = document.getElementById('closeModal');
const mascotVideo = document.querySelector('.robot-video');
const videoSoundToggle = document.getElementById('videoSoundToggle');

function setMascotVideoSound(enabled) {
    mascotVideo.muted = !enabled;
    videoSoundToggle.textContent = enabled ? 'MATIKAN SUARA' : 'AKTIFKAN SUARA';
    videoSoundToggle.setAttribute('aria-pressed', String(enabled));

    const playback = mascotVideo.play();
    if (playback) {
        playback.catch(() => {
            mascotVideo.muted = true;
            videoSoundToggle.textContent = 'SUARA GAGAL DIPUTAR';
            videoSoundToggle.setAttribute('aria-pressed', 'false');
            videoSoundToggle.title = 'Periksa file video dan dukungan audio browser.';
        });
    }
}

videoSoundToggle.addEventListener('click', function() {
    setMascotVideoSound(mascotVideo.muted);
});

function showLaunchMenu() {
    const textGroup = document.querySelector('.text-group');
    const mascotWrapper = document.querySelector('.mascot-wrapper');

    textGroup.innerHTML = `
        <h1 class="glow-title">SpenGarda Digital Resmi Dilaunching !</h1>
        <p class="sub-title">Selamat Menikmati Kemudahan Akses Ekosistem Digital SMP Negeri 2 Garawangi.</p>
    `;
    textGroup.classList.add('launch-ready');
    textGroup.style.display = '';

    const existingOrbit = mascotWrapper.querySelector('.orbit-container');
    if (existingOrbit) {
        existingOrbit.remove();
    }

    const orbitDiv = document.createElement('div');
    orbitDiv.className = 'orbit-container';
    orbitDiv.innerHTML = `
        <a href="spengarda-mobile.html" id="btnMobileApp" class="app-icon-card" data-mode="modal">
            <svg viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
            <span>SpenGarda</span>
        </a>
        <a href="web-sekolah.html" id="btnSchoolWebsite" class="app-icon-card" data-mode="modal">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span>Web Sekolah</span>
        </a>
        <a href="https://www.instagram.com/smpn2garawangi.sch.id/" target="_blank" rel="noopener noreferrer" class="app-icon-card">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span>IG</span>
        </a>
        <a href="https://www.youtube.com/@smpn2garawangi" target="_blank" rel="noopener noreferrer" class="app-icon-card">
            <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span>Youtube</span>
        </a>
        <a href="#" class="app-icon-card" aria-label="Aplikasi Ujian">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            <span>Aplikasi Ujian</span>
        </a>
    `;
    mascotWrapper.appendChild(orbitDiv);

    const modalLinks = orbitDiv.querySelectorAll('[data-mode="modal"]');
    modalLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            appIframe.src = this.href;
            appModal.classList.add('active');
        });
    });
}

document.getElementById('btnLaunch').addEventListener('click', function() {
    const btn = this;
    const textGroup = document.querySelector('.text-group');
    
    // Sembunyikan Tombol
    btn.style.display = 'none';
    textGroup.style.display = 'none';

    mascotVideo.pause();
    mascotVideo.loop = false;
    mascotVideo.muted = false;
    mascotVideo.src = 'Video%20Hitungan%20Mundur.mp4';
    mascotVideo.currentTime = 0;
    mascotVideo.load();
    videoSoundToggle.textContent = 'MATIKAN SUARA';
    videoSoundToggle.setAttribute('aria-pressed', 'true');

    mascotVideo.onerror = function() {
        console.warn('Video hitung mundur tidak tersedia, menampilkan menu peluncuran sebagai fallback.');
        showLaunchMenu();
    };

    mascotVideo.onended = function() {
        // Putar sirine setelah video hitung mundur selesai.
        sirineAudio.currentTime = 0;
        sirineAudio.volume = 0.7;
        const sirinePlayback = sirineAudio.play();
        if (sirinePlayback) {
            sirinePlayback.catch(error => {
                console.error('Sirine gagal diputar:', error);
                textGroup.textContent = 'Sirine gagal diputar. Periksa file sirine.mp3.';
            });
        }

        // Setelah sirine selesai, putar audio boom dan tampilkan menu peluncuran.
        sirineAudio.onended = function() {
            boomAudio.currentTime = 0;
            boomAudio.volume = 0.08;
            boomAudio.play();
            smoothVolume(boomAudio, 0.75, 1100);

            mascotVideo.onended = null;
            mascotVideo.onerror = null;
            mascotVideo.src = 'Video%20Garda%20Launch.mp4';
            mascotVideo.loop = true;
            mascotVideo.muted = true;
            mascotVideo.load();
            mascotVideo.play().catch(error => {
                console.error('Video Garda gagal diputar kembali:', error);
            });
            videoSoundToggle.textContent = 'AKTIFKAN SUARA';
            videoSoundToggle.setAttribute('aria-pressed', 'false');

            showLaunchMenu();
        };
    };

    mascotVideo.play().catch(error => {
        console.warn('Video hitung mundur gagal diputar, tampilkan menu peluncuran sebagai fallback:', error);
        showLaunchMenu();
    });
});

// --- LOGIKA TUTUP MODAL ---
closeModalBtn.addEventListener('click', function() {
    appModal.classList.remove('active');
    restoreBoomVolume();
    // Jangan kosongkan iframe setiap kali ditutup, karena itu membuat page kedua kali blank.
    // Biarkan iframe tetap tersimpan; saat dibuka lagi, src akan diisi ulang dengan URL yang sama.
});