

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('save-button').addEventListener('click', function() {
        var openidaccount = document.getElementById('openidaccount').value
        var openidpassword = document.getElementById('openidpassword').value
        chrome.storage.local.set({openidaccount: openidaccount});
        console.log("Saved account:" + openidaccount)
        console.log("Saved password:********")
        chrome.storage.local.set({openidpassword: openidpassword});
        document.getElementById('save-button').innerText = "Saved"

});

document.getElementById('Information').addEventListener('click', function() {
    window.location.href="popup.html";
});
document.getElementById('Setting').addEventListener('click', function() {
    window.location.href="setting.html";
});

chrome.storage.local.get('openidaccount', function (result) {
    if(result.openidaccount){
        document.getElementById('openidaccount').value = result.openidaccount;
    }
    
});
chrome.storage.local.get('openidpassword', function (result) {
    if(result.openidpassword){
        document.getElementById('openidpassword').value = result.openidpassword;
    }
});

chrome.storage.local.get('checkedforopenid', function (result) {
    if(result.checkedforopenid == "on"){
        document.getElementById('toggle-switch').checked = true;
    }
    else{
        document.getElementById('toggle-switch').checked = false;
    }
});

chrome.storage.local.get('checked2foropenid', function (result) {
    if(result.checked2foropenid == "on"){
        document.getElementById('toggle-switch2').checked = true;
    }
    else{
        document.getElementById('toggle-switch2').checked = false;
    }
});





var toggleSwitch = document.getElementById('toggle-switch');
var toggleSwitch2 = document.getElementById('toggle-switch2');

// 監聽開關元素的 change 事件
toggleSwitch.addEventListener('change', function() {
    // 獲取開關的值
    var isChecked = this.checked;
    
    // 根據開關的值進行相應的操作
    if (isChecked) {
        console.log('開關已打開');
        chrome.storage.local.set({checkedforopenid: 'on'});
        createNotification('設定完成！將於刷新頁面後生效');
    } else {
        console.log('開關已關閉');
        chrome.storage.local.set({checkedforopenid: 'off'});
        createNotification('設定完成！將於刷新頁面後生效');
    }
});

toggleSwitch2.addEventListener('change', function() {
    // 獲取開關的值
    var isChecked = this.checked;
    
    // 根據開關的值進行相應的操作
    if (isChecked) {
        console.log('開關已打開');
        chrome.storage.local.set({checked2foropenid: 'on'});
        // 範例使用：在更改設定後顯示提示詞
        createNotification('設定完成！將於刷新頁面後生效');
    } else {
        console.log('開關已關閉');
        chrome.storage.local.set({checked2foropenid: 'off'});
        // 範例使用：在更改設定後顯示提示詞
        createNotification('設定完成！將於刷新頁面後生效');
    }
});

function createNotification(message) {
    // 創建一個新的 div 元素
    var notification = document.createElement('div');
    // 設置提示元素的樣式
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = '#ffffff';
    notification.style.padding = '20px';
    notification.style.border = '1px solid #000000';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    // 設置提示元素的內容
    notification.textContent = message;
    // 將提示元素添加到 body 元素中
    document.body.appendChild(notification);
    // 在一定時間後移除提示元素
    setTimeout(function() {
        document.body.removeChild(notification);
    }, 1750); // 1.75 秒後移除提示元素
}








});