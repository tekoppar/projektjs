import { Vector2D, AllCollisions, AtlasController, Tile, AllBlockingCollisions } from '../internal.js';


/**
 * Enum for collision editor tool
 * @readonly
 * @enum {number}
 */
const CollisionEditorToolEnum = {
	None: 0,
	Drawing: 1,
	Moving: 2,
}

/**
 * @class
 * @constructor
 */
class CollisionEditor {
	/** @type {CollisionEditor} */ static GCEditor;

	constructor() {
		this.container;
		/** @type {HTMLCanvasElement} */ this.canvas;
		/** @type {HTMLCanvasElement} */ this.collisionCanvas;
		/** @type {HTMLDivElement} */ this.gridHTML;
		/** @type {Tile} */ this.sprite;
		/** @type {string} */ this.tileName = undefined;
		/** @type {Vector2D} */ this.gridSize = new Vector2D(32, 32);
		/** @type {boolean} */ this.isDrawing = false;
		/** @type {boolean} */ this.isMoving = false;
		/** @type {Vector2D[]} */ this.collisionPositions = [];
		/** @type {(number|undefined)} */ this.selectedPixel = undefined;
		/** @type {Object.<string, number>} */ this.positionMap = {};
		/** @type {HTMLButtonElement} */ this.copyCollision;
		/** @type {CollisionEditorToolEnum} */ this.collisionEditorTool = CollisionEditorToolEnum.None;

		this.SetupHTML();
	}

	SetupHTML() {
		if (document.getElementById('collision-editor-grid') === undefined || document.getElementById('collision-editor-grid') === null) {
			window.requestAnimationFrame(() => this.SetupHTML());
			return;
		}

		this.container = document.getElementById('collision-editor');
		this.canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('collision-editor-canvas'));
		let ctx = this.canvas.getContext('2d');
		this.gridHTML = /** @type {HTMLDivElement} */ (document.getElementById('collision-editor-grid'));
		this.copyCollision = /** @type {HTMLButtonElement} */ (document.getElementById('collision-editor-copy'));
		ctx.imageSmoothingEnabled = false;

		this.collisionCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById('collision-editor-canvas-collision'));
		let ctxC = this.collisionCanvas.getContext('2d');
		ctxC.imageSmoothingEnabled = false;
		ctxC.globalAlpha = 0.3;

		this.SetGridSize(new Vector2D(32, 32));

		this.gridHTML.addEventListener('mousemove', this);
		this.gridHTML.addEventListener('mousedown', this);
		this.gridHTML.addEventListener('mouseup', this);
		this.container.addEventListener('click', this);
	}

	/**
	 * 
	 * @param {Vector2D} spriteSize 
	 */
	SetGridSize(spriteSize) {
		this.canvas.setAttribute('width', (spriteSize.x * 4).toString());
		this.canvas.setAttribute('height', (spriteSize.y * 4).toString());
		this.canvas.nextElementSibling.setAttribute('width', this.canvas.getAttribute('width'));
		this.canvas.nextElementSibling.setAttribute('height', this.canvas.getAttribute('height'));
		this.container.setAttribute('width', (spriteSize.x * 4).toString());
		this.container.setAttribute('height', (spriteSize.y * 4).toString());
		this.gridHTML.style.backgroundSize = parseFloat(this.canvas.getAttribute('width')) / spriteSize.x + 'px ' + parseFloat(this.canvas.getAttribute('height')) / spriteSize.y + 'px';
		this.gridSize = new Vector2D(parseFloat(this.canvas.getAttribute('width')) / spriteSize.x, parseFloat(this.canvas.getAttribute('height')) / spriteSize.y);
		//this.collisionPositions = new Array(spriteSize.x * spriteSize.y);
		//this.collisionPositions.fill(null, 0, spriteSize.x * spriteSize.y);
	}

	DrawSprite() {
		if (this.sprite !== undefined) {
			let ctx = this.canvas.getContext('2d');
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			ctx.drawImage(AtlasController.GetAtlas(this.sprite.atlas).GetCanvas(), this.sprite.GetPosX(), this.sprite.GetPosY(), this.sprite.size.x, this.sprite.size.y, 0, 0, this.canvas.width, this.canvas.height);

			this.DrawCollisionPixel();
		}
	}

	LoadOverlap() {
		if (AllCollisions[this.tileName] !== undefined) {
			this.collisionPositions = [];
			this.positionMap = {};

			for (let i = 0, l = AllCollisions[this.tileName].length; i < l; ++i) {
				let pos = AllCollisions[this.tileName][i].Clone();
				pos.Mult(this.gridSize);
				this.AddCollisionPixels(pos);
			}

			this.DrawCollisionPixel();
		}
	}

	LoadBlocking() {
		if (AllBlockingCollisions[this.tileName] !== undefined) {
			this.collisionPositions = [];
			this.positionMap = {};

			for (let i = 0, l = AllBlockingCollisions[this.tileName].length; i < l; ++i) {
				let pos = AllBlockingCollisions[this.tileName][i].Clone();
				pos.Mult(this.gridSize);
				this.AddCollisionPixels(pos);
			}

			this.DrawCollisionPixel();
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	DrawPreview(position) {
		this.DrawSprite();
		let ctx = this.canvas.getContext('2d');
		ctx.fillStyle = 'red';
		ctx.fillRect(position.x, position.y, this.gridSize.x, this.gridSize.y);
	}

	DrawCollisionPixel() {
		let ctx = this.collisionCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.collisionCanvas.width, this.collisionCanvas.height);
		ctx.fillStyle = 'cyan';
		ctx.strokeStyle = 'white';
		ctx.globalAlpha = 0.3;

		ctx.beginPath();
		let first = false;
		for (let position of this.collisionPositions) {
			if (position !== null && position !== undefined) {
				ctx.globalAlpha = 0.3;
				if (first === false) {
					ctx.moveTo(position.x, position.y);
					first = true;
				}
				ctx.lineTo(position.x, position.y);

				ctx.globalAlpha = 1.0;
				ctx.fillRect(position.x, position.y, this.gridSize.x, this.gridSize.y);
			}
		}
		ctx.globalAlpha = 1;
		ctx.closePath();
		ctx.lineWidth = 3;
		ctx.stroke();
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	AddCollisionPixels(position) {
		let mousePosition = position.Clone();
		mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);

		if (this.positionMap[mousePosition.x + '-' + mousePosition.y] === undefined) {
			this.positionMap[mousePosition.x + '-' + mousePosition.y] = this.collisionPositions.length;
			this.collisionPositions.push(mousePosition);
		}
	}

	/**
	 * 
	 * @param {Tile} sprite 
	 * @param {string} tileName
	 */
	Open(sprite, tileName = undefined) {
		if (sprite !== undefined) {
			this.container.style.visibility = 'visible';
			this.sprite = sprite;
			this.collisionPositions = [];
			this.positionMap = {};
			this.tileName = tileName;

			let saveGetCont = /** @type {HTMLDivElement} */ (this.container.querySelector('div.collision-editor-save-get'));
			if (this.tileName !== undefined) {
				saveGetCont.style.display = 'flex';
			} else {
				saveGetCont.style.display = 'none';
			}

			if (this.tileName === undefined) {
				if (AllCollisions[this.sprite.atlas] !== undefined) {
					for (let i = 0, l = AllCollisions[this.sprite.atlas].length; i < l; ++i) {
						let pos = AllCollisions[this.sprite.atlas][i].Clone();
						pos.Mult(this.gridSize);
						this.AddCollisionPixels(pos);
					}
				}
			} else {
				this.LoadOverlap();
			}

			this.SetGridSize(this.sprite.size);
			this.DrawSprite();
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @returns {number}
	 */
	PixelExists(position) {
		for (let i = 0, l = this.collisionPositions.length; i < l; ++i) {
			if (this.collisionPositions[i].x - 5 <= position.x && position.x <= this.collisionPositions[i].x + 5 && this.collisionPositions[i].y - 5 <= position.y && position.y <= this.collisionPositions[i].y + 5)
				return i;
		}

		return undefined;
	}

	/**
	 * Returns the collision positions in real world units
	 * @returns {Vector2D[]}
	 */
	GetCollisionPositions() {
		let arr = [];

		for (let i = 0, l = this.collisionPositions.length; i < l; ++i) {
			arr.push(new Vector2D(this.collisionPositions[i].x / this.gridSize.x, this.collisionPositions[i].y / this.gridSize.y));
		}

		return arr;
	}

	LogPoints() {
		let string = '[';
		for (let position of this.collisionPositions) {
			if (position !== null && position !== undefined) {
				string += 'new Vector2D(' + position.x / this.gridSize.x + ', ' + position.y / this.gridSize.y + '), ';
			}
		}
		string += ']';

		navigator.clipboard.writeText(string);
	}

	handleEvent(e) {
		switch (e.type) {
			case 'mousemove':
				let mousePosition = new Vector2D(e.layerX, e.layerY);
				mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);
				this.DrawPreview(mousePosition);

				if (this.isDrawing === true) {
					this.AddCollisionPixels(new Vector2D(e.layerX, e.layerY));
					this.DrawCollisionPixel();
				} else if (this.isMoving === true) {
					delete this.collisionPositions[this.selectedPixel].x + '-' + this.collisionPositions[this.selectedPixel].y;
					this.positionMap[mousePosition.x + '-' + mousePosition.y] = this.selectedPixel;
					this.collisionPositions[this.selectedPixel].x = mousePosition.x;
					this.collisionPositions[this.selectedPixel].y = mousePosition.y;
					this.DrawCollisionPixel();
				}
				break;

			case 'mousedown':
				let position = new Vector2D(e.layerX, e.layerY);

				switch (this.collisionEditorTool) {
					case CollisionEditorToolEnum.Moving:
						if (this.PixelExists(position) !== undefined) {
							this.selectedPixel = this.PixelExists(position);
							this.isMoving = true;
						}
						break;

					case CollisionEditorToolEnum.Drawing:
						this.isDrawing = true;
						this.AddCollisionPixels(position);
						this.DrawCollisionPixel();
						break;
				}
				break;

			case 'mouseup':
				this.isDrawing = false;
				this.isMoving = false;
				this.selectedPixel = undefined;
				this.DrawCollisionPixel();
				break;

			case 'click':
				switch (e.target.id) {
					case 'collision-editor-copy':
						this.LogPoints();
						break;

					case 'collision-editor-close':
						this.container.style.visibility = 'collapse';
						break;

					case 'collision-editor-draw':
						this.collisionEditorTool = CollisionEditorToolEnum.Drawing;
						break;

					case 'collision-editor-move':
						this.collisionEditorTool = CollisionEditorToolEnum.Moving;
						break;
				}

				switch (e.target.className) {
					case 'collision-editor-save-get-saveoverlap':
						if (this.tileName !== undefined) {
							AllCollisions[this.tileName] = this.GetCollisionPositions();
						}
						break;

					case 'collision-editor-save-get-getoverlap':
						if (this.tileName !== undefined && AllCollisions[this.tileName] !== undefined) {
							this.LoadOverlap();
						}
						break;

					case 'collision-editor-save-get-saveblock':
						if (this.tileName !== undefined) {
							AllBlockingCollisions[this.tileName] = this.GetCollisionPositions();
						}
						break;

					case 'collision-editor-save-get-getblock':
						if (this.tileName !== undefined && AllBlockingCollisions[this.tileName] !== undefined) {
							this.LoadBlocking();
						}
						break;
				}
				break;

		}
	}
}

export { CollisionEditor };