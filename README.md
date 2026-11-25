# Gerenciador de Tarefas

Guia rápido dos principais comandos de **Git**, **GitHub** e **GitFlow** usados neste projeto.

---

## 1. Clonar e iniciar repositórios

```bash
git clone <url-do-repositorio>         # clona um repositório do GitHub
git init                               # cria um repositório local novo
git remote add origin <url>            # conecta o repositório local ao GitHub
git remote -v                          # lista os remotos configurados
```

## 2. Ciclo básico: status, add e commit

```bash
git status                             # mostra o estado dos arquivos
git add <arquivo>                      # adiciona um arquivo à área de stage
git add .                              # adiciona todas as alterações
git commit -m "feat: mensagem do commit"
```

## 3. Enviar e receber alterações

```bash
git push origin <branch>               # envia commits para o GitHub
git push -u origin <branch>            # primeiro push de uma branch nova
git pull origin <branch>               # baixa e mescla alterações do remoto
git fetch                              # baixa alterações sem mesclar
```

## 4. Branches

```bash
git branch                             # lista branches locais
git branch -a                          # lista locais e remotas
git branch <nome>                      # cria uma branch
git checkout <nome>                    # troca de branch
git checkout -b <nome>                 # cria e já troca para a branch
git switch <nome>                      # alternativa moderna ao checkout
git branch -d <nome>                   # apaga a branch local
git push origin --delete <nome>        # apaga a branch remota
```

## 5. Corrigindo erros

```bash
git commit --amend -m "nova mensagem"  # corrige o último commit (mensagem/arquivos)
git restore <arquivo>                  # descarta alterações não commitadas
git restore --staged <arquivo>         # tira um arquivo do stage
git reset --soft HEAD~1                # desfaz o último commit, mantém alterações no stage
git reset --hard HEAD~1                # desfaz o último commit e apaga as alterações
git revert <hash>                      # cria um commit que desfaz outro
git stash                              # guarda alterações temporariamente
git stash pop                          # recupera as alterações guardadas
```

## 6. GitFlow

Estrutura de branches:

| Branch      | Função                                               |
|-------------|------------------------------------------------------|
| `main`      | Código estável, em produção                          |
| `develop`   | Integração das funcionalidades em desenvolvimento    |
| `feature/*` | Novas funcionalidades (saem e voltam para `develop`) |
| `release/*` | Preparação de uma nova versão                        |
| `hotfix/*`  | Correções urgentes em produção (saem da `main`)      |

As integrações entre branches são feitas por **Pull Request** no GitHub.

```bash
# Nova funcionalidade
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
# ... trabalha e faz commits ...
git push -u origin feature/nome-da-feature
# abre um Pull Request de feature/nome-da-feature para develop

# Nova release
git checkout -b release/1.0.0 develop
# ... ajustes finais ...
git push -u origin release/1.0.0
# abre um Pull Request de release/1.0.0 para main

# Hotfix
git checkout -b hotfix/correcao-urgente main
# ... corrige ...
git push -u origin hotfix/correcao-urgente
# abre um Pull Request de hotfix/correcao-urgente para main
```

## 7. Pull Requests (GitHub)

1. Envie a branch: `git push -u origin feature/nome-da-feature`
2. No GitHub, clique em **Compare & pull request**.
3. Escolha a branch de destino e descreva as mudanças.
4. Aguarde a revisão e faça o merge pela interface do GitHub.
5. Atualize sua branch local: `git checkout develop && git pull origin develop`

## 8. Padrão de mensagens de commit

Seguimos o padrão usado no histórico do repositório:

```
Initial commit
feat: estrutura semantica com duas tarefas estaticas
style: aplica layout responsivo com flexbox e grid
docs: documenta revisao e entrega da rodada 1
chore: remove documentacao e testes
Fix
```

| Prefixo  | Uso                                            |
|----------|------------------------------------------------|
| `feat:`  | Nova funcionalidade                            |
| `style:` | Ajustes visuais e de layout                    |
| `docs:`  | Documentação                                   |
| `chore:` | Tarefas de manutenção                          |
| `Fix`    | Correções pontuais                             |
