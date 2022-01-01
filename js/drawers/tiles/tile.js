import {
	Matrix, Vector2D, CanvasDrawer, TileLUT, AtlasController, GetAtlasTileMatrix, CollisionEditor,
	PropEditor, SaveController
} from '../../internal.js';

/**
 * @readonly 
 * @enum {number}
 */
const TileType = {
	Water: 0,
	Ground: 1,
	Air: 2,
	Cliff: 3,
	Prop: 4,
};

/**
 * @readonly
 * @enum {number}
 */
const TileTerrain = {
	Grass: 0,
	Rock: 1,
	Water: 2,
	Wood: 3,
	Soil: 4,
	Plant: 5,
	Tree: 6,
	Fence: 7,
	Leaves: 8,
	Ground: 9,
};

/**
 * @readonly
 * @enum {string}
 */
const TileULDREnum = {
	0x00001100: 'UpLeft',
	0x00001000: 'Up',
	0x00001001: 'UpRight',
	0x00000100: 'Left',
	0x00001111: 'Middle',
	0x00000001: 'Right',
	0x00000110: 'DownLeft',
	0x00000010: 'Down',
	0x00000011: 'DownRight',
	0x00010000: 'CornerUpLeft',
	0x00100000: 'CornerUpRight',
	0x01000000: 'CornerDownLeft',
	0x10000000: 'CornerDownRight',
	0x00010011: 'AngleUpLeft',
	0x00100110: 'AngleUpRight',
	0x01001001: 'AngleDownLeft',
	0x10001100: 'AngleDownRight',
	0x01100000: 'CornerDoubleDLUR',
	0x10010000: 'CornerDoubleULDR'
};

/**
 * @readonly
 * @enum {number}
 */
const TileULDRLUT = {
	UpLeft: 0x00001100,
	Up: 0x00001000,
	UpRight: 0x00001001,
	Left: 0x00000100,
	Middle: 0x00001111,
	Right: 0x00000001,
	DownLeft: 0x00000110,
	Down: 0x00000010,
	DownRight: 0x00000011,
	CornerUpLeft: 0x01000000,
	CornerUpRight: 0x10000000,
	CornerDownLeft: 0x00010000,
	CornerDownRight: 0x00100000,
	AngleUpLeft: 0x00010011,
	AngleUpRight: 0x00100110,
	AngleDownLeft: 0x01001001,
	AngleDownRight: 0x10001100,
	CornerDoubleDLUR: 0x01100000,
	CornerDoubleULDR: 0x10010000,
};

/**
 * @class
 * @constructor
 */
class TileULDR {
	//UL UR DL DR U L D R
	/** @type {Object.<number, string>} */ static TileULDR = {
		0x00001100: 'UpLeft',
		0x00001000: 'Up',
		0x00001001: 'UpRight',
		0x00000100: 'Left',
		0x00001111: 'Middle',
		0x00000001: 'Right',
		0x00000110: 'DownLeft',
		0x00000010: 'Down',
		0x00000011: 'DownRight',
		0x00010000: 'CornerUpLeft',
		0x00100000: 'CornerUpRight',
		0x01000000: 'CornerDownLeft',
		0x10000000: 'CornerDownRight',
		0x00010011: 'AngleUpLeft',
		0x00100110: 'AngleUpRight',
		0x01001001: 'AngleDownLeft',
		0x10001100: 'AngleDownRight',
		0x01100000: 'CornerDoubleDLUR',
		0x10010000: 'CornerDoubleULDR'
	};

	/** @type {Object.<string, number>} */ static TileULDRLUT = {
		UpLeft: 0x00001100,
		Up: 0x00001000,
		UpRight: 0x00001001,
		Left: 0x00000100,
		Middle: 0x00001111,
		Right: 0x00000001,
		DownLeft: 0x00000110,
		Down: 0x00000010,
		DownRight: 0x00000011,
		CornerUpLeft: 0x01000000,
		CornerUpRight: 0x10000000,
		CornerDownLeft: 0x00010000,
		CornerDownRight: 0x00100000,
		AngleUpLeft: 0x00010011,
		AngleUpRight: 0x00100110,
		AngleDownLeft: 0x01001001,
		AngleDownRight: 0x10001100,
		CornerDoubleDLUR: 0x01100000,
		CornerDoubleULDR: 0x10010000,
	};

	/**
	 * 
	 * @param {*} value 
	 * @returns {string}
	 */
	static Get(value) {
		return TileULDR.TileULDRLUT[value] !== undefined ? value : TileULDR.TileULDR[value];
	}

	static GetNumber(value) {
		let keys = Object.keys(this.TileULDRLUT);

		return keys.indexOf(value);
	}
}

/**
 * @class
 * @constructor
 */
class TileLUTData {

	/**
	 * 
	 * @param {string} atlas 
	 * @param {TileType} tileType 
	 * @param {TileTerrain} tileTerrain 
	 * @param {boolean} transparent 
	 * @param {TileULDR} tileULDR 
	 * @param {string} tileSet 
	 */
	constructor(atlas = 'terrain', tileType = TileType.Ground, tileTerrain = TileTerrain.Grass, transparent = false, tileULDR = TileULDR.TileULDRLUT.Middle, tileSet = 'default') {
		/** @type {string} */ this.atlas = atlas;
		/** @type {TileType} */ this.tileType = tileType;
		/** @type {TileTerrain} */ this.tileTerrain = tileTerrain;
		/** @type {boolean} */ this.transparent = transparent;
		/** @type {TileULDR} */ this.tileULDR = tileULDR;
		/** @type {string} */ this.tileSet = tileSet;
		/** @type {Vector2D} */ this.tilePosition = new Vector2D(0, 0);
	}

	/**
	 * 
	 * @returns {{atlas: string, tileType: number, tileTerrain: number, transparent: boolean, tileULDR: TileULDR, tileSet: string, tilePosition: {x:number, y:number}, size: { x: 32, y: 32 }}}
	 */
	toJSON() {
		return {
			atlas: this.atlas,
			tileType: this.tileType,
			tileTerrain: this.tileTerrain,
			transparent: this.transparent,
			tileULDR: this.tileULDR,
			tileSet: this.tileSet,
			tilePosition: this.tilePosition,
			size: { x: 32, y: 32 }
		};
	}
}

/**
 * @class
 * @constructor
 */
class TileData {
	static TileLUT = TileLUT;
	/** @type {Object.<string, Object.<string, Tile>>} */ static TileLUTSets = {};
	static TilesSets = {};
	static tileData = new TileData();
	static tileGUI = {};
	/** @type {(Tile|Tile[])} */ static Selection;

	constructor() {

	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	static AddTileLUT(tile) {
		if (TileData.TileLUT[tile.atlas] === undefined)
			TileData.TileLUT[tile.atlas] = {};

		if (TileData.TileLUT[tile.atlas][tile.tilePosition.y] === undefined)
			TileData.TileLUT[tile.atlas][tile.tilePosition.y] = {};

		if (TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] === undefined)
			TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] = {};

		TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] = new TileLUTData(
			tile.atlas,
			TileType[TileData.tileGUI.tiletype.value],
			TileTerrain[TileData.tileGUI.tileterrain.value],
			tile.IsTransparent(),
			TileULDR.Get(TileData.tileGUI.tileuldr.value),
			TileData.tileGUI.tileset.value
		);
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {HTMLImageElement}
	 */
	static CanvasPortionToImage(tile) {
		if (AtlasController.GetAtlas(tile.atlas) !== undefined) {
			let canvas = AtlasController.GetAtlas(tile.atlas).GetCanvas();
			//let ctx = canvas.getContext('2d');
			let tempCanvas = document.createElement('canvas');
			tempCanvas.setAttribute('height', tile.size.y.toString());
			tempCanvas.setAttribute('width', tile.size.x.toString());

			tempCanvas.getContext('2d').drawImage(canvas, tile.GetPosX(), tile.GetPosY(), tile.size.x, tile.size.y, 0, 0, 32, 32);

			let newImage = new Image(tile.size.x, tile.size.y);
			newImage.src = tempCanvas.toDataURL('image/png');
			newImage.dataset.tileType = tile.tileType.toString();
			newImage.dataset.tileTerrain = tile.tileTerrain.toString();
			newImage.addEventListener('click', tile);

			return newImage;
		}
		return null;
	}

	CreateTileLUTList() {
		let typeKeys = Object.keys(TileData.TileLUT);
		for (let iT = 0; iT < typeKeys.length; iT++) {
			let yKeys = Object.keys(TileData.TileLUT[typeKeys[iT]]);
			for (let y = 0; y < yKeys.length; y++) {
				let xKeys = Object.keys(TileData.TileLUT[typeKeys[iT]][yKeys[y]]);
				for (let x = 0; x < xKeys.length; x++) {
					let tileLUT = TileData.TileLUT[typeKeys[iT]][yKeys[y]][xKeys[x]];

					if (tileLUT.tileSet === undefined)
						tileLUT.tileSet = 'default';

					let newTile = new Tile(
						new Vector2D(0, 0),
						new Vector2D(parseInt(xKeys[x]), parseInt(yKeys[y])),
						new Vector2D(32, 32),
						tileLUT.transparent,
						typeKeys[iT],
						0,
						tileLUT.tileType,
						tileLUT.tileTerrain
					);
					let newImage = TileData.CanvasPortionToImage(newTile);

					if (newImage !== null) {
						if (tileLUT.tileSet !== 'default') {
							if (document.getElementById('tile-lut-editor-tiles').querySelector('div[data-tileset="' + tileLUT.tileSet + '"]') === null) {
								let setContainer = document.createElement('div');
								setContainer.dataset.tileset = tileLUT.tileSet;
								setContainer.className = 'tile-lut-editor-tiles-setcontainer';

								if (TileData.TileLUTSets[tileLUT.tileSet] === undefined) {
									TileData.TileLUTSets[tileLUT.tileSet] = {};
									TileData.TilesSets[tileLUT.tileSet] = {};
								}

								tileLUT.tilePosition = new Vector2D(parseInt(xKeys[x]), parseInt(yKeys[y]));
								tileLUT.size = new Vector2D(32, 32);
								TileData.TileLUTSets[tileLUT.tileSet][tileLUT.tileULDR] = tileLUT;
								TileData.TilesSets[tileLUT.tileSet][tileLUT.tileULDR] = newTile;

								setContainer.appendChild(newImage);
								document.getElementById('tile-lut-editor-tiles').appendChild(setContainer);
							} else {
								tileLUT.tilePosition = new Vector2D(parseInt(xKeys[x]), parseInt(yKeys[y]));
								tileLUT.size = new Vector2D(32, 32);
								TileData.TileLUTSets[tileLUT.tileSet][tileLUT.tileULDR] = tileLUT;
								TileData.TilesSets[tileLUT.tileSet][tileLUT.tileULDR] = newTile;
								document.getElementById('tile-lut-editor-tiles').querySelector('div[data-tileset="' + tileLUT.tileSet + '"]').appendChild(newImage);
							}
						} else {
							tileLUT.tilePosition = new Vector2D(parseInt(xKeys[x]), parseInt(yKeys[y]));
							tileLUT.size = new Vector2D(32, 32);
							document.getElementById('tile-lut-editor-tiles').appendChild(newImage);
						}
					}
				}
			}
		}
	}

	CreateTileLUTEditor() {
		if (document.getElementById('template-tile-lut-editor') == null) {
			window.requestAnimationFrame(() => this.CreateTileLUTEditor());
			return;
		}

		let template = document.getElementById('template-tile-lut-editor');

		if (template == null) {
			window.requestAnimationFrame(() => this.CreateTileLUTEditor());
			return;
		}

		// @ts-ignore
		let clone = template.content.cloneNode(true);
		clone.firstElementChild.id = 'tile-lut-editor';
		TileData.tileGUI.name = clone.getElementById('tile-lut-editor-name');
		TileData.tileGUI.selection = clone.getElementById('tile-lut-editor-selection');
		TileData.tileGUI.atlas = clone.getElementById('tile-lut-editor-atlas');

		TileData.tileGUI.tileuldr = clone.getElementById('tile-lut-editor-tileuldr');
		TileData.tileGUI.tileterrain = clone.getElementById('tile-lut-editor-tileterrain');
		TileData.tileGUI.tiletype = clone.getElementById('tile-lut-editor-tiletype');
		TileData.tileGUI.tileset = clone.getElementById('tile-lut-editor-tileset');

		TileData.tileGUI.transparent = clone.getElementById('tile-lut-editor-transparent');
		TileData.tileGUI.button = clone.getElementById('tile-lut-editor-add');
		TileData.tileGUI.export = clone.getElementById('tile-lut-editor-export');

		TileData.tileGUI.tileeditortiles = clone.getElementById('tile-lut-editor-tiles');

		TileData.tileGUI.filtertileterrain = clone.getElementById('tile-lut-editor-filter-bool-tileterrain');
		TileData.tileGUI.filtertiletype = clone.getElementById('tile-lut-editor-filter-bool-tiletype');

		TileData.tileGUI.collisionEditor = clone.getElementById('tile-lut-editor-collision-editor');

		TileData.tileGUI.propEditor = clone.getElementById('tile-lut-editor-prop-editor');

		document.getElementById('container-controls-fixed').children[1].appendChild(clone);

		TileData.tileGUI.tileterrain.addEventListener('change', this);
		TileData.tileGUI.tiletype.addEventListener('change', this);
		TileData.tileGUI.button.addEventListener('click', this);
		TileData.tileGUI.export.addEventListener('click', this);
		TileData.tileGUI.collisionEditor.addEventListener('click', this);

		TileData.tileGUI.filtertileterrain.addEventListener('input', this);
		TileData.tileGUI.filtertileterrain.children[0].addEventListener('click', this);
		TileData.tileGUI.filtertiletype.addEventListener('input', this);
		TileData.tileGUI.filtertiletype.children[0].addEventListener('click', this);

		let uldrKeys = Object.keys(TileULDR.TileULDRLUT);
		for (let i = 0, l = uldrKeys.length; i < l; ++i) {
			let option = document.createElement('option');
			option.innerText = option.value = uldrKeys[i];

			TileData.tileGUI.tileuldr.appendChild(option.cloneNode(true));
		}

		let terrainKeys = Object.keys(TileTerrain);
		for (let i = 0, l = terrainKeys.length; i < l; ++i) {
			let option = document.createElement('option');
			option.innerText = option.value = terrainKeys[i];

			let label = document.createElement('label'),
				checkbox = document.createElement('input');

			checkbox.type = 'checkbox';
			checkbox.checked = true;
			checkbox.dataset.value = terrainKeys[i];
			label.innerText = terrainKeys[i];
			label.appendChild(checkbox);

			TileData.tileGUI.tileterrain.appendChild(option.cloneNode(true));
			TileData.tileGUI.filtertileterrain.appendChild(label);
		}

		let tileTypeKeys = Object.keys(TileType);
		for (let i = 0, l = tileTypeKeys.length; i < l; ++i) {
			let option = document.createElement('option');
			option.innerText = option.value = tileTypeKeys[i];

			let label = document.createElement('label'),
				checkbox = document.createElement('input');

			checkbox.type = 'checkbox';
			checkbox.checked = true;
			checkbox.dataset.value = tileTypeKeys[i];
			label.innerText = tileTypeKeys[i];
			label.appendChild(checkbox);

			TileData.tileGUI.tiletype.appendChild(option.cloneNode(true));
			TileData.tileGUI.filtertiletype.appendChild(label);
		}

		this.CreateTileLUTList();

		TileData.tileData.SelectionLoop();
	}

	SelectionLoop() {
		let tile;
		if (CanvasDrawer.GCD.selectedSprite !== undefined &&
			((Array.isArray(CanvasDrawer.GCD.selectedSprite) === true && TileData.Selection !== CanvasDrawer.GCD.selectedSprite[0]) ||
				(Array.isArray(CanvasDrawer.GCD.selectedSprite) === false && TileData.Selection !== CanvasDrawer.GCD.selectedSprite))) {

			if (Array.isArray(CanvasDrawer.GCD.selectedSprite) === true)
				tile = CanvasDrawer.GCD.selectedSprite[0];
			else
				tile = CanvasDrawer.GCD.selectedSprite;

			TileData.tileGUI.selection.innerText = 'x: ' + tile.position.x + ' y: ' + tile.position.y +
				' tX: ' + tile.tilePosition.x + ' tY: ' + tile.tilePosition.y +
				' w: ' + tile.size.x + ' h: ' + tile.size.y;
			TileData.tileGUI.atlas.innerText = tile.atlas;

			tile.transparent = undefined;
			TileData.tileGUI.transparent.innerText = tile.IsTransparent();

			TileData.tileGUI.tileterrain.value = TileData.tileGUI.tileterrain.options[tile.tileTerrain].value;
			TileData.tileGUI.tiletype.value = TileData.tileGUI.tiletype.options[tile.tileType].value;
			TileData.tileGUI.tileuldr.value = TileULDR.Get(tile.tileULDR);
			TileData.tileGUI.tileset.value = tile.tileSet;

			TileData.Selection = tile;
		}
	}

	FilterTiles() {
		let matchingTiles = TileData.tileGUI.tileeditortiles.querySelectorAll('img');

		for (let i = 0, l = matchingTiles.length; i < l; ++i) {
			if (TileData.tileGUI.filtertiletype.children[Number(matchingTiles[i].dataset.tileType) + 1].children[0].checked === true &&
				TileData.tileGUI.filtertileterrain.children[Number(matchingTiles[i].dataset.tileTerrain) + 1].children[0].checked === true)
				matchingTiles[i].style.display = 'block';
			else
				matchingTiles[i].style.display = 'none';
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				switch (e.target.id) {
					case 'tile-lut-editor-add':
						if (CanvasDrawer.GCD.selectedSprite instanceof Tile)
							TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
						else {
							for (let i = 0, l = CanvasDrawer.GCD.selectedSprite.length; i < l; ++i) {
								TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
							}
						}
						break;

					case 'tile-lut-editor-export':
						SaveController.SaveTileLUT(TileData.TileLUT);
						//navigator.clipboard.writeText(JSON.stringify(TileData.TileLUT));
						break;

					case 'tile-lut-editor-filter-bool-tiletype-legend':
						for (let i = 1, l = TileData.tileGUI.filtertiletype.children.length; i < l; ++i) {
							TileData.tileGUI.filtertiletype.children[i].children[0].checked = true;
						}
						this.FilterTiles();
						break;
					case 'tile-lut-editor-filter-bool-tileterrain-legend':
						for (let i = 1, l = TileData.tileGUI.filtertileterrain.children.length; i < l; ++i) {
							TileData.tileGUI.filtertileterrain.children[i].children[0].checked = true;
						}
						this.FilterTiles();
						break;

					case 'tile-lut-editor-collision-editor':
						if (CanvasDrawer.GCD.selectedSprite !== undefined && CanvasDrawer.GCD.selectedSprite instanceof Tile)
							CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite);
						break;

					case 'tile-lut-editor-prop-editor':
						PropEditor.GPEditor.ShowProps();
						break;
				}
				break;

			case 'change':
				switch (e.target.id) {
					case 'tile-lut-editor-tileterrain':
						if (CanvasDrawer.GCD.selectedSprite instanceof Tile) {
							CanvasDrawer.GCD.selectedSprite.tileTerrain = TileData.tileGUI.tileterrain.selectedIndex;
							TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
						} else {
							for (let i = 0, l = CanvasDrawer.GCD.selectedSprite.length; i < l; ++i) {
								CanvasDrawer.GCD.selectedSprite[i].tileTerrain = TileData.tileGUI.tileterrain.selectedIndex;
								TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
							}
						}
						break;

					case 'tile-lut-editor-tiletype':
						if (CanvasDrawer.GCD.selectedSprite instanceof Tile) {
							CanvasDrawer.GCD.selectedSprite.tileType = TileData.tileGUI.tiletype.selectedIndex;
							TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
						} else {
							for (let i = 0, l = CanvasDrawer.GCD.selectedSprite.length; i < l; ++i) {
								CanvasDrawer.GCD.selectedSprite[i].tileType = TileData.tileGUI.tiletype.selectedIndex;
								TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
							}
						}
						break;
				}
				break;

			case 'input':
				switch (e.currentTarget.id) {
					case 'tile-lut-editor-filter-bool-tiletype':
					case 'tile-lut-editor-filter-bool-tileterrain':
						this.FilterTiles();
						break;
				}
				break;
		}
	}
}

/**
 * @class
 * @constructor
 */
class TileF {

	/**
	 * 
	 * @param {Tile} tile 
	 * @param {Vector2D} position 
	 */
	static PaintTile(tile, position) {
		let operations = CanvasDrawer.GCD.GetTileAtPosition(position, false);

		for (let i = 0, l = operations.length; i < l; ++i) {
			//let tilePaintULDRMatrix = TileF.ConstructPaintULDRMatrix(operations[i].tile);
			//let centerTileOffset = TileF.GetTileOffsets(operations[i].tile);
			let centerTile = TileF.GetCenterTile(tile);
			tile.tilePosition.Add(centerTile);
			//let paintTiles = TileF.ConstructTilePaintMatrix(tile, tilePaintULDRMatrix.ToArray());
			//let allTiles = TileF.GetSurroundingTiles(operations[i].tile.position, TileF.GetULDRMatrix(operations[i].tile));

			operations[i].tile.ChangeSprite(tile);
			//for (let i2 = 0; i2 < allTiles.length; i2++)
			//allTiles[i2].tile.ChangeSprite(paintTiles[i2]);
		}

		let newTiles = [],
			cliffBottomTilesTiles = [],
			cliffBottomTiles = [];
		for (let i = 0, l = operations.length; i < l; ++i) {
			let trueMatrix = TileF.ConstructAtlasTileMatrix(operations[i].tile, tile.tileSet);
			trueMatrix.y2 = 0;
			//let uldr = trueMatrix.ToBinary();
			//console.log(trueMatrix.To3DArray(), GetAtlasTileMatrix(uldr.replace('0x', '')));
			//uldr = GetAtlasTileMatrix(uldr.replace('0x', ''));
			//let aroundTiles = TileF.GetSurroundingTiles(operations[i].tile.position, trueMatrix);
			//console.log(aroundTiles);

			let offsetTileMatrix = new Matrix(
				new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
				new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
				new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
			);
			let offsetTileMatrixArr = offsetTileMatrix.ToArray();

			let allTiles = TileF.GetSurroundingTiles(operations[i].tile.position, TileF.GetULDRMatrix(operations[i].tile));
			for (let i2 = 0, l2 = allTiles.length; i2 < l2; ++i2) {
				let newTilePaintMatrix = TileF.ConstructAtlasTileMatrix(allTiles[i2].tile, tile.tileSet);

				let temp = trueMatrix.Clone();
				let tempOff = temp.OffsetMatrix(offsetTileMatrixArr[i2]);

				if (tempOff.length < 1)
					break;

				newTilePaintMatrix.IsOne(tempOff);
				//console.log(newTilePaintMatrix.To3DArray(), newTilePaintMatrix.ToBinary());
				let uldr = newTilePaintMatrix.ToBinary();
				//console.log(GetAtlasTileMatrix(uldr.replace('0x', '')), newTilePaintMatrix.y2);
				uldr = TileULDR.Get(Number(GetAtlasTileMatrix(uldr.replace('0x', ''), newTilePaintMatrix.y2)));
				//console.log(uldr);

				let newTileData;
				if (uldr !== undefined) {
					if (uldr.includes('CornerDouble')) {
						if (TileData.TileLUTSets[tile.tileSet + 'DoubleCorner'] !== undefined && TileData.TileLUTSets[tile.tileSet + 'DoubleCorner'][uldr] !== undefined)
							newTileData = TileData.TileLUTSets[tile.tileSet + 'DoubleCorner'][uldr];
					} else if (uldr.includes('Corner')) {
						if (TileData.TileLUTSets[tile.tileSet + 'Corner'] !== undefined && TileData.TileLUTSets[tile.tileSet + 'Corner'][uldr] !== undefined)
							newTileData = TileData.TileLUTSets[tile.tileSet + 'Corner'][uldr];
					} else if (uldr.includes('Angle')) {
						if (TileData.TileLUTSets[tile.tileSet + 'Angle'] !== undefined && TileData.TileLUTSets[tile.tileSet + 'Angle'][uldr] !== undefined)
							newTileData = TileData.TileLUTSets[tile.tileSet + 'Angle'][uldr];
					} else {
						if (TileData.TileLUTSets[tile.tileSet] !== undefined && TileData.TileLUTSets[tile.tileSet][uldr] !== undefined) {
							newTileData = TileData.TileLUTSets[tile.tileSet][uldr];

							/*if (newTileData.tileType === TileType.Cliff && TileData.TileLUTSets[tile.tileSet + 'Bottom'] !== undefined) {
								let tPos = allTiles[i2].tile.position.Clone();
								tPos.y += 32;
								tPos.ToGrid();
								let tTile = CanvasDrawer.GCD.GetTileAtPosition(tPos, false);

								switch (TileULDRLUT[newTileData.tileULDR]) {
									case TileULDRLUT.Down:
									case TileULDRLUT.DownRight:
									case TileULDRLUT.DownLeft:
										if (TileData.TileLUTSets[tile.tileSet + 'Bottom'][uldr] !== undefined) {
											let cliffDown = TileData.TileLUTSets[tile.tileSet + 'Bottom'][uldr];

											if (tTile !== undefined) {
												for (let iT = 0, lT = tTile.length; iT < lT; ++iT) {
													cliffBottomTilesTiles.push(tTile[iT]);
													cliffBottomTiles.push(cliffDown);
												}
											}
										}
										break;
								}
							}*/
						}
					}
				}

				if (newTileData !== undefined)
					newTiles.push(newTileData);
				//console.log(TileF.ConstructTilePaintMatrix(allTiles[i2].tile, TileF.ConstructPaintULDRMatrix(allTiles[i2].tile).ToArray()), TileF.ConstructPaintULDRMatrix(allTiles[i2].tile));
			}

			if (cliffBottomTilesTiles.length > 0 && cliffBottomTiles.length > 0 && cliffBottomTilesTiles.length === cliffBottomTiles.length) {
				allTiles.push(...cliffBottomTilesTiles);
				newTiles.push(...cliffBottomTiles);
			}

			for (let i2 = 0, lI2 = allTiles.length; i2 < lI2; ++i2) {
				if (newTiles[i2] !== undefined && newTiles[i2] !== null) {
					allTiles[i2].tile.ChangeSprite(newTiles[i2]);
					CanvasDrawer.UpdateTerrainOperation(allTiles[i2]);
				}
			}
		}
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {Matrix}
	 */
	static ConstructAtlasTileMatrix(tile, tileSet = 'soilTiled') {
		let surroundingTiles = Matrix.FromArray(TileF.GetSurroundingTiles(tile.position));
		let a = surroundingTiles.Filter(['tile', 'tileULDR'], 'Middle');
		a.ConvertToBinary();
		a.InvertMatrix();

		surroundingTiles = surroundingTiles.Filter(['tile', 'tileSet'], tileSet);
		surroundingTiles = surroundingTiles.Filter(['tile', 'tileULDR'], 'Middle');
		surroundingTiles.ConvertToBinary();
		//surroundingTiles.InvertMatrix();
		surroundingTiles.IsOne(a);
		//surroundingTiles.InvertMatrix();
		return surroundingTiles;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns 
	 */
	static ConstructPaintULDRMatrixTiles(tile) {
		let surroundingTiles = Matrix.FromArray(TileF.GetSurroundingTiles(tile.position));

		surroundingTiles = surroundingTiles.Filter(['tile', 'tileSet'], 'soilTiled');
		surroundingTiles.ConvertToBinary();
		//let tempM = surroundingTiles.Clone();
		//let tempMBinary = tempM.ToBinary();
		//let testM = GetAtlasTileMatrix(tempMBinary.replace('0x', ''));
		//console.log(surroundingTiles.To3DArray(), tempM, testM);
		//surroundingTiles.InvertMatrix();
		let uldr = surroundingTiles.ToBinary();
		//console.log(uldr, TileULDR.Get(Number(uldr)), TileULDR.Get(GetAtlasTileMatrix(uldr.replace('0x', ''))));
		let uldrText = TileULDR.Get(GetAtlasTileMatrix(uldr.replace('0x', '')));// TileULDR.Get(Number(uldr));

		if (uldrText !== undefined) {
			if (uldrText.includes('CornerDouble')) {
				if (TileData.TileLUTSets['soilTiledDoubleCorner'][uldrText] !== undefined)
					return TileData.TileLUTSets['soilTiledDoubleCorner'][uldrText];
			}
			else if (uldrText.includes('Corner')) {
				if (TileData.TileLUTSets['soilTiledCorner'][uldrText] !== undefined)
					return TileData.TileLUTSets['soilTiledCorner'][uldrText];
			} else {
				if (TileData.TileLUTSets['soilTiled'][uldrText] !== undefined)
					return TileData.TileLUTSets['soilTiled'][uldrText];
			}
		}

		return null;
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @param {Matrix} tilePaintULDRMatrix 
	 * @returns
	 */
	static GetSurroundingTiles(position, tilePaintULDRMatrix = null) {
		let pos = position.Clone();
		pos.Div(new Vector2D(32, 32));
		pos.Ceil();

		let offsetTileMatrix = new Matrix(
			new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
			new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
			new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
		);

		if (tilePaintULDRMatrix !== null)
			offsetTileMatrix.Null(tilePaintULDRMatrix);

		let offsetTileMatrixArr = offsetTileMatrix.ToArray();
		let posMatrix = new Matrix(pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone());

		if (tilePaintULDRMatrix !== null)
			posMatrix.Null(tilePaintULDRMatrix);

		let posArray = posMatrix.ToArray();

		let operations = [];
		for (let i = 0, l = posArray.length; i < l; ++i) {
			if (posArray[i] !== null && offsetTileMatrixArr[i] !== null) {
				posArray[i].Add(offsetTileMatrixArr[i]);
				operations = operations.concat(CanvasDrawer.GCD.GetTileAtPosition(posArray[i], false));
			}
		}

		return operations;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @param {Matrix} tilePaintULDRMatrix 
	 * @returns 
	 */
	static ConstructTilePaintMatrix(tile, tilePaintULDRMatrix) {
		let offsetTileMatrix = new Matrix(
			new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
			new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
			new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
		);
		let offsetTileMatrixArr = offsetTileMatrix.ToArray();

		let paintTiles = [];
		for (let i = 0, l = offsetTileMatrixArr.length; i < l; ++i) {
			if (tilePaintULDRMatrix[i] !== null) {
				let clone = tile.Clone();
				clone.tilePosition.Add(offsetTileMatrixArr[i]);
				paintTiles.push(clone);
			}
		}

		return paintTiles;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {Vector2D}
	 */
	static GetCenterTile(tile) {
		switch (TileULDR.TileULDRLUT[tile.tileULDR]) {
			case TileULDR.TileULDRLUT.UpLeft: return new Vector2D(-1, -1);
			case TileULDR.TileULDRLUT.Up: return new Vector2D(0, -1);
			case TileULDR.TileULDRLUT.UpRight: return new Vector2D(1, -1);
			case TileULDR.TileULDRLUT.Left: return new Vector2D(-1, 0);
			case TileULDR.TileULDRLUT.Middle: return new Vector2D(0, 0);
			case TileULDR.TileULDRLUT.Right: return new Vector2D(1, 0);
			case TileULDR.TileULDRLUT.DownLeft: return new Vector2D(-1, 1);
			case TileULDR.TileULDRLUT.Down: return new Vector2D(0, 1);
			case TileULDR.TileULDRLUT.DownRight: return new Vector2D(1, 1);
			default: return new Vector2D(0, 0);
		}
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {Matrix}
	 */
	static GetTileOffsets(tile) {
		let tilesToPaintMatrix;

		tilesToPaintMatrix = TileF.GetULDRMatrix(tile);

		let offsetTileMatrix = new Matrix(
			new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
			new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
			new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
		);
		offsetTileMatrix.Null(tilesToPaintMatrix);
		return offsetTileMatrix;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {Matrix}
	 */
	static GetULDRMatrix(tile) {
		let tilesToPaintMatrix;

		switch (TileULDR.TileULDRLUT[tile.tileULDR]) {
			case TileULDR.TileULDRLUT.UpLeft: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				1, 1, 0,
				1, 0, 0
			); break;

			case TileULDR.TileULDRLUT.Up: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				1, 1, 1,
				0, 0, 0
			); break;

			case TileULDR.TileULDRLUT.UpRight: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				0, 1, 1,
				0, 0, 1
			); break;

			case TileULDR.TileULDRLUT.Left: tilesToPaintMatrix = new Matrix(
				1, 1, 0,
				1, 1, 0,
				1, 1, 0
			); break;

			case TileULDR.TileULDRLUT.Middle: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				1, 1, 1,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.Right: tilesToPaintMatrix = new Matrix(
				0, 1, 1,
				0, 1, 1,
				0, 1, 1
			); break;

			case TileULDR.TileULDRLUT.DownLeft: tilesToPaintMatrix = new Matrix(
				1, 0, 0,
				1, 1, 0,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.Down: tilesToPaintMatrix = new Matrix(
				0, 0, 0,
				1, 1, 1,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.DownRight: tilesToPaintMatrix = new Matrix(
				0, 0, 1,
				0, 1, 1,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.CornerUpLeft: tilesToPaintMatrix = new Matrix(
				0, 0, 1,
				0, 1, 1,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.CornerUpRight: tilesToPaintMatrix = new Matrix(
				1, 0, 0,
				1, 1, 0,
				1, 1, 1
			); break;

			case TileULDR.TileULDRLUT.CornerDownLeft: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				0, 1, 1,
				0, 0, 1
			); break;

			case TileULDR.TileULDRLUT.CornerDownRight: tilesToPaintMatrix = new Matrix(
				1, 1, 1,
				1, 1, 0,
				1, 0, 0
			); break;
		}

		return tilesToPaintMatrix;
	}

	/**
	 * 
	 * @param {Tile} tile 
	 * @returns {Matrix}
	 */
	static ConstructPaintULDRMatrix(tile) {
		let tilesToPaintMatrix;

		let tilesPaintMatrix = new Matrix(
			TileULDR.TileULDR[TileULDR.TileULDRLUT.UpLeft], TileULDR.TileULDR[TileULDR.TileULDRLUT.Up], TileULDR.TileULDR[TileULDR.TileULDRLUT.UpRight],
			TileULDR.TileULDR[TileULDR.TileULDRLUT.Left], TileULDR.TileULDR[TileULDR.TileULDRLUT.Middle], TileULDR.TileULDR[TileULDR.TileULDRLUT.Right],
			TileULDR.TileULDR[TileULDR.TileULDRLUT.DownLeft], TileULDR.TileULDR[TileULDR.TileULDRLUT.Down], TileULDR.TileULDR[TileULDR.TileULDRLUT.DownRight]
		)

		tilesToPaintMatrix = TileF.GetULDRMatrix(tile);

		if (tilesToPaintMatrix !== undefined) {
			tilesPaintMatrix.Null(tilesToPaintMatrix);
			return tilesPaintMatrix;
		} else
			return null;
	}
}

/**
 * @class
 * @constructor
 */
class Tile {

	/**
	 * Creates a new Tile
	 * @param {Vector2D} pos 
	 * @param {Vector2D} tilePos 
	 * @param {Vector2D} size 
	 * @param {boolean} transparent 
	 * @param {string} atlas 
	 * @param {number} drawIndex 
	 * @param {TileType} tileType 
	 * @param {TileTerrain} tileTerrain 
	 */
	constructor(pos = new Vector2D(0, 0), tilePos = new Vector2D(0, 0), size = new Vector2D(32, 32),
		transparent = undefined, atlas = 'terrain', drawIndex = 0, tileType = TileType.Ground, tileTerrain = TileTerrain.Grass) {
		/** @type {Vector2D} */ this.position = pos;
		/** @type {Vector2D} */ this.tilePosition = tilePos;
		/** @type {Vector2D} */ this.size = size;
		/** @type {TileType} */ this.tileType = tileType;
		/** @type {TileTerrain} */ this.tileTerrain = tileTerrain;
		/** @type {string} */ this.atlas = atlas;
		/** @type {boolean} */ this.transparent = transparent;
		/** @type {boolean} */ this.needsToBeRedrawn = true;
		/** @type {number} */ this.drawIndex = drawIndex;
		/** @type {number} */ this.tileULDR = TileULDR.TileULDRLUT.Middle;
		/** @type {string} */ this.tileSet = 'default';

		this.UpdateTileData();
	}

	UpdateTileData() {
		if (TileLUT[this.atlas] !== undefined) {
			if (TileLUT[this.atlas][this.tilePosition.y] !== undefined) {
				if (TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x] !== undefined) {
					this.tileType = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileType;
					this.tileTerrain = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileTerrain;
					this.transparent = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].transparent;
					this.tileULDR = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileULDR;

					if (this.tileULDR === undefined)
						this.tileULDR = TileULDR.TileULDRLUT.Middle;

					this.tileSet = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileSet;
					if (this.tileSet === undefined)
						this.tileSet = 'default';
				}
			}
		}
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	ChangeSprite(tile) {
		this.tilePosition = tile.tilePosition;
		this.size = tile.size;
		this.atlas = tile.atlas;
		this.transparent = tile.transparent;
		this.needsToBeRedrawn = true;
		this.UpdateTileData();
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetDrawIndex() {
		return this.drawIndex;
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetPosX() {
		return this.tilePosition.x * this.size.x;
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetPosY() {
		return this.tilePosition.y * this.size.y;
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetDrawPosX() {
		return Math.ceil(this.position.x / 32);
	}

	/**
	 * 
	 * @returns {number}
	 */
	GetDrawPosY() {
		return Math.ceil(this.position.y / 32);
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	IsTransparent() {
		if (this.transparent == undefined) {
			// @ts-ignore
			let pixels = document.getElementById(this.atlas).getContext('2d').getImageData(this.GetPosX(), this.GetPosY(), this.size.x, this.size.y).data;

			for (let i = 0, l = pixels.length; i < l; i += 4) {
				if (pixels[i + 3] < 255) {
					this.transparent = true;
					return this.transparent;
				}
			}
		} else {
			return this.transparent;
		}

		this.transparent = false;
		return this.transparent;
	}

	/**
	 * 
	 * @returns {Tile}
	 */
	Clone() {
		return new Tile(new Vector2D(this.position.x, this.position.y), new Vector2D(this.tilePosition.x, this.tilePosition.y), new Vector2D(this.size.x, this.size.y), this.transparent, this.atlas, this.tileType, this.tileTerrain);
	}

	/**
	 * 
	 * @returns {{p:Vector2D, lut: [string, number, number]}}
	 */
	toJSON() {
		return {
			p: this.position,
			lut: [this.atlas, this.tilePosition.y, this.tilePosition.x],
		}
	}

	/**
	 * 
	 * @returns {string}
	 */
	SaveToFile() {
		return 'new Tile(' + this.position.SaveToFile() + ', ' + this.tilePosition.SaveToFile() + ', ' + this.size.SaveToFile() + ', ' + this.transparent.toString() + ", '" + this.atlas + "', " + this.drawIndex.toString() + ', TileType.Prop, TileTerrain.Wood)';
	}

	/**
	 * 
	 * @returns {string}
	 */
	SaveObject() {
		return "{ class: 'Tile', name: '', canvasName: '" + this.atlas + "', position: " + this.position.SaveToFile() + ' }';
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				if (document.body.querySelector('img.tile-lut-editor-tiles-selected') !== null)
					document.body.querySelector('img.tile-lut-editor-tiles-selected').classList.remove('tile-lut-editor-tiles-selected');

				e.target.classList.add('tile-lut-editor-tiles-selected');
				CanvasDrawer.GCD.SetSelection(this);
				break;
		}
	}
}

export { Tile, TileData, TileType, TileTerrain, TileF };