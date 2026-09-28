const pptxgen = require("pptxgenjs");
const path = require("path");
const OUT = process.argv[2] || "webinario.pptx";

const C = {
  roxo: "2D0A4E", roxoM: "5B2D8E", roxoC: "8B5CC8", lilas: "C4A8E8", tint: "F3ECFB",
  lar: "F5630A", larC: "FF8C42", branco: "FFFFFF", texto: "2D0A4E", suave: "5D4A73",
};
const H = "Cambria", B = "Calibri", M = "Courier New";
const img = f => path.join(__dirname, "tracados", f);

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.title = "Cardiotocografia: os padrões que não podem ser perdidos";
pres.author = "Caroline Reis · Serenidade Lab";

const W = 10, HH = 5.625;

// ── helpers ──────────────────────────────────────────
function txt(s, t, o) { s.addText(t, Object.assign({ isTextBox: true, fontFace: B, color: C.texto, margin: 0, valign: "top" }, o)); }
function eyebrow(s, t, x, y, dark) { txt(s, t, { x, y, w: 8, h: 0.25, fontFace: M, fontSize: 9, charSpacing: 3, color: dark ? C.larC : C.lar, bold: true }); }
function title(s, t, x, y, w, h, dark, size) {
  txt(s, t, { x, y, w, h, fontFace: H, fontSize: size || 28, bold: true, color: dark ? C.branco : C.roxo, valign: "top" });
}
function footer(s, dark) {
  txt(s, [{ text: "Serenidade", options: { color: dark ? C.branco : C.roxo } }, { text: "Lab", options: { color: C.lar } }],
    { x: 0.5, y: 5.22, w: 2, h: 0.25, fontFace: H, fontSize: 10, bold: true });
  txt(s, "Caroline Reis · CTG: padrões que não podem ser perdidos", { x: 4.5, y: 5.24, w: 5, h: 0.22, fontSize: 8, color: dark ? C.lilas : C.roxoC, align: "right", fontFace: M });
}
function numCircle(s, n, x, y, d, dark) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: dark ? C.lar : "FDE3D3" }, line: { color: dark ? C.lar : "FDE3D3" } });
  txt(s, String(n), { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: H, bold: true, fontSize: d * 22, color: dark ? C.branco : C.lar });
}
function card(s, x, y, w, h, fill) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill || C.branco }, line: { color: "E8DDF5", width: 0.75 },
    shadow: { type: "outer", color: "2D0A4E", opacity: 0.08, blur: 8, offset: 2, angle: 90 } });
}
function bullets(s, items, o) {
  const arr = items.map((it, i) => {
    const runs = typeof it === "string" ? [{ text: it }] : it;
    return runs.map((r, j) => ({ text: r.text, options: Object.assign({}, r.options || {}, j === 0 && typeof it === "string" ? { bullet: { code: "25CF" }, indentLevel: 0 } : {}, j === runs.length - 1 && i < items.length - 1 ? { breakLine: true } : {}) }));
  }).flat();
  txt(s, arr, Object.assign({ fontSize: 13, color: C.suave, paraSpaceAfter: 6 }, o));
}
function darkSlide() { const s = pres.addSlide(); s.background = { color: C.roxo }; return s; }
function lightSlide() { const s = pres.addSlide(); s.background = { color: C.branco }; return s; }
function trace(s, file, x, y, w, ratio) { s.addImage({ path: img(file), x, y, w, h: w / ratio }); }
const R1 = 1675 / 629, R2 = 1675 / 814;

function divider(n, t1, t2, sub, notes) {
  const s = darkSlide();
  txt(s, String(n).padStart(2, "0"), { x: 0.5, y: 0.9, w: 3, h: 1.6, fontFace: H, fontSize: 110, bold: true, color: C.lar });
  eyebrow(s, "// BLOCO " + n + " DE 4", 0.55, 2.7, true);
  txt(s, [{ text: t1 + " ", options: { color: C.branco } }, { text: t2, options: { color: C.larC, italic: true } }],
    { x: 0.5, y: 2.95, w: 9, h: 1.3, fontFace: H, fontSize: 30, bold: true });
  txt(s, sub, { x: 0.5, y: 4.4, w: 8, h: 0.6, fontSize: 14, color: C.lilas });
  footer(s, true);
  s.addNotes(notes);
}

// ── 1 · CAPA ─────────────────────────────────────────
{
  const s = darkSlide();
  s.addShape(pres.shapes.OVAL, { x: 6.6, y: -1.6, w: 5, h: 5, fill: { color: C.lar, transparency: 88 }, line: { color: C.roxo, width: 0 } });
  eyebrow(s, "SERENIDADE LAB · AULA", 0.6, 0.7, true);
  txt(s, [{ text: "Cardiotocografia:", options: { color: C.branco, breakLine: true } }, { text: "os padrões que não podem ser perdidos", options: { color: C.larC, italic: true } }],
    { x: 0.6, y: 1.15, w: 7.6, h: 2.1, fontFace: H, fontSize: 38, bold: true });
  txt(s, "Sinusoidal × pseudossinusoidal · desacelerações com variabilidade reduzida · variabilidade reduzida · quando o CTG ainda não mostrou", { x: 0.6, y: 3.35, w: 7.4, h: 0.7, fontSize: 14, color: C.lilas });
  txt(s, "Caroline Reis", { x: 0.6, y: 4.35, w: 5, h: 0.35, fontFace: H, fontSize: 18, bold: true, color: C.branco });
  txt(s, "Conteúdo educacional para profissionais de saúde", { x: 0.6, y: 4.72, w: 6, h: 0.3, fontFace: M, fontSize: 9, color: C.lilas });
  s.addNotes("ABERTURA (1–2 min)\n\nBoas-vindas. Apresente-se em uma frase e diga o que a pessoa vai levar: um jeito de olhar o traçado que não deixa passar os padrões graves.\n\nCombine as regras: tenha papel e caneta; em cada traçado eu vou pausar e pedir que você classifique antes de eu mostrar a resposta.\n\n[COMENTÁRIO] Todos os traçados desta apresentação são ILUSTRATIVOS (simulados). Se quiser, substitua por traçados reais anonimizados do seu acervo — eles engajam muito mais.");
}

// ── 2 · OLHAR ≠ ENXERGAR ────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// POR QUE OS PADRÕES GRAVES PASSAM", 0.5, 0.45);
  title(s, "Olhar não é o mesmo que enxergar", 0.5, 0.75, 9, 0.7);
  card(s, 0.5, 1.7, 4.1, 3.2, C.tint);
  txt(s, "20 de 24", { x: 0.8, y: 1.95, w: 3.7, h: 1.0, fontFace: H, fontSize: 42, bold: true, color: C.lar });
  txt(s, "radiologistas experientes não viram um gorila inserido numa TC de tórax enquanto procuravam nódulos.", { x: 0.8, y: 3.05, w: 3.5, h: 1.0, fontSize: 13, color: C.suave });
  txt(s, "Drew, Võ & Wolfe · Psychol Sci 2013", { x: 0.8, y: 4.35, w: 3.6, h: 0.3, fontFace: M, fontSize: 8, color: C.roxoC });
  bullets(s, [
    [{ text: "Não era equipamento. ", options: { bold: true, color: C.roxo } }, { text: "Nem experiência, nem inteligência." }],
    [{ text: "Era padrão de busca: ", options: { bold: true, color: C.roxo } }, { text: "o cérebro apaga o que não foi treinado para procurar." }],
    [{ text: "No CTG, ", options: { bold: true, color: C.roxo } }, { text: "o grave muitas vezes parece normal: uma onda \"bonita\", uma desaceleração rasa, uma linha lisa." }],
  ], { x: 5.0, y: 1.8, w: 4.5, h: 3.0, fontSize: 14 });
  footer(s);
  s.addNotes("O GORILA (2–3 min)\n\nConte a história: pesquisadores pediram a radiologistas que procurassem nódulos em TCs de tórax. Numa das imagens havia um gorila muito maior que os nódulos. A maioria não viu — e o rastreamento ocular mostrou que muitos olharam para o lugar exato.\n\nMensagem: o problema não é olhar pouco, é olhar procurando outra coisa. No plantão, a gente procura 'tem acelerações? tem desaceleração grande?'. E o que é sutil passa.\n\n[COMENTÁRIO / CONFERIR] Números do estudo (24 radiologistas, 20 não viram; gorila ~48x maior que o nódulo; quantos olharam para o local) — conferir no artigo original antes de apresentar.");
}

// ── 3 · AGENDA ───────────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// O QUE VAMOS VER", 0.5, 0.45);
  title(s, "Quatro padrões que não podem passar", 0.5, 0.75, 9, 0.7);
  const items = [
    ["Padrão sinusoidal", "Verdadeiro, atípico e o diagnóstico diferencial com o pseudossinusoidal."],
    ["Desacelerações recorrentes", "Com variabilidade reduzida: a combinação que sinaliza perda de compensação."],
    ["Redução da variabilidade", "Sono, medicação, prematuridade — ou hipóxia?"],
    ["Quando o CTG não mostra", "DPP inicial e outras armadilhas em que o traçado ainda está normal."],
  ];
  items.forEach((it, i) => {
    const x = 0.5 + (i % 2) * 4.6, y = 1.7 + Math.floor(i / 2) * 1.65;
    card(s, x, y, 4.35, 1.45);
    numCircle(s, i + 1, x + 0.25, y + 0.3, 0.5);
    txt(s, it[0], { x: x + 0.95, y: y + 0.25, w: 3.3, h: 0.4, fontFace: H, fontSize: 14, bold: true, color: C.roxo });
    txt(s, it[1], { x: x + 0.95, y: y + 0.68, w: 3.2, h: 0.7, fontSize: 12, color: C.suave });
  });
  footer(s);
  s.addNotes("AGENDA (1 min)\n\nMostre que a aula não é 'CTG do zero'. É um treino de olhar para quatro situações de alto risco.\n\nFrase de transição: 'Antes, vamos alinhar a linguagem — porque metade das discussões de plantão sobre CTG é gente usando a mesma palavra para coisas diferentes.'");
}

// ── 4 · VOCABULÁRIO ─────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// LINGUAGEM COMUM (NICHD / ACOG)", 0.5, 0.45);
  title(s, "Antes de tudo: as mesmas palavras", 0.5, 0.75, 9, 0.7);
  const rows = [
    ["Linha de base", "Média da FCF em 10 min, arredondada a 5 bpm. Normal: 110–160 bpm."],
    ["Variabilidade", "Ausente (indetectável) · mínima (≤ 5 bpm) · moderada (6–25) · marcada (> 25)."],
    ["Aceleração", "≥ 32 sem: ≥ 15 bpm por ≥ 15 s. < 32 sem: ≥ 10 bpm por ≥ 10 s."],
    ["Desaceleração", "Precoce, tardia, variável ou prolongada (≥ 2 min e < 10 min)."],
    ["Recorrente", "Presente em ≥ 50% das contrações numa janela de 20 min."],
  ];
  const tab = rows.map(r => [
    { text: r[0], options: { bold: true, color: C.roxo, fontFace: H, fontSize: 13, fill: { color: C.tint } } },
    { text: r[1], options: { color: C.suave, fontSize: 12 } },
  ]);
  s.addTable(tab, { x: 0.5, y: 1.6, w: 9, colW: [2.2, 6.8], rowH: 0.56, fontFace: B, border: { type: "solid", color: "E8DDF5", pt: 0.75 }, valign: "middle", margin: [0, 0.12, 0, 0.12] });
  txt(s, "FIGO 2015 usa definições próximas, com diferenças (ex.: variabilidade \"reduzida\" < 5 bpm). Use sempre a classificação do seu serviço.", { x: 0.5, y: 4.62, w: 9, h: 0.45, fontSize: 10, italic: true, color: C.roxoC });
  footer(s);
  s.addNotes("VOCABULÁRIO (2 min)\n\nPasse rápido, sem ler a tabela. Destaque só duas coisas:\n1) Variabilidade é a amplitude das oscilações da linha de base — é o dado que mais conta sobre a reserva do bebê.\n2) 'Recorrente' tem definição: ≥ 50% das contrações em 20 minutos. Não é 'algumas'.\n\n[COMENTÁRIO] Se você usa SOGC no seu serviço/app, diga aqui que a lógica é a mesma, mudam os rótulos (normal / atípico / anormal).\n\n[CONFERIR] Definições conforme NICHD 2008 / ACOG PB 106.");
}

// ── 5 · DIVISOR 1 ───────────────────────────────────
divider(1, "O padrão", "sinusoidal", "O gorila que parece variabilidade.", "TRANSIÇÃO\n\nPergunta para a audiência antes de mostrar o próximo slide: 'Se eu te mostrar uma onda regular, bonita, de 10 batimentos de amplitude — você chamaria isso de variabilidade moderada?' Deixe a pergunta no ar.");

// ── 6 · SINUSOIDAL VERDADEIRO ───────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 1.1 · SINUSOIDAL VERDADEIRO", 0.5, 0.4);
  title(s, "Uma onda perfeita demais para ser saudável", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_sinusoidal.png", 0.5, 1.4, 5.6, R1);
  card(s, 6.35, 1.4, 3.15, 3.55, C.tint);
  txt(s, "Critérios (FIGO 2015)", { x: 6.55, y: 1.55, w: 2.8, h: 0.35, fontFace: H, fontSize: 14, bold: true, color: C.roxo });
  bullets(s, [
    "Onda regular e suave, como um seno",
    "Amplitude 5–15 bpm",
    "Frequência 3–5 ciclos/min",
    "Dura > 30 min",
    "Sem acelerações",
  ], { x: 6.55, y: 1.95, w: 2.85, h: 2.0, fontSize: 12 });
  txt(s, "ACOG: ≥ 20 min = Categoria III. SOGC: anormal.", { x: 6.55, y: 4.1, w: 2.85, h: 0.7, fontSize: 11, bold: true, color: C.lar });
  txt(s, "O erro clássico: ler como \"variabilidade moderada\" e seguir tranquilo.", { x: 0.5, y: 3.65, w: 5.6, h: 0.6, fontSize: 14, italic: true, color: C.roxo, fontFace: H });
  footer(s);
  s.addNotes("SINUSOIDAL VERDADEIRO (3–4 min)\n\nPeça para olharem o traçado e dizerem o que chama atenção. A resposta: ele é REGULAR demais. Variabilidade fisiológica é irregular — é o sistema nervoso autônomo 'conversando'. Uma onda previsível significa que essa conversa parou.\n\nPontos-chave:\n• Onda suave, sem 'dentes', como um seno.\n• 3 a 5 ciclos por minuto, amplitude de 5 a 15 bpm.\n• Não há acelerações e não há reatividade.\n• Persiste: FIGO fala em > 30 min; ACOG, em ≥ 20 min para Categoria III.\n\n[CONFERIR] Valores conforme FIGO 2015 e ACOG PB 106. Na SOGC é classificado como anormal — confirme o critério exato na diretriz que você usa no app.");
}

// ── 7 · POR QUE É GRAVE ─────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 1.2 · SIGNIFICADO E CONDUTA", 0.5, 0.45);
  title(s, "Sinusoidal: emergência até prova em contrário", 0.5, 0.75, 9, 0.7, false, 24);
  card(s, 0.5, 1.65, 4.35, 3.3);
  txt(s, "Pense em…", { x: 0.75, y: 1.8, w: 3.9, h: 0.35, fontFace: H, fontSize: 15, bold: true, color: C.roxo });
  bullets(s, [
    [{ text: "Anemia fetal grave: ", options: { bold: true, color: C.roxo } }, { text: "aloimunização, hemorragia feto-materna, vasa prévia rota, transfusão feto-fetal, parvovírus B19" }],
    [{ text: "Hipóxia/acidose grave: ", options: { bold: true, color: C.roxo } }, { text: "o padrão também é descrito nesse cenário" }],
    [{ text: "Contexto: ", options: { bold: true, color: C.roxo } }, { text: "sangramento, trauma, ↓ movimentos, hidropsia" }],
  ], { x: 0.75, y: 2.2, w: 3.9, h: 2.7, fontSize: 12 });
  card(s, 5.15, 1.65, 4.35, 3.3, C.tint);
  txt(s, "Na prática", { x: 5.4, y: 1.8, w: 3.9, h: 0.35, fontFace: H, fontSize: 15, bold: true, color: C.roxo });
  bullets(s, [
    "Chame ajuda e avalie a paciente agora",
    "Confirme que o sinal é fetal",
    "Se houver tempo e contexto: Doppler da ACM (pico de velocidade sistólica), teste de Kleihauer-Betke",
    "Decisão de via/tempo de parto ou transfusão intrauterina conforme IG e protocolo",
  ], { x: 5.4, y: 2.2, w: 3.9, h: 2.7, fontSize: 12 });
  footer(s);
  s.addNotes("SIGNIFICADO (3 min)\n\nO sinusoidal verdadeiro está classicamente associado a anemia fetal grave. Cite as causas e peça que pensem na história: Rh negativo sensibilizada? Sangramento? Trauma abdominal? Redução de movimentos?\n\nConduta: não é traçado para 'repetir mais tarde'. É avaliação imediata e decisão em equipe.\n\n[COMENTÁRIO] Adapte a conduta ao protocolo do seu serviço. A indicação de Doppler/Kleihauer depende do cenário (anteparto estável × intraparto com traçado persistente).");
}

// ── 8 · SINUSOIDAL ATÍPICO ──────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 1.3 · SINUSOIDAL ATÍPICO", 0.5, 0.4);
  title(s, "A onda imperfeita — e ainda assim grave", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_sinusoidal_atipico.png", 0.5, 1.4, 5.6, R1);
  card(s, 6.35, 1.4, 3.15, 3.55, C.tint);
  txt(s, "O que costuma chamar atenção", { x: 6.55, y: 1.55, w: 2.8, h: 0.55, fontFace: H, fontSize: 13, bold: true, color: C.roxo });
  bullets(s, [
    "Forma menos regular: amplitude e frequência variam",
    "Persistente, sem segmentos normais",
    "Sem acelerações e sem resposta a estímulo",
    "Contexto de anemia, hemorragia ou hipóxia",
  ], { x: 6.55, y: 2.1, w: 2.85, h: 2.3, fontSize: 12 });
  txt(s, "A terminologia varia entre autores. O que decide é persistência + ausência de reatividade + contexto.", { x: 0.5, y: 3.65, w: 5.6, h: 0.8, fontSize: 13, italic: true, color: C.roxo, fontFace: H });
  footer(s);
  s.addNotes("SINUSOIDAL ATÍPICO (3 min)\n\nMensagem: o padrão grave nem sempre vem 'de livro'. Há descrições de padrões sinusoidais com amplitude maior ou irregular e formas menos suaves, também associados a comprometimento fetal.\n\nO risco aqui é duplo: (1) não reconhecer como sinusoidal porque 'não é bonito o suficiente'; (2) chamar de pseudossinusoidal por ser irregular. A pergunta que resolve: ele é persistente? tem acelerações? tem trechos normais antes e depois? qual é o contexto?\n\n[CONFERIR — IMPORTANTE] Não tenho certeza da definição exata de 'sinusoidal atípico' que você usa. Há literatura que discute formas atípicas e classificação por amplitude (ex.: Modanlou & Freeman 1982; Modanlou & Murata 2004; Murphy et al.). Revise este slide com a sua referência antes de apresentar.");
}

// ── 9 · PSEUDOSSINUSOIDAL ───────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 1.4 · PSEUDOSSINUSOIDAL", 0.5, 0.4);
  title(s, "Parece, assusta — e costuma ser benigno", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_pseudossinusoidal.png", 0.5, 1.4, 5.6, R1);
  card(s, 6.35, 1.4, 3.15, 3.55, C.tint);
  txt(s, "Critérios (FIGO 2015)", { x: 6.55, y: 1.55, w: 2.8, h: 0.35, fontFace: H, fontSize: 14, bold: true, color: C.roxo });
  bullets(s, [
    "Aspecto \"serrilhado\", menos suave",
    "Raramente > 30 min",
    "Traçado normal antes e depois",
    "Após analgésicos (opioides) ou sucção / movimentos orais",
  ], { x: 6.55, y: 1.95, w: 2.85, h: 2.4, fontSize: 12 });
  txt(s, "A chave está no que vem antes e depois: acelerações e variabilidade normal.", { x: 0.5, y: 3.65, w: 5.6, h: 0.6, fontSize: 14, italic: true, color: C.roxo, fontFace: H });
  footer(s);
  s.addNotes("PSEUDOSSINUSOIDAL (3 min)\n\nMostre o traçado inteiro: acelerações, trecho 'serrilhado' curto, acelerações de novo. É um bebê reativo que fez uma pausa num padrão diferente — por exemplo sugando o dedo, ou após opioide materno.\n\nDica prática: se estiver fazendo ultrassom, às vezes dá para ver a sucção/movimento de boca coincidindo com o padrão.\n\n[CONFERIR] Descrição conforme FIGO 2015 (pseudo-sinusoidal pattern).");
}

// ── 10 · TABELA COMPARATIVA ─────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 1.5 · DIAGNÓSTICO DIFERENCIAL", 0.5, 0.4);
  title(s, "Sinusoidal × pseudossinusoidal", 0.5, 0.68, 9, 0.6, false, 26);
  const hdr = (t, fill, col) => ({ text: t, options: { bold: true, color: col, fill: { color: fill }, fontFace: H, fontSize: 13 } });
  const c = (t, o) => ({ text: t, options: Object.assign({ color: C.suave, fontSize: 12 }, o || {}) });
  const rows = [
    [hdr("", C.branco, C.roxo), hdr("Sinusoidal (verdadeiro / atípico)", C.roxo, C.branco), hdr("Pseudossinusoidal", C.tint, C.roxo)],
    [c("Forma", { bold: true, color: C.roxo }), c("Suave e regular (atípico: irregular)"), c("Serrilhada, irregular")],
    [c("Duração", { bold: true, color: C.roxo }), c("Persistente (≥ 20–30 min)"), c("Curta, intermitente")],
    [c("Antes / depois", { bold: true, color: C.roxo }), c("Sem segmentos normais"), c("Traçado normal")],
    [c("Acelerações", { bold: true, color: C.roxo }), c("Ausentes"), c("Presentes")],
    [c("Contexto", { bold: true, color: C.roxo }), c("Anemia, hemorragia, hipóxia"), c("Opioide, sucção, movimentos orais")],
    [c("Conduta", { bold: true, color: C.roxo }), c("Emergência", { bold: true, color: C.lar }), c("Observar, prolongar registro")],
  ];
  s.addTable(rows, { x: 0.5, y: 1.45, w: 9, colW: [1.9, 3.65, 3.45], rowH: 0.47, fontFace: B, border: { type: "solid", color: "E8DDF5", pt: 0.75 }, valign: "middle", margin: [0, 0.12, 0, 0.12] });
  footer(s);
  s.addNotes("COMPARAÇÃO (2 min)\n\nUse a tabela como resumo, não leia. Peça para a audiência fotografar.\n\nFrase de fechamento do bloco: 'Na dúvida entre os dois, trate como verdadeiro até provar o contrário — prolongue o registro, busque reatividade e olhe o contexto.'");
}

// ── 11 · 5 PERGUNTAS ────────────────────────────────
{
  const s = darkSlide();
  eyebrow(s, "// CHECKLIST DE BOLSO", 0.5, 0.45, true);
  title(s, "Viu uma onda regular? Faça 5 perguntas", 0.5, 0.75, 9, 0.7, true, 26);
  const q = [
    "A onda é suave e regular — ou serrilhada?",
    "Há quanto tempo está assim? (≥ 20–30 min?)",
    "Houve acelerações antes, durante ou depois?",
    "Há trechos de traçado normal ao redor?",
    "Qual o contexto: opioide, sucção, Rh, sangramento, trauma, ↓ MF?",
  ];
  q.forEach((t, i) => {
    const y = 1.65 + i * 0.66;
    numCircle(s, i + 1, 0.55, y, 0.45, true);
    txt(s, t, { x: 1.2, y: y + 0.06, w: 8.2, h: 0.4, fontSize: 16, color: C.branco });
  });
  footer(s, true);
  s.addNotes("CHECKLIST (1–2 min)\n\nLeia as 5 perguntas em voz alta, devagar. É o slide que as pessoas vão lembrar no plantão.\n\n[COMENTÁRIO] Bom momento para uma enquete/chat: 'Qual dessas perguntas você normalmente NÃO faz?'");
}

// ── 12 · DIVISOR 2 ──────────────────────────────────
divider(2, "Desacelerações recorrentes +", "variabilidade reduzida", "Quando o bebê está deixando de compensar.", "TRANSIÇÃO\n\n'Agora o padrão mais traiçoeiro do plantão: aquele em que nenhuma desaceleração é grande o suficiente para assustar.'");

// ── 13 · FISIOLOGIA ─────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 2.1 · A LÓGICA FISIOLÓGICA", 0.5, 0.45);
  title(s, "Duas perguntas para cada traçado", 0.5, 0.75, 9, 0.7, false, 26);
  card(s, 0.5, 1.7, 4.35, 2.6);
  numCircle(s, 1, 0.75, 1.95, 0.5);
  txt(s, "Existe um estresse?", { x: 1.4, y: 2.0, w: 3.3, h: 0.4, fontFace: H, fontSize: 16, bold: true, color: C.roxo });
  txt(s, "As desacelerações contam a história do estímulo: compressão de cordão, redução do fluxo útero-placentário a cada contração.", { x: 0.75, y: 2.65, w: 3.9, h: 1.5, fontSize: 13, color: C.suave });
  card(s, 5.15, 1.7, 4.35, 2.6, C.tint);
  numCircle(s, 2, 5.4, 1.95, 0.5);
  txt(s, "O bebê está compensando?", { x: 6.05, y: 2.0, w: 3.3, h: 0.4, fontFace: H, fontSize: 16, bold: true, color: C.roxo });
  txt(s, "A variabilidade conta a reserva: variabilidade moderada indica, com boa confiabilidade, ausência de acidemia metabólica naquele momento.", { x: 5.4, y: 2.65, w: 3.9, h: 1.5, fontSize: 13, color: C.suave });
  txt(s, "Estresse recorrente + reserva que some = descompensação em curso.", { x: 0.5, y: 4.5, w: 9, h: 0.45, fontFace: H, fontSize: 15, bold: true, italic: true, color: C.lar, align: "center" });
  footer(s);
  s.addNotes("FISIOLOGIA (3 min)\n\nEsse é o coração da aula. A desaceleração, sozinha, mostra que existe um estímulo. A variabilidade mostra se o bebê está dando conta.\n\nUma desaceleração tardia com variabilidade moderada: bebê sob estresse, mas compensando. A mesma desaceleração com variabilidade mínima/ausente: bebê perdendo a reserva.\n\n[CONFERIR] A afirmação sobre variabilidade moderada e ausência de acidemia metabólica está no ACOG PB 106 / NICHD 2008.");
}

// ── 14 · TRAÇADO TARDIAS RASAS ──────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 2.2 · O PEQUENO QUE É GRANDE", 0.5, 0.4);
  title(s, "A desaceleração rasa que ninguém chama", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_tardias_rasas.png", 0.5, 1.35, 5.4, R2);
  card(s, 6.2, 1.35, 3.3, 3.65, C.tint);
  bullets(s, [
    [{ text: "Tardia: ", options: { bold: true, color: C.roxo } }, { text: "início, nadir e recuperação depois do pico da contração" }],
    [{ text: "Rasa: ", options: { bold: true, color: C.roxo } }, { text: "10–15 bpm. Não existe profundidade mínima para ser tardia" }],
    [{ text: "Recorrente: ", options: { bold: true, color: C.roxo } }, { text: "em ≥ 50% das contrações" }],
    [{ text: "Variabilidade mínima: ", options: { bold: true, color: C.roxo } }, { text: "a reserva está acabando" }],
  ], { x: 6.4, y: 1.55, w: 2.95, h: 3.3, fontSize: 12 });
  footer(s);
  s.addNotes("TRAÇADO (4 min) — faça a pausa!\n\nMostre o traçado e peça: 'classifique antes que eu fale'. Depois:\n• Olhe o canal da contração primeiro. Agora olhe onde está o fundo de cada desaceleração: sempre depois do pico da contração.\n• A amplitude é pequena — 10, 12 bpm. É exatamente por isso que passa.\n• E a variabilidade entre as contrações está mínima.\n\nEste é o 'gorila' do CTG intraparto: um traçado sem nada 'dramático' que, na verdade, mostra um bebê perdendo a reserva.\n\n[CONFERIR] Definição de desaceleração tardia (NICHD/ACOG) não exige amplitude mínima.");
}

// ── 15 · CLASSIFICAÇÕES ─────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 2.3 · COMO AS CLASSIFICAÇÕES TRATAM", 0.5, 0.45);
  title(s, "Três diretrizes, a mesma mensagem", 0.5, 0.75, 9, 0.7, false, 26);
  const cols = [
    ["ACOG / NICHD", "Categoria III: variabilidade AUSENTE + tardias recorrentes, variáveis recorrentes ou bradicardia.\n\nTardias recorrentes com variabilidade mínima: Categoria II — mas de alto alerta."],
    ["FIGO 2015", "Patológico: desacelerações tardias ou prolongadas repetitivas por > 30 min — ou > 20 min se a variabilidade estiver reduzida."],
    ["SOGC", "Anormal: desacelerações tardias recorrentes e/ou variabilidade reduzida persistente.\n\n[Insira aqui os critérios exatos usados no seu app.]"],
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    card(s, x, 1.65, 2.85, 3.3, i === 1 ? C.tint : C.branco);
    txt(s, c[0], { x: x + 0.22, y: 1.82, w: 2.4, h: 0.4, fontFace: H, fontSize: 16, bold: true, color: C.lar });
    txt(s, c[1], { x: x + 0.22, y: 2.3, w: 2.45, h: 2.55, fontSize: 12, color: C.suave });
  });
  footer(s);
  s.addNotes("CLASSIFICAÇÕES (3 min)\n\nMensagem: independentemente do sistema, a combinação 'desaceleração recorrente + variabilidade reduzida' sobe o nível de alerta e pede ação.\n\nNote que na FIGO o 'relógio' fica mais curto quando a variabilidade cai (20 min em vez de 30).\n\n[CONFERIR — IMPORTANTE] Revise os critérios de cada diretriz antes de apresentar (ACOG PB 106; FIGO 2015; SOGC 2020 nº 396). No quadro da SOGC deixei um texto genérico de propósito: substitua pelos critérios exatos do seu app.");
}

// ── 16 · EVOLUÇÃO NO TEMPO ──────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 2.4 · O TRAÇADO É UM FILME, NÃO UMA FOTO", 0.5, 0.45);
  title(s, "Como a hipóxia costuma evoluir no tempo", 0.5, 0.75, 9, 0.7, false, 24);
  const steps = ["Surgem desacelerações", "Acelerações somem", "Linha de base sobe", "Variabilidade cai", "Bradicardia terminal"];
  steps.forEach((t, i) => {
    const x = 0.5 + i * 1.84;
    const fill = i < 3 ? C.tint : (i === 3 ? "FDE3D3" : C.lar);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 1.66, h: 1.5, rectRadius: 0.12, fill: { color: fill }, line: { color: fill } });
    txt(s, String(i + 1), { x: x + 0.15, y: 1.95, w: 1.4, h: 0.5, fontFace: H, fontSize: 24, bold: true, color: i === 4 ? C.branco : C.lar });
    txt(s, t, { x: x + 0.12, y: 2.5, w: 1.46, h: 0.8, fontSize: 12, bold: true, color: i === 4 ? C.branco : C.roxo });
    if (i < 4) txt(s, "›", { x: x + 1.64, y: 2.3, w: 0.22, h: 0.5, fontSize: 22, color: C.roxoC, align: "center" });
  });
  txt(s, "Padrão típico da hipóxia de instalação gradual. Na hipóxia aguda (prolapso, rotura, DPP extenso), a sequência pode ser pulada.", { x: 0.5, y: 3.65, w: 9, h: 0.6, fontSize: 13, color: C.suave });
  txt(s, "Compare o traçado atual com o de 30–60 min atrás.", { x: 0.5, y: 4.35, w: 9, h: 0.45, fontFace: H, fontSize: 17, italic: true, bold: true, color: C.lar });
  footer(s);
  s.addNotes("EVOLUÇÃO (3 min)\n\nA pergunta de ouro no plantão: 'como estava há uma hora?'. Um traçado 'Categoria II' que ficou com linha de base mais alta, sem acelerações e com variabilidade caindo é muito diferente de um Categoria II estável.\n\nNote o passo 3: a linha de base sobe (resposta catecolaminérgica) — muita gente não percebe porque ainda está 'dentro do normal', ex.: de 130 para 155.\n\n[CONFERIR] Sequência baseada na abordagem 'fisiológica' da CTG (hipóxia de evolução gradual) e na descrição da FIGO 2015. Nem todo caso segue essa ordem.");
}

// ── 17 · DIVISOR 3 ──────────────────────────────────
divider(3, "Redução da", "variabilidade", "Quando o traçado liso é o sinal mais importante.", "TRANSIÇÃO\n\n'E se o traçado não tiver desaceleração nenhuma? Só uma linha tranquila, lisinha… Isso é bom?'");

// ── 18 · CAUSAS ─────────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 3.1 · DIAGNÓSTICO DIFERENCIAL", 0.5, 0.45);
  title(s, "Sono, remédio, prematuridade — ou hipóxia?", 0.5, 0.75, 9, 0.7, false, 24);
  card(s, 0.5, 1.65, 4.35, 3.3, C.tint);
  txt(s, "Costumam ser reversíveis", { x: 0.75, y: 1.8, w: 3.9, h: 0.4, fontFace: H, fontSize: 15, bold: true, color: C.roxo });
  bullets(s, [
    "Sono fetal (períodos quietos, em geral < 40–50 min)",
    "Medicações: opioides, sulfato de magnésio, sedativos",
    "Prematuridade (sobretudo abaixo de 32 sem)",
  ], { x: 0.75, y: 2.3, w: 3.9, h: 2.5, fontSize: 13 });
  card(s, 5.15, 1.65, 4.35, 3.3);
  txt(s, "Preocupantes", { x: 5.4, y: 1.8, w: 3.9, h: 0.4, fontFace: H, fontSize: 15, bold: true, color: C.lar });
  bullets(s, [
    "Hipóxia / acidose",
    "Infecção intra-amniótica",
    "Lesão neurológica prévia",
    "Anemia, arritmias, malformações",
  ], { x: 5.4, y: 2.3, w: 3.9, h: 2.5, fontSize: 13 });
  footer(s);
  s.addNotes("CAUSAS (3 min)\n\nA variabilidade reduzida é inespecífica — por isso tanta gente 'normaliza'. A pergunta é: existe uma explicação benigna E o traçado se recupera no tempo esperado?\n\nFIGO define variabilidade reduzida como < 5 bpm por mais de 50 min em segmentos de linha de base (ou > 3 min durante desacelerações).\n\n[CONFERIR] Duração típica dos ciclos de sono fetal e o critério de 50 min (FIGO 2015).");
}

// ── 19 · TRAÇADO LISO ───────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 3.2 · O TRAÇADO SILENCIOSO", 0.5, 0.4);
  title(s, "Sem desaceleração não é sem problema", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_variabilidade_reduzida.png", 0.5, 1.4, 5.6, R1);
  card(s, 6.35, 1.4, 3.15, 3.55, C.tint);
  bullets(s, [
    "Linha de base fixa, sem acelerações e sem desacelerações",
    "Persistente além de um ciclo de sono",
    "Pode indicar hipóxia crônica ou lesão já instalada",
    "No anteparto: pense em RCF, Doppler, PBF",
  ], { x: 6.55, y: 1.6, w: 2.85, h: 3.2, fontSize: 12 });
  txt(s, "\"O bebê está dormindo\" é um diagnóstico de exclusão — com prazo.", { x: 0.5, y: 3.65, w: 5.6, h: 0.7, fontSize: 14, italic: true, color: C.roxo, fontFace: H });
  footer(s);
  s.addNotes("TRAÇADO LISO (3 min)\n\nEsse traçado não dispara nenhum alarme 'clássico': não tem desaceleração, não tem bradicardia. Mas também não tem nenhum sinal de bem-estar.\n\nUm traçado persistentemente liso pode aparecer num bebê cronicamente hipoxêmico ou que já sofreu uma lesão — e aí esperar 'acordar' é perder tempo.\n\n[COMENTÁRIO] Se você usa CTG computadorizada (Dawes-Redman), mencione a STV aqui. [CONFERIR] valores de corte de STV (ex.: os usados no TRUFFLE).");
}

// ── 20 · O QUE FAZER ────────────────────────────────
{
  const s = darkSlide();
  eyebrow(s, "// 3.3 · CONDUTA PRÁTICA", 0.5, 0.45, true);
  title(s, "Variabilidade reduzida: o que fazer", 0.5, 0.75, 9, 0.7, true, 26);
  const st = [
    ["Confirme o sinal", "É mesmo a FC fetal? Compare com o pulso materno."],
    ["Revise o contexto", "Medicações e horários, IG, febre, sangramento, movimentos."],
    ["Dê tempo com limite", "Prolongue o registro; considere estímulo (conforme protocolo)."],
    ["Corrija o corrigível", "Decúbito, hipotensão, taquissistolia, hidratação."],
    ["Persistiu sem explicação?", "Avaliação complementar e decisão em equipe."],
  ];
  st.forEach((r, i) => {
    const y = 1.6 + i * 0.68;
    numCircle(s, i + 1, 0.55, y, 0.45, true);
    txt(s, r[0], { x: 1.2, y: y + 0.07, w: 2.9, h: 0.4, fontSize: 15, bold: true, color: C.branco });
    txt(s, r[1], { x: 4.1, y: y + 0.09, w: 5.4, h: 0.4, fontSize: 13, color: C.lilas });
  });
  footer(s, true);
  s.addNotes("CONDUTA (2–3 min)\n\nEnfatize o passo 3: 'dar tempo' é aceitável — mas com prazo definido e com reavaliação ativa, não esquecendo o traçado rodando.\n\n[COMENTÁRIO] Estímulo vibroacústico (anteparto) e estímulo do couro cabeludo fetal (intraparto) — cite apenas os métodos que o seu serviço usa.");
}

// ── 21 · DIVISOR 4 ──────────────────────────────────
divider(4, "Quando o CTG", "ainda não mostrou", "O traçado é um retrato do bebê — não da mãe, nem da placenta.", "TRANSIÇÃO\n\n'Até aqui falamos de traçados que mostram o problema. Agora, do contrário: o bebê em risco com um traçado que ainda parece ótimo.'");

// ── 22 · DPP ────────────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 4.1 · DPP INICIAL", 0.5, 0.4);
  title(s, "FCF normal, útero contando outra história", 0.5, 0.68, 9, 0.6, false, 24);
  trace(s, "ctg_dpp_toco.png", 0.5, 1.35, 5.4, R2);
  card(s, 6.2, 1.35, 3.3, 3.65, C.tint);
  txt(s, "Olhe também para…", { x: 6.4, y: 1.5, w: 2.9, h: 0.35, fontFace: H, fontSize: 14, bold: true, color: C.roxo });
  bullets(s, [
    "Canal da contração: taquissistolia, tônus basal elevado",
    "Dor, útero doloroso ou hipertônico",
    "Sangramento (pode ser oculto)",
    "Sinais vitais maternos",
    "US normal não exclui DPP",
  ], { x: 6.4, y: 1.9, w: 2.95, h: 3.0, fontSize: 12 });
  footer(s);
  s.addNotes("DPP INICIAL (4 min)\n\nMostre o traçado: a FCF está tranquilizadora. Agora peça que olhem o canal de baixo: contrações muito frequentes, pequenas, com tônus de base elevado. Junte com a clínica: dor, hipertonia, sangramento.\n\nNo DPP inicial ou pequeno, a área de troca ainda pode ser suficiente e o bebê compensa. O CTG muda quando a reserva acaba — e aí pode ser rápido.\n\nMensagem: CTG normal não 'libera' uma paciente com quadro clínico sugestivo. Reavalie, repita, discuta.\n\n[CONFERIR] Não tenho uma referência verificada específica para citar neste slide; use a referência que você já usa nas suas aulas sobre DPP. A baixa sensibilidade do ultrassom para DPP é amplamente descrita, mas confira a fonte.");
}

// ── 23 · OUTRAS ARMADILHAS ──────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// 4.2 · OUTRAS ARMADILHAS", 0.5, 0.45);
  title(s, "Quando o traçado engana", 0.5, 0.75, 9, 0.7, false, 26);
  const g = [
    ["FC materna registrada", "Parece normal — mas não é o bebê. Especialmente no expulsivo."],
    ["Óbito fetal", "O aparelho pode captar o pulso materno e \"mostrar\" um traçado."],
    ["Arritmias fetais", "Linha fixa ou bradicárdica sem relação com hipóxia."],
    ["RCF", "Na restrição de crescimento, o Doppler costuma alterar antes do CTG."],
    ["Eventos agudos", "Prolapso de cordão, rotura uterina, rotura de vasa prévia."],
    ["O retrato do momento", "Reativo hoje não garante amanhã: o intervalo depende do risco."],
  ];
  g.forEach((r, i) => {
    const x = 0.5 + (i % 3) * 3.05, y = 1.6 + Math.floor(i / 3) * 1.7;
    card(s, x, y, 2.85, 1.5, i % 2 ? C.tint : C.branco);
    txt(s, r[0], { x: x + 0.2, y: y + 0.18, w: 2.5, h: 0.4, fontFace: H, fontSize: 13, bold: true, color: C.lar });
    txt(s, r[1], { x: x + 0.2, y: y + 0.6, w: 2.5, h: 0.85, fontSize: 11.5, color: C.suave });
  });
  footer(s);
  s.addNotes("ARMADILHAS (3 min)\n\nPasse pelas 6 rapidamente. Destaque a primeira: registrar a FC materna é um erro frequente e perigoso — se a 'FCF' está igual ao pulso materno, desconfie.\n\n[COMENTÁRIO] Se tiver um caso real (anonimizado) de sinal materno, este é o melhor lugar para contá-lo.");
}

// ── 24 · ROTEIRO DE LEITURA ─────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// PARA O PRÓXIMO PLANTÃO", 0.5, 0.45);
  title(s, "Roteiro de leitura em 7 passos", 0.5, 0.75, 9, 0.7, false, 26);
  const p = [
    ["Contexto", "Risco, IG, medicações, queixa"],
    ["Sinal", "É o bebê? Compare com o pulso materno"],
    ["Contrações", "Frequência, duração, tônus"],
    ["Linha de base", "Valor e tendência"],
    ["Variabilidade", "A reserva do bebê"],
    ["Acelerações / desacelerações", "Tipo, profundidade, recorrência"],
    ["Síntese", "Classifique, compare com o anterior, decida"],
  ];
  p.forEach((r, i) => {
    const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
    const x = 0.5 + col * 4.6, y = 1.6 + row * 0.82;
    numCircle(s, i + 1, x, y + 0.05, 0.5);
    txt(s, r[0], { x: x + 0.65, y: y + 0.02, w: 3.8, h: 0.35, fontSize: 14, bold: true, color: C.roxo });
    txt(s, r[1], { x: x + 0.65, y: y + 0.36, w: 3.8, h: 0.35, fontSize: 12, color: C.suave });
  });
  txt(s, "Inspirado em mnemônicos como o DR C BRAVADO.", { x: 5.1, y: 4.3, w: 4.4, h: 0.35, fontSize: 10, italic: true, color: C.roxoC });
  footer(s);
  s.addNotes("ROTEIRO (2 min)\n\nO objetivo é ter uma ordem fixa de leitura, para que o seu cérebro não pule etapas quando está cansado.\n\nRepare que 'sinal' e 'contrações' vêm ANTES da frequência cardíaca — foi exatamente aí que estavam as pistas no DPP e no registro materno.\n\n[COMENTÁRIO] Se quiser oferecer um material de apoio (PDF de 1 página), este é o slide para anunciar.");
}

// ── 25 · ENCERRAMENTO ───────────────────────────────
{
  const s = darkSlide();
  s.addShape(pres.shapes.OVAL, { x: 6.8, y: 2.6, w: 5, h: 5, fill: { color: C.lar, transparency: 88 }, line: { color: C.roxo, width: 0 } });
  eyebrow(s, "// PARA LEVAR", 0.6, 0.6, true);
  txt(s, [{ text: "Olho treinado ", options: { color: C.branco } }, { text: "muda desfecho.", options: { color: C.larC, italic: true } }],
    { x: 0.6, y: 0.95, w: 8.5, h: 0.9, fontFace: H, fontSize: 36, bold: true });
  bullets(s, [
    "Onda regular demais não é variabilidade: pense em sinusoidal",
    "Desaceleração rasa + variabilidade caindo = reserva acabando",
    "Traçado liso tem prazo para se explicar",
    "CTG normal não exclui DPP nem outros eventos",
  ], { x: 0.6, y: 2.0, w: 6.2, h: 2.0, fontSize: 15, color: C.lilas });
  card(s, 0.6, 4.05, 6.2, 0.95, C.roxoM);
  txt(s, "Próximo passo: [formação completa / app de classificação SOGC — condição exclusiva para quem assistiu]", { x: 0.8, y: 4.15, w: 5.8, h: 0.75, fontSize: 13, bold: true, color: C.branco, valign: "middle" });
  footer(s, true);
  s.addNotes("ENCERRAMENTO + OFERTA (5–8 min)\n\nRecapitule as 4 mensagens. Depois faça a ponte para a formação completa e/ou o app:\n'Hoje você treinou o olhar para os padrões graves. Na formação, a gente aplica o modelo SOGC no CTG anteparto, traçado a traçado, com o apoio do aplicativo que eu criei.'\n\n[EDITAR] Preencha o card com a oferta real (nome do produto, condição, prazo, link).");
}

// ── 26 · REFERÊNCIAS ────────────────────────────────
{
  const s = lightSlide();
  eyebrow(s, "// REFERÊNCIAS (CONFERIR ANTES DE APRESENTAR)", 0.5, 0.45);
  title(s, "Referências", 0.5, 0.75, 9, 0.6, false, 26);
  bullets(s, [
    "Ayres-de-Campos D, Spong CY, Chandraharan E. FIGO consensus guidelines on intrapartum fetal monitoring: Cardiotocography. Int J Gynaecol Obstet. 2015.",
    "Macones GA et al. The 2008 NICHD workshop report on electronic fetal monitoring. Obstet Gynecol. 2008.",
    "ACOG Practice Bulletin No. 106: Intrapartum fetal heart rate monitoring. 2009.",
    "Dore S, Ehman W. No. 396 – Fetal Health Surveillance: Intrapartum Consensus Guideline. J Obstet Gynaecol Can. 2020.",
    "Modanlou HD, Freeman RK. Sinusoidal fetal heart rate pattern: its definition and clinical significance. Am J Obstet Gynecol. 1982.",
    "Modanlou HD, Murata Y. Sinusoidal heart rate pattern: reappraisal of its definition and clinical significance. J Obstet Gynaecol Res. 2004.",
    "Drew T, Võ ML-H, Wolfe JM. The invisible gorilla strikes again. Psychol Sci. 2013.",
  ], { x: 0.5, y: 1.5, w: 9, h: 3.5, fontSize: 11 });
  footer(s);
  s.addNotes("[COMENTÁRIO] Referências listadas de memória — confira título, ano e periódico de cada uma antes de apresentar. Acrescente a diretriz SOGC de vigilância anteparto que você usa no app.");
}

pres.writeFile({ fileName: OUT }).then(f => console.log("wrote", f));
