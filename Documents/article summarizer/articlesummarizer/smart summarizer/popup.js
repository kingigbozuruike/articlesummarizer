document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('summarize').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            });
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "displaySummary") {
            document.getElementById('summary').innerText = request.summary;
        }
    });
});
