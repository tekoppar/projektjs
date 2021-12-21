import { BoxCollision, Collision, PolygonCollision, CollisionHandler, Vector2D, RectOperation, Rectangle, Color, Cobject, Polygon, CanvasDrawer, Operation } from '../../internal.js';

/** @typedef {import('./operation.js').Operations} Operations */

/**
 * 
 * @param {Operation} a 
 * @param {Operation} b 
 * @returns {number}
 */
function sortDrawOperations(a, b) {
	if (a.GetDrawPositionY() > b.GetDrawPositionY()) return 1;
	if (a.GetDrawPositionY() < b.GetDrawPositionY()) return -1;
	if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
	if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
	return 0;
};

/**
 * 
 * @param {Collision} a 
 * @param {Collision} b 
 * @returns {number}
 */
function sortCollisions(a, b) {
	return Number(a.enableCollision) * 1 + Number(b.enableCollision) * -1;
};

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class DebugDrawer extends Cobject {
	/** @type {DebugDrawer} */ static _Instance;

	/**
	 * Creates a new DebugDrawer
	 */
	constructor() {
		super(new Vector2D(0, 0));
		DebugDrawer._Instance = this;

		/** @type {boolean} */ this.DebugDraw = false;
		/** @type {boolean} */ this.DebugGrid = false;
		/** @type {Operations[]} */ this.debugOperations = [];
		/** @type {HTMLCanvasElement} */ this.gameDebugCanvas = undefined;
		/** @type {CanvasRenderingContext2D} */ this.gameDebugCanvasCtx = undefined;
		/** @type {Vector2D} */ this.offset = new Vector2D(0, 0);
	}

	/**
	 * 
	 * @param {Vector2D} offset 
	 */
	SetOffset(offset) {
		this.offset.x = offset.x;
		this.offset.y = offset.y;
	}

	/**
	 * 
	 * @param {Object} object 
	 * @returns {Color}
	 */
	GetColor(object) {
		let s = undefined;

		switch (object.constructor) {
			case BoxCollision:
				if (object.enableCollision === true)
					s = Color.CSS_COLOR_TABLE.darkred;
				else
					s = Color.CSS_COLOR_TABLE.deepskyblue;

				break;
			case PolygonCollision:
				if (object.enableCollision === true)
					s = Color.CSS_COLOR_TABLE.magenta;
				else
					s = Color.CSS_COLOR_TABLE.blue;

				break;
			case Collision: s = Color.CSS_COLOR_TABLE.sienna; break;
			default: s = Color.CSS_COLOR_TABLE.darkmagenta;
		}

		if (s !== undefined) {
			s = Color.ColorToRGBA(s);
			s.alpha *= 255;
		} else {
			s = new Color(0, 0, 0, 0);
		}
		return s;
	}

	/**
	 * Adds a drawing operation for a position
	 * @param {Vector2D} position 
	 * @param {number} lifetime 
	 * @param {string} color 
	 */
	AddDebugOperation(position, lifetime = 5, color = 'purple') {
		if (this.gameDebugCanvas === undefined)
			return;

		this.debugOperations.push(new RectOperation(position, new Vector2D(5, 5), this.gameDebugCanvas, color, false, 0, lifetime, 1.0));
	}

	/**
	* Adds a drawing operation for a position
	* @param {Vector2D} position 
	* @param {number} lifetime 
	* @param {string} color 
	*/
	static AddDebugOperation(position, lifetime = 5, color = 'purple') {
		DebugDrawer._Instance.AddDebugOperation(position, lifetime, color);
	}

	/**
	 * Adds a drawing operation for a rectangle
	 * @param {Rectangle} rect 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 */
	AddDebugRectOperation(rect, lifetime = 5, color = 'purple', fillOrOutline = false) {
		if (this.gameDebugCanvas === undefined)
			return;

		this.debugOperations.push(new RectOperation(new Vector2D(rect.x, rect.y), new Vector2D(rect.w, rect.h), this.gameDebugCanvas, color, false, 0, lifetime, 1.0, fillOrOutline));
	}

	/**
	 * Adds a drawing operation for a rectangle
	 * @param {Rectangle} rect 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 */
	static AddDebugRectOperation(rect, lifetime = 5, color = 'purple', fillOrOutline = false) {
		DebugDrawer._Instance.AddDebugRectOperation(rect, lifetime, color, fillOrOutline);
	}

	/**
	 * 
	 * @param {number} delta 
	 */
	DrawDebugLoop(delta) {
		if (this.gameDebugCanvas === undefined)
			return;

		if (this.DebugGrid === true) {
			this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
			this.DrawGrid();
		}

		if (this.DebugDraw === true) {
			if (this.DebugGrid === false)
				this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

			let collisions = CollisionHandler.GCH.Collisions;
			collisions.sort(sortCollisions);

			for (let i = 0, l = collisions.length; i < l; ++i) {
				this.DrawDebugCanvas(collisions[i]);
			}
		}

		this.debugOperations.sort(sortDrawOperations);

		for (let i = 0, l = this.debugOperations.length; i < l; ++i) {
			const tObject = this.debugOperations[i];

			switch (tObject.ClassType) {
				case 'RectOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.CanvasClear(tObject);
					break;
				case 'PathOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.CanvasClear(tObject);
					break;
			}
		}

		for (let i = 0, l = this.debugOperations.length; i < l; ++i) {
			if (this.debugOperations[i].shouldDelete === true) {
				this.debugOperations.splice(i, 1);
				i--;
				l--;
			} else {
				this.DrawDebugCanvasOperation(this.debugOperations[i], delta);
			}
		}
	}

	/**
	 * 
	 * @param {Operations} drawingOperation 
	 */
	CanvasClear(drawingOperation) {
		let oldPosition = drawingOperation.GetPreviousPosition(),
			size = new Vector2D(0, 0);

		drawingOperation.isVisible = false;
		switch (drawingOperation.ClassType) {
			case 'RectOperation':
				size.Set(drawingOperation.GetSize());
				drawingOperation.drawingCanvas.getContext('2d').clearRect(oldPosition.x - 1 - this.offset.x, oldPosition.y - 1 - this.offset.y, size.x + 2, size.y + 2);
				drawingOperation.drawingCanvas.getContext('2d').clearRect(drawingOperation.position.x - 1 - this.offset.x, drawingOperation.position.y - 1 - this.offset.y, size.x + 2, size.y + 2);
				break;
			case 'PathOperation':
				let boundingBox = Polygon.CalculateBoundingBox(drawingOperation.path);
				boundingBox.x -= 1;
				boundingBox.y -= 1;
				boundingBox.z += 2;
				boundingBox.a += 2;
				drawingOperation.drawingCanvas.getContext('2d').clearRect(boundingBox.x - this.offset.x, boundingBox.y - this.offset.y, boundingBox.z, boundingBox.a);
				break;
		}
	}

	/**
	 * 
	 * @param {Operations} drawingOperation 
	 * @param {number} delta 
	 * @returns {void}
	 */
	DrawDebugCanvasOperation(drawingOperation, delta) {
		let context = drawingOperation.drawingCanvas.getContext('2d');

		switch (drawingOperation.ClassType) {
			case 'RectOperation':
				context.globalAlpha = drawingOperation.alpha;

				drawingOperation.UpdateDrawState(false);

				if (drawingOperation.fillOrOutline === false) {
					context.fillStyle = drawingOperation.color;
					context.fillRect(drawingOperation.position.x - this.offset.x, drawingOperation.position.y - this.offset.y, drawingOperation.size.x, drawingOperation.size.y);
				}
				else {
					context.strokeStyle = drawingOperation.color;
					context.strokeRect(drawingOperation.position.x + 1 - this.offset.x, drawingOperation.position.y + 1 - this.offset.y, drawingOperation.size.x - 2, drawingOperation.size.y - 2);
				}

				context.globalAlpha = 0.3;

				if (drawingOperation.lifeTime !== -1) {
					drawingOperation.Tick(delta);

					if (drawingOperation.lifeTime < 0)
						return;
				}
				break;
		}
	}

	/**
	 * 
	 * @param {*} collision 
	 * @returns {void}
	 */
	DrawDebugCanvas(collision) {
		if (collision.debugDraw === false) {
			this.gameDebugCanvasCtx.globalAlpha = 1.0;
			this.gameDebugCanvasCtx.fillStyle = 'red';
			this.gameDebugCanvasCtx.clearRect(Math.floor(collision.collisionOwner.position.x) - this.offset.x - 2, Math.floor(collision.collisionOwner.position.y) - this.offset.y - 2, 4, 4);
			this.gameDebugCanvasCtx.fillRect(Math.floor(collision.collisionOwner.position.x) - this.offset.x - 2, Math.floor(collision.collisionOwner.position.y) - this.offset.y - 2, 4, 4);
			return;
		}

		let color = this.GetColor(collision);
		if (collision.enableCollision === true)
			color.MultF(0.7);

		this.gameDebugCanvasCtx.fillStyle = color.ToString();
		this.gameDebugCanvasCtx.globalAlpha = 0.5;

		switch (collision.constructor) {
			case BoxCollision:
				this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x - this.offset.x, collision.boundingBox.y - this.offset.y, collision.boundingBox.w, collision.boundingBox.h);
				this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x - this.offset.x, collision.boundingBox.y - this.offset.y, collision.boundingBox.w, collision.boundingBox.h);
				break;

			case PolygonCollision:
				this.gameDebugCanvasCtx.beginPath();
				this.gameDebugCanvasCtx.moveTo(collision.points[0].x - this.offset.x, collision.points[0].y - this.offset.y);

				for (let point of collision.points) {
					this.gameDebugCanvasCtx.lineTo(point.x - this.offset.x, point.y - this.offset.y);
				}

				this.gameDebugCanvasCtx.closePath();
				this.gameDebugCanvasCtx.fill();
				break;

			case Collision:
				this.gameDebugCanvasCtx.clearRect(collision.boundingBox.x - this.offset.x, collision.boundingBox.y - this.offset.y, collision.boundingBox.w, collision.boundingBox.h);
				this.gameDebugCanvasCtx.fillRect(collision.boundingBox.x - this.offset.x, collision.boundingBox.y - this.offset.y, collision.boundingBox.w, collision.boundingBox.h);
				break;
		}
	}

	/**
	 * 
	 * @param {number} size 
	 */
	DrawGrid(size = 32) {
		let cameraPosition = new Vector2D(CanvasDrawer.GCD.cameraRect.x, CanvasDrawer.GCD.cameraRect.y);
		cameraPosition = cameraPosition.Modulus(size);
		cameraPosition.OneMinus();

		this.gameDebugCanvasCtx.strokeStyle = Color.CSS_COLOR_TABLE.gray;
		this.gameDebugCanvasCtx.globalAlpha = 0.5;

		this.gameDebugCanvasCtx.beginPath();
		for (let y = 0, yl = (CanvasDrawer.GCD.cameraRect.h / size) + 1; y < yl; ++y) {
			if (cameraPosition.y > 0 && cameraPosition.y < CanvasDrawer.GCD.cameraRect.h) {
				this.gameDebugCanvasCtx.moveTo(0, cameraPosition.y);
				this.gameDebugCanvasCtx.lineTo(CanvasDrawer.GCD.cameraRect.w, cameraPosition.y);
			}
			cameraPosition.y += size;
		}

		for (let x = 0, xl = (CanvasDrawer.GCD.cameraRect.w / size) + 1; x < xl; ++x) {
			if (cameraPosition.x > 0 && cameraPosition.x < CanvasDrawer.GCD.cameraRect.w) {
				this.gameDebugCanvasCtx.moveTo(cameraPosition.x, 0);
				this.gameDebugCanvasCtx.lineTo(cameraPosition.x, CanvasDrawer.GCD.cameraRect.h);
			}
			cameraPosition.x += size;
		}
		this.gameDebugCanvasCtx.stroke();
	}

	FixedUpdate() {

	}

	EndOfFrameUpdate() {

	}

	Delete() {
		Cobject.DeleteObject(this);
	}

	CEvent() {

	}

	/**
	 * 
	 * @param {Vector2D} checkPos 
	 * @param {number} range 
	 * @returns {boolean}
	 */
	CheckInRange(checkPos, range = 100.0) {
		return this.position.Distance(checkPos) < range;
	}

	GameBegin() {
		document.getElementById('enable-debug').addEventListener('click', this);
		document.getElementById('enable-grid').addEventListener('click', this);
		const canvasEl = document.getElementById('game-canvas');

		this.gameDebugCanvas = document.createElement('canvas');
		this.gameDebugCanvas.setAttribute('width', canvasEl.getAttribute('width'));
		this.gameDebugCanvas.setAttribute('height', canvasEl.getAttribute('height'));
		this.gameDebugCanvas.id = 'GameDebugCanvas';
		document.getElementById('container-framebuffers').appendChild(this.gameDebugCanvas);
		this.gameDebugCanvasCtx = this.gameDebugCanvas.getContext('2d');
		this.gameDebugCanvasCtx.imageSmoothingEnabled = false;
		this.gameDebugCanvasCtx.globalAlpha = 0.3;
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				switch (e.target.id) {
					case 'enable-debug':
						this.DebugDraw = !this.DebugDraw;

						if (this.DebugDraw === false)
							this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

						break;

					case 'enable-grid':
						this.DebugGrid = !this.DebugGrid;

						if (this.DebugGrid === false)
							this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

						break;
				}
				break;
		}
	}
}

export { DebugDrawer };