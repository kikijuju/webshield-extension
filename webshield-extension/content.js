function cleanHTML(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.innerText.replace(/\s+/g, ' ').slice(0, 2000);  // 최대 2000자
}

const rawHTML = document.documentElement.outerHTML;
const cleanedHTML = cleanHTML(rawHTML);

const metas = Array.from(document.getElementsByTagName("meta"))
  .map(meta => meta.outerHTML)
  .join("\n");

chrome.runtime.sendMessage({
  type: "SITE_INFO",
  payload: {
    url: location.href,
    html: cleanedHTML,
    meta: metas
  }
});