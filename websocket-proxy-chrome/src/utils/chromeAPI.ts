export const reloadInspectedWindow = (args: any) => {
    return chrome.devtools.inspectedWindow.reload(args);
}

export const storeManager = {
    // Save data to Chrome storage
    set: (key, value, callback) => {
        const data = {};
        data[key] = value;
        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error setting key "${key}":`, chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },

    // Get data from Chrome storage
    get: (key, callback) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                console.error(`Error getting key "${key}":`, chrome.runtime.lastError);
                callback(null);
            } else {
                callback(result[key]);
            }
        });
    },

    // Remove data from Chrome storage
    remove: (key, callback) => {
        chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error removing key "${key}":`, chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },

    // Clear all data from Chrome storage
    clear: (callback) => {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing storage:', chrome.runtime.lastError);
            } else if (callback) {
                callback();
            }
        });
    },
};

