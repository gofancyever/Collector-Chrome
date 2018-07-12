function openSaveView() {
    console.log('openSaveView');
    // Avoid recursive frame insertion...
    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('notification.html');

        // Some styles for a fancy sidebar
        iframe.style.cssText = 'border: none; display: block; height: 260px; overflow: hidden; position: fixed; right: 0px; top: 0px; left: auto; float: none; width: 335px; z-index: 2147483647; background: transparent;';
        document.body.appendChild(iframe);
    }
}
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        let tab = request.message;
        let token = request.token;
        alert(token);
        sendResponse("popup返回值");
        openSaveView();
        window.postMessage({message:tab,token:token}, '*');
    }
);

