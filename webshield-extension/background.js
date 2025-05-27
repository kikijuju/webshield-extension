chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SITE_INFO") {
    const now = Date.now();

    chrome.storage.local.get("lastChecked", (data) => {
      const lastChecked = data.lastChecked || 0;

      // 1분 이내 중복 요청 방지
      if (now - lastChecked < 60000) {
        console.log("[INFO] 최근 분석된 사이트로 요청 생략");
        return;
      }

      console.log("[DEBUG] fetch 요청 방식:", {
        method: "POST",
        body: JSON.stringify(message.payload)
      });

      fetch("http://localhost:8000/evaluate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message.payload)
      })
      .then(res => res.json())
      .then(data => {
        let icon = "gray.png";
        if (data.label.includes("정상")) icon = "green.png";
        else if (data.label.includes("의심")) icon = "yellow.png";
        else if (data.label.includes("유해")) icon = "red.png";

        chrome.action.setIcon({ path: `icons/${icon}`, tabId: sender.tab.id });
        chrome.storage.local.set({
          webshield_result: data,
          lastChecked: now
        });
      })
      .catch(err => {
        console.error("분석 요청 실패", err);
        chrome.action.setIcon({ path: "icons/gray.png", tabId: sender.tab.id });
        chrome.storage.local.set({
          webshield_result: {
            label: "분석 실패",
            reason: "서버 통신 중 오류 발생 (오프라인 상태일 수 있음)"
          },
          lastChecked: now
        });
      });
    });
  }
});