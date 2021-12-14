class XHRUtility {
    static JSPost(url, jsonData, callee = undefined, callback = undefined) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if (callee !== undefined && callback !== undefined) {
            xhr.responseType = 'json';
            xhr.onreadystatechange = function () { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    if (this.response !== null && this.response !== undefined && this.response !== '')
                        callback.call(callee, this.response);
                }
            }
        }
        xhr.send(JSON.stringify(jsonData));
    }
}

export { XHRUtility };