import { Vector2D } from '../internal.js';

/**
 * Enum for editor state
 * @readonly
 * @enum {Number}
 */
var AnimationType = {
    Idle: 0, /* Loops forever */
    Cycle: 1, /* Only loops on input */
    Single: 2, /* Only goes once */
}

/**
 * @class
 * @constructor
 */
class CFrame {

    /**
     * Creates a new CFrame
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} w 
     * @param {Number} h 
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    Clone() {
        return new CFrame(this.x, this.y, this.w, this.h);
    }
}

/**
 * @class
 * @constructor
 */
class TileOffset {

    /**
     * Creates a new TileOffset
     * @param {Vector2D} tileOffset 
     */
    constructor(tileOffset) {
        this.tileOffset = tileOffset;
        this.tileOffset.Mult(new Vector2D(32, 32));
        this.position = new Vector2D(0, 0);
    }

    GetPosition(position) {
        this.position.x = position.x + this.tileOffset.x;
        this.position.y = position.y + this.tileOffset.y;
        return this.position;
    }
}

/**
 * @class
 * @constructor
 */
class CAnimation {

    /**
     * Creates a new CAnimation
     * @param {string} name 
     * @param {Vector2D} start 
     * @param {Vector2D} end 
     * @param {Number} w 
     * @param {Number} h 
     * @param {AnimationType} animationType 
     * @param {(Number|Array<Number>)} animationSpeed 
     */
    constructor(name = '', start = new Vector2D(0, 0), end = new Vector2D(0, 0), w = 32, h = 32, animationType = AnimationType.Cycle, animationSpeed = 3) {
        this.name = name;
        this.frames = [];
        this.start = start;
        this.end = end;
        this.w = w;
        this.h = h;
        this.currentFrame = 0;
        this.frameUpdate = false;
        this.animationType = animationType;

        /**@type {(Number|Array[Number])} */
        this.animationSpeed = animationSpeed;
        this.cooldown = 0;
        this.animationStarted = false;
        this.animationFinished = false;
        this.enableDebug = false;

        this.ConstructAnimation(this.start, this.end, this.w, this.h);

        this.cooldown = this.GetSpeed();
    }

    Clone() {
        let clone = new CAnimation(
            this.name,
            this.start,
            this.end,
            this.w,
            this.h,
            this.animationType,
            this.animationSpeed
        );

        clone.currentFrame = this.currentFrame;
        clone.cooldown = this.cooldown;
        clone.animationStarted = this.animationStarted;
        clone.animationFinished = this.animationFinished;

        return clone;
    }

    SetFromAnimation(animation) {
        this.currentFrame = animation.currentFrame;
        this.cooldown = animation.cooldown;
        this.animationStarted = animation.animationStarted;
        this.animationFinished = animation.animationFinished;
    }

    SetSpeed(speed) {
        if (Array.isArray(this.animationSpeed) === true) {
            this.cooldown = this.animationSpeed[Math.min(this.currentFrame, this.animationSpeed.length)] = speed;
        } else
            this.cooldown = this.animationSpeed = speed;
    }

    GetSpeed() {
        if (Array.isArray(this.animationSpeed) === true) {
            return this.animationSpeed[Math.min(this.currentFrame, this.animationSpeed.length)];
        } else
            return this.animationSpeed;
    }

    AnimationLocked() {
        return this.animationType === AnimationType.Single && this.animationFinished === false;
    }

    GetFrame() {
        let frameIndex = this.currentFrame,
            returnFrame = null;

        this.frameUpdate = false;

        if (this.FrameFinished() === true) {
            this.ResetCooldown();
            this.IncrementFrame();

            if (this.AnimationFinished() === true) {
                this.SetAnimationFinishedState(true);
                this.ResetFrame();
            }

            if (this.frames[frameIndex] !== undefined)
                returnFrame = this.frames[frameIndex];
            else
                returnFrame = null;
        } else if (this.animationStarted === false) {
            returnFrame = this.frames[0];
            this.animationStarted = true;
            this.IncrementFrame();
            this.ResetCooldown();
        }

        this.UpdateCooldown();

        return returnFrame;
    }

    UpdateCooldown() {
        this.cooldown--;
    }

    ResetCooldown() {
        this.cooldown = this.GetSpeed();
    }

    FrameFinished() {
        return this.cooldown <= 0;
    }

    IncrementFrame() {
        switch (this.animationType) {
            case AnimationType.Cycle:
                this.frameUpdate = true;
                this.currentFrame++;
                break;

            case AnimationType.Idle:
            case AnimationType.Single:
                if (this.animationFinished === false) {
                    this.frameUpdate = true;
                    this.currentFrame++;
                }
        }
        //if (this.animationStarted === true && this.animationFinished === false)
    }

    ResetFrame() {
        switch (this.animationType) {
            case AnimationType.Cycle: this.currentFrame = 0; this.animationStarted = false; break;

            case AnimationType.Idle:
                this.animationFinished = true;
                this.animationStarted = true;
                this.currentFrame = this.frames.length + 1;
                break;
            case AnimationType.Single:
                if (this.frames.length > 1) {
                    this.currentFrame = -1;
                    this.animationFinished = true;
                }
                break;
        }
    }

    AnimationFinished() {
        switch (this.animationType) {
            case AnimationType.Cycle: return this.currentFrame >= this.frames.length + 1;

            case AnimationType.Idle:
            case AnimationType.Single:
            default:
                return this.currentFrame >= this.frames.length + 1;
        }
    }

    SetAnimationFinishedState(boolean) {
        this.animationFinished = boolean;
    }

    ConstructAnimation(start, end, w, h) {
        let index = 0;

        if (start.x !== end.x) {
            if (start.x > end.x) {
                for (let x = start.x; x > end.x - 1; x--) {
                    this.frames.push(new CFrame(start.x - index, start.y, w, h));
                    index++;
                }
            } else {
                for (let x = start.x; x < end.x + 1; x++) {
                    this.frames.push(new CFrame(start.x + index, start.y, w, h));
                    index++;
                }
            }
        } else {
            if (start.y > end.y) {
                for (let x = start.y; x > end.y - 1; x--) {
                    this.frames.push(new CFrame(start.x, start.y - index, w, h));
                    index++;
                }
            } else {
                for (let x = start.y; x < end.y + 1; x++) {
                    this.frames.push(new CFrame(start.x, start.y + index, w, h));
                    index++;
                }
            }
        }
    }

    GetSize() {
        return new Vector2D(this.w, this.h);
    }

    SaveToFile() {
        return "new CAnimation('" + this.name + "', " + 'new Vector2D(' + this.start.x + ', ' + this.start.y + '), new Vector2D(' + this.end.x + ', ' + this.end.y + '), ' + this.w + ', ' + this.h + ', ' + this.animationType + ', ' + this.animationSpeed + ')';
    }
}

export { CFrame, TileOffset, CAnimation, AnimationType };