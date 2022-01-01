import { Polygon, Vector2D, DLPolygon, ArrayUtility, Cobject, DebugDrawer, MasterObject, Color, Mesh, CollisionHandler, Logger, earcut } from '../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class NavigationSystem extends Cobject {
	static _Instance = new NavigationSystem();

	constructor() {
		super();

		/** @type {Polygon} */ this.navigationMesh = new Polygon([new Vector2D(-500, 200), new Vector2D(-100, 200), new Vector2D(-100, 500), new Vector2D(-500, 500)]);
		this.mesh = undefined;
		/*let flatten = this.navigationMesh.Flatten();

		let tMesh = new Polygon([new Vector2D(-200, 300), new Vector2D(-150, 300), new Vector2D(-150, 400), new Vector2D(-200, 400)]);
		let flatten2 = tMesh.Flatten();

		let holes = [],
			merged = [new Vector2D(-500, 200), new Vector2D(-100, 200), new Vector2D(-100, 500), new Vector2D(-500, 500)],
			newFlatten = [...flatten];*/

		//newFlatten.push(...flatten2);

		/*let faces = Polygon.TriangulateShape(
			merged,
			[[new Vector2D(-200, 300), new Vector2D(-150, 300), new Vector2D(-150, 400), new Vector2D(-200, 400)]]
		);
		console.log(faces);
		console.log(merged.concat([new Vector2D(-200, 300), new Vector2D(-150, 300), new Vector2D(-150, 400), new Vector2D(-200, 400)]), faces);
		this.mesh = Mesh.FromVector2DIndices(merged.concat([new Vector2D(-200, 300), new Vector2D(-150, 300), new Vector2D(-150, 400), new Vector2D(-200, 400)]), faces);*/

		/*for (let i = 0, l = flatten2.length; i < l; ++i) {
			if ((i % 3) === 0)
				holes.push((newFlatten.length - 1) / 2);

			newFlatten.push(flatten2[i]);
		}

		console.log(flatten2, newFlatten, holes);
		let vertexIndices = earcut(newFlatten, [4]);
		this.mesh = Mesh.FromVerticesIndices(newFlatten, vertexIndices);*/
		//console.log(newFlatten, faces, this.mesh, this.mesh.ToObj());
	}

	/**
	 * @todo need to fix if it's inside, right now it's not working if it triangulates again 
	 */
	GenerateNavigation() {
		this.navigationMesh = new Polygon([new Vector2D(-500, 200), new Vector2D(-100, 200), new Vector2D(-100, 500), new Vector2D(-500, 500)]);
		this.navigationMesh.CalculateBoundingBox();

		let allBlockingCollision = CollisionHandler.GCH.EnabledCollisions,
			navPoly = new DLPolygon(this.navigationMesh.ToObject()),
			allHoles = [];

		for (let i = 0, l = allBlockingCollision.length; i < l; ++i) {
			if (this.navigationMesh.boundingBox.IsRectOverlappingOrInside(allBlockingCollision[i].boundingBox) === false)
				continue;

			let points = allBlockingCollision[i].GetPoints();
			let convertedArr = new DLPolygon(points);
			let intersection = navPoly.Difference(convertedArr);

			if (intersection !== undefined) {
				if (intersection.length === 1) {
					navPoly = new DLPolygon(intersection[0]);
				} else if (intersection.length > 1) {
					navPoly = new DLPolygon(intersection[0]);
					allHoles.push(Vector2D.ObjectXYToVector2DArray(intersection[1]));
					let merged = Vector2D.ObjectXYToVector2DArray(intersection[0]);
					let faces = Polygon.TriangulateShape(
						merged,
						[Vector2D.ObjectXYToVector2DArray(intersection[1])]
					);

					//console.log(merged.concat(Vector2D.ObjectXYToVector2DArray(intersection[1])), faces, allHoles);

					if (faces.length > 0) {
						this.mesh = Mesh.FromVector2DIndices(merged.concat(Vector2D.ObjectXYToVector2DArray(intersection[1])), faces);
						//navPoly = new DLPolygon(this.mesh.FlattenToVector2D());
					}
				}/* else if (intersection.length > 1) {
					let flatten = Vector2D.FlattenVector2DArray(intersection[0]);
					let startIndice = flatten.length / 2;
					flatten = flatten.concat(Vector2D.FlattenVector2DArray(intersection[1]));
					let indices = [],
						flatSecond = Vector2D.FlattenVector2DArray(intersection[1]);

					for (let iN = 0, lin = flatSecond.length / 2; iN < lin; iN+=2) {
						indices.push(startIndice + iN);
					}

					let vertexIndices = earcut(flatten, indices);
					this.mesh = Mesh.FromVerticesIndices(flatten, vertexIndices);
				}*/
			}
		}

		let convertedArr = ArrayUtility.ConvertObjects(navPoly.Points(), Vector2D.prototype);
		this.navigationMesh = new Polygon(convertedArr);
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();

		this.GenerateNavigation();
		//DebugDrawer.AddPolygon(this.navigationMesh, 0.016, 'red', false, 1.0);
		//DebugDrawer.AddPolygon(this.navigationMesh, 0.016, 'blue', true, 1.0);
		//DebugDrawer.AddPolygon(this.navigationMesh, 0.016, 'green', null, 1.0);
		DebugDrawer.AddMesh(this.mesh, 0.016, 'green', false);
		DebugDrawer.AddMesh(this.mesh, 0.016, 'red', true);
		DebugDrawer.AddMesh(this.mesh, 0.016, 'blue', null);
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