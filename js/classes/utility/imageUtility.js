import { Math3D, Vector2D, Vector, CanvasUtility } from '../../internal.js';

class ImageUtility {
    static RotateImage(url, angle) {
        let newImage = new Image();
        newImage.src = url;
        newImage.crossOrigin = "Anonymous";
        newImage.dataset.angle = angle;
        newImage.addEventListener('load', function (newImage) {
            ImageUtility.RotateLoadedImage(newImage);
        }, false);
    }

    static RotateLoadedImage(loadEvent) {
        let image = loadEvent.target;
        let tempCanvas = document.createElement('canvas');
        tempCanvas.setAttribute('width', image.width);
        tempCanvas.setAttribute('height', image.height);
        
        tempCanvas.getContext('2d').drawImage(image, 0, 0);
        let pixels = tempCanvas.getContext('2d').getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        Math3D.RotatePixelData2D(pixels.data, new Vector2D(image.width, image.height), new Vector(0, 0, image.dataset.angle), 0, new Vector(image.width / 2, image.height / 2, image.width / 2));
        tempCanvas.getContext('2d').putImageData(pixels, 0, 0, 0, 0, tempCanvas.width, tempCanvas.height);
        CanvasUtility.SaveCanvasToPNG(tempCanvas, 'rotated_image.png');
    }
}

export { ImageUtility };