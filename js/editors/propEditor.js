import { Vector2D, CanvasDrawer, CollisionEditor, TileMaker, Cobject, Tree, MasterObject, correctMouse, InputHandler, CollisionHandler, BoxCollision, PolygonCollision, CMath, PathOperation } from '../internal.js';

class PropEditor extends Cobject {
    static GPEditor = new PropEditor();

    constructor() {
        super();
        this.container;
        this.gridHTML;
        this.sprite;
        this.SetupHTML();
        this.gridSize = 32;
        this.isDrawing = false;
        this.collisionPositions = [];
        this.positionMap = {};
        this.copyProp;

        this.selectedProp;
        this.selectedPropDrawingOperation = undefined;
        this.overlapCollision = undefined;
    }

    GameBegin() {
        super.GameBegin();
        this.SetupHTML();

        InputHandler.GIH.AddListener(this);
        this.overlapCollision = new BoxCollision(new Vector2D(0, 0), new Vector2D(32, 32), false, this, false);
    }

    SetupHTML() {
        if (document.getElementById('prop-editor-grid') === undefined || document.getElementById('prop-editor-grid') === null) {
            window.requestAnimationFrame(() => this.SetupHTML());
            return;
        }

        this.container = document.getElementById('prop-editor');
        this.gridHTML = document.getElementById('prop-editor-grid');
        this.copyProp = document.getElementById('prop-editor-copy')

        this.gridHTML.addEventListener('mousemove', this);
        this.gridHTML.addEventListener('mousedown', this);
        this.gridHTML.addEventListener('mouseup', this);
        this.container.addEventListener('click', this);
    }

    LogPoints() {
        let string = '[';
        for (let position of this.collisionPositions) {
            if (position !== null && position !== undefined) {
                string += 'new Vector2D(' + position.x / this.gridSize.x + ', ' + position.y / this.gridSize.y + '), ';
            }
        }
        string += ']';

        navigator.clipboard.writeText(string);
    }

    ShowProps() {
        let keys = Object.keys(TileMaker.CustomTiles);

        this.gridHTML.innerHTML = '';

        for (let i = 0; i < keys.length; i++) {
            if (CanvasDrawer.GCD.canvasAtlases[keys[i]] !== undefined) {
                let newImage = new Image(CanvasDrawer.GCD.canvasAtlases[keys[i]].width, CanvasDrawer.GCD.canvasAtlases[keys[i]].height);
                newImage.src = CanvasDrawer.GCD.canvasAtlases[keys[i]].canvas.toDataURL('image/png');
                newImage.dataset.atlasName = CanvasDrawer.GCD.canvasAtlases[keys[i]].canvas.id;
                newImage.dataset.propName = keys[i];
                this.gridHTML.appendChild(newImage);
            }
        }

        this.container.style.visibility = 'visible';
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (key === 'leftMouse' && data.eventType === 2) {
                    this.overlapCollision.position.x = MasterObject.MO.playerController.mousePosition.x;
                    this.overlapCollision.position.y = MasterObject.MO.playerController.mousePosition.y;

                    let overlaps = CollisionHandler.GCH.GetOverlaps(this.overlapCollision);

                    if (overlaps.length > 0 && overlaps[0].collisionOwner !== undefined) {
                        this.selectedProp = overlaps[0].collisionOwner;

                        if (this.selectedProp.BoxCollision instanceof PolygonCollision) {
                            if (this.selectedPropDrawingOperation !== undefined) {
                                this.selectedPropDrawingOperation.Delete();
                                this.selectedPropDrawingOperation = undefined;
                            }

                            this.selectedPropDrawingOperation = new PathOperation(this.selectedProp.BoxCollision.GetPoints(), CanvasDrawer.GCD.gameDebugCanvas, 'white', false, 0, 5, 0.3);
                            CanvasDrawer.GCD.AddPathOperation(this.selectedPropDrawingOperation);

                            let propInfo = CMath.GeneratePropertyTree(this.selectedProp);

                            document.body.appendChild(propInfo);
                            propInfo.addEventListener('click', this);
                        }
                    }
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.id === 'prop-editor-copy') {
                    if (this.selectedProp !== undefined && this.selectedProp.dataset.atlasName !== undefined && CanvasDrawer.GCD.canvasAtlases[this.selectedProp.dataset.atlasName] !== undefined) {
                        let newTree = new Tree(this.selectedProp.dataset.propName, MasterObject.MO.playerController.playerCharacter.position.Clone(), undefined, this.selectedProp.dataset.atlasName);
                        newTree.GameBegin();
                    }
                }
                else if (e.target.id === 'prop-editor-collision') {
                    if (CanvasDrawer.GCD.selectedSprite !== undefined)
                        CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite);
                }
                else if (e.target.id === 'prop-editor-close') {
                    this.container.style.visibility = 'collapse';
                } else if (e.target.dataset.atlasName !== undefined && CanvasDrawer.GCD.canvasAtlases[e.target.dataset.atlasName] !== undefined) {
                    if (this.selectedProp !== undefined)
                        this.selectedProp.classList.remove('prop-editor-grid-selected');

                    this.selectedProp = e.target;
                    this.selectedProp.classList.add('prop-editor-grid-selected');

                    CanvasDrawer.GCD.canvasAtlases[e.target.dataset.atlasName].SetSelection(MasterObject.MO.playerController.playerCharacter.position.Clone());
                } else if (e.target.classList.contains('caret') === true) {
                    e.target.parentElement.querySelector(".tree-nested").classList.toggle("tree-active");
                    e.target.classList.toggle("caret-down");
                }
                break;

        }
    }
}

export { PropEditor };