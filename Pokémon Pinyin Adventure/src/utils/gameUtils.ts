import { PinyinItem } from "../data/pinyin";

let sharedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== "undefined" && window.speechSynthesis) {
  const updateVoices = () => {
    sharedVoices = window.speechSynthesis.getVoices();
  };
  updateVoices();
  window.speechSynthesis.onvoiceschanged = updateVoices;
}

export const playAudio = (text: string) => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech Synthesis not supported in this browser.");
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.8; // Slightly slower for kids to hear clearly
  
  const zhVoice = sharedVoices.find(v => v.lang === "zh-CN" || v.lang === "zh_CN" || v.lang.includes("zh"));
  if (zhVoice) {
    utterance.voice = zhVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const selectOptions = (correctItem: PinyinItem, pool: PinyinItem[]): PinyinItem[] => {
  const others = pool.filter(p => p.pinyin !== correctItem.pinyin);
  const shuffledOthers = shuffleArray(others);
  const selectedOthers = shuffledOthers.slice(0, 2);
  return shuffleArray([correctItem, ...selectedOthers]);
};
