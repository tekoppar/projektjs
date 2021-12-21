import {
	Vector2D, Cobject, AtlasController, ObjectType, BoxCollision, ShadowCanvasObject, Collision,
	PolygonCollision, CanvasDrawer, DrawingOperation, OperationType, Tile, CAnimation, Rectangle, CanvasObject
} from '../internal.js'

/**
 * Creates a new Cobject
 * @class
 * @constructor
 * @public
 * @extends Cobject
 */
class Pawn extends Cobject {

	/**
	 * 
	 * @param {string} canvasName 
	 * @param {Vector2D} position 
	 * @param {boolean} enableCollision 
	 */
	constructor(canvasName, position, enableCollision = false) {
		super(position);

		/** @type {(Collision|BoxCollision|PolygonCollision)} */ this.BoxCollision = new BoxCollision(this.GetPosition(), this.size, enableCollision, this);
		/** @type {HTMLCanvasElement} */ this.canvas;
		/** @type {string} */ this.canvasName = canvasName;
		/** @type {boolean} */ this.enableCollision = enableCollision;
		/** @type {DrawingOperation} */ this.drawingOperation = undefined;
		/** @type {Vector2D} */ this.previousPosition = new Vector2D(-1, -1);

		if (this.canvasName !== undefined && AtlasController.GetAtlas(this.canvasName) !== undefined) {
			this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
		}
		
		/** @type {ObjectType} */ this.objectType = ObjectType.Pawn;
	}

	//@ts-ignore
	OnHit(damage, source) {

	}

	Delete() {
		super.Delete();
		this.canvas = undefined;

		if (this.drawingOperation !== undefined) {
			CanvasDrawer.GCD.AddClearOperation(this.drawingOperation.drawingCanvas, this.BoxCollision.GetBoundingBox().Clone());
			this.drawingOperation.shouldDelete = true;
			this.drawingOperation = undefined;
		}

		if (this.BoxCollision !== undefined)
			this.BoxCollision.Delete();

		this.BoxCollision = undefined;
	}

	GameBegin() {
		super.GameBegin();
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	/**
	 * Sets the position of the object
	 * @param {Vector2D} position 
	 */
	SetPosition(position) {
		if (this.drawingOperation !== undefined)
			this.drawingOperation.Update(new Vector2D(this.BoxCollision.position.x, this.BoxCollision.position.y));

		super.SetPosition(position);

		this.BoxCollision.SetPosition(this.GetPosition());
		if (this.drawingOperation !== undefined) {
			this.drawingOperation.tile.position = this.GetPosition();
			this.drawingOperation.UpdateDrawState(true);
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	NeedsRedraw(position) {
		if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
			this.FlagDrawingUpdate(position);
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	FlagDrawingUpdate(position) {
		if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
			this.drawingOperation.Update(position);
			//document.getElementById('gameobject-draw-debug').innerHTML += this.name + "\r\n";
		}
	}

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 * @param {CanvasObject} canvasObject
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {

		let pawnCenterPosition = position.Clone();
		if (this.BoxCollision !== undefined)
			pawnCenterPosition = this.BoxCollision.GetCenterPositionV2();

		if (this.drawingOperation === undefined) {
			this.size.x = frame.w;
			this.size.y = frame.h;
			this.drawingOperation = new DrawingOperation(
				this,
				new Tile(
					position,
					new Vector2D(frame.x, frame.y),
					new Vector2D(frame.w, frame.h),
					clear,
					this.canvasName,
					0
				),
				CanvasDrawer.GCD.frameBuffer,
				canvas,
				operationType,
				new Vector2D(0, 0),
				pawnCenterPosition,
				this.objectType,
				canvasObject
			);

			this.drawingOperation.oldPosition = this.GetPosition().Clone();
			CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, operationType);
			//this.drawingOperation.Update(position);
		} else {
			this.drawingOperation.Update(this.drawingOperation.tile.position);
			this.drawingOperation.tile.position = position;
			this.BoxCollision.boundingBox.x = position.x;
			this.BoxCollision.boundingBox.y = position.y;

			this.BoxCollision.UpdateCollision();

			if (frame !== undefined && frame !== null) {
				this.drawingOperation.tile.tilePosition.x = frame.x;
				this.drawingOperation.tile.tilePosition.y = frame.y;
				this.drawingOperation.tile.size.x = frame.w;
				this.drawingOperation.tile.size.y = frame.h;
				this.size.x = frame.w;
				this.size.y = frame.h;
			}
			//this.drawingOperation.tile.clear = clear;
			this.drawingOperation.tile.atlas = this.canvasName;
			this.drawingOperation.targetCanvas = canvas;
		}

		this.NeedsRedraw(position);
	}

	/**
	 * 
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {*} canvas 
	 * @param {OperationType} operationType 
	 */
	CreateNewDrawOperation(frame, position, clear, canvas, drawIndex = 0, operationType = OperationType.gameObjects) {

		let pawnCenterPosition = position.Clone();
		if (this.BoxCollision !== undefined)
			pawnCenterPosition = this.BoxCollision.GetCenterPositionV2();

		let newOperation;
		newOperation = new DrawingOperation(
			this,
			new Tile(
				position,
				new Vector2D(frame.x, frame.y),
				new Vector2D(frame.w, frame.h),
				clear,
				this.canvasName,
				drawIndex
			),
			CanvasDrawer.GCD.frameBuffer,
			canvas,
			operationType,
			new Vector2D(0, 0),
			pawnCenterPosition,
			this.objectType,
		);

		CanvasDrawer.GCD.AddDrawOperation(newOperation, operationType);
		return newOperation;
	}

	/**
	 * 
	 * @param {Rectangle} boundingBox 
	 * @param {Object} overlappingObject 
	 */
	//@ts-ignore
	OnOverlap(boundingBox, overlappingObject) {
		/*if (this.drawingOperation !== undefined) {
			let rectA = this.BoxCollision.GetBoundingBox();
			rectA = rectA.Clone()

			rectA.Floor();
			rectA.UpdateCornersData();
			let intersection = rectA.GetIntersection(boundingBox);

			if (intersection !== undefined) {
				if (intersection.Equal(boundingBox) === true) {
					this.drawingOperation.UpdateDrawState(true);
				} else {
					this.drawingOperation.AddUpdateRect(intersection);
					this.drawingOperation.isVisible = false;
				}

				if (CanvasDrawer.GCD.gameObjectDrawingOperationsUpdate.indexOf(this.drawingOperation) === -1)
					CanvasDrawer.GCD.gameObjectDrawingOperationsUpdate.push(this.drawingOperation);
			}
		}*/
	}
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class GameObject extends Pawn {

	/**
	 * Creates a new GameObject
	 * @param {string} canvasName 
	 * @param {Vector2D} position 
	 * @param {boolean} enableCollision 
	 */
	constructor(canvasName, position, enableCollision = false) {
		super(canvasName, position, enableCollision);

		/** @type {Vector2D} */ this.Direction = new Vector2D(0, 0);
		/** @type {Vector2D} */ this.Velocity = new Vector2D(0, 0);
		/** @type {Vector2D} */ this.MovementSpeed = new Vector2D(-1, -1);
		/** @type {(Collision|BoxCollision|PolygonCollision)} */ this.BlockingCollision = undefined;
	}

	//@ts-ignore
	OnHit(damage, source) {

	}

	Delete() {
		if (this.BlockingCollision !== undefined)
			this.BlockingCollision.Delete();

		super.Delete();
		this.BlockingCollision = undefined;
	}

	GameBegin() {
		super.GameBegin();

		if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
			this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
		}
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	/**
	 * Sets the position of the object
	 * @param {Vector2D} position 
	 */
	SetPosition(position) {
		super.SetPosition(position);

		if (this.BlockingCollision !== undefined) {
			this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
			//this.BlockingCollision.position = this.position.Clone();
			this.BlockingCollision.position.Sub(new Vector2D(this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, this.BlockingCollision.size.y - this.BlockingCollision.size.y));
			this.BlockingCollision.CalculateBoundingBox();
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	NeedsRedraw(position) {
		super.NeedsRedraw(position);
	}

	/**
	 * 
	 * @param {Collision} collision 
	 * @returns  {void}
	 */
	NewCollision(collision) {
		if (this.drawingOperation === undefined) {
			window.requestAnimationFrame(() => this.NewCollision(collision));
			return;
		}
		this.BoxCollision.Delete();
		this.BoxCollision = undefined;
		this.BoxCollision = collision;

		if (this.BoxCollision instanceof PolygonCollision) {
			this.BoxCollision.UpdatePoints();
			this.BoxCollision.CalculateBoundingBox();
			this.BoxCollision.UpdateCollision();
			//collision size is inversed, height then width
			this.drawingOperation.collisionSize = new Vector2D(this.BoxCollision.boundingBox.w, this.BoxCollision.boundingBox.h);
		}
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	FlagDrawingUpdate(position) {
		super.FlagDrawingUpdate(position);
	}

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 * @param {CanvasObject} canvasObject
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects, canvasObject = undefined) {
		super.CreateDrawOperation(frame, position, clear, canvas, operationType, canvasObject);
	}
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class Shadow extends Pawn {

	/**
	 * Creates a new Shadow
	 * @param {Object} parent 
	 * @param {string} canvasName 
	 * @param {Vector2D} position 
	 */
	constructor(parent, canvasName, position) {
		super(canvasName, position, false);

		/** @type {Vector2D} */ this.size = new Vector2D(1, 1);
		/** @type {CAnimation} */ this.currentAnimation = undefined;
		/** @type {string} */ this.name = 'shadow' + this.UID;
		/** @type {*} */ this.parent = parent;
		/** @type {ObjectType} */ this.objectType = ObjectType.Shadow;
	}

	Delete() {
		super.Delete();

		this.parent = undefined;
		this.currentAnimation = undefined;
	}

	/**
	 * 
	 * @param {CAnimation} animation 
	 */
	ChangeAnimation(animation) {
		if (this.currentAnimation != animation)
			this.currentAnimation = animation;
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	GameBegin() {
		super.GameBegin();

		if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
			this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
			this.size.x = this.canvas.width;
			this.size.y = this.canvas.height;
			this.BoxCollision.size = this.size;
			this.BoxCollision.position = new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2);
			this.BoxCollision.boundingBox.w = this.size.x;
			this.BoxCollision.boundingBox.h = this.size.y;

			this.BoxCollision.UpdateCollision();
			this.BoxCollision.overlapEvents = false;
		}

		this.CreateDrawOperation({ x: 0, y: 0, w: this.size.x, h: this.size.y }, new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2), true, this.canvas, OperationType.shadow);
		this.drawingOperation.collisionSize = new Vector2D(this.size.x, 1);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	NeedsRedraw(position) {
		super.NeedsRedraw(position);
		this.drawingOperation.Update(this.BoxCollision.position.Clone());
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	FlagDrawingUpdate(position) {
		super.FlagDrawingUpdate(position);
		//super.FlagDrawingUpdate(this.GetPosition());
		this.drawingOperation.Update(this.BoxCollision.position.Clone());
	}

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.shadow) {
		operationType = OperationType.shadow;
		super.CreateDrawOperation(frame, position, clear, canvas, operationType);
	}
}

/**
 * @class
 * @constructor
 * @extends Pawn
 */
class Shadow2D extends Pawn {

	/**
	 * Creates a new Shadow2D
	 * @param {Object} parent 
	 * @param {string} canvasName 
	 * @param {Vector2D} position 
	 * @param {Vector2D} shadowSize
	 * @param {Tile} tile
	 */
	constructor(parent, canvasName, position, shadowSize, tile) {
		super(canvasName, position, false);

		/** @type {Vector2D} */ this.size = shadowSize;
		/** @type {CAnimation} */ this.currentAnimation = undefined;
		/** @type {string} */ this.name = 'shadow2D' + this.UID;
		/** @type {Object} */ this.parent = parent;
		/** @type {ShadowCanvasObject} */ this.shadowObject = new ShadowCanvasObject(this);
		/** @type {ObjectType} */ this.objectType = ObjectType.Shadow;

		this.shadowObject.GenerateRealTimeShadow(shadowSize, tile);
	}

	Delete() {
		super.Delete();

		this.parent = undefined;
		this.currentAnimation = undefined;
	}

	/**
	 * 
	 * @param {CAnimation} animation 
	 */
	ChangeAnimation(animation) {
		if (this.currentAnimation != animation)
			this.currentAnimation = animation;
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();

		this.shadowObject.UpdatedThisFrame = false;
	}

	GameBegin() {
		super.GameBegin();

		if (AtlasController.GetAtlas(this.canvasName) !== undefined) {
			this.canvas = AtlasController.GetAtlas(this.canvasName).GetCanvas();
			this.size = this.shadowObject.GetSize();
			this.BoxCollision.size = this.size;
			this.BoxCollision.position = new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2);
			this.BoxCollision.boundingBox.w = this.size.x;
			this.BoxCollision.boundingBox.h = this.size.y;

			this.BoxCollision.UpdateCollision();
		}

		this.CreateDrawOperation({ x: 0, y: 0, w: this.size.x, h: this.size.y }, new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y / 2), true, this.canvas, OperationType.shadow);
		this.drawingOperation.collisionSize = this.shadowObject.GetSize();
		this.shadowObject.SetParentBoxCollision(this.BoxCollision);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	NeedsRedraw(position) {
		super.NeedsRedraw(position);
		this.drawingOperation.Update(this.BoxCollision.position.Clone());
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	FlagDrawingUpdate(position) {
		super.FlagDrawingUpdate(position);
		//super.FlagDrawingUpdate(this.GetPosition());
		this.drawingOperation.Update(this.BoxCollision.position.Clone());
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	AddShadow(tile) {
		this.shadowObject.DrawToShadowCanvas(tile);
	}

	/**
	 * 
	 * @param {Tile} tile 
	 */
	UpdateShadow(tile) {
		this.shadowObject.UpdateRealTimeShadow(this.name, this.position.Clone(), this.BoxCollision, tile);
		this.SetPosition(new Vector2D(this.position.x - this.shadowObject.centerPosition.x, this.position.y - this.shadowObject.centerPosition.y));
		this.drawingOperation.collisionSize = new Vector2D(0, -64);
	}

	/**
	 * Creates a new DrawingOperation
	 * @param {*} frame 
	 * @param {Vector2D} position 
	 * @param {boolean} clear 
	 * @param {HTMLCanvasElement} canvas
	 * @param {OperationType} operationType 
	 */
	CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.shadow2D) {
		canvas = this.shadowObject.canvas;
		operationType = OperationType.shadow2D;
		super.CreateDrawOperation(frame, position, clear, canvas, operationType);
	}
}

export { Pawn, GameObject, Shadow, Shadow2D };