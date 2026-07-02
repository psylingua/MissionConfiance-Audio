let currentPage = 0;
let currentLang = 'fr';

const audio = document.getElementById('audioPlayer');
const pageCounter = document.getElementById('pageCounter');
const pageType = document.getElementById('pageType');
const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const contentBlocks = document.getElementById('contentBlocks');
const audioStatus = document.getElementById('audioStatus');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageDots = document.getElementById('pageDots');

function t(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[currentLang] || value.fr || '';
}

function audioPath(page, lang) {
  if (page.audio && page.audio[lang]) return page.audio[lang];
  return `audio/${lang}/${page.id}.mp3`;
}

function renderPage() {
  const page = pages[currentPage];
  pageCounter.textContent = `Page ${currentPage + 1} / ${pages.length}`;
  pageType.textContent = page.section || 'Mission Confiance';
  pageTitle.textContent = t(page.title);
  pageSubtitle.textContent = t(page.subtitle);

  contentBlocks.innerHTML = '';
  page.blocks.forEach((block) => {
    const div = document.createElement('article');
    div.className = `block ${currentLang}`;
    const label = block.label ? `<span class="block-label">${block.label}</span>` : '';
    div.innerHTML = `${label}<p>${t(block.text)}</p>`;
    contentBlocks.appendChild(div);
  });

  audio.src = audioPath(page, currentLang);
  audio.load();
  playBtn.textContent = '▶';
  progress.value = 0;
  audioStatus.textContent = 'Audio prêt';
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  renderDots();
}

function renderDots() {
  pageDots.innerHTML = '';
  pages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot ${i === currentPage ? 'active' : ''}`;
    dot.title = `Page ${i + 1}`;
    dot.addEventListener('click', () => {
      currentPage = i;
      renderPage();
    });
    pageDots.appendChild(dot);
  });
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {
      audioStatus.textContent = 'Ajoute le fichier MP3 correspondant pour activer cette piste.';
    });
  } else {
    audio.pause();
  }
}

playBtn.addEventListener('click', togglePlay);

audio.addEventListener('play', () => {
  playBtn.textContent = '⏸';
  audioStatus.textContent = 'Lecture en cours';
});

audio.addEventListener('pause', () => {
  playBtn.textContent = '▶';
  if (!audio.ended) audioStatus.textContent = 'Pause';
});

audio.addEventListener('ended', () => {
  playBtn.textContent = '▶';
  audioStatus.textContent = 'Terminé';
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    document.querySelectorAll('.lang-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderPage();
  });
});

document.querySelectorAll('.speed-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    audio.playbackRate = Number(btn.dataset.speed);
    document.querySelectorAll('.speed-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    renderPage();
  }
});

renderPage();
