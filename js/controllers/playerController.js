import { Vector2D, Hoe, Shovel, Axe, Weapon, Seed, Controller, Camera, CanvasDrawer, Minimap, Pickaxe, Crafting } from '../internal.js';

class PlayerController extends Controller {
    constructor(player) {
        super();
        this.playerCharacter = player;
        this.crafting = new Crafting();
        this.playerCamera = new Camera(this, new Vector2D(CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height));
        this.minimap = new Minimap(player);
        this.mouseToAtlasRectMap = {};
        this.mousePosition = new Vector2D(0, 0);
        this.drawPreviewCursor = false;
    }

    FixedUpdate() {
        this.playerCamera.SetCameraPosition(this.playerCharacter.GetPosition());
        super.FixedUpdate();
    }

    Delete() {
        super.Delete();
    }

    GameBegin() {
        super.GameBegin();
        this.playerCharacter.inventory.SetupInventory();
        this.playerCharacter.inventory.AddItem(new Shovel('shovel', 0));
        this.playerCharacter.inventory.AddItem(new Hoe('hoe', 0));
        this.playerCharacter.inventory.AddItem(new Axe('axe', 0));
        this.playerCharacter.inventory.AddItem(new Pickaxe('pickaxe', 0));
        this.playerCharacter.inventory.AddItem(new Weapon('sword', 0));
        this.playerCharacter.inventory.AddItem(new Seed('cornSeed', 1));
        this.playerCharacter.inventory.AddMoney(5000);
        this.playerCharacter.controller = this;
        this.crafting.characterOwner = this.playerCharacter;
        this.crafting.SetupCrafting();

        this.playerCharacter.SetActiveItem(this.playerCharacter.inventory.GetItem('sword'));

        window.addEventListener('mousemove', this);
    }

    MouseToScreen(event) {
        let rect;
        if (this.mouseToAtlasRectMap[event.target.id] === undefined) {
            rect = event.target.getBoundingClientRect();
            if (event.target.id !== undefined)
                this.mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
        }
        else if (event.target.id !== undefined) {
            rect = { x: this.mouseToAtlasRectMap[event.target.id].x, y: this.mouseToAtlasRectMap[event.target.id].y };
            rect.x -= window.scrollX;
            rect.y -= window.scrollY;
        }
        return new Vector2D(event.x - rect.x, event.y - rect.y);
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data.eventType == 0) {
                    switch (key) {
                        case 'a': this.playerCharacter.UpdateDirection('x', 1); break;
                        case 'w': this.playerCharacter.UpdateDirection('y', 1); break;
                        case 'd': this.playerCharacter.UpdateDirection('x', -1); break;
                        case 's': this.playerCharacter.UpdateDirection('y', -1); break;
                        case 'leftShift': this.playerCharacter.SetMovement('running', -3); break;
                        case 'leftMouse':
                            if (data.eventType === 0)
                                this.playerCharacter.UseItem(data);
                            break;
                    }
                }
                if (data.eventType == 1) {
                    switch (key) {
                        case 'a': this.playerCharacter.UpdateDirection('x', 1); break;
                        case 'w': this.playerCharacter.UpdateDirection('y', 1); break;
                        case 'd': this.playerCharacter.UpdateDirection('x', -1); break;
                        case 's': this.playerCharacter.UpdateDirection('y', -1); break;
                        case 'leftShift': this.playerCharacter.SetMovement('running', -3); break;
                    }
                } else if (data.eventType == 2 || data.eventType == 3) {
                    switch (key) {
                        case 'a':
                        case 'w':
                        case 'd':
                        case 's':
                            this.playerCharacter.StopMovement();
                            break;

                        case 'e':
                            if (data.eventType == 3) {
                                this.playerCharacter.Interact();
                            }
                            break;

                        case 'leftShift': this.playerCharacter.SetMovement('walking', -1); break;
                    }
                }
                break;
        }
    }

    TogglePreviewCursor(state) {
        this.drawPreviewCursor = state;
        CanvasDrawer.GCD.drawTileCursorPreview = state;

        if (state === false) {
            CanvasDrawer.GCD.AddClearOperation(CanvasDrawer.GCD.tileCursorPreview.drawingCanvas, CanvasDrawer.GCD.tileCursorPreview.GetBoundingBox());
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousemove':
                if (e.target.getBoundingClientRect !== undefined) {
                    let objPos = this.MouseToScreen(e);
                    this.mousePosition.x = objPos.x;
                    this.mousePosition.y = objPos.y;

                    let temp = this.playerCharacter.BoxCollision.GetCenterPosition();
                    temp.SnapToGridF(32);

                    CanvasDrawer.GCD.UpdateTilePreview(temp, this.mousePosition.Clone());
                }
                break;
        }
    }
}

export { PlayerController };