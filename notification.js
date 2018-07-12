function saveTabUrl(tab, token) {
    console.log('正在保存');
    let params = { userkey: token, url: tab.url, source: 'Chrome', type: 4, title: tab.title, img: tab.favIconUrl }
    axios.post('http://kallax.sstar.xin/api/add_item', params)
        .then(function (response) {
            console.log('保存成功');
            console.log(response);
            showNoti(response.data.status)
        })
        .catch(function (error) {
            console.log(error);
        });
}
window.addEventListener("message", function (event) {
    console.log('接收到tab 开始请求')
    let tab = event.data.message
    let token = event.data.token
    console.log(tab);
    saveTabUrl(tab,token)
}, false);
