chrome.storage.local.get(["webshield_result", "lastChecked"], (data) => {
  const res = data.webshield_result;
  const timestamp = data.lastChecked;
  const time = timestamp
    ? new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
      })
    : "Unknown";

  if (res) {
    document.getElementById("result").innerHTML =
      `<b> Result:</b> ${res.label}<br><br>
       <b> Reason:</b><br>${res.reason}<br><br>
       <small> Analyzed At: ${time}</small>`;
  } else {
    document.getElementById("result").innerText = "No result available.";
  }
});