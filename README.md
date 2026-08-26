# Site pessoal — Gustavo Oliveira

Portfólio e blog de um desenvolvedor backend. Construído com [Astro](https://astro.build),
publicado no GitHub Pages, com os projetos puxados automaticamente da API do GitHub.

**No ar:** https://gustavo-oliveira7.github.io

---

## Rodando na sua máquina

O projeto exige **Node 22+** (o arquivo `.nvmrc` já aponta a versão certa).

```bash
nvm use          # troca para o Node 22 automaticamente
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:4321
```

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local com recarga automática |
| `npm run build` | Gera o site em `dist/` |
| `npm run preview` | Serve o `dist/` para conferir antes de publicar |
| `npm run check` | Verifica erros de tipo nas páginas |

---

## Publicando um artigo

1. Crie um arquivo `.md` em `src/content/artigos/`.
   O nome do arquivo vira a URL — `cache-distribuido.md` → `/artigos/cache-distribuido`.

2. Comece com o cabeçalho (frontmatter):

```markdown
---
titulo: "Título do artigo"
resumo: "Uma ou duas frases. Aparece na listagem e no compartilhamento."
data: 2026-09-01
tags: ["Go", "Performance"]
rascunho: false
---

Texto do artigo em Markdown. Blocos de código já saem com
destaque de sintaxe para Java, Go, SQL, bash e outras.
```

3. Faça commit e push. **O site publica sozinho em cerca de 1 minuto.**

```bash
git add . && git commit -m "artigo: cache distribuído" && git push
```

Enquanto o texto não estiver pronto, use `rascunho: true` — o arquivo fica no repositório
mas não aparece no site publicado.

---

## Como os dados do GitHub se atualizam

Os repositórios **não** são escritos à mão em lugar nenhum. Existem três camadas:

| Camada | Quando roda | O que atualiza |
| --- | --- | --- |
| **Build** | A cada publicação | Tudo: repos novos, descrições, linguagens, estrelas |
| **Cron do Actions** | A cada 6 horas | Reconstrói o site sem você fazer nada |
| **Navegador** | Quando alguém abre `/projetos` | Estrelas, forks e data do último push, ao vivo |

Ou seja: **um repositório novo aparece no site em no máximo 6 horas, sem você tocar em nada.**
Se quiser que apareça agora:

```bash
gh workflow run deploy.yml
```

Para ajustar a frequência, edite o `cron` em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Sobre o LinkedIn

**Não existe forma automática de puxar dados do LinkedIn.** A API pública deles foi
descontinuada para perfis pessoais, e raspar o site viola os Termos de Uso — o risco real é a
conta ser restringida. Qualquer serviço que prometa isso está fazendo scraping em nome de terceiros.

Então o site faz duas coisas:

- **Linka** o perfil no cabeçalho, rodapé, home e em cada artigo;
- **Espelha** a experiência em [`src/data/experiencia.ts`](src/data/experiencia.ts), mantido à mão.

Quando você atualizar o LinkedIn, atualize esse arquivo e faça push. São dois minutos, e a
vantagem é que o texto do site pode ser mais direto que o do LinkedIn.

Cada artigo também tem um botão **Compartilhar no LinkedIn**, que é o caminho que realmente
gera visita: você publica aqui, divulga lá.

---

## O que editar, e onde

| Quero mudar... | Arquivo |
| --- | --- |
| Nome, bio, links, e-mail | [`src/site.config.ts`](src/site.config.ts) |
| Quais projetos ficam em destaque | `projetosDestaque` no mesmo arquivo |
| Esconder um repositório do site | `projetosOcultos` no mesmo arquivo |
| Minha stack / tecnologias | `stack` no mesmo arquivo |
| Experiência, formação, certificados | [`src/data/experiencia.ts`](src/data/experiencia.ts) |
| Cores, fontes, espaçamento | `:root` em [`src/styles/global.css`](src/styles/global.css) |
| Itens do menu | `navegacao` em `src/site.config.ts` |

---

## Estrutura

```
src/
├── site.config.ts        # ponto único de configuração
├── content/artigos/      # os artigos, em Markdown
├── data/experiencia.ts   # experiência profissional (espelho do LinkedIn)
├── lib/
│   ├── github.ts         # integração com a API do GitHub
│   └── texto.ts          # tempo de leitura, datas, cores de linguagem
├── layouts/Base.astro    # <head>, SEO, tema claro/escuro
├── components/           # cabeçalho, rodapé, cards, ícones
├── pages/
│   ├── index.astro       # home
│   ├── projetos.astro    # repositórios, com filtro por linguagem
│   ├── artigos/          # listagem + página de cada artigo
│   ├── sobre.astro       # trajetória e stack
│   ├── rss.xml.ts        # feed RSS
│   └── 404.astro
└── styles/global.css     # design system
```

---

## Domínio próprio (opcional)

1. Crie `public/CNAME` com o domínio dentro (ex.: `gustavooliveira.dev`).
2. Troque `site` em [`astro.config.mjs`](astro.config.mjs) para a nova URL.
3. Aponte o DNS do domínio para o GitHub Pages e ative o domínio em **Settings → Pages**.
