// console.log("Background script running");

// chrome.action.onClicked.addListener((tab) => {
//     console.log("Extension icon clicked");

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['content.js'],
//     }, () => {
//         if (chrome.runtime.lastError) {
//             console.error("Error executing script: " + chrome.runtime.lastError.message);
//         }
//     });
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("Received message in background script:", request);

//     if (request.action === "summarize" && request.text) {
//         fetch('http://127.0.0.1:5000/summarize', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ text: request.text })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Summarized data:", data);
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 if (chrome.runtime.lastError || !tabs.length) {
//                     console.error("Error finding the active tab:", chrome.runtime.lastError);
//                     return;
//                 }
//                 chrome.scripting.executeScript({
//                     target: { tabId: tabs[0].id },
//                     func: (summary) => { alert("Summary: " + summary); },
//                     args: [data.summary]
//                 });
//             });
//         })
//         .catch(error => {
//             console.error("Error fetching summary:", error);
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 if (chrome.runtime.lastError || !tabs.length) {
//                     console.error("Error finding the active tab:", chrome.runtime.lastError);
//                     return;
//                 }
//                 chrome.scripting.executeScript({
//                     target: { tabId: tabs[0].id },
//                     func: (message) => { alert("Error: " + message); },
//                     args: [error.message]
//                 });
//             });
//         });
//     } else {
//         console.error("No text received from content script");
//     }
// });

console.log("Background script running");

chrome.action.onClicked.addListener((tab) => {
    console.log("Extension icon clicked");

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error executing script: " + chrome.runtime.lastError.message);
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in background script:", request);

    if (request.action === "summarize" && request.text) {
        fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Summarized data:", data);

            // Send the summary to the popup
            chrome.runtime.sendMessage({ action: "displaySummary", summary: data.summary });
        })
        .catch(error => {
            console.error("Error fetching summary:", error);
        });
    } else {
        console.error("No text received from content script");
    }
});

