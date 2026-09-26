const url = 'https://hnrss.org/frontpage' // feed RSS público de exemplo (Hacker News)

const res = await fetch(url)

if (!res.ok) throw new Error(`HTTP ${res.status}`)

const xml = await res.text()

// Extrai todos os conteúdos entre <title> e </title>
const titleMatches = [...xml.matchAll(/<title>(.*?)<\/title>/g)]

// O primeiro <title> costuma ser o título do próprio feed (ex: "Hacker News"),
// por isso ignoramos o índice 0 e pegamos os 3 seguintes (os artigos)
const titles = titleMatches.slice(1, 4).map(match => match[1])

console.log('Três primeiros títulos:')
titles.forEach((title, i) => console.log(`${i + 1}. ${title}`))