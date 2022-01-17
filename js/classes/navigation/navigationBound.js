import {
	Cobject, Vector2D, Polygon, DLPolygon, Mesh, Collision, ArrayUtility, Character,
	PolygonClippingResults, NavigationSystem, QuadTree
} from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class NavigationBounds extends Cobject {

	/**
	 * 
	 * @param {Vector2D[]} points 
	 * @param {QuadTree} owner
	 */
	constructor(points, owner = undefined) {
		super();

		/** @type {Polygon} */ this.polygon = new Polygon(points);
		this.polygon.CalculateBoundingBox();

		/** @type {DLPolygon} */ this.dlPolygon = new DLPolygon(this.polygon.ToObject());
		/** @type {Mesh} */ this.mesh = undefined;
		/** @type {Vector2D} */ this.position = new Vector2D(this.polygon.boundingBox.x, this.polygon.boundingBox.y);

		/** @type {Array<Vector2D[]>} */ this.holes = undefined;

		/** @type {boolean} */ this.generateNavigation = false;
		/** @type {QuadTree} */ this.owner = owner;

		NavigationSystem._Instance.AddTree(this);
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
	 * @param {Collision[]} collisions 
	 */
	GenerateNavigation(collisions) {
		let shouldUpdateDLPoly = false,
			shouldUpdate = false;

		/** @type {Array<Vector2D[]>} */ this.holes = [];

		for (let i = 0, l = collisions.length; i < l; ++i) {
			if (collisions[i].enableCollision === false)
				continue;

			//if (collisions[i].collisionOwner !== undefined && collisions[i].collisionOwner instanceof Character)
			//	continue;

			collisions[i].boundingBox.UpdateCornersData();
			if (this.polygon.boundingBox.IsRectOverlappingOrInsideF(collisions[i].boundingBox.x, collisions[i].boundingBox.y, collisions[i].boundingBox.w, collisions[i].boundingBox.h) === false)
				continue;

			const dlPol = new DLPolygon(collisions[i].GetPoints());

			shouldUpdateDLPoly = true;
			let intersection = this.dlPolygon.Intersection(dlPol);
			if (intersection !== undefined) {
				shouldUpdate = true;
				if (this.dlPolygon.clipState === PolygonClippingResults.PolygonClipped) {
					//navBounds[x].UpdatePolygon(Vector2D.ObjectXYToVector2DArray(intersection[0]));
				} else {
					this.AddHole(Vector2D.ObjectXYToVector2DArray(intersection[0]));
				}
			}
		}
		
		if (shouldUpdate)
			this.UpdateNavigation();

		if (shouldUpdateDLPoly)
			this.UpdatePolygon(this.polygon.points);
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
			this.mesh = Mesh.FromVector2DIndices(merged, faces, this.holes);
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

	/**
	 * 
	 */
	FixedUpdate() {
		super.FixedUpdate();
	}

	/**
	 * 
	 */
	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();

		if (this.generateNavigation === true) {
			this.generateNavigation = false;

			if (this.owner !== undefined) {
				this.GenerateNavigation(this.owner.objects);
			}
		}
	}

	/**
	 * 
	 */
	GameBegin() { }

	Delete() {
		super.Delete();

		this.dlPolygon = undefined;
		this.holes = undefined;
		this.mesh = undefined;
		this.polygon = undefined;
		this.position = undefined;
		this.owner = undefined;

		NavigationSystem._Instance.RemoveTree(this);
	}
}

export { NavigationBounds };