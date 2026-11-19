# Checklist do Reviewer — Rodada 1

- [ ] Há exatamente um `<header>`, um `<main>` e um `<footer>`.
- [ ] A página possui `lang="pt-BR"`, título e viewport apropriados.
- [ ] Existe apenas um `<h1>`; subtítulos seguem hierarquia lógica.
- [ ] A lista de tarefas usa `<ul>` com **exatamente 2 `<li>`**.
- [ ] As tarefas possuem texto claro de status (não apenas cor).
- [ ] O indicador de progresso é marcado semanticamente e possui descrição acessível.
- [ ] O CSS usa Flexbox/Grid, espaçamentos e tipografia responsiva.
- [ ] Testado em viewport de desktop e celular, sem rolagem horizontal.
- [ ] **Nenhum JavaScript** foi usado nesta rodada.
- [ ] Commits descrevem claramente o que foi feito; nenhum arquivo temporário foi incluído.
- [ ] O PR tem como **base `develop`** e como **compare `feat/rodada-1-html-css`**.

Comandos para revisão local:

```bash
python -m unittest discover -s tests -v
git log --oneline --all --graph --decorate
git diff develop...feat/rodada-1-html-css --stat
```
