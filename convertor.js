const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;

const MAX_AID = 1n << 51n;
const MIN_AID = 1n;

const BASE = 58;
const BV_LEN = 12;
const PREFIX = "BV1";

const ALPHABET = [
  "F",
  "c",
  "w",
  "A",
  "P",
  "N",
  "K",
  "T",
  "M",
  "u",
  "g",
  "3",
  "G",
  "V",
  "5",
  "L",
  "j",
  "7",
  "E",
  "J",
  "n",
  "H",
  "p",
  "W",
  "s",
  "x",
  "4",
  "t",
  "b",
  "8",
  "h",
  "a",
  "Y",
  "e",
  "v",
  "i",
  "q",
  "B",
  "z",
  "6",
  "r",
  "k",
  "C",
  "y",
  "1",
  "2",
  "m",
  "U",
  "S",
  "D",
  "Q",
  "X",
  "9",
  "R",
  "d",
  "o",
  "Z",
  "f",
];

const reverseIndex = {};
ALPHABET.forEach((ch, idx) => (reverseIndex[ch] = idx));

function av_to_bv(avid) {
  if (avid < MIN_AID) {
    throw new Error(`Av ${avid} is smaller than ${MIN_AID}`);
  }
  if (avid >= MAX_AID) {
    throw new Error(`Av ${avid} is bigger than ${MAX_AID}`);
  }

  let bytes = Array.from("BV10000000000");
  let bvIdx = BV_LEN - 1;
  let tmp = (MAX_AID | BigInt(avid)) ^ XOR_CODE;

  while (tmp !== 0n) {
    const tableIdx = Number(tmp % BigInt(BASE));
    bytes[bvIdx] = ALPHABET[tableIdx];
    tmp /= BigInt(BASE);
    bvIdx -= 1;
  }

  [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
  [bytes[4], bytes[7]] = [bytes[7], bytes[4]];

  return bytes.join("");
}

function bv_to_av(bvid) {
  if (bvid.length === 0) {
    throw new Error("Bv is empty");
  }
  if (!/^[a-zA-Z0-9]+$/.test(bvid)) {
    throw new Error("Bv contains non-ASCII characters");
  }
  if (bvid.length < BV_LEN) {
    throw new Error("Bv is too small");
  } else if (bvid.length > BV_LEN) {
    throw new Error("Bv is too big");
  }
  if (!bvid.startsWith(PREFIX)) {
    throw new Error("Bv prefix should be ignore-cased `BV1`");
  }

  let chars = Array.from(bvid);
  [chars[3], chars[9]] = [chars[9], chars[3]];
  [chars[4], chars[7]] = [chars[7], chars[4]];
  bvid = chars.join("");

  let tmp = 0n;
  for (let i = 3; i < chars.length; i++) {
    const ch = chars[i];
    if (!(ch in reverseIndex)) {
      throw new Error(`Bv is invalid, with invalid char code '${ch}'`);
    }
    tmp = tmp * BigInt(BASE) + BigInt(reverseIndex[ch]);
  }

  let binLen = tmp === 0n ? 0 : tmp.toString(2).length;
  if (binLen > 52) {
    throw new Error("Bv is too big");
  }
  if (binLen < 52) {
    throw new Error("Bv is too small");
  }

  let avid = (tmp & MASK_CODE) ^ XOR_CODE;
  if (avid < MIN_AID) {
    throw new Error(`Av ${avid} is smaller than ${MIN_AID}`);
  }

  return avid;
}

export { av_to_bv, bv_to_av };
