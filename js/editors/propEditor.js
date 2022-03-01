import {
	Vector2D, CanvasDrawer, CollisionEditor, PawnSetupParams, TileMaker, Tile,
	TileType, TileTerrain, EditorState, Cobject, Tree, MasterObject, InputHandler,
	CollisionHandler, BoxCollision, PolygonCollision, PathOperation, GameObject,
	AtlasController, AllCollisions, TileMakerEditor, CollisionTypeCheck, Pawn,
	AllBlockingCollisions, PawnSetupController, AllAnimationsList, StringUtility,
	KeyEnum, MouseEnum, InputEnum, InputSideEnum
} from '../internal.js';

/**
 * @readonly
 * @enum {number}
 */
const PropEditorSelectionState = {
	None: 0,
	PropSelected: 1,
	PropMoving: 2
}

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class PropEditor extends Cobject {
	/** @type {PropEditor} */ static GPEditor = new PropEditor();

	constructor() {
		super();

		/** @type {EditorState} */ this.editorState = EditorState.Closed;
		/** @type {HTMLDivElement} */ this.container;
		/** @type {HTMLDivElement} */ this.gridHTML;
		/** @type {Vector2D} */ this.gridSize = new Vector2D(32, 32);
		/** @type {boolean} */ this.isDrawing = false;
		/** @type {HTMLButtonElement} */ this.openCloseButton;
		/** @type {Pawn} */ this.selectedProp;
		/** @type {HTMLImageElement} */ this.selectedPropHTML;
		/** @type {PathOperation} */ this.selectedPropDrawingOperation = undefined;
		/** @type {BoxCollision} */ this.overlapCollision = undefined;
		/** @type {boolean} */ this.gridAlign = false;
		/** @type {PropEditorSelectionState} */ this.selectionState = PropEditorSelectionState.None;
		/** @type {HTMLButtonElement} */ this.openButtonProp;

		this.SetupHTML();
	}

	GameBegin() {
		super.GameBegin();
		this.SetupHTML();

		InputHandler.GIH.AddListener(this, MouseEnum.leftMouse);
		InputHandler.GIH.AddListener(this, MouseEnum.rightMouse);
		InputHandler.GIH.AddListener(this, InputEnum.shift, InputSideEnum.Left);
		this.overlapCollision = new BoxCollision(new Vector2D(0, 0), new Vector2D(4, 4), false, this, false);
	}

	FixedUpdate() {
		super.FixedUpdate();

		if (this.selectedPropHTML !== undefined)
			this.UpdateSpritePreview(this.selectedPropHTML.dataset.propName);

		if (this.selectedProp !== undefined && this.selectionState === PropEditorSelectionState.PropMoving) {
			let tMousePos = MasterObject.MO.playerController.mousePosition.Clone();
			tMousePos.Add(CanvasDrawer.GCD.canvasOffset);

			if (this.gridAlign) {
				tMousePos.SnapToGridF(32);
				tMousePos.x += 16;
				tMousePos.y += 32;
			}

			this.selectedProp.SetPosition(tMousePos);
			this.selectedPropDrawingOperation.Update(this.selectedProp.GetPosition());
		}
	}

	SetupHTML() {
		if (document.getElementById('prop-editor-grid') === undefined || document.getElementById('prop-editor-grid') === null) {
			window.requestAnimationFrame(() => this.SetupHTML());
			return;
		}

		this.container = /** @type {HTMLDivElement} */ (document.getElementById('prop-editor'));
		document.getElementById('container-controls-fixed').children[1].appendChild(this.container);
		this.gridHTML = /** @type {HTMLDivElement} */ (document.getElementById('prop-editor-grid'));
		this.openCloseButton = /** @type {HTMLButtonElement} */ (document.getElementById('prop-editor-open'));
		this.openCloseButton.addEventListener('click', this);

		this.openButtonProp = /** @type {HTMLButtonElement} */ (document.getElementById('prop-editor-tilemaker-editor'));
		this.openButtonProp.addEventListener('click', this);
	}

	ShowProps() {
		this.editorState = EditorState.Open;
		this.UpdateHTMLEvents();

		let keys = Object.keys(PawnSetupParams);//TileMaker.CustomTiles);
		this.gridHTML.innerHTML = '';

		for (let i = 0, l = keys.length; i < l; ++i) {
			let image = PawnSetupController.GetNewImage(keys[i]);

			if (image !== undefined)
				this.gridHTML.appendChild(image);
		}
	}

	HideProps() {
		this.editorState = EditorState.Closed;
		this.UpdateHTMLEvents();

		if (this.selectedPropHTML !== undefined)
			this.selectedPropHTML.classList.remove('prop-editor-grid-selected');

		this.selectedPropHTML = undefined;
		CanvasDrawer.GCD.SetSelection(undefined);
	}

	UpdateHTMLEvents() {
		switch (this.editorState) {
			case EditorState.Closed:
				this.gridHTML.removeEventListener('mousemove', this);
				this.gridHTML.removeEventListener('mousedown', this);
				this.gridHTML.removeEventListener('mouseup', this);
				this.container.removeEventListener('click', this);
				this.container.removeEventListener('input', this);
				this.container.style.visibility = 'collapse';
				break;

			case EditorState.Open:
				this.gridHTML.addEventListener('mousemove', this);
				this.gridHTML.addEventListener('mousedown', this);
				this.gridHTML.addEventListener('mouseup', this);
				this.container.addEventListener('click', this);
				this.container.addEventListener('input', this);
				this.container.style.visibility = 'visible';
				break;
		}
	}

	/**
	 * 
	 * @param {string} propName 
	 */
	UpdateSpritePreview(propName) {
		let params = PawnSetupParams[propName];
		let pos = MasterObject.MO.playerController.mousePosition.Clone();

		if (Array.isArray(params) === false) {
			params = params[propName];
		}

		//pos.Sub(CanvasDrawer.GCD.canvasOffset);
		pos.x += params[1][0];

		if (this.gridAlign)
			pos.SnapToGridF(32);

		if (AtlasController.GetAtlasObject(params[3]) !== undefined && AllCollisions[params[3]] !== undefined) {
			let collisionBB = PolygonCollision.CalculateBoundingBox(AllCollisions[params[3]]);
			let atlasOffset = collisionBB.GetCenterPoint();
			pos.Sub(new Vector2D(atlasOffset.x, atlasOffset.y * 2));

			CanvasDrawer.GCD.UpdateSpritePreview(pos);
		} else if (params[2] !== undefined) {
			pos.x = pos.x - params[2].w / 2;
			pos.y = pos.y - params[2].h;
			CanvasDrawer.GCD.UpdateSpritePreview(pos);
		}
	}

	SetSelectionData() {
		const inputName = /** @type {HTMLInputElement} */ (document.getElementById('prop-editor-selected-prop-name'));
		if (inputName !== null) {
			inputName.value = this.selectedProp.name;
		}

		const inputX = /** @type {HTMLInputElement} */ (document.getElementById('prop-editor-selected-prop-positionx'));
		if (inputX !== null) {
			inputX.value = this.selectedProp.position.x.toString();
		}

		const inputY = /** @type {HTMLInputElement} */ (document.getElementById('prop-editor-selected-prop-positiony'));
		if (inputY !== null) {
			inputY.value = this.selectedProp.position.y.toString();
		}

		const customData = /** @type {HTMLDivElement} */ (document.getElementById('prop-editor-selected-prop-custom-data'));
		if (customData !== null) {
			/*let objectEntries = Object.entries(this.selectedProp);

			let customDataString = '';
			for (let i = 0, l = objectEntries.length; i < l; ++i) {
				if (objectEntries[i] !== undefined && objectEntries[i][1]?.ToString !== undefined) {
					customDataString += objectEntries[i][0] + ': ' + objectEntries[i][1].ToString() + '\r\n';
				} else
					customDataString += objectEntries[i][0] + ': ' + objectEntries[i][1] + '\r\n';
			}*/

			customData.innerText = StringUtility.ObjectToString(this.selectedProp);  // customDataString;
		}
	}

	/**
	 * 
	 * @param {string} propName 
	 */
	SetSelectedProp(propName) {
		let setupParams = PawnSetupParams[propName];

		if (AtlasController.GetAtlasObject(setupParams[3]) !== undefined) {
			AtlasController.GetAtlasObject(setupParams[3]).SetSelection(MasterObject.MO.playerController.playerCharacter.position.Clone());
		} else if (AtlasController.GetAtlasObject(propName + PawnSetupController._AtlasObjectSuffix) !== undefined) {
			AtlasController.GetAtlasObject(propName + PawnSetupController._AtlasObjectSuffix).SetSelection(MasterObject.MO.playerController.playerCharacter.position.Clone());
		} else if (AllAnimationsList.propAnimations[propName]?.idle !== undefined) {
			const propAnimation = AllAnimationsList.propAnimations[propName].idle;
			CanvasDrawer.GCD.SetSelection(
				new Tile(
					MasterObject.MO.playerController.playerCharacter.position.Clone(),
					new Vector2D(propAnimation.start.x, propAnimation.start.y),
					new Vector2D(propAnimation.w, propAnimation.h),
					false,
					AtlasController.GetAtlas(setupParams[3]).name,
					0,
					TileType.Prop,
					TileTerrain.Ground
				)
			);
		}
	}

	CEvent(eventType, key, data) {
		if (this.editorState === EditorState.Closed)
			return;

		switch (eventType) {
			case 'input':
				if (key === KeyEnum.leftMouse) {
					if (data.eventType === 0 && this.selectedProp !== undefined && this.selectionState === PropEditorSelectionState.PropSelected)
						this.selectionState = PropEditorSelectionState.PropMoving;

					if (data.eventType === 0 && this.selectedPropHTML === undefined) {
						this.overlapCollision.position.x = MasterObject.MO.playerController.mousePosition.x;
						this.overlapCollision.position.y = MasterObject.MO.playerController.mousePosition.y;
						this.overlapCollision.position.Add(CanvasDrawer.GCD.canvasOffset);
						this.overlapCollision.CalculateBoundingBox();

						let propClicked = undefined;
						let overlaps = CollisionHandler.GCH.GetOverlapsByClass(this.overlapCollision, GameObject, CollisionTypeCheck.Overlap, CollisionTypeCheck.Overlap);
						if (overlaps.length > 0 && overlaps[0].collisionOwner !== undefined) {
							if (overlaps[0].collisionOwner.GetParent() === undefined)
								propClicked = overlaps[0].collisionOwner;
							else
								propClicked = overlaps[0].collisionOwner.GetParent();
						}

						if (propClicked !== undefined) {
							if (this.selectedProp !== undefined && this.selectedProp === propClicked)
								return;

							this.selectedProp = propClicked;
							if (this.selectedPropDrawingOperation !== undefined) {
								this.selectedPropDrawingOperation.Delete();
								this.selectedPropDrawingOperation = undefined;
							}

							switch (this.selectedProp.BoxCollision.constructor) {
								case PolygonCollision:
									this.selectedPropDrawingOperation = new PathOperation(this.selectedProp.BoxCollision.GetPoints(), CanvasDrawer.GCD.DebugDrawer.gameDebugCanvas, 'white', false, 0, 5, false, 0.3);
									CanvasDrawer.GCD.AddPathObjectOperation(this.selectedPropDrawingOperation);
									this.selectionState = PropEditorSelectionState.PropSelected;
									break;

								case BoxCollision:
									this.selectedPropDrawingOperation = new PathOperation(this.selectedProp.BoxCollision.boundingBox.GetCornersVector2D(), CanvasDrawer.GCD.DebugDrawer.gameDebugCanvas, 'white', false, 0, 5, false, 0.3);
									CanvasDrawer.GCD.AddPathObjectOperation(this.selectedPropDrawingOperation);
									this.selectionState = PropEditorSelectionState.PropSelected;
									break;
							}
							this.SetSelectionData();
						} else {
							this.selectedProp = undefined;
							this.selectionState = PropEditorSelectionState.None;
							if (this.selectedPropDrawingOperation !== undefined) {
								this.selectedPropDrawingOperation.Delete();
								this.selectedPropDrawingOperation = undefined;
							}
						}
					}

					if (data.eventType === 2 && this.selectedPropHTML !== undefined && this.selectedProp === undefined && this.selectedPropHTML.dataset.propName !== undefined)
						PawnSetupController.CreateNewObject(this.selectedPropHTML.dataset.propName, this.gridAlign);
					if (data.eventType === 2 && this.selectedProp !== undefined)
						this.selectionState = PropEditorSelectionState.PropSelected;
				}

				if (key === KeyEnum.shiftLeft && data.eventType === 0) {
					this.gridAlign = true;
				}
				if (key === KeyEnum.shiftLeft && data.eventType === 2) {
					this.gridAlign = false;
				}

				if (key === KeyEnum.rightMouse && data.eventType === 2) {
					if (this.selectedPropHTML !== undefined) {
						if (this.selectedPropHTML.classList !== undefined && this.selectedPropHTML.classList.contains('prop-editor-grid-selected'))
							this.selectedPropHTML.classList.remove('prop-editor-grid-selected');
						this.selectedPropHTML = undefined;
						CanvasDrawer.GCD.SetSelection(undefined);
					}

					if (this.selectedProp !== undefined) {
						this.selectedProp = undefined;
						this.selectionState = PropEditorSelectionState.None;
						if (this.selectedPropDrawingOperation !== undefined) {
							this.selectedPropDrawingOperation.Delete();
							this.selectedPropDrawingOperation = undefined;
						}
					}
				}
				break;
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				switch (e.target.id) {
					case 'prop-editor-copy':
						if (this.selectedPropHTML !== undefined && this.selectedPropHTML.dataset.atlasName !== undefined && AtlasController.GetAtlas(this.selectedPropHTML.dataset.atlasName) !== undefined) {
							let newTree = new Tree(this.selectedPropHTML.dataset.propName, MasterObject.MO.playerController.playerCharacter.position.Clone(), undefined, this.selectedPropHTML.dataset.atlasName);
							newTree.GameBegin();
						}
						break;

					case 'prop-editor-collision':
						if (CanvasDrawer.GCD.selectedSprite !== undefined && CanvasDrawer.GCD.selectedSprite instanceof Tile && this.selectedPropHTML !== undefined) {
							if (AllCollisions[this.selectedPropHTML.dataset.propName] !== undefined || AllBlockingCollisions[this.selectedPropHTML.dataset.propName]) {
								CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite, this.selectedPropHTML.dataset.propName);
							} else
								CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite);

							this.selectedPropHTML.classList.remove('prop-editor-grid-selected');
							this.selectedPropHTML = undefined;
						}
						break;

					case 'prop-editor-open':
						this.ShowProps();
						break;

					case 'prop-editor-tilemaker-editor':
						if (this.selectedPropHTML !== undefined && TileMaker.CustomTiles[this.selectedPropHTML.dataset.atlasName] !== undefined) {
							TileMakerEditor._Instance.Open();
							TileMakerEditor._Instance.SetTiles(this.selectedPropHTML.dataset.atlasName, TileMaker.CustomTiles[this.selectedPropHTML.dataset.atlasName].tiles, TileMaker.CustomTiles[this.selectedPropHTML.dataset.atlasName].tileLayout);
							this.selectedPropHTML = undefined;
						}
						break;
				}

				if (e.target.dataset.atlasName !== undefined && AtlasController.GetAtlas(e.target.dataset.atlasName) !== undefined) {
					if (this.selectedPropHTML !== undefined)
						this.selectedPropHTML.classList.remove('prop-editor-grid-selected');

					this.selectedPropHTML = e.target;
					this.selectedPropHTML.classList.add('prop-editor-grid-selected');

					this.SetSelectedProp(e.target.dataset.propName);
				} else if (e.target.classList.contains('caret') === true) {
					e.target.parentElement.querySelector(".tree-nested").classList.toggle("tree-active");
					e.target.classList.toggle("caret-down");
				}
				break;

			case 'input':
				switch (e.target.id) {
					case 'prop-editor-selected-prop-positionx':
						if (this.selectedProp !== undefined) {
							this.selectedProp.SetPosition(new Vector2D(e.target.value, this.selectedProp.position.y));
							this.selectedPropDrawingOperation.Update(this.selectedProp.GetPosition());
						}
						break;
					case 'prop-editor-selected-prop-positiony':
						if (this.selectedProp !== undefined) {
							this.selectedProp.SetPosition(new Vector2D(this.selectedProp.position.x, e.target.value));
							this.selectedPropDrawingOperation.Update(this.selectedProp.GetPosition());
						}
						break;
				}
				break;
		}
	}
}

export { PropEditor };