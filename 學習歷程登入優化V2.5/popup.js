

// popup.js
document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('deleteDefaultSch').addEventListener('click', function() {
        chrome.storage.sync.remove(["schNoValue", "schNoSelectIndex","schNoText"], function() {createNotification("設定完成！將於刷新頁面後生效")});
    
});

document.getElementById('Setting').addEventListener('click', function() {
    window.location.href="setting.html";
});
function createNotification(message) {
    var notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = '#ffffff';
    notification.style.padding = '20px';
    notification.style.border = '1px solid #000000';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function() {
        document.body.removeChild(notification);
    }, 1750); 
}



chrome.storage.sync.get('schNoValue', function (result) {
    if(!result.schNoValue)
    {
        document.getElementById('schNO').textContent = "目前預設學校代碼：" + "尚未設定"
    }
    else{
        document.getElementById('schNO').textContent = "目前預設學校代碼：" + result.schNoValue;
    }
    
});

chrome.storage.sync.get('schNoText', function (result) {
    if(!result.schNoText)
    {
        document.getElementById('School').textContent = "目前預設學校：" + "尚未設定"
    }
    else{
        document.getElementById('School').textContent = "目前預設學校：" + result.schNoText;
    }
});



});

