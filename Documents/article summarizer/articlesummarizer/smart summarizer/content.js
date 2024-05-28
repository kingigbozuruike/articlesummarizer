console.log("Content script running");

function getTextFromPage() {
    const bodyText = document.body.innerText;
    return bodyText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in content script:", request);  // Debug log
    if (request.action === "summarize") {
        const text = getTextFromPage();
        console.log("Fetched text from page:", text);  // Debug log
        sendResponse({ text: text });
    }
});


const text = getTextFromPage();
chrome.runtime.sendMessage({ action: "summarize", text: text }); // Send text to background script

// document.getElementById('summarize').addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             files: ['content.js']
//         });
//     });
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "displaySummary") {
//         document.getElementById('summary').innerText = request.summary;
//     }
// });
