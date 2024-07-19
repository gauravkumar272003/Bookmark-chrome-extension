(() => {
    let pageControls;
    let currentPage = "";
    let currentPageBookmarks = [];

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentPage], (obj) => {
                resolve(obj[currentPage] ? JSON.parse(obj[currentPage]) : []);
            });
        });
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = new Date().toISOString();
        const scrollPosition = window.scrollY;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + currentTime,
            scrollPosition: scrollPosition,
        };

        currentPageBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentPage]: JSON.stringify([...currentPageBookmarks, newBookmark].sort((a, b) => new Date(a.time) - new Date(b.time)))
        });
    };

    const newPageLoaded = async () => {
        pageControls = document.querySelector("body");

        if (!pageControls) {
            console.error("Page controls not found");
            return;
        }

        const bookmarkBtnExists = document.querySelector(".bookmark-btn");

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("button");
            bookmarkBtn.innerText = "Bookmark";
            bookmarkBtn.className = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current page";

            pageControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    };

    chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
        const { type, value, pageId } = obj;

        if (type === "NEW") {
            currentPage = pageId;
            newPageLoaded();
        } else if (type === "GOTO") {
            if (value) {
                window.scrollTo(0, value.scrollPosition);
            } else {
                console.error("Bookmark position not found");
            }
        } else if (type === "DELETE") {
            currentPageBookmarks = await fetchBookmarks();
            const updatedBookmarks = currentPageBookmarks.filter((b) => b.time !== value);
            chrome.storage.sync.set({ [currentPage]: JSON.stringify(updatedBookmarks) });

            response(updatedBookmarks);
        }
    });

    newPageLoaded();
})();
