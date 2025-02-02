// background.js
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get('schNoValue');
    chrome.storage.sync.get('schNoSelectIndex');
    chrome.storage.sync.get('schNoText')
    });

chrome.contextMenus.onClicked.addListener(resetSchool) ;







function resetSchool(info){
    switch (info.menuItemId) {
        case 'resetSchool':
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
            });
        ;
    }
};

chrome.runtime.onInstalled.addListener(function(){
    let resetSchool = chrome.contextMenus.create({
        title: "重置預設學校 Reset Default School",
        documentUrlPatterns : ["https://highschool.kh.edu.tw/*"],
        id: "resetSchool",
        contexts: ["all"],
    });
})

chrome.storage.local.get('checked', function(data){
    if(data.checked==undefined){
        chrome.storage.local.set({checked : 'off'})
    }
})


