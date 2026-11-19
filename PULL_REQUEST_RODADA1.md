# feat: Rodada 1 — HTML semântico e CSS responsivo

**Destino (base):** `develop`  
**Origem (compare):** `feat/rodada-1-html-css`

## Descrição

Primeira versão estática e responsiva da lista de tarefas TaskFlow, construída **sem JavaScript**.

## Alterações

- Criação do `<header>`, `<main>` e `<footer>` semânticos.
- Lista com duas tarefas fixas (uma pendente e uma concluída).
- CSS com Flexbox, Grid, tipografia responsiva e adaptação para telas pequenas.
- Status descritos por texto, progresso acessível e hierarquia de títulos.
- Documentação de papéis, comandos Git e checklist de revisão.

## Como validar

1. Abra `index.html` no navegador e veja a lista de duas tarefas.
2. Redimensione o navegador e confira o layout móvel.
3. Execute `python -m unittest discover -s tests -v` (opcional).
4. Confira que não há arquivos ou scripts JavaScript.

## Checklist

- [x] HTML semântico
- [x] 2 tarefas hardcoded
- [x] CSS Flexbox/Grid e tipografia responsiva
- [x] Nenhum JavaScript
- [ ] Revisão aprovada pelo Reviewer
- [ ] Merge na `develop` realizado pelo Release Manager

**Não realizar merge antes da revisão.**
