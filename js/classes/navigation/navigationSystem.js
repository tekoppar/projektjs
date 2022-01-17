import {
	Polygon, Vector2D, DLPolygon, DebugDrawer, NavigationBounds, CollisionHandler, Line,
	Rectangle, PolygonClippingResults, PriorityQueue, Triangle, TQuadTree, MasterObject, Character,
	Intersection, Mastertime, OpenClosed
} from '../../internal.js';

let doOnce = false;

/**
 * @readonly
 * @enum {number}
 */
const ASettingsPropertyMethod = {
	Null: -1,
	Property: 0,
	Method: 1
}

/**
 * @class
 * @constructor
 */
class ASettings {

	/**
	 * 
	 * @param {ASettingsPropertyMethod} isPropertyMethod 
	 * @param {Function} positionCall 
	 * @param {Function} getNeighboursMethod
	 * @param {Object} getNeighboursCallee
	 */
	constructor(isPropertyMethod = ASettingsPropertyMethod.Property, positionCall, getNeighboursMethod, getNeighboursCallee) {
		/** @type {ASettingsPropertyMethod} */ this.isPropertyMethod = isPropertyMethod;
		/** @type {Function} */ this.positionCall = positionCall;
		/** @type {Function} */ this.getNeighboursMethod = getNeighboursMethod;
		/** @type {Object} */ this.getNeighboursCallee = getNeighboursCallee;
	}
}

/**
 * 
 * @template T
 * @class
 * @constructor
 */
class BuildPathResult {

	/**
	 * 
	 * @param {Map<string, T>} cameFrom 
	 * @param {Object.<string, number>} costSoFar 
	 */
	constructor(cameFrom = new Map(), costSoFar) {
		/** @type {Map<string, T>} */ this.cameFrom = cameFrom;
		/** @type {Object.<string, number>} */ this.costSoFar = costSoFar;
	}
}

/**
 * @class
 * @constructor
 */
class NavigationSystem {
	static _Instance = new NavigationSystem();

	constructor() {
		//let rects = Rectangle.Split(5, new Rectangle(-10000, -10000, 20000, 20000));

		/** @type {NavigationBounds[]} */ this.navigationTree = [];
		
		/** @type {TQuadTree<NavigationBounds>} */ this.navigationTree2 = new TQuadTree(0, new Rectangle(-10000, -10000, 20000, 20000), undefined, 16, 25);
		//this.navigationTree2.topParent = this.navigationTree2;

		/*for (let i = 0, l = rects.length; i < l; ++i) {
			let navBound = new NavigationBounds(rects[i].GetCornersVector2D());
			this.navigationTree.push(navBound);
			this.navigationTree2.Add(navBound);
		}*/

		/** @type {Polygon} */ this.navigationMesh = new Polygon([new Vector2D(-10000, -10000), new Vector2D(10000, -10000), new Vector2D(10000, 10000), new Vector2D(-10000, 10000)]);
	}

	/**
	 * 
	 * @param {NavigationBounds} tree 
	 */
	AddTree(tree) {
		this.navigationTree.push(tree);
	}

	/**
	 * 
	 * @param {NavigationBounds} tree 
	 */
	RemoveTree(tree) {
		let index = this.navigationTree.indexOf(tree);

		if (index !== -1)
			this.navigationTree.splice(index, 1);
	}

	/**
	 * Creates a navigation mesh by subtracting all blocking collisions
	 */
	GenerateNavigation() {
		this.navigationMesh.CalculateBoundingBox();
		/** @type {NavigationBounds[]} */ let navigationBoundsToUpdate = [],
			/** @type {NavigationBounds[]} */ navBoundsUpdateDLPoly = [],
			x = 0,
			xl = 0,
			/** @type {NavigationBounds[]} */ navBounds = [];

		for (let i = 0, l = CollisionHandler.GCH.EnabledCollisions.length; i < l; ++i) {
			if (CollisionHandler.GCH.EnabledCollisions[i].collisionOwner !== undefined && CollisionHandler.GCH.EnabledCollisions[i].collisionOwner instanceof Character)
				continue;

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
		for (let i = 0, l = this.navigationTree.length; i < l; ++i) {
			if (this.navigationTree[i]?.mesh !== undefined && this.navigationTree[i].mesh.PointInMesh(position) === true) {
				return this.navigationTree[i];
			}
		}

		return undefined;
		
		///** @type {NavigationBounds[]} */ let navBounds = [];
		/*this.navigationTree2.GetNew(new Rectangle(position.x, position.y, 5, 5), navBounds);

		if (navBounds.length === 1)
			return navBounds[0];
		else {
			for (let i = 0, l = navBounds.length; i < l; ++i) {
				if (navBounds[i]?.mesh !== undefined && navBounds[i].mesh.PointInMesh(position) === true)
					return navBounds[i];
			}
		}

		return undefined;*/
	}

	/**
	 * 
	 * @param {NavigationBounds} tree 
	 * @returns {NavigationBounds[]}
	 */
	 GetTrees(tree) {
		/** @type {NavigationBounds[]} */ let returnArr = [];

		for (let i = 0, l = this.navigationTree.length; i < l; ++i) {
			let bbA = tree.polygon.boundingBox.GetCornersVector2D(),
				bbB = this.navigationTree[i].polygon.boundingBox.GetCornersVector2D();

			for (let x = 0, xl = bbA.length; x < xl; ++x) {
				if (bbA[x].CheckInRange(bbB[x], 10) === true && this.navigationTree[i] !== tree) {
					returnArr.push(this.navigationTree[i]);
					break;
				}
			}
		}

		return returnArr;

	}

	/**
	 * 
	 * @param {NavigationBounds} tree 
	 * @returns {NavigationBounds[]}
	 */
	GetNeighbouringTrees(tree) {
		/** @type {NavigationBounds[]} */ let navBounds = [],
			/** @type {NavigationBounds[]} */ returnArr = [],
			bb = tree.polygon.boundingBox.Clone();

		bb.ExpandF(25);
		this.navigationTree2.GetNew(bb, navBounds);

		for (let i = 0, l = navBounds.length; i < l; ++i) {
			let bbA = tree.polygon.boundingBox.GetCornersVector2D(),
				bbB = navBounds[i].polygon.boundingBox.GetCornersVector2D();

			for (let x = 0, xl = bbA.length; x < xl; ++x) {
				if (bbA[x].CheckInRange(bbB[x], 10) === true && navBounds[i] !== tree) {
					returnArr.push(navBounds[i]);
					break;
				}
			}
		}

		return returnArr;
	}

	/**
	 * 
	 * @param {NavigationBounds[]} treePath 
	 * @param {Triangle} triangle 
	 * @returns {Triangle[]}
	 */
	GetNeighbouringTrianglesFromTrees(treePath, triangle) {
		/** @type {Triangle[]} */ let triangles = [],
			/** @type {Triangle[]} */ returnArr = [];

		for (let i = 0, l = treePath.length; i < l; ++i) {
			triangles = treePath[i].mesh.FindNeighbouringTrianglesNew(triangle);

			for (let x = 0, xl = triangles.length; x < xl; ++x) {
				returnArr.push(triangles[x]);
			}
		}

		return returnArr;
	}

	/**
	 * 
	 * @param {NavigationBounds[]} treePath 
	 * @param {Line} line 
	 * @returns {Line[]}
	 */
	GetNeighbouringLinesFromTrees(treePath, line) {
		/** @type {Array<{v:Vector2D,l:Line}>} */ let allMidpoints = [],
			/** @type {Line[]} */ allLines = [],
			/** @type {Line[]} */ returnArr = [],
			lineLUT = {},
			position = line.GetCentroid();

		for (let i = 0, l = treePath.length; i < l; ++i) {
			for (let t = 0, tl = treePath[i].mesh.triangles.length; t < tl; ++t) {
				if (lineLUT[treePath[i].mesh.triangles[t].xy.a.ToString() + treePath[i].mesh.triangles[t].xy.b.ToString()] === undefined) {
					allLines.push(treePath[i].mesh.triangles[t].xy);
					allMidpoints.push({ v: treePath[i].mesh.triangles[t].xy.GetCentroid(), l: treePath[i].mesh.triangles[t].xy });
					lineLUT[treePath[i].mesh.triangles[t].xy.a.ToString() + treePath[i].mesh.triangles[t].xy.b.ToString()] = true;
				}

				if (lineLUT[treePath[i].mesh.triangles[t].yz.a.ToString() + treePath[i].mesh.triangles[t].yz.b.ToString()] === undefined) {
					allLines.push(treePath[i].mesh.triangles[t].yz);
					allMidpoints.push({ v: treePath[i].mesh.triangles[t].yz.GetCentroid(), l: treePath[i].mesh.triangles[t].yz });
					lineLUT[treePath[i].mesh.triangles[t].yz.a.ToString() + treePath[i].mesh.triangles[t].yz.b.ToString()] = true;
				}

				if (lineLUT[treePath[i].mesh.triangles[t].zx.a.ToString() + treePath[i].mesh.triangles[t].zx.b.ToString()] === undefined) {
					allLines.push(treePath[i].mesh.triangles[t].zx);
					allMidpoints.push({ v: treePath[i].mesh.triangles[t].zx.GetCentroid(), l: treePath[i].mesh.triangles[t].zx });
					lineLUT[treePath[i].mesh.triangles[t].zx.a.ToString() + treePath[i].mesh.triangles[t].zx.b.ToString()] = true;
				}
			}
		}

		for (let i = 0, l = allMidpoints.length; i < l; ++i) {
			let intersectsLine = false;
			for (let t = 0, tl = allLines.length; t < tl; ++t) {
				if (allMidpoints[i].l !== line && allLines[t] !== line && Intersection.LineIntersectionVector2D(position, allMidpoints[i].v, allLines[t].a, allLines[t].b) === true) {
					intersectsLine = true;
					break;
				}
			}

			if (intersectsLine === false && allMidpoints[i].l.openClosed === OpenClosed.Open && allMidpoints[i].l !== line) {
				returnArr.push(allMidpoints[i].l);
			}
		}

		return returnArr;
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

		/** @type {{cameFrom:Object.<string, NavigationBounds>, costSoFar:Object.<string, number>}} */ let treePaths,
			/** @type {NavigationBounds[]} */ treePath = [];

		if (currentTree !== goalTree) {
			treePaths = this.BuildTreePath(currentTree, goalTree);
			treePath = this.BacktraceTree(treePaths.cameFrom, goalTree, currentTree);
		} else {
			treePath.push(currentTree);
		}

		/** @type {BuildPathResult<Vector2D>} */ let paths;
		//paths = this.BuildPath(currentTriangle, goalTriangle, treePath);

		/*paths = this.BuildPathT(
			currentTriangle,
			goalTriangle,
			treePath,
			new ASettings(ASettingsPropertyMethod.Method, Triangle.prototype.GetCenter, NavigationSystem.prototype.GetNeighbouringTrianglesFromTrees, this)
		);*/

		paths = this.BuildPathT(
			currentTriangle.GetClosestLine(a),
			goalTriangle.GetClosestLine(b),
			treePath,
			new ASettings(ASettingsPropertyMethod.Method, Line.prototype.GetCentroid, NavigationSystem.prototype.GetNeighbouringLinesFromTrees, this)
		);

		return this.Backtrace(paths.cameFrom, goalTriangle.GetClosestLine(b).GetCentroid(), currentTriangle.GetClosestLine(a).GetCentroid());
	}

	/**
	 * 
	 * @param {NavigationBounds} currentTree 
	 * @param {NavigationBounds} goalTree
	 * @returns {{cameFrom:Object.<string, NavigationBounds>, costSoFar:Object.<string, number>}}
	 */
	BuildTreePath(currentTree, goalTree) {
		/** @type {PriorityQueue<NavigationBounds>} */ let frontier = new PriorityQueue();
		frontier.Put(currentTree, 0);

		/** @type {Object.<string, NavigationBounds>} */ let cameFrom = {},
		/** @type {Object.<string, number>} */ costSoFar = {};
		cameFrom[currentTree.position.ToString()] = currentTree;
		costSoFar[currentTree.position.ToString()] = 0;

		while (frontier.Empty() === false) {
			let current = frontier.Get();

			if (current.position.Equal(goalTree.position) === true)
				break;

			let neighbouringTrees = this.GetTrees(currentTree);// this.GetNeighbouringTrees(currentTree);
			for (let i = 0, l = neighbouringTrees.length; i < l; ++i) {
				let next = neighbouringTrees[i].position,
					newCost = costSoFar[current.position.ToString()] + current.position.Distance(next);

				let keys = Object.keys(costSoFar),
					index = keys.indexOf(next.ToString());

				if (index === -1)
					index = keys.length - 1;

				if (costSoFar[keys[index]] === costSoFar[keys[keys.length - 1]] || newCost < costSoFar[next.ToString()]) {
					costSoFar[next.ToString()] = newCost;
					let priority = newCost + this.Heuristic(next, goalTree.position);
					frontier.Put(neighbouringTrees[i], priority);
					cameFrom[next.ToString()] = current;
				}
			}
		}

		return { cameFrom: cameFrom, costSoFar: costSoFar };
	}

	/**
	 * 
	 * @param {Triangle} currentTriangle 
	 * @param {Triangle} goalTriangle 
	 * @param {NavigationBounds[]} treePath 
	 * @returns {BuildPathResult<Vector2D>}
	 */
	BuildPath(currentTriangle, goalTriangle, treePath) {
		/** @type {PriorityQueue<Triangle>} */ let frontier = new PriorityQueue();
		frontier.Put(currentTriangle, 0);

		/** @type {Map<string, Vector2D>} */ let cameFrom = new Map(),
		/** @type {Object.<string, number>} */ costSoFar = {};
		cameFrom.set(currentTriangle.GetCenter().ToString(), currentTriangle.GetCenter());
		costSoFar[currentTriangle.GetCenter().ToString()] = 0;

		while (frontier.Empty() === false) {
			let current = frontier.Get();

			if (current.GetCenter().Equal(goalTriangle.GetCenter()) === true)
				break;

			let neighbourTriangles = this.GetNeighbouringTrianglesFromTrees(treePath, current);

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
					cameFrom.set(next.ToString(), current.GetCenter());
				}
			}
		}

		return new BuildPathResult(cameFrom, costSoFar);
	}

	/**
	 * 
	 * @template T
	 * @param {T} startObject 
	 * @param {T} goalObject 
	 * @param {NavigationBounds[]} treePath 
	 * @param {ASettings} settings
	 * @returns {BuildPathResult}
	 */
	BuildPathT(startObject, goalObject, treePath, settings) {
		/** @type {PriorityQueue<T>} */ let frontier = new PriorityQueue();
		frontier.Put(startObject, 0);

		/** @type {Map<string, Vector2D>} */ let cameFrom = new Map(),
		/** @type {Object.<string, number>} */ costSoFar = {};


		/** @type {Vector2D} */ let startObjectPosition,
			/** @type {Vector2D} */ goalObjectPosition;

		if (settings.isPropertyMethod === ASettingsPropertyMethod.Property) {
			startObjectPosition = startObject[settings.positionCall.name];
			goalObjectPosition = goalObject[settings.positionCall.name];
		} else {
			startObjectPosition = settings.positionCall.call(startObject);
			goalObjectPosition = settings.positionCall.call(goalObject);
		}

		cameFrom.set(startObjectPosition.ToString(), startObjectPosition);
		costSoFar[startObjectPosition.ToString()] = 0;

		while (frontier.Empty() === false) {
			let current = frontier.Get(),
				/** @type {Vector2D} */ currentPosition;

			if (settings.isPropertyMethod === ASettingsPropertyMethod.Property) {
				currentPosition = current[settings.positionCall.name];
			} else {
				currentPosition = settings.positionCall.call(current);
			}

			if (currentPosition.Equal(goalObjectPosition) === true)
				break;

			let neighbourTriangles = settings.getNeighboursMethod.call(settings.getNeighboursCallee, treePath, current);

			for (let i = 0, l = neighbourTriangles.length; i < l; ++i) {
				/** @type {Vector2D} */ let next;

				if (settings.isPropertyMethod === ASettingsPropertyMethod.Property) {
					next = neighbourTriangles[i][settings.positionCall.name];
				} else {
					next = settings.positionCall.call(neighbourTriangles[i]);
				}

				let newCost = costSoFar[currentPosition.ToString()] + currentPosition.Distance(next),
					keys = Object.keys(costSoFar),
					index = keys.indexOf(next.ToString());

				if (index === -1)
					index = keys.length - 1;

				if (costSoFar[keys[index]] === costSoFar[keys[keys.length - 1]] || newCost < costSoFar[next.ToString()]) {
					costSoFar[next.ToString()] = newCost;
					let priority = newCost + this.Heuristic(next, goalObjectPosition);
					frontier.Put(neighbourTriangles[i], priority);
					cameFrom.set(next.ToString(), currentPosition);
				}
			}
		}

		return new BuildPathResult(cameFrom, costSoFar);
	}

	/**
	 * 
	 * @param {Object.<string, NavigationBounds>} cameFrom 
	 * @param {NavigationBounds} goalTree 
	 * @param {NavigationBounds} startTree 
	 * @returns 
	 */
	BacktraceTree(cameFrom, goalTree, startTree) {
		let currentTree = goalTree,
			/** @type {NavigationBounds[]} */ returnArr = [];

		while (currentTree !== undefined && currentTree.position.Equal(startTree.position) === false) {
			returnArr.push(currentTree);
			currentTree = cameFrom[currentTree.position.ToString()];
		}
		returnArr.push(startTree);

		return returnArr;
	}

	/**
	 * 
	 * @param {Map<string, Vector2D>} cameFrom 
	 * @param {Vector2D} goalPosition 
	 * @param {Vector2D} startPosition 
	 * @returns 
	 */
	Backtrace(cameFrom, goalPosition, startPosition) {
		let currentPosition = goalPosition,
			/** @type {Vector2D[]} */ returnArr = [];

		while (currentPosition !== undefined && currentPosition.Equal(startPosition) === false) {
			returnArr.push(currentPosition);

			if (cameFrom.get(currentPosition.ToString()) === undefined || currentPosition.Equal(cameFrom.get(currentPosition.ToString())))
				break;

			currentPosition = cameFrom.get(currentPosition.ToString());
		}
		returnArr.push(startPosition);

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
	}

	EndOfFrameUpdate() {
		//this.GenerateNavigation();
		for (let i = 0, l = this.navigationTree.length; i < l; ++i) {
			if (this.navigationTree[i].mesh !== undefined) {
				DebugDrawer.AddMesh(this.navigationTree[i].mesh, 0.032, 'red', true);
			}
		}

		if (doOnce === false && Mastertime.Frame() === 100) {
			let paths = this.PathFromPointToPoint(new Vector2D(365, 933), MasterObject.MO.playerController.playerCharacter.position);
			doOnce = true;

			console.log(paths);

			if (paths !== undefined)
				DebugDrawer.AddPolygon(new Polygon(paths), 25, 'purple', false, 1);
		}
	}

	GameBegin() {
	}
}

export { NavigationSystem };