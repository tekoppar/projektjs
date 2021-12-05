import { Vector2D, Vector4D, Rectangle, CMath, DebugDrawer } from '../../internal.js';

const OverlapCheckEnum = {
    Intersect: false,
    Overlaps: false,
    Inside: false,
}

/**
 * Enum for collision type check
 * @readonly
 * @enum {Number}
 */
const CollisionTypeCheck = {
    All: 0,
    Overlap: 1,
    Blocking: 2,
}

const DefaultOverlapCheck = { Intersect: true, Overlaps: true, Inside: true };
const OverlapOICheck = { Intersect: false, Overlaps: true, Inside: true };
const OverlapOverlapsCheck = { Intersect: false, Overlaps: true, Inside: false };

/**
 * @class
 * @constructor
 */
class QuadTree {
    static MasterQuadTree;
    static MAX_OBJECTS = 25;
    static MAX_LEVEL = 5;

    /**
     * Creates a new QuadTree
     * @param {Number} level 
     * @param {Rectangle} bounds 
     */
    constructor(level, bounds) {
        this.level = level;
        this.objects = [];
        this.bounds = bounds;
        this.nodes = [];
    }

    Clear() {
        this.objects = null;
        this.level = null;
        this.bounds = null;

        for (let i = 0; i < this.nodes.length; ++i) {
            this.nodes[i].Clear();
        }
        this.nodes = null;
    }

    Split() {
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

    GetIndex(bounds) {
        let index = [];
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

    Add(object) {
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

    Remove(object) {
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

    Get(bounds) {
        if (this.nodes.length > 0) {
            let index = this.GetIndex(bounds);

            let objects = [],
                temp = [];
            for (let i = 0, l = index.length; i < l; ++i) {
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

/**
 * @class
 * @constructor
 */
class CollisionHandler {
    static GCH = new CollisionHandler();

    constructor() {
        this.Collisions = [];
        this.EnabledCollisions = [];
        let canvas = document.getElementById('game-canvas');
        this.QuadTree = QuadTree.MasterQuadTree = new QuadTree(0, new Rectangle(0, 0, parseFloat(canvas.getAttribute('width')), parseFloat(canvas.getAttribute('height'))));
    }

    FixedUpdate() {

    }

    AddCollision(collision) {
        this.Collisions.push(collision);
        this.QuadTree.Add(collision);

        if (collision.enableCollision === true)
            this.EnabledCollisions.push(collision);
    }

    RemoveCollision(collision) {
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

    RemoveFromQuadTree(collision) {
        this.QuadTree.Remove(collision);
    }

    UpdateQuadTree(collision) {
        this.QuadTree.Add(collision);
    }

    CheckCollisions(collision) {
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
            //DebugDrawer.AddDebugOperation(quadOverlaps[i].position.Clone(), 2, 'orange');
            if ((collision.DoIntersect(quadOverlaps[i]) === true || collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0) && collision.collisionOwner !== quadOverlaps[i].collisionOwner && quadOverlaps[i].enableCollision === true) {
                return false;
            }
        }

        return true;
    }

    GetInRangeType(collision, range, type) {
        let inRange = this.GetInRange(collision, range),
            newInRange = [];

        for (let i = 0, l = inRange.length; i < l; ++i) {
            if (inRange[i] instanceof type)
                newInRange.push(inRange[i]);
        }

        return newInRange;
    }

    GetInRange(collision, range) {
        let inRange = [],
            quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

        for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
            if (quadOverlaps[i].collisionOwner !== undefined && collision.collisionOwner !== quadOverlaps[i].collisionOwner && collision.CheckInRealRange(quadOverlaps[i], range) === true && inRange.indexOf(quadOverlaps[i].collisionOwner) === -1) {
                inRange.push(quadOverlaps[i].collisionOwner);
            }
        }

        return inRange;
    }

    GetOverlap(collision) {
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
            return false;
        }
    }

    /**
     * 
     * @param {Collision} collision 
     * @param {string} className 
     * @returns 
     */
    GetOverlapByClass(collision, className) {
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

    GetOverlaps(collision, debugDraw = false, OverlapCheckType = DefaultOverlapCheck, CollisionCheckType = CollisionTypeCheck.Overlap) {
        let overlaps = [],
            quadOverlaps = this.QuadTree.Get(collision.GetBoundingBox());

        //DebugDrawer.AddDebugRectOperation(collision.GetBoundingBox(), 0.1, 'blue');

        for (let i = 0, l = quadOverlaps.length; i < l; ++i) {
            if (quadOverlaps[i].overlapEvents === true && (CollisionCheckType !== CollisionTypeCheck.Overlap && CollisionCheckType !== CollisionTypeCheck.All))
                continue;
            if (quadOverlaps[i].enableCollision === true && (CollisionCheckType !== CollisionTypeCheck.Blocking && CollisionCheckType !== CollisionTypeCheck.All))
                continue;

            if (collision.collisionOwner !== undefined && quadOverlaps[i].collisionOwner !== undefined) {
                if (collision.collisionOwner !== quadOverlaps[i].collisionOwner) {
                    if (OverlapCheckType.Intersect && collision.GetIntersections(quadOverlaps[i].GetPoints()) > 0) {
                        overlaps.push(quadOverlaps[i]);
                    } else if (OverlapCheckType.Overlaps && collision.DoOverlap(quadOverlaps[i], true)) {
                        overlaps.push(quadOverlaps[i]);
                    } else if (OverlapCheckType.Inside && collision.boundingBox.Inside(quadOverlaps[i].boundingBox)) {
                        overlaps.push(quadOverlaps[i]);
                    }
                }
            } else if (CollisionCheckType === CollisionTypeCheck.All) {
                overlaps.push(quadOverlaps[i]);
            }
            if (debugDraw)
                DebugDrawer.AddDebugRectOperation(quadOverlaps[i].GetBoundingBox(), 0.1, 'orange');
        }

        quadOverlaps = null;
        return overlaps;
    }

    GetPoints() {

    }
}

/**
 * @class
 * @constructor
 */
class Collision {
    static COLLISION_INTERSECT_OFFSET = 2;

    /**
     * Creates a new Collision
     * @param {Vector2D} position 
     * @param {Vector2D} size 
     * @param {boolean} enableCollision 
     * @param {Object} owner 
     * @param {boolean} register 
     */
    constructor(position, size, enableCollision, owner = undefined, register = true) {
        this.position = position.Clone();
        this.size = size.Clone();
        this.overlapEvents = true;
        this.enableCollision = enableCollision;
        this.collisionOwner = owner;
        this.boundingBox = new Rectangle(1, 1, 1, 1);
        this.debugDraw = true;

        if (register === true)
            CollisionHandler.GCH.AddCollision(this);
    }

    Delete() {
        CollisionHandler.GCH.RemoveCollision(this);
        this.collisionOwner = this.size = this.position = this.boundingBox = null;
    }

    CheckInRange(collision, range = 25) {
        let tempPos = new Vector2D(this.position.x + (this.size.x * 0.5), this.position.y + (this.size.y * 0.5));
        let checkPos = new Vector2D(collision.position.x + (collision.size.x * 0.5), collision.position.y + (collision.size.y * 0.5));

        return tempPos.CheckInRange(checkPos, range);
    }

    CheckInCenterRange(collision, range = 25) {
        let a = this.GetCenterPosition(),
            b = collision.position.Clone();

        return a.CheckInRange(b, range);
    }

    CheckInCenterRangeB(collision, range = 25) {
        let a = this.GetCenterPosition(),
            b = collision.GetCenterPosition().Clone();

        return a.CheckInRange(b, range);
    }

    CheckInRealRange(collision, range = 25) {
        let a = this.GetRealCenterPosition(),
            b = collision.GetRealCenterPosition();

        return a.CheckInRange(b, range);
    }

    CheckOverlap() {
        let overlapEvent = CollisionHandler.GCH.CheckCollisions(this);
    }

    GetCenterTilePosition() {
        let newPos = new Vector2D(this.position.x, this.position.y);//this.position.Clone();
        newPos.x += this.size.x * 0.5;
        newPos.y -= this.size.y + 32;

        return newPos;
    }

    GetCenterPositionV2() {
        return this.GetBoundingBox().GetCenterPoint();
    }

    GetCenterPosition() {
        let newPos = new Vector2D(this.position.x, this.position.y);//.Clone();
        newPos.x += this.size.x * 0.5 + 16;
        newPos.y += this.size.y * 0.5 + 16;

        return newPos;
    }

    GetRealCenterPosition() {
        let v = this.GetCenterPosition();

        if (this.size.x > 32)
            v.x -= 16;

        return v;
    }

    GetPoints() {
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

    GetBoundingBox() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    IsOverlaping1D(aMin, aMax, bMin, bMax) {
        return aMax >= bMin && bMax >= aMin;
    }

    DoOverlap(b, overlap = false) {
        if (this.enableCollision === true || overlap == true) {
            if (b === undefined || b.boundingBox === null)
                return false;

            let ABB = this.GetBoundingBox(),
                BBB = b.GetBoundingBox();
            /*ABB.x -= 2;
            ABB.y -= 2;
            ABB.w += 2;
            ABB.h += 2;
            BBB.x -= 2;
            BBB.y -= 2;
            BBB.w += 2;
            BBB.h += 2;*/

            //DebugDrawer.AddDebugOperation(new Vector2D(ABB.x, ABB.y), 2, 'orange');
            //DebugDrawer.AddDebugOperation(new Vector2D(ABB.z, ABB.a), 2, 'blue');
            //DebugDrawer.AddDebugOperation(new Vector2D(BBB.x, BBB.y), 2, 'pink');
            //DebugDrawer.AddDebugOperation(new Vector2D(BBB.z, BBB.a), 2, 'purple');
            return this.IsOverlaping1D(ABB.x - Collision.COLLISION_INTERSECT_OFFSET, (ABB.x - Collision.COLLISION_INTERSECT_OFFSET) + (ABB.w + Collision.COLLISION_INTERSECT_OFFSET), BBB.x - Collision.COLLISION_INTERSECT_OFFSET, (BBB.x - Collision.COLLISION_INTERSECT_OFFSET) + (BBB.w + Collision.COLLISION_INTERSECT_OFFSET)) &&
                this.IsOverlaping1D((ABB.y - Collision.COLLISION_INTERSECT_OFFSET), (ABB.y - Collision.COLLISION_INTERSECT_OFFSET) + (ABB.h + Collision.COLLISION_INTERSECT_OFFSET), (BBB.y - Collision.COLLISION_INTERSECT_OFFSET), (BBB.y - Collision.COLLISION_INTERSECT_OFFSET) + (BBB.h + Collision.COLLISION_INTERSECT_OFFSET));
        }
        else
            return false;
    }

    DoIntersect(b, overlap = false) {
        //wthis.CheckIntersection(new Vector4D(b.position.x, b.position.y, b.size.x, b.size.y));
        if (this.enableCollision === true || overlap === true) {
            //let centerTile = this.GetCenterPosition();
            //let bCenter = b.GetCenterPosition();
            return this.DoOverlap(b, overlap);// (Math.abs(centerTile.x - bCenter.x) * -1 < (this.size.x + b.size.x)) && (Math.abs(centerTile.y - bCenter.y) * 1 < (this.size.y + b.size.y));
        }
        else
            return false;
    }

    GetIntersections(points) {
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

            /*if (this.IntersectsV(new Vector2D(this.position.x, this.position.y), new Vector2D(this.position.x + this.size.x, this.position.y), new Vector2D(pt1.x, pt1.y), new Vector2D(pt2.x, pt2.y)) ||
                this.IntersectsV(new Vector2D(this.position.x + this.size.x, this.position.y), new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y), new Vector2D(pt1.x, pt1.y), new Vector2D(pt2.x, pt2.y)) ||
                this.IntersectsV(new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y), new Vector2D(this.position.x, this.position.y + this.size.y), new Vector2D(pt1.x, pt1.y), new Vector2D(pt2.x, pt2.y)) ||
                this.IntersectsV(new Vector2D(this.position.x, this.position.y + this.size.y), new Vector2D(this.position.x, this.position.y), new Vector2D(pt1.x, pt1.y), new Vector2D(pt2.x, pt2.y))
            ) {
                intersections++;
            }*/
        }
        return intersections;
    }

    intersects(a, b, c, d, p, q, r, s) {
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

    IntersectsV(aS, aE, bS, bE) {
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

    Intersects(position, size) {
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

    CheckIntersection(v4) {
        let slope = this.LineSlope(v4);
        let intersect = this.LineIntersect(slope, v4);
        let equation = this.LineEquation(this.position.x, slope, intersect);
        let doesIntersect = this.intersects(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y, v4.x, v4.y, v4.x + v4.z, v4.y + v4.a);
    }

    Distance(position) {
        return Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2));
    }

    LineSlope(position) {
        return (this.position.y - position.y) / (this.position.x - position.x);
    }

    LineIntersect(slope, b) {
        return b.y - (slope * b.x);
    }

    LineEquation(x, slope, intersect) {
        return slope * x + intersect;
    }

    UpdateCollision() {
        CollisionHandler.GCH.RemoveFromQuadTree(this);
        CollisionHandler.GCH.UpdateQuadTree(this);
    }

    Cross(a, b, o) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }

    OnHit(damage, source) {
        this.collisionOwner.OnHit(damage, source);
    }
}

/**
 * @class
 * @constructor
 * @extends Collision
 */
class BoxCollision extends Collision {

    /**
     * Creates a new BoxCollision
     * @param {Vector2D} position 
     * @param {Vector2D} size 
     * @param {boolean} enableCollision 
     * @param {Object} owner 
     * @param {boolean} register 
     */
    constructor(position, size, enableCollision, owner = undefined, register = true) {
        super(position, size, enableCollision, owner, register);
        this.boundingBox = new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);

    }

    Delete() {
        super.Delete();
    }

    GetBoundingBox() {
        if (this.position !== null && this.position !== undefined) {
            this.boundingBox.x = this.position.x;
            this.boundingBox.y = this.position.y;
        }
        return this.boundingBox;// new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    CopyBoundingBox(bb) {
        if (this.position !== null && this.position !== undefined) {
            this.boundingBox.x = this.position.x;
            this.boundingBox.y = this.position.y;
        }
        bb.x = this.boundingBox.x;
        bb.y = this.boundingBox.y;
        bb.w = this.boundingBox.w;
        bb.h = this.boundingBox.h;
    }

    CalculateBoundingBox() {
        this.boundingBox.x = this.position.x;
        this.boundingBox.y = this.position.y;
        this.boundingBox.w = this.size.x;
        this.boundingBox.h = this.size.y;
    }
}

/**
 * @class
 * @constructor
 * @extends Collision
 */
class PolygonCollision extends Collision {

    /**
     * Creates a new PolygonCollision
     * @param {Vector2D} position 
     * @param {Vector2D} size 
     * @param {Array<Vector2D>} points 
     * @param {boolean} enableCollision 
     * @param {Object} owner 
     * @param {boolean} register 
     */
    constructor(position, size, points = [], enableCollision, owner = undefined, register = true) {
        super(position, size, enableCollision, owner, false);
        this.points = points;
        this.refPoints = [...points];
        this.UpdatePoints();
        this.CalculateBoundingBox();

        if (register === true)
            CollisionHandler.GCH.AddCollision(this);
    }

    Delete() {
        super.Delete();
    }

    UpdatePoints() {
        CollisionHandler.GCH.RemoveFromQuadTree(this);
        this.points = [];
        for (let i = 0, l = this.refPoints.length; i < l; ++i) {
            let newPos = this.refPoints[i].Clone();
            newPos.Add(this.position);
            this.points.push(newPos);
        }
        CollisionHandler.GCH.UpdateQuadTree(this);
    }

    GetBoundingBox() {
        /*if (this.position !== null && this.position !== undefined) {
            //this.boundingBox.x = this.position.x;
            //this.boundingBox.y = this.position.y;
        }*/
        return this.boundingBox;// new Rectangle(this.boundingBox.x, this.boundingBox.y, this.boundingBox.w, this.boundingBox.h);
    }

    CopyBoundingBox(bb) {
        bb.x = this.boundingBox.x;
        bb.y = this.boundingBox.y;
        bb.w = this.boundingBox.w;
        bb.h = this.boundingBox.h;
    }

    CalculateBoundingBox() {
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

    static CalculateBoundingBox(points) {
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

    UpdatePosition() {
        this.position.x = this.boundingBox.x;
        this.position.y = this.boundingBox.y;
    }

    GetCenterPosition() {
        let newPos = new Vector2D(this.boundingBox.x, this.boundingBox.y);
        newPos.x += this.boundingBox.w * 0.5;
        newPos.y += this.boundingBox.h - 8;

        return newPos;
    }

    GetPoints() {
        return this.points;
    }
}

//let newCollision = new BoxCollision(new Vector2D(256, 320), new Vector2D(64, 64), true);
//collisionHandler.AddCollision(newCollision);
//CollisionHandler.GCH.AddCollision(polygonCollision);

export { CollisionHandler, Collision, BoxCollision, PolygonCollision, QuadTree, OverlapCheckEnum, OverlapOICheck, OverlapOverlapsCheck, CollisionTypeCheck };