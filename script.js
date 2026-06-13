document.addEventListener('DOMContentLoaded', () => {
  // 1. Mode Gelap (Dark Mode) Toggle
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // 2. Toggle Ukuran Teks (Aksesibilitas)
  const textSizeToggle = document.getElementById('textSizeToggle');
  let isLargeText = localStorage.getItem('largeText') === 'true';

  // Terapkan ukuran teks tersimpan saat halaman dimuat
  if (isLargeText) {
    document.body.style.fontSize = '18px';
  }

  if (textSizeToggle) {
    textSizeToggle.addEventListener('click', () => {
      isLargeText = !isLargeText;
      document.body.style.fontSize = isLargeText ? '18px' : '16px';
      localStorage.setItem('largeText', isLargeText);
    });
  }

  // 3. Scroll Animation (Intersection Observer)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // 4. Fitur Tasbih Digital
  const tasbihBtn = document.getElementById('tasbihBtn');
  const tasbihCount = document.getElementById('tasbihCount');
  const resetTasbih = document.getElementById('resetTasbih');

  if (tasbihBtn && tasbihCount) {
    let count = parseInt(localStorage.getItem('tasbih'), 10) || 0;
    tasbihCount.textContent = count;

    tasbihBtn.addEventListener('click', () => {
      count++;
      tasbihCount.textContent = count;
      localStorage.setItem('tasbih', count);
    });

    if (resetTasbih) {
      resetTasbih.addEventListener('click', () => {
        count = 0;
        tasbihCount.textContent = count;
        localStorage.setItem('tasbih', 0);
      });
    }
  }

  // 5. Pencarian Global (Sederhana)
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  // Dummy data indeks pencarian website
  const searchIndex = [
    { title: 'Tuntunan Shalat', url: 'tuntunanshalat.html', keywords: 'shalat takbir rukuk sujud' },
    { title: 'Dzikir Harian', url: 'dzikir.html', keywords: 'dzikir pagi petang tasbih' },
    { title: 'Al-Quran', url: 'alquran.html', keywords: 'alquran ayat terjemahan' }
  ];

  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.style.display = 'flex';
      searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
      searchModal.style.display = 'none';
    });

    // Tutup modal saat klik di luar konten
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.style.display = 'none';
      }
    });

    // Tutup modal dengan tombol Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.style.display === 'flex') {
        searchModal.style.display = 'none';
      }
    });

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (term.length > 2) {
        const hits = searchIndex.filter(item =>
          item.keywords.includes(term) || item.title.toLowerCase().includes(term)
        );

        if (hits.length === 0) {
          searchResults.innerHTML = '<li style="opacity: 0.7;">Tidak ada hasil ditemukan</li>';
        } else {
          hits.forEach(hit => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${hit.url}" style="color: var(--primary-color); text-decoration: none;">${hit.title}</a>`;
            searchResults.appendChild(li);
          });
        }
      }
    });
  }

  // 6. Jurnal Shalat Harian (Checkbox persistence)
  const prayerCheckboxes = document.querySelectorAll('input[type="checkbox"][id]');
  const prayerIds = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  prayerIds.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      // Muat status tersimpan
      const savedState = localStorage.getItem(`prayer_${id}`);
      if (savedState === 'true') {
        checkbox.checked = true;
      }

      // Simpan perubahan
      checkbox.addEventListener('change', () => {
        localStorage.setItem(`prayer_${id}`, checkbox.checked);
      });
    }
  });

  // Reset jurnal shalat setiap hari (opsional - cek tanggal)
  const lastResetDate = localStorage.getItem('lastPrayerReset');
  const today = new Date().toDateString();

  if (lastResetDate !== today) {
    prayerIds.forEach(id => {
      localStorage.removeItem(`prayer_${id}`);
    });
    localStorage.setItem('lastPrayerReset', today);
    // Uncheck semua checkbox
    prayerCheckboxes.forEach(cb => {
      cb.checked = false;
    });
  }
});
