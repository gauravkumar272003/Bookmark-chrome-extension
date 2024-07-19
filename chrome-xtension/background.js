chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for messages from (contentScripts || popup scripts)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'log') {
        console.log(message.data);
        sendResponse({ status: 'logged' });
    }
});