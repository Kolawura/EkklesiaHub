// bible/utils/index.ts

import { ParsedRef } from "../types";

// ─────────────────────────────────────────────────────────────────
// BOOK NAME → NUMBER MAP
// ─────────────────────────────────────────────────────────────────
const BOOK_MAP: Record<string, number> = {
  // OT
  genesis: 1,
  gen: 1,
  ge: 1,
  exodus: 2,
  exo: 2,
  ex: 2,
  exod: 2,
  leviticus: 3,
  lev: 3,
  le: 3,
  numbers: 4,
  num: 4,
  nu: 4,
  deuteronomy: 5,
  deu: 5,
  deut: 5,
  dt: 5,
  joshua: 6,
  jos: 6,
  josh: 6,
  judges: 7,
  jdg: 7,
  judg: 7,
  ruth: 8,
  rut: 8,
  "1 samuel": 9,
  "1samuel": 9,
  "1sa": 9,
  "1sam": 9,
  "i samuel": 9,
  "2 samuel": 10,
  "2samuel": 10,
  "2sa": 10,
  "2sam": 10,
  "ii samuel": 10,
  "1 kings": 11,
  "1kings": 11,
  "1ki": 11,
  "1kgs": 11,
  "2 kings": 12,
  "2kings": 12,
  "2ki": 12,
  "2kgs": 12,
  "1 chronicles": 13,
  "1chronicles": 13,
  "1ch": 13,
  "1chr": 13,
  "2 chronicles": 14,
  "2chronicles": 14,
  "2ch": 14,
  "2chr": 14,
  ezra: 15,
  ezr: 15,
  nehemiah: 16,
  neh: 16,
  esther: 17,
  est: 17,
  esth: 17,
  job: 18,
  psalms: 19,
  psalm: 19,
  psa: 19,
  ps: 19,
  proverbs: 20,
  pro: 20,
  prov: 20,
  ecclesiastes: 21,
  ecc: 21,
  eccl: 21,
  "song of solomon": 22,
  "song of songs": 22,
  sng: 22,
  sos: 22,
  ss: 22,
  isaiah: 23,
  isa: 23,
  jeremiah: 24,
  jer: 24,
  lamentations: 25,
  lam: 25,
  ezekiel: 26,
  ezk: 26,
  ezek: 26,
  daniel: 27,
  dan: 27,
  hosea: 28,
  hos: 28,
  joel: 29,
  joe: 29,
  amos: 30,
  amo: 30,
  obadiah: 31,
  oba: 31,
  jonah: 32,
  jon: 32,
  micah: 33,
  mic: 33,
  nahum: 34,
  nah: 34,
  habakkuk: 35,
  hab: 35,
  zephaniah: 36,
  zep: 36,
  zeph: 36,
  haggai: 37,
  hag: 37,
  zechariah: 38,
  zec: 38,
  zech: 38,
  malachi: 39,
  mal: 39,
  // NT
  matthew: 40,
  mat: 40,
  matt: 40,
  mt: 40,
  mark: 41,
  mrk: 41,
  mk: 41,
  luke: 42,
  luk: 42,
  lk: 42,
  john: 43,
  jhn: 43,
  joh: 43,
  jn: 43,
  acts: 44,
  act: 44,
  romans: 45,
  rom: 45,
  "1 corinthians": 46,
  "1corinthians": 46,
  "1co": 46,
  "1cor": 46,
  "2 corinthians": 47,
  "2corinthians": 47,
  "2co": 47,
  "2cor": 47,
  galatians: 48,
  gal: 48,
  ephesians: 49,
  eph: 49,
  philippians: 50,
  phi: 50,
  php: 50,
  phil: 50,
  colossians: 51,
  col: 51,
  "1 thessalonians": 52,
  "1thessalonians": 52,
  "1th": 52,
  "1thes": 52,
  "2 thessalonians": 53,
  "2thessalonians": 53,
  "2th": 53,
  "2thes": 53,
  "1 timothy": 54,
  "1timothy": 54,
  "1ti": 54,
  "1tim": 54,
  "2 timothy": 55,
  "2timothy": 55,
  "2ti": 55,
  "2tim": 55,
  titus: 56,
  tit: 56,
  philemon: 57,
  phm: 57,
  phlm: 57,
  hebrews: 58,
  heb: 58,
  james: 59,
  jas: 59,
  jam: 59,
  "1 peter": 60,
  "1peter": 60,
  "1pe": 60,
  "1pet": 60,
  "2 peter": 61,
  "2peter": 61,
  "2pe": 61,
  "2pet": 61,
  "1 john": 62,
  "1john": 62,
  "1jn": 62,
  "2 john": 63,
  "2john": 63,
  "2jn": 63,
  "3 john": 64,
  "3john": 64,
  "3jn": 64,
  jude: 65,
  jud: 65,
  revelation: 66,
  rev: 66,
  apoc: 66,
};

const BOOK_NAMES: Record<number, string> = {
  1: "Genesis",
  2: "Exodus",
  3: "Leviticus",
  4: "Numbers",
  5: "Deuteronomy",
  6: "Joshua",
  7: "Judges",
  8: "Ruth",
  9: "1 Samuel",
  10: "2 Samuel",
  11: "1 Kings",
  12: "2 Kings",
  13: "1 Chronicles",
  14: "2 Chronicles",
  15: "Ezra",
  16: "Nehemiah",
  17: "Esther",
  18: "Job",
  19: "Psalms",
  20: "Proverbs",
  21: "Ecclesiastes",
  22: "Song of Songs",
  23: "Isaiah",
  24: "Jeremiah",
  25: "Lamentations",
  26: "Ezekiel",
  27: "Daniel",
  28: "Hosea",
  29: "Joel",
  30: "Amos",
  31: "Obadiah",
  32: "Jonah",
  33: "Micah",
  34: "Nahum",
  35: "Habakkuk",
  36: "Zephaniah",
  37: "Haggai",
  38: "Zechariah",
  39: "Malachi",
  40: "Matthew",
  41: "Mark",
  42: "Luke",
  43: "John",
  44: "Acts",
  45: "Romans",
  46: "1 Corinthians",
  47: "2 Corinthians",
  48: "Galatians",
  49: "Ephesians",
  50: "Philippians",
  51: "Colossians",
  52: "1 Thessalonians",
  53: "2 Thessalonians",
  54: "1 Timothy",
  55: "2 Timothy",
  56: "Titus",
  57: "Philemon",
  58: "Hebrews",
  59: "James",
  60: "1 Peter",
  61: "2 Peter",
  62: "1 John",
  63: "2 John",
  64: "3 John",
  65: "Jude",
  66: "Revelation",
};

export function resolveBookNumber(input: string): number | null {
  return BOOK_MAP[input.toLowerCase().trim()] ?? null;
}

export function getBookName(number: number): string {
  return BOOK_NAMES[number] ?? "Unknown";
}

// ─────────────────────────────────────────────────────────────────
// REFERENCE PARSER
// ─────────────────────────────────────────────────────────────────
export function parseReference(ref: string): ParsedRef {
  const trimmed = ref.trim();
  const match = trimmed.match(
    /^([\d\s]*[a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i,
  );
  if (!match) {
    return {
      book_name: "",
      book_number: 0,
      chapter: 0,
      verse_start: null,
      verse_end: null,
      valid: false,
      error: `Cannot parse "${trimmed}". Try: "John 3:16" or "Psalm 23"`,
    };
  }
  const bookInput = match[1].trim();
  const book_number = resolveBookNumber(bookInput);
  if (!book_number) {
    return {
      book_name: bookInput,
      book_number: 0,
      chapter: 0,
      verse_start: null,
      verse_end: null,
      valid: false,
      error: `Book "${bookInput}" not found.`,
    };
  }
  return {
    book_name: BOOK_NAMES[book_number],
    book_number,
    chapter: parseInt(match[2]),
    verse_start: match[3] ? parseInt(match[3]) : null,
    verse_end: match[4] ? parseInt(match[4]) : null,
    valid: true,
  };
}

// ─────────────────────────────────────────────────────────────────
// VERSE OF THE DAY POOL — 365 entries, one per day of the year
// Deterministic: same verse for every user on the same calendar day.
// Spans the full breadth of scripture — OT and NT, poetry and
// prophecy, epistles and gospels, wisdom and narrative.
// ─────────────────────────────────────────────────────────────────
export const VOTD_POOL: Array<{
  book_name: string;
  book_number: number;
  chapter: number;
  verse: number;
  reflection: string;
}> = [
  // ── JANUARY (1–31) ──
  {
    book_name: "John",
    book_number: 43,
    chapter: 3,
    verse: 16,
    reflection:
      "God's love is not a feeling — it is an action. What does it mean to you that He gave?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 23,
    verse: 1,
    reflection:
      "The Lord is your shepherd. In what area of life are you most aware of His leading today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 28,
    reflection:
      "All things — not some things. How does this promise reshape your perspective on difficulty?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 4,
    verse: 13,
    reflection:
      "Strength through Christ, not willpower. Where do you need to draw from that source today?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 40,
    verse: 31,
    reflection:
      "Waiting is not passive. It is active trust. What are you waiting on God for right now?",
  },
  {
    book_name: "Jeremiah",
    book_number: 24,
    chapter: 29,
    verse: 11,
    reflection:
      "Plans for a future and a hope — spoken to people in exile. What does that say about your present?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 3,
    verse: 5,
    reflection:
      "Trust with your whole heart. Which part of your heart is hardest to surrender?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 11,
    verse: 28,
    reflection:
      "Jesus invites the weary. What burdens have you been carrying that He never asked you to?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 2,
    reflection:
      "Transformed by the renewing of your mind. What thought pattern needs transforming today?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 2,
    verse: 8,
    reflection:
      "Grace, not effort. How does this change the way you approach your relationship with God?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 46,
    verse: 10,
    reflection:
      "Be still. In a world of noise, what does stillness with God look like for you?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 5,
    verse: 22,
    reflection:
      "Fruit grows — it is not performed. Which fruit is most evident in your life right now?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 11,
    verse: 1,
    reflection:
      "Faith is the substance of things hoped for. What are you hoping for that you cannot yet see?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 13,
    verse: 4,
    reflection:
      "Love is patient, love is kind. How is your love being refined in your relationships?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 6,
    verse: 33,
    reflection:
      "Seek first the kingdom. What would your morning look like if this came before everything else?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 119,
    verse: 105,
    reflection:
      "A lamp to my feet — not a floodlight for the whole path. Are you comfortable with one step at a time?",
  },
  {
    book_name: "2 Timothy",
    book_number: 55,
    chapter: 3,
    verse: 16,
    reflection:
      "All scripture is God-breathed. How does this shape the way you approach reading His Word?",
  },
  {
    book_name: "Joshua",
    book_number: 6,
    chapter: 1,
    verse: 9,
    reflection:
      "Be strong and courageous. What is God calling you to step into that requires that courage?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 5,
    verse: 8,
    reflection:
      "While we were still sinners. Love that doesn't wait for us to be worthy.",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 4,
    verse: 6,
    reflection:
      "In everything, by prayer and petition. What is the difference between worry and petition?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 41,
    verse: 10,
    reflection:
      "Do not fear, for I am with you. What fear is God speaking directly into today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 1,
    verse: 1,
    reflection:
      "Blessed is the one who does not walk in step with the wicked. Where are your feet taking you?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 10,
    verse: 10,
    reflection:
      "Life to the full. Is that what your faith feels like right now? If not, what's missing?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 1,
    verse: 16,
    reflection:
      "Not ashamed of the gospel. In what context do you find it hardest to speak of your faith?",
  },
  {
    book_name: "Micah",
    book_number: 33,
    chapter: 6,
    verse: 8,
    reflection:
      "Act justly, love mercy, walk humbly. Which of the three needs the most attention right now?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 34,
    verse: 8,
    reflection:
      "Taste and see that the Lord is good. When did you last truly taste His goodness?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 4,
    verse: 23,
    reflection:
      "Guard your heart above all else. What are you allowing in that you shouldn't be?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 14,
    verse: 6,
    reflection:
      "The way, the truth, and the life. Which of these three do you most need Jesus to be for you today?",
  },
  {
    book_name: "2 Corinthians",
    book_number: 47,
    chapter: 5,
    verse: 17,
    reflection:
      "A new creation. In what area of your life do you most need that newness to become real?",
  },
  {
    book_name: "Lamentations",
    book_number: 25,
    chapter: 3,
    verse: 23,
    reflection:
      "New every morning. What from yesterday are you grateful God did not carry into today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 27,
    verse: 1,
    reflection:
      "The Lord is my light and salvation — whom shall I fear? What are you afraid of right now?",
  },

  // ── FEBRUARY (32–59) ──
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 43,
    verse: 2,
    reflection:
      "When you pass through the waters, I will be with you. What flood are you currently walking through?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 16,
    reflection:
      "Let your light shine. Are you hiding it under something right now?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 3,
    verse: 23,
    reflection:
      "Whatever you do, work at it with all your heart. How does this verse transform mundane work?",
  },
  {
    book_name: "1 John",
    book_number: 62,
    chapter: 4,
    verse: 19,
    reflection:
      "We love because He first loved us. Is your love for others flowing from His love for you?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 139,
    verse: 14,
    reflection:
      "Fearfully and wonderfully made. Do you believe this about yourself today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 1,
    reflection:
      "No condemnation. What condemnation are you still carrying that this verse sets free?",
  },
  {
    book_name: "James",
    book_number: 59,
    chapter: 1,
    verse: 2,
    reflection:
      "Consider it pure joy when you face trials. What trial can you reframe with this lens today?",
  },
  {
    book_name: "Deuteronomy",
    book_number: 5,
    chapter: 31,
    verse: 6,
    reflection:
      "He will never leave you nor forsake you. When have you felt that most deeply?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 9,
    reflection:
      "Blessed are the peacemakers. Where are you being called to be a peacemaker right now?",
  },
  {
    book_name: "Genesis",
    book_number: 1,
    chapter: 1,
    verse: 1,
    reflection:
      "In the beginning, God. Before everything — God. How does starting with God change how you see your day?",
  },
  {
    book_name: "1 Peter",
    book_number: 60,
    chapter: 5,
    verse: 7,
    reflection:
      "Cast all your anxiety on Him. What does it mean to actually cast, rather than just acknowledge?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 55,
    verse: 8,
    reflection:
      "My thoughts are not your thoughts. How does this truth bring comfort when life doesn't make sense?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 37,
    verse: 4,
    reflection:
      "Delight yourself in the Lord. Is your relationship with God a delight or a duty right now?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 38,
    reflection:
      "Nothing can separate us from His love. What have you been afraid would separate you?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 3,
    verse: 20,
    reflection:
      "Immeasurably more than we ask or imagine. Are your prayers big enough?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 15,
    verse: 5,
    reflection:
      "Apart from me you can do nothing. What are you currently trying to accomplish in your own strength?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 91,
    verse: 1,
    reflection:
      "He who dwells in the shelter of the Most High. Are you dwelling, or just visiting?",
  },
  {
    book_name: "2 Timothy",
    book_number: 55,
    chapter: 1,
    verse: 7,
    reflection:
      "A spirit of power, love, and self-discipline — not fear. Which of the three do you most need today?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 17,
    verse: 17,
    reflection:
      "A friend loves at all times. Are you being that kind of friend to someone right now?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 22,
    verse: 37,
    reflection:
      "Love the Lord with all your heart, soul, and mind. Which of the three is hardest for you?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 26,
    verse: 3,
    reflection:
      "Perfect peace to those whose minds are fixed on You. Where is your mind fixed today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 15,
    verse: 13,
    reflection:
      "May the God of hope fill you with joy and peace. What would you do with that fullness?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 100,
    verse: 5,
    reflection:
      "His love endures forever, His faithfulness continues. How has His faithfulness shown up in your story?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 1,
    verse: 37,
    reflection:
      "Nothing is impossible with God. What have you stopped believing He can do?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 12,
    verse: 1,
    reflection:
      "Run with perseverance the race marked out for you. What weight do you need to throw off?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 10,
    verse: 13,
    reflection:
      "No temptation beyond what you can bear. What does the 'way out' look like in your situation?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 4,
    verse: 19,
    reflection:
      "My God will meet all your needs. Which need are you most struggling to trust Him with?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 121,
    verse: 2,
    reflection:
      "My help comes from the Lord. Where are you looking for help that isn't lasting?",
  },

  // ── MARCH (60–90) ──
  {
    book_name: "James",
    book_number: 59,
    chapter: 4,
    verse: 8,
    reflection:
      "Draw near to God and He will draw near to you. What would drawing near look like today?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 16,
    verse: 3,
    reflection:
      "Commit your plans to the Lord. Which plan are you still holding tightly?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 8,
    verse: 32,
    reflection:
      "The truth will set you free. What truth do you need to sit with today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 26,
    reflection:
      "The Spirit intercedes for us with groans. What prayer are you too exhausted to put into words?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 61,
    verse: 1,
    reflection:
      "He has sent me to bind up the brokenhearted. Where is your heart broken right now?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 6,
    verse: 9,
    reflection:
      "Our Father in heaven. What does it mean to you, right now, to have a Father like this?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 51,
    verse: 10,
    reflection:
      "Create in me a pure heart. What impurity is weighing on your heart that needs His cleansing?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 6,
    verse: 10,
    reflection:
      "Be strong in the Lord and His mighty power. Where are you fighting in your own strength?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 31,
    verse: 25,
    reflection:
      "She is clothed with strength and dignity. What does it mean to be clothed in those things today?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 1,
    verse: 27,
    reflection:
      "God chose the weak things. How does this reframe the places you feel insufficient?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 145,
    verse: 18,
    reflection:
      "The Lord is near to all who call on Him. What would you say if you truly believed He was near?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 1,
    verse: 17,
    reflection:
      "In Him all things hold together. Where does your life feel like it's falling apart right now?",
  },
  {
    book_name: "1 John",
    book_number: 62,
    chapter: 1,
    verse: 9,
    reflection:
      "He is faithful and just to forgive. Is there something you haven't brought to Him yet?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 16,
    verse: 33,
    reflection:
      "Take heart! I have overcome the world. Which world problem feels most unconquerable today?",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 1,
    verse: 8,
    reflection:
      "You will receive power. For what purpose do you need His power in your life right now?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 16,
    verse: 11,
    reflection:
      "Fullness of joy in His presence. When did you last experience genuine joy in being with God?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 12,
    reflection:
      "Be joyful in hope, patient in affliction, faithful in prayer. Which of the three is hardest for you?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 2,
    verse: 20,
    reflection:
      "Christ lives in me. What would change today if you lived as though this were fully real?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 64,
    verse: 8,
    reflection:
      "We are the clay, You are the potter. Are you resisting the shaping right now?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 28,
    verse: 20,
    reflection:
      "I am with you always. In what moment do you most forget that He is there?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 73,
    verse: 26,
    reflection:
      "My flesh and heart may fail, but God is the strength of my heart. What is failing in you right now?",
  },
  {
    book_name: "2 Corinthians",
    book_number: 47,
    chapter: 4,
    verse: 17,
    reflection:
      "Light and momentary troubles. How do you hold together pain that is real with glory that is coming?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 4,
    verse: 16,
    reflection:
      "Approach the throne of grace with confidence. What have you been too afraid to bring to Him?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 22,
    verse: 6,
    reflection:
      "Train up a child in the way they should go. What were you trained in that you are still walking in?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 1,
    verse: 14,
    reflection:
      "The Word became flesh. What does it mean to you that God chose to become fully human?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 10,
    verse: 17,
    reflection:
      "Faith comes from hearing. What are you consistently feeding your ears and mind with?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 40,
    verse: 1,
    reflection:
      "I waited patiently for the Lord. What are you in the middle of waiting for right now?",
  },
  {
    book_name: "1 Thessalonians",
    book_number: 52,
    chapter: 5,
    verse: 18,
    reflection:
      "Give thanks in all circumstances. What circumstance are you finding hardest to be thankful in?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 7,
    verse: 7,
    reflection:
      "Ask, seek, knock. Which of the three postures describes where you are with God right now?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 53,
    verse: 5,
    reflection:
      "By His wounds we are healed. What wound in your life needs that healing today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 62,
    verse: 1,
    reflection:
      "My soul finds rest in God alone. What else have you been resting your soul in?",
  },

  // ── APRIL (91–120) ──
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 15,
    verse: 20,
    reflection:
      "While he was still a long way off, his father saw him. What would it mean to run toward God today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 18,
    reflection:
      "Our present sufferings are not worth comparing with the glory to come. Does this help you today?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 11,
    verse: 35,
    reflection:
      "Jesus wept. What does it mean to you that God is moved by your grief?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 22,
    verse: 1,
    reflection:
      "My God, why have you forsaken me? Even Jesus prayed this. What raw prayer needs to come out of you?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 15,
    verse: 55,
    reflection:
      "Where, O death, is your sting? How does the resurrection change how you face loss?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 27,
    verse: 46,
    reflection:
      "Why have you forsaken me? Jesus entered abandonment so we never have to. Let that sink in.",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 2,
    verse: 18,
    reflection:
      "Because He suffered when He was tempted, He can help those who are being tempted. Where do you need His help?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 6,
    verse: 23,
    reflection:
      "The gift of God is eternal life. What does it mean to have received a gift you could never earn?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 24,
    verse: 6,
    reflection:
      "He is not here — He has risen. What does it mean for your daily life that Jesus is alive?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 20,
    verse: 29,
    reflection:
      "Blessed are those who have not seen and yet believed. What does faith without seeing look like for you?",
  },
  {
    book_name: "2 Corinthians",
    book_number: 47,
    chapter: 1,
    verse: 3,
    reflection:
      "The God of all comfort. How has He comforted you in the past so you can comfort others?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 30,
    verse: 5,
    reflection:
      "Weeping may last for a night, but joy comes in the morning. What night are you still in?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 53,
    verse: 4,
    reflection:
      "He took up our pain and bore our suffering. What pain have you been carrying alone?",
  },
  {
    book_name: "Revelation",
    book_number: 66,
    chapter: 21,
    verse: 4,
    reflection:
      "He will wipe every tear from their eyes. Which tear do you most need to believe He will wipe away?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 34,
    reflection:
      "Christ Jesus is at the right hand of God, interceding for us. He is praying for you right now.",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 2,
    verse: 42,
    reflection:
      "They devoted themselves to teaching, fellowship, breaking bread, and prayer. What is your community devoted to?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 118,
    verse: 24,
    reflection:
      "This is the day the Lord has made. What would it look like to truly rejoice in this specific day?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 21,
    verse: 17,
    reflection:
      "Peter, do you love me? Three denials, three questions. How does Jesus restore the broken?",
  },
  {
    book_name: "1 Peter",
    book_number: 60,
    chapter: 1,
    verse: 8,
    reflection:
      "Though you have not seen Him, you love Him. What fuels love for someone you cannot see?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 3,
    verse: 1,
    reflection:
      "Set your heart on things above. What earthly thing keeps pulling your heart back down?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 1,
    verse: 3,
    reflection:
      "Every spiritual blessing in the heavenly realms. Which blessing are you most taking for granted?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 17,
    reflection:
      "Co-heirs with Christ — if indeed we share in His sufferings. What does suffering as an heir mean?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 14,
    verse: 27,
    reflection:
      "Peace I leave with you — not as the world gives. What is the difference between His peace and peace the world offers?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 8,
    verse: 4,
    reflection:
      "What is mankind that you are mindful of them? How does God's attention to you shape your sense of worth?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 6,
    verse: 8,
    reflection:
      "Here am I — send me. When did you last say those words, and mean them?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 3,
    reflection:
      "Blessed are the poor in spirit. What would it mean to embrace spiritual poverty today?",
  },
  {
    book_name: "James",
    book_number: 59,
    chapter: 1,
    verse: 22,
    reflection:
      "Be doers of the word, not hearers only. What truth have you heard recently that you haven't acted on?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 10,
    verse: 27,
    reflection:
      "Love your neighbour as yourself. Who is your neighbour that you've been neglecting?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 27,
    verse: 17,
    reflection:
      "As iron sharpens iron. Who in your life is sharpening you? Are you allowing it?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 32,
    verse: 7,
    reflection:
      "You are my hiding place. Where do you go when you need to hide from the world?",
  },

  // ── MAY (121–151) ──
  {
    book_name: "John",
    book_number: 43,
    chapter: 15,
    verse: 13,
    reflection:
      "Greater love has no one than this — to lay down one's life. Where is love costing you something today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 10,
    reflection:
      "Be devoted to one another in love. What would devotion look like in your closest relationships?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 42,
    verse: 11,
    reflection:
      "Why are you downcast, O my soul? Put your hope in God. Are you honestly talking to your own soul?",
  },
  {
    book_name: "1 John",
    book_number: 62,
    chapter: 3,
    verse: 1,
    reflection:
      "What great love the Father has lavished on us. When did you last feel lavished with His love?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 4,
    verse: 32,
    reflection:
      "Be kind and compassionate, forgiving one another. Who have you been withholding forgiveness from?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 11,
    verse: 14,
    reflection:
      "Victory is won through many advisers. Who are you letting speak into your decisions?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 44,
    reflection:
      "Love your enemies. Who is the hardest person in your life to love right now?",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 4,
    verse: 31,
    reflection:
      "They were all filled with the Holy Spirit and spoke the word of God boldly. What would bold look like for you?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 19,
    verse: 1,
    reflection:
      "The heavens declare the glory of God. When did creation last move you to worship?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 11,
    verse: 33,
    reflection:
      "Oh, the depth of the riches of the wisdom and knowledge of God! What mystery about God moves you most?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 4,
    verse: 24,
    reflection:
      "God is spirit, and His worshippers must worship in spirit and in truth. What does true worship cost you?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 30,
    verse: 21,
    reflection:
      "This is the way; walk in it. How do you discern God's voice when you are at a crossroads?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 13,
    verse: 8,
    reflection:
      "Jesus Christ is the same yesterday and today and forever. What change are you facing that this anchors?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 63,
    verse: 1,
    reflection:
      "My soul thirsts for you. How thirsty for God are you right now? What is satisfying that thirst instead?",
  },
  {
    book_name: "2 Corinthians",
    book_number: 47,
    chapter: 12,
    verse: 9,
    reflection:
      "My power is made perfect in weakness. What weakness are you most ashamed of right now?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 6,
    verse: 38,
    reflection:
      "Give, and it will be given to you. What have you been withholding that you could give?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 6,
    verse: 2,
    reflection:
      "Carry each other's burdens. Whose burden could you help carry today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 84,
    verse: 1,
    reflection:
      "How lovely is your dwelling place. When did you last feel at home in God's presence?",
  },
  {
    book_name: "1 Timothy",
    book_number: 54,
    chapter: 6,
    verse: 6,
    reflection:
      "Godliness with contentment is great gain. What are you pursuing instead of contentment right now?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 58,
    verse: 6,
    reflection:
      "Loose the chains of injustice. What injustice in your world is God calling you to act on?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 6,
    verse: 35,
    reflection:
      "I am the bread of life. What are you feeding on that isn't nourishing you?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 13,
    verse: 14,
    reflection:
      "Clothe yourself with the Lord Jesus Christ. What would it look like to put on Christ today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 103,
    verse: 12,
    reflection:
      "As far as the east is from the west, so far has He removed our transgressions. Do you believe you are forgiven?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 13,
    verse: 31,
    reflection:
      "The kingdom of heaven is like a mustard seed. What small act of faithfulness are you underestimating?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 2,
    verse: 9,
    reflection:
      "No eye has seen what God has prepared. How does the promise of what's coming change how you face today?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 18,
    verse: 1,
    reflection:
      "Jesus told them to pray and not give up. What prayer are you on the verge of abandoning?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 55,
    verse: 22,
    reflection:
      "Cast your cares on the Lord and He will sustain you. What care are you still carrying alone?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 10,
    verse: 19,
    reflection:
      "Sin is not ended by multiplying words. When does your tongue get you into trouble?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 10,
    verse: 25,
    reflection:
      "Do not give up meeting together. What is your community giving you that you couldn't get alone?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 17,
    verse: 21,
    reflection:
      "That they may be one as we are one. What divides you from other believers that shouldn't?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 130,
    verse: 5,
    reflection:
      "I wait for the Lord, my whole being waits. What posture does waiting require of you?",
  },

  // ── JUNE (152–181) ──
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 38,
    reflection:
      "Neither death nor life can separate us. Make a list of the things you've feared might push you away from God.",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 48,
    verse: 17,
    reflection:
      "I am the Lord your God, who teaches you what is best. Are you letting Him teach you, or fighting the lesson?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 8,
    reflection:
      "Blessed are the pure in heart, for they will see God. What in your heart is clouding your view of Him?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 18,
    verse: 2,
    reflection:
      "The Lord is my rock, my fortress, my deliverer. What are you using as your fortress instead of Him?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 5,
    verse: 15,
    reflection:
      "Be very careful how you live — redeeming the time. How are you spending the hours you've been given?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 3,
    verse: 30,
    reflection:
      "He must become greater; I must become less. In what area of your life do you most need to step back?",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 20,
    verse: 35,
    reflection:
      "It is more blessed to give than to receive. What generous act have you been putting off?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 25,
    verse: 11,
    reflection:
      "A word aptly spoken is like apples of gold. What word of encouragement does someone near you need today?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 2,
    verse: 3,
    reflection:
      "In humility value others above yourselves. Who are you currently valuing less than they deserve?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 107,
    verse: 1,
    reflection:
      "Give thanks to the Lord, for He is good. His love endures forever. What enduring goodness can you name today?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 12,
    verse: 34,
    reflection:
      "Where your treasure is, your heart will be also. Where is your treasure buried right now?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 12,
    verse: 2,
    reflection:
      "God is my salvation — I will trust and not be afraid. What are you afraid of that faith would resolve?",
  },
  {
    book_name: "1 John",
    book_number: 62,
    chapter: 2,
    verse: 15,
    reflection:
      "Do not love the world or anything in the world. What has the world gotten a grip on in your heart?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 1,
    reflection:
      "A living sacrifice. What would it mean for your body and daily choices to be an act of worship?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 6,
    verse: 24,
    reflection:
      "You cannot serve both God and money. Where does money compete with God for your loyalty?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 4,
    verse: 8,
    reflection:
      "In peace I will lie down and sleep. What anxious thought is keeping you from resting in Him?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 3,
    verse: 28,
    reflection:
      "Neither Jew nor Gentile, slave nor free. What division in the church wounds you most?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 2,
    verse: 6,
    reflection:
      "Continue to live your lives in Him. How is your daily walk different because of His presence?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 9,
    verse: 25,
    reflection:
      "I was blind but now I see. What spiritual blindness has God removed from you?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 116,
    verse: 15,
    reflection:
      "Precious in the sight of the Lord is the death of His faithful servants. What would you want said at your funeral?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 42,
    verse: 3,
    reflection:
      "A bruised reed He will not break. Where are you bruised? He will not break you.",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 12,
    verse: 27,
    reflection:
      "You are the body of Christ. Which part of the body are you? Are you functioning in it?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 14,
    verse: 17,
    reflection:
      "The kingdom of God is righteousness, peace, and joy. Which of these three do you most lack right now?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 14,
    verse: 12,
    reflection:
      "There is a way that appears right, but in the end it leads to death. How do you test your paths?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 6,
    verse: 19,
    reflection:
      "We have this hope as an anchor for the soul. What storm are you needing an anchor in right now?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 10,
    verse: 39,
    reflection:
      "Whoever loses their life for my sake will find it. What are you holding onto that you need to release?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 25,
    verse: 4,
    reflection:
      "Show me your ways, Lord, teach me your paths. What new path do you need guidance on?",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 17,
    verse: 28,
    reflection:
      "In Him we live and move and have our being. How aware are you of His constant presence in your movement?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 21,
    verse: 19,
    reflection:
      "Stand firm, and you will win life. What is wearing away at your ability to stand firm right now?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 13,
    verse: 35,
    reflection:
      "By this everyone will know that you are my disciples — if you love one another. Are you known by your love?",
  },

  // ── JULY (182–212) ──
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 150,
    verse: 6,
    reflection:
      "Let everything that has breath praise the Lord. Is your breath being used to praise?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 9,
    verse: 6,
    reflection:
      "Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. Which title do you need most today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 9,
    verse: 15,
    reflection:
      "I will have mercy on whom I have mercy. How does the freeness of God's mercy change how you receive it?",
  },
  {
    book_name: "Revelation",
    book_number: 66,
    chapter: 3,
    verse: 20,
    reflection:
      "I stand at the door and knock. Is there a door in your heart that you haven't opened to Him?",
  },
  {
    book_name: "1 Thessalonians",
    book_number: 52,
    chapter: 4,
    verse: 11,
    reflection:
      "Lead a quiet life and work with your hands. What would faithfulness in the ordinary look like today?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 14,
    reflection:
      "You are the light of the world. A city on a hill cannot be hidden. Where are you hiding your light?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 112,
    verse: 1,
    reflection:
      "Blessed are those who fear the Lord, who find great delight in His commands. Are His commands a delight to you?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 6,
    reflection:
      "The mind governed by the Spirit is life and peace. What is governing your mind right now?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 2,
    verse: 10,
    reflection:
      "We are God's handiwork, created to do good works. What good work were you made for?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 15,
    verse: 1,
    reflection:
      "A gentle answer turns away wrath. When is your answer least gentle? What triggers harshness in you?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 7,
    verse: 38,
    reflection:
      "Streams of living water will flow from within them. Is your life producing that kind of overflow?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 1,
    verse: 18,
    reflection:
      "Though your sins are like scarlet, they shall be as white as snow. What stain do you need to believe is gone?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 4,
    verse: 2,
    reflection:
      "Devote yourselves to prayer, being watchful and thankful. Which of those three needs more attention?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 126,
    verse: 5,
    reflection:
      "Those who sow with tears will reap with songs of joy. What are you sowing in tears right now?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 14,
    verse: 28,
    reflection:
      "Count the cost first. What decision are you making without counting the cost?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 17,
    reflection:
      "Do not repay anyone evil for evil. Where are you most tempted toward revenge right now?",
  },
  {
    book_name: "James",
    book_number: 59,
    chapter: 3,
    verse: 17,
    reflection:
      "Wisdom from heaven is pure, peaceable, gentle. Does your wisdom match this description?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 18,
    verse: 20,
    reflection:
      "Where two or three gather in my name, there am I. Who do you need to pray with today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 138,
    verse: 3,
    reflection:
      "When I called, you answered me. What answered prayer are you taking for granted?",
  },
  {
    book_name: "1 Peter",
    book_number: 60,
    chapter: 4,
    verse: 8,
    reflection:
      "Love covers over a multitude of sins. What sin in someone close to you are you refusing to cover?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 15,
    verse: 16,
    reflection:
      "You did not choose me — I chose you. What does it mean that your relationship with God started with His pursuit?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 3,
    verse: 13,
    reflection:
      "Encourage one another daily. Who have you encouraged this week? Who needs it today?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 4,
    verse: 7,
    reflection:
      "You are no longer a slave but a child of God — an heir. Are you living as a slave or as an heir?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 56,
    verse: 3,
    reflection:
      "When I am afraid, I put my trust in you. When do you put your trust in other things instead?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 13,
    verse: 12,
    reflection:
      "Hope deferred makes the heart sick. What hope have you been carrying so long it has made you weary?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 35,
    verse: 4,
    reflection:
      "Your God will come — He will come to save you. What situation in your life needs that promised coming?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 22,
    verse: 42,
    reflection:
      "Not my will, but yours. In what area of your life is that the hardest prayer to pray?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 136,
    verse: 1,
    reflection:
      "His love endures forever — mentioned 26 times in one Psalm. What needs to be said that many times to sink in?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 4,
    verse: 29,
    reflection:
      "Let no unwholesome word come out of your mouth. What word have you spoken recently that failed this test?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 9,
    verse: 37,
    reflection:
      "The harvest is plentiful but the workers are few. Are you working in the harvest, or watching from the edge?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 12,
    verse: 24,
    reflection:
      "A grain of wheat must fall into the earth and die. What in your life needs to die so something greater can grow?",
  },

  // ── AUGUST (213–243) ──
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 15,
    reflection:
      "You received the Spirit of adoption. What would it change if you truly believed God wanted you as His child?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 5,
    verse: 3,
    reflection:
      "In the morning I lay my requests before you and wait expectantly. Is your morning a place of expectant prayer?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 3,
    verse: 16,
    reflection:
      "You yourselves are God's temple. How does this change how you treat your body and mind?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 25,
    verse: 8,
    reflection:
      "He will swallow up death forever and wipe away all tears. Which grief do you most need this promise to cover?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 48,
    reflection:
      "Be perfect as your heavenly Father is perfect. What does this mean if perfection is impossible in this life?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 6,
    verse: 6,
    reflection:
      "Go to the ant — see how it stores its provisions. What preparation is wise for your current season?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 3,
    verse: 16,
    reflection:
      "Let the message of Christ dwell richly among you. Is His word dwelling in your home and conversations?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 90,
    verse: 12,
    reflection:
      "Teach us to number our days. How does the brevity of life change how you want to spend today?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 2,
    verse: 5,
    reflection:
      "Do whatever He tells you. What has He been telling you that you haven't done yet?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 5,
    verse: 8,
    reflection:
      "He learned obedience through what He suffered. How is suffering teaching you obedience right now?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 16,
    verse: 19,
    reflection:
      "Be wise about what is good and innocent about what is evil. What have you been feeding your mind with?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 54,
    verse: 10,
    reflection:
      "My unfailing love for you will not be shaken. What in your life has been shaken that His love won't be?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 11,
    verse: 28,
    reflection:
      "Blessed rather are those who hear the word of God and obey it. What word are you hearing but not obeying?",
  },
  {
    book_name: "1 John",
    book_number: 62,
    chapter: 4,
    verse: 4,
    reflection:
      "The one in you is greater than the one in the world. How does this change how you face opposition?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 66,
    verse: 10,
    reflection:
      "You refined us like silver. What refining are you currently in the middle of?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 23,
    verse: 11,
    reflection:
      "The greatest among you will be your servant. Who could you serve today in a way that costs you something?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 21,
    verse: 2,
    reflection:
      "Every way of a man is right in his own eyes, but the Lord weighs the heart. What is He weighing in yours?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 6,
    verse: 9,
    reflection:
      "Let us not grow weary in doing good. Where is your weariness in doing good most acute right now?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 71,
    verse: 5,
    reflection:
      "For you have been my hope, O Lord. What has been your hope this year — really?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 5,
    verse: 24,
    reflection:
      "Whoever hears my word and believes has crossed over from death to life. When did you cross?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 1,
    verse: 17,
    reflection:
      "May He give you wisdom and revelation so that you may know Him better. Is knowing Him better your goal?",
  },
  {
    book_name: "Deuteronomy",
    book_number: 5,
    chapter: 8,
    verse: 3,
    reflection:
      "Man does not live on bread alone. What are you feeding yourself spiritually that matches your physical appetite?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 143,
    verse: 8,
    reflection:
      "Let the morning bring me word of your unfailing love. What would it look like to begin your mornings this way?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 19,
    reflection:
      "Leave room for God's wrath. Who has wronged you that you need to release into His hands?",
  },
  {
    book_name: "Acts",
    book_number: 44,
    chapter: 5,
    verse: 29,
    reflection:
      "We must obey God rather than human beings. Where is cultural pressure conflicting with God's commands for you?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 31,
    verse: 24,
    reflection:
      "Be strong and take heart, all you who hope in the Lord. Where are you most needing a strong heart?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 18,
    verse: 37,
    reflection:
      "Everyone on the side of truth listens to me. What truth have you been reluctant to hear?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 66,
    verse: 1,
    reflection:
      "Heaven is my throne, the earth my footstool. What does the vastness of God mean for your specific problem?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 15,
    verse: 58,
    reflection:
      "Your labour in the Lord is not in vain. What labour feels most pointless right now that this verse addresses?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 19,
    verse: 21,
    reflection:
      "Many are the plans in a person's heart, but the Lord's purpose prevails. Which of your plans are you gripping too tightly?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 9,
    verse: 23,
    reflection:
      "Take up your cross daily. What does your specific cross look like today? Not in general — today specifically?",
  },

  // ── SEPTEMBER (244–273) ──
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 145,
    verse: 3,
    reflection:
      "Great is the Lord and most worthy of praise — His greatness no one can fathom. What aspect of His greatness has moved you lately?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 7,
    verse: 24,
    reflection:
      "What a wretched man I am! Paul's honesty about internal struggle. Are you that honest about yours?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 19,
    verse: 30,
    reflection:
      "It is finished. What does it mean that nothing remains to be added to what Jesus accomplished?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 9,
    verse: 22,
    reflection:
      "Without the shedding of blood there is no forgiveness. How often do you think about the cost of your forgiveness?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 24,
    verse: 13,
    reflection:
      "He who stands firm to the end will be saved. What do you need to stand firm in right now?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 78,
    verse: 4,
    reflection:
      "We will tell the next generation the praiseworthy deeds of the Lord. What are you passing on?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 44,
    verse: 22,
    reflection:
      "I have swept away your offenses like a cloud. Are you allowing His forgiveness to clear your sky?",
  },
  {
    book_name: "1 Thessalonians",
    book_number: 52,
    chapter: 5,
    verse: 16,
    reflection:
      "Rejoice always. What is standing between you and rejoicing today? Is it circumstances, or your focus?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 12,
    verse: 17,
    reflection:
      "An honest witness tells the truth. Are you someone others can rely on for truth?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 19,
    verse: 10,
    reflection:
      "The Son of Man came to seek and to save the lost. Where are you feeling lost right now?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 4,
    verse: 26,
    reflection:
      "Do not let the sun go down while you are still angry. What unresolved anger is going to sleep with you?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 3,
    reflection:
      "Do not think of yourself more highly than you ought. Where is your self-estimation off-balance?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 141,
    verse: 3,
    reflection:
      "Set a guard over my mouth. What words do you most need God to guard for you?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 15,
    verse: 7,
    reflection:
      "If you remain in me and my words remain in you, ask whatever you wish. What is the condition here? Are you meeting it?",
  },
  {
    book_name: "James",
    book_number: 59,
    chapter: 5,
    verse: 16,
    reflection:
      "The prayer of a righteous person is powerful and effective. Who needs you to be that person praying for them?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 50,
    verse: 4,
    reflection:
      "He wakens me morning by morning to listen as a disciple. What has He been teaching you in recent mornings?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 1,
    verse: 10,
    reflection:
      "Bearing fruit in every good work, growing in the knowledge of God. Are you growing? How would you measure it?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 19,
    verse: 26,
    reflection:
      "With God, all things are possible. What have you written off as impossible that you need to revisit?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 102,
    verse: 12,
    reflection:
      "But you, Lord, sit enthroned forever. What temporary thing are you treating as eternal right now?",
  },
  {
    book_name: "1 Peter",
    book_number: 60,
    chapter: 3,
    verse: 15,
    reflection:
      "Always be prepared to give an answer for the hope you have. How would you explain your hope to someone today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 11,
    reflection:
      "The Spirit of Him who raised Jesus lives in you. What does that resurrection power mean for your dead places?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 24,
    verse: 16,
    reflection:
      "A righteous man falls seven times and rises again. How many times have you fallen and felt like not getting back up?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 23,
    verse: 34,
    reflection:
      "Father, forgive them. What radical forgiveness is Jesus calling you to extend today?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 12,
    verse: 14,
    reflection:
      "Make every effort to live in peace and to be holy. What effort toward holiness have you been avoiding?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 86,
    verse: 5,
    reflection:
      "You, Lord, are forgiving and good, abounding in love. What do you need to receive from His abounding love today?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 14,
    verse: 23,
    reflection:
      "Anyone who loves me will obey my teaching, and my Father will love them. What teaching are you struggling to obey?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 5,
    verse: 1,
    reflection:
      "It is for freedom that Christ has set us free. What old yoke are you going back to after being set free?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 39,
    verse: 4,
    reflection:
      "Show me, Lord, my life's end and the number of my days. How does mortality shape the way you want to live?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 57,
    verse: 15,
    reflection:
      "I live in a high and holy place, but also with the contrite and lowly. Who are you: high and lofty, or lowly?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 11,
    reflection:
      "Never be lacking in zeal; keep your spiritual fervour. When did your fervour last feel truly alive?",
  },

  // ── OCTOBER (274–304) ──
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 147,
    verse: 3,
    reflection:
      "He heals the brokenhearted and binds up their wounds. Which wound are you still not letting Him near?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 25,
    verse: 40,
    reflection:
      "Whatever you did for one of the least of these, you did for me. Who is 'the least' in your world right now?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 8,
    verse: 12,
    reflection:
      "I am the light of the world — no darkness. What dark place in your life needs His light today?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 5,
    reflection:
      "Those who live according to the flesh have their minds set on what the flesh desires. Where is your mind set?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 28,
    verse: 13,
    reflection:
      "Whoever conceals their sins does not prosper, but whoever confesses finds mercy. What are you still concealing?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 4,
    verse: 4,
    reflection:
      "Man does not live on bread alone but on every word from God. What spiritual food did you eat today?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 104,
    verse: 33,
    reflection:
      "I will sing to the Lord all my life. What would singing to Him all your life — including the dark parts — require?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 6,
    verse: 18,
    reflection:
      "Pray in the Spirit on all occasions with all kinds of prayers. What kind of prayer have you neglected lately?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 49,
    verse: 15,
    reflection:
      "Can a mother forget the baby at her breast? God cannot forget you. Where have you felt most forgotten?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 13,
    verse: 13,
    reflection:
      "The greatest of these is love. If love is greater than faith and hope, how much are you investing in it?",
  },
  {
    book_name: "James",
    book_number: 59,
    chapter: 2,
    verse: 17,
    reflection:
      "Faith by itself, without works, is dead. What would be evidence that your faith is alive?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 3,
    verse: 12,
    reflection:
      "Clothe yourselves with compassion, kindness, humility, gentleness, and patience. Which garment are you not wearing?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 57,
    verse: 1,
    reflection:
      "I will take refuge in the shadow of your wings. What storm makes you most want to take refuge in Him right now?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 15,
    reflection:
      "Mourn with those who mourn. Who near you is mourning that you have been too busy to sit with?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 6,
    reflection:
      "Blessed are those who hunger and thirst for righteousness. How hungry are you for righteousness right now — really?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 12,
    verse: 2,
    reflection:
      "Fix your eyes on Jesus, the pioneer and perfecter of faith. Where have your eyes drifted?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 14,
    verse: 1,
    reflection:
      "Do not let your hearts be troubled. What is troubling your heart that He is asking you to hand to Him?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 2,
    verse: 11,
    reflection:
      "Serve the Lord with fear and celebrate with trembling. What does reverent celebration look like in your worship?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 9,
    verse: 10,
    reflection:
      "The fear of the Lord is the beginning of wisdom. How does a reverent awe of God shape your decision-making?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 17,
    verse: 5,
    reflection:
      "Increase our faith! This is a valid prayer. What area of your faith most needs to be increased?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 60,
    verse: 1,
    reflection:
      "Arise, shine, for your light has come. What has God placed in you that the world needs to see?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 21,
    reflection:
      "Overcome evil with good. Where in your life is evil winning because you've stopped doing good?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 20,
    verse: 7,
    reflection:
      "Some trust in chariots, some in horses, but we trust in the Lord. What is your chariot right now?",
  },
  {
    book_name: "1 Thessalonians",
    book_number: 52,
    chapter: 5,
    verse: 11,
    reflection:
      "Encourage one another and build each other up. Who have you recently torn down with your words or silence?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 14,
    verse: 31,
    reflection:
      "Why did you doubt? Jesus' question to Peter on the water. What doubt is keeping you from walking?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 6,
    verse: 7,
    reflection:
      "You reap what you sow. What are you sowing in this season that will determine your next season?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 13,
    verse: 6,
    reflection:
      "I will sing the Lord's praise, for He has been good to me. What specific goodness can you name and sing about today?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 11,
    verse: 25,
    reflection:
      "I am the resurrection and the life. What in your life needs resurrection right now — not just resuscitation?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 4,
    verse: 6,
    reflection:
      "Let your conversation be gracious, seasoned with salt. What does seasoned conversation look like in your context?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 11,
    verse: 6,
    reflection:
      "Without faith it is impossible to please God. What step of faith is He asking you to take right now?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 149,
    verse: 4,
    reflection:
      "For the Lord takes delight in His people. Do you believe God takes delight in you — right now, as you are?",
  },

  // ── NOVEMBER (305–334) ──
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 32,
    reflection:
      "He did not spare His own Son. If He gave that much, will He withhold any good thing?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 52,
    verse: 7,
    reflection:
      "How beautiful are the feet of those who bring good news. What good news are you carrying to someone today?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 6,
    verse: 6,
    reflection:
      "When you pray, go into your room and pray to your Father in secret. What is your secret place with God?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 111,
    verse: 10,
    reflection:
      "The fear of the Lord is the beginning of wisdom. What wisdom are you lacking because you haven't started there?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 6,
    verse: 68,
    reflection:
      "Lord, to whom shall we go? You have the words of eternal life. When the world disappoints, where do you turn?",
  },
  {
    book_name: "Ephesians",
    book_number: 49,
    chapter: 2,
    verse: 14,
    reflection:
      "He Himself is our peace who made two groups one. What division in your life needs His peace to break down the wall?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 30,
    verse: 5,
    reflection:
      "Every word of God is flawless. What word of His have you been second-guessing?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 7,
    verse: 50,
    reflection:
      "Your faith has saved you — go in peace. What would it mean to leave your past sins behind and go in peace?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 95,
    verse: 6,
    reflection:
      "Come, let us bow down in worship. When did you last feel yourself truly bowing — heart, not just body?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 13,
    verse: 5,
    reflection:
      "Keep your lives free from the love of money. What possession most tempts your love away from God?",
  },
  {
    book_name: "1 Corinthians",
    book_number: 46,
    chapter: 9,
    verse: 24,
    reflection:
      "Run in such a way as to get the prize. How are you running right now: sprinting, jogging, or walking?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 12,
    verse: 6,
    reflection:
      "We have different gifts — use them. What gift have you been sitting on that the body needs?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 46,
    verse: 4,
    reflection:
      "I have made you and I will carry you. Even to your old age, I will sustain you. Does He carry you or do you carry Him?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 4,
    verse: 14,
    reflection:
      "The water I give will become a spring of water welling up to eternal life. Are you drinking or still thirsty?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 119,
    verse: 9,
    reflection:
      "How can a young person keep their way pure? By living according to your word. How are you applying His word to your way?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 16,
    verse: 26,
    reflection:
      "What good is it to gain the whole world yet forfeit your soul? What are you trading your soul for?",
  },
  {
    book_name: "Galatians",
    book_number: 48,
    chapter: 1,
    verse: 10,
    reflection:
      "Am I now trying to please people or God? Whose approval do you work hardest to keep?",
  },
  {
    book_name: "Proverbs",
    book_number: 20,
    chapter: 29,
    verse: 18,
    reflection:
      "Without vision the people perish. What vision is God giving you for this next season?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 27,
    verse: 14,
    reflection:
      "Wait for the Lord. Be strong and take heart and wait. What are you struggling to wait for right now?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 24,
    verse: 32,
    reflection:
      "Were not our hearts burning within us while He talked with us? When did the Word last set your heart on fire?",
  },
  {
    book_name: "Revelation",
    book_number: 66,
    chapter: 2,
    verse: 4,
    reflection:
      "You have forsaken the love you had at first. When did you love God most freely? What has replaced it?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 15,
    verse: 4,
    reflection:
      "Everything written in the past was written to teach us. What scripture has been most formative in your life?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 13,
    verse: 14,
    reflection:
      "I have washed your feet — you also should wash one another's feet. Who needs your act of humility today?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 43,
    verse: 19,
    reflection:
      "See, I am doing a new thing! Do you perceive it? What new thing is God doing that you might be missing?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 122,
    verse: 1,
    reflection:
      "I rejoiced with those who said to me, 'Let us go to the house of the Lord.' How do you feel about gathering with God's people?",
  },
  {
    book_name: "Colossians",
    book_number: 51,
    chapter: 2,
    verse: 7,
    reflection:
      "Rooted and built up in Him, overflowing with thankfulness. How deep are your roots? What does overflow look like?",
  },
  {
    book_name: "1 Peter",
    book_number: 60,
    chapter: 2,
    verse: 9,
    reflection:
      "You are a chosen people, a royal priesthood. How does knowing you were chosen change how you see yourself?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 5,
    verse: 5,
    reflection:
      "Blessed are the meek, for they will inherit the earth. In a world that rewards the aggressive, what is the meek path?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 113,
    verse: 3,
    reflection:
      "From the rising of the sun to the place where it sets, the name of the Lord is to be praised. Is your whole day saturated in praise?",
  },
  {
    book_name: "Hebrews",
    book_number: 58,
    chapter: 7,
    verse: 25,
    reflection:
      "He is able to save completely those who come to God through Him. What does 'completely' include for you?",
  },

  // ── DECEMBER (335–365) ──
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 39,
    reflection:
      "Nothing in all creation will be able to separate us from the love of God. Read every word slowly. What does each one mean?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 7,
    verse: 14,
    reflection:
      "A virgin will conceive and give birth to a son — Immanuel. God with us. What does 'with us' mean to you personally?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 2,
    verse: 11,
    reflection:
      "A Saviour has been born — Christ the Lord. What do you most need to be saved from right now?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 1,
    verse: 5,
    reflection:
      "The light shines in the darkness, and the darkness has not overcome it. What darkness feels most overwhelming right now?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 2,
    verse: 11,
    reflection:
      "They opened their treasures and presented him with gifts. What gift are you offering Him this season?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 96,
    verse: 1,
    reflection:
      "Sing to the Lord a new song. What new song is arising from your life that only this season of life could produce?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 9,
    verse: 2,
    reflection:
      "The people walking in darkness have seen a great light. When did the light first come on for you?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 2,
    verse: 19,
    reflection:
      "Mary treasured all these things and pondered them in her heart. What is God doing that you need to slow down and treasure?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 38,
    reflection:
      "Neither height nor depth can separate us from His love. What mountain or valley have you been afraid might be too extreme?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 1,
    verse: 6,
    reflection:
      "He who began a good work in you will carry it on to completion. What unfinished work in you are you tempted to give up on?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 98,
    verse: 1,
    reflection:
      "Sing to the Lord a new song, for He has done marvellous things. What marvellous thing has He done in your life this year?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 40,
    verse: 1,
    reflection:
      "Comfort, comfort my people, says your God. Who needs you to be a channel of His comfort right now?",
  },
  {
    book_name: "Revelation",
    book_number: 66,
    chapter: 1,
    verse: 8,
    reflection:
      "I am the Alpha and the Omega — the beginning and the end. What beginning and ending of yours is He overseeing?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 1,
    verse: 1,
    reflection:
      "In the beginning was the Word. Before everything — the Word. How does this beginning change all other beginnings?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 24,
    verse: 1,
    reflection:
      "The earth is the Lord's and everything in it. What are you treating as yours that actually belongs to Him?",
  },
  {
    book_name: "Matthew",
    book_number: 40,
    chapter: 1,
    verse: 23,
    reflection:
      "Immanuel — God with us. In what moment this week did you feel least alone? That was Him.",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 2,
    verse: 52,
    reflection:
      "Jesus grew in wisdom and stature and in favour with God and man. Which of those four do you most want to grow in?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 11,
    verse: 36,
    reflection:
      "From Him, through Him, and to Him are all things. How does this change where you think your life originates and ends?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 132,
    verse: 13,
    reflection:
      "The Lord has chosen Zion — He has desired it for His dwelling. He chooses to dwell among His people. Is that remarkable to you?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 15,
    verse: 11,
    reflection:
      "I have told you this so that my joy may be in you. Jesus wanted to give you His own joy. Are you carrying it?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 4,
    verse: 7,
    reflection:
      "The peace of God which transcends all understanding will guard your heart. What does 'guard' suggest about how peace works?",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 43,
    verse: 1,
    reflection:
      "I have called you by name — you are mine. Your name is known by God. What does it mean to be claimed?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 148,
    verse: 1,
    reflection:
      "Praise the Lord from the heavens — all creation is called to praise. What in your world is declaring His glory today?",
  },
  {
    book_name: "Luke",
    book_number: 42,
    chapter: 2,
    verse: 29,
    reflection:
      "My eyes have seen your salvation. Simeon waited his whole life for this moment. What are you waiting to see?",
  },
  {
    book_name: "Revelation",
    book_number: 66,
    chapter: 22,
    verse: 20,
    reflection:
      "Come, Lord Jesus. These are the last words of the Bible. Is your life shaped by longing for His return?",
  },
  {
    book_name: "Romans",
    book_number: 45,
    chapter: 8,
    verse: 28,
    reflection:
      "All things work together for good — revisited at year's end. What 'all things' from this year do you now see differently?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 23,
    verse: 6,
    reflection:
      "Surely goodness and mercy shall follow me all the days of my life. As the year ends — can you trace His goodness?",
  },
  {
    book_name: "John",
    book_number: 43,
    chapter: 3,
    verse: 17,
    reflection:
      "God did not send His Son into the world to condemn it but to save it. You are not under condemnation. End your year knowing that.",
  },
  {
    book_name: "Isaiah",
    book_number: 23,
    chapter: 40,
    verse: 8,
    reflection:
      "The grass withers, the flower fades, but the word of our God stands forever. What from this year has withered? What has stood?",
  },
  {
    book_name: "Philippians",
    book_number: 50,
    chapter: 4,
    verse: 4,
    reflection:
      "Rejoice in the Lord always — I will say it again: Rejoice! What do you have to rejoice in as this year closes?",
  },
  {
    book_name: "Psalms",
    book_number: 19,
    chapter: 90,
    verse: 1,
    reflection:
      "Lord, you have been our dwelling place throughout all generations. From one year to the next — He is the constant.",
  },
];

export function getTodayVotdEntry() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return VOTD_POOL[dayOfYear % VOTD_POOL.length];
}
