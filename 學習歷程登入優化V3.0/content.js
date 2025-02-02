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
        const loginButton2 = document.getElementById('openId');
        if (loginButton || loginButton2) {
            loginButton.addEventListener('click', () => {
                this.Mainfunction();
            });
            loginButton2.addEventListener('click', () => {
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
        
        if (window.location.href.startsWith("https://highschool.kh.edu.tw/")) {
            document.getElementById("btnOK").click();
        
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
                            $("#schNo").attr("def", result.schNoValue);
                            $("#zip").change();
                        }
                    }
                    setTimeout(() => $("#schNo").prop("selectedIndex", result.schNoSelectIndex), 500);
                    
                }, 'json');
            })
        };
        chrome.storage.local.get('checked2foropenid', function (result) {
                if(result.checked2foropenid == "on"){
                    setTimeout(() => {
                        document.getElementById('openId').click();
                    }, 250);
                }
                else{
                    if (window.location.href.startsWith("https://highschool.kh.edu.tw/")) {
                        new DistrictSchoolSelector();
                    }
                    
                }
            });
        
        
        
        if (window.location.href.startsWith("https://openid.kh.edu.tw/")) {
            chrome.storage.local.get(['openidpassword','openidaccount'], function (result) {
                if(result.openidaccount && result.openidpassword){
                    document.querySelectorAll('button').forEach(btn => {
                        if (btn.textContent.trim() === '直接輸入帳號') {
                            btn.click();
                         }
                        });
                }
                if(result.openidpassword){
                    document.getElementById('password').value = result.openidpassword;
                }
                if(result.openidaccount){
                    document.getElementById('userid').value = result.openidaccount;
                }
            })
            

            chrome.storage.local.get('checkedforopenid', function (result) {
                if(result.checkedforopenid == "on"){
                    setTimeout(() => {
                        document.querySelector('.btn_submit').form.submit();
                    }, 500);
                    document.getElementById('bt_go').click();
                }
            });
        }
    })();



    
