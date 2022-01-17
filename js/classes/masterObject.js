import {
	ObjectsHasBeenInitialized, LightSystem, Rectangle, DrawingOperation, CAnimation, Mastertime,
	AllAnimationsList, ToggleObjectsHasBeenInitialized, CollisionHandler, CustomEventHandler, Character,
	Plant, MainCharacter, InputHandler, Vector2D, CanvasDrawer, CanvasSprite, PawnSetupController,
	Cobject, TileData, Seed, Shop, TileMaker, CollisionEditor, PlayerController, AtlasController, TileMakerEditor,
	BehaviourController, BehaviorTree, BehaviorActionMovement, BehaviorActionCharacter, BehaviorConditionDistance,
	BehaviorConditionAvoidClass, BehaviorActionMoveAway, BehaviorActionModifySpeed, NavigationSystem
} from '../internal.js';
import { GenerateCustomSheets } from '../drawers/tiles/TileMakerCustomSheets/tileMakerCustomSheetsImports.js';

function GlobalLoop() {
	MasterObject.MO.GameLoop();
}

/**
 * @class
 * @constructor
 */
class MasterObject {
	static MO = new MasterObject();

	constructor() {
		this.gameHasBegun = false;
		Mastertime.Next();
		this.classInitialization = {
			CanvasDrawer: false,
			Vector2D: false,
			CanvasSprite: false,
			DrawingOperation: false,
			CAnimation: false,
			InputHandler: false,
			CustomEventHandler: false,
		};
		this.classesHasBeenInitialized = false;
		this.frameStepping = false;
		this.playerController;

		MasterObject.LogicTests();

		const framestemEnable = document.getElementById('framestep-enable');
		if (framestemEnable !== null)
			framestemEnable.addEventListener('mouseup', this);

		const framestemNext = document.getElementById('framestep-next');
		if (framestemNext !== null)
			framestemNext.addEventListener('mouseup', this);

		window.addEventListener('resize', this);
	}

	CheckIfClassesInitialized() {
		let keys = Object.keys(this.classInitialization);

		if (keys.length === 0) {
			this.classesHasBeenInitialized = true;
			return;
		}

		if (typeof CanvasDrawer !== undefined)
			delete this.classInitialization.CanvasDrawer;

		if (typeof Vector2D !== undefined)
			delete this.classInitialization.Vector2D;

		if (typeof CanvasSprite !== undefined)
			delete this.classInitialization.CanvasSprite;

		if (typeof DrawingOperation !== undefined)
			delete this.classInitialization.DrawingOperation;

		if (typeof CAnimation !== undefined)
			delete this.classInitialization.CAnimation;

		if (typeof InputHandler !== undefined)
			delete this.classInitialization.InputHandler;

		if (typeof CustomEventHandler !== undefined)
			delete this.classInitialization.CustomEventHandler;
	}

	GameStart() {
		this.CheckIfClassesInitialized();

		if (this.classesHasBeenInitialized === true && ObjectsHasBeenInitialized === false) {
			TileData.tileData.CreateTileLUTEditor();
			CollisionEditor.GCEditor = new CollisionEditor();
			TileMaker.GenerateCustomTiles();

			GenerateCustomSheets();

			ToggleObjectsHasBeenInitialized(true);
		}

		if (ObjectsHasBeenInitialized === true && (AtlasController._Instance.isLoadingFinished == null || AtlasController._Instance.isLoadingFinished === true)) {
			this.playerController = new PlayerController(new MainCharacter('femaleLight', 'mainP', new Vector2D(534, 570), AllAnimationsList.femaleAnimations));
			this.playerController.playerCharacter.AddAttachment('redHair');
			this.playerController.playerCharacter.AddAttachment('underDress');
			InputHandler.GIH.AddListener(this.playerController);

			window.requestAnimationFrame(() => this.GameBegin());
		} else {
			Mastertime.Next();
			window.requestAnimationFrame(() => this.GameStart());
		}

		CanvasDrawer.GCD.CheckIfFinishedLoading();
	}

	static LogicTests() {
		Rectangle.InsideRectTest();
	}

	GameBegin() {
		if (this.gameHasBegun === false) {
			CanvasDrawer.GCD.GameBegin();
			InputHandler.GIH.AddListener(CanvasDrawer.GCD);
			LightSystem.SkyLight.Update();
			new TileMakerEditor();

			for (let i = 0; i < AllPlants.length; ++i) {
				CustomEventHandler.AddListener(AllPlants[i]);
			}

			this.gameHasBegun = true;

			for (const key in Cobject.AllCobjects) {
				Cobject.AllCobjects[key].GameBegin();
			}

			PawnSetupController.LoadSavedObjects();
		}

		var duckController = new BehaviourController(duck, new BehaviorTree(
			[
				new BehaviorActionMovement(
					duck,
					[
						new BehaviorConditionDistance(50, true),
					],
					new BehaviorActionCharacter(MasterObject.MO.playerController.playerCharacter)
				),
				new BehaviorActionModifySpeed(
					duck,
					[
						new BehaviorConditionDistance(150, true),
					],
					new BehaviorActionCharacter(MasterObject.MO.playerController.playerCharacter),
					-1,
					-2
				)
			]
		));

		var duckController1 = new BehaviourController(duck1, new BehaviorTree(
			[
				new BehaviorActionMoveAway(
					duck1,
					[
						new BehaviorConditionAvoidClass(MainCharacter, 125),
					],
					new BehaviorActionCharacter(undefined)
				),
				new BehaviorActionModifySpeed(
					duck1,
					[
						new BehaviorConditionDistance(75, false),
					],
					new BehaviorActionCharacter(MasterObject.MO.playerController.playerCharacter),
					-1,
					-2
				)
			]
		));

		var duckController2 = new BehaviourController(duck2, new BehaviorTree(
			[
				new BehaviorActionMoveAway(
					duck2,
					[
						new BehaviorConditionAvoidClass(MainCharacter, 125),
					],
					new BehaviorActionCharacter(undefined)
				),
				new BehaviorActionModifySpeed(
					duck2,
					[
						new BehaviorConditionDistance(75, false),
					],
					new BehaviorActionCharacter(MasterObject.MO.playerController.playerCharacter),
					-1,
					-2
				)
			]
		));

		this.CheckFullscreen();
		window.requestAnimationFrame(GlobalLoop);
	}

	ToggleFrameStepping() {
		this.frameStepping = !this.frameStepping;

		if (this.frameStepping === false)
			window.requestAnimationFrame(GlobalLoop);
	}

	NextFrame() {
		if (this.frameStepping)
			window.requestAnimationFrame(GlobalLoop);
	}

	GameLoopActions() {
		InputHandler.GIH.FixedUpdate();
		CustomEventHandler.GCEH.FixedUpdate();

		LightSystem.SkyLight.Update();

		for (let i = 0, l = Cobject.KeysAllCobjects.length; i < l; ++i) {
			if (Cobject.KeysAllCobjects[i] !== undefined && Cobject.AllCobjects[Cobject.KeysAllCobjects[i]] !== undefined)
				Cobject.AllCobjects[Cobject.KeysAllCobjects[i]].FixedUpdate();
		}

		CanvasDrawer.GCD.DrawLoop();

		for (let i = 0, l = Cobject.KeysAllCobjects.length; i < l; ++i) {
			if (Cobject.KeysAllCobjects[i] !== undefined && Cobject.AllCobjects[Cobject.KeysAllCobjects[i]] !== undefined)
				Cobject.AllCobjects[Cobject.KeysAllCobjects[i]].EndOfFrameUpdate();
		}

		NavigationSystem._Instance.EndOfFrameUpdate();
	}

	GameLoop() {
		Mastertime.Next();
		this.GameLoopActions();
		CollisionHandler.GCH.FixedUpdate();
		CanvasDrawer.DrawToMain(this.playerController.playerCamera.GetRect());

		if (this.frameStepping === false) {
			window.requestAnimationFrame(GlobalLoop);
		}
	}

	CheckFullscreen() {
		if (window.innerHeight == screen.height) {
			const containerGame = document.getElementById('container-game');
			const lutEditor = document.getElementById('tile-lut-editor');
			if (containerGame !== null && lutEditor !== null) {
				containerGame.style.width = '2560px';
				containerGame.style.height = '1440px';
				containerGame.style.gridColumn = 'unset';
				containerGame.style.gridRow = 'unset';
				//@ts-ignore
				document.body.querySelector('div.controls').style.display = 'none';
				lutEditor.style.display = 'none';
				//@ts-ignore
				document.firstElementChild.style.overflow = 'clip';
			}
		} else {
			const containerGame = document.getElementById('container-game');
			const lutEditor = document.getElementById('tile-lut-editor');
			if (containerGame !== null && lutEditor !== null) {
				containerGame.style.width = '1920px';
				containerGame.style.height = '1080px';
				containerGame.style.gridColumn = 'center';
				containerGame.style.gridRow = 'content';
				//@ts-ignore
				document.body.querySelector('div.controls').style.display = 'block';
				lutEditor.style.display = 'flex';
				//@ts-ignore
				document.firstElementChild.style.overflow = 'auto';
			}
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'mouseup':
				if (e.target.id === 'framestep-next' && this.frameStepping === true) {
					window.requestAnimationFrame(GlobalLoop);
				} else if (e.target.id === 'framestep-enable') {
					this.ToggleFrameStepping();
				}
				break;

			case 'resize':
				this.CheckFullscreen();
				break;
		}
	}
}

var shopTest = new Shop('seedShop', new Vector2D(-256, 256), undefined, 'pepoSeedShop');
shopTest.AddItem(new Seed('cornSeed', 420));
shopTest.AddItems([
	new Seed('potatoSeed', 999), new Seed('watermelonSeed', 999),
	new Seed('pumpkinSeed', 999), new Seed('bellpepperGreenSeed', 999),
	new Seed('bellpepperRedSeed', 999), new Seed('bellpepperOrangeSeed', 999),
	new Seed('bellpepperYellowSeed', 999), new Seed('carrotSeed', 999),
	new Seed('parsnipSeed', 999), new Seed('radishSeed', 999),
	new Seed('beetrootSeed', 999), new Seed('garlicSeed', 999),
	new Seed('onionYellowSeed', 999), new Seed('onionRedSeed', 999),
	new Seed('onionWhiteSeed', 999), new Seed('onionGreenSeed', 999),
	new Seed('hotPepperSeed', 999), new Seed('chiliPepperSeed', 999),
	new Seed('lettuceIcebergSeed', 999), new Seed('cauliflowerSeed', 999),
	new Seed('broccoliSeed', 999)
]);
CustomEventHandler.AddListener(shopTest);


var duck = new Character('duckWalk', new Vector2D(250, 600), AllAnimationsList.smallAnimalAnimations);
duck.name = 'duck';

var duck1 = new Character('duckWalk', new Vector2D(250, 460), AllAnimationsList.smallAnimalAnimations);
duck1.name = 'duck1';
var duck2 = new Character('duckWalk', new Vector2D(250, 532), AllAnimationsList.smallAnimalAnimations);
duck2.name = 'duck2';
var duck3 = new Character('duckWalk', new Vector2D(250, 30 * 32), AllAnimationsList.smallAnimalAnimations);
duck3.name = 'duck3';

var AllPlants = [
	new Plant('crops', 'corn', new Vector2D(592, 128)),
	new Plant('crops', 'potato', new Vector2D(592 + (32 * 1), 128)),
	new Plant('crops', 'watermelon', new Vector2D(592 + (32 * 2), 128)),
	new Plant('crops', 'pumpkin', new Vector2D(592 + (32 * 3), 128)),
	new Plant('crops', 'bellpepperGreen', new Vector2D(592 + (32 * 4), 128)),
	new Plant('crops', 'bellpepperRed', new Vector2D(592 + (32 * 5), 128)),
	new Plant('crops', 'bellpepperOrange', new Vector2D(592 + (32 * 6), 128)),
	new Plant('crops', 'bellpepperYellow', new Vector2D(592 + (32 * 7), 128)),
	new Plant('crops', 'carrot', new Vector2D(592 + (32 * 8), 128)),
	new Plant('crops', 'parsnip', new Vector2D(592 + (32 * 9), 128)),
	new Plant('crops', 'radish', new Vector2D(592 + (32 * 10), 128)),
	new Plant('crops', 'beetroot', new Vector2D(592 + (32 * 11), 128)),
	new Plant('crops', 'garlic', new Vector2D(592 + (32 * 12), 128)),
	new Plant('crops', 'onionYellow', new Vector2D(592 + (32 * 13), 128)),
	new Plant('crops', 'onionRed', new Vector2D(592 + (32 * 14), 128)),
	new Plant('crops', 'onionWhite', new Vector2D(592 + (32 * 15), 128)),
	new Plant('crops', 'onionGreen', new Vector2D(592 + (32 * 16), 128)),
	new Plant('crops', 'hotPepper', new Vector2D(592 + (32 * 17), 128)),
	new Plant('crops', 'chiliPepper', new Vector2D(592 + (32 * 18), 128)),
	new Plant('crops', 'lettuceIceberg', new Vector2D(592 + (32 * 19), 128)),
	new Plant('crops', 'cauliflower', new Vector2D(592 + (32 * 20), 128)),
	new Plant('crops', 'broccoli', new Vector2D(592 + (32 * 21), 128)),
];

for (let i = 0, l = AllPlants.length; i < l; ++i) {
	CustomEventHandler.AddListener(AllPlants[i]);
}

export { MasterObject, AllPlants };