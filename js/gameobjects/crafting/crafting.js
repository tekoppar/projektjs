import {
	Cobject, InputHandler, GameToolbar, GUI, Item, CraftingRecipes, CraftingRecipe, CanvasUtility,
	AtlasController, inventoryItemIcons, CraftingCategory, Mastertime, StringUtility
} from '../../internal.js';

/**
 * @class
 * @constructor
 * @extends Cobject
 */
class Crafting extends Cobject {

	/**
	 * 
	 * @param {Object} owner 
	 * @param {string} craftingName 
	 * @param {Object.<string, CraftingRecipe>} recipeList 
	 */
	constructor(owner, craftingName = 'Crafting', recipeList = CraftingRecipes.CraftingRecipeList) {
		super();
		/** @type {Object.<string, Item>} */ this.crafting = {};
		/** @type {string} */ this.craftingName = craftingName;
		this.owner = owner;
		/** @type {boolean} */ this.isVisible = false;
		this.craftingHTML;
		this.craftingHTMLList;
		/** @type {boolean} */ this.didCraftingChange = false;
		/** @type {boolean} */ this.craftingSetupDone = false;
		/** @type {CraftingRecipe} */ this.craftingRecipe = undefined;
		/** @type {number} */ this.craftingTime = 0;
		/** @type {boolean} */ this.isCrafting = false;
		/** @type {Object.<string, CraftingRecipe>} */ this.recipeList = recipeList;
		this.characterUser = undefined;
	}

	SetupCrafting() {
		if (document.getElementById('crafting-panel') !== null) {
			this.craftingHTML = GUI.CreateContainer();
			this.craftingHTML.classList.add('center-absolute');

			let template = document.getElementById('crafting-panel');
			//@ts-ignore
			let clone = template.content.cloneNode(true);
			this.craftingHTMLList = clone.querySelector('div.crafting-item-list');
			this.craftingHTMLList.addEventListener('click', this);

			this.craftingHTML.appendChild(clone);
			document.getElementById('game-gui').appendChild(this.craftingHTML);

			let craftingButton = this.craftingHTML.querySelector('button.crafting-button-craft');
			craftingButton.addEventListener('click', this);

			let craftingNameDiv = this.craftingHTML.querySelector('div.panel-name');
			craftingNameDiv.innerText = this.craftingName;

			InputHandler.GIH.AddListener(this);
			this.craftingSetupDone = true;
		} else
			window.requestAnimationFrame(() => this.SetupCrafting());
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	AddItem(item) {
		if (this.crafting[item.name] !== undefined) {
			this.crafting[item.name].AddAmount(Number(item.amount));
		} else {
			this.crafting[item.name] = item;
		}
		this.didCraftingChange = true;
	}

	/**
	 * 
	 * @param {string} name 
	 * @param {number} amount 
	 */
	AddNewItem(name, amount = 0) {
		if (this.crafting[name] === undefined) {
			let newItem = new Item(name, 0);

			if (newItem.isStackable === true)
				newItem.AddAmount(amount);

			this.AddItem(newItem);
		} else {
			this.crafting[name].AddAmount(amount);
			this.didCraftingChange = true;
		}
	}

	/**
	 * 
	 * @param {Item} item 
	 */
	RemoveItem(item) {
		if (this.crafting[item.name] !== undefined) {
			if (this.crafting[item.name].GetAmount() > 1)
				this.crafting[item.name].RemoveAmount(Number(item.amount));

			if (this.crafting[item.name].GetAmount() <= 1) {
				delete this.crafting[item.name];
				GameToolbar.RemoveToolbarItem(item);
			}
		} else {
			delete this.crafting[item.name];
			GameToolbar.RemoveToolbarItem(item);
		}
		this.didCraftingChange = true;
	}

	SetupCategories() {
		this.craftingHTMLList.innerHTML = '';

		let keys = Object.keys(CraftingCategory);

		for (let i = 0, l = keys.length; i < l; ++i) {
			let categoryEl = document.createElement('div');
			categoryEl.className = 'crafting-category-container';
			categoryEl.classList.add('crafting-' + keys[i]);
			let labelEl = document.createElement('label');
			labelEl.innerText = StringUtility.NameToDisplayName(keys[i]);
			labelEl.className = 'category-name';
			categoryEl.appendChild(labelEl);

			this.craftingHTMLList.appendChild(categoryEl);
		}
	}

	DisplayCrafting() {
		let keys = Object.keys(this.recipeList);

		this.SetupCategories();
		let categoryNames = Object.keys(CraftingCategory);
		for (let i = 0, l = keys.length; i < l; ++i) {
			let template = document.getElementById('crafting-panel-item');
			//@ts-ignore
			let clone = template.content.cloneNode(true);

			if (this.recipeList[keys[i]] !== null) {
				let recipe = this.recipeList[keys[i]];

				let div = /** @type {HTMLDivElement} */ (clone.querySelector('div.inventory-item'));
				let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[keys[i]].sprite.x * 32, inventoryItemIcons[keys[i]].sprite.y * 32, inventoryItemIcons[keys[i]].sprite.z, inventoryItemIcons[keys[i]].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[keys[i]].url));
				image.removeAttribute('heigth');
				image.removeAttribute('width');
				div.appendChild(image);

				div.dataset.craftingItem = recipe.name;
				this.craftingHTMLList.querySelector('div.crafting-' + categoryNames[recipe.category]).appendChild(clone);
			}
		}

		for (let i = 0, l = categoryNames.length; i < l; ++i) {
			let category = this.craftingHTMLList.querySelector('div.crafting-' + categoryNames[i]);

			if (category.children.length <= 1)
				category.remove();
		}

		this.didCraftingChange = false;
	}

	ShowRecipe() {
		if (this.craftingRecipe !== undefined) {
			let itemNameDiv = this.craftingHTML.querySelector('div.crafting-item-name');
			itemNameDiv.innerText = this.craftingRecipe.displayName;

			let container = this.craftingHTML.querySelector('div.frame-circle');
			let image = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[this.craftingRecipe.name].sprite.x * 32, inventoryItemIcons[this.craftingRecipe.name].sprite.y * 32, inventoryItemIcons[this.craftingRecipe.name].sprite.z, inventoryItemIcons[this.craftingRecipe.name].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[this.craftingRecipe.name].url));
			image.classList.add('crafting-item-sprite', 'crafting-item-details-sprite');
			container.innerHTML = '';
			image.removeAttribute('height');
			image.removeAttribute('width');
			container.appendChild(image);


			let template = document.getElementById('crafting-panel-resource'),
				itemResourcesDiv = this.craftingHTML.querySelector('div.crafting-item-resources');
			itemResourcesDiv.innerHTML = '';

			for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
				//@ts-ignore
				let clone = template.content.cloneNode(true);

				let text = '';

				if (this.characterUser.inventory !== undefined) {
					if (this.craftingRecipe.resourceList[i].amount > 0)
						text += this.characterUser.inventory.GetItemAmount(this.craftingRecipe.resourceList[i].item.resource) + '/' + this.craftingRecipe.resourceList[i].amount;
					text += ' - ' + this.craftingRecipe.resourceList[i].item.name;
				}

				clone.querySelector('label.crafting-item-text').innerText = text;

				let div = clone.querySelector('div.inventory-item-32');
				let resourceImage = CanvasUtility.CanvasPortionToImage(inventoryItemIcons[this.craftingRecipe.resourceList[i].item.resource].sprite.x * 32, inventoryItemIcons[this.craftingRecipe.resourceList[i].item.resource].sprite.y * 32, inventoryItemIcons[this.craftingRecipe.resourceList[i].item.resource].sprite.z, inventoryItemIcons[this.craftingRecipe.resourceList[i].item.resource].sprite.a, AtlasController.GetAtlas(inventoryItemIcons[this.craftingRecipe.resourceList[i].item.resource].url));
				resourceImage.classList.add('inventory-item-sprite-32');
				resourceImage.removeAttribute('height');
				resourceImage.removeAttribute('width');
				div.appendChild(resourceImage);

				itemResourcesDiv.appendChild(clone);
			}

			this.didCraftingChange = true;
		}
	}

	/**
	 * 
	 * @param {boolean} visibility 
	 */
	ShowCrafting(visibility = !this.isVisible) {
		this.craftingHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
		this.isVisible = visibility;
		this.didCraftingChange = true;

		if (this.isVisible) {
			this.DisplayCrafting();
			this.ShowRecipe();
		}
	}

	CraftItem() {
		if (this.craftingRecipe !== undefined) {
			for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
				if (this.characterUser.inventory.HasItemAmount(this.craftingRecipe.resourceList[i].item.resource, this.craftingRecipe.resourceList[i].amount) === false) {
					return;
				}
			}

			for (let i = 0, l = this.craftingRecipe.resourceList.length; i < l; ++i) {
				if (this.craftingRecipe.resourceList[i].amount > 0)
					this.characterUser.inventory.RemoveAmount(this.craftingRecipe.resourceList[i].item.resource, this.craftingRecipe.resourceList[i].amount);
			}

			this.isCrafting = true;
			this.ShowRecipe();
		}
	}

	/**
	 * 
	 * @param {number} time 
	 */
	SetProgressbar(time) {
		let progressDiv = this.craftingHTML.querySelector('div.crafting-progress-bar-progresss');
		progressDiv.style.width = (128 * (time / this.craftingRecipe.time)) + 'px';
	}

	CraftingDone() {
		if (this.craftingTime < this.craftingRecipe.time) {
			this.craftingTime += Mastertime.Delta();
			this.SetProgressbar(this.craftingTime);
		} else {
			this.characterUser.inventory.AddNewItem(this.craftingRecipe.name, this.craftingRecipe.amount);
			this.isCrafting = false;
			this.craftingTime = 0;
			let progressDiv = this.craftingHTML.querySelector('div.crafting-progress-bar-progresss');
			progressDiv.style.width = '0px';
		}
	}

	FixedUpdate() {
		if (this.isCrafting === true) {
			this.CraftingDone();
		}

		if (this.isVisible === true && this.characterUser !== undefined) {
			if (this.owner.position.Distance(this.characterUser.position) > 60) {
				this.ShowCrafting(false);
			}
		}

		super.FixedUpdate();
	}

	CEvent(eventType, key) {
		switch (eventType) {
			case 'use':
				if (key !== undefined && key.inventory !== undefined) {
					this.ShowCrafting();
					this.characterUser = key;
				}
				break;
		}
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click':
				if (e.target.classList.contains('crafting-button-craft') === true && this.isCrafting === false) {
					this.CraftItem();
				} else {
					if (this.isCrafting === false)
						this.craftingRecipe = this.recipeList[e.target.dataset.craftingItem];
					this.ShowRecipe();
				}
				break;
		}
	}
}

export { Crafting };