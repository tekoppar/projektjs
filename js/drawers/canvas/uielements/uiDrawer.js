import { Vector2D, Tile, TextOperation, AtlasController, DrawingOperation, OperationType, UIElement } from '../../../internal.js';

class UIDrawer {
    constructor(spriteSheet, canvasDrawer) {
        this.spriteSheet = spriteSheet;
        this.canvasDrawer = canvasDrawer;
        this.uiElements = [];
    }

    AddUIElements(delta) {
        if (this.uiElements.length > 0) {
            for (let i = 0, l = this.uiElements.length; i < l; ++i) {
                this.uiElements[i].AddOperations(delta);
            }

            let tempUIElements = this.uiElements;
            for (let i = 0, l = tempUIElements.length; i < l; ++i) {
                if (tempUIElements[i].lifeTime <= 0) {
                    tempUIElements[i].RemoveUI();
                    tempUIElements.splice(i, 1);
                    --i;
                    --l;
                }
            }

            this.uiElements = tempUIElements;
        }
    }

    DrawUIElement(sprite, text, position) {
        let newUiElement = new UIElement(),
            middleWidth = (sprite.width + text.length * 8);

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                this,
                new Tile(
                    new Vector2D(position.x - 16, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(16, 32),
                    false,
                    'inputLeft'
                ),
                this.canvasDrawer.gameGuiCanvas,
                AtlasController.GetAtlas('inputLeft').GetCanvas()
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                this,
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(32, 26),
                    false,
                    'inputMiddle'
                ),
                this.canvasDrawer.gameGuiCanvas,
                AtlasController.GetAtlas('inputMiddle').GetCanvas(),
                OperationType.gameObjects,
                new Vector2D(middleWidth, 26)
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                this,
                new Tile(
                    new Vector2D(position.x + middleWidth, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(16, 32),
                    false,
                    'inputRight'
                ),
                this.canvasDrawer.gameGuiCanvas,
                AtlasController.GetAtlas('inputRight').GetCanvas()
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                this,
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(sprite.x, sprite.y),
                    new Vector2D(sprite.width, sprite.height),
                    false,
                    AtlasController.GetAtlas(sprite.atlas).name
                ),
                this.canvasDrawer.gameGuiCanvas,
                AtlasController.GetAtlas(sprite.atlas).GetCanvas()
            )
        );
        
        newUiElement.drawingOperations.push(
            new TextOperation(
                text,
                new Vector2D(position.x + sprite.width, position.y + (32 / 2)),
                false,
                this.canvasDrawer.gameGuiCanvas
            )
        );
        this.uiElements.push(newUiElement);

        this.canvasDrawer.AddDrawOperations(newUiElement.drawingOperations, OperationType.gui);
    }
}

export { UIDrawer };