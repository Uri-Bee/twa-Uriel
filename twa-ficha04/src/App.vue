<script setup>
import { ref, computed } from 'vue'
import { search, byCategory, sortByPrice, categories } from './catalog.js'
 
// Estado (um ref por campo do state da Ficha 03)
const status = ref('loading') // 'loading' | 'error' | 'ready'
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)
 
// Valores derivados
const visible = computed(() => {
  let list = search(items.value, query.value)
  if (category.value !== '') list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})
 
const cats = computed(() => categories(items.value))
 
const selected = computed(() =>
  items.value.find((i) => i.id === selectedId.value)
)
 
async function load() {
  status.value = 'loading'
  error.value = null
  try {
    const res = await fetch('/items.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    items.value = await res.json()
    status.value = 'ready'
  } catch (e) {
    error.value = e.message
    status.value = 'error'
  }
}
 
load()
</script>
 
<template>
  <main>
    <h1>Catalog</h1>
 
    <div class="controls">
      <input v-model="query" type="search" placeholder="Search name or tag…" />
      <select v-model="category">
        <option value="">All</option>
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>
      <button @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'">
        Price {{ sortDir === 'desc' ? '↓' : '↑' }}
      </button>
    </div>
 
    <p v-if="status === 'loading'">Loading…</p>
 
    <div v-else-if="status === 'error'" class="error">
      <p>Something went wrong: {{ error }}</p>
      <button @click="load()">Retry</button>
    </div>
 
    <template v-else>
      <p v-if="visible.length === 0">No results for “{{ query }}”</p>
      <p v-else>{{ visible.length }} item(s)</p>
 
      <ul>
        <li
          v-for="item in visible"
          :key="item.id"
          :class="{ selected: item.id === selectedId }"
          @click="selectedId = item.id"
        >
          {{ item.name }} — {{ item.price }} €
        </li>
      </ul>
 
      <section v-if="selected" class="detail">
        <h2>{{ selected.name }}</h2>
        <p>{{ selected.price }} € · {{ selected.category }}</p>
        <p>Tags: {{ selected.tags.join(', ') }}</p>
        <p>Author: {{ selected.author.name }} ({{ selected.author.country }})</p>
      </section>
    </template>
  </main>
</template>
 
<style scoped>
main {
  max-width: 560px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.controls input {
  flex: 1;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
li:hover {
  background: #f4f4f4;
}
.selected {
  background: #e6f0ff;
  font-weight: 600;
}
.detail {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.error {
  color: #b00020;
}
</style>