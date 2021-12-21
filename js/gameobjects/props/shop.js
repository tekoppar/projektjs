import {
	CFrame, AtlasController, OperationType, InputHandler, Item, Prop, Vector2D,
	GUI, HTMLInfo, PolygonCollision, CanvasUtility, inventoryItemIcons
} from '../../internal.js';

let ShopCollisions = {
	seedShop: [new Vector2D(-2, -2), new Vector2D(97, -2), new Vector2D(97, 107), new Vector2D(-2, 107)],
	seedShopBlocking: [new Vector2D(1, 104), new Vector2D(0, 85.33333333333333), new Vector2D(95, 85.33333333333333), new Vector2D(95, 104)],
}

/**
 * @class
 * @constructor
 * @extends Item
 */
class MarketItem extends Item {

	/**
	 * Creates a new MarketItem
	 * @param {number} itemCost 
	 * @param {number} itemAmount 
	 * @param {string} itemName 
	 */
	constructor(itemCost, itemAmount, itemName) {
		super(itemName, itemAmount);
		/** @type {number} */ this.itemCost = itemCost;
	}
}

/**
 * @readonly
 * @enum {number}
 */
const ShopItemInfoType = {
	Select: 0,
	Hovered: 1,
}

/**
 * @class
 * @constructor
 * @extends Prop
 */
class Shop extends Prop {

	/**
	 * Creates a new Shop
	 * @param {string} shopName 
	 * @param {Vector2D} position 
	 * @param {string} animations 
	 * @param {string} canvasName 
	 */
	constructor(shopName, position, animations, canvasName) {
		super(shopName, position, animations, canvasName);
		/** @type {Object.<string, Item>} */ this.marketItems = {};
		/** @type {boolean} */ this.isVisible = true;
		this.shopHTML;
		this.shopHTMLList;
		this.shopAmountHTML = undefined;
		/** @type {boolean} */ this.didShopChange = false;
		/** @type {boolean} */ this.shopSetupDone = false;
		/** @type {Vector2D} */ this.shopSpriteSize = new Vector2D(32, 32);
		/** @type {Item} */ this.selectedShopItem = undefined;
		this.selectedShopHTML = undefined;
		/** @type {Object} @lends {Inventory} */ this.gameObjectUsing = undefined;
		this.shopHTMLInfo;
		/** @type {number} */ this.valueAmount = 0;
		/** @type {PolygonCollision} */ this.BlockingCollision;
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	AddItem(item) {
		if (this.marketItems[item.name] !== undefined) {
			this.marketItems[item.name].AddAmount(item.amount);
		} else {
			this.marketItems[item.name] = item;
		}
		this.didShopChange = true;
	}

	/**
	 * 
	 * @param {Item[]} items 
	 */
	AddItems(items) {
		for (let item of items) {
			this.AddItem(item);
		}
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	RemoveItem(item) {
		if (this.marketItems[item.name] !== undefined) {
			delete this.marketItems[item.name];
			this.didShopChange = true;
		}
	}

	PlayAnimation() {
		super.PlayAnimation();
	}

	SetupMarket() {
		//if (document.getElementById('game-panel') !== null && CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined && CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas !== undefined) {
		this.shopHTML = GUI.CreateContainer();
		this.shopHTML.addEventListener('mouseup', this);

		let eventContainer = GUI.CreateContainer();
		this.shopAmountHTML = GUI.CreateInput();
		this.shopAmountHTML.children[0].addEventListener('input', this);

		let buttonBuy = GUI.CreateButton('Buy');
		buttonBuy.classList.add('shop-buy');

		let buttonSell = GUI.CreateButton('Sell');
		buttonSell.classList.add('shop-sell');

		let buttoncontainer = GUI.CreateContainer(false);
		eventContainer.appendChild(this.shopAmountHTML);
		buttoncontainer.appendChild(buttonBuy);
		buttoncontainer.appendChild(buttonSell);
		eventContainer.appendChild(buttoncontainer);

		let template = document.getElementById('game-panel');
		// @ts-ignore
		let clone = template.content.cloneNode(true);
		this.shopHTMLList = clone.querySelector('div.panel-middle');

		this.shopHTMLInfo = new HTMLInfo();
		this.shopHTMLInfo.CreateHTML();
		clone.children[0].appendChild(this.shopHTMLInfo.parentContainer);

		this.shopHTML.appendChild(clone);
		this.shopHTML.appendChild(eventContainer);
		document.getElementById('game-gui').appendChild(this.shopHTML);

		this.shopSpriteSize = new Vector2D(AtlasController.GetAtlas(this.canvasName).width, AtlasController.GetAtlas(this.canvasName).height);
		this.CreateDrawOperation(
			new CFrame(
				0,
				0,
				this.shopSpriteSize.x,
				this.shopSpriteSize.y
			),
			this.GetPosition(),
			false,
			AtlasController.GetAtlas(this.canvasName).GetCanvas(),
			OperationType.gameObjects
		);

		this.BoxCollision.size = this.shopSpriteSize.Clone();
		this.shopHTML.style.top = (this.GetPosition().y - (352 / 2)) + 'px';
		this.shopHTML.style.left = (this.GetPosition().x + 128) + 'px';

		this.NewCollision(new PolygonCollision(
			this.GetPosition().Clone(),
			this.size.Clone(),
			ShopCollisions[this.name],
			false,
			this,
			true
		));

		this.BlockingCollision = new PolygonCollision(
			this.GetPosition().Clone(),
			this.size.Clone(),
			ShopCollisions[this.name + 'Blocking'],
			true,
			this,
			true
		);
		this.BlockingCollision.UpdatePoints();
		this.BlockingCollision.CalculateBoundingBox();
		this.BlockingCollision.UpdatePosition();
		this.BlockingCollision.UpdateCollision();

		this.SetupItemInfoHTML();

		this.shopSetupDone = true;
	}

	DisplayShop() {
		let keys = Object.keys(this.marketItems);
		this.shopHTMLList.innerHTML = '';
		for (let i = 0, l = keys.length; i < l; ++i) {
			let template = /** @type {HTMLTemplateElement} */ (document.getElementById('inventory-panel-item'));
			let clone = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

			let div = /** @type {HTMLDivElement} */ (clone.querySelector('div.inventory-item'));
			let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[this.marketItems[keys[i]].name].sprite.x * 32, inventoryItemIcons[this.marketItems[keys[i]].name].sprite.y * 32, inventoryItemIcons[this.marketItems[keys[i]].name].sprite.z, inventoryItemIcons[this.marketItems[keys[i]].name].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[this.marketItems[keys[i]].name].url));
			image.removeAttribute('heigth');
			image.removeAttribute('width');
			div.appendChild(image);

			div.addEventListener('mouseenter', this);
			div.addEventListener('mouseleave', this);

			if (this.marketItems[keys[i]].amount > 0) {
				let label = /** @type {HTMLLabelElement} */ (clone.querySelector('label.inventory-item-text'));
				label.innerText = this.marketItems[keys[i]].GetAmount().toString();
			}

			div.dataset.shopItem = this.marketItems[keys[i]].name;
			this.shopHTMLList.appendChild(clone);
		}

		this.didShopChange = false;
	}

	SetupItemInfoHTML() {
		let template = /** @type {HTMLTemplateElement} */ (document.getElementById('inventory-shop-item'));
		let clone = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

		clone.firstElementChild.classList.add('shop-item-select');
		this.shopHTMLInfo.selectedContainerHTML.querySelector('div.panel-middle').appendChild(clone);

		clone = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));
		clone.firstElementChild.classList.add('shop-item-hovered');
		this.shopHTMLInfo.hoveredContainerHTML.querySelector('div.panel-middle').appendChild(clone);
	}

	/**
	 * 
	 * @param {Item} item 
	 * @param {ShopItemInfoType} type 
	 */
	SetItemInfoHTML(item, type) {
		let container = undefined,
			labelName = undefined,
			labelAmount = undefined,
			labelCost = undefined;

		switch (type) {
			case ShopItemInfoType.Hovered:
				container = /** @type {HTMLDivElement} */ (this.shopHTMLInfo.hoveredContainerHTML.querySelector('div.shop-item-hovered'));
				this.shopHTMLInfo.hoveredContainerHTML.style.visibility = item !== undefined ? 'visible' : 'hidden';
				break;

			case ShopItemInfoType.Select:
				container = /** @type {HTMLDivElement} */ (this.shopHTMLInfo.selectedContainerHTML.querySelector('div.shop-item-select'));
				this.shopHTMLInfo.selectedContainerHTML.style.visibility = item !== undefined ? 'visible' : 'hidden';
				break;
		}

		labelName = /** @type {HTMLLabelElement} */ (container.querySelector('label.shop-item-name'));
		labelAmount = /** @type {HTMLLabelElement} */ (container.querySelector('label.shop-item-amount'));
		labelCost = /** @type {HTMLLabelElement} */ (container.querySelector('label.shop-item-cost'));

		if (item !== undefined) {
			labelName.innerText = item.GetRealName();
			labelAmount.innerText = item.GetAmountAsNumber().toString();
			labelCost.innerText = item.value.toString();

			let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[item.name].sprite.x * 32, inventoryItemIcons[item.name].sprite.y * 32, inventoryItemIcons[item.name].sprite.z, inventoryItemIcons[item.name].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[item.name].url));
			image.removeAttribute('heigth');
			image.removeAttribute('width');
			image.classList.add('shop-item-image');
			let imgCont = container.parentNode.querySelector('div.inventory-item');
			imgCont.appendChild(image);
		} else {
			labelName.innerText = '';
			labelAmount.innerText = '';
			labelCost.innerText = '';

			if (container.parentNode.querySelector('img.shop-item-image') !== null)
				container.parentNode.querySelector('img.shop-item-image').remove();
		}
	}

	/**
	 * 
	 * @param {Item} item 
	 * @param {number} amount 
	 * @returns {boolean}
	 */
	HasItem(item, amount) {
		return this.marketItems[item.name] !== undefined && this.marketItems[item.name].amount >= amount;
	}

	/**
	 * 
	 * @param {Item} item 
	 * @param {number} amount 
	 */
	BuyItem(item, amount) {
		if (this.HasItem(item, amount) && this.gameObjectUsing.inventory.HasMoney(item.value * amount) === true) {
			item.RemoveAmount(Number(amount));
			this.gameObjectUsing.inventory.SubtractMoney(Number(item.value * amount));
			this.gameObjectUsing.inventory.AddItem(Reflect.construct(item.constructor, [item.name, Number(amount)]));
			this.didShopChange = true;
		}
	}

	/**
	 * 
	 * @param {Item} item 
	 * @param {number} amount 
	 */
	SellItem(item, amount) {
		if (this.marketItems[item.name] === undefined) {
			this.marketItems[item.name] = Reflect.construct(item.constructor, [item.name, Number(amount)]);
		} else {
			this.marketItems[item.name].AddAmount(Number(amount));
		}

		this.gameObjectUsing.inventory.AddMoney(Number(item.value * amount));
		this.gameObjectUsing.inventory.RemoveItem(new Item(this.gameObjectUsing.inventory.selectedItem.name, Number(this.shopAmountHTML.firstElementChild.value)));
		this.didShopChange = true;
	}

	GameBegin() {
		super.GameBegin();
		this.SetupMarket();
	}

	/**
	 * 
	 * @param {Vector2D} position 
	 */
	FlagDrawingUpdate(position) {
		super.FlagDrawingUpdate(position);
	}

	FixedUpdate() {
		if (this.didShopChange === true && this.shopSetupDone === true) {
			this.DisplayShop();
		}
		if (this.gameObjectUsing !== undefined) {
			if (this.GetPosition().CheckInRange(this.gameObjectUsing.GetPosition(), 75.0) === false) {
				this.ShowShop();
				this.gameObjectUsing = undefined;
			}
		}

		super.FixedUpdate();
	}

	/**
	 * 
	 * @param {boolean} visibility 
	 */
	ShowShop(visibility = this.isVisible) {
		this.shopHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
		this.isVisible = !visibility;

		if (this.isVisible == true) {
			//this.shopHTMLInfo.RemoveHovered();
			//this.shopHTMLInfo.RemoveSelect();
			this.SetItemInfoHTML(undefined, ShopItemInfoType.Select);
			this.SetItemInfoHTML(undefined, ShopItemInfoType.Hovered);
			InputHandler.GIH.AddListener(this);
		} else {
			InputHandler.GIH.RemoveListener(this);
		}
	}

	//@ts-ignore
	CEvent(eventType, key, data) {
		switch (eventType) {
			case 'use':
				if (this.BoxCollision.GetRealCenterPosition().CheckInRange(key.BoxCollision.GetRealCenterPosition().Clone(), 75.0) === true) {
					this.ShowShop();
					key.inventory.ShowInventory(!this.isVisible);
					this.gameObjectUsing = this.isVisible === false ? key : undefined;
				}
				break;
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'mouseup':
				if (e.target.classList.contains('inventory-item') === true) {
					if (this.selectedShopHTML !== undefined) {
						//this.shopHTMLInfo.RemoveSelect();
						this.SetItemInfoHTML(undefined, ShopItemInfoType.Select);
						this.selectedShopHTML.classList.remove('toolbar-item-active');
						this.selectedShopItem = undefined;
					}

					if (this.selectedShopHTML == e.target) {
						this.selectedShopHTML.classList.remove('toolbar-item-active');
						//this.shopHTMLInfo.RemoveSelect();
						this.SetItemInfoHTML(undefined, ShopItemInfoType.Select);
						this.selectedShopHTML = undefined;
						this.selectedShopItem = undefined;
					} else {
						e.target.classList.add('toolbar-item-active');
						this.selectedShopItem = this.marketItems[e.target.dataset.shopItem];
						this.SetItemInfoHTML(this.selectedShopItem, ShopItemInfoType.Select);
						//this.shopHTMLInfo.AddSelect(this.selectedShopItem.GetHTMLInformation());
						this.selectedShopHTML = e.target;
					}

				} else if (e.target.classList.contains('shop-buy') === true) {
					if (this.selectedShopItem !== undefined && this.gameObjectUsing !== undefined) {
						this.BuyItem(this.selectedShopItem, this.shopAmountHTML.firstElementChild.value);
					}
				} else if (e.target.classList.contains('shop-sell') === true) {
					if (this.gameObjectUsing !== undefined && this.gameObjectUsing.inventory.selectedItem !== undefined && this.gameObjectUsing.inventory.selectedItem.HasAmount(this.shopAmountHTML.firstElementChild.value) === true) {
						this.SellItem(this.gameObjectUsing.inventory.selectedItem, this.shopAmountHTML.firstElementChild.value);
					}
				}
				break;

			case 'mouseenter':
				if (e.target.classList.contains('inventory-item') === true) {
					let hoveredItem = this.marketItems[e.target.dataset.shopItem];
					//this.shopHTMLInfo.AddHovered(hoveredItem.GetHTMLInformation());
					this.SetItemInfoHTML(hoveredItem, ShopItemInfoType.Hovered);
				}
				break;
			case 'mouseleave':
				if (e.target.classList.contains('inventory-item') === true) {
					//this.shopHTMLInfo.RemoveHovered();
					this.SetItemInfoHTML(undefined, ShopItemInfoType.Hovered);
				}
				break;

			case 'input':
				if (isNaN(e.data) === true) {
					this.shopAmountHTML.children[0].value = this.valueAmount;
				} else {
					this.valueAmount = parseFloat(e.target.value);
				}
				break;
		}
	}
}

export { Shop, MarketItem };