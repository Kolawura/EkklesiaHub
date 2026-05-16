/**
 * AutocorrectExtension.ts
 *
 * Watches every keystroke and fixes common mistakes on Space or Enter.
 * Three layers:
 *   1. Common English typos  (teh → the, recieve → receive…)
 *   2. Theological terms     (chirst → Christ, resurection → resurrection…)
 *   3. Smart typography      (" → curly quotes, -- → em dash, ... → ellipsis)
 *
 * All replacements happen silently — they don't interrupt the writing flow.
 * The user can always Ctrl+Z to undo a single replacement.
 */

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

// ─────────────────────────────────────────────────────────────────────────────
// Replacement tables
// ─────────────────────────────────────────────────────────────────────────────

/** Common English typos — word-boundary replacements */
const TYPOS: Record<string, string> = {
  // Articles / pronouns
  teh: "the",
  hte: "the",
  thye: "they",
  adn: "and",
  nad: "and",
  taht: "that",
  tath: "that",
  wiht: "with",
  iwth: "with",
  thier: "their",
  theri: "their",
  recieve: "receive",
  recieved: "received",
  recieves: "receives",
  beleive: "believe",
  beleived: "believed",
  beleives: "believes",
  // Common misspellings
  seperate: "separate",
  seperated: "separated",
  definate: "definite",
  definitly: "definitely",
  occured: "occurred",
  occuring: "occurring",
  begining: "beginning",
  begening: "beginning",
  writting: "writing",
  writen: "written",
  comunity: "community",
  comunities: "communities",
  knowlege: "knowledge",
  aknowledge: "acknowledge",
  judgement: "judgment", // American English
  refered: "referred",
  prefered: "preferred",
  questoin: "question",
  questoins: "questions",
  apostle: "apostle", // already correct — guard
  // Contractions (missing apostrophe)
  dont: "don't",
  doesnt: "doesn't",
  didnt: "didn't",
  cant: "can't",
  wont: "won't",
  isnt: "isn't",
  arent: "aren't",
  wasnt: "wasn't",
  werent: "weren't",
  havent: "haven't",
  hasnt: "hasn't",
  hadnt: "hadn't",
  wouldnt: "wouldn't",
  couldnt: "couldn't",
  shouldnt: "shouldn't",
  ive: "I've",
  id: "I'd",
  im: "I'm",
  ill: "I'll",
  youve: "you've",
  youre: "you're",
  youd: "you'd",
  hes: "he's",
  shes: "she's",
  weve: "we've",
  theyre: "they're",
  thats: "that's",
  its: "it's", // only when used as "it is" — context-blind
  // Double words (handled separately below)
};

/**
 * Theological / faith-specific terms.
 * Lowercase input → correct capitalised output.
 */
const THEOLOGICAL: Record<string, string> = {
  // Names and titles — always capitalised
  chirst: "Christ",
  chrst: "Christ",
  jseus: "Jesus",
  jeuss: "Jesus",
  jessu: "Jesus",
  yeshua: "Yeshua",
  holyspirit: "Holy Spirit",
  "holy spirit": "Holy Spirit",
  holyghost: "Holy Ghost",
  "holy ghost": "Holy Ghost",
  // Books / texts
  genisis: "Genesis",
  geneses: "Genesis",
  exodous: "Exodus",
  exoduse: "Exodus",
  revelaiton: "Revelation",
  revelations: "Revelation",
  pslams: "Psalms",
  psalsm: "Psalms",
  proverbes: "Proverbs",
  deuteronmy: "Deuteronomy",
  deutronomy: "Deuteronomy",
  philippians: "Philippians",
  // Theological concepts
  resurection: "resurrection",
  ressurection: "resurrection",
  resurected: "resurrected",
  ressurected: "resurrected",
  resurects: "resurrects",
  baptisim: "baptism",
  baptizm: "baptism",
  communoin: "communion",
  comunion: "communion",
  eucharست: "Eucharist",
  sanctifacation: "sanctification",
  santification: "sanctification",
  justifacation: "justification",
  predestiantion: "predestination",
  escatology: "eschatology",
  eschatalogy: "eschatology",
  ecclesiology: "ecclesiology",
  eclisiology: "ecclesiology",
  soteriology: "soteriology",
  soteriolgy: "soteriology",
  pneumatology: "pneumatology",
  pneumatolgy: "pneumatology",
  hermeneutics: "hermeneutics",
  exegsis: "exegesis",
  exegises: "exegesis",
  eisegsis: "eisegesis",
  homiletics: "homiletics",
  homeletics: "homiletics",
  propitaition: "propitiation",
  propiation: "propitiation",
  atonment: "atonement",
  atonrment: "atonement",
  consencration: "consecration",
  consecation: "consecration",
  transubstaniation: "transubstantiation",
  consubstantation: "consubstantiation",
  dispensationalism: "dispensationalism",
  armenianism: "Arminianism",
  arminiaism: "Arminianism",
  calvinisim: "Calvinism",
  calvanism: "Calvinism",
  theoloogy: "theology",
  theolgy: "theology",
  apologetics: "apologetics",
  apolegtics: "apologetics",
  denomintaion: "denomination",
  denominaton: "denomination",
  congregaiton: "congregation",
  evangelisim: "evangelism",
  evagenlism: "evangelism",
  missionairy: "missionary",
  misionairy: "missionary",
  desciple: "disciple",
  desciples: "disciples",
  dicsiple: "disciple",
  dicsiples: "disciples",
  patorsal: "pastoral",
  pastrol: "pastoral",
  sermoin: "sermon",
  sermone: "sermon",
  scripure: "scripture",
  scipture: "scripture",
  scritpure: "scripture",
  scirpture: "scripture",
  convenent: "covenant",
  covnenant: "covenant",
  trnasformation: "transformation",
  spirtiual: "spiritual",
  spiriutal: "spiritual",
  righteouss: "righteous",
  rightoeus: "righteous",
  righteosness: "righteousness",
  rightousness: "righteousness",
  forgivness: "forgiveness",
  forgiveness: "forgiveness",
  redemtion: "redemption",
  redmption: "redemption",
  salvaiton: "salvation",
  salvtion: "salvation",
  sanctificaton: "sanctification",
  glorifcation: "glorification",
  temptaion: "temptation",
  temptation: "temptation",
  tribualtion: "tribulation",
  millenium: "millennium",
  milennium: "millennium",
  catholicism: "Catholicism",
  catholicisim: "Catholicism",
  protestantism: "Protestantism",
  protestanism: "Protestantism",
  orthodoxy: "Orthodoxy",
  pentacostal: "Pentecostal",
  pentecostal: "Pentecostal",
  charsimatic: "charismatic",
  charsiamtic: "charismatic",
};

/** Smart typography — applied inline character-by-character */
const SMART_TYPOGRAPHY: [RegExp, string][] = [
  [/--/g, "\u2014"], // -- → em dash —
  [/\.\.\./g, "\u2026"], // ... → ellipsis …
  [/(\d+)x(\d+)/g, "$1\u00D7$2"], // 3x4 → 3×4
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get the word just before the cursor
// ─────────────────────────────────────────────────────────────────────────────
function getWordBefore(text: string): { word: string; start: number } | null {
  // Find the last word boundary
  const match = text.match(/(\S+)$/);
  if (!match) return null;
  return {
    word: match[1],
    start: text.length - match[1].length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// The extension
// ─────────────────────────────────────────────────────────────────────────────
export const AutocorrectExtension = Extension.create({
  name: "autocorrect",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("autocorrect"),

        props: {
          handleKeyDown(view, event) {
            // Only trigger on space, enter, or punctuation after a word
            const triggerKeys = [" ", "Enter", ".", ",", "!", "?", ";", ":"];
            if (!triggerKeys.includes(event.key)) return false;

            const { state } = view;
            const { $from } = state.selection;

            // Get text in the current paragraph before cursor
            const textBefore = $from.parent.textContent.slice(
              0,
              $from.parentOffset,
            );
            if (!textBefore.trim()) return false;

            const wordInfo = getWordBefore(textBefore);
            if (!wordInfo) return false;

            const { word, start } = wordInfo;
            const lower = word.toLowerCase().replace(/[.,!?;:'"()]/g, "");

            // ── 1. Check theological terms first (higher priority) ──
            const theological = THEOLOGICAL[lower];
            if (theological && theological.toLowerCase() !== lower) {
              const from = $from.start() + start;
              const to = $from.start() + start + word.length;
              const tr = state.tr.insertText(theological, from, to);
              view.dispatch(tr);
              return false; // let the trigger key through
            }

            // ── 2. Check common typos ──
            const correction = TYPOS[lower];
            if (correction) {
              // Preserve original capitalisation for sentence starts
              const needsCap =
                start === 0 ||
                textBefore
                  .slice(0, start)
                  .trimEnd()
                  .match(/[.!?]\s*$/);
              const finalCorrection = needsCap
                ? correction.charAt(0).toUpperCase() + correction.slice(1)
                : correction;

              if (finalCorrection.toLowerCase() !== lower) {
                const from = $from.start() + start;
                const to = $from.start() + start + word.length;
                const tr = state.tr.insertText(finalCorrection, from, to);
                view.dispatch(tr);
                return false;
              }
            }

            return false;
          },

          // Smart typography — applied on input transform
          handleTextInput(view, from, to, text) {
            // Apply smart typography replacements
            for (const [pattern, replacement] of SMART_TYPOGRAPHY) {
              const { state } = view;
              const $from = state.selection.$from;
              const textBefore =
                $from.parent.textContent.slice(0, $from.parentOffset) + text;

              const replaced = textBefore.replace(pattern, replacement);
              if (replaced !== textBefore) {
                // Find what changed and insert the corrected character
                const newText = text.replace(pattern, replacement);
                if (newText !== text) {
                  const tr = state.tr.insertText(newText, from, to);
                  view.dispatch(tr);
                  return true; // prevent default insert
                }
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});
