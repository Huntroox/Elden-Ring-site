console.log("JS carregado!");

// ── INDEX / LOGIN ──
const enterButton = document.getElementById("enterButton");
if (enterButton) {
    enterButton.addEventListener("click", (event) => {
        event.preventDefault();
        enterButton.style.transform = "scale(0.95)";
        setTimeout(() => {
            enterButton.style.transform = "scale(1)";
        }, 150);
    });
}

function entrar() {
    window.location.href = "home.html";
}

// ── GALLERY MODAL ──
function abrirModal(src) {
    const modal = document.getElementById("modal");
    const img = document.getElementById("imgModal");
    if (modal && img) {
        modal.style.display = "flex";
        img.src = src;
    }
}

function fecharModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "none";
}

// ── BOSSES MODAL ──
const bossModal = document.getElementById('boss-modal');

if (bossModal) {
    const modalImg   = bossModal.querySelector('.boss-modal-img');
    const modalTitle = bossModal.querySelector('.boss-modal-title');
    const modalLore  = bossModal.querySelector('.boss-modal-lore');
    const backdrop   = bossModal.querySelector('.boss-modal-backdrop');
    const btnClose   = bossModal.querySelector('.boss-modal-close');

    function openModal(src, title, lore) {
        modalImg.src = src;
        modalImg.alt = title;
        modalTitle.textContent = title;
        modalLore.textContent = lore;
        bossModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        bossModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { modalImg.src = ''; }, 400);
    }

    document.querySelectorAll('.bosses-card').forEach(card => {
        card.addEventListener('click', () => {
            openModal(
                card.dataset.img,
                card.dataset.title,
                card.dataset.lore
            );
        });
    });

    backdrop.addEventListener('click', closeModal);
    btnClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

// ── MAP ──
const mapRegions = document.querySelectorAll('.map-region');

if (mapRegions.length > 0) {
    const mapImg   = document.getElementById('map-img');
    const mapTitle = document.getElementById('map-title');
    const mapDesc  = document.getElementById('map-desc');

    mapRegions.forEach(region => {
        region.addEventListener('click', () => {
            // remove active de todos
            mapRegions.forEach(r => r.classList.remove('active'));
            region.classList.add('active');

            // troca imagem com fade
            mapImg.classList.add('fade');
            setTimeout(() => {
                mapImg.src = region.dataset.img;
                mapImg.alt = region.dataset.title;
                mapTitle.textContent = region.dataset.title;
                mapDesc.textContent  = region.dataset.desc;
                mapImg.classList.remove('fade');
            }, 400);
        });
    });
}

// ── LORE TIMELINE ──
const timelineWrap = document.querySelector('.lore-timeline-wrap');

if (timelineWrap) {
    const events   = document.querySelectorAll('.lore-event');
    const dotsWrap = document.getElementById('lore-dots');
    const btnPrev  = document.getElementById('lore-prev');
    const btnNext  = document.getElementById('lore-next');
    let current    = 0;

    // cria dots
    events.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('lore-nav-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollTo(i));
        dotsWrap.appendChild(dot);
    });

    function updateDots(index) {
        document.querySelectorAll('.lore-nav-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    function scrollTo(index) {
        current = Math.max(0, Math.min(index, events.length - 1));
        const event = events[current];
        const wrapRect = timelineWrap.getBoundingClientRect();
        const eventRect = event.getBoundingClientRect();
        const offset = eventRect.left - wrapRect.left + timelineWrap.scrollLeft
                       - (wrapRect.width / 2) + (event.offsetWidth / 2);
        timelineWrap.scrollTo({ left: offset, behavior: 'smooth' });
        updateDots(current);
    }

    btnPrev.addEventListener('click', () => scrollTo(current - 1));
    btnNext.addEventListener('click', () => scrollTo(current + 1));

    // arrastar com mouse
    let isDown = false;
    let startX, scrollLeft;

    timelineWrap.addEventListener('mousedown', e => {
        isDown = true;
        startX = e.pageX - timelineWrap.offsetLeft;
        scrollLeft = timelineWrap.scrollLeft;
    });

    timelineWrap.addEventListener('mouseleave', () => isDown = false);
    timelineWrap.addEventListener('mouseup', () => isDown = false);

    timelineWrap.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - timelineWrap.offsetLeft;
        timelineWrap.scrollLeft = scrollLeft - (x - startX);
    });

    // atualiza dot ao rolar
    timelineWrap.addEventListener('scroll', () => {
        const wrapCenter = timelineWrap.scrollLeft + timelineWrap.offsetWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        events.forEach((ev, i) => {
            const evCenter = ev.offsetLeft + ev.offsetWidth / 2;
            const dist = Math.abs(evCenter - wrapCenter);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        current = closest;
        updateDots(current);
    });
}

// ── CLASSES ──
const classCards = document.querySelectorAll('.class-card');

if (classCards.length > 0) {
    const attrs = ['vigor','mente','resistencia','forca','destreza','inteligencia','fe','arcano'];
    const labels = ['VIG','MEN','RES','FOR','DES','INT','FÉ','ARC'];

    classCards.forEach(card => {
        const back   = card.querySelector('.class-card-back');
        const stats  = back.querySelector('.class-stats');
        const estilo = back.querySelector('.class-back-estilo');
        const dica   = back.querySelector('.class-back-dica');

        // preenche estilo e dica
        estilo.textContent = card.dataset.estilo;
        dica.textContent   = '💡 ' + card.dataset.dica;

        // preenche stats
        attrs.forEach((attr, i) => {
            const div = document.createElement('div');
            div.classList.add('class-stat');
            div.innerHTML = `
                <span class="class-stat-name">${labels[i]}</span>
                <span class="class-stat-val">${card.dataset[attr]}</span>
            `;
            stats.appendChild(div);
        });

        // flip ao clicar
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}