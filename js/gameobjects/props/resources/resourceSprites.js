import { CAnimation, Vector2D, AnimationType, Rectangle } from "../../../internal.js";

let resourceSprites = {};

resourceSprites.birchLog = {atlas: 'farmingfishing', animation:new CAnimation('null', new Vector2D(5, 0), new Vector2D(5, 0), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 8, 8, 4)};
resourceSprites.stonePiece = {atlas: 'terrain', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.coal = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.iron = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.tin = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.copper = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.silver = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};
resourceSprites.gold = {atlas: 'ore', animation:new CAnimation('null', new Vector2D(26, 25), new Vector2D(26, 25), 32, 32, AnimationType.Single, 1), collision: new Rectangle(8, 0, 0, 0)};

export { resourceSprites };