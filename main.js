const quoteContainer = document.querySelector(".quote-text");
const authorContainer = document.querySelector(".author");
const newQuote = document.getElementById("new-quote");
const copyQuote = document.getElementById("copy-quote");
const tweetQuote = document.getElementById("tweet-quote");
const exportQuote = document.getElementById("export-quote");

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

const generateTwitterShareUrl = (data) => {
  const twitterBaseUrl = new URL("https://twitter.com/intent/tweet");
  const params = new URLSearchParams(twitterBaseUrl.search);
  params.append("text", data);
  twitterBaseUrl.search = params.toString();
  return twitterBaseUrl.toString();
};

const showQuote = async () => {
  const quote = await getQuote();
  if (!quote) return;

  quoteContainer.innerText = `"${quote.content}"`;
  authorContainer.innerText = `- ${quote.author}`;
  tweetQuote.href = generateTwitterShareUrl(quote.content);
  console.log(generateTwitterShareUrl(quote.content));
  
};

showQuote();

newQuote.addEventListener("click", (event) => {
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

copyQuote.addEventListener("click", () => {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state === "granted" || result.state == "prompt") {
      const quoteText = quoteContainer.textContent.trim();
      if (quoteText) {
        copyToClipboard(quoteText);
      }
    }
  });
});

const exportQuoteImage = () => {};

const shareQuote = () => {};
