import { Vector2D, CanvasDrawer, CollisionEditor, PawnSetupParams, TileMaker, Tile, TileType, TileTerrain, EditorState, Cobject, Tree, MasterObject, InputHandler, CollisionHandler, BoxCollision, PolygonCollision, CMath, PathOperation, ObjectClassLUT, Props, CanvasUtility, AtlasController } from '../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class PropEditor extends Cobject {
    static GPEditor = new PropEditor();

    constructor() {
        super();
        this.editorState = EditorState.Closed;
        this.container;
        this.gridHTML;
        this.SetupHTML();
        this.gridSize = new Vector2D(32, 32);
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
        this.editorState = EditorState.Open;
        this.UpdateHTMLEvents();

        let keys = Object.keys(PawnSetupParams);//TileMaker.CustomTiles);
        this.gridHTML.innerHTML = '';

        for (let i = 0, l = keys.length; i < l; ++i) {
            let setupParams = PawnSetupParams[keys[i]];
            if (AtlasController.GetAtlas(setupParams[3]) !== undefined) {
                let atlas = AtlasController.GetAtlas(setupParams[3]);
                let newImage;

                if (setupParams[2] === undefined || setupParams[2].start === undefined) {
                    newImage = new Image(atlas.width, atlas.height);
                    newImage.src = atlas.GetCanvas().toDataURL('image/png');
                } else {
                    newImage = CanvasUtility.CanvasPortionToImage(setupParams[2].start.x * setupParams[2].w, setupParams[2].start.y * setupParams[2].h, setupParams[2].w, setupParams[2].h, atlas);
                }

                newImage.dataset.atlasName = atlas.GetCanvas().id;
                newImage.dataset.propName = keys[i];
                this.gridHTML.appendChild(newImage);
            }
        }
    }

    HideProps() {
        this.editorState = EditorState.Closed;
        this.UpdateHTMLEvents();

        this.selectedProp.classList.remove('prop-editor-grid-selected');
        this.selectedProp = undefined;
        CanvasDrawer.GCD.SetSelection(undefined);
    }

    UpdateHTMLEvents() {
        switch (this.editorState) {
            case EditorState.Closed:
                this.gridHTML.removeEventListener('mousemove', this);
                this.gridHTML.removeEventListener('mousedown', this);
                this.gridHTML.removeEventListener('mouseup', this);
                this.container.removeEventListener('click', this);
                this.container.style.visibility = 'collapse';
                break;

            case EditorState.Open:
                this.gridHTML.addEventListener('mousemove', this);
                this.gridHTML.addEventListener('mousedown', this);
                this.gridHTML.addEventListener('mouseup', this);
                this.container.addEventListener('click', this);
                this.container.style.visibility = 'visible';
                break;
        }
    }

    CreateNewObject() {
        if (ObjectClassLUT[this.selectedProp.dataset.propName] !== undefined) {
            let params = PawnSetupParams[this.selectedProp.dataset.propName];
            params = JSON.parse(JSON.stringify(params));
            let pos = MasterObject.MO.playerController.mousePosition.Clone();
            pos.x += params[1][0];
            params[1] = pos;
            let newObject = new ObjectClassLUT[this.selectedProp.dataset.propName].constructor(...params);
            Props.push(newObject);
            newObject.GameBegin();
        }
    }

    CEvent(eventType, key, data) {
        if (this.editorState === EditorState.Closed)
            return;

        switch (eventType) {
            case 'input':
                if (key === 'leftMouse' && data.eventType === 2 && this.selectedProp === undefined) {
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

                            this.selectedPropDrawingOperation = new PathOperation(this.selectedProp.BoxCollision.GetPoints(), CanvasDrawer.GCD.DebugDrawer.gameDebugCanvas, 'white', false, 0, 5, 0.3);
                            CanvasDrawer.GCD.AddPathObjectOperation(this.selectedPropDrawingOperation);

                            let propInfo = CMath.GeneratePropertyTree(this.selectedProp);

                            //document.body.appendChild(propInfo);
                            //propInfo.addEventListener('click', this);
                        }
                    }
                } else if (key === 'leftMouse' && data.eventType === 2 && this.selectedProp !== undefined) {
                    this.CreateNewObject();
                }

                if (key === 'rightMouse' && data.eventType === 2 && this.selectedProp !== undefined) {
                    this.selectedProp.classList.remove('prop-editor-grid-selected');
                    this.selectedProp = undefined;
                    CanvasDrawer.GCD.SetSelection(undefined);
                }
                break;
        }
    }

    SetSelectedProp(propName) {
        let setupParams = PawnSetupParams[propName];

        if (AtlasController.GetAtlasObject(setupParams[3]) !== undefined) {
            AtlasController.GetAtlasObject(setupParams[3]).SetSelection(MasterObject.MO.playerController.playerCharacter.position.Clone());
        } else {
            CanvasDrawer.GCD.SetSelection(
                new Tile(
                    MasterObject.MO.playerController.playerCharacter.position.Clone(),
                    new Vector2D(setupParams[2].start.x, setupParams[2].start.y),
                    new Vector2D(setupParams[2].w, setupParams[2].h),
                    false,
                    AtlasController.GetAtlas(setupParams[3]).name,
                    0,
                    TileType.Prop,
                    TileTerrain.Ground
                )
            );
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.id === 'prop-editor-copy') {
                    if (this.selectedProp !== undefined && this.selectedProp.dataset.atlasName !== undefined && AtlasController.GetAtlas(this.selectedProp.dataset.atlasName) !== undefined) {
                        let newTree = new Tree(this.selectedProp.dataset.propName, MasterObject.MO.playerController.playerCharacter.position.Clone(), undefined, this.selectedProp.dataset.atlasName);
                        newTree.GameBegin();
                    }
                }
                else if (e.target.id === 'prop-editor-collision') {
                    if (CanvasDrawer.GCD.selectedSprite !== undefined)
                        CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite);
                }
                else if (e.target.id === 'prop-editor-close') {
                    this.HideProps();
                } else if (e.target.dataset.atlasName !== undefined && AtlasController.GetAtlas(e.target.dataset.atlasName) !== undefined) {
                    if (this.selectedProp !== undefined)
                        this.selectedProp.classList.remove('prop-editor-grid-selected');

                    this.selectedProp = e.target;
                    this.selectedProp.classList.add('prop-editor-grid-selected');

                    this.SetSelectedProp(e.target.dataset.propName);
                } else if (e.target.classList.contains('caret') === true) {
                    e.target.parentElement.querySelector(".tree-nested").classList.toggle("tree-active");
                    e.target.classList.toggle("caret-down");
                }
                break;

        }
    }
}

export { PropEditor };