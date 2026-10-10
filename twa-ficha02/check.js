// check.js
import assert from 'node:assert/strict';
import { items } from './data.js';
import {
  byCategory, search, total, top, categories, withDiscount,
} from './catalog.js';

// byCategory
assert.equal(byCategory(items, 'comic').length, 2);
assert.ok(byCategory(items, 'comic').every(i => i.category === 'comic'));

// search (sem distinguir maiúsculas, por nome ou por tag)
assert.equal(search(items, 'CLEAN')[0].name, 'Clean Code');
assert.equal(search(items, 'dev').length, 2);

// total (arredondado para evitar erros de vírgula flutuante)
assert.equal(Math.round(total(items) * 100), 18175);
assert.equal(total([]), 0);

// top (ordem desc., sem mexer no original)
assert.deepEqual(
  top(items, 3).map(i => i.name),
  ['The Pragmatic Programmer', 'Clean Code', 'Watchmen']
);
assert.equal(items[0].id, 1);

// categories (únicas e ordenadas)
assert.deepEqual(categories(items), ['audiobook', 'book', 'comic']);

// withDiscount (novos objetos, originais intactos)
const discounted = withDiscount(items, 20);
assert.equal(discounted[0].price, 12.76);
assert.equal(items[0].price, 15.95);
assert.notEqual(discounted[0], items[0]);