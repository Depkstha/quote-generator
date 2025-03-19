const quoteContainer = document.querySelector(".quote-text");
const authorContainer = document.querySelector(".author");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const tweetQuoteBtn = document.getElementById("tweet-quote");
const exportQuoteBtn = document.getElementById("export-quote");
const card = document.querySelector(".card");
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

const BACKGROUNDS = [
  "https://img.freepik.com/free-photo/bubbles-green-red-yellow-color-forming-wet-background_23-2147876075.jpg?t=st=1742425901~exp=1742429501~hmac=a85e89487981b5793237acdeab6dac339ea3dc1af9c7b115f41c48937637b9cb&w=1380",
  "https://img.freepik.com/free-photo/evergreen-falling-into-water_23-2148151513.jpg?t=st=1742426016~exp=1742429616~hmac=e2e477557de5d5b558a4d936f5c7d4f086c1465835402a49947a616ffb79f1a5&w=1380",
  "https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?t=st=1742425602~exp=1742429202~hmac=35ba9be33a2b8fc1711a21bc2f21a620ab0f8708105dff27a8414731b519236d&w=1380",
];

const changeRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
  const style = document.createElement("style");
  style.innerHTML = `
  .card::before {
    background-image: url('${BACKGROUNDS[randomIndex]}') !important;
  }
`;
  document.head.appendChild(style);
};

const generateTwitterShareUrl = (data) => {
  const twitterBaseUrl = new URL("https://twitter.com/intent/tweet");
  const params = new URLSearchParams(twitterBaseUrl.search);
  params.append("text", data);
  twitterBaseUrl.search = params.toString();
  return twitterBaseUrl.toString();
};

const getQuote = async () => {
  const url = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log(error.message);
  }
};

const showQuote = async () => {
  const quote = await getQuote();
  if (!quote) return;
  changeRandomBackground();
  quoteContainer.innerText = `"${quote.content}"`;
  authorContainer.innerText = `- ${quote.author}`;
  tweetQuoteBtn.href = generateTwitterShareUrl(quote.content);
};

showQuote();

newQuoteBtn.addEventListener("click", (event) => {
  event.target.disabled = true;
  showQuote();
  event.target.disabled = false;
});

const copyToClipboard = (newClip) => {
  navigator.clipboard.writeText(newClip).then(
    () => {
      console.log("Copied to clipboard");
    },
    (error) => {
      console.log(error);
    }
  );
};

copyQuoteBtn.addEventListener("click", () => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state == "prompt") {
      const quoteText = quoteContainer.textContent.trim();
      if (quoteText) {
        copyToClipboard(quoteText);
      }
    }
  });
});

const exportQuoteImage = () => {
  const canvasUrl = canvas.toDataURL();
  const aEl = document.createElement("a");
  aEl.href = canvasUrl;
  aEl.download = "quote";
  aEl.click();
  aEl.remove();
};

exportQuoteBtn.addEventListener("click", () => exportQuoteImage);
