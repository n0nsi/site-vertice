# VÉRTICE — site demonstrativo

Projeto independente e estático, preparado para Cloudflare Workers Static Assets.

## Status

- Empresa fictícia / demo comercial
- `noindex,nofollow` no HTML
- `X-Robots-Tag: noindex` em previews `workers.dev`
- Worker previsto: `vertice-demo`
- Sem telefone, e-mail, endereço ou Instagram reais

## Arquitetura

```text
index.html
assets/css/style.css
assets/js/base.js
assets/img/
scripts/build.mjs
scripts/validate.mjs
scripts/build.test.mjs
public/_headers
package.json
wrangler.jsonc
```

A arquitetura segue o padrão simples validado nos projetos Infra&Wifi/PegadaPro: HTML + CSS + JS puro, com o pipeline `dist/`/allowlist da branch de hardening da Infra&Wifi.

## Validar

```bash
node scripts/build.mjs
node scripts/validate.mjs
node --test scripts/build.test.mjs
```

Com PNPM/Wrangler instalados:

```bash
pnpm install
pnpm run check:deploy
```

## Publicar futuramente

Não faça deploy até revisar os dados e assets. Para um cliente real:

1. Troque textos e identidade.
2. Substitua todas as imagens demonstrativas de `assets/img/`.
3. Configure contatos reais.
4. Remova `noindex,nofollow`.
5. Adicione canonical e Open Graph definitivos.
6. Altere `name` do `wrangler.jsonc` para o Worker definitivo.
7. Rode build/test/dry-run.
8. Só então publique e conecte o domínio do cliente.

## Criar um repositório Git separado

```bash
git init
git add .
git commit -m "feat: initial static site"
git branch -M main
git remote add origin git@github.com:n0nsi/NOME-DO-REPO.git
git push -u origin main
```

> As imagens atuais são placeholders visuais locais criados exclusivamente para demonstração. Substitua por fotos reais/licenciadas antes de usar como site de cliente.
