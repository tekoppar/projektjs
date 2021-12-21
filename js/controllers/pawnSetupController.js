import { ObjectClassLUT, PawnSetupParams, Props, Cobject, CanvasDrawer, MasterObject, AtlasController, CanvasUtility, CanvasAtlasObject, Vector2D, Objects, AllAnimationsList, ObjectUtility } from '../internal.js';

/** @typedef {import('../typedef.js').AllObjectSetup} AllObjectSetup */

/**
 * @class
 * @constructor
 */
class PawnSetupController {
	/** @type {string} */ static _AtlasObjectSuffix = 'Object';
	/** @type {Vector2D} */ static _PositionOffset = new Vector2D(0.5, 0);

	constructor() {

	}

	static LoadSavedObjects() {
		for (let i = 0, l = Objects.length; i < l; ++i) {
			Objects[i].position.Sub(PawnSetupController._PositionOffset);
			if (ObjectClassLUT[Objects[i].canvasName] !== undefined)
				PawnSetupController.CreateNewObject(Objects[i].canvasName, false, Objects[i].position);
			else if (ObjectClassLUT[Objects[i].name] !== undefined)
				PawnSetupController.CreateNewObject(Objects[i].name, false, Objects[i].position);
			else if (ObjectClassLUT[ObjectUtility.DisplayNameToName(Objects[i].name)] !== undefined)
				PawnSetupController.CreateNewObject(ObjectUtility.DisplayNameToName(Objects[i].name), false, Objects[i].position);
		}
	}

	/**
	 * 
	 * @template [T=Cobject]
	 * @param {*} params 
	 * @param {string} key 
	 * @param {boolean} gridAlign 
	 * @param {Vector2D} objectPosition
	 * @returns {T}
	 */
	static CreateObject(params, key, gridAlign, objectPosition = undefined) {
		/** @type {Vector2D} */ let pos;
		if (objectPosition !== undefined)
			pos = objectPosition.Clone()
		else {
			pos = MasterObject.MO.playerController.mousePosition.Clone();
			pos.Add(CanvasDrawer.GCD.canvasOffset);
		}
		pos.x += params[1][0];

		if (gridAlign)
			pos.SnapToGridF(32);

		params[1] = pos;
		/** @type {typeof ObjectClassLUT[key]} */ let newObject = new ObjectClassLUT[key].constructor(...params);
		Props.push(newObject);
		newObject.GameBegin();

		return newObject;
	}

	/**
	 * 
	 * @param {string} objectName
	 * @param {boolean} gridAlign 
	 * @param {Vector2D} objectPosition
	 * @returns {*}
	 */
	static CreateNewObject(objectName = 'pepoSeedShop', gridAlign = false, objectPosition = undefined) {
		if (ObjectClassLUT[objectName] !== undefined) {
			let params = PawnSetupParams[objectName];

			if (Array.isArray(params) === true) {
				return PawnSetupController.CreateObject(JSON.parse(JSON.stringify(params)), objectName, gridAlign, objectPosition);
			} else if (params !== undefined) {
				let subKeys = Object.keys(params);
				let parentObject = PawnSetupController.CreateObject(JSON.parse(JSON.stringify(params[objectName])), objectName, gridAlign, objectPosition);
				parentObject.SetPosition(parentObject.position.Clone());

				for (let i = 0, l = subKeys.length; i < l; ++i) {
					if (subKeys[i] === objectName)
						continue;

					let newObject = PawnSetupController.CreateObject(JSON.parse(JSON.stringify(params[subKeys[i]])), subKeys[i], gridAlign, objectPosition);
					newObject.SetPosition(parentObject.position.Clone());
					parentObject.AddChild(newObject);
				}

				return parentObject;
			}
		}

		return undefined;
	}

	/**
	 * 
	 * @param {string} key 
	 * @returns {HTMLImageElement}
	 */
	static GetNewImage(key = 'pepoSeedShop') {
		if (PawnSetupParams[key] === undefined)
			return undefined;

		let setupParams = PawnSetupParams[key];

		if (Array.isArray(setupParams) === true) {
			if (AtlasController.GetAtlasObject(key) !== undefined) {
				let atlasObject = AtlasController.GetAtlasObject(key);
				let newImage = new Image(atlasObject.width, atlasObject.height);
				newImage.src = atlasObject.GetCanvas().toDataURL('image/png');
				newImage.dataset.atlasName = atlasObject.GetCanvas().id;
				newImage.dataset.propName = key;

				return newImage;
			}

			if (AtlasController.GetAtlas(setupParams[3]) !== undefined) {
				let atlas = AtlasController.GetAtlas(setupParams[3]);
				/** @type {HTMLImageElement} */ let newImage;

				if (AllAnimationsList.propAnimations[key] !== undefined) {
					let animations = AllAnimationsList.propAnimations[key];

					if (animations.idle !== undefined)
						newImage = CanvasUtility.CanvasPortionToImage(animations.idle.start.x * animations.idle.w, animations.idle.start.y * animations.idle.h, animations.idle.w, animations.idle.h, atlas);

				} else if (AllAnimationsList.propAnimations[setupParams[3]] !== undefined) {
					let animations = AllAnimationsList.propAnimations[setupParams[3]];

					if (animations.idle !== undefined)
						newImage = CanvasUtility.CanvasPortionToImage(animations.idle.start.x * animations.idle.w, animations.idle.start.y * animations.idle.h, animations.idle.w, animations.idle.h, atlas);

				} else if (setupParams[2] === undefined || setupParams[2].start === undefined) {
					newImage = new Image(atlas.width, atlas.height);
					newImage.src = atlas.GetCanvas().toDataURL('image/png');
				} else {
					newImage = CanvasUtility.CanvasPortionToImage(setupParams[2].start.x * setupParams[2].w, setupParams[2].start.y * setupParams[2].h, setupParams[2].w, setupParams[2].h, atlas);
				}

				newImage.dataset.atlasName = atlas.GetCanvas().id;
				newImage.dataset.propName = key;
				return newImage;
			}
		} else {
			if (AtlasController.GetAtlasObject(key + PawnSetupController._AtlasObjectSuffix) !== undefined) {
				let atlasObject = AtlasController.GetAtlasObject(key + PawnSetupController._AtlasObjectSuffix);
				let newImage = new Image(atlasObject.width, atlasObject.height);
				newImage.src = atlasObject.GetCanvas().toDataURL('image/png');
				newImage.dataset.atlasName = atlasObject.GetCanvas().id;
				newImage.dataset.propName = key;

				return newImage;
			}

			let tCanvas = document.createElement('canvas');
			tCanvas.width = 0;
			tCanvas.height = 0;

			let subKeys = Object.keys(setupParams);
			for (let i2 = 0, l2 = subKeys.length; i2 < l2; ++i2) {
				let setupParamsSub = setupParams[subKeys[i2]];
				if (AtlasController.GetAtlas(setupParamsSub[3]) !== undefined) {
					let atlas = AtlasController.GetAtlas(setupParamsSub[3]);
					let size = atlas.GetSpriteSize();

					if (size.x > tCanvas.width)
						tCanvas.width = size.x;

					if (size.y > tCanvas.height)
						tCanvas.height = size.y;

					tCanvas.id = atlas.GetCanvas().id;

					if (setupParamsSub[2] === undefined || setupParamsSub[2].start === undefined) {
						CanvasUtility.ImageToCanvas(atlas.GetImage(), tCanvas);
					} else {
						CanvasUtility.CanvasPortionToCanvas(setupParamsSub[2].start.x * setupParamsSub[2].w, setupParamsSub[2].start.y * setupParamsSub[2].h, setupParamsSub[2].w, setupParamsSub[2].h, atlas, tCanvas);
					}
				}
			}

			let newImage = new Image(tCanvas.width, tCanvas.height);

			if (AtlasController.GetAtlasObject(key + PawnSetupController._AtlasObjectSuffix) === undefined) {
				let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tCanvas.toDataURL('image/png'), tCanvas.width, tCanvas.height, -1, key + PawnSetupController._AtlasObjectSuffix);
				AtlasController.AddAtlas(newCanvasAtlas, key + PawnSetupController._AtlasObjectSuffix);
			}

			newImage.dataset.atlasName = tCanvas.id;
			newImage.dataset.propName = key;
			newImage.src = tCanvas.toDataURL('image/png');
			return newImage;
		}

		return undefined;
	}

	static GetAtlasName(key) {
		let setupParams = PawnSetupParams[key];

		if (Array.isArray(setupParams) === true)
			return key;
		else
			return key + PawnSetupController._AtlasObjectSuffix
	}
}

export { PawnSetupController };