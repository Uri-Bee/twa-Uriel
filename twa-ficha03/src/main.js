// src/main.js
import './style.css';
import { search, byCategory, categories, sortByPrice } from './catalog.js';

// ---------- estado (a única "fonte de verdade") ----------
const state = {
  status: 'loading', error: null, items: [],
  query: '', category: '', sortDir: 'desc',
  selectedId: null,
};

// ---------- helpers ----------
const $ = sel => document.querySelector(sel);

const el = (tag, text, className) => {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
};

const message = text => el('li', text, 'message');

// ---------- dados derivados (puro: lê o state, não o altera) ----------
const visibleItems = () => {
  const list = state.category ? byCategory(state.items, state.category) : state.items;
  return sortByPrice(search(list, state.query), state.sortDir);
};

// ---------- peças do render ----------
const itemRow = item => {
  const li = el('li', `${item.name} — ${item.price.toFixed(2)} €`);
  if (item.id === state.selectedId) li.classList.add('selected');
  li.addEventListener('click', () => {
    state.selectedId = item.id;
    render();
  });
  return li;
};

const detailNodes = ({ name, price, tags, author }) => [
  el('h2', name),
  el('p', `Preço: ${price.toFixed(2)} €`),
  el('p', `Tags: ${tags.join(', ')}`),
  el('p', `Autor: ${author.name} (${author.country})`),
];

const renderControls = () => {
  const select = $('#category');
  select.replaceChildren(
    new Option('Todas as categorias', ''),
    ...categories(state.items).map(c => new Option(c, c))
  );
  select.value = state.category;

  $('#sort').textContent =
    state.sortDir === 'desc' ? 'Preço: mais caros primeiro ↓' : 'Preço: mais baratos primeiro ↑';
};

// ---------- render ----------
function render() {
  const listEl = $('#list');
  const detailEl = $('#detail');
  listEl.replaceChildren();
  detailEl.replaceChildren();

  if (state.status === 'loading') {
    listEl.append(message('A carregar…'));
    return;
  }
  if (state.status === 'error') {
    listEl.append(message(`Erro: ${state.error}`));
    return;
  }

  renderControls();

  const items = visibleItems();
  if (items.length === 0) listEl.append(message('Sem resultados.'));
  else listEl.append(...items.map(itemRow));

  const selected = state.items.find(i => i.id === state.selectedId);
  if (selected) detailEl.append(...detailNodes(selected));
}

// ---------- carregar dados ----------
async function load() {
  state.status = 'loading';
  state.error = null;
  render();
  try {
    const res = await fetch('/items.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.items = await res.json();
    state.status = 'ready';
  } catch (err) {
    state.status = 'error';
    state.error =
      err instanceof SyntaxError ? 'a resposta não é JSON válido (o ficheiro existe?)' : err.message;
  } finally {
    render();
  }
}

// ---------- eventos: só mudam o state, depois render() ----------
$('#search').addEventListener('input', e => {
  state.query = e.target.value;
  render();
});
$('#category').addEventListener('change', e => {
  state.category = e.target.value;
  render();
});
$('#sort').addEventListener('click', () => {
  state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
  render();
});

load();