const API_BASE_URL = 'http://localhost:4000';

const MODE_CONFIG = {
  beginner: {
    label: 'Modo Iniciante — dicas simples e encorajadoras',
    icon: 'school',
    responseLabel: 'Iniciante',
  },
  advanced: {
    label: 'Modo Avançado — estratégias competitivas',
    icon: 'military_tech',
    responseLabel: 'Avançado',
  },
  trustable: {
    label: 'Modo Confiável — 100% infalível (kkk)',
    icon: 'verified',
    responseLabel: 'Confiável',
  },
};

let selectedMode = 'beginner';
let selectedModel = 'gpt-4.1-mini';

const tabs = document.querySelectorAll('.tab');
const modeBadge = document.getElementById('modeBadge');
const modeBadgeText = document.getElementById('modeBadgeText');
const sendBtn = document.getElementById('sendBtn');
const gameInput = document.getElementById('gameInput');
const messageInput = document.getElementById('messageInput');
const responseCard = document.getElementById('responseCard');
const loadingCard = document.getElementById('loadingCard');
const errorCard = document.getElementById('errorCard');
const responseBody = document.getElementById('responseBody');
const responseMode = document.getElementById('responseMode');
const responseIcon = document.getElementById('responseIcon');
const errorText = document.getElementById('errorText');
const modelBtn = document.getElementById('modelBtn');
const modelBtnLabel = document.getElementById('modelBtnLabel');
const modelDropdown = document.getElementById('modelDropdown');
const modelOptions = document.querySelectorAll('.model-option');

function setModel(model) {
  selectedModel = model;
  modelBtnLabel.textContent = model;

  modelOptions.forEach((opt) => {
    opt.classList.toggle('model-option--active', opt.dataset.model === model);
  });

  closeModelDropdown();
}

function closeModelDropdown() {
  modelDropdown.hidden = true;
  modelBtn.setAttribute('aria-expanded', 'false');
}

modelBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = !modelDropdown.hidden;
  modelDropdown.hidden = isOpen;
  modelBtn.setAttribute('aria-expanded', String(!isOpen));
});

modelOptions.forEach((opt) => {
  opt.addEventListener('click', () => setModel(opt.dataset.model));
});

document.addEventListener('click', closeModelDropdown);

function setMode(mode) {
  selectedMode = mode;
  const config = MODE_CONFIG[mode];

  tabs.forEach((tab) => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle('tab--active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  modeBadgeText.textContent = config.label;
  modeBadge.querySelector('.material-icons-round').textContent = config.icon;

  document.body.className = `mode-${mode}`;
  hideCards();
}

function hideCards() {
  responseCard.hidden = true;
  loadingCard.hidden = true;
  errorCard.hidden = true;
}

function showLoading() {
  hideCards();
  loadingCard.hidden = false;
  sendBtn.disabled = true;
}

function showResponse(text) {
  const config = MODE_CONFIG[selectedMode];
  responseMode.textContent = config.responseLabel;
  responseIcon.textContent = config.icon;
  responseBody.textContent = text;

  hideCards();
  responseCard.hidden = false;
  sendBtn.disabled = false;
}

function showError(message) {
  errorText.textContent = message;
  hideCards();
  errorCard.hidden = false;
  sendBtn.disabled = false;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  const game = gameInput.value.trim();

  if (!message) {
    messageInput.focus();
    return;
  }

  showLoading();

  const payload = { message, model: selectedModel };
  if (game) payload.game = game;

  try {
    const response = await fetch(`${API_BASE_URL}/${selectedMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Erro ${response.status}`);
    }

    const data = await response.json();
    showResponse(data.response);
  } catch (error) {
    if (error.name === 'TypeError') {
      showError('Não foi possível conectar à API. Verifique se o servidor está rodando em localhost:8000.');
    } else {
      showError(error.message);
    }
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    sendMessage();
  }
});

setMode('beginner');
