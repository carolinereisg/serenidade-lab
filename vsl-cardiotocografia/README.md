# Ecossistema VSL — Cardiotocografia: padrões que não podem ser perdidos

Funil modelado no ecossistema da aula de endometriose da Dra. Karina Giassi, no layout **Serenidade Lab** (roxo `#2D0A4E`, laranja `#F5630A`, Playfair Display + DM Sans + DM Mono). Ticket: **R$ 147**.

## Fluxo

```
Stories / Reels (01)  →  pagina-vsl.html (VSL 02 + roteiro/estrutura)
                      →  captura.html (nome, e-mail, WhatsApp)
                      →  pagina-vendas.html (ancoragem de preço)
                      →  checkout (link externo)
                      →  aula / webinário (04)
```

## Arquivos

| # | Arquivo | O que é |
|---|---|---|
| 1 | `01-roteiro-video-instagram.md` | Roteiro do vídeo de convite (~45 s, modelado nos primeiros 48 s), legenda e sequência de stories |
| 2 | `02-roteiro-vsl.md` | Roteiro da VSL (~5 min), bloco a bloco, com o mapa modelo → sua versão |
| 3 | `pagina-vsl.html` | Página da VSL (vídeo + estrutura da aula + professora + oferta + FAQ) |
| 4 | `captura.html` | Coleta de nome, e-mail e telefone antes da página de vendas |
| 5 | `pagina-vendas.html` | Página de vendas final, simples, com ancoragem de preço |
| 6 | `04-webinario-cardiotocografia.pptx` | Aula em 26 slides, com texto nos slides e comentários nas **notas do apresentador** |
| — | `05-fontes-a-verificar.md` | Referências e números para conferir antes de publicar |
| — | `webinario/` | Traçados ilustrativos (PNG) e scripts que geram o PPTX e os traçados |

## O que você precisa preencher antes de publicar

Cada HTML tem um bloco `CONFIG` no fim do arquivo:

- **pagina-vsl.html:** `videoEmbedUrl` (link de incorporação da VSL), `fotoProfessora`, `acesso`; e no HTML, o minicurrículo e os depoimentos (marcados com `EDITAR`).
- **captura.html:** `leadEndpoint` — para onde os dados vão (ex.: Web App do Google Apps Script ligado a uma planilha, ou webhook do seu CRM). Sem isso, a página só segue para a página de vendas **sem salvar** os dados.
- **pagina-vendas.html:** `precoDe` (ancoragem), `parcelas` + `valorParcela` (conforme o seu gateway), `checkoutUrl`, texto de garantia.
- **PPTX:** slides 8 (sinusoidal atípico), 15 (critérios SOGC) e 25 (oferta final) têm pontos marcados para você revisar/preencher.

## Regerar o PPTX / traçados

```bash
cd vsl-cardiotocografia/webinario
python3 tracos.py                      # precisa de numpy + matplotlib
npm install pptxgenjs && node deck.js ../04-webinario-cardiotocografia.pptx
```

> Os traçados são **simulados para fins didáticos**. Substituir por traçados reais anonimizados deixa a aula mais forte.
