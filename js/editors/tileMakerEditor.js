import { CanvasDrawer, Vector2D, AllCollisions, AtlasController, Tile, TileType, TileTerrain, ArrayUtility } from '../internal.js';

/**
 * @class
 * @constructor
 */
class TileMakerEditor {
	/** @static @type {TileMakerEditor} */ static _Instance;

	constructor() {
		TileMakerEditor._Instance = this;

		/** @type {string} */ this.tileName = '';
		/** @type {Vector2D} */ this.tileOffset = new Vector2D(0, 0);
		/** @type {boolean} */ this.appendTile = false;
		/** @type {HTMLDivElement} */ this.container;
		/** @type {HTMLCanvasElement} */ this.canvas;
		/** @type {CanvasRenderingContext2D} */ this.canvasCtx;
		/** @type {HTMLCanvasElement} */ this.selectedCanvas;
		/** @type {CanvasRenderingContext2D} */ this.selectedCanvasCtx;
		this.gridHTML;
		/** @type {Object.<string, Tile>} */ this.tiles = {};
		/** @type {number} */ this.tileLayoutIndex = 0;
		/** @type {Array<Array<number[]>>} */ this.tileLayout = [];
		/** @type {Vector2D} */ this.selectedGrid = new Vector2D(0, 0);
		/** @type {Vector2D} */ this.gridSize = new Vector2D(32, 32);
		/** @type {boolean} */ this.isDrawing = false;
		/** @type {boolean} */ this.isMoving = false;
		/** @type {(number|undefined)} */ this.selectedPixel = undefined;
		/** @type {HTMLButtonElement} */ this.openButton = /** @type {HTMLButtonElement} */ (document.getElementById('tilemaker-editor'));
		this.openButton.addEventListener('click', this);

		this.inputTileName;
		this.inputTileWidth;
		this.inputTileHeight;
		this.inputTileOffsetX;
		this.inputTileOffsetY;

		this.SetupHTML();
	}

	SetupHTML() {
		if (document.getElementById('tilemaker-editor-grid') === undefined || document.getElementById('tilemaker-editor-grid') === null) {
			window.requestAnimationFrame(() => this.SetupHTML());
			return;
		}

		this.container = /** @type {HTMLDivElement} */ (document.getElementById('tilemaker-editor-container'));
		this.canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('tilemaker-editor-canvas'));
		this.canvasCtx = this.canvas.getContext('2d');
		this.gridHTML = document.getElementById('tilemaker-editor-grid');
		this.canvasCtx.imageSmoothingEnabled = false;

		this.selectedCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById('tilemaker-editor-canvas-tilemaker'));
		this.selectedCanvasCtx = this.selectedCanvas.getContext('2d');
		this.selectedCanvasCtx.globalAlpha = 0.5;

		this.inputTileName = /** @type {HTMLInputElement} */ (document.getElementById('tilemaker-editor-tilename'));
		this.inputTileWidth = /** @type {HTMLInputElement} */ (document.getElementById('tilemaker-editor-tilewidth'));
		this.inputTileHeight = /** @type {HTMLInputElement} */ (document.getElementById('tilemaker-editor-tileheight'));

		this.gridHTML.addEventListener('mousemove', this);
		this.gridHTML.addEventListener('mousedown', this);
		this.gridHTML.addEventListener('mouseup', this);
		this.container.addEventListener('click', this);
		this.container.addEventListener('input', this);

		this.inputTileOffsetX = /** @type {HTMLInputElement} */ (document.getElementById('tilemaker-editor-tileoffset-x'));
		this.inputTileOffsetY = /** @type {HTMLInputElement} */ (document.getElementById('tilemaker-editor-tileoffset-y'));

		this.SetupTileLayoutArray();
		this.UpdateTileLayoutArray();
		this.ChangeCanvas(this.gridSize);
		this.DrawTiles();
	}

	SetupTileLayoutArray() {
		for (let y = 0, l = this.canvas.height / 32; y < l; ++y) {
			this.tileLayout.push([]);
			for (let x = 0, l = this.canvas.width / 32; x < l; ++x) {
				this.tileLayout[y].push([]);
			}
		}
	}

	UpdateTileLayoutArray() {
		if (this.gridSize.x / 32 > this.tileLayout[0].length || this.gridSize.y / 32 > this.tileLayout.length) {
			for (let y = 0, l = this.gridSize.y / 32; y < l; ++y) {
				if (y > this.tileLayout.length - 1) {
					this.tileLayout.push([]);

					for (let x = 0, l = this.gridSize.x / 32; x < l; ++x) {
						this.tileLayout[y].push([]);
					}
				} else {
					for (let x = 0, l = this.gridSize.x / 32; x < l; ++x) {
						if (x > this.tileLayout[y].length - 1) {
							this.tileLayout[y].push([]);
						}
					}
				}
			}
		} else if (this.gridSize.x / 32 <= this.tileLayout[0].length) {
			for (let y = 0, l = this.tileLayout.length; y < l; ++y) {
				this.tileLayout[y].splice(this.gridSize.x / 32);
			}
		} else if (this.gridSize.y / 32 <= this.tileLayout.length) {
			this.tileLayout.splice(this.gridSize.y / 32);
		}
	}

	ChangeRowColumnTileLayout(columnRow = false, insertAppend = false) {
		if (columnRow === false) {
			for (let y = 0, l = this.tileLayout.length; y < l; ++y) {
				this.tileLayout[y].splice(this.selectedGrid.x + (insertAppend === false ? 0 : 1), 0, []);
			}
			this.gridSize.x += 32;
		} else {
			let row = []
			for (let x = 0, l = this.gridSize.x / 32; x < l; ++x) {
				row.push([]);
			}

			this.tileLayout.splice(this.selectedGrid.y + (insertAppend === false ? 0 : 1), 0, row);
			this.gridSize.y += 32;
		}

		this.ChangeCanvas(this.gridSize);
		this.DrawTiles();
		this.DrawSelectedTile();
	}

	RemoveRowColumnTileLayout(columnRow = false) {
		if (columnRow === false) {
			for (let y = 0, l = this.tileLayout.length; y < l; ++y) {
				this.tileLayout[y].splice(this.selectedGrid.x, 1);
			}
			this.gridSize.x -= 32;
		} else {
			this.tileLayout.splice(this.selectedGrid.y, 1);
			this.gridSize.y -= 32;
		}

		this.ChangeCanvas(this.gridSize);
		this.DrawTiles();
		this.DrawSelectedTile();
	}

	/**
	 * 
	 * @param {Vector2D} size 
	 */
	ChangeCanvas(size) {
		this.canvas.setAttribute('width', size.x.toString());
		this.canvas.setAttribute('height', size.y.toString());
		this.selectedCanvas.setAttribute('width', this.canvas.getAttribute('width'));
		this.selectedCanvas.setAttribute('height', this.canvas.getAttribute('height'));
		this.container.setAttribute('width', size.x.toString());
		this.container.setAttribute('height', size.y.toString());
		this.gridHTML.style.width = size.x + 'px';
		this.gridHTML.style.height = size.y + 'px';
		this.inputTileHeight.value = size.y.toString();
		this.inputTileWidth.value = size.x.toString();
		let controlsContainer = /** @type {HTMLDivElement} */ (this.container.children[1]);
		controlsContainer.style.width = size.x + 'px';
		//controlsContainer.style.height = size.y + 'px';
	}

	SetTiles(name, tiles, tileLayout) {
		this.tileName = name;
		this.inputTileName.value = this.tileName;

		if (Array.isArray(tiles)) {
			this.tiles = {};
			this.tileLayoutIndex = tiles.length;

			for (let i = 0, l = tiles.length; i < l; ++i) {
				this.tiles[i] = tiles[i];
			}
		} else {
			let keys = Object.keys(tiles);
			this.tiles = {};
			this.tileLayoutIndex = keys.length;
			for (let i = 0, l = keys.length; i < l; ++i) {
				this.tiles[i] = tiles[keys[i]];
			}
		}

		this.tileLayout = [];

		for (let y = 0, yL = tileLayout.length; y < yL; ++y) {
			this.tileLayout.push([]);
			for (let x = 0, xL = tileLayout[y].length; x < xL; ++x) {
				this.tileLayout[y].push([]);

				if (Array.isArray(tileLayout[y][x])) {
					for (let i = 0, l = tileLayout[y][x].length; i < l; ++i) {
						this.tileLayout[y][x].push(tileLayout[y][x][i]);
					}
				} else {
					this.tileLayout[y][x].push(tileLayout[y][x]);
				}
			}
		}

		this.gridSize.x = this.tileLayout[0].length * 32;
		this.gridSize.y = this.tileLayout.length * 32;
		this.ChangeCanvas(new Vector2D(this.tileLayout[0].length * 32, this.tileLayout.length * 32));
		this.DrawTiles();
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {void}
	 */
	AddTile(tile) {
		let newTile = new Tile(new Vector2D(this.tileOffset.x, this.tileOffset.y), new Vector2D(tile.tilePosition.x, tile.tilePosition.y), new Vector2D(32, 32), tile.transparent, tile.atlas, 0, TileType.Prop, TileTerrain.Wood);
		let keys = Object.keys(this.tiles);
		for (let i = 0, l = keys.length; i < l; ++i) {
			const tObject = this.tiles[keys[i]];
			if (tObject.position.Equal(newTile.position) && tObject.tilePosition.Equal(newTile.tilePosition) && tObject.size.Equal(newTile.size) && tObject.atlas === newTile.atlas) {
				if (newTile.IsTransparent() === true || this.appendTile === true)
					this.tileLayout[this.selectedGrid.y][this.selectedGrid.x].push(i);
				else
					this.tileLayout[this.selectedGrid.y][this.selectedGrid.x] = [i];
				return;
			}
		}

		this.tiles[this.tileLayoutIndex] = newTile;
		this.tileLayout[this.selectedGrid.y][this.selectedGrid.x].push(this.tileLayoutIndex);
		++this.tileLayoutIndex;
		this.tileOffset.x = 0;
		this.tileOffset.y = 0;
		this.inputTileOffsetX.value = this.tileOffset.x.toString();
		this.inputTileOffsetY.value = this.tileOffset.y.toString();
	}

	ClearTile() {
		this.tileLayout[this.selectedGrid.y][this.selectedGrid.x] = [];
		this.DrawTiles();
	}

	CheckUnusedTiles() {
		let usedIndexes = [];

		for (let y = 0, lY = this.canvas.height / 32; y < lY; ++y) {
			for (let x = 0, lX = this.canvas.width / 32; x < lX; ++x) {
				for (let i = 0, l = this.tileLayout[y][x].length; i < l; ++i) {
					usedIndexes.push(this.tileLayout[y][x][i]);
				}
			}
		}

		/** @type {Object.<string, Tile>} */
		let tempTiles = {};
		let lut = {};

		for (let i = 0, l = usedIndexes.length; i < l; ++i) {
			if (this.tiles[usedIndexes[i]] !== undefined) {
				tempTiles[i] = this.tiles[usedIndexes[i]];
				lut[usedIndexes[i]] = i;
			}
		}

		for (let y = 0, lY = this.canvas.height / 32; y < lY; ++y) {
			for (let x = 0, lX = this.canvas.width / 32; x < lX; ++x) {
				for (let i = 0, l = this.tileLayout[y][x].length; i < l; ++i) {
					this.tileLayout[y][x][i] = lut[this.tileLayout[y][x][i]];
				}
			}
		}

		this.tiles = tempTiles;
	}

	DrawTiles() {
		this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let y = 0, lY = this.canvas.height / 32; y < lY; ++y) {
			for (let x = 0, lX = this.canvas.width / 32; x < lX; ++x) {
				for (let i = 0, l = this.tileLayout[y][x].length; i < l; ++i) {
					if (this.tileLayout[y][x][i] === null)
						continue;

					const tile = this.tiles[this.tileLayout[y][x][i]];

					this.canvasCtx.drawImage(
						AtlasController.GetAtlas(tile.atlas).GetCanvas(),
						tile.GetPosX(),
						tile.GetPosY(),
						tile.size.x,
						tile.size.y,
						x * 32 + tile.position.x,
						y * 32 + tile.position.y,
						tile.size.x,
						tile.size.y
					);
				}
			}
		}
	}

	DrawSprite(sprite) {
		if (sprite !== undefined) {
			this.AddTile(sprite);
			this.DrawTiles();

			if (AllCollisions[sprite.atlas] !== undefined) {
				for (let i = 0, l = AllCollisions[sprite.atlas].length; i < l; ++i) {
					let pos = AllCollisions[sprite.atlas][i].Clone();
					pos.Mult(this.gridSize);
					this.AddCollisionPixels(pos);
				}
			}
		}
	}

	DrawPreview(position) {
		this.DrawSprite();
		this.canvasCtx.fillStyle = 'red';
		this.canvasCtx.fillRect(position.x, position.y, this.gridSize.x, this.gridSize.y);
	}

	DrawSelectedTile() {
		this.selectedCanvasCtx.clearRect(0, 0, this.selectedCanvas.width, this.selectedCanvas.height);
		this.selectedCanvasCtx.globalAlpha = 0.25;
		this.selectedCanvasCtx.fillStyle = 'red';
		this.selectedCanvasCtx.fillRect(this.selectedGrid.x * 32, this.selectedGrid.y * 32, 32, 32);
	}

	AddCollisionPixels(position) {
		let mousePosition = position.Clone();
		mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);
	}

	Open() {
		this.container.style.visibility = 'visible';
		this.positionMap = {};
		this.DrawSprite();
	}

	Close() {
		this.container.style.visibility = 'collapse';
	}

	handleEvent(e) {
		switch (e.type) {
			case 'mousemove':
				if (this.isDrawing) {
					let mousePosition = new Vector2D(e.layerX, e.layerY);
					mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);
					this.DrawPreview(mousePosition);
					if (this.isDrawing === true) {
						this.AddCollisionPixels(new Vector2D(e.layerX, e.layerY));
					}
				}
				break;

			case 'mousedown':
				let position = new Vector2D(e.layerX, e.layerY);

				this.selectedGrid = position;
				this.selectedGrid.ToGrid(32);
				this.DrawSelectedTile();
				break;

			case 'mouseup':
				this.isDrawing = false;
				this.isMoving = false;
				this.selectedPixel = undefined;
				break;

			case 'click':
				switch (e.target.id) {
					case 'tilemaker-editor-addtile':
						this.DrawSprite(CanvasDrawer.GCD.selectedSprite);
						break;
					case 'tilemaker-editor-cleartile':
						this.ClearTile();
						break;

					case 'tilemaker-editor-save':
						this.CheckUnusedTiles();
						let tileContent = this.tileName + ": { \r\nname: '" + this.tileName + "', \r\ntiles: ";
						tileContent += ArrayUtility.ObjectAsArrayToString(this.tiles, Tile.prototype.SaveToFile) + ',';
						tileContent += '\r\ntileLayout: ';
						tileContent += ArrayUtility.ToString(this.tileLayout) + '\r\n}';
						navigator.clipboard.writeText(tileContent);
						break;

					case 'tilemaker-editor': this.Open(); break;
					case 'tilemaker-editor-close': this.Close(); break;
					case 'tilemaker-editor-updatesize': this.UpdateTileLayoutArray(); this.ChangeCanvas(this.gridSize); this.DrawTiles(); break;
					case 'tilemaker-editor-insertcolumn': this.ChangeRowColumnTileLayout(false, false); break;
					case 'tilemaker-editor-insertrow': this.ChangeRowColumnTileLayout(true, false); break;
					case 'tilemaker-editor-appendcolumn': this.ChangeRowColumnTileLayout(false, true); break;
					case 'tilemaker-editor-appendrow': this.ChangeRowColumnTileLayout(true, true); break;
					case 'tilemaker-editor-removecolumn': this.RemoveRowColumnTileLayout(false); break;
					case 'tilemaker-editor-removerow': this.RemoveRowColumnTileLayout(true); break;
				}
				break;

			case 'input':
				switch (e.target.id) {
					case 'tilemaker-editor-tilename':
						this.tileName = this.inputTileName.value;
						break;

					case 'tilemaker-editor-tilewidth': this.gridSize.x = Number(this.inputTileWidth.value); break;
					case 'tilemaker-editor-tileheight': this.gridSize.y = Number(this.inputTileHeight.value); break;
					case 'tilemaker-editor-tileoffset-x': this.tileOffset.x = Number(this.inputTileOffsetX.value); break;
					case 'tilemaker-editor-tileoffset-y': this.tileOffset.y = Number(this.inputTileOffsetY.value); break;
					case 'tilemaker-editor-appendtile': this.appendTile = e.target.checked; break;
				}
				break;
		}
	}
}

export { TileMakerEditor };