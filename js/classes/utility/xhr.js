class XHRUtility {
    static JSPost(url, jsonData) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(JSON.stringify(jsonData));
    }
}

export { XHRUtility };