import { Vector4D, Vector2D } from '../../internal.js';

let inventoryItemIcons = {};

//products
Object.assign(inventoryItemIcons, {
    corn: { sprite: new Vector4D(29, 10, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    potato: { sprite: new Vector4D(0, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    watermelon: { sprite: new Vector4D(22, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    pumpkin: { sprite: new Vector4D(28, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperGreen: { sprite: new Vector4D(12, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperRed: { sprite: new Vector4D(13, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperOrange: { sprite: new Vector4D(14, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperYellow: { sprite: new Vector4D(15, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    carrot: { sprite: new Vector4D(24, 20, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    parsnip: { sprite: new Vector4D(25, 20, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    radish: { sprite: new Vector4D(18, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    beetroot: { sprite: new Vector4D(16, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    garlic: { sprite: new Vector4D(23, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionYellow: { sprite: new Vector4D(24, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionRed: { sprite: new Vector4D(25, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionWhite: { sprite: new Vector4D(26, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionGreen: { sprite: new Vector4D(27, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    hotPepper: { sprite: new Vector4D(11, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    chiliPepper: { sprite: new Vector4D(19, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    lettuceIceberg: { sprite: new Vector4D(11, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    cauliflower: { sprite: new Vector4D(14, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    broccoli: { sprite: new Vector4D(15, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
});

//seeds
Object.assign(inventoryItemIcons, {
    cornSeed: { sprite: new Vector4D(28, 2, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    potatoSeed: { sprite: new Vector4D(0, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    watermelonSeed: { sprite: new Vector4D(22, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    pumpkinSeed: { sprite: new Vector4D(28, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperGreenSeed: { sprite: new Vector4D(12, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperRedSeed: { sprite: new Vector4D(13, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperOrangeSeed: { sprite: new Vector4D(14, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperYellowSeed: { sprite: new Vector4D(15, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    carrotSeed: { sprite: new Vector4D(24, 4, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    parsnipSeed: { sprite: new Vector4D(25, 4, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    radishSeed: { sprite: new Vector4D(18, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    beetrootSeed: { sprite: new Vector4D(16, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    garlicSeed: { sprite: new Vector4D(23, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionYellowSeed: { sprite: new Vector4D(24, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionRedSeed: { sprite: new Vector4D(25, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionWhiteSeed: { sprite: new Vector4D(26, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionGreenSeed: { sprite: new Vector4D(27, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    hotPepperSeed: { sprite: new Vector4D(11, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    chiliPepperSeed: { sprite: new Vector4D(19, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    lettuceIcebergSeed: { sprite: new Vector4D(11, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    cauliflowerSeed: { sprite: new Vector4D(14, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    broccoliSeed: { sprite: new Vector4D(15, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
});

//items
Object.assign(inventoryItemIcons, {
    shovel: { sprite: new Vector4D(1, 8, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    hoe: { sprite: new Vector4D(4, 8, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    axe: { sprite: new Vector4D(5, 7, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    pickaxe: { sprite: new Vector4D(3, 0, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    birchLog: { sprite: new Vector4D(5, 0, 32, 32), atlas: new Vector2D(640, 640), url: '/content/sprites/farming_fishing.png' },
    stonePiece: { sprite: new Vector4D(26, 25, 32, 32), atlas: new Vector2D(1024, 1216), url: '/content/sprites/terrain_atlas.png' },
});

export { inventoryItemIcons };