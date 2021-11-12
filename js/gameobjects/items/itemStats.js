import { Vector2D } from '../../internal.js';

let ItemStats = {};

ItemStats.axe = {durability: 250, tilePreview: true};
ItemStats.shovel = {durability: 250, tilePreview: true};
ItemStats.pickaxe = {durability: 250, tilePreview: true};
ItemStats.hoe = {durability: 250, tilePreview: true};
ItemStats.sword = {durability: 250, damage: new Vector2D(5, 10), tilePreview: false, characterAnimation: 'melee', animation: 'meleeFemaleWeaponAnimations', atlas: 'shortSwordFemale'};

export { ItemStats };