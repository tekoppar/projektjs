import { Vector2D } from '../../internal.js';

/**
 * Creates a new Cobject
 * @class
 * @constructor
 * @public
 */
class Cobject {
    static AllCobjects = { };

    /**
     * Create an Object
     * @param {Vector2D} position - position vector of the object
     */
    constructor(position = new Vector2D(0, 0)) {
        /** @type {Vector2D} */
        this.position = position;

        /** @type {Vector2D} */
        this.fakePosition = new Vector2D(0,0);

        /** @type {Vector2D} */
        this.size = new Vector2D(1, 1);

        /** @type {String} */
        this.name = '';

        /** @type {Object} @public */
        this.UID;

        Cobject.AddObject(this);
    }

    GetPosition() {
        this.fakePosition.x = this.position.x - this.size.x / 2;
        this.fakePosition.y = this.position.y - this.size.y;
        return this.fakePosition;//new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y);
    }

    SetPosition(position) {
        this.position.Set(position);
        //this.position.x += this.size.x / 2;
        //this.position.y += this.size.y;
    }

    static GetObjectFromUID(uid) {
        return Cobject.AllCobjects[uid];
    }

    static DeleteObject(object) {
        if (Cobject.AllCobjects[object.UID] === undefined)
            return;

        delete Cobject.AllCobjects[object.UID];
    }

    static GenerateUID() {
        let array = new Uint32Array(3);
        window.crypto.getRandomValues(array);
        let uid = '';

        for (let i = 0, l = array.length; i < l; ++i) {
            uid += array[i];
        }

        if (Cobject.AllCobjects[uid] !== undefined) {
            uid = Cobject.GenerateUID();
        }
        return uid;
    }

    static AddObject(object) {
        let uid = Cobject.GenerateUID();
        object.UID = uid;
        Cobject.AllCobjects[uid] = object;
    }

    FixedUpdate(delta) {

    }

    Delete() {
        Cobject.DeleteObject(this);
    }

    CEvent(eventType, data) {

    }

    CheckInRange(checkPos, range = 100.0) {
        return this.position.Distance(checkPos) < range;
    }

    GameBegin() { }
}

export { Cobject };