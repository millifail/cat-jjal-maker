const EMPTY_HEART = "🤍";
const FULL_HEART = "💖";

const CAT1 = "https://images.theconversation.com/files/457052/original/file-20220408-15-pl446k.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip";
const CAT2 = "https://i.pinimg.com/originals/aa/02/78/aa02780bbc7e6c5e2d52d9b0e919fbf6.jpg";
const CAT3 = "https://i.pinimg.com/originals/e5/a9/e8/e5a9e877bcacdc5713d2a8f98412762d.pngt";



const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};
