import { Vector4D, Vector2D, Vector } from '../../internal.js';

/**
 * @type {Object.<string, {sprite: Vector4D, atlasSize: Vector2D, url: string}>}
 */
let inventoryItemIcons = {};

//products
Object.assign(inventoryItemIcons, {
    corn: { sprite: new Vector4D(29, 10, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    potato: { sprite: new Vector4D(0, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    watermelon: { sprite: new Vector4D(22, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    pumpkin: { sprite: new Vector4D(28, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperGreen: { sprite: new Vector4D(12, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperRed: { sprite: new Vector4D(13, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperOrange: { sprite: new Vector4D(14, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperYellow: { sprite: new Vector4D(15, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    carrot: { sprite: new Vector4D(24, 20, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    parsnip: { sprite: new Vector4D(25, 20, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    radish: { sprite: new Vector4D(18, 5, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    beetroot: { sprite: new Vector4D(16, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    garlic: { sprite: new Vector4D(23, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionYellow: { sprite: new Vector4D(24, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionRed: { sprite: new Vector4D(25, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionWhite: { sprite: new Vector4D(26, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionGreen: { sprite: new Vector4D(27, 15, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    hotPepper: { sprite: new Vector4D(11, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    chiliPepper: { sprite: new Vector4D(19, 0, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    lettuceIceberg: { sprite: new Vector4D(11, 5, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    cauliflower: { sprite: new Vector4D(14, 5, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    broccoli: { sprite: new Vector4D(15, 5, 32, 32), atlasSize: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
});

//seeds
Object.assign(inventoryItemIcons, {
    cornSeed: { sprite: new Vector4D(28, 2, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    potatoSeed: { sprite: new Vector4D(0, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    watermelonSeed: { sprite: new Vector4D(22, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    pumpkinSeed: { sprite: new Vector4D(28, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperGreenSeed: { sprite: new Vector4D(12, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperRedSeed: { sprite: new Vector4D(13, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperOrangeSeed: { sprite: new Vector4D(14, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperYellowSeed: { sprite: new Vector4D(15, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    carrotSeed: { sprite: new Vector4D(24, 4, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    parsnipSeed: { sprite: new Vector4D(25, 4, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    radishSeed: { sprite: new Vector4D(18, 1, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    beetrootSeed: { sprite: new Vector4D(16, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    garlicSeed: { sprite: new Vector4D(23, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionYellowSeed: { sprite: new Vector4D(24, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionRedSeed: { sprite: new Vector4D(25, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionWhiteSeed: { sprite: new Vector4D(26, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionGreenSeed: { sprite: new Vector4D(27, 3, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    hotPepperSeed: { sprite: new Vector4D(11, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    chiliPepperSeed: { sprite: new Vector4D(19, 0, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    lettuceIcebergSeed: { sprite: new Vector4D(11, 1, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    cauliflowerSeed: { sprite: new Vector4D(14, 1, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    broccoliSeed: { sprite: new Vector4D(15, 1, 32, 32), atlasSize: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
});

//items
Object.assign(inventoryItemIcons, {
    shovel: { sprite: new Vector4D(1, 8, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    hoe: { sprite: new Vector4D(4, 8, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    ironAxe: { sprite: new Vector4D(1, 0, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    steelAxe: { sprite: new Vector4D(1, 2, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    goldAxe: { sprite: new Vector4D(1, 4, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    pickaxe: { sprite: new Vector4D(3, 0, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    ironSword: { sprite: new Vector4D(0, 0, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    steelSword: { sprite: new Vector4D(0, 2, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    goldSword: { sprite: new Vector4D(0, 4, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    ironBattleAxe: { sprite: new Vector4D(10, 5, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    steelBattleAxe: { sprite: new Vector4D(10, 4, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    goldBattleAxe: { sprite: new Vector4D(10, 3, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    ironBattleHammer: { sprite: new Vector4D(11, 2, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    steelBattleHammer: { sprite: new Vector4D(11, 3, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    shortBow: { sprite: new Vector4D(5, 1, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    compositeBow: { sprite: new Vector4D(4, 1, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },

    birchLog: { sprite: new Vector4D(5, 0, 32, 32), atlasSize: new Vector2D(640, 640), url: '/content/sprites/farming_fishing.png' },
    stonePiece: { sprite: new Vector4D(26, 25, 32, 32), atlasSize: new Vector2D(1024, 1216), url: '/content/sprites/terrain_atlas.png' },

    coalLump: { sprite: new Vector4D(0, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    iron: { sprite: new Vector4D(1, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    tin: { sprite: new Vector4D(2, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    copper: { sprite: new Vector4D(3, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    silver: { sprite: new Vector4D(4, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    gold: { sprite: new Vector4D(5, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    bronze: { sprite: new Vector4D(6, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    steel: { sprite: new Vector4D(7, 10, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },

    coal: { sprite: new Vector4D(0, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    ironBar: { sprite: new Vector4D(1, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    tinBar: { sprite: new Vector4D(2, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    copperBar: { sprite: new Vector4D(3, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    silverBar: { sprite: new Vector4D(4, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    goldBar: { sprite: new Vector4D(5, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    bronzeBar: { sprite: new Vector4D(6, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
    steelBar: { sprite: new Vector4D(7, 11, 32, 32), atlasSize: new Vector2D(512, 512), url: '/content/sprites/items/ore.png' },
});

export { inventoryItemIcons };