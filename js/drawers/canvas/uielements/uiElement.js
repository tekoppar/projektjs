class UIElement {
    constructor(lifeTime = 1) {
        this.drawingOperations = [];
        this.lifeTime = lifeTime;
    }

    AddOperations(delta) {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Update();
            this.drawingOperations[i].GetPosition().y -= delta * 25;

        }
        this.lifeTime -= delta;
    }

    RemoveUI() {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Delete();
        }
    }
}

export { UIElement };