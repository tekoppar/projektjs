import {
	ExtendedProp, Rectangle, Vector2D, Vector4D, CanvasDrawer, OperationType, ItemProp, CFrame, AllAnimationsList,
	AtlasController, CMath, BoxCollision, AllCollisions, resourceSprites, CollisionHandler, BWDrawingType, ArrayUtility
} from "../../../internal.js";

/**
 * @readonly
 * @enum {string}
 */
const CanvasNameToResourceName = {
	treeBirch1: 'birchLog',
	treeBirch2: 'birchLog',
	treePine1: 'birchLog',
	treePine2: 'birchLog',
	treePine3: 'birchLog',
	treePine1v2: 'birchLog',
	treePine2v2: 'birchLog',
	treePine3v2: 'birchLog',
	rockStone1: 'stonePiece',
	rockStone2: 'stonePiece',
	rockStone3: 'stonePiece',
	coalRock: 'coalLump',
	ironRock: 'iron',
	tinRock: 'tin',
	copperRock: 'copper',
	silverRock: 'silver',
	goldRock: 'gold',
}

/**
 * @class
 * @constructor
 * @extends ExtendedProp
 */
class Resource extends ExtendedProp {

	/**
	 * @param {string} name 
	 * @param {Vector2D} position 
	 * @param {*} animations 
	 * @param {string} canvasName 
	 * @param {Vector4D} blockingCollisionSize 
	 * @param {(Rectangle|Object)} secondStageFrame 
	 */
	constructor(name, position, animations, canvasName, blockingCollisionSize = new Vector4D(16, 16, 0, 0), secondStageFrame = new Rectangle(23, 18, 32, 32)) {
		super(name, position, animations, canvasName, blockingCollisionSize);

		/** @type {boolean} */ this.isVisible = true;
		/** @type {number} */ this.life = 100;
		/** @type {boolean} */ this.isSecondStage = false;
		/** @type {string} */ this.resourceName = CanvasNameToResourceName[this.canvasName];

		if (secondStageFrame instanceof Rectangle)
			this.secondStageFrame = secondStageFrame;
		else
			this.secondStageFrame = new Rectangle(secondStageFrame.x, secondStageFrame.y, secondStageFrame.w, secondStageFrame.h);
	}

	/**
	 * 
	 * @param {Vector2D[]} polygonCollision 
	 * @param {Vector2D} position 
	 * @param {Vector2D} size 
	 * @param {Vector2D} tilePosition 
	 * @param {boolean} createShadow 
	 */
	GameBegin(polygonCollision = undefined, position = new Vector2D(0, 0), size = new Vector2D(0, 0), tilePosition = new Vector2D(0, 0), createShadow = false) {
		if (AllCollisions[this.canvasName] !== undefined) {
			polygonCollision = AllCollisions[this.canvasName];
			size.x = AtlasController.GetAtlas(this.canvasName).width;
			size.y = AtlasController.GetAtlas(this.canvasName).height;
			super.GameBegin(
				ArrayUtility.CloneObjects(polygonCollision),
				position,
				size,
				tilePosition,
				createShadow
			);
		}
	}

	Delete() {
		super.Delete();
		this.currentAnimation = undefined;

		this.SpawnResources();
	}

	SpawnResources() {
		let resourcePosition = this.BoxCollision.GetCenterPosition().Clone();
		let resourceCount = CMath.RandomInt(1, 3);

		for (let i = 0; i < resourceCount; ++i) {
			let newResource = new ItemProp(
				this.resourceName,
				new Vector2D(resourcePosition.x + CMath.RandomInt(-50, 50), resourcePosition.y + CMath.RandomInt(-50, 50)),
				undefined,
				resourceSprites[this.resourceName].atlas
			);
			newResource.GameBegin();
			CanvasDrawer.GCD.AddClearOperation(newResource.drawingOperation.drawingCanvas, newResource.BoxCollision.GetBoundingBox().Clone());
		}
	}

	SecondStage() {
		CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
		this.SpawnResources();

		this.life = 250;
		this.isSecondStage = true;

		let secondStagePosition = this.BlockingCollision.position.Clone();
		secondStagePosition.y -= resourceSprites[this.resourceName].collision.x;
		secondStagePosition.x -= resourceSprites[this.resourceName].collision.y;
		secondStagePosition.Ceil();

		this.BoxCollision.Delete();

		if (resourceSprites[this.resourceName].collision.w === 0 && resourceSprites[this.resourceName].collision.h === 0) {
			this.BlockingCollision.Delete();
			this.BlockingCollision = undefined;
		} else {
			this.BlockingCollision.size.y = resourceSprites[this.resourceName].collision.w;
			this.BlockingCollision.boundingBox.h = resourceSprites[this.resourceName].collision.h;
			this.BlockingCollision.position.y += resourceSprites[this.resourceName].collision.h;
			this.BlockingCollision.UpdateCollision();
		}

		this.BoxCollision = new BoxCollision(
			secondStagePosition.Clone(),
			new Vector2D(this.secondStageFrame.w, this.secondStageFrame.h),
			false,
			this,
			true
		);

		CollisionHandler.GCH.RemoveFromQuadTree(this.BoxCollision);
		CollisionHandler.GCH.UpdateQuadTree(this.BoxCollision);

		if (this.shadow !== undefined)
			this.shadow.Delete();
		if (this.realtimeShadow !== undefined)
			this.realtimeShadow.Delete();

		this.shadow = undefined;
		this.realtimeShadow = undefined;
		this.drawingOperation.Delete();
		this.drawingOperation = undefined;

		window.requestAnimationFrame(() => this.CreateSecondStage());
	}

	CreateSecondStage() {
		if (AllAnimationsList.propAnimations[this.canvasName] !== undefined && AllAnimationsList.propAnimations[this.canvasName].harvested !== undefined) {
			this.CreateDrawOperation(
				new CFrame(AllAnimationsList.propAnimations[this.canvasName].harvested.start.x, AllAnimationsList.propAnimations[this.canvasName].harvested.start.y, AllAnimationsList.propAnimations[this.canvasName].harvested.w, AllAnimationsList.propAnimations[this.canvasName].harvested.h),
				this.BoxCollision.position.Clone(),
				false,
				AtlasController.GetAtlas(resourceSprites[this.resourceName].atlas).GetCanvas(),
				OperationType.gameObjects
			);
		}

		if (this.BlockingCollision === undefined) {
			this.drawingOperation.collisionSize = new Vector2D(resourceSprites[this.resourceName].collision.w, 1);
			this.BoxCollision.overlapEvents = false;
			CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
		}
	}

	OnHit(damage, source) {
		this.life -= damage;
		super.OnHit(source);

		if (this.life <= 0 && this.isSecondStage === false) {
			this.SecondStage();
		} else if (this.life <= 0 && this.isSecondStage === true) {
			this.Delete();
		}
	}

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {
		super.CreateDrawOperation(frame, position, clear, canvas, operationType);

		if (this.drawingOperation.shadowOperation !== undefined) {
			this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
			this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile);
		}
	}

	SaveToFile() {
		return "new Resource('" + this.name + "', " + this.position.SaveToFile() + ', ' + (this.animationsName !== undefined ? "'" + this.animationsName + "'" : undefined) + ", '" + this.canvasName + "', " + this.blockingCollisionSize.SaveToFile() + ", '" + this.resourceName + "', " + this.secondStageFrame.SaveToFile() + ')';
	}

	SaveObject() {
		return "{ class: 'Resource', name: '" + this.name + "', canvasName: '" + this.canvasName + "', position: " + this.position.SaveToFile() + ' }';
	}
}

export { Resource };