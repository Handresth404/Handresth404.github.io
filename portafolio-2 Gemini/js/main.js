// ==========================================================================
// 1. ANIMACIÓN SUAVE DE TÍTULOS EN EL ENCABEZADO
// ==========================================================================
const rotatingPhrases = [
    'Desarrollo de Software',
    'Bases de Datos y Gestión',
    'Redes y Ciberseguridad',
    'Inteligencia Artificial'
];

const rotatingEl = document.getElementById('rotating-text');
let phraseIdx = 0;

if (rotatingEl) {
    setInterval(() => {
        rotatingEl.classList.add('fade-out');
        setTimeout(() => {
            phraseIdx = (phraseIdx + 1) % rotatingPhrases.length;
            rotatingEl.textContent = rotatingPhrases[phraseIdx];
            rotatingEl.classList.remove('fade-out');
        }, 350);
    }, 3200);
}

// ==========================================================================
// 2. APARICIÓN FLUIDA AL DESPLAZAR (SCROLL REVEAL)
// ==========================================================================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach((el) => revealObserver.observe(el));

// ==========================================================================
// 3. CARGA SEGURA DE FOTOGRAFÍA (assets/foto-christian.jpg)
// ==========================================================================
const profileImg = document.getElementById('profile-img');
const profileFallback = document.getElementById('profile-fallback');
const photoUpload = document.getElementById('photo-upload');

const candidatePaths = [
    'assets/foto-christian.jpg',
    './foto-christian.jpg',
    'assets/foto-christian.jpeg',
    'assets/foto-christian.png'
];
let pathIndex = 0;

if (profileImg) {
    profileImg.addEventListener('error', () => {
        pathIndex++;
        if (pathIndex < candidatePaths.length) {
            profileImg.src = candidatePaths[pathIndex];
        } else {
            profileImg.style.display = 'none';
            if (profileFallback) profileFallback.style.display = 'flex';
        }
    });
}

if (photoUpload) {
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            profileImg.src = ev.target.result;
            profileImg.style.display = 'block';
            profileFallback.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
}

// ==========================================================================
// 4. CAMBIO DE TEMA CLARO / OSCURO
// ==========================================================================
const themeToggle = document.getElementById('theme-toggle');
const rootHtml = document.documentElement;

function applyTheme(theme) {
    rootHtml.setAttribute('data-theme', theme);
    localStorage.setItem('christian-portfolio-theme', theme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

const savedTheme = localStorage.getItem('christian-portfolio-theme') || 'light';
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
    const next = rootHtml.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
});

// ==========================================================================
// 5. FILTRO DE ÁREAS DE ESPECIALIDAD
// ==========================================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const skillItems = document.querySelectorAll('.skill-item');

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        skillItems.forEach((item) => {
            const match = filter === 'all' || item.classList.contains(filter);
            item.style.display = match ? 'flex' : 'none';
        });
    });
});

// ==========================================================================
// 6. BARRA DE LECTURA, MODALES Y PORTAPAPELES
// ==========================================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const scrollProgress = document.getElementById('scroll-progress');
const btnTop = document.getElementById('btn-top');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && total > 0) {
        scrollProgress.style.width = `${(y / total) * 100}%`;
    }

    let current = '';
    sections.forEach((sec) => {
        if (y >= sec.offsetTop - 200) current = sec.getAttribute('id');
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    if (btnTop) {
        btnTop.style.display = y > 400 ? 'grid' : 'none';
    }
});

document.querySelectorAll('.open-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.getAttribute('data-modal'));
        if (modal) modal.style.display = 'grid';
    });
});

document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach((m) => (m.style.display = 'none'));
    }
});

let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function copyText(val, label) {
    navigator.clipboard.writeText(val).then(() => {
        showToast(`${label} copiado: ${val}`);
    });
}

document.getElementById('btn-copy-phone')?.addEventListener('click', () => {
    copyText('0995593657', 'Teléfono');
});

document.getElementById('btn-copy-email')?.addEventListener('click', () => {
    copyText('christianayala2828@hotmail.com', 'Correo');
});