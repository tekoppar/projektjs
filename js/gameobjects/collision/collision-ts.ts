import { Vector2D, Rectangle, Vector4D, Vector, Pawn } from '../../internal.js';

class OverlapCheckEnum {
	public Intersect: boolean;
	public Overlaps: boolean;
	public Inside: boolean;

	public constructor(intersects: boolean, overlaps: boolean, inside: boolean) {
		this.Intersect = intersects;
		this.Overlaps = overlaps;
		this.Inside = inside;
	}
}

enum CollisionTypeCheck {
	All,
	Overlap,
	Blocking,
}

const DefaultOverlapCheck = new OverlapCheckEnum(true, true, true);
const OverlapOICheck = new OverlapCheckEnum(false, true, true);
const OverlapOverlapsCheck = new OverlapCheckEnum(false, true, false);

class QuadTree {
	public static MasterQuadTree: QuadTree;
	public static MAX_OBJECTS = 25;
	public static MAX_LEVEL = 5;

	public level: number;
	public objects: Collision[];
	public bounds: Rectangle;
	public nodes: QuadTree[];

	public constructor(level: number, bounds: Rectangle) {
		this.level = level;
		this.objects = [];
		this.bounds = bounds;
		this.nodes = [];
	}

	public Clear() {
		this.objects = null;
		this.level = null;
		this.bounds = null;

		for (let i = 0; i < this.nodes.length; ++i) {
			this.nodes[i].Clear();
		}
		this.nodes = null;
	}

	public Split() {
		let boundsW = this.bounds.w * 0.5,
			boundsH = this.bounds.h * 0.5;

		this.nodes = [
			new QuadTree(this.level + 1, new Rectangle(this.bounds.x, this.bounds.y, boundsW, boundsH)),
			new QuadTree(this.level + 1, new Rectangle(this.bounds.x + boundsW, this.bounds.y, boundsW, boundsH)),
			new QuadTree(this.level + 1, new Rectangle(this.bounds.x, this.bounds.y + boundsH, boundsW, boundsH)),
			new QuadTree(this.level + 1, new Rectangle(this.bounds.x + boundsW, this.bounds.y + boundsH, boundsW, boundsH))
		];

		let outsideObjects = [];
		for (let object of this.objects) {
			if (object.position !== null) {
				let bb = object.GetBoundingBox();
				//QuadTree.MasterQuadTree.Remove(object);
				if (this.bounds.Outside(bb)) {
					outsideObjects.push(object);
				} else {
					if (this.nodes[0].bounds.Overlaps(bb))
						this.nodes[0].Add(object);
					if (this.nodes[1].bounds.Overlaps(bb))
						this.nodes[1].Add(object);
					if (this.nodes[2].bounds.Overlaps(bb))
						this.nodes[2].Add(object);
					if (this.nodes[3].bounds.Overlaps(bb))
						this.nodes[3].Add(object);
				}
			}
		}

		for (let object of outsideObjects) {
			QuadTree.MasterQuadTree.Remove(object);
		}
		for (let object of outsideObjects) {
			QuadTree.MasterQuadTree.Add(object);
		}

		this.objects = [];
	}

	public GetIndex(bounds: Rectangle): number[] {
		let index: number[] = [];
		if (this.nodes[0].bounds.Overlaps(bounds))
			index.push(0);
		if (this.nodes[1].bounds.Overlaps(bounds))
			index.push(1);
		if (this.nodes[2].bounds.Overlaps(bounds))
			index.push(2);
		if (this.nodes[3].bounds.Overlaps(bounds))
			index.push(3);

		return index;
	}

	public Add(object: Collision): void {
		if (object.position === null)
			return;

		if (this.nodes.length === 0) {
			this.objects.push(object);

			if (this.objects.length >= QuadTree.MAX_OBJECTS && this.level <= QuadTree.MAX_LEVEL) {
				this.Split();
			}
		} else {
			let bounds = object.GetBoundingBox();

			if (this.nodes[0].bounds.Overlaps(bounds))
				this.nodes[0].Add(object);
			if (this.nodes[1].bounds.Overlaps(bounds))
				this.nodes[1].Add(object);
			if (this.nodes[2].bounds.Overlaps(bounds))
				this.nodes[2].Add(object);
			if (this.nodes[3].bounds.Overlaps(bounds))
				this.nodes[3].Add(object);
		}
	}

	public Remove(object: Collision): void {
		if (this.nodes.length === 0) {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				if (this.objects[i] === object) {
					this.objects.splice(i, 1);
					return;
				}
			}
		} else {
			let bounds = object.GetBoundingBox();

			if (this.nodes[0].bounds.Overlaps(bounds))
				this.nodes[0].Remove(object);
			if (this.nodes[1].bounds.Overlaps(bounds))
				this.nodes[1].Remove(object);
			if (this.nodes[2].bounds.Overlaps(bounds))
				this.nodes[2].Remove(object);
			if (this.nodes[3].bounds.Overlaps(bounds))
				this.nodes[3].Remove(object);
		}
	}

	public Get(bounds: Rectangle): Array<Collision> {
		if (this.nodes.length > 0) {
			let index = this.GetIndex(bounds);

			let objects: Collision[] = [],
				temp: Collision[] = [];
			for (let i: number = 0, l = index.length; i < l; ++i) {
				temp = this.nodes[index[i]].Get(bounds);
				for (let i2 = 0, l2 = temp.length; i2 < l2; ++i2) {
					objects.push(temp[i2]);
				}
			}
			return objects;
		} else {
			for (let i = 0, l = this.objects.length; i < l; ++i) {
				if (this.objects[i].position === null) {
					this.objects.splice(i, 1);
					--i;
					--l;
				}
			}

			return this.objects;
		}
	}
}

class CollisionHandler {
	public static GCH = new CollisionHandler();

	public Collisions: Collision[];
	public EnabledCollisions: Collision[];
	public QuadTree: QuadTree;

	public constructor() {
		this.Collisions = [];
		this.EnabledCollisions = [];
		this.QuadTree = QuadTree.MasterQuadTree = new QuadTree(0, new Rectangle(0, 0, 10000, 10000));
	}

	public FixedUpdate() {

	}

	public AddCollision(collision: Collision) {
		this.Collisions.push(collision);
		this.QuadTree.Add(collision);

		if (collision.enableCollision === true)
			this.EnabledCollisions.push(collision);
	}

	public RemoveCollision(collision: Collision) {
		for (let i = 0, l = this.Collisions.length; i < l; ++i) {
			if (collision === this.Collisions[i]) {
				this.QuadTree.Remove(this.Collisions[i]);
				this.Collisions.splice(i, 1);
			}
		}

		for (let i = 0, l = this.EnabledCollisions.length; i < l; ++i) {
			if (collision === this.EnabledCollisions[i]) {
				this.EnabledCollisions.splice(i, 1);
			}
		}
	}

	public RemoveFromQuadTree(collision: Collision) {
		this.QuadTree.Remove(collision);
	}

	public UpdateQuadTree(collision: Collision) {
		this.QuadTree.Add(collision);
	}

	public CheckCollisions(collision: Collision): boolean {
		/*let quads = [this.QuadTree];

		while (quads.length > 0) {
			if (quads[0].nodes.length > 0) {
				quads = quads.concat(quads[0].nodes);
			}

			DebugDrawer.AddDebugRectOperation(quads[0].bounds, 0.5, CMath.CSS_COLOR_NAMES[CMath.RandomInt(0, CMath.CSS_COLOR_NAMES.length)], true);
			quads.splice(0, 1);
		}*/

		let quadOverlaps = this.QuadTree.Get(collision.collisionOwner.BoxCollision.GetBoundingBox());
		quadOverlaps = quadOverlaps.concat(this.QuadTree.Get(collision.GetBoundingBox()));

		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0 && collision.collisionOwner !== quadOverlaps[i].collisionOwner && quadOverlaps[i].enableCollision === true) {
				return false;
			}
		}

		return true;
	}

	public GetInRangeType(collision: Collision, range: number, type: ClassDecorator): Collision[] {
		let inRange = this.GetInRange(collision, range),
			newInRange = [];

		for (let i = 0, l = inRange.length; i < l; ++i) {
			if (inRange[i] instanceof type)
				newInRange.push(inRange[i]);
		}

		return newInRange;
	}

	public GetInRange(collision: Collision, range: number): any[] {
		let inRange = [],
			quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (quadOverlaps[i].collisionOwner !== undefined && collision.collisionOwner !== quadOverlaps[i].collisionOwner && collision.CheckInRealRange(quadOverlaps[i], range) === true && inRange.indexOf(quadOverlaps[i].collisionOwner) === -1) {
				inRange.push(quadOverlaps[i].collisionOwner);
			}
		}

		return inRange;
	}

	public GetOverlap(collision: Collision): Collision {
		let quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox()),
			overlaps = [],
			overlapsRange = [];

		let realPos = collision.GetRealCenterPosition();
		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (collision.DoIntersect(quadOverlaps[i], true) === true && collision.collisionOwner !== quadOverlaps[i].collisionOwner && quadOverlaps[i].overlapEvents === true) {
				overlaps.push(quadOverlaps[i]);
				overlapsRange.push({ d: realPos.Distance(quadOverlaps[i].GetRealCenterPosition()), i: overlapsRange.length });
			}
		}

		if (overlapsRange.length > 0 && overlaps.length > 0) {
			overlapsRange.sort((a, b) => a.d - b.d);
			return overlaps[overlapsRange[0].i];
		} else {
			quadOverlaps = null;
			return undefined;
		}
	}

	public GetOverlapByClass(collision: Collision, className: string): (Collision | boolean) {
		let quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox()),
			overlaps = [],
			overlapsRange = [];

		let realPos = collision.collisionOwner.GetPosition();
		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (quadOverlaps[i].collisionOwner !== undefined) {
				let objPrototype = Object.getPrototypeOf(quadOverlaps[i].collisionOwner);
				if (objPrototype.constructor.name === className && collision.DoOverlap(quadOverlaps[i], true) === true && collision.collisionOwner !== quadOverlaps[i].collisionOwner && quadOverlaps[i].enableCollision === false && quadOverlaps[i].overlapEvents === true) {
					overlaps.push(quadOverlaps[i]);
					overlapsRange.push({ d: realPos.Distance(quadOverlaps[i].GetRealCenterPosition()), i: overlapsRange.length });
				}
			}
		}

		if (overlapsRange.length > 0 && overlaps.length > 0) {
			overlapsRange.sort((a, b) => a.d - b.d);
			return overlaps[overlapsRange[0].i];
		} else {
			quadOverlaps = null;
			return false;
		}
	}

	public GetOverlaps(collision: Collision, OverlapCheckType: OverlapCheckEnum = DefaultOverlapCheck, CollisionCheckType: CollisionTypeCheck = CollisionTypeCheck.Overlap): Collision[] {
		let overlaps = [],
			quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (quadOverlaps[i].overlapEvents === true && (CollisionCheckType !== CollisionTypeCheck.Overlap && CollisionCheckType !== CollisionTypeCheck.All))
				continue;
			if (quadOverlaps[i].enableCollision === true && (CollisionCheckType !== CollisionTypeCheck.Blocking && CollisionCheckType !== CollisionTypeCheck.All))
				continue;

			if (collision.collisionOwner !== undefined && quadOverlaps[i].collisionOwner !== undefined) {
				if (collision.collisionOwner !== quadOverlaps[i].collisionOwner) {
					if (OverlapCheckType.Intersect && collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Overlaps && collision.DoOverlap(quadOverlaps[i], true) && quadOverlaps[i].enableCollision === false) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Inside && collision.boundingBox.InsideXY(quadOverlaps[i].boundingBox.x, quadOverlaps[i].boundingBox.y)) {
						overlaps.push(quadOverlaps[i]);
					}
				}
			} else if (CollisionCheckType === CollisionTypeCheck.All) {
				overlaps.push(quadOverlaps[i]);
			}
		}

		quadOverlaps = null;
		return overlaps;
	}

	public GetOverlapsByClassName(collision: Collision, className: string, OverlapCheckType: OverlapCheckEnum = DefaultOverlapCheck, CollisionCheckType: CollisionTypeCheck = CollisionTypeCheck.Overlap): Collision[] {
		let overlaps = [],
			quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (quadOverlaps[i].overlapEvents === true && (CollisionCheckType !== CollisionTypeCheck.Overlap && CollisionCheckType !== CollisionTypeCheck.All))
				continue;
			if (quadOverlaps[i].enableCollision === true && (CollisionCheckType !== CollisionTypeCheck.Blocking && CollisionCheckType !== CollisionTypeCheck.All))
				continue;

			if (collision.collisionOwner !== undefined && quadOverlaps[i].collisionOwner !== undefined) {
				if (quadOverlaps[i].collisionOwner.constructor.name === className && collision.collisionOwner !== quadOverlaps[i].collisionOwner) {
					if (OverlapCheckType.Intersect && collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Overlaps && collision.DoOverlap(quadOverlaps[i], true) && quadOverlaps[i].enableCollision === false) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Inside && collision.boundingBox.InsideXY(quadOverlaps[i].boundingBox.x, quadOverlaps[i].boundingBox.y)) {
						overlaps.push(quadOverlaps[i]);
					}
				}
			} else if (CollisionCheckType === CollisionTypeCheck.All) {
				overlaps.push(quadOverlaps[i]);
			}
		}

		quadOverlaps = null;
		return overlaps;
	}

	public GetOverlapsByClass(collision: Collision, constructor: Function, OverlapCheckType: OverlapCheckEnum = DefaultOverlapCheck, CollisionCheckType: CollisionTypeCheck = CollisionTypeCheck.Overlap): Collision[] {
		let /** @type {Array<Collision>} */ overlaps = [],
			quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

		for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
			if (quadOverlaps[i].overlapEvents === true && (CollisionCheckType !== CollisionTypeCheck.Overlap && CollisionCheckType !== CollisionTypeCheck.All))
				continue;
			if (quadOverlaps[i].enableCollision === true && (CollisionCheckType !== CollisionTypeCheck.Blocking && CollisionCheckType !== CollisionTypeCheck.All))
				continue;

			if (collision.collisionOwner !== undefined && quadOverlaps[i].collisionOwner !== undefined) {
				if (quadOverlaps[i].collisionOwner instanceof constructor && collision.collisionOwner !== quadOverlaps[i].collisionOwner) {
					if (OverlapCheckType.Intersect && collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Overlaps && collision.DoOverlap(quadOverlaps[i], true) && quadOverlaps[i].enableCollision === false) {
						overlaps.push(quadOverlaps[i]);
					} else if (OverlapCheckType.Inside && collision.boundingBox.InsideXY(quadOverlaps[i].boundingBox.x, quadOverlaps[i].boundingBox.y)) {
						overlaps.push(quadOverlaps[i]);
					}
				}
			} else if (CollisionCheckType === CollisionTypeCheck.All) {
				overlaps.push(quadOverlaps[i]);
			}
		}

		quadOverlaps = null;
		return overlaps;
	}

	GetPoints() {

	}
}

class Collision {
	private static COLLISION_INTERSECT_OFFSET = 2;

	public position: Vector2D;
	public size: Vector2D;
	public overlapEvents: boolean;
	public enableCollision: boolean;
	public collisionOwner: Pawn;
	public boundingBox: Rectangle;
	public debugDraw: boolean;

	public constructor(position: Vector2D, size: Vector2D, enableCollision: boolean, owner: Pawn = undefined, register: boolean = true) {
		this.position = position.Clone();
		this.size = size.Clone();
		this.overlapEvents = true;
		this.enableCollision = enableCollision;
		this.collisionOwner = owner;
		this.boundingBox = new Rectangle(position.x, position.y, size.x, size.y);
		this.debugDraw = true;

		if (register === true)
			CollisionHandler.GCH.AddCollision(this);
	}

	public Delete() {
		CollisionHandler.GCH.RemoveCollision(this);
		this.collisionOwner = this.size = this.position = this.boundingBox = null;
	}

	public CheckInRange(collision: Collision, range: number = 25): boolean {
		let tempPos = new Vector2D(this.position.x + (this.size.x * 0.5), this.position.y + (this.size.y * 0.5));
		let checkPos = new Vector2D(collision.position.x + (collision.size.x * 0.5), collision.position.y + (collision.size.y * 0.5));

		return tempPos.CheckInRange(checkPos, range);
	}

	public CheckInCenterRange(collision: Collision, range: number = 25): boolean {
		let a = this.GetCenterPosition(),
			b = collision.position.Clone();

		return a.CheckInRange(b, range);
	}

	public CheckInCenterRangeB(collision: Collision, range: number = 25): boolean {
		let a = this.GetCenterPosition(),
			b = collision.GetCenterPosition().Clone();

		return a.CheckInRange(b, range);
	}

	public CheckInRealRange(collision: Collision, range: number = 25): boolean {
		let a = this.GetRealCenterPosition(),
			b = collision.GetRealCenterPosition();

		return a.CheckInRange(b, range);
	}

	public CheckOverlap() {

	}

	public GetCenterTilePosition(): Vector2D {
		let newPos = new Vector2D(this.position.x, this.position.y);//this.position.Clone();
		newPos.x += this.size.x * 0.5;
		newPos.y -= this.size.y + 32;

		return newPos;
	}

	public GetCenterPositionV2(): Vector2D {
		return this.GetBoundingBox().GetCenterPoint();
	}

	public GetCenterPosition(): Vector2D {
		let newPos = new Vector2D(this.position.x, this.position.y);//.Clone();
		newPos.x += this.size.x * 0.5 + 16;
		newPos.y += this.size.y * 0.5 + 16;

		return newPos;
	}

	public GetRealCenterPosition(): Vector2D {
		let v = this.GetCenterPosition();

		if (this.size.x > 32)
			v.x -= 16;

		return v;
	}

	public GetPoints(): Array<Vector2D> {
		if (this.position !== null) {
			return [
				this.position,
				new Vector2D(this.position.x + this.size.x, this.position.y),
				new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y),
				new Vector2D(this.position.x, this.position.y + this.size.y)
			];
		} else {
			return [];
		}
	}

	private IsOverlaping1D(aMin: number, aMax: number, bMin: number, bMax: number): boolean {
		return aMax >= bMin && bMax >= aMin;
	}

	public DoOverlap(b: Collision, overlap: boolean = false): boolean {
		if (this.enableCollision === true || overlap == true) {
			if (b === undefined || b.boundingBox === null)
				return false;

			let ABB = this.GetBoundingBox(),
				BBB = b.GetBoundingBox();

			return this.IsOverlaping1D(ABB.x - Collision.COLLISION_INTERSECT_OFFSET, (ABB.x - Collision.COLLISION_INTERSECT_OFFSET) + (ABB.w + Collision.COLLISION_INTERSECT_OFFSET), BBB.x - Collision.COLLISION_INTERSECT_OFFSET, (BBB.x - Collision.COLLISION_INTERSECT_OFFSET) + (BBB.w + Collision.COLLISION_INTERSECT_OFFSET)) &&
				this.IsOverlaping1D((ABB.y - Collision.COLLISION_INTERSECT_OFFSET), (ABB.y - Collision.COLLISION_INTERSECT_OFFSET) + (ABB.h + Collision.COLLISION_INTERSECT_OFFSET), (BBB.y - Collision.COLLISION_INTERSECT_OFFSET), (BBB.y - Collision.COLLISION_INTERSECT_OFFSET) + (BBB.h + Collision.COLLISION_INTERSECT_OFFSET));
		}
		else
			return false;
	}

	public DoIntersect(b: Collision, overlap: boolean = false): boolean {
		if (this.enableCollision === true || overlap === true) {
			return this.DoOverlap(b, overlap);
		}
		else
			return false;
	}

	public GetIntersections(points: Array<Vector2D>): number {
		let intersections = 0;

		for (let i = 0, l = points.length; i < l; ++i) {
			let pt1 = points[i];
			let pt2 = points[(i + 1) % l];

			if (this.intersects(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
				this.intersects(this.position.x + this.size.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
				this.intersects(this.position.x + this.size.x, this.position.y + this.size.y, this.position.x, this.position.y + this.size.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
				this.intersects(this.position.x, this.position.y + this.size.y, this.position.x, this.position.y, pt1.x, pt1.y, pt2.x, pt2.y)
			) {
				intersections++;
			}
		}
		return intersections;
	}

	public intersects(a: number, b: number, c: number, d: number, p: number, q: number, r: number, s: number): boolean {
		var det, gamma, lambda;
		det = (c - a) * (s - q) - (r - p) * (d - b);
		if (det === 0) {
			return false;
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
		}
	}

	public IntersectsV(aS: Vector2D, aE: Vector2D, bS: Vector2D, bE: Vector2D): boolean {
		let det, gamma, lambda;
		det = (aE.x - aS.x) * (bE.y - bS.y) - (bE.x - bS.x) * (aE.y - aS.y);
		if (det === 0) {
			return false;
		} else {
			lambda = ((bE.y - bS.y) * (bE.x - aS.x) + (bS.x - bE.x) * (bE.y - aE.y)) / det;
			gamma = ((aS.y - aE.y) * (bE.x - aS.x) + (aE.x - aS.x) * (bE.y - aS.y)) / det;
			return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
		}
	}

	public Intersects(position: Vector2D, size: Vector2D): boolean {
		let positionEnd = new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y);
		let positionEndB = new Vector2D(position.x + size.x, position.y + size.y);
		let det, gamma, lambda;
		det = (positionEnd.x - this.position.x) * (positionEndB.y - position.y) - (positionEndB.x - position.x) * (positionEnd.y - this.position.y);
		if (det === 0) {
			return false;
		} else {
			lambda = ((positionEndB.y - position.y) * (positionEndB.x - this.position.x) + (position.x - positionEndB.x) * (positionEndB.y - this.position.y)) / det;
			gamma = ((this.position.y - positionEnd.y) * (positionEndB.x - this.position.x) + (positionEnd.x - this.position.x) * (positionEndB.y - this.position.y)) / det;
			return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
		}
	}

	public CheckIntersection(v4: Vector4D): boolean {
		//let slope = this.LineSlope(v4);
		//let intersect = this.LineIntersect(slope, v4);
		//let equation = this.LineEquation(this.position.x, slope, intersect);
		let doesIntersect = this.intersects(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y, v4.x, v4.y, v4.x + v4.z, v4.y + v4.a);

		return doesIntersect;
	}

	public Distance(position: (Vector2D | Vector | Vector4D)): number {
		return Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2));
	}

	public LineSlope(position: (Vector2D | Vector | Vector4D)): number {
		return (this.position.y - position.y) / (this.position.x - position.x);
	}

	public LineIntersect(slope: number, b: (Vector2D | Vector | Vector4D)): number {
		return b.y - (slope * b.x);
	}

	public LineEquation(x: number, slope: number, intersect: number): number {
		return slope * x + intersect;
	}

	public UpdateCollision() {
		CollisionHandler.GCH.RemoveFromQuadTree(this);
		CollisionHandler.GCH.UpdateQuadTree(this);
	}

	public Cross(a: Vector2D, b: Vector2D, o: Vector2D): number {
		return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	}

	public SetPosition(position: Vector2D) {
		if (this.overlapEvents) {
			let overlaps = CollisionHandler.GCH.GetOverlaps(this, OverlapOverlapsCheck, CollisionTypeCheck.Overlap);

			let bb = this.GetBoundingBox().Clone();
			bb.Floor();
			bb.UpdateCornersData();
			for (let i = 0, l = overlaps.length; i < l; ++i) {
				overlaps[i].OnOverlap(this, bb.Clone());
			}
		}

		this.position.x = position.x;
		this.position.y = position.y;
		this.CalculateBoundingBox();
		this.UpdateCollision();
	}

	public GetBoundingBox(): Rectangle {
		if (this.position !== null && this.position !== undefined) {
			this.boundingBox.x = this.position.x;
			this.boundingBox.y = this.position.y;
		}
		return this.boundingBox;
	}

	public CopyBoundingBox(bb: Rectangle) {
		if (this.position !== null && this.position !== undefined) {
			this.boundingBox.x = this.position.x;
			this.boundingBox.y = this.position.y;
		}
		bb.x = this.boundingBox.x;
		bb.y = this.boundingBox.y;
		bb.w = this.boundingBox.w;
		bb.h = this.boundingBox.h;
	}

	public CalculateBoundingBox() {
		this.boundingBox.x = this.position.x;
		this.boundingBox.y = this.position.y;
		this.boundingBox.w = this.size.x;
		this.boundingBox.h = this.size.y;
	}

	public OnHit(damage: number, source: Collision) {
		this.collisionOwner.OnHit(damage, source);
	}

	public OnOverlap(overlap: Collision, boundingBox: Rectangle) {
		if (this.collisionOwner !== undefined && this.collisionOwner.OnOverlap !== undefined)
			this.collisionOwner.OnOverlap(boundingBox, overlap.collisionOwner);
	}
}

class BoxCollision extends Collision {
	public boundingBox: Rectangle;

	public constructor(position: Vector2D, size: Vector2D, enableCollision: boolean, owner: Pawn = undefined, register: boolean = true) {
		super(position, size, enableCollision, owner, register);

		this.boundingBox = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
	}

	public SetPosition(position: Vector2D) {
		super.SetPosition(position);
	}

	public Delete() {
		super.Delete();
	}
}

class PolygonCollision extends Collision {
	public points: Vector2D[];
	public refPoints: Vector2D[];

	public constructor(position: Vector2D, size: Vector2D, points: Vector2D[] = [], enableCollision: boolean, owner: Pawn = undefined, register: boolean = true) {
		super(position, size, enableCollision, owner, false);

		this.points = points;
		this.refPoints = [...points];

		this.UpdatePoints();
		this.CalculateBoundingBox();

		if (register === true)
			CollisionHandler.GCH.AddCollision(this);
	}

	public Delete() {
		super.Delete();
	}

	public SetPosition(position: Vector2D) {
		super.SetPosition(position);
		this.UpdatePoints();
	}

	public UpdatePoints() {
		CollisionHandler.GCH.RemoveFromQuadTree(this);
		this.points = [];
		for (let i = 0, l = this.refPoints.length; i < l; ++i) {
			let newPos = this.refPoints[i].Clone();
			newPos.Add(this.position);
			this.points.push(newPos);
		}
		CollisionHandler.GCH.UpdateQuadTree(this);
	}

	public GetBoundingBox(): Rectangle {
		return this.boundingBox;
	}

	public CopyBoundingBox(bb: Rectangle) {
		bb.x = this.boundingBox.x;
		bb.y = this.boundingBox.y;
		bb.w = this.boundingBox.w;
		bb.h = this.boundingBox.h;
	}

	public CalculateBoundingBox() {
		let sX = 9999999999, sY = 9999999999, lX = -1, lY = -1;

		for (let pos of this.points) {
			if (pos.x > lX)
				lX = pos.x;
			if (pos.x < sX)
				sX = pos.x;
			if (pos.y > lY)
				lY = pos.y;
			if (pos.y < sY)
				sY = pos.y;
		}
		this.boundingBox = new Rectangle(sX, sY, lX - sX, lY - sY);
	}

	public static CalculateBoundingBox(points: Vector2D[]): Rectangle {
		let sX = 9999999999, sY = 9999999999, lX = -1, lY = -1;

		for (let pos of points) {
			if (pos.x > lX)
				lX = pos.x;
			if (pos.x < sX)
				sX = pos.x;
			if (pos.y > lY)
				lY = pos.y;
			if (pos.y < sY)
				sY = pos.y;
		}
		return new Rectangle(sX, sY, lX - sX, lY - sY);
	}

	public UpdatePosition() {
		this.position.x = this.boundingBox.x;
		this.position.y = this.boundingBox.y;
	}

	public GetCenterPosition(): Vector2D {
		let newPos = new Vector2D(this.boundingBox.x, this.boundingBox.y);
		newPos.x += this.boundingBox.w * 0.5;
		newPos.y += this.boundingBox.h - 8;

		return newPos;
	}

	public GetPoints(): Vector2D[] {
		return this.points;
	}
}

export { CollisionHandler, Collision, BoxCollision, PolygonCollision, QuadTree, OverlapCheckEnum, OverlapOICheck, OverlapOverlapsCheck, CollisionTypeCheck };