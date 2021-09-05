//import { Vector2D } from '../../classes/vectors.js';

import { Vector2D, Rectangle } from '../../internal.js';

const OperationType = {
    terrain: 0,
    gameObjects: 1,
    gui: 2,
    previewTerrain: 3,
    shadow: 4,
}

class Operation {
    constructor(drawingCanvas, operationType = OperationType.terrain) {
        this.oldPosition = new Vector2D(0, 0);
        this.isVisible = false;
        this.shouldDelete = false;
        this.drawingCanvas = drawingCanvas;
        this.operationType = operationType;
    }

    Delete() {
        this.shouldDelete = true;
    }

    Update(position) {
        if (position !== undefined) {
            this.oldPosition.Set(position);
        }

        this.isVisible = false;
    }

    GetPreviousPosition() {

    }

    UpdateDrawState(state) {
    }

    DrawState() {

    }

    Tick() {

    }
}

class TextOperation extends Operation {
    constructor(text, pos, clear, drawingCanvas, font = 'sans-serif', size = 18, color = 'rgb(243, 197, 47)', drawIndex = 0) {
        super(drawingCanvas, OperationType.gui);
        this.text = text;
        this.pos = new Vector2D(pos.x, pos.y + (size / 2) - 5);
        this.clear = clear;
        this.font = font;
        this.size = size;
        this.color = color;
        this.drawIndex = drawIndex;
        this.needsToBeRedrawn = true;

    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.pos;
    }

    GetSize() {
        return this.text.length * this.size;
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.pos : pos);
    }

    UpdateDrawState(state) {
        this.needsToBeRedrawn = state;
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.pos : this.oldPosition;
    }

    DrawState() {
        return this.needsToBeRedrawn;
    }
}

class RectOperation extends Operation {
    constructor(pos, size = new Vector2D(32, 32), drawingCanvas, color = 'rgb(243, 197, 47)', clear, drawIndex = 0, lifetime = -1, alpha = 0.3, fillOrOutline = false) {
        super(drawingCanvas, OperationType.gui);
        this.position = pos;
        this.clear = clear;
        this.size = size;
        this.color = color;
        this.drawIndex = drawIndex;
        this.needsToBeRedrawn = true;
        this.lifeTime = lifetime;
        this.alpha = alpha;
        this.fillOrOutline = fillOrOutline;
    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosition() {
        return this.position;
    }

    GetDrawPosition() {
        return Vector2D.Add(this.position, this.size);
    }

    GetDrawPositionY() {
        return this.position.y + this.size.y;
    }

    GetSize() {
        return this.size;
    }

    Update(pos) {
        this.needsToBeRedrawn = true;
        super.Update(pos === undefined ? this.position : pos);
    }

    UpdateDrawState(state) {
        this.needsToBeRedrawn = state;
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.position : this.oldPosition;
    }

    DrawState() {
        return this.needsToBeRedrawn;
    }

    Tick(delta) {
        this.lifeTime -= delta;

        if (this.lifeTime <= 0) {
            this.Delete();
        }
    }
}

class DrawingOperation extends Operation {
    constructor(tile, drawingCanvas, targetCanvas, operationType = OperationType.gameObjects) {
        super(drawingCanvas, operationType);
        this.tile = tile;
        this.targetCanvas = targetCanvas;
        this.collisionSize = undefined;
        this.updateRects = undefined;
    }

    Clone() {
        return new DrawingOperation(
            this.tile,
            this.drawingCanvas,
            this.targetCanvas
        )
    }

    Update(position) {
        super.Update(position);
        this.tile.needsToBeRedrawn = true;
        this.updateRects = undefined;
    }

    UpdateDrawState(state) {
        this.tile.needsToBeRedrawn = state;
        this.updateRects = undefined;
    }

    AddUpdateRect(rect) {
        if (this.tile.needsToBeRedrawn === false) {
            if (this.updateRects === undefined)
                this.updateRects = [];

            for (let i = 0; i < this.updateRects.length; i++) {
                if (this.updateRects[i].GetOverlappingCorners(rect).length >= 4)
                    return;
            }

            this.updateRects.push(rect);
        }
    }

    GetDrawIndex() {
        return this.tile.drawIndex;
    }

    GetPosition() {
        return this.tile.position;
    }

    GetSize() {
        return this.collisionSize !== undefined ? this.collisionSize : this.tile.size;
    }

    GetDrawPosition() {
        return Vector2D.Add(this.tile.position, (this.collisionSize !== undefined ? this.collisionSize : this.tile.size));
    }

    GetDrawPositionY() {
        return this.tile.position.y + (this.collisionSize !== undefined ? this.collisionSize.y : this.tile.size.y);
    }

    GetPreviousPosition() {
        return this.oldPosition === undefined ? this.tile.position : this.oldPosition;
    }

    DrawState() {
        return this.tile.needsToBeRedrawn;
    }

    toJSON() {
        if (this.drawingCanvas.id === 'game-canvas' || this.drawingCanvas.id === undefined || this.drawingCanvas.id === '') {
            return {
                t: this.tile
            }
        } else {
            return {
                t: this.tile,
                dc: this.drawingCanvas.id === undefined || this.drawingCanvas.id === '' ? 'game-canvas' : this.drawingCanvas.id,
                tc: this.targetCanvas.id
            }
        }
    }
}

export { Operation, RectOperation, TextOperation, DrawingOperation, OperationType };