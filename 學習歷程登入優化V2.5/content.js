// content.js
chrome.storage.sync.get('schNoValue', function(data) {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving 'schNoValue': " + chrome.runtime.lastError.message);
        return;
    }
    else{
        if(data.schNoValue){
            console.log("get Value successful");
        }
        else{
            console.log("Value undefined");
        }
    }
    schNoValue = data.schNoValue || '';
});




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "reloadPage") {
        chrome.storage.sync.remove(["schNoValue", "schNoSelectIndex","schNoText"], function() {console.log('reset successful')});
        alert('設定完成！將於刷新頁面後生效');
        
    }
});




var checkstatus;
var autorecognizestatus;
class DistrictSchoolSelector {
    constructor() {
        const self = this;
        chrome.storage.sync.get('schNoValue', function (result) {
            this.schNoValue = result.schNoValue;
            console.log("學校代碼:"+result.schNoValue);
        });
        chrome.storage.sync.get('schNoSelectIndex', function(result){
            this.schNoSelectIndex = result.schNoSelectIndex;
            console.log("索引值:"+result.schNoSelectIndex)
        });
        chrome.storage.sync.get('schNoText', function (result) {
            this.selectedOptionText = result.schNoText;
            console.log("學校名稱:"+result.schNoText)
        });
        this.waitForLoginButton();
        
        this.autoClick();
        this.getAccountandPassword();
        this.useFeature();
    }

    Mainfunction() {
        var schNoElement = document.getElementById('schNo');
                var schNoValue = schNoElement ? schNoElement.value : '';
                var schNoSelectIndex = schNoElement ? schNoElement.selectedIndex : '';
                var selectedOptionText = schNoElement.options[schNoSelectIndex].textContent;

                
                
                chrome.storage.sync.get('schNoValue', function (result) {
                    this.schNoValue = result.schNoValue;
                    if(!result.schNoValue){
                        chrome.storage.sync.set({schNoValue: schNoValue});
                        console.log("學校代碼已儲存");
                    }
                    else{
                        console.log("學校代碼HasAlreadyySet:"+result.schNoValue);
                    }
                });
                chrome.storage.sync.get('schNoText', function (result) {
                    this.selectedOptionText = result.schNoText;
                    if(!result.schNoText && selectedOptionText!="請選擇"){
                        chrome.storage.sync.set({schNoText: selectedOptionText});
                        console.log("學校名稱已儲存");
                    }
                    else{
                        console.log("學校名稱HasAlreadyySet:"+result.schNoText);
                    }
                });
                chrome.storage.sync.get('schNoSelectIndex', function(result){
                    this.schNoSelectIndex = result.schNoSelectIndex;
                    if(!result.schNoSelectIndex){
                        chrome.storage.sync.set({schNoSelectIndex: schNoSelectIndex});
                        console.log("索引值已儲存")
                        console.log("設定完成" ,"schNo: " + schNoValue, "selectedIndex: " + schNoSelectIndex, "school: " + selectedOptionText);
                    }
                    else{
                        console.log("索引值HasAlreadySet:"+result.schNoSelectIndex)
                    }
                });
    }
    

    waitForLoginButton() {
        const loginButton = document.getElementById('login');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.Mainfunction();
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    this.Mainfunction();
                }
            });
        }
    }

    

    autoClick(){
        const textElement = document.getElementById('validateCode');
        
        chrome.storage.local.get('checked', function (result) {
           checkstatus = result.checked
           console.log(checkstatus)
        });    
        if(checkstatus == "on"){
                const text = textElement.value.trim(); 
                if (text.length == 4) {
                   console.log('驗證碼已填上：', text);
                  setTimeout(() => document.querySelector('#login').click(),500);
                }
                textElement.addEventListener('input', function(event) {
                const text = event.target.value.trim(); 
                if (text.length == 4) {
                   console.log('驗證碼已填上：', text);
                  setTimeout(() => document.querySelector('#login').click(),500);
                }
                
                });
            }
             else {
                setTimeout(() => this.autoClick(), 500);
            }
        
    }

    getAccountandPassword(){
        chrome.storage.local.get('account', function (result) {
            if(result.account != undefined){
                setTimeout(() => document.querySelector('input[name="loginId"]').value = result.account, 250);
                
            }
            
        });
        chrome.storage.local.get('password', function (result) {
            if(result.password != undefined){
                setTimeout(() => document.querySelector('input[name="password"]').value = result.password, 250);
                
            }
            
        });
    }

    useFeature() {
        chrome.storage.sync.get('autorecognize', function (data) {
            if(data.autorecognize==undefined){
                chrome.storage.sync.set({autorecognize: 2})
            }
            else{
                console.log(data.autorecognize)
            }
        

        chrome.storage.sync.get('todayKey', function(result){
            var currentDate = new Date();
            
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth() + 1; // 月份從 0 開始，所以要加 1
            var day = currentDate.getDate();
            var seconds = currentDate.getSeconds();

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
                    checkusagecount(2)
                }
                if(result.todayKey == todayKey){
                    console.log("今日:"+result.todayKey+" 剩餘次數："+data.autorecognize)
                    checkusagecount(data.autorecognize)
                }
            }
        })

        
        
        
            
            
        });
        
   
        
        
    }
}
function checkusagecount(usageCount){
    chrome.storage.local.get('checked2', function (result) {
        autorecognizestatus = result.checked2;
        console.log(autorecognizestatus)
        if (usageCount > 0 && autorecognizestatus == "on") {
        console.log('執行功能');
        lighton();
        recognizebase64pic(usageCount)
    } else {
        console.log('不執行自動填入');
    }
    });

}

function recognizebase64pic(usageCount)
{
    var notificationId = 'notification'
    const self = this;
    function extractBase64String() {
        const imageElement = document.getElementById('validatePic');
        if (!imageElement) {
            console.error('Image element not found.');
            return null;
        }

        const imageSrc = imageElement.src;
        if (imageSrc.startsWith('data:image')) {
            const base64String = imageSrc.replace(/^data:image\/(png|jpg);base64,/, '');
            return base64String;
        } else {
            console.error('Image src is not a base64 string.');
            return null;
        }
    }


    function recognizeImage(base64String) {
       $.post('https://script.google.com/macros/s/AKfycbybHVOHoph4bbKF5JOh6OSBvQiXkZFnmrxDQWSOvXk04IVgSIs4Gqrq6wl6khZHUCtv2Q/exec',{
    data:base64String,
},function(e){
    const validateCodeInput = document.getElementById('validateCode');
            if (validateCodeInput) {
                removeNotification(notificationId);
                const recognizedText = e;
                validateCodeInput.value = recognizedText;
                console.log('Text filled in input field:', recognizedText);
                validateCodeInput.dispatchEvent(new Event('input', { bubbles: true }));
                lightoff();
            } else {
                console.error('Input field with ID "validateCode" not found.');
            }
});
    }
    function main() {
        const base64String = extractBase64String();
        if (base64String) {
            var notificationId = createNotification('Recognizing...');
            recognizeImage(base64String);
            chrome.storage.sync.set({autorecognize : usageCount-1});
        }
    }
    setTimeout(main, 100);
};
function lighton(){
    var input = document.getElementById('validateCode');
    var start = null;
    function rotateGlow(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        input.style.boxShadow = '0 0 10px 5px rgb(255, 143, 0)'; 
        input.style.transform = 'rotate(' + progress / 10 + 'deg)';
        
    }
    requestAnimationFrame(rotateGlow);


}
function lightoff(){
    var input = document.getElementById('validateCode');
    
    input.style.boxShadow = 'none';


}

function createNotification(message) {
    var notification = document.createElement('div');
    notification.style.position = 'absolute';
    
    var validateCodeElement = document.getElementById('validateCode');
    var rect = validateCodeElement.getBoundingClientRect();

    var centerX = rect.left + rect.width / 2 + window.scrollX;
    var centerY = rect.top + rect.height / 2 + window.scrollY;

    notification.style.top = (centerY - notification.offsetHeight / 2) + 'px';
    notification.style.left = (centerX - notification.offsetWidth / 2) + 'px';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = '#ffffff';
    notification.style.padding = '12px';
    notification.style.border = '1px solid #000000';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    notification.id = 'notification';
    document.body.appendChild(notification);

    return notification.id;
}

function removeNotification(notificationId) {
    var notification = document.getElementById(notificationId);
    if (notification) {
        notification.parentNode.removeChild(notification);
    }
}

    

    



    (function () {
        new DistrictSchoolSelector();
        
        chrome.storage.sync.get('schNoValue', function (result) {
            this.schNoValue = result.schNoValue;
        
            chrome.storage.sync.get('schNoSelectIndex', function(result){
                this.schNoSelectIndex = result.schNoSelectIndex;
            });
            $.post("School.action", { schNo: result.schNoValue }, function (json) {
                var d = json.parameterMap;
                if (d != null && d.list != null) {
                    var h1 = ['<option value="">請選擇</option>'];
                    var cc = {};
            
                    var doChange = false;
            
                    for (var i = 0; i < d.list.length; i++) {
                        var selected = '';
                        if (d.list[i].d == 'Y') {
                            selected = ' selected="selected"';
                            doChange = true;
                        }
                        h1.push('<option value="' + d.list[i].z + '"' + selected + '>' + d.list[i].n + '</option>');
                        cc['' + d.list[i].z] = d.list[i].s;
                    }
            
                    $("#zip").html(h1.join("")).change(function () {
                        var v = $(this).val();
                        var def = $('#schNo').attr("def");
                        $('#schNo').removeAttr("def");
            
                        if (cc[v]) {
                            var h2 = ['<option value="">請選擇</option>'];
                            for (var i = 0; i < cc[v].length; i++) {
                                var selected = '';
                                if (def != null && def == cc[v][i].s) selected = ' selected="selected"';
                                h2.push('<option value="' + cc[v][i].s + '"' + selected + '>' + cc[v][i].n + '</option>');
                            }
                            $("#schNo").html(h2.join(""));
                            if (h2.length == 2) {
                                $("#schNo").val($("#schNo").find("option:last")[0].value);
                                $("#loginId").focus();
                            }
                        }
                    })
            
                    if (doChange) {
                        $("#schNo").attr("def", "553301D");
                        $("#zip").change();
                    }
                }
                setTimeout(3000);
                $("#schNo").prop("selectedIndex", result.schNoSelectIndex);
            }, 'json');
        })
    })();



    
