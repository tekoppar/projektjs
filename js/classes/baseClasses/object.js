/* import { Vector2D } from '../vectors.js'; */

import { Vector2D } from '../../internal.js';

class Cobject {
    static AllCobjects = { };

    constructor(position = new Vector2D(0, 0)) {
        this.position = position;
        this.fakePosition = new Vector2D(0,0);
        this.size = new Vector2D(1, 1);
        this.name = '';
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

        for (let i = 0; i < array.length; i++) {
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

    FixedUpdate() {

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