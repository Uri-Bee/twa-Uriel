twa-ficha04 — O catálogo em Vue 
---------------------------------------------------
Como correr:
npm install && npm run dev
node check.js   # em silêncio = tudo certo

O que está feito

----------------------------------------------------
Projeto Vite (template vue), catalog.js, items.json e check.js vindos da Ficha 03 (sem alterações).
src/App.vue com <script setup>, <template> e <style scoped>.
Estado em ref: status, error, items, query, category, sortDir, selectedId.
Derivados em computed: visible, cats, selected.
Template: pesquisa (v-model), <select> com "All" + v-for, botão de ordenação (↓/↑), estados loading/error/ready com v-if/v-else-if/v-else, botão Retry, lista com v-for + :key="item.id", classe selected e secção de detalhe.
Erro testado com URL a devolver 404 e com caminho errado (o catch apanha o Unexpected token '<').

----------------------------------------------
---------------------------------
---------------------------------------------------------------------------------------------------------------
Declaração de IA:
Usei IA (Claude) em casa para gerar a primeira versão do App.vue e rascunhar este README. Li e revi o código e as respostas abaixo.

--------------------------------------------------------------------------------------------------------------------------------------------------
Reflexão
-------------------------------
1- Do main.js da Ficha 03 saiu o objeto state (passou a refs), a função render() (é agora o <template>, que o Vue volta a executar quando o estado muda) e os handlers com addEventListener (passaram a v-model e @click, que alteram o estado diretamente).

-----------------------------------------------------------------------------
2- No script um ref é um objeto { value }, por isso lê-se e escreve-se com .value. No template o Vue faz esse "desembrulhar" automaticamente para refs de topo, logo escreve-se só items.

-------------------------------------------------------------------------------
3- visible depende de items, query, category e sortDir. Como computed recalcula-se sozinho sempre que algum muda. Com um ref atualizado em cada handler, bastava esquecer-me de um handler (ou do load()) para a lista ficar desatualizada em relação ao estado.

-----------------------------------------------------------------------------------------------------
4- O :key permite ao Vue identificar cada elemento e reutilizar/mover o DOM certo em vez de o reaproveitar à força. Com o índice como chave numa lista que reordena, a chave deixa de acompanhar o item: o Vue reaproveita nós errados e pode misturar estado associado a eles (focos, inputs, animações).
