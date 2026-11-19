# TaskFlow — Rodada 1 (HTML + CSS)

Primeira entrega da lista de tarefas **estática**, com estrutura visual e semântica correta. Não utiliza JavaScript nem backend nesta rodada.

## O que foi implementado

- Estrutura semântica com `<header>`, `<main>` e `<footer>`.
- Exatamente **2 tarefas fixas** dentro de uma lista `<ul>`, uma pendente e outra concluída.
- Layout com Flexbox e CSS Grid, espaçamentos consistentes e tipografia responsiva.
- Indicador de progresso estático (1 de 2 tarefas) e textos de status acessíveis.
- Layout adaptado para dispositivos móveis.

> **Importante:** adicionar novas tarefas, filtrar por status, salvar no `localStorage` e alternar entre modo claro/escuro são funcionalidades previstas para **rodadas posteriores**. A Rodada 1 exige **sem JavaScript ainda**.

## Tecnologias

- HTML5
- CSS3
- Git e GitHub
- Python 3 (somente para testes opcionais; não é necessário para abrir o site)

## Como executar

1. Extraia o projeto.
2. Abra **`index.html`** com duplo clique; não precisa instalar nada.
3. Para validar os requisitos (opcional), no terminal da pasta do projeto execute:

```bash
python -m unittest discover -s tests -v
```

## GitFlow da Rodada 1

As branches do repositório entregue são:

| Branch | Objetivo |
| --- | --- |
| `main` | Base estável, criada primeiro. |
| `develop` | Branch de integração das rodadas após revisão. |
| `feat/rodada-1-html-css` | Entrega da Rodada 1, aberta como PR para `develop`. |

O repositório já inclui commits reais: `Initial commit`, `feat: estrutura semantica com duas tarefas estaticas` e `style: aplica layout responsivo com flexbox e grid`.

### Comandos Git utilizados

| Comando | Para que serve |
| --- | --- |
| `git init` | Inicia um repositório Git. |
| `git status` | Mostra alterações e a branch atual. |
| `git add .` | Prepara arquivos para o commit. |
| `git commit -m "..."` | Registra uma versão no histórico. |
| `git branch -M main` | Nomeia a branch principal como `main`. |
| `git checkout -b develop` | Cria e acessa a branch de integração. |
| `git checkout -b feat/rodada-1-html-css` | Cria a branch de funcionalidade. |
| `git remote add origin URL` | Conecta o repositório local ao GitHub. |
| `git push -u origin BRANCH` | Publica uma branch no GitHub. |

### Papéis da equipe

**Dev:** implementa HTML e CSS da página, usando commits pequenos, descritivos e sem JavaScript.

**Reviewer:** revisa estrutura semântica, hierarquia de títulos, contraste, responsividade, status compreensíveis sem depender de cor e padrão dos commits. A checklist está em `REVIEWER_CHECKLIST.md`.

**Release Manager:** publica as branches, abre um PR da `feat/rodada-1-html-css` para `develop`, solicita revisão, corrige eventuais bloqueios com a equipe e **realiza o merge na `develop` apenas após aprovação**.

### Publicar no GitHub e abrir o PR

Crie um repositório remoto **vazio**, sem inicializar README ou licença (isso evita históricos divergentes). Os commits incluídos têm autoria genérica de demonstração; para futuros commits no seu nome, configure `git config user.name "Seu Nome"` e `git config user.email "seuemail@exemplo.com"`. Dentro da pasta extraída, execute:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
git push -u origin develop
git push -u origin feat/rodada-1-html-css
```

No GitHub, clique em **Compare & pull request** ou vá a **Pull requests > New pull request**, selecionando:

- **Base:** `develop`
- **Compare:** `feat/rodada-1-html-css`
- **Título:** `feat: Rodada 1 — HTML semântico e CSS responsivo`
- **Descrição:** copie o conteúdo de `PULL_REQUEST_RODADA1.md`.

O Release Manager deve solicitar revisão e, após aprovação, clicar em **Merge pull request**. Não faça merge antecipado: ele só deve ocorrer depois da revisão.

Para conferir:

```bash
git branch -a
git log --oneline --all --graph --decorate
git status
```

> **Estado da entrega local:** branches e commits estão presentes; **não existe remoto configurado e nenhum Pull Request foi criado no GitHub**. Essas ações dependem da URL e da autenticação do usuário.
