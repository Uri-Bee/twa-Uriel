import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import {
  byCategory, search, total, top, categories, withDiscount, sortByPrice,
} from './src/catalog.js';

const items = JSON.parse(
  await readFile(new URL('./public/items.json', import.meta.url), 'utf8')
);

// sortByPrice 
const asc = sortByPrice(items, 'asc');
assert.deepEqual(asc.map(i => i.price), [9.9, 14.9, 15.95, 18, 22.5, 27, 32.5, 41]);
assert.equal(sortByPrice(items, 'desc')[0].price, 41);
assert.equal(items[0].id, 1);
assert.notEqual(asc, items);