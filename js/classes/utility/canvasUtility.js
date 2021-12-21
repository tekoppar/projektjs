import { CanvasAtlas } from "../../internal.js";

/**
 * @class
 * @constructor
 */
class CanvasUtility {
	static SaveAsFile(base64, fileName) {
		var link = document.createElement("a");

		document.body.appendChild(link); // for Firefox

		link.setAttribute("href", base64);
		link.setAttribute("download", fileName);
		link.click();
	}

	/**
	 * 
	 * @param {HTMLCanvasElement} canvas 
	 * @param {string} name 
	 */
	static SaveCanvasToPNG(canvas, name = 'canvasDrawing') {
		let base64 = canvas.toDataURL('image/png');
		if (base64.length > 256) {
			CanvasUtility.SaveAsFile(base64, name);
		}
	}

	/**
	 * 
	 * @param {HTMLCanvasElement} canvas 
	 * @param {string} name 
	 * @param {{smooth:boolean}} options 
	 */
	static SaveCanvasDrawToPNG(canvas, name = 'canvasDrawing', options = {smooth: true}) {
		let temp = document.createElement('canvas');
		temp.setAttribute('width', canvas.width.toString());
		temp.setAttribute('height', canvas.height.toString());
		temp.getContext('2d').imageSmoothingEnabled = options.smooth;

		temp.getContext('2d').drawImage(canvas, 0, 0);

		CanvasUtility.SaveCanvasToPNG(temp, name);
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @param {CanvasAtlas} atlas 
	 * @returns {HTMLImageElement}
	 */
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

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} w 
	 * @param {number} h 
	 * @param {CanvasAtlas} atlas 
	 * @param {HTMLCanvasElement} canvas 
	 */
	static CanvasPortionToCanvas(x, y, w, h, atlas, canvas) {
		if (atlas !== undefined) {
			let canvasAtlas = atlas.GetCanvas();

			canvas.getContext('2d').drawImage(canvasAtlas, x, y, w, h, 0, 0, w, h);
		}
	}

	/**
	 * 
	 * @param {HTMLImageElement} image 
	 * @param {HTMLCanvasElement} canvas 
	 */
	 static ImageToCanvas(image, canvas) {
		if (image !== undefined) {
			canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
		}
	}
}

export { CanvasUtility };