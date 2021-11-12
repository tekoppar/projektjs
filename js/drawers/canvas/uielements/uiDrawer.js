import { Vector2D, Tile, TextOperation, DrawingOperation, OperationType, UIElement } from '../../../internal.js';

class UIDrawer {
    constructor(spriteSheet, canvasDrawer) {
        this.spriteSheet = spriteSheet;
        this.canvasDrawer = canvasDrawer;
        this.uiElements = [];
    }

    AddUIElements(delta) {
        if (this.uiElements.length > 0) {
            for (let i = 0; i < this.uiElements.length; i++) {
                this.uiElements[i].AddOperations(delta);
            }

            let tempUIElements = this.uiElements;
            for (let i = 0; i < tempUIElements.length; i++) {
                if (tempUIElements[i].lifeTime <= 0) {
                    tempUIElements[i].RemoveUI();
                    tempUIElements.splice(i, 1);
                    i--;
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
                new Tile(
                    new Vector2D(position.x - 16, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(16, 32),
                    false,
                    'inputLeft'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['inputLeft'].canvas
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(32, 26),
                    false,
                    'inputMiddle'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['inputMiddle'].canvas,
                OperationType.gameObjects,
                new Vector2D(middleWidth, 26)
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x + middleWidth, position.y),
                    new Vector2D(0, 0),
                    new Vector2D(16, 32),
                    false,
                    'inputRight'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['inputRight'].canvas
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(sprite.x, sprite.y),
                    new Vector2D(sprite.width, sprite.height),
                    false,
                    this.canvasDrawer.GetAtlas(sprite.atlas).name
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.GetAtlas(sprite.atlas).canvas
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