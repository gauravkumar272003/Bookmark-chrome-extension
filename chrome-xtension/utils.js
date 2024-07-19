export async function getActiveTab() {
    //using try and catch method taaki koi error edge cases when 0 tabs main dikkat na ho
    try {
        const tabs = await chrome.tabs.query({ currentWindow: true, active: true });

        if (tabs.length === 0) {
            throw new Error("No active tab found.");
        }
        return tabs[0];
    } catch (error) {
        console.error("Error getting active tab:", error);
        return null;
    }
}
