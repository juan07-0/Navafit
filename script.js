const appState = {
  activeTab: 'inicio',
  garments: [
    { id: 'garment-1', name: 'Uniforme Escolar Inteligente', category: 'Escolar', icon: 'fa-vest-patches', size: 'M', active: true, hr: 72, hydrationLevel: 88, activityLevel: 'Moderada' },
    { id: 'garment-2', name: 'Chaqueta Inteligente', category: 'Chaqueta', icon: 'fa-user-ninja', size: 'M', active: false, hr: 68, hydrationLevel: 92, activityLevel: 'Ligera' }
  ],
  contacts: [{ id: 1, name: 'Mamá (Elena R.)', relation: 'Acudiente Principal', phone: '+57 315 987 6543' }]
};

let mainChartInstance = null;

window.addEventListener('DOMContentLoaded', () => {
  renderGarmentsCarousel();
  renderRegisteredGarmentsList();
  renderDashboardGrid();
  renderContactsList();
  initChart();
  initCustomColorPicker();

  // Restaurar color personalizado guardado
  const savedColor = localStorage.getItem('nava_custom_color');
  if (savedColor) {
    const colorPicker = document.getElementById('customColorPicker');
    const previewBox = document.getElementById('colorPreviewBox');
    if (colorPicker) colorPicker.value = savedColor;
    if (previewBox) previewBox.style.backgroundColor = savedColor;
    applyHarmonicPalette(savedColor);
  }
});

function showToast(message) {
  const toast = document.getElementById('app-toast');
  const text = document.getElementById('toast-message');
  if (!toast || !text) return;
  text.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function switchTab(tabId) {
  appState.activeTab = tabId;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.className = "nav-btn flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition");
  const activeNavBtn = document.getElementById(`nav-btn-${tabId}`);
  if (activeNavBtn) activeNavBtn.className = "nav-btn flex flex-col items-center gap-1 transition font-bold";
  document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
  const targetView = document.getElementById(`tab-${tabId}`);
  if (targetView) targetView.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGarmentsCarousel() {
  const container = document.getElementById('garments-carousel');
  if (!container) return;
  container.innerHTML = appState.garments.map(g => `
    <div class="flex-shrink-0 w-72 p-4 rounded-3xl border-2 ${g.active ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-slate-900/80'} space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="font-bold text-xs text-white">${g.name}</h4>
        ${g.active ? '<span class="px-2 py-0.5 rounded-full bg-brand-500 text-slate-950 font-black text-[9px]">EN USO</span>' : ''}
      </div>
    </div>
  `).join('');
}

function renderRegisteredGarmentsList() {
  const container = document.getElementById('registered-garments-list');
  if (!container) return;
  container.innerHTML = appState.garments.map(g => `
    <div class="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <h4 class="font-bold text-sm text-white">${g.name}</h4>
    </div>
  `).join('');
}

function renderDashboardGrid() {
  const grid = document.getElementById('dashboard-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="glass-card rounded-3xl p-5 space-y-3">
      <h4 class="font-bold text-white text-sm">Signos Vitales</h4>
      <p class="text-xs text-slate-300">Pulso cardíaco y biometría local.</p>
    </div>
  `;
}

function renderContactsList() {
  const container = document.getElementById('emergency-contacts-list');
  if (!container) return;
  container.innerHTML = appState.contacts.map(c => `
    <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white">👤 ${c.name} - ${c.phone}</div>
  `).join('');
}

function initChart() {
  const ctx = document.getElementById('mainTrendsChart');
  if (!ctx) return;
  mainChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'],
      datasets: [{ label: 'Frecuencia Cardíaca', data: [68, 75, 110, 72], borderColor: '#14b8a6', borderWidth: 2, tension: 0.3 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function initCustomColorPicker() {
  const colorPicker = document.getElementById('customColorPicker');
  const previewBox = document.getElementById('colorPreviewBox');
  if (colorPicker && previewBox) {
    colorPicker.addEventListener('input', (e) => {
      previewBox.style.backgroundColor = e.target.value;
    });
  }
}

function saveAndApplyColor() {
  const colorPicker = document.getElementById('customColorPicker');
  if (!colorPicker) return;
  applyHarmonicPalette(colorPicker.value);
  showToast(`🎨 ¡Fondo y paleta aplicados correctamente!`);
}

function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  const num = parseInt(cleanHex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function applyHarmonicPalette(primaryHex) {
  const rgb = hexToRgb(primaryHex);
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const contrastingText = yiq >= 130 ? '#0f172a' : '#ffffff';

  // Cambiar el color de fondo general de la página de forma profunda y elegante
  const customBodyBg = `rgba(${Math.floor(rgb.r * 0.15)}, ${Math.floor(rgb.g * 0.15)}, ${Math.floor(rgb.b * 0.15)}, 1)`;
  const customCardBg = `rgba(${Math.floor(rgb.r * 0.22)}, ${Math.floor(rgb.g * 0.22)}, ${Math.floor(rgb.b * 0.22)}, 0.85)`;

  document.body.style.backgroundColor = customBodyBg;

  // Aplicar fondo a las tarjetas (Glass Cards)
  document.querySelectorAll('.glass-card').forEach(el => {
    el.style.backgroundColor = customCardBg;
    el.style.borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`;
  });

  // Aplicar color principal a botones y elementos activos
  const btnSave = document.getElementById('btnSaveColor');
  if (btnSave) {
    btnSave.style.backgroundColor = primaryHex;
    btnSave.style.color = contrastingText;
  }

  document.querySelectorAll('.bg-brand-500').forEach(el => {
    el.style.backgroundColor = primaryHex;
    el.style.color = contrastingText;
  });

  document.querySelectorAll('.text-brand-400, .text-brand-500, .text-brand-600').forEach(el => {
    el.style.color = primaryHex;
  });

  document.querySelectorAll('.border-brand-500').forEach(el => {
    el.style.borderColor = primaryHex;
  });

  localStorage.setItem('nava_custom_color', primaryHex);
}

function openSOSModal() { document.getElementById('sos-modal').classList.remove('hidden'); }
function closeSOSModal() { document.getElementById('sos-modal').classList.add('hidden'); }
function sendEmergencyAlert() { closeSOSModal(); alert("✅ Alerta de emergencia enviada."); }
function calibrateCurrentPod() { showToast("🔄 Calibrando sensores..."); }
function syncSensorData() { showToast("📡 Pod sincronizado."); }
function toggleDashboardEditMode() { showToast("Modo edición de panel"); }