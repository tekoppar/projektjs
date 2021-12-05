class CanvasUtility {
    static SaveAsFile(base64, fileName) {
        var link = document.createElement("a");

        document.body.appendChild(link); // for Firefox

        link.setAttribute("href", base64);
        link.setAttribute("download", fileName);
        link.click();
    }

    static SaveCanvasToPNG(canvas, name = 'canvasDrawing') {
        let base64 = canvas.toDataURL('image/png');
        if (base64.length > 256) {
            CanvasUtility.SaveAsFile(base64, name);
        }
    }

    static SaveCanvasDrawToPNG(canvas, name = 'canvasDrawing', options = {smooth: true}) {
        let temp = document.createElement('canvas');
        temp.setAttribute('width', canvas.width);
        temp.setAttribute('height', canvas.height);
        temp.getContext('2d').imageSmoothingEnabled = options.smooth;

        temp.getContext('2d').drawImage(canvas, 0, 0);

        CanvasUtility.SaveCanvasToPNG(temp, name);
    }

    static CanvasPortionToImage(x, y, w, h, atlas) {
        if (atlas !== undefined) {
            let canvas = atlas.GetCanvas();
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;

            tempCanvas.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);

            let newImage = new Image(w, h);
            newImage.src = tempCanvas.toDataURL('image/png');
            tempCanvas.remove();

            return newImage;
        }
        return null;
    }
}

export { CanvasUtility };