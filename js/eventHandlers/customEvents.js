class CustomEventData {
    constructor(eventName, otherObject) {
        this.eventName = eventName;
        this.otherObject = otherObject;
    }
}

class CustomEventHandler {
    static GCEH = new CustomEventHandler();

    constructor() {
        this.registeredListeners = [];
        this.customEvents = [];
    }

    //@ts-ignore
    FixedUpdate(delta) {
        if (this.customEvents.length > 0) {
            for (let y = 0, lY = this.customEvents.length; y < lY; ++y) {
                for (let i = 0, lX = this.registeredListeners.length; i < lX; ++i) {
                    this.registeredListeners[i].CEvent(this.customEvents[y].eventName, this.customEvents[y].otherObject);
                }
            }

            this.customEvents = [];
        }
    }

    static AddListener(object) {
        CustomEventHandler.GCEH.registeredListeners.push(object);
    }

    static NewCustomEvent(eventName, caller) {
        CustomEventHandler.GCEH.customEvents.push(new CustomEventData(eventName, caller));
    }
}

export { CustomEventData, CustomEventHandler };