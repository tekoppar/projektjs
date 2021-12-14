import { Vector2D } from '../../internal.js';

/**
 * Creates a new Cobject
 * @class
 * @constructor
 * @public
 */
class Cobject {
    /** @type {Object<string, Cobject>} */
    static AllCobjects = { };

    /** @type {Array<string>} */
    static KeysAllCobjects = [];

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

        /** @type {string} */
        this.name = '';

        /** @type {Object} @public */
        this.UID;

        Cobject.AddObject(this);
    }

    /**
     * 
     * @returns {Vector2D}
     */
    GetPosition() {
        this.fakePosition.x = this.position.x - this.size.x / 2;
        this.fakePosition.y = this.position.y - this.size.y;
        return this.fakePosition;//new Vector2D(this.position.x - this.size.x / 2, this.position.y - this.size.y);
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    SetPosition(position) {
        this.position.Set(position);
        //this.position.x += this.size.x / 2;
        //this.position.y += this.size.y;
    }

    /**
     * @static
     * @param {string} uid 
     * @returns {Object} 
     */
    static GetObjectFromUID(uid) {
        return Cobject.AllCobjects[uid];
    }

    /**
     * @static
     * @param {Object} object 
     * @returns {void}
     */
    static DeleteObject(object) {
        if (Cobject.AllCobjects[object.UID] === undefined)
            return;

        Cobject.KeysAllCobjects.splice(Cobject.KeysAllCobjects.indexOf(object.UID), 1);
        delete Cobject.AllCobjects[object.UID];
    }

    /**
     * @static
     * @returns {string}
     */
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

    /**
     * @static
     * @param {Object} object 
     */
    static AddObject(object) {
        object.UID = Cobject.GenerateUID();
        Cobject.AllCobjects[object.UID] = object;
        Cobject.KeysAllCobjects.push(object.UID);
    }

    //@ts-ignore
    FixedUpdate(delta) {
    }

    EndOfFrameUpdate() {

    }

    Delete() {
        Cobject.DeleteObject(this);
    }

    //@ts-ignore
    CEvent(eventType, data) {

    }

    /**
     * 
     * @param {Vector2D} checkPos 
     * @param {Number} range 
     * @returns {boolean}
     */
    CheckInRange(checkPos, range = 100.0) {
        return this.position.Distance(checkPos) < range;
    }

    GameBegin() { }
}

export { Cobject };