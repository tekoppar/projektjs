import {
	Cobject, Item, Vector2D, GameToolbar, GUI, CanvasDrawer, AtlasController,
	Vector4D, ItemProp, CAnimation, AnimationType, MasterObject, ItemPrototypeList, Dictionary,
	CanvasUtility, inventoryItemIcons
} from '../../internal.js';

/**
 * @class
 * @constructor
 */
//@ts-ignore
class InventorySlot {
	constructor(slot, item) {
		this.slot = slot;
		this.item = item;
	}
}

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Inventory extends Cobject {

	/**
	 * 
	 * @param {Object} owner 
	 */
	constructor(owner) {
		super();

		/** @type {Object.<string, Item>}>} */ this.inventory = {};
		/** @type {Object} */ this.characterOwner = owner;
		/** @type {boolean} */ this.isVisible = false;
		/** @type {HTMLDivElement} */ this.inventoryHTML;
		this.inventoryHTMLList;
		this.inventoryHTMLValue;
		/** @type {boolean} */ this.didInventoryChange = false;
		/** @type {boolean} */ this.inventorySetupDone = false;
		/** @type {Item} */ this.selectedItem = undefined;
		/** @type {number} */ this.moneyAmount = 0;
		/** @type {Dictionary<Item>} */ this.inventoryDictionary = new Dictionary('name');
	}

	SetupInventory() {
		if (document.getElementById('inventory-panel') !== null) {
			this.inventoryHTML = GUI.CreateContainer();

			let template = document.getElementById('inventory-panel');
			// @ts-ignore
			let clone = template.content.cloneNode(true);
			this.inventoryHTMLList = clone.querySelector('div.panel-middle');
			this.inventoryHTMLList.addEventListener('click', this);

			this.inventoryHTML.setAttribute('droppable', 'true');
			this.inventoryHTML.addEventListener('drop', this);
			this.inventoryHTML.addEventListener('dragover', this);
			document.getElementById('container-game').addEventListener('drop', this);
			this.inventoryHTMLValue = clone.querySelector('input.inventory-input-value');

			this.inventoryHTML.appendChild(clone);
			this.inventoryHTML.classList.add('inventory-div');
			document.getElementById('game-gui').appendChild(this.inventoryHTML);

			this.inventorySetupDone = true;
		} else
			window.requestAnimationFrame(() => this.SetupInventory());
	}

	/**
	 * 
	 * @param {Number} amount 
	 * @returns {boolean}
	 */
	HasMoney(amount) {
		return this.moneyAmount !== 0 && this.moneyAmount >= amount;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {Item}
	 */
	GetItem(name) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
		if (found !== undefined)
			return found
		else
			return undefined;
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {Number} amount 
	 * @returns {boolean}
	 */
	HasItemAmount(name, amount) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
		if (found !== undefined && found.HasAmount(amount)) {
			return true;
		} else
			return false;
	}

	/**
	 * 
	 * @param {string} name 
	 * @returns {Number}
	 */
	GetItemAmount(name) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
		if (found !== undefined) {
			return found.GetAmountAsNumber();
		} else
			return 0;
	}

	/**
	 * 
	 * @param {Number} amount 
	 */
	SubtractMoney(amount) {
		this.moneyAmount -= amount;

		if (this.inventoryHTMLValue !== undefined)
			this.inventoryHTMLValue.value = this.moneyAmount;
	}

	/**
	 * 
	 * @param {Number} amount 
	 */
	AddMoney(amount) {
		this.moneyAmount += amount;

		if (this.inventoryHTMLValue !== undefined)
			this.inventoryHTMLValue.value = this.moneyAmount;
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	AddItem(item) {
		let found = this.inventoryDictionary.GetValueByProperty(item.name, 'name');
		if (found !== undefined) {
			if (found.isStackable === true) {
				found.AddAmount(Number(item.amount));
			} else {
				this.inventoryDictionary.AddValue(item, 'UID');
			}
		} else {
			item.inventory = this;
			this.inventoryDictionary.AddValue(item, 'UID');
		}

		this.didInventoryChange = true;
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {Number} amount 
	 */
	AddNewItem(name, amount = 0) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
		if (found === undefined) {
			let newItem = undefined;

			if (ItemPrototypeList[name] !== undefined) {
				newItem = new ItemPrototypeList[name].constructor(name, amount);
			} else {
				newItem = new Item(name, 0);
			}

			if (newItem.isStackable === true)
				newItem.AddAmount(amount > 0 ? amount : 1);

			this.inventoryDictionary.AddValue(newItem, 'UID');
		} else if (found !== undefined && found.isStackable === false) {
			let newItem = undefined;

			if (ItemPrototypeList[name] !== undefined) {
				newItem = new ItemPrototypeList[name].constructor(name, amount);//, {name:{value:name}, amount:{value:amount}});
			} else {
				newItem = new Item(name, 0);
			}

			if (newItem.isStackable === true)
				found.AddAmount(amount > 0 ? amount : 1);
			else
				this.inventoryDictionary.AddValue(newItem, 'UID');
		} else if (found.isStackable === true) {
			found.AddAmount(amount > 0 ? amount : 1);
		} else {
			this.inventory[name].AddAmount(amount > 0 ? amount : 1);

		}

		this.didInventoryChange = true;
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {Number} amount 
	 */
	RemoveAmount(name, amount) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');

		if (found !== undefined) {
			if (found.GetAmountAsNumber() > 1)
				found.RemoveAmount(Number(amount));
			else {
				this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(found.UID, 'UID'));
			}
		}

		this.didInventoryChange = true;
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	RemoveItem(item) {
		if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {
			let found = /** @type {Item} */ (this.inventoryDictionary.GetValueByProperty(item.UID, 'UID'));

			if (found.GetAmountAsNumber() > 1) {
				found.RemoveAmount(Number(item.amount));

				if (found.GetAmountAsNumber() < 1) {
					this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(item.UID, 'UID'));
					GameToolbar.RemoveToolbarItem(item);
				}
			} else {
				this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(item.UID, 'UID'));
				GameToolbar.RemoveToolbarItem(item);
			}
		}
		this.didInventoryChange = true;
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	DropItem(item) {
		if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {

			let found = this.inventoryDictionary.GetHashByProperty(item.UID, 'UID');
			if (found !== undefined)
				this.inventoryDictionary.RemoveValue(found);

			//delete this.inventory[item.name];
			GameToolbar.RemoveToolbarItem(item);
			this.didInventoryChange = true;
		}
	}

	DisplayInventory() {
		//let keys = Object.keys(this.inventory);
		this.inventoryHTMLList.innerHTML = '';

		for (let value of this.inventoryDictionary) {
			let template = document.getElementById('inventory-panel-item');
			// @ts-ignore
			let clone = template.content.cloneNode(true);

			if (value !== null) {
				let div = clone.querySelector('div.inventory-item');
				let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[value.name].sprite.x * 32, inventoryItemIcons[value.name].sprite.y * 32, inventoryItemIcons[value.name].sprite.z, inventoryItemIcons[value.name].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[value.name].url));
				image.removeAttribute('heigth');
				image.removeAttribute('width');
				div.appendChild(image);

				/*div.style.backgroundPosition = '-' + (value.sprite.x * value.sprite.z) * 1.35 + 'px -' + (value.sprite.y * value.sprite.a) * 1.5 + 'px';
				div.style.backgroundSize = value.atlasSize.x * 1.35 + 'px ' + value.atlasSize.y * 1.5 + 'px';
				div.style.backgroundImage = 'url(' + value.url + ')';*/

				if (value.amount > 0)
					clone.querySelector('label.inventory-item-text').innerHTML = value.GetAmount();

				div.dataset.inventoryItem = value.name;
				div.setAttribute('draggable', true);
				div.addEventListener('dragstart', this);
				this.inventoryHTMLList.appendChild(clone);
			}
		}
		this.didInventoryChange = false;
	}

	/**
	 * 
	 * @param {boolean} visibility 
	 */
	ShowInventory(visibility = !this.isVisible) {
		this.inventoryHTML.style.display = (visibility === true ? 'flex' : 'none');
		this.isVisible = visibility;
		this.inventoryHTMLValue.value = this.moneyAmount;
		this.selectedItem = undefined;
	}

	FixedUpdate() {
		if (this.didInventoryChange === true && this.inventorySetupDone === true) {
			this.DisplayInventory();
		}

		super.FixedUpdate();
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				if (e.target.classList.contains('inventory-item') === true) {
					let found = this.inventoryDictionary.GetValueByProperty(this.selectedItem.name, 'name');
					if (found !== undefined) {
						this.selectedItem = found;// this.inventory[e.target.dataset.inventoryItem];
					}
				}
				break;

			case 'dragover':
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';
				break;

			case 'drop':
				e.preventDefault();
				if (e.target.id === 'game-canvas') {
					let temp = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();
					let canvasBB = new Vector4D(0, 0, temp.width, temp.height);
					let mousePos = MasterObject.MO.playerController.MouseToScreen({ target: CanvasDrawer.GCD.mainCanvas, x: e.screenX, y: e.screenY - 80 });
					let characterPos = this.characterOwner.BoxCollision.GetRealCenterPosition();

					if (mousePos.Distance(characterPos) > 72)
						mousePos = characterPos.LerpValue(mousePos, 72);

					if (canvasBB.Inside(mousePos)) {
						const data = JSON.parse(e.dataTransfer.getData('text/plain'));

						if (data.id !== undefined) {
							let droppedItem = document.getElementById(data.id);
							let item = /** @type {Item} */ (Cobject.GetObjectFromUID(data.item));

							if (item !== undefined && droppedItem !== null) {
								droppedItem.id = '';
								//let rect = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();

								var newDroppedItem = new ItemProp(
									item.name,
									mousePos,
									new CAnimation('null', new Vector2D(item.sprite.x, item.sprite.y), new Vector2D(item.sprite.x, item.sprite.y), item.sprite.z, item.sprite.a, AnimationType.Single, 1),
									AtlasController.GetAtlas(item.url).name,
									item
								);

								newDroppedItem.GameBegin();

								this.DropItem(item);
								GameToolbar.RemoveToolbarItem(item);
								this.didInventoryChange = true;
							}
						}
					}
				} else if (e.target.classList.contains('inventory-div') || e.target.classList.contains('panel-middle')) {
					const data = JSON.parse(e.dataTransfer.getData('text/plain'));
					let droppedItem = document.getElementById(data.id);
					let item = /** @type {Item} */ (Cobject.GetObjectFromUID(data.item));

					if (droppedItem !== null) {
						droppedItem.id = '';

						if (item instanceof Item) {
							/*let name = item.name,
								amount = item.GetAmountAsNumber();*/

							item.inventory.RemoveItem(item);
							this.AddItem(item);
						}
					}
				}
				break;

			case 'dragstart':
				e.target.id = 'draggingItem';
				let found = this.inventoryDictionary.GetValueByProperty(e.target.dataset.inventoryItem, 'name');
				if (found !== undefined) {
					let json = JSON.stringify({ id: e.target.id, item: found.UID });// this.inventory[e.target.dataset.inventoryItem].UID });
					e.dataTransfer.setData('text/plain', json);
					e.dataTransfer.dropEffect = 'copy';
				}
				break;
		}
	}
}

export { Inventory };