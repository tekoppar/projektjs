import { ObjectsHasBeenInitialized, LightSystem, Rectangle, DrawingOperation, CAnimation, AllAnimationsList, ToggleObjectsHasBeenInitialized, CollisionHandler, CustomEventHandler, Plant, AllPlantData, MainCharacter, InputHandler, Vector2D, CanvasDrawer, CanvasSprite, Cobject, TileData, Seed, Shop, TileMaker, CollisionEditor, PlayerController, AtlasController } from '../internal.js';
import { GenerateCustomSheets } from '../drawers/tiles/TileMakerCustomSheets/tileMakerCustomSheetsImports.js';

var GlobalFrameCounter = 0;

function GlobalLoop() {
    MasterObject.MO.GameLoop();
}

/**
 * @class
 * @constructor
 */
class Mastertime {

    /**
     * @readonly
     * @type {Number}
     */
    static HalfADay = (24 * 60 * 60) * 0.5;
    /**
     * @readonly
     * @type {Number}
     */
    static ADay = (24 * 60 * 60);

    constructor() {
        this.DeltaTime = Date.now();
        this.PreviousTime = 0;
        this.GlobalFrameCounter = 0;
        this.TimeOfDay = new Date('1995-12-17T24:00:00');
    }

    Next() {
        this.DeltaTime = Date.now() - this.PreviousTime;
        this.PreviousTime = Date.now();
        this.GlobalFrameCounter++;
        this.UpdateTime();
    }

    UpdateTime() {
        if (this.DeltaTime < 10000)
            this.TimeOfDay = new Date(this.TimeOfDay.valueOf() + (this.DeltaTime * 1));
    }

    GetSeconds() {
        let seconds = this.TimeOfDay.getHours() * 60;
        seconds = (this.TimeOfDay.getMinutes() + seconds) * 60;
        seconds = this.TimeOfDay.getSeconds() + seconds;
        return seconds;
    }

    Delta() {
        return this.DeltaTime / 1000;
    }

    FC() {
        return this.GlobalFrameCounter;
    }
}

/**
 * @class
 * @constructor
 */
class MasterObject {
    static MO = new MasterObject();

    constructor() {
        this.gameHasBegun = false;
        this.Mastertime = new Mastertime();
        this.Mastertime.Next();
        this.classInitialization = {
            CanvasDrawer: false,
            Vector2D: false,
            CanvasSprite: false,
            DrawingOperation: false,
            CAnimation: false,
            InputHandler: false,
            CustomEventHandler: false,
        }
        this.classesHasBeenInitialized = false;
        this.frameStepping = false;
        this.playerController;

        MasterObject.LogicTests();

        document.getElementById('framestep-enable').addEventListener('mouseup', this);
        document.getElementById('framestep-next').addEventListener('mouseup', this);
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
            this.playerController = new PlayerController(new MainCharacter('femaleLight', 'mainP', 0, new Vector2D(534, 570), AllAnimationsList.femaleAnimations));
            this.playerController.playerCharacter.AddAttachment('redHair');
            this.playerController.playerCharacter.AddAttachment('underDress');
            InputHandler.GIH.AddListener(this.playerController);

            window.requestAnimationFrame(() => this.GameBegin());
        } else {
            GlobalFrameCounter++;
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
            LightSystem.SkyLight.Update();

            for (let i = 0; i < AllPlants.length; ++i) {
                CustomEventHandler.AddListener(AllPlants[i]);
            }

            this.gameHasBegun = true;

            for (const key in Cobject.AllCobjects) {
                Cobject.AllCobjects[key].GameBegin();
            }
        }

        window.requestAnimationFrame(GlobalLoop);
    }

    ToggleFrameStepping() {
        this.frameStepping = !this.frameStepping;

        if (this.frameStepping === false)
            window.requestAnimationFrame(GlobalLoop);
    }

    NextFrame() {
        window.requestAnimationFrame(GlobalLoop);
    }

    GameLoopActions(delta) {
        InputHandler.GIH.FixedUpdate(delta);
        CustomEventHandler.GCEH.FixedUpdate(delta);

        LightSystem.SkyLight.Update();

        for (const key in Cobject.AllCobjects) {
            Cobject.AllCobjects[key].FixedUpdate(delta);
        }

        CanvasDrawer.GCD.DrawLoop(delta);

        for (const key in Cobject.AllCobjects) {
            Cobject.AllCobjects[key].EndOfFameUpdate();
        }
    }

    GameLoop() {
        document.getElementById('custom-logs').innerText = this.Mastertime.TimeOfDay.toTimeString();
        this.Mastertime.Next();
        this.GameLoopActions(this.frameStepping === false ? this.Mastertime.Delta() : 16);
        CollisionHandler.GCH.FixedUpdate();

        CanvasDrawer.DrawToMain(this.playerController.playerCamera);

        this.CheckFullscreen();

        GlobalFrameCounter++;

        if (this.frameStepping === false) {
            window.requestAnimationFrame(GlobalLoop);
        }
    }

    CheckFullscreen() {
        if (window.innerHeight == screen.height) {
            document.getElementById('container-game').style.width = '2560px';
            document.getElementById('container-game').style.height = '1440px';
            document.getElementById('container-game').style.gridColumn = 'unset';
            document.getElementById('container-game').style.gridRow = 'unset';
            //@ts-ignore
            document.body.querySelector('div.controls').style.display = 'none';
            document.getElementById('tile-lut-editor').style.display = 'none';
            //@ts-ignore
            document.firstElementChild.style.overflow = 'clip';
        } else {
            document.getElementById('container-game').style.width = '1920px';
            document.getElementById('container-game').style.height = '1080px';
            document.getElementById('container-game').style.gridColumn = 'center';
            document.getElementById('container-game').style.gridRow = 'center';
            //@ts-ignore
            document.body.querySelector('div.controls').style.display = 'block';
            document.getElementById('tile-lut-editor').style.display = 'flex';
            //@ts-ignore
            document.firstElementChild.style.overflow = 'auto';
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
        }
    }
}

var shopTest = new Shop('seedShop', new Vector2D(368, 256), undefined, 'pepoSeedShop');
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

/*var duck = new Character('duckWalk', 0, new Vector2D(250, 400), AllAnimationsList.smallAnimalAnimations);
duck.name = 'duck';
var duck1 = new Character('duckWalk', 0, new Vector2D(250, 432), AllAnimationsList.smallAnimalAnimations);
duck1.name = 'duck1';
var duck2 = new Character('duckWalk', 0, new Vector2D(250, 464), AllAnimationsList.smallAnimalAnimations);
duck2.name = 'duck2';
var duck3 = new Character('duckWalk', 0, new Vector2D(250, 30 * 32), AllAnimationsList.smallAnimalAnimations);
duck3.name = 'duck3';*/

var AllPlants = [
    new Plant('crops', 'corn', new Vector2D(592, 128), AllAnimationsList.plantAnimations.corn, AllPlantData.corn),
    new Plant('crops', 'potato', new Vector2D(592 + (32 * 1), 128), AllAnimationsList.plantAnimations.potato, AllPlantData.potato),
    new Plant('crops', 'watermelon', new Vector2D(592 + (32 * 2), 128), AllAnimationsList.plantAnimations.watermelon, AllPlantData.watermelon),
    new Plant('crops', 'pumpkin', new Vector2D(592 + (32 * 3), 128), AllAnimationsList.plantAnimations.pumpkin, AllPlantData.pumpkin),
    new Plant('crops', 'bellpepperGreen', new Vector2D(592 + (32 * 4), 128), AllAnimationsList.plantAnimations.bellpepperGreen, AllPlantData.bellpepperGreen),
    new Plant('crops', 'bellpepperRed', new Vector2D(592 + (32 * 5), 128), AllAnimationsList.plantAnimations.bellpepperRed, AllPlantData.bellpepperRed),
    new Plant('crops', 'bellpepperOrange', new Vector2D(592 + (32 * 6), 128), AllAnimationsList.plantAnimations.bellpepperOrange, AllPlantData.bellpepperOrange),
    new Plant('crops', 'bellpepperYellow', new Vector2D(592 + (32 * 7), 128), AllAnimationsList.plantAnimations.bellpepperYellow, AllPlantData.bellpepperYellow),
    new Plant('crops', 'carrot', new Vector2D(592 + (32 * 8), 128), AllAnimationsList.plantAnimations.carrot, AllPlantData.carrot),
    new Plant('crops', 'parsnip', new Vector2D(592 + (32 * 9), 128), AllAnimationsList.plantAnimations.parsnip, AllPlantData.parsnip),
    new Plant('crops', 'radish', new Vector2D(592 + (32 * 10), 128), AllAnimationsList.plantAnimations.radish, AllPlantData.radish),
    new Plant('crops', 'beetroot', new Vector2D(592 + (32 * 11), 128), AllAnimationsList.plantAnimations.beetroot, AllPlantData.beetroot),
    new Plant('crops', 'garlic', new Vector2D(592 + (32 * 12), 128), AllAnimationsList.plantAnimations.garlic, AllPlantData.garlic),
    new Plant('crops', 'onionYellow', new Vector2D(592 + (32 * 13), 128), AllAnimationsList.plantAnimations.onionYellow, AllPlantData.onionYellow),
    new Plant('crops', 'onionRed', new Vector2D(592 + (32 * 14), 128), AllAnimationsList.plantAnimations.onionRed, AllPlantData.onionRed),
    new Plant('crops', 'onionWhite', new Vector2D(592 + (32 * 15), 128), AllAnimationsList.plantAnimations.onionWhite, AllPlantData.onionWhite),
    new Plant('crops', 'onionGreen', new Vector2D(592 + (32 * 16), 128), AllAnimationsList.plantAnimations.onionGreen, AllPlantData.onionGreen),
    new Plant('crops', 'hotPepper', new Vector2D(592 + (32 * 17), 128), AllAnimationsList.plantAnimations.hotPepper, AllPlantData.hotPepper),
    new Plant('crops', 'chiliPepper', new Vector2D(592 + (32 * 18), 128), AllAnimationsList.plantAnimations.chiliPepper, AllPlantData.chiliPepper),
    new Plant('crops', 'lettuceIceberg', new Vector2D(592 + (32 * 19), 128), AllAnimationsList.plantAnimations.lettuceIceberg, AllPlantData.lettuceIceberg),
    new Plant('crops', 'cauliflower', new Vector2D(592 + (32 * 20), 128), AllAnimationsList.plantAnimations.cauliflower, AllPlantData.cauliflower),
    new Plant('crops', 'broccoli', new Vector2D(592 + (32 * 21), 128), AllAnimationsList.plantAnimations.broccoli, AllPlantData.broccoli),
];

for (let i = 0, l = AllPlants.length; i < l; ++i) {
    CustomEventHandler.AddListener(AllPlants[i]);
}

export { MasterObject, AllPlants, GlobalFrameCounter, Mastertime };