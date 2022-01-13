import {
	BoxCollision, Collision, MeshOperation, PolygonCollision, PathOperation, CollisionHandler,
	Vector2D, RectOperation, Mesh, Rectangle, Color, Cobject, Polygon, CanvasDrawer, Operation, TextOperation
} from '../../internal.js';

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
		/** @type {ImageData} */ this.debugImageData = undefined;
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
	 * Adds a drawing operation for a position
	 * @param {Vector2D} position 
	 * @param {string} text
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {string} font
	 * @param {number} fontSize
	 */
	AddText(position, text = 'x', lifetime = 5, color = 'purple', font = 'sans-serif', fontSize = 14) {
		if (this.gameDebugCanvas === undefined)
			return;

		this.debugOperations.push(new TextOperation(text, position, false, this.gameDebugCanvas, font, fontSize, color, 0, lifetime));
	}

	/**
	* Adds a drawing operation for a position
	* @param {Vector2D} position
	* @param {string} text
	* @param {number} lifetime 
	* @param {string} color 
	* @param {string} font
	* @param {number} fontSize
	*/
	static AddText(position, text = 'x', lifetime = 5, color = 'purple', font = 'sans-serif', fontSize = 14) {
		DebugDrawer._Instance.AddText(position, text, lifetime, color, font, fontSize);
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

		this.debugOperations.push(new RectOperation(
			new Vector2D(rect.x, rect.y),
			new Vector2D(rect.w, rect.h),
			this.gameDebugCanvas, color,
			false,
			0,
			lifetime,
			1.0,
			fillOrOutline
		));
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
	 * @param {Polygon} poly 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 * @param {number} alpha
	 */
	AddPolygon(poly, lifetime = 5, color = 'purple', fillOrOutline = false, alpha = 0.5) {
		this.debugOperations.push(new PathOperation(poly.points, this.gameDebugCanvas, color, false, 0, lifetime, fillOrOutline, alpha));
	}

	/**
	 * 
	 * @param {Polygon} poly 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 * @param {number} alpha
	 */
	static AddPolygon(poly, lifetime = 5, color = 'purple', fillOrOutline = false, alpha = 0.5) {
		DebugDrawer._Instance.AddPolygon(poly, lifetime, color, fillOrOutline, alpha);
	}

	/**
	 * 
	 * @param {Mesh} mesh 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 * @param {number} alpha
	 */
	AddMesh(mesh, lifetime = 5, color = 'purple', fillOrOutline = false, alpha = 0.5) {
		this.debugOperations.push(new MeshOperation(mesh, this.gameDebugCanvas, color, false, 0, lifetime, fillOrOutline, alpha));
	}

	/**
	 * 
	 * @param {Mesh} mesh 
	 * @param {number} lifetime 
	 * @param {string} color 
	 * @param {boolean} fillOrOutline 
	 * @param {number} alpha
	 */
	static AddMesh(mesh, lifetime = 5, color = 'purple', fillOrOutline = false, alpha = 0.5) {
		DebugDrawer._Instance.AddMesh(mesh, lifetime, color, fillOrOutline, alpha);
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

				case 'MeshOperation':
					if (this.DebugDraw === true && tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.CanvasClear(tObject);
					break;

				case 'TextOperation':
					if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
						this.CanvasClear(tObject);
					break;
			}
		}

		if (this.DebugDraw === true) {
			this.debugImageData = this.gameDebugCanvasCtx.getImageData(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
		}

		for (let i = 0, l = this.debugOperations.length; i < l; ++i) {
			if (this.debugOperations[i].shouldDelete === true) {
				this.debugOperations.splice(i, 1);
				i--;
				l--;
			} else {
				const tObject = this.debugOperations[i];

				switch (tObject.ClassType) {
					case 'RectOperation':
						if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
							this.DrawDebugCanvasOperation(tObject, delta);
						break;
					case 'PathOperation':
						if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
							this.DrawDebugCanvasOperation(tObject, delta);
						else if (tObject.lifeTime !== -1)
							tObject.Tick(delta);
						break;

					case 'MeshOperation':
						if (this.DebugDraw === true && tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
							this.DrawDebugCanvasOperation(tObject, delta);
						else if (tObject.lifeTime !== -1)
							tObject.Tick(delta);
						break;

					case 'TextOperation':
						if (tObject.DrawState() === true && tObject.oldPosition !== undefined || tObject.shouldDelete === true)
							this.DrawDebugCanvasOperation(tObject, delta);
						else if (tObject.lifeTime !== -1)
							tObject.Tick(delta);
						break;
				}
			}
		}

		if (this.DebugDraw === true) {
			this.gameDebugCanvasCtx.putImageData(this.debugImageData, 0, 0);
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
				drawingOperation.drawingCanvas.getContext('2d').clearRect(
					drawingOperation.position.x - 1 - this.offset.x,
					drawingOperation.position.y - 1 - this.offset.y,
					size.x + 2,
					size.y + 2
				);
				break;

			case 'PathOperation':
				let boundingBox = Polygon.CalculateBoundingBox(drawingOperation.path);
				boundingBox.x -= 1;
				boundingBox.y -= 1;
				boundingBox.w += 2;
				boundingBox.h += 2;
				drawingOperation.drawingCanvas.getContext('2d').clearRect(boundingBox.x - this.offset.x, boundingBox.y - this.offset.y, boundingBox.w, boundingBox.h);
				break;

			case 'MeshOperation':
				let bb = drawingOperation.mesh.boundingBox.Clone();
				bb.x -= 1;
				bb.y -= 1;
				bb.w += 2;
				bb.h += 2;
				drawingOperation.drawingCanvas.getContext('2d').clearRect(bb.x - this.offset.x, bb.y - this.offset.y, bb.w, bb.h);
				break;

			case 'TextOperation':
				size.SetF(drawingOperation.GetSize());
				drawingOperation.drawingCanvas.getContext('2d').clearRect(
					drawingOperation.pos.x - 1 - this.offset.x,
					drawingOperation.pos.y - 1 - this.offset.y - drawingOperation.size,
					size.x + 2,
					size.y + 2
				);
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
				drawingOperation.UpdateDrawState(true);

				if (drawingOperation.fillOrOutline === false) {
					context.fillStyle = drawingOperation.color;
					context.fillRect(
						drawingOperation.position.x - this.offset.x,
						drawingOperation.position.y - this.offset.y,
						drawingOperation.size.x,
						drawingOperation.size.y
					);
				}
				else {
					context.strokeStyle = drawingOperation.color;
					context.strokeRect(
						drawingOperation.position.x + 1 - this.offset.x,
						drawingOperation.position.y + 1 - this.offset.y,
						drawingOperation.size.x - 2,
						drawingOperation.size.y - 2
					);
				}

				context.globalAlpha = 0.3;

				if (drawingOperation.lifeTime !== -1) {
					drawingOperation.Tick(delta);

					if (drawingOperation.lifeTime < 0)
						return;
				}
				break;

			case 'PathOperation':
				context.globalAlpha = drawingOperation.alpha;
				drawingOperation.UpdateDrawState(true);

				if (drawingOperation.path === undefined || (drawingOperation.path !== undefined && drawingOperation.path.length === 0))
					return;

				if (drawingOperation.fillOrOutline === null) {
					context.fillStyle = drawingOperation.color;
					for (let i = 0, l = drawingOperation.path.length; i < l; ++i) {
						context.fillRect(drawingOperation.path[i].x - this.offset.x, drawingOperation.path[i].y - this.offset.y, 4, 4);
					}
				} else {
					context.strokeStyle = drawingOperation.color;
					context.fillStyle = drawingOperation.color;
					context.beginPath();
					context.moveTo(drawingOperation.path[0].x - this.offset.x, drawingOperation.path[0].y - this.offset.y);

					for (let i = 1, l = drawingOperation.path.length; i < l; ++i) {
						context.lineTo(drawingOperation.path[i].x - this.offset.x, drawingOperation.path[i].y - this.offset.y);
					}

					if (drawingOperation.fillOrOutline === true) {
						//context.closePath();
						context.stroke();
					} else {
						context.fill();
					}
				}

				if (drawingOperation.lifeTime !== -1) {
					drawingOperation.Tick(delta);

					if (drawingOperation.lifeTime < 0)
						return;
				}
				break;

			case 'MeshOperation':
				context.globalAlpha = drawingOperation.alpha;
				drawingOperation.UpdateDrawState(true);

				if (drawingOperation.fillOrOutline === null) {
					context.fillStyle = drawingOperation.color;
					let points = drawingOperation.mesh.FlattenToVector2D();
					for (let i = 0, l = points.length; i < l; ++i) {
						context.fillRect(points[i].x - this.offset.x, points[i].y - this.offset.y, 4, 4);
					}
				} else {
					for (let i = 0, l = drawingOperation.mesh.triangles.length; i < l; ++i) {
						const color = Color.ColorToRGBA(drawingOperation.color);
						this.DrawLine(
							drawingOperation.mesh.triangles[i].x.x - this.offset.x,
							drawingOperation.mesh.triangles[i].x.y - this.offset.y,
							drawingOperation.mesh.triangles[i].y.x - this.offset.x,
							drawingOperation.mesh.triangles[i].y.y - this.offset.y,
							color.red,
							color.green,
							color.blue
						);
						this.DrawLine(
							drawingOperation.mesh.triangles[i].y.x - this.offset.x,
							drawingOperation.mesh.triangles[i].y.y - this.offset.y,
							drawingOperation.mesh.triangles[i].z.x - this.offset.x,
							drawingOperation.mesh.triangles[i].z.y - this.offset.y,
							color.red,
							color.green,
							color.blue
						);
						this.DrawLine(
							drawingOperation.mesh.triangles[i].z.x - this.offset.x,
							drawingOperation.mesh.triangles[i].z.y - this.offset.y,
							drawingOperation.mesh.triangles[i].x.x - this.offset.x,
							drawingOperation.mesh.triangles[i].x.y - this.offset.y,
							color.red,
							color.green,
							color.blue
						);
					}

					if (drawingOperation.fillOrOutline === true) {
						//context.closePath();
						//context.stroke();
					} else {
						//context.fill('nonzero');
					}
				}

				if (drawingOperation.lifeTime !== -1) {
					drawingOperation.Tick(delta);

					if (drawingOperation.lifeTime < 0)
						return;
				}
				break;

			case 'TextOperation':
				context.globalAlpha = 1.0;
				drawingOperation.UpdateDrawState(true);
				context.font = drawingOperation.size + 'px ' + drawingOperation.font;
				context.fillStyle = drawingOperation.color;
				context.fillText(drawingOperation.text, drawingOperation.pos.x - this.offset.x, drawingOperation.pos.y - this.offset.y);

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
			this.gameDebugCanvasCtx.clearRect(
				Math.floor(collision.collisionOwner.position.x) - this.offset.x - 2,
				Math.floor(collision.collisionOwner.position.y) - this.offset.y - 2,
				4,
				4
			);
			this.gameDebugCanvasCtx.fillRect(
				Math.floor(collision.collisionOwner.position.x) - this.offset.x - 2,
				Math.floor(collision.collisionOwner.position.y) - this.offset.y - 2,
				4,
				4
			);
			return;
		}

		let color = this.GetColor(collision);
		if (collision.enableCollision === true)
			color.MultF(0.7);

		this.gameDebugCanvasCtx.fillStyle = color.ToString();
		this.gameDebugCanvasCtx.globalAlpha = 0.5;

		switch (collision.constructor) {
			case BoxCollision:
				this.gameDebugCanvasCtx.clearRect(
					collision.boundingBox.x - this.offset.x,
					collision.boundingBox.y - this.offset.y,
					collision.boundingBox.w,
					collision.boundingBox.h
				);
				this.gameDebugCanvasCtx.fillRect(
					collision.boundingBox.x - this.offset.x,
					collision.boundingBox.y - this.offset.y,
					collision.boundingBox.w,
					collision.boundingBox.h
				);
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
				this.gameDebugCanvasCtx.clearRect(
					collision.boundingBox.x - this.offset.x,
					collision.boundingBox.y - this.offset.y,
					collision.boundingBox.w,
					collision.boundingBox.h
				);
				this.gameDebugCanvasCtx.fillRect(
					collision.boundingBox.x - this.offset.x,
					collision.boundingBox.y - this.offset.y,
					collision.boundingBox.w,
					collision.boundingBox.h
				);
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

	/**
	 * 
	 * @param {number} x0 
	 * @param {number} y0 
	 * @param {number} x1 
	 * @param {number} y1 
	 * @param {number} red
	 * @param {number} green
	 * @param {number} blue 
	 */
	DrawLine(x0, y0, x1, y1, red, green, blue) {
		let dy = Math.floor(y1 - y0);
		let dx = Math.floor(x1 - x0);
		let stepx, stepy;

		if (dy < 0) { dy = -dy; stepy = -1; }
		else { stepy = 1; }
		if (dx < 0) { dx = -dx; stepx = -1; }
		else { stepx = 1; }
		dy <<= 1;
		dx <<= 1;

		let fraction = 0;

		this.SetPixel(x0, y0, red, green, blue);
		if (dx > dy) {
			fraction = dy - (dx >> 1);
			while (Math.abs(x0 - x1) > 1) {
				if (fraction >= 0) {
					y0 += stepy;
					fraction -= dx;
				}
				x0 += stepx;
				fraction += dy;
				this.SetPixel(x0, y0, red, green, blue);
			}
		}
		else {
			fraction = dx - (dy >> 1);
			while (Math.abs(y0 - y1) > 1) {
				if (fraction >= 0) {
					x0 += stepx;
					fraction -= dy;
				}
				y0 += stepy;
				fraction += dx;
				this.SetPixel(x0, y0, red, green, blue);
			}
		}
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} red
	 * @param {number} green
	 * @param {number} blue  
	 */
	SetPixel(x, y, red, green, blue) {
		const index = this.GetColorIndex(x, y);

		if (index > 0) {
			this.debugImageData.data[index] = red;
			this.debugImageData.data[index + 1] = green;
			this.debugImageData.data[index + 2] = blue;
			this.debugImageData.data[index + 3] = 255;
		}
	}

	GetColorIndex(x, y) {
		const index = Math.floor(y) * (this.gameDebugCanvas.width * 4) + Math.floor(x) * 4;

		if (Math.floor(index / (this.gameDebugCanvas.width * 4)) === y)
			return index;

		return -1;
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
		this.gameDebugCanvasCtx = this.gameDebugCanvas.getContext('2d', {
			willReadFrequently: true
		});
		this.gameDebugCanvasCtx.imageSmoothingEnabled = false;
		this.gameDebugCanvasCtx.globalAlpha = 0.3;
		this.gameDebugCanvasCtx.fillStyle = 'black';
		this.gameDebugCanvasCtx.fillRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);

		this.debugImageData = this.gameDebugCanvasCtx.getImageData(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
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