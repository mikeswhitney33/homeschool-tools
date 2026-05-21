export type Root = {
  root: string;
  origin: "Greek" | "Latin";
  meaning: string;
  example: string;
};

export const ROOTS: Root[] = [
  { root: "bio", origin: "Greek", meaning: "life", example: "biology" },
  { root: "geo", origin: "Greek", meaning: "earth", example: "geography" },
  { root: "graph", origin: "Greek", meaning: "write", example: "autograph" },
  { root: "tele", origin: "Greek", meaning: "far", example: "telephone" },
  { root: "phon", origin: "Greek", meaning: "sound", example: "phonics" },
  { root: "photo", origin: "Greek", meaning: "light", example: "photograph" },
  { root: "auto", origin: "Greek", meaning: "self", example: "automobile" },
  { root: "micro", origin: "Greek", meaning: "small", example: "microscope" },
  { root: "macro", origin: "Greek", meaning: "large", example: "macroeconomics" },
  { root: "therm", origin: "Greek", meaning: "heat", example: "thermometer" },
  { root: "hydro", origin: "Greek", meaning: "water", example: "hydrant" },
  { root: "astro", origin: "Greek", meaning: "star", example: "astronaut" },
  { root: "cycl", origin: "Greek", meaning: "circle", example: "bicycle" },
  { root: "psych", origin: "Greek", meaning: "mind", example: "psychology" },
  { root: "chron", origin: "Greek", meaning: "time", example: "chronology" },
  { root: "meter", origin: "Greek", meaning: "measure", example: "thermometer" },
  { root: "scop", origin: "Greek", meaning: "look at", example: "telescope" },
  { root: "logy", origin: "Greek", meaning: "study of", example: "geology" },
  { root: "dem", origin: "Greek", meaning: "people", example: "democracy" },
  { root: "crat", origin: "Greek", meaning: "rule", example: "democrat" },

  { root: "aqua", origin: "Latin", meaning: "water", example: "aquarium" },
  { root: "audi", origin: "Latin", meaning: "hear", example: "audience" },
  { root: "dict", origin: "Latin", meaning: "say", example: "dictate" },
  { root: "duc", origin: "Latin", meaning: "lead", example: "conduct" },
  { root: "form", origin: "Latin", meaning: "shape", example: "transform" },
  { root: "ject", origin: "Latin", meaning: "throw", example: "eject" },
  { root: "mit", origin: "Latin", meaning: "send", example: "transmit" },
  { root: "port", origin: "Latin", meaning: "carry", example: "transport" },
  { root: "rupt", origin: "Latin", meaning: "break", example: "interrupt" },
  { root: "scrib", origin: "Latin", meaning: "write", example: "scribble" },
  { root: "spec", origin: "Latin", meaning: "see", example: "inspect" },
  { root: "struct", origin: "Latin", meaning: "build", example: "construct" },
  { root: "tract", origin: "Latin", meaning: "pull", example: "tractor" },
  { root: "vid / vis", origin: "Latin", meaning: "see", example: "video" },
  { root: "voc", origin: "Latin", meaning: "voice", example: "vocal" },
  { root: "cred", origin: "Latin", meaning: "believe", example: "credit" },
  { root: "ped", origin: "Latin", meaning: "foot", example: "pedal" },
  { root: "man", origin: "Latin", meaning: "hand", example: "manual" },
  { root: "sol", origin: "Latin", meaning: "alone / sun", example: "solo" },
  { root: "luna", origin: "Latin", meaning: "moon", example: "lunar" },
  { root: "terr", origin: "Latin", meaning: "earth", example: "terrain" },
  { root: "mort", origin: "Latin", meaning: "death", example: "mortal" },
  { root: "vit / viv", origin: "Latin", meaning: "life", example: "vital" },
  { root: "magn", origin: "Latin", meaning: "great", example: "magnify" },
];

export type Prefix = { root: string; meaning: string; example: string };

export const PREFIXES: Prefix[] = [
  { root: "pre-", meaning: "before", example: "preview" },
  { root: "re-", meaning: "again", example: "redo" },
  { root: "un-", meaning: "not", example: "undo" },
  { root: "dis-", meaning: "not / apart", example: "disagree" },
  { root: "mis-", meaning: "wrong", example: "misspell" },
  { root: "sub-", meaning: "under", example: "submarine" },
  { root: "trans-", meaning: "across", example: "transport" },
  { root: "inter-", meaning: "between", example: "interstate" },
  { root: "anti-", meaning: "against", example: "antifreeze" },
  { root: "co- / con-", meaning: "with", example: "cooperate" },
  { root: "non-", meaning: "not", example: "nonsense" },
  { root: "over-", meaning: "too much", example: "overdo" },
  { root: "semi-", meaning: "half", example: "semicircle" },
  { root: "uni-", meaning: "one", example: "unicycle" },
  { root: "bi-", meaning: "two", example: "bicycle" },
  { root: "tri-", meaning: "three", example: "tricycle" },
];

export const SUFFIXES: Prefix[] = [
  { root: "-able", meaning: "can be", example: "readable" },
  { root: "-ful", meaning: "full of", example: "joyful" },
  { root: "-less", meaning: "without", example: "hopeless" },
  { root: "-ish", meaning: "like", example: "childish" },
  { root: "-ness", meaning: "state of", example: "kindness" },
  { root: "-er / -or", meaning: "one who", example: "teacher" },
  { root: "-ist", meaning: "one who", example: "artist" },
  { root: "-ology", meaning: "study of", example: "biology" },
  { root: "-tion", meaning: "act / state", example: "action" },
  { root: "-ment", meaning: "result of", example: "movement" },
];
