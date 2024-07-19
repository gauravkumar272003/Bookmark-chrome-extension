document.addEventListener('DOMContentLoaded', () => {
    const noteField = document.getElementById('note');
    const saveButton = document.getElementById('save');

    // Get the current active tab .... anytabs are allowed
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const url = new URL(tab.url);
        const domain = url.hostname;

        // Load saved note for the current domain.. if written before ever
        chrome.storage.sync.get([domain], (result) => {
            if (result[domain]) {
                noteField.value = result[domain];
            }
        });

        // Save the note when the save button is clicked by user
        saveButton.addEventListener('click', () => {
            const note = noteField.value;
            chrome.storage.sync.set({ [domain]: note }, () => {
                alert('Note saved!');
            });
        });
    });
});
