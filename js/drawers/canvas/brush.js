import { Vector2D, Tile, DrawingOperation, CanvasSprite, RectOperation, LightingOperation } from "../../internal.js";

/**
 * Enum for editor state
 * @readonly
 * @enum {string}
 */
const BrushType = {
    circle: 'circle',
    box: 'box',
}

/**
 * Enum for editor state
 * @readonly
 * @enum {string}
 */
const BrushDrawState = {
    Normal: 'normal',
    DrawBeneath: 'drawbeneath',
    DrawOntop: 'drawontop',
};

/**
 * @class
 * @constructor
 */
class Brush {

    /**
     * Creates a new Brush
     * @param {BrushSettings} settings 
     * @param {Tile} canvasSprite 
     * @param {BrushDrawState} drawState 
     */
    constructor(settings = new BrushSettings(new Vector2D(1, 1), BrushType.box), canvasSprite = undefined, drawState = BrushDrawState.Normal) {
        /** @type {BrushSettings} */
        this.settings = settings;

        /** @type {Tile} */
        this.canvasSprite = canvasSprite;

        /** @type {BrushDrawState} */
        this.drawState = drawState;

        document.getElementById('size-x').addEventListener('input', this);
        document.getElementById('size-y').addEventListener('input', this);
    }

    /**
     * 
     * @param {BrushType} type 
     * @param {Tile} canvasSprite 
     */
    SetBrush(type, canvasSprite) {
        this.settings.brushType = type;
        this.canvasSprite = canvasSprite;
    }

    /**
     * 
     * @param {BrushDrawState} newState 
     */
    SetState(newState) {
        this.drawState = newState;
    }

    SplitMultiSelection(sprite) {
        let newSprites = [];

        if (sprite.size.x > 32 || sprite.size.y > 32) {
            for (let y = 0; y < sprite.size.x / 32; ++y) {
                for (let x = 0; x < sprite.size.y / 32; ++x) {
                    let cloned = sprite.Clone();
                    cloned.tilePosition.x += y;
                    cloned.tilePosition.y += x;
                    cloned.size.x = 32;
                    cloned.size.y = 32;
                    newSprites.push(cloned);
                }
            }
        } else
            newSprites.push(sprite);

        return newSprites;
    }

    /**
     * 
     * @param {Object} operation 
     * @param {BrushType} brushType 
     */
    static GenerateDrawingOperation(operation, brushType = BrushType.box) {
        if (operation instanceof DrawingOperation) {

        } else if (operation instanceof RectOperation) {

        } else if (operation instanceof LightingOperation) {
            switch (brushType) {
                case BrushType.box:
                    break;
                case BrushType.circle:
                    break;
            }
        }
    }

    /**
     * 
     * @param {Vector2D} pos 
     * @param {HTMLCanvasElement} drawingCanvas 
     * @param {HTMLCanvasElement} targetCanvas 
     * @returns {Array<Object>}
     */
    GenerateDrawingOperations(pos, drawingCanvas, targetCanvas) {
        let drawingOperations = [];

        if (this.canvasSprite === undefined)
            return [];

        switch (this.settings.brushType) {
            case BrushType.circle:

                break;

            case BrushType.box:
                let orgSize = new Vector2D(this.canvasSprite.size.y, this.canvasSprite.size.x);
                let orgPos = this.canvasSprite.tilePosition.Clone();
                let splitSprites = this.SplitMultiSelection(this.canvasSprite);
                let x = this.settings.brushSize.x === 1 ? 0 : Math.ceil(this.settings.brushSize.x * 0.5 * -1);

                for (; x < this.settings.brushSize.x; ++x) {
                    let y = this.settings.brushSize.y === 1 ? 0 : Math.ceil(this.settings.brushSize.y * 0.5 * -1);

                    for (; y < this.settings.brushSize.y; ++y) {
                        let tempPos = { x: pos.x, y: pos.y };
                        tempPos.x += x * orgSize.y;
                        tempPos.y += y * orgSize.x;
                        let index = 0;
                        for (let orgY = 0; orgY < (orgSize.y / 32); orgY++) {
                            for (let orgX = 0; orgX < (orgSize.x / 32); orgX++) {
                                drawingOperations.push(
                                    new DrawingOperation(
                                        this,
                                        new Tile(
                                            new Vector2D(tempPos.x + (splitSprites[index].size.y * orgY), tempPos.y + (splitSprites[index].size.x * orgX)),
                                            splitSprites[index].tilePosition,
                                            new Vector2D(splitSprites[index].size.x, splitSprites[index].size.y),
                                            undefined,
                                            this.canvasSprite.atlas
                                        ),
                                        drawingCanvas,
                                        targetCanvas
                                    )
                                );
                                index++;
                            }
                        }
                    }
                }
                break;
        }
        return drawingOperations;
    }

    /**
     * 
     * @param {HTMLInputElement} element 
     */
    SetBrushSettings(element) {
        switch (element.dataset.type) {
            case "size":
                if (element.id == 'size-x')
                    this.settings.brushSize.x = parseFloat(element.value);
                if (element.id == 'size-y')
                    this.settings.brushSize.y = parseFloat(element.value);
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'input':
                switch (e.target.id) {
                    case 'size-x':
                    case 'size-y':
                        this.SetBrushSettings(e.target);
                        break;
                }
                break;
        }
    }
}

/**
 * @class
 * @constructor
 */
class BrushSettings {

    /**
     * 
     * @param {Vector2D} brushSize 
     * @param {BrushType} brushType 
     */
    constructor(brushSize, brushType) {
        this.brushSize = brushSize;
        this.brushType = brushType;
    }
}

export { Brush, BrushSettings, BrushType, BrushDrawState };