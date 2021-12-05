import { Vector2D, AllAnimationsList, AllAnimationSkeletonsList } from '../../internal.js';

let ItemStats = {};

ItemStats.ironAxe = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.steelAxe = {
    durability: 750,
    damage: new Vector2D(25, 35),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.goldAxe = {
    durability: 2500,
    damage: new Vector2D(85, 125),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.shovel = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.pickaxe = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale', bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.hoe = {
    durability: 250,
    tilePreview: true
};

ItemStats.ironSword = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: false,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.steelSword = {
    durability: 750,
    damage: new Vector2D(25, 35),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.goldSword = {
    durability: 2500,
    damage: new Vector2D(85, 125),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};

ItemStats.ironBattleAxe = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.steelBattleAxe = {
    durability: 750,
    damage: new Vector2D(25, 35),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.goldBattleAxe = {
    durability: 2500,
    damage: new Vector2D(85, 125),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};

ItemStats.ironBattleHammer = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.steelBattleHammer = {
    durability: 750,
    damage: new Vector2D(25, 35),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};

ItemStats.shortBow = {
    durability: 250,
    damage: new Vector2D(5, 10),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};
ItemStats.compositeBow = {
    durability: 750,
    damage: new Vector2D(25, 35),
    tilePreview: true,
    characterAnimation: 'melee',
    animation: AllAnimationsList.meleeFemaleWeaponAnimations.sword,
    atlas: 'shortSwordFemale',
    bones: AllAnimationSkeletonsList.femaleAnimations.sword
};

export { ItemStats };