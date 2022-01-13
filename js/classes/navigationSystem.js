import {
	Polygon, Vector2D, DLPolygon, ArrayUtility, Cobject, DebugDrawer, Mesh, CollisionHandler,
	Rectangle, PolygonClippingResults, PriorityQueue, Triangle, TQuadTree, Character, MasterObject, earcut
} from '../internal.js';

let doOnce = false;

/**
 * @class
 * @constructor
 */
class NavigationBounds {

	/**
	 * 
	 * @param {Vector2D[]} points 
	 */
	constructor(points) {
		/** @type {Polygon} */ this.polygon = new Polygon(points);
		this.polygon.CalculateBoundingBox();

		/** @type {DLPolygon} */ this.dlPolygon = new DLPolygon(this.polygon.ToObject());
		/** @type {Mesh} */ this.mesh = undefined;
		/** @type {Vector2D} */ this.position = new Vector2D(this.polygon.boundingBox.x, this.polygon.boundingBox.y);

		/** @type {Array<Vector2D[]>} */ this.holes = undefined;
	}

	/**
	 * 
	 * @param {Vector2D[]} vectors 
	 */
	UpdatePolygon(vectors) {
		this.dlPolygon = new DLPolygon(vectors);
	}

	/**
	 * 
	 * @returns {boolean}
	 */
	UpdateNavigation() {
		if (this.holes === undefined)
			return false;

		let merged = ArrayUtility.CloneObjects(this.polygon.points),
			faces = Polygon.TriangulateShape(
				merged,
				this.holes
			);

		for (let x = 0, xl = this.holes.length; x < xl; ++x) {
			for (let y = 0, yl = this.holes[x].length; y < yl; ++y) {
				merged.push(this.holes[x][y]);
			}
		}

		if (faces.length > 0) {
			this.mesh = Mesh.FromVector2DIndices(merged, faces);
			this.holes = undefined;
			this.dlPolygon = new DLPolygon(this.polygon.ToObject());
			return true;
		}

		this.holes = undefined;
		return false;
	}

	/**
	 * 
	 * @param {Vector2D[]} hole 
	 */
	AddHole(hole) {
		if (this.holes === undefined)
			/** @type {Array<Vector2D[]>} */ this.holes = [];

		this.holes.push(hole);
	}
}

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class NavigationSystem extends Cobject {
	static _Instance = new NavigationSystem();

	constructor() {
		super();

		let rects = Rectangle.Split(5, new Rectangle(0, 0, 20000, 20000));

		/** @type {NavigationBounds[]} */ this.navigationTree = [];
		/** @type {TQuadTree<NavigationBounds>} */ this.navigationTree2 = new TQuadTree(0, new Rectangle(0, 0, 20000, 20000), undefined, 8, 25);
		this.navigationTree2.topParent = this.navigationTree2;

		for (let i = 0, l = rects.length; i < l; ++i) {
			let navBound = new NavigationBounds(rects[i].GetCornersVector2D());
			this.navigationTree.push(navBound);
			this.navigationTree2.Add(navBound);
		}

		/** @type {Polygon} */ this.navigationMesh = new Polygon([new Vector2D(-10000, -10000), new Vector2D(10000, -10000), new Vector2D(10000, 10000), new Vector2D(-10000, 10000)]);
	}

	/**
	 * Creates a navigation mesh by subtracting all blocking collisions
	 */
	GenerateNavigation() {
		this.navigationMesh.CalculateBoundingBox();
		/** @type {NavigationBounds[]} */  let navigationBoundsToUpdate = [],
			/** @type {NavigationBounds[]} */ navBoundsUpdateDLPoly = [],
			x = 0,
			xl = 0,
			/** @type {NavigationBounds[]} */ navBounds = [];

		for (let i = 0, l = CollisionHandler.GCH.EnabledCollisions.length; i < l; ++i) {
			//if (CollisionHandler.GCH.EnabledCollisions[i].collisionOwner !== undefined && CollisionHandler.GCH.EnabledCollisions[i].collisionOwner instanceof Character)
				//continue;

			const dlPol = new DLPolygon(CollisionHandler.GCH.EnabledCollisions[i].GetPoints());

			navBounds = [];
			this.navigationTree2.GetNew(CollisionHandler.GCH.EnabledCollisions[i].boundingBox, navBounds);

			for (x = 0, xl = navBounds.length; x < xl; ++x) {
				if (navBounds[x].polygon.boundingBox.IsRectOverlappingOrInsideF(CollisionHandler.GCH.EnabledCollisions[i].boundingBox.x, CollisionHandler.GCH.EnabledCollisions[i].boundingBox.y, CollisionHandler.GCH.EnabledCollisions[i].boundingBox.w, CollisionHandler.GCH.EnabledCollisions[i].boundingBox.h) === false)
					continue;

				navBoundsUpdateDLPoly.push(navBounds[x]);
				let intersection = navBounds[x].dlPolygon.Intersection(dlPol);
				if (intersection !== undefined) {
					if (navigationBoundsToUpdate.indexOf(navBounds[x]) === -1)
						navigationBoundsToUpdate.push(navBounds[x]);

					if (navBounds[x].dlPolygon.clipState === PolygonClippingResults.PolygonClipped) {
						//navBounds[x].UpdatePolygon(Vector2D.ObjectXYToVector2DArray(intersection[0]));
					} else {
						navBounds[x].AddHole(Vector2D.ObjectXYToVector2DArray(intersection[0]));
					}
				}
			}
		}

		for (let i = 0, l = navigationBoundsToUpdate.length; i < l; ++i) {
			navigationBoundsToUpdate[i].UpdateNavigation();
		}
		for (let i = 0, l = navBoundsUpdateDLPoly.length; i < l; ++i) {
			navBoundsUpdateDLPoly[i].UpdatePolygon(navBoundsUpdateDLPoly[i].polygon.points);
		}

		navigationBoundsToUpdate = [];
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {number}
	 */
	Heuristic(a, b) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b 
	 * @returns {number}
	 */
	Euclidean(a, b) {
		let dx = a.x - b.x, dy = a.y - b.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 * @returns {NavigationBounds}
	 */
	GetTree(position) {
		/** @type {NavigationBounds[]} */ let navBounds = [];
		this.navigationTree2.GetNew(new Rectangle(position.x, position.y, 5, 5), navBounds);

		if (navBounds.length === 1)
			return navBounds[0];
		else {
			for (let i = 0, l = navBounds.length; i < l; ++i) {
				if (navBounds[i].mesh.PointInMesh(position) === true)
					return navBounds[i];
			}
		}

		return undefined;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b
	 * @returns {Vector2D[]}
	 */
	PathFromPointToPoint(a, b) {
		/** @type {Triangle} */ let currentTriangle = undefined,
			/** @type {Triangle} */ goalTriangle = undefined,
			/** @type {NavigationBounds} */ currentTree = undefined;

		if (a === undefined || b === undefined)
			return undefined;

		currentTree = this.GetTree(a);
		if (currentTree === undefined)
			return undefined;

		currentTriangle = currentTree.mesh.GetTriangle(a);

		let goalTree = this.GetTree(b);
		if (goalTree === undefined)
			return undefined;

		goalTriangle = goalTree.mesh.GetTriangle(b);
		if (goalTriangle === undefined || currentTriangle === undefined)
			return undefined;

		/** @type {PriorityQueue<Triangle>} */ let frontier = new PriorityQueue();
		frontier.Put(currentTriangle, 0);

		/** @type {Object.<string, Vector2D>} */ let cameFrom = {},
		/** @type {Object.<string, number>} */ costSoFar = {};
		cameFrom[currentTriangle.GetCenter().ToString()] = currentTriangle.GetCenter();
		costSoFar[currentTriangle.GetCenter().ToString()] = 0;

		while (frontier.Empty() === false) {
			let current = frontier.Get();

			if (current.GetCenter().Equal(goalTriangle.GetCenter()) === true)
				break;

			let neighbourTriangles = currentTree.mesh.FindNeighbouringTriangles(current);
			for (let i = 0, l = neighbourTriangles.length; i < l; ++i) {
				let next = neighbourTriangles[i].GetCenter(),
					newCost = costSoFar[current.GetCenter().ToString()] + current.GetCenter().Distance(next);

				let keys = Object.keys(costSoFar),
					index = keys.indexOf(next.ToString());

				if (index === -1)
					index = keys.length - 1;

				if (costSoFar[keys[index]] === costSoFar[keys[keys.length - 1]] || newCost < costSoFar[next.ToString()]) {
					costSoFar[next.ToString()] = newCost;
					let priority = newCost + this.Heuristic(next, goalTriangle.GetCenter());
					frontier.Put(neighbourTriangles[i], priority);
					cameFrom[next.ToString()] = current.GetCenter();
				}
			}
		}

		let currentPosition = goalTriangle.GetCenter(),
			/** @type {Vector2D[]} */ returnArr = [];

		while (currentPosition !== undefined && currentPosition.Equal(currentTriangle.GetCenter()) === false) {
			returnArr.push(currentPosition);
			currentPosition = cameFrom[currentPosition.ToString()];
		}
		returnArr.push(currentTriangle.GetCenter());

		return returnArr;
	}

	/**
	 * 
	 * @param {Vector2D} a 
	 * @param {Vector2D} b
	 * @returns {Vector2D[]}
	 */
	static PathFromPointToPoint(a, b) {
		let arr = NavigationSystem._Instance.PathFromPointToPoint(a, b);

		if (arr !== undefined) {
			arr.reverse();
			return arr;
		} else {
			return [];
		}
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();

		this.GenerateNavigation();
		for (let i = 0, l = this.navigationTree.length; i < l; ++i) {
			if (this.navigationTree[i].mesh !== undefined) {
				DebugDrawer.AddMesh(this.navigationTree[i].mesh, 0.032, 'red', true);
			}
		}

		/*if (doOnce === false) {
			let paths = this.PathFromPointToPoint(new Vector2D(192, 125), MasterObject.MO.playerController.playerCharacter.position, true);
			doOnce = true;
			if (paths !== undefined)
				DebugDrawer.AddPolygon(new Polygon(paths), 25, 'red', true, 1);
		}*/
	}

	Delete() {
		super.Delete();
	}

	/**
	 * 
	 * @param {Vector2D} checkPos 
	 * @param {number} range 
	 * @returns {boolean}
	 */
	CheckInRange(checkPos, range = 100.0) {
		return super.CheckInRange(checkPos, range);
	}

	GameBegin() {
		super.GameBegin();
	}
}

export { NavigationSystem };