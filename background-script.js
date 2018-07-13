
function openLogin() {
    console.log('openLogin')
    chrome.tabs.create({ url: "http://kallax.sstar.xin" });
}
function showNoti(status){
    var status_msg = ''
    if (status == 0){//未保存
        status_msg = "移除成功";
    }else{
        status_msg = "保存成功";
    }
     
    deskNoti = new Notification(
        chrome.app.getDetails().name,
        // Instead of just message text, the second parameter is now an object
        //  with multiple properties. Message text should go into "body" parameter:
        { body: status_msg }
      );
      
      // Instead of .cancel(), the function to close the notification is now .close()
      deskNoti.onclick = function() { openPage(); this.close() };
      
      // Notifications are now shown automatically; there is no .show() function
      deskNoti.show();
}
function saveTabUrk(tab,token) {
    console.log(token);
    let params = {userkey:token,url:tab.url,source:'Chrome',type:4,title:tab.title,img:tab.favIconUrl}
    axios.post('http://kallax.sstar.xin/api/add_item', params)
        .then(function (response) {
            console.log(response);
            showNoti(response.data.status)
        })
        .catch(function (error) {
            console.log(error);
        });
}
function openList(token) {
    chrome.tabs.getSelected(null, function (tab) {
        console.log(tab);
        if (tab.url == 'chrome://newtab/') {// 如果页面为空页面 跳转到列表
            chrome.tabs.update(null, { url: "http://kallax.sstar.xin" });
        } else {// 如果页面为有效页面 保存
            saveTabUrk(tab,token);
        }


    });
}
function getLocalStorage(){
    chrome.storage.sync.get(['token'], function(result) {
        console.log('Settings retrieved', result.value);
        if (result.value == null){
            openLogin()
        }else{
            openList(result.value)
        }
      });
}
function browserActionClick() {
    // 判断当前 是否有userkey
    chrome.cookies.get({
        url: 'http://kallax.sstar.xin',
        name: 'token'
    },
        function (cookie) {
            console.log(cookie);
            if (cookie == null) {// 若果没有 检查localSotrage
                getLocalStorage()
                
            } else {// 如果有 判断当前页面类型
                openList(cookie.value)
            }
        });
}
function contextMenuClick(info,tab){
    console.log(tab);
    browserActionClick()
}
chrome.browserAction.onClicked.addListener(getLocalStorage);
chrome.contextMenus.create({"title": "Save to Kallax",onclick:contextMenuClick}, function() {
    console.log('contextMenus action');
    if (chrome.extension.lastError) {
      console.log("Got expected error: " + chrome.extension.lastError.message);
    }
  });