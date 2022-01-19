import { Vector2D, Tile, TileType, TileTerrain, AtlasController, BoxCollision, correctMouse, CMath, LightSystem, CanvasDrawer, BWDrawingType, Color, CollisionHandler, OverlapOverlapsCheck, CollisionTypeCheck } from '../../../internal.js';

/**
 * @class
 * @constructor
 */
class CanvasAtlas {

	/**
	 * Creates a new CanvasAtlas
	 * @param {CanvasDrawer} CanvasDrawer 
	 * @param {string} url 
	 * @param {number} width 
	 * @param {number} height 
	 * @param {number} atlasSize 
	 * @param {string} name 
	 */
	constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
		this.sprites = {};
		/** @type {CanvasObject} */ this.canvasObject = new CanvasObject(this, url, width, height);
		/** @type {number} */ this.width = width;
		/** @type {number} */ this.height = height;
		/** @type {number} */ this.atlasSize = atlasSize;
		/** @type {string} */ this.name = name;
		/** @type {CanvasDrawer} */ this.CanvasDrawer = CanvasDrawer;

		/** @type {MouseEvent} */ this.mouseStart; 
		/** @type {Vector2D} */ this.startDrag;
		/** @type {Vector2D} */ this.endDrag;
	}

	toJSON() {
		return {
			url: this.canvasObject.url,
			width: this.width,
			height: this.height,
			atlasSize: this.atlasSize,
			name: this.name
		}
	}

	GenerateSprites() {

	}

	ImageLoaded() {
		document.getElementById('container-allcanvases').appendChild(this.canvasObject.canvas);
		this.canvasObject.canvas.id = this.name;
		this.canvasObject.canvas.addEventListener('mousedown', this);
		this.canvasObject.canvas.addEventListener('mousemove', this);
		this.canvasObject.canvas.addEventListener('mouseleave', this);
		this.canvasObject.canvas.addEventListener('mouseup', this);
		this.canvasObject.canvas.addEventListener('click', this);
		AtlasController._Instance.hasLoadedAllImages[this.name] = true;
	}

	/**
	 * 
	 * @returns {HTMLCanvasElement}
	 */
	GetCanvas() {
		return this.canvasObject.canvas;
	}

	/**
	 * 
	 * @returns {HTMLImageElement}
	 */
	GetImage() {
		return this.canvasObject.image;
	}

	GetSpriteSize() {
		if (this.atlasSize !== -1) {
			return new Vector2D(this.atlasSize, this.atlasSize);
		} else {
			return new Vector2D(this.canvasObject.width, this.canvasObject.height);
		}
	}

	/**
	 * 
	 * @param {MouseEvent} e 
	 */
	handleEvent(e) {
		switch (e.type) {
			case 'mousedown':
				this.mouseStart = e;// mouseToAtlas(e, this.atlasSize);
				break;

			case 'mousemove':
				this.canvasObject.canvasCtx.clearRect(0, 0, this.canvasObject.canvas.width, this.canvasObject.canvas.height);
				this.canvasObject.canvasCtx.drawImage(this.canvasObject.image, 0, 0);
				let pos = correctMouse(e);
				pos.SnapToGridF(32);
				this.canvasObject.canvasCtx.strokeStyle = 'goldenrod';
				this.canvasObject.canvasCtx.strokeRect(pos.x, pos.y, 32, 32);
				this.canvasObject.canvasCtx.stroke();
				break;

			case 'mouseleave':
				this.canvasObject.canvasCtx.clearRect(0, 0, this.canvasObject.canvas.width, this.canvasObject.canvas.height);
				this.canvasObject.canvasCtx.drawImage(this.canvasObject.image, 0, 0);
				break;

			case 'mouseup':
				let canvasPos = new Vector2D(this.mouseStart.x, this.mouseStart.y);
				this.startDrag = correctMouse(this.mouseStart);
				this.endDrag = correctMouse(e);
				this.startDrag.ToGrid();
				this.endDrag.ToGrid();
				this.startDrag.Swap(this.endDrag);

				let calcCoords = new Vector2D(this.endDrag.x, this.endDrag.y);
				calcCoords.Sub(this.startDrag);
				calcCoords.AddF(1);

				this.CanvasDrawer.SetSelection(
					new Tile(
						canvasPos,
						new Vector2D(this.startDrag.x, this.startDrag.y),
						new Vector2D(calcCoords.x * this.atlasSize, calcCoords.y * this.atlasSize),
						false,
						this.name
					)
				);
				break;
		}
	}
}

/**
 * @class
 * @constructor
 * @extends CanvasAtlas
 */
class CanvasAtlasObject extends CanvasAtlas {

	/**
	 * Creates a new CanvasAtlasObject
	 * @param {CanvasDrawer} CanvasDrawer 
	 * @param {string} url 
	 * @param {number} width 
	 * @param {number} height 
	 * @param {number} atlasSize 
	 * @param {string} name 
	 */
	constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
		super(CanvasDrawer, url, width, height, atlasSize, name);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	SetSelection(position) {
		this.CanvasDrawer.SetSelection(
			new Tile(
				position,
				new Vector2D(0, 0),
				new Vector2D(this.width, this.height),
				false,
				this.name,
				0,
				TileType.Prop,
				TileTerrain.Ground
			)
		);
	}

	/**
	 * 
	 * @param {MouseEvent} e 
	 */
	handleEvent(e) {
		switch (e.type) {
			case 'mouseup':
				let canvasPos = new Vector2D(e.x, e.y);

				this.CanvasDrawer.SetSelection(
					new Tile(
						canvasPos,
						new Vector2D(0, 0),
						new Vector2D(this.width, this.height),
						false,
						this.name,
						0,
						TileType.Prop,
						TileTerrain.Ground
					)
				);
				break;
		}
	}
}

/**
 * @class
 * @constructor
 */
class CanvasObject {

	/**
	 * 
	 * @param {CanvasAtlas} parent 
	 * @param {string} url 
	 * @param {number} width 
	 * @param {number} height 
	 */
	constructor(parent, url, width = 0, height = 0) {
		this.parent = parent;
		/** @type {string} */ this.url = url;
		/** @type {number} */ this.width = width;
		/** @type {number} */ this.height = height;
		/** @type {HTMLCanvasElement} */ this.canvas = document.createElement('canvas');
		this.canvas.setAttribute('width', width.toFixed());
		this.canvas.setAttribute('height', height.toFixed());
		/** @type {CanvasRenderingContext2D} */ this.canvasCtx = this.canvas.getContext('2d');
		this.canvasCtx.imageSmoothingEnabled = false;
		/** @type {HTMLImageElement} */ this.image;
		/** @type {ImageData} */ this.imageData;

		this.LoadImage();
	}

	LoadImage() {
		this.image = new Image();

		this.image.crossOrigin = "Anonymous";
		this.image.onload = () => { this.DrawImage() };
		this.image.src = this.url;
	}

	DrawImage() {
		this.canvasCtx.drawImage(this.image, 0, 0);
		this.imageData = this.canvasCtx.getImageData(0, 0, this.width, this.height);
		this.parent.ImageLoaded();
	}
}

/**
 * @class
 * @constructor
 */
class ShadowCanvasOperation {

	/**
	 * 
	 * @param {CanvasObject} canvasObject 
	 */
	constructor(canvasObject) {
		/** @type {CanvasObject} */ this.canvasObject = canvasObject;
		/** @type {HTMLCanvasElement} */ this.shadowCanvas = document.createElement('canvas');

		if (this.canvasObject.parent.atlasSize !== -1) {
			this.shadowCanvas.setAttribute('width', this.canvasObject.parent.atlasSize.toFixed());
			this.shadowCanvas.setAttribute('height', this.canvasObject.parent.atlasSize.toFixed());
		} else {
			this.shadowCanvas.setAttribute('width', this.canvasObject.width.toFixed());
			this.shadowCanvas.setAttribute('height', this.canvasObject.height.toFixed());
		}
		document.getElementById('container-allcanvases').appendChild(this.shadowCanvas);
		/** @type {CanvasRenderingContext2D} */ this.shadowCanvasCtx = this.shadowCanvas.getContext('2d');
		this.shadowCanvasCtx.imageSmoothingEnabled = false;

		/** @type {BWDrawingType} */ this.drawType = BWDrawingType.None;
		/** @type {Color} */ this.lastShadowColor = LightSystem.SkyLight.color.Clone();

		this.GenerateShadow();
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @param {boolean} forceUpdate 
	 * @returns {void}
	 */
	UpdateShadow(tile = undefined, forceUpdate = false) {
		if (tile === undefined)
			return;

		this.shadowCanvasCtx.clearRect(0, 0, tile.size.x, tile.size.y);
		this.shadowCanvasCtx.drawImage(
			this.canvasObject.canvas,
			tile.GetPosX(),
			tile.GetPosY(),
			tile.size.x,
			tile.size.y,
			0,
			0,
			tile.size.x,
			tile.size.y
		);

		this.GenerateShadow();
		this.ChangeColor(this.lastShadowColor, forceUpdate);
	}

	GenerateShadow() {
		if (this.shadowCanvas === undefined)
			return;

		this.shadowCanvasCtx.globalCompositeOperation = 'source-in';
		this.shadowCanvasCtx.fillStyle = 'rgba(' + LightSystem.SkyLight.color.red + ', ' + LightSystem.SkyLight.color.green + ', ' + LightSystem.SkyLight.color.blue + ', ' + LightSystem.SkyLight.color.alpha + ')';// LightSystem.SkyLight.color.ToString();
		this.shadowCanvasCtx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
		this.shadowCanvasCtx.globalCompositeOperation = 'source-over';
	}

	/**
	 * 
	 * @param {BoxCollision} bb 
	 * @param {LightSystem} lightSystem 
	 */
	ChangeColorTest(bb, lightSystem) {
		if (this.shadowCanvas === undefined)
			return;

		let overlaps = CollisionHandler.GCH.GetOverlapsByClassName(bb, 'AmbientLight', OverlapOverlapsCheck, CollisionTypeCheck.Overlap);

		for (let i = 0, l = overlaps.length; i < l; ++i) {
			let closestPoint = CMath.ClosestPointOnPolygon(bb.boundingBox.GetCornersVector2D(), overlaps[i].collisionOwner.position);

			if (closestPoint !== null) {
				let newColor = lightSystem.GetColor(closestPoint);
				newColor.AlphaMultiply();

				this.lastShadowColor.Set(newColor);

				let gradient;
				switch (this.drawType) {
					case BWDrawingType.Behind:
						gradient = this.shadowCanvasCtx.createLinearGradient(bb.GetCenterPositionV2().x - bb.boundingBox.x, bb.GetCenterPositionV2().y - bb.boundingBox.y, closestPoint.x - bb.boundingBox.x, closestPoint.y - bb.boundingBox.y);

						let gradientColor = new Color(
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.red, LightSystem.SkyLight.color.red, CMath.EaseIn(256 / 256)), 0, 255)),
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.green, LightSystem.SkyLight.color.green, CMath.EaseIn(256 / 256)), 0, 255)),
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.blue, LightSystem.SkyLight.color.blue, CMath.EaseIn(256 / 256)), 0, 255)),
							255
						);
						gradient.addColorStop(0, gradientColor.ToString());

						gradientColor = new Color(
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.red, LightSystem.SkyLight.color.red, CMath.EaseIn(0 / 256)), 0, 255)),
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.green, LightSystem.SkyLight.color.green, CMath.EaseIn(0 / 256)), 0, 255)),
							Math.floor(CMath.Clamp(CMath.Lerp(newColor.blue, LightSystem.SkyLight.color.blue, CMath.EaseIn(0 / 256)), 0, 255)),
							255
						);
						gradient.addColorStop(1, gradientColor.ToString());

						this.shadowCanvasCtx.globalCompositeOperation = 'source-in';
						this.shadowCanvasCtx.fillStyle = gradient;
						this.shadowCanvasCtx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
						this.shadowCanvasCtx.globalCompositeOperation = 'source-over';
						break;
					case BWDrawingType.Front:
						gradient = this.shadowCanvasCtx.createLinearGradient(bb.GetCenterPositionV2().x - bb.boundingBox.x, bb.GetCenterPositionV2().y - bb.boundingBox.y, closestPoint.x - bb.boundingBox.x, closestPoint.y - bb.boundingBox.y);
						gradient.addColorStop(0, LightSystem.SkyLight.color.ToString());
						gradient.addColorStop(1, LightSystem.SkyLight.color.ToString());

						this.shadowCanvasCtx.globalCompositeOperation = 'source-in';
						this.shadowCanvasCtx.fillStyle = gradient;
						this.shadowCanvasCtx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
						this.shadowCanvasCtx.globalCompositeOperation = 'source-over';
						break;
				}
			}
		}
	}

	/**
	 * 
	 * @param {Color} color 
	 * @param {boolean} forceUpdate 
	 * @returns {void}
	 */
	ChangeColor(color = undefined, forceUpdate = false) {
		if (this.shadowCanvas === undefined)
			return;

		if (forceUpdate === false && color.Equal(this.lastShadowColor) === true)
			return;

		this.lastShadowColor.Set(color);

		let gradient;
		switch (this.drawType) {
			case BWDrawingType.Behind:
				gradient = this.shadowCanvasCtx.createLinearGradient(0, Math.max(this.shadowCanvas.height - 256, 0), 0, this.shadowCanvas.height);

				let gradientColor = new Color(
					Math.floor(CMath.Clamp(CMath.Lerp(color.red, LightSystem.SkyLight.color.red, CMath.EaseIn(256 / 256)), 0, 255)),
					Math.floor(CMath.Clamp(CMath.Lerp(color.green, LightSystem.SkyLight.color.green, CMath.EaseIn(256 / 256)), 0, 255)),
					Math.floor(CMath.Clamp(CMath.Lerp(color.blue, LightSystem.SkyLight.color.blue, CMath.EaseIn(256 / 256)), 0, 255)),
					255
				);
				gradient.addColorStop(0, gradientColor.ToString());

				gradientColor = new Color(
					Math.floor(CMath.Clamp(CMath.Lerp(color.red, LightSystem.SkyLight.color.red, CMath.EaseIn(0 / 256)), 0, 255)),
					Math.floor(CMath.Clamp(CMath.Lerp(color.green, LightSystem.SkyLight.color.green, CMath.EaseIn(0 / 256)), 0, 255)),
					Math.floor(CMath.Clamp(CMath.Lerp(color.blue, LightSystem.SkyLight.color.blue, CMath.EaseIn(0 / 256)), 0, 255)),
					255
				);
				gradient.addColorStop(1, gradientColor.ToString());

				this.shadowCanvasCtx.globalCompositeOperation = 'source-in';
				this.shadowCanvasCtx.fillStyle = gradient;
				this.shadowCanvasCtx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
				this.shadowCanvasCtx.globalCompositeOperation = 'source-over';
				break;
			case BWDrawingType.Front:
				gradient = this.shadowCanvasCtx.createLinearGradient(0, 0, 0, this.shadowCanvas.height);
				gradient.addColorStop(0, LightSystem.SkyLight.color.ToString());
				gradient.addColorStop(1, LightSystem.SkyLight.color.ToString());

				this.shadowCanvasCtx.globalCompositeOperation = 'source-in';
				this.shadowCanvasCtx.fillStyle = gradient;
				this.shadowCanvasCtx.fillRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
				this.shadowCanvasCtx.globalCompositeOperation = 'source-over';
				break;
		}
	}
}

export { CanvasAtlas, CanvasAtlasObject, CanvasObject, ShadowCanvasOperation };