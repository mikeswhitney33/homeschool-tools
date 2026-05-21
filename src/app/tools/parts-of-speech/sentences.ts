export type POS = "noun" | "verb" | "adjective";

export type Sentence = {
  text: string;
  tags: Record<string, POS>;
};

export const SENTENCES: Sentence[] = [
  {
    text: "The brown dog barked at the mail carrier.",
    tags: { brown: "adjective", dog: "noun", barked: "verb", carrier: "noun" },
  },
  {
    text: "My little sister built a tall castle in the sand.",
    tags: { little: "adjective", sister: "noun", built: "verb", tall: "adjective", castle: "noun", sand: "noun" },
  },
  {
    text: "Eight noisy birds flew over the empty field.",
    tags: { noisy: "adjective", birds: "noun", flew: "verb", empty: "adjective", field: "noun" },
  },
  {
    text: "The hungry kitten chased a fuzzy mouse.",
    tags: { hungry: "adjective", kitten: "noun", chased: "verb", fuzzy: "adjective", mouse: "noun" },
  },
  {
    text: "Sam ate a juicy apple after lunch.",
    tags: { Sam: "noun", ate: "verb", juicy: "adjective", apple: "noun", lunch: "noun" },
  },
  {
    text: "The clever fox jumped over the rotten log.",
    tags: { clever: "adjective", fox: "noun", jumped: "verb", rotten: "adjective", log: "noun" },
  },
  {
    text: "Three small ducks swam across the cold pond.",
    tags: { small: "adjective", ducks: "noun", swam: "verb", cold: "adjective", pond: "noun" },
  },
  {
    text: "Grandma baked warm cookies for the children.",
    tags: { Grandma: "noun", baked: "verb", warm: "adjective", cookies: "noun", children: "noun" },
  },
  {
    text: "The teacher read a funny story to her class.",
    tags: { teacher: "noun", read: "verb", funny: "adjective", story: "noun", class: "noun" },
  },
  {
    text: "Loud thunder shook the wooden house at midnight.",
    tags: { Loud: "adjective", thunder: "noun", shook: "verb", wooden: "adjective", house: "noun", midnight: "noun" },
  },
];
