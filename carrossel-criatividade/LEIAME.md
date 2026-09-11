# Carrossel — "Como usar sua criatividade ao seu favor"

Carrossel de Instagram com o post do Substack de Caroline Reis, em **20 slides**
(capa + 18 de conteúdo + CTA), formato **1080 × 1350 px (4:5, vertical)**.

## O que tem aqui

| arquivo | o que é |
|---|---|
| `index.html` | o carrossel montado — abra no navegador para ver os 20 slides |
| `conteudo.js` | o texto, slide a slide (é aqui que se edita o conteúdo) |
| `gerar-pngs.sh` | exporta os PNGs 1080×1350 |
| `png/slide-01..20.png` | os arquivos prontos para postar |
| `fontes.css` + `fontes/` | DM Sans, DM Mono e Playfair Display locais (renderiza igual offline) |
| `texto-nos-slides.txt` | o texto de cada slide em texto puro, para conferência |

## Sobre o texto

O texto do post está **na íntegra e sem alteração** — nenhuma frase foi reescrita,
resumida ou cortada. O que foi removido são apenas os blocos de propaganda do
e-mail do Substack:

- "Encaminhou este email? Inscreva-se aqui para receber mais."
- "LEIA NO APP" / "Ouvir o post · 37:46"
- os dois blocos "Este Substack é apoiado pelos Leitores… / Inscrito"
- rodapé "Compartilhar / Curtir / Comentar / Restack" e "© 2026 Caroline Reis"

A divisão em slides segue os parágrafos do post: 1 capa, 6 slides de abertura,
os 10 pontos (o ponto 3 ocupa 2 slides e o ponto 10 continua em outro), o fecho
e o CTA. Nenhuma palavra foi acrescentada ao corpo do texto — o que existe de
texto novo é só a moldura de navegação (marca, contador, "arraste", CTA final).

Para conferir, compare `texto-nos-slides.txt` com o post original.

## Paleta

Extraída do padrão já usado no repositório (`mapa-profissionais.html`), em versão
**fundo claro** para leitura:

- creme `#FDF8F2` (fundo) · roxo escuro `#2D0A4E` (títulos)
- roxo médio `#5B2D8E` (corpo) · roxo claro `#8B5CC8` · roxo suave `#C4A8E8`
- laranja `#F5630A` e laranja claro `#FF8C42` (acentos, numeração, barra de progressão)

Tipografia: Playfair Display (títulos), DM Sans (corpo), DM Mono (rótulos).

## Regerar os PNGs

```bash
./gerar-pngs.sh
```

Usa o Chromium headless. Se o Chromium estiver em outro caminho:

```bash
CHROME=/caminho/para/chrome ./gerar-pngs.sh
```

O corpo de texto de cada slide é ajustado automaticamente (entre 17 e 38 px) para
o maior tamanho que ainda cabe na página — por isso os slides mais longos aparecem
com a fonte menor. Se quiser um texto maior num slide denso, divida o parágrafo em
dois slides dentro de `conteudo.js`.
