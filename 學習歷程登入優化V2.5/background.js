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
chrome.storage.local.get('checked2', function(data){
    if(data.checked2==undefined){
        chrome.storage.local.set({checked2 : 'off'})
    }
})

chrome.storage.sync.get('autorecognize', function (data) {
    if(data.autorecognize==undefined){
        chrome.storage.sync.set({autorecognize: 2})
    }
})

chrome.storage.sync.get('todayKey', function(result){
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // 月份從 0 開始，所以要加 1
    var day = currentDate.getDate();
    
    var todayKey = year + '-' + month + '-' + day;


    if(result.todayKey == undefined){
        chrome.storage.sync.set({todayKey: todayKey});
        console.log("set todaykey to " + todayKey)
    }
    else{
        if(result.todayKey != todayKey){
            console.log("換日，更新todaykey，重置自動辨識次數")
            chrome.storage.sync.set({todayKey: todayKey});
            chrome.storage.sync.set({autorecognize: 2})
        }
        if(result.todayKey == todayKey){
            console.log("今日:"+result.todayKey)
        }}
})

