import {
	Cobject, GUI, Dictionary, EquipabbleItem, CanvasDrawer, Vector4D, CanvasUtility,
	MasterObject, AtlasController, CAnimation, Vector2D, ItemProp, AnimationType,
	inventoryItemIcons, EquipmentSlotType
} from '../../../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class CharacterSheetUI extends Cobject {

	/**
	 * 
	 * @param {Object} owner 
	 */
	constructor(owner) {
		super();

		/** @type {Object.<string, EquipabbleItem>}>} */ this.inventory = {};
		/** @type {HTMLDivElement} */ this.characterSheetHTML = undefined;
		this.characterSheetHTMLList = undefined;
		/** @type {EquipabbleItem} */ this.selectedItem = undefined;
		/** @type {boolean} */ this.isVisible = false;
		/** @type {Object} */ this.characterOwner = owner;
		/** @type {boolean} */ this.didCharacterSheetChange = false;
		/** @type {boolean} */ this.characterSheetSetupDone = false;
		/** @type {Dictionary<EquipabbleItem>} */ this.inventoryDictionary = new Dictionary('name');
		/** @type {Object.<string, EquipabbleItem>} */ this.characterSheetSlotItems = {
			helmet: undefined,
			armor: undefined,
			belt: undefined,
			pants: undefined,
			boots: undefined,
			shoulders: undefined,
			gloves: undefined,
			ring1: undefined,
			ring2: undefined,
			handLeft: undefined,
			amulet: undefined,
			bracers: undefined,
			ring3: undefined,
			ring4: undefined,
			handRight: undefined
		}

		this.SetupSheet();
	}

	SetupSheet() {
		if (document.getElementById('charactersheet-panel') !== null && this.characterSheetSetupDone === false) {
			this.characterSheetHTML = GUI.CreateContainer();

			let template = document.getElementById('charactersheet-panel');
			// @ts-ignore
			let clone = template.content.cloneNode(true);
			this.characterSheetHTMLList = clone.querySelector('div.charactersheet-panel-middle');
			this.characterSheetHTMLList.addEventListener('click', this);

			let equipmentSlots = this.characterSheetHTMLList.querySelectorAll('div.charactersheet-equipment-slot');

			for (let i = 0, l = equipmentSlots.length; i < l; ++i) {
				equipmentSlots[i].addEventListener('dragover', this);
				equipmentSlots[i].addEventListener('drop', this);
			}

			//this.characterSheetHTML.setAttribute('droppable', 'true');
			//this.characterSheetHTML.addEventListener('drop', this);
			//this.characterSheetHTML.addEventListener('dragover', this);

			this.characterSheetHTML.appendChild(clone);
			this.characterSheetHTML.classList.add('charactersheet-div');
			document.getElementById('game-gui').appendChild(this.characterSheetHTML);

			this.characterSheetSetupDone = true;
		} else
			window.requestAnimationFrame(() => this.SetupSheet());
	}

	/**
	 * 
	 * @param {EquipabbleItem} item 
	 */
	AddItem(item) {

		//@ts-ignore
		item.inventory = this;
		this.inventoryDictionary.AddValue(item, 'UID');
		this.characterSheetSlotItems[item.equipmentSlotType] = item;
		item.EquipItem(this.characterOwner);

		this.didCharacterSheetChange = true;
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {EquipmentSlotType} slotType
	 */
	AddNewItem(name, slotType = EquipmentSlotType.armor) {
		let found = this.inventoryDictionary.GetValueByProperty(name, 'name');
		if (found === undefined) {
			/** @type {EquipabbleItem} */ let newItem = new EquipabbleItem(name, slotType);

			this.inventoryDictionary.AddValue(newItem, 'UID');
			//@ts-ignore
			newItem.inventory = this;
			this.characterSheetSlotItems[slotType] = newItem;
			newItem.EquipItem(this.characterOwner);
		}

		this.didCharacterSheetChange = true;
	}

	/**
	 * 
	 * @param {EquipabbleItem} item 
	 */
	RemoveItem(item) {
		if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {
			this.inventoryDictionary.RemoveValue(this.inventoryDictionary.GetHashByProperty(item.UID, 'UID'));

			if (this.characterSheetSlotItems[item.equipmentSlotType] !== undefined) {
				let foundDiv = this.characterSheetHTMLList.querySelector('div[data-slotType=' + '"' + EquipmentSlotType[item.equipmentSlotType] + '"' + ']');

				if (foundDiv !== undefined && foundDiv.children.length > 0) {
					foundDiv.children[0].remove();
				}

				this.characterSheetSlotItems[item.equipmentSlotType].UnequipItem(this.characterOwner);
				this.characterSheetSlotItems[item.equipmentSlotType] = undefined;
			}
		}
		this.didCharacterSheetChange = true;
	}

	/**
	 * 
	 * @param {EquipabbleItem} item 
	 */
	DropItem(item) {
		if (this.inventoryDictionary.GetHashByProperty(item.UID, 'UID')) {

			let found = this.inventoryDictionary.GetHashByProperty(item.UID, 'UID');
			if (found !== undefined)
				this.inventoryDictionary.RemoveValue(found);

			this.didCharacterSheetChange = true;
		}
	}

	DisplayCharacterSheet() {
		//this.characterSheetHTMLList.innerHTML = '';
		let keys = Object.keys(this.characterSheetSlotItems);

		for (let i = 0, l = keys.length; i < l; ++i) {
			const value = this.characterSheetSlotItems[keys[i]];

			if (value === undefined)
				continue;

			if (value !== null) {
				let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[value.name].sprite.x * 32, inventoryItemIcons[value.name].sprite.y * 32, inventoryItemIcons[value.name].sprite.z, inventoryItemIcons[value.name].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[value.name].url));
				image.removeAttribute('heigth');
				image.removeAttribute('width');

				image.dataset.inventoryItem = value.name;
				image.setAttribute('draggable', 'true');
				image.addEventListener('dragstart', this);

				let foundDiv = this.characterSheetHTMLList.querySelector('div[data-slotType=' + '"' + EquipmentSlotType[keys[i]] + '"' + ']');
				if (foundDiv !== undefined && foundDiv.children.length > 0) {
					foundDiv.children[0].remove();
				}

				this.characterSheetHTMLList.querySelector('div[data-slotType=' + '"' + keys[i] + '"' + ']').appendChild(image);
			}
		}
		this.didCharacterSheetChange = false;
	}

	/**
	 * 
	 * @param {boolean} visibility 
	 */
	ShowCharacterSheet(visibility = !this.isVisible) {
		this.characterSheetHTML.style.display = (visibility === true ? 'flex' : 'none');
		this.isVisible = visibility;
		this.selectedItem = undefined;
	}

	FixedUpdate() {
		super.FixedUpdate();

		if (this.didCharacterSheetChange === true && this.characterSheetSetupDone === true) {
			this.DisplayCharacterSheet();
		}
	}

	CEvent(eventType, key, data) {
		switch (eventType) {
			case 'input':
				if (key === 'k' && data.eventType === 2) {
					this.ShowCharacterSheet();
				}
				break;
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				if (e.target.classList.contains('charactersheet-item') === true) {
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
							let item = /** @type {EquipabbleItem} */ (Cobject.GetObjectFromUID(data.item));

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
								this.didCharacterSheetChange = true;
							}
						}
					}
				} else if (e.target.classList.contains('charactersheet-equipment-slot-icon') === true) {
					const data = JSON.parse(e.dataTransfer.getData('text/plain'));
					let droppedItem = document.getElementById(data.id);
					let item = /** @type {EquipabbleItem} */ (Cobject.GetObjectFromUID(data.item));

					if (droppedItem !== null)
						droppedItem.id = '';

					if (item instanceof EquipabbleItem) {
						item.inventory.RemoveItem(item);

						if (this.characterSheetSlotItems[item.equipmentSlotType] !== undefined) {
							item.inventory.AddItem(this.characterSheetSlotItems[item.equipmentSlotType]);
							this.RemoveItem(this.characterSheetSlotItems[item.equipmentSlotType]);
						}

						this.AddItem(item);
					}
				}
				break;

			case 'dragstart':
				e.target.id = 'draggingItem';
				let found = this.inventoryDictionary.GetValueByProperty(e.target.dataset.inventoryItem, 'name');
				if (found !== undefined) {
					//@ts-ignore
					found.inventory = this;
					let json = JSON.stringify({ id: e.target.id, item: found.UID });// this.inventory[e.target.dataset.inventoryItem].UID });
					e.dataTransfer.setData('text/plain', json);
					e.dataTransfer.dropEffect = 'copy';
				}
				break;
		}
	}
}

export { CharacterSheetUI };