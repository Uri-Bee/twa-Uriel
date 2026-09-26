const res = await fetch(
  'https://api.github.com/repos/nodejs/node',
)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const repo = await res.json()
console.log(repo.name, repo.stargazers_count)