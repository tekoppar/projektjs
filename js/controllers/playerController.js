import {
	Vector2D, Hoe, Shovel, Axe, MainCharacter, Weapon, Seed, Controller, CraftingRecipes,
	Camera, CanvasDrawer, Minimap, Pickaxe, Crafting, Item, Building, MovemementDirection,
	MovementType, EquipabbleItem, ItemStats, KeyEnum, InputHandler, InputEnum, InputSideEnum, MouseEnum
} from '../internal.js';

/**
 * @class
 * @constructor
 */
class PlayerController extends Controller {

	/**
	 * 
	 * @param {MainCharacter} player 
	 */
	constructor(player) {
		super();

		/** @type {MainCharacter} */ this.playerCharacter = player;
		/** @type {Crafting} */ this.crafting = new Crafting(undefined, 'Crafting', CraftingRecipes.CraftingRecipeList);
		/** @type {Building} */ this.building = new Building();
		/** @type {Camera} */ this.playerCamera = new Camera(this, new Vector2D(CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height));
		/** @type {Minimap} */ this.minimap = new Minimap(player);
		this.mouseToAtlasRectMap = {};
		/** @type {Vector2D} */ this.mousePosition = new Vector2D(0, 0);
		/** @type {boolean} */ this.drawPreviewCursor = false;

		let pos = this.playerCharacter.GetPosition().Clone();

		if (this?.playerCharacter?.BoxCollision !== undefined) {
			pos.x += this.playerCharacter.BoxCollision.size.x * 0.5;
			pos.y += this.playerCharacter.BoxCollision.size.y * 0.5;
		}
		this.playerCamera.SetCameraPosition(pos);

		InputHandler.GIH.AddListener(this, InputEnum.a);
		InputHandler.GIH.AddListener(this, InputEnum.w);
		InputHandler.GIH.AddListener(this, InputEnum.s);
		InputHandler.GIH.AddListener(this, InputEnum.d);
		InputHandler.GIH.AddListener(this, InputEnum.e);
		InputHandler.GIH.AddListener(this, InputEnum.shift, InputSideEnum.Left);
		InputHandler.GIH.AddListener(this, MouseEnum.leftMouse);
		InputHandler.GIH.AddListener(this, InputEnum.i);
		InputHandler.GIH.AddListener(this, InputEnum.tab);
		InputHandler.GIH.AddListener(this, InputEnum.k);
		InputHandler.GIH.AddListener(this, InputEnum.b);
		InputHandler.GIH.AddListener(this, InputEnum.c);
	}

	FixedUpdate() {
		super.FixedUpdate();
	}

	EndOfFrameUpdate() {
		super.EndOfFrameUpdate();
		let pos = this.playerCharacter.GetPosition().Clone();

		if (this?.playerCharacter?.BoxCollision !== undefined) {
			pos.x += this.playerCharacter.BoxCollision.size.x * 0.5;
			pos.y += this.playerCharacter.BoxCollision.size.y * 0.5;
		}
		this.playerCamera.SetCameraPosition(pos);
	}

	Delete() {
		super.Delete();
	}

	GameBegin() {
		super.GameBegin();
		this.playerCharacter.inventory.SetupInventory();
		this.playerCharacter.inventory.AddItem(new Shovel('shovel', 0));
		this.playerCharacter.inventory.AddItem(new Hoe('hoe', 0));
		this.playerCharacter.inventory.AddItem(new Axe('ironAxe', 0));
		this.playerCharacter.inventory.AddItem(new Pickaxe('pickaxe', 0));
		this.playerCharacter.inventory.AddItem(new Weapon('ironSword', 0));
		this.playerCharacter.inventory.AddItem(new Seed('cornSeed', 1));
		this.playerCharacter.inventory.AddItem(new Item('birchLog', 250));
		this.playerCharacter.inventory.AddItem(new Item('stonePiece', 25));
		this.playerCharacter.inventory.AddItem(new Item('coalLump', 25));
		this.playerCharacter.inventory.AddItem(new Item('iron', 25));
		/*this.playerCharacter.inventory.AddItem(new Item('tin', 25));
		this.playerCharacter.inventory.AddItem(new Item('copper', 25));
		this.playerCharacter.inventory.AddItem(new Item('silver', 25));
		this.playerCharacter.inventory.AddItem(new Item('gold', 25));
		this.playerCharacter.inventory.AddItem(new Item('bronze', 25));
		this.playerCharacter.inventory.AddItem(new Item('steel', 25));
		this.playerCharacter.inventory.AddItem(new Item('coal', 25));
		this.playerCharacter.inventory.AddItem(new Item('ironBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('tinBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('copperBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('silverBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('goldBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('bronzeBar', 25));
		this.playerCharacter.inventory.AddItem(new Item('steelBar', 25));*/
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.leatherArmor.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.leatherHood.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.leatherShoes.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.leatherSkirt.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.clothPantsGreen.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.chainArmorHood.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.chainArmorTorso.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorGloves.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorHelmet.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorPants.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorShoes.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorShoulders.atlas));
		this.playerCharacter.inventory.AddItem(new EquipabbleItem(ItemStats.plateArmorTorso.atlas));
		this.playerCharacter.inventory.AddMoney(5000);
		this.playerCharacter.controller = this;
		this.crafting.owner = this.playerCharacter;
		this.crafting.SetupCrafting();

		this.building.characterOwner = this.playerCharacter;
		this.building.SetupBuilding();

		//this.playerCharacter.SetActiveItem(this.playerCharacter.inventory.GetItem('ironAxe'));

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
				switch (data.eventType) {
					case 0:
						switch (key) {
							case KeyEnum.a: this.playerCharacter.UpdateDirection(MovemementDirection.x, 1); break;
							case KeyEnum.w: this.playerCharacter.UpdateDirection(MovemementDirection.y, 1); break;
							case KeyEnum.d: this.playerCharacter.UpdateDirection(MovemementDirection.x, -1); break;
							case KeyEnum.s: this.playerCharacter.UpdateDirection(MovemementDirection.y, -1); break;
							case KeyEnum.e:
								this.playerCharacter.Interact();
								break;
							case KeyEnum.shiftLeft: this.playerCharacter.SetMovement(MovementType.Running, -3); break;
							case KeyEnum.leftMouse:
								if (data.eventType === 0)
									this.playerCharacter.UseItem(data);
								break;
						}
						break;

					case 1:
						switch (key) {
							case KeyEnum.a: this.playerCharacter.UpdateDirection(MovemementDirection.x, 1); break;
							case KeyEnum.w: this.playerCharacter.UpdateDirection(MovemementDirection.y, 1); break;
							case KeyEnum.d: this.playerCharacter.UpdateDirection(MovemementDirection.x, -1); break;
							case KeyEnum.s: this.playerCharacter.UpdateDirection(MovemementDirection.y, -1); break;
							case KeyEnum.shiftLeft: this.playerCharacter.SetMovement(MovementType.Running, -3); break;
						}
						break;

					case 2:
						switch (key) {
							case KeyEnum.a:
							case KeyEnum.w:
							case KeyEnum.d:
							case KeyEnum.s: this.playerCharacter.StopMovement(); break;

							case KeyEnum.i:
							case KeyEnum.tab: this.playerCharacter.inventory.ShowInventory(); break;

							case KeyEnum.c:
								this.crafting.ShowCrafting();
								this.crafting.characterUser = this.playerCharacter;
								break;

							case KeyEnum.b:
								this.building.ShowBuilding();
								this.building.ShowRecipe();
								break;

							case KeyEnum.k: this.playerCharacter.characterAttributes.characterSheet.ShowCharacterSheet(); break;

							case KeyEnum.shiftLeft: this.playerCharacter.SetMovement(MovementType.Walking, -1); break;
						}
						break;

					case 3:
						switch (key) {
							case KeyEnum.a:
							case KeyEnum.w:
							case KeyEnum.d:
							case KeyEnum.s:
								this.playerCharacter.StopMovement();
								break;

							case KeyEnum.e: this.playerCharacter.StoppedInteracting(); break;

							case KeyEnum.shiftLeft: this.playerCharacter.SetMovement(MovementType.Walking, -1); break;
						}
						break;
				}
				break;
		}
	}

	/**
	 * 
	 * @param {boolean} state 
	 */
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

					CanvasDrawer.GCD.UpdateTilePreview(this.mousePosition.Clone());
				}
				break;
		}
	}
}

export { PlayerController };