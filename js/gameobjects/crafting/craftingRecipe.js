class CraftingRecipe {
    constructor(name, time, amount, craftingCategory, resourceList) {
        this.name = name;
        this.time = time;
        this.amount = amount
        this.category = craftingCategory;
        this.resourceList = resourceList;
    }
}

export { CraftingRecipe };