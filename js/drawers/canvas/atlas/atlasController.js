import { CanvasAtlas, CanvasAtlasObject } from '../../../internal.js';

class AtlasController {
    static _Instance;

    constructor(canvasDrawer) {
        AtlasController._Instance = this;
        this.canvasDrawer = canvasDrawer;
        this.atlasesUrl = {};
        this.canvasAtlases = {};
        this.loadedImages = [];
        this.hasLoadedAllImages = {};
        this.isLoadingFinished = false;
    }

    /**
     * Gets the CanvasAtlas by name
     * @param {string} name 
     * @returns {CanvasAtlas}
     */
    GetAtlas(name) {
        if (this.canvasAtlases[name] !== undefined) {
            return this.canvasAtlases[name];
        } else {
            let keys = Object.keys(this.atlasesUrl);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i] === name)
                    return this.canvasAtlases[this.atlasesUrl[keys[i]]];
            }
        }

        return undefined;
    }

    static GetAtlas(name) {
        return AtlasController._Instance.GetAtlas(name);
    }

    /**
     * Gets the CanvasAtlas by name
     * @param {string} name 
     * @returns {CanvasAtlasObject}
     */
    GetAtlasObject(name) {
        if (this.canvasAtlases[name] !== undefined && this.canvasAtlases[name] instanceof CanvasAtlasObject) {
            return this.canvasAtlases[name];
        } else {
            let keys = Object.keys(this.atlasesUrl);
            for (let i = 0; i < keys.length; ++i) {
                if (keys[i] === name && this.canvasAtlases[this.atlasesUrl[keys[i]]] instanceof CanvasAtlasObject)
                    return this.canvasAtlases[this.atlasesUrl[keys[i]]];
            }
        }

        return undefined;
    }

    static GetAtlasObject(name) {
        return AtlasController._Instance.GetAtlasObject(name);
    }

    /**
     * Adds a new CanvasAtlas
     * @param {CanvasAtlas} atlas 
     * @param {string} name 
     */
    AddAtlas(atlas, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = atlas;
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;
        }
    }

    static AddAtlas(atlas, name) {
        return AtlasController._Instance.AddAtlas(atlas, name);
    }

    LoadNewSpriteAtlas(url, width, height, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.LoadSpriteAtlas(url, width, height, atlasSize, name);
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;

            this.atlasesUrl[url] = name;
        }
    }

    LoadSpriteAtlas(url, width, height, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = new CanvasAtlas(this.canvasDrawer, url, width, height, atlasSize, name);
            this.atlasesUrl[url] = name;
        }
    }

    LoadAllAtlases() {
        this.LoadSpriteAtlas("/content/sprites/terrain_atlas.png", 1024, 1216, 32, "terrain");
        this.hasLoadedAllImages["terrain"] = false;
        this.LoadSpriteAtlas("/content/sprites/crops.png", 1024, 1024, 32, "crops");
        this.hasLoadedAllImages["crops"] = false;
        this.LoadSpriteAtlas("/content/sprites/fence.png", 96, 192, 32, "fence");
        this.hasLoadedAllImages["fence"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui_big_pieces.png", 864, 568, 32, "uipieces");
        this.hasLoadedAllImages["uipieces"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies.png", 1024, 1536, 32, "fruitsveggies");
        this.hasLoadedAllImages["fruitsveggies"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies-seeds.png", 1024, 512, 32, "fruitsveggiesseeds");
        this.hasLoadedAllImages["fruitsveggiesseeds"] = false;
        this.LoadSpriteAtlas("/content/sprites/farming_fishing.png", 640, 640, 32, "farmingfishing");
        this.hasLoadedAllImages["farmingfishing"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/TerrainOutside.png", 1024, 1216, 32, "terrainoutside");
        this.hasLoadedAllImages["terrainoutside"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/victorian-streets.png", 512, 3072, 32, "victorianstreets");
        this.hasLoadedAllImages["victorianstreets"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/walls.png", 2048, 3072, 32, "walls");
        this.hasLoadedAllImages["walls"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/windows-doors.png", 1024, 1024, 32, "windowsdoors");
        this.hasLoadedAllImages["windowsdoors"] = false;
        this.LoadSpriteAtlas("/content/sprites/Collection/roofs.png", 2048, 2048, 32, "roofs");
        this.hasLoadedAllImages["windowsdoors"] = false;
        this.LoadSpriteAtlas("/content/sprites/items/items1.png", 512, 512, 32, "items1");
        this.hasLoadedAllImages["items1"] = false;
        this.LoadSpriteAtlas('/content/sprites/items/ore.png', 512, 512, 32, 'ore');
        this.hasLoadedAllImages['ore'] = false;
        this.LoadSpriteAtlas("/content/sprites/clouds-small.png", 224, 64, 32, "clouds");
        this.hasLoadedAllImages["clouds"] = false;
        this.LoadSpriteAtlas("/content/sprites/animals/chicken_walk.png", 128, 128, 32, "chickenWalk");
        this.hasLoadedAllImages["chickenWalk"] = false;
        this.LoadSpriteAtlas("/content/sprites/animals/duck_walk.png", 128, 160, 32, "duckWalk");
        this.hasLoadedAllImages["duckWalk"] = false;

        this.LoadSpriteAtlas("/content/sprites/lpcfemalelight_updated.png", 832, 1856, 64, "femaleLight");
        this.hasLoadedAllImages["femaleLight"] = false;
        this.LoadSpriteAtlas('/content/sprites/red.png', 832, 1344, 64, 'redHair');
        this.hasLoadedAllImages['redHair'] = false;
        this.LoadSpriteAtlas('/content/sprites/lpcfemaleunderdress.png', 832, 1344, 64, 'underDress');
        this.hasLoadedAllImages['underDress'] = false;
        this.LoadSpriteAtlas('./content/sprites/lpc_shadow.png', 832, 1344, 64, 'shadow');
        this.hasLoadedAllImages['shadow'] = false;

        this.LoadSpriteAtlas("/content/sprites/ui/inputLeft.png", 16, 16, 16, "inputLeft");
        this.hasLoadedAllImages["inputLeft"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui/inputRight.png", 16, 16, 16, "inputRight");
        this.hasLoadedAllImages["inputRight"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui/inputMiddle.png", 32, 26, 32, "inputMiddle");
        this.hasLoadedAllImages["inputMiddle"] = false;

        this.LoadSpriteAtlas("/content/sprites/items/weapons/short_sword_female.png", 384, 256, 32, "shortSwordFemale");
        this.hasLoadedAllImages["shortSwordFemale"] = false;
    }
}

export { AtlasController };