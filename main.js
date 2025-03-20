const quoteContainer = document.querySelector(".quote-text");
const authorContainer = document.querySelector(".author");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const tweetQuoteBtn = document.getElementById("tweet-quote");
const exportQuoteBtn = document.getElementById("export-quote");

const BACKGROUNDS = [
  "./assets/bg/01.png",
  "./assets/bg/02.png",
  "./assets/bg/03.png",
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
      copyQuoteBtn.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied';
      setTimeout(() => {
        copyQuoteBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy Quote';
      }, 3000);
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
  const cardElement = document.querySelector(".card");

  html2canvas(cardElement).then((canvas) => {
    const imageData = canvas.toDataURL("image/png");

    const aEl = document.createElement("a");
    aEl.href = imageData;
    aEl.download = "quote.png";
    aEl.click();
    aEl.remove();
  }).catch((error) => {
    console.error("Error generating image:", error);
  });
};

exportQuoteBtn.addEventListener("click", exportQuoteImage);
