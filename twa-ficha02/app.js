// app.js
import { writeFile } from 'node:fs/promises';
import { items } from './data.js';
import { byCategory, search, top, total, categories } from './catalog.js';

const [cmd, arg] = process.argv.slice(2);

const line = ({ id, name, price }) => `${id} · ${name} · ${price.toFixed(2)} €`;
const show = list => console.log(list.map(line).join('\n'));

if (cmd === undefined) {
  show(items);
} else if (cmd === 'search') {
  show(search(items, arg ?? ''));
} else if (cmd === 'top') {
  show(top(items, Number(arg) || 3));
} else if (cmd === 'report') {
  const report = {
    count: items.length,
    total: Math.round(total(items) * 100) / 100,
    categories: categories(items),
    top3: top(items, 3).map(({ name }) => name),
  };
  await writeFile('report.json', JSON.stringify(report, null, 2));
  console.log('report.json escrito');
} else {
  show(byCategory(items, cmd)); // qualquer outro argumento é tratado como categoria
}