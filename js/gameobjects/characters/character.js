import { GameObject, Inventory, ItemStats, Vector2D, BoxCollision, ObjectsHasBeenInitialized, CollisionHandler, OperationType, CMath, ParticleSystem, Rectangle, ColorParticle, ParticleFilters, ParticleGeneratorSettings, ParticleType, AnimationType, CanvasDrawer } from '../../internal.js';

const FacingDirection = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3,
    ToString: function (x) {
        switch (x) {
            case 0: return 'Left';
            case 1: return 'Right';
            case 2: return 'Up';
            case 3: return 'Down';
        }
    }
};

class CharacterAttachments extends GameObject {
    constructor(position, spriteSheet, name, drawIndex = 0, animations = undefined, skeletonBones = undefined) {
        super(name, position, false, drawIndex);
        this.spriteSheet = spriteSheet;
        this.animations = animations;
        this.currentAnimation = undefined;
        this.skeletonBones = skeletonBones;
        this.name = name;
        this.offset = new Vector2D(0, 0);
    }

    ChangeAnimation(animation, mustExist = false) {
        if (this.animations !== undefined && this.animations[animation.name] !== undefined) {
            this.currentAnimation = this.animations[animation.name].Clone();
        } else if (mustExist === false) {
            if (this.currentAnimation !== animation)
                this.currentAnimation = animation;
        } else {
            this.currentAnimation = undefined;
        }
    }

    LoadAtlas() {
        if (ObjectsHasBeenInitialized === false) {
            window.requestAnimationFrame(() => this.LoadAtlas());
        } else {
            CanvasDrawer.GCD.LoadNewSpriteAtlas(this.spriteSheet, 32, this.canvasName);
        }
    }

    FixedUpdate() {
        super.FixedUpdate();
    }
}

class CharacterStats {
    constructor(maxHealth) {
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }
}

const AttributeEnum = {
    Strength: 0,
    Constitution: 1,
    Dexterity: 2,
    Agility: 3,
    Intelligence: 4,
    Wisdom: 5,
    Charisma: 6
}

class CharacterAttributes {
    constructor(strength, constituion, dexterity, agility, intelligence, wisdom, luck, charisma) {
        this.Strength = strength;
        this.Constitution = constituion;
        this.Dexterity = dexterity;
        this.Agility = agility;
        this.Intelligence = intelligence;
        this.Wisdom = wisdom;
        this.Luck = luck;
        this.Charisma = charisma;

        this.CharacterStats = new CharacterStats(this.Constitution * 17);
        this.CalculateStats();
    }

    IncreaseAttribute(attribute = AttributeEnum.Strength, value = 1) {
        switch (attribute) {
            case AttributeEnum.Strength: this.Strength += value; break;
            case AttributeEnum.Constitution: this.Constitution += value; break;
            case AttributeEnum.Dexterity: this.Dexterity += value; break;
            case AttributeEnum.Agility: this.Agility += value; break;
            case AttributeEnum.Intelligence: this.Intelligence += value; break;
            case AttributeEnum.Wisdom: this.Wisdom += value; break;
            case AttributeEnum.Luck: this.Luck += value; break;
            case AttributeEnum.Charisma: this.Charisma += value; break;
        }

        this.CalculateStats();
    }

    CalculateStats() {
        let percent = this.CharacterStats.health / this.CharacterStats.maxHealth;
        this.CharacterStats.maxHealth = this.Constitution * 17;
        this.CharacterStats.health = percent * this.CharacterStats.maxHealth;
    }

    UpdateHealth(value) {
        this.CharacterStats.health += Number(value);
    }

    GetHealth() {
        return this.CharacterStats.health;
    }

    GetDamage() {
        return CMath.RandomFloat(this.Strength * 0.69 + this.Dexterity * 0.34, this.Strength * 1.72 + this.Dexterity * 0.41);
    }
}


class Character extends GameObject {
    constructor(spriteSheet, spriteSheetName, drawIndex = 0, position = new Vector2D(0, 0), animations = undefined, characterAttributes = new CharacterAttributes(5, 5, 5, 5, 5, 5, 0, 0), controller = undefined) {
        super(spriteSheetName, position, false, drawIndex);
        this.controller = controller;
        this.characterData = new CharacterData();
        this.characterAttributes = characterAttributes;
        this.spriteSheet = spriteSheet;
        this.animations = animations;
        this.currentAnimation = undefined;
        this.shadowAttachment = new CharacterAttachments(this.position, './content/sprites/lpc_shadow.png', 'shadow');
        this.itemAttachment = undefined;
        this.attachments = {};
        this.isRunning = false;
        this.isIdle = false;
        this.BlockingCollision = new BoxCollision(this.GetPosition(), new Vector2D(16, 16), true, this, true);
    }

    AddAttachment(atlas, name, drawIndex, animations = undefined) {
        let newAttachment = new CharacterAttachments(this.position, atlas, name, drawIndex, animations);
        newAttachment.GameBegin();
        this.attachments[name] = newAttachment;
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation === undefined || this.currentAnimation.name != animation.name) {
            this.currentAnimation = animation;

            if (animation.animationType === AnimationType.Idle)
                this.isIdle = true;

            if (this.shadowAttachment !== undefined)
                this.shadowAttachment.ChangeAnimation(animation.Clone());

            this.size = this.BoxCollision.size = new Vector2D(animation.h, animation.w);
            this.BoxCollision.CalculateBoundingBox();
            this.BoxCollision.position = this.GetPosition();

            if (this.itemAttachment !== undefined) {
                this.itemAttachment.ChangeAnimation(animation.Clone(), true);
                this.itemAttachment.BoxCollision.CalculateBoundingBox();
                this.itemAttachment.BoxCollision.position = this.GetPosition();
                this.itemAttachment.size = this.itemAttachment.BoxCollision.size = new Vector2D(32, 32);// new Vector2D(animation.h, animation.w);
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                this.attachments[keys[i]].ChangeAnimation(animation.Clone());
                this.attachments[keys[i]].BoxCollision.CalculateBoundingBox();
                this.attachments[keys[i]].BoxCollision.position = this.GetPosition();
                this.attachments[keys[i]].size = this.attachments[keys[i]].BoxCollision.size = new Vector2D(animation.h, animation.w);
            }
        }
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);

        if (this.shadowAttachment !== undefined && this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.FlagDrawingUpdate(position);

        if (this.itemAttachment !== undefined && this.itemAttachment.drawingOperation !== undefined)
            this.itemAttachment.FlagDrawingUpdate(position);

        let keys = Object.keys(this.attachments);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].FlagDrawingUpdate(position);
        }
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);

        if (this.drawingOperation !== undefined)
            this.FlagDrawingUpdate(position);

        if (this.shadowAttachment !== undefined && this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.FlagDrawingUpdate(position);

        if (this.itemAttachment !== undefined && this.itemAttachment.drawingOperation !== undefined)
            this.itemAttachment.FlagDrawingUpdate(position);

        let keys = Object.keys(this.attachments);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].FlagDrawingUpdate(position);
        }
    }

    PlayAnimation() {
        if (this.currentAnimation === undefined)
            return;

        let frame = this.currentAnimation.GetFrame();

        if (frame !== null) {
            this.NeedsRedraw(this.GetPosition());

            if (this.shadowAttachment !== undefined) {
                this.shadowAttachment.position = this.position.Clone();
                this.shadowAttachment.CreateDrawOperation(this.shadowAttachment.currentAnimation.GetFrame(), this.GetPosition(), false, this.shadowAttachment.canvas, OperationType.gameObjects);
            }

            if (this.itemAttachment !== undefined && this.itemAttachment.currentAnimation !== undefined) {
                if (this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame] !== undefined) {
                    this.itemAttachment.offset.x = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].x;
                    this.itemAttachment.offset.y = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].y;
                    this.itemAttachment.CreateDrawOperation(
                        this.itemAttachment.currentAnimation.GetFrame(),
                        new Vector2D(this.GetPosition().x + this.itemAttachment.offset.x, this.GetPosition().y + this.itemAttachment.offset.y),
                        false,
                        this.itemAttachment.canvas,
                        OperationType.gameObjects
                    );
                }

                this.itemAttachment.position = this.GetPosition();// this.position.Clone();
                this.itemAttachment.position.y -= 64;
                this.itemAttachment.drawingOperation.oldPosition.x += this.itemAttachment.offset.x;
                this.itemAttachment.drawingOperation.oldPosition.y += this.itemAttachment.offset.y;
                this.itemAttachment.drawingOperation.collisionSize = new Vector2D(32, 64 - this.itemAttachment.offset.y);
            }

            this.CreateDrawOperation(frame, this.GetPosition(), true, this.canvas, OperationType.gameObjects);

            let facingDirection = this.GetFacingDirection();
            switch (facingDirection) {
                case FacingDirection.Up:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 2;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 1;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 0;
                    break;

                case FacingDirection.Left:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 1;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;

                case FacingDirection.Right:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 1;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;

                case FacingDirection.Down:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 1;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                this.attachments[keys[i]].position = this.position.Clone();

                if (this.attachments[keys[i]].currentAnimation !== undefined) {
                    this.attachments[keys[i]].CreateDrawOperation(
                        this.attachments[keys[i]].currentAnimation.GetFrame(),
                        this.GetPosition(),
                        false,
                        this.attachments[keys[i]].canvas,
                        OperationType.gameObjects
                    );
                }
            }
        } else {
            if (this.shadowAttachment !== undefined)
                this.shadowAttachment.currentAnimation.GetFrame();

            if (this.itemAttachment !== undefined && this.itemAttachment.currentAnimation !== undefined) {
                this.itemAttachment.CreateDrawOperation(
                    this.itemAttachment.currentAnimation.GetFrame(),
                    new Vector2D(
                        this.GetPosition().x + this.itemAttachment.offset.x,
                        this.GetPosition().y + this.itemAttachment.offset.y,
                    ),
                    false,
                    this.itemAttachment.canvas,
                    OperationType.gameObjects
                );
                this.itemAttachment.drawingOperation.Update(new Vector2D(this.GetPosition().x + this.itemAttachment.offset.x, this.GetPosition().y + this.itemAttachment.offset.y));
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                if (this.attachments[keys[i]].currentAnimation !== undefined)
                    this.attachments[keys[i]].currentAnimation.GetFrame();
            }
        }
    }

    CheckAnimation() {
        let facingDirection = this.GetFacingDirection();

        if (this.currentAnimation !== undefined && this.currentAnimation.animationFinished === true) {
            this.isIdle = false;
        }

        if (this.currentAnimation !== undefined && this.currentAnimation.AnimationLocked() === true)
            return;

        if (facingDirection !== undefined) {
            switch (facingDirection) {
                case FacingDirection.Left:
                    if (this.Velocity.x === 1) {
                        this.isIdle = false;
                        if (this.isRunning === true && this.animations.runLeft !== undefined)
                            this.ChangeAnimation(this.animations.runLeft.Clone());
                        else if (this.animations.walkLeft !== undefined)
                            this.ChangeAnimation(this.animations.walkLeft.Clone());
                    }
                    else if (this.animations.walkLeftIdle !== undefined && this.isIdle === false) {
                        this.ChangeAnimation(this.animations.walkLeftIdle.Clone());
                        this.isIdle = true;
                    }
                    break;
                case FacingDirection.Right:
                    if (this.Velocity.x === -1) {
                        this.isIdle = false;
                        if (this.isRunning === true && this.animations.runRight !== undefined)
                            this.ChangeAnimation(this.animations.runRight.Clone());
                        else if (this.animations.walkRight !== undefined)
                            this.ChangeAnimation(this.animations.walkRight.Clone());
                    }
                    else if (this.animations.walkRightIdle !== undefined && this.isIdle === false) {
                        this.ChangeAnimation(this.animations.walkRightIdle.Clone());
                        this.isIdle = true;
                    }
                    break;
                case FacingDirection.Up:
                    if (this.Velocity.y === 1) {
                        this.isIdle = false;
                        if (this.isRunning === true && this.animations.runUp !== undefined)
                            this.ChangeAnimation(this.animations.runUp.Clone());
                        else if (this.animations.walkUp !== undefined)
                            this.ChangeAnimation(this.animations.walkUp.Clone());
                    }
                    else if (this.animations.walkUpIdle !== undefined && this.isIdle === false) {
                        this.ChangeAnimation(this.animations.walkUpIdle.Clone());
                        this.isIdle = true;
                    }
                    break;
                case FacingDirection.Down:
                    if (this.Velocity.y === -1) {
                        this.isIdle = false;
                        if (this.isRunning === true && this.animations.runDown !== undefined)
                            this.ChangeAnimation(this.animations.runDown.Clone());
                        else if (this.animations.walkDown !== undefined)
                            this.ChangeAnimation(this.animations.walkDown.Clone());
                    }
                    else if (this.animations.walkDownIdle !== undefined && this.isIdle === false) {
                        this.ChangeAnimation(this.animations.walkDownIdle.Clone());
                        this.isIdle = true;
                    }
                    break;
            }
        }
    }

    UpdateMovement() {
        if (this.currentAnimation.AnimationLocked() === true)
            return;

        if (this.Velocity.x !== 0 || this.Velocity.y !== 0) {
            if (this.drawingOperation !== undefined)
                this.NeedsRedraw(this.previousPosition);

            this.BoxCollision.position = this.GetPosition();
            this.BoxCollision.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));

            this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
            this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, y: this.BlockingCollision.size.y - this.BlockingCollision.size.y });

            if (this.CheckCollision() === true) {
                this.previousPosition = this.GetPosition();
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
            } else {
                this.BoxCollision.position = this.GetPosition();
                this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
                this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, y: this.BlockingCollision.size.y - this.BlockingCollision.size.y });
            }
        }
    }

    UpdateCollision(position) {
        this.BoxCollision.position = position;
        this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
        this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, y: 32 });
    }

    CheckCollision() {
        return CollisionHandler.GCH.CheckCollisions(this.BlockingCollision);
    }

    GetFacingDirection() {
        if (this.Direction.x !== 0) {
            if (this.Direction.x === 1)
                return FacingDirection.Left;
            else
                return FacingDirection.Right;
        } else if (this.Direction.y !== 0) {
            if (this.Direction.y === 1)
                return FacingDirection.Up;
            else
                return FacingDirection.Down;
        }
    }

    GameBegin() {
        super.GameBegin();

        if (this.animations !== undefined && this.animations.walkLeftIdle !== undefined) {
            this.Direction.x = -1;
            this.UpdateCollision(this.GetPosition());
            this.CheckAnimation();
            this.PlayAnimation();
        }
    }

    FixedUpdate() {
        super.FixedUpdate();
        this.CheckAnimation();

        if (this.currentAnimation !== undefined) {
            this.PlayAnimation();
        }

        this.UpdateMovement();
    }

    OnHit(damage, source) {
        super.OnHit(damage, source);

        this.characterAttributes.UpdateHealth(damage);

        let bloodParticles = new ParticleSystem(
            [new ColorParticle(/*'#63758a9d'*/ '#ac0e23d8', new Rectangle(0, 0, 1, 3))],
            new Vector2D(64, 64),
            this.BoxCollision.GetCenterPositionV2().Clone(),
            [
                new ParticleFilters.ParticleFilterRandomPosition(new Vector2D(0, 0), new Vector2D(8, 1)),
                new ParticleFilters.ParticleFilter2DMovement(new Vector2D(0.3, 1), new Vector2D(1, 1)),
                new ParticleFilters.ParticleFilterRotate(0, 45, true),
                new ParticleFilters.ParticleFilterSize(new Vector2D(0, 1)),
                new ParticleFilters.ParticleFilterFadeSize(0, 1, 1, true)
            ],
            0.5
        )

        bloodParticles.SetupGenerator(new ParticleGeneratorSettings(15, 0, 1, ParticleType.Color));

        if (this.characterAttributes.GetHealth() <= 0) {
            this.Delete();
        }
    }

    UpdateDirection(direction, value) {
        if (this.currentAnimation.AnimationLocked() === true)
            return;

        switch (direction) {
            case 'x':
                this.Velocity.x = this.Direction.x = value;
                this.Direction.y = 0;
                break;

            case 'y':
                this.Velocity.y = this.Direction.y = value;
                this.Direction.x = 0;
                break;
        }

        this.NeedsRedraw(this.GetPosition());
    }

    StopMovement() {
        this.Velocity.x = this.Velocity.y = 0;
        this.NeedsRedraw(this.GetPosition());
    }

    SetMovement(type, speed) {
        if (this.currentAnimation.AnimationLocked() === true)
            return;

        switch (type) {
            case 'running': this.isRunning = true; break;
            case 'walking': this.isRunning = false; break;
        }

        this.MovementSpeed.y = this.MovementSpeed.x = speed;
        this.NeedsRedraw(this.GetPosition());
    }

    Interact() {
        let overlaps = CollisionHandler.GCH.GetInRange(this.BoxCollision, 100);

        for (let overlap of overlaps) {
            if (overlap.CEvent !== undefined)
                overlap.CEvent('use', this);
        }
    }

    SetActiveItem(item) {
        if (item === undefined)
            return;

        this.activeItem = item;

        if (this.controller !== undefined)
            this.controller.TogglePreviewCursor(item.drawTilePreview);

        if (ItemStats[this.activeItem.name] !== undefined && ItemStats[this.activeItem.name].atlas !== undefined) {
            this.itemAttachment = new CharacterAttachments(this.position, undefined, this.activeItem.name, 1, ItemStats[this.activeItem.name].animation, ItemStats[this.activeItem.name].bones);
            this.itemAttachment.GameBegin();
            this.itemAttachment.ChangeAnimation(this.currentAnimation.Clone(), true);

            if (this.itemAttachment !== undefined && this.itemAttachment.currentAnimation !== undefined) {
                if (this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame] !== undefined) {
                    this.itemAttachment.offset.x = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].x;
                    this.itemAttachment.offset.y = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].y;
                    this.itemAttachment.CreateDrawOperation(
                        this.itemAttachment.currentAnimation.GetFrame(),
                        new Vector2D(this.GetPosition().x + this.itemAttachment.offset.x, this.GetPosition().y + this.itemAttachment.offset.y),
                        false,
                        this.itemAttachment.canvas,
                        OperationType.gameObjects
                    );
                }

                this.itemAttachment.position = this.GetPosition();// this.position.Clone();
                //this.itemAttachment.position.y -= 64;
                if (this.itemAttachment.drawingOperation !== undefined)
                    this.itemAttachment.drawingOperation.collisionSize = new Vector2D(64, 64 - this.itemAttachment.offset.y);
            }

            this.itemAttachment.currentAnimation.SetFromAnimation(this.currentAnimation);
        }
    }

    UseItem(data) {
        if (this.activeItem !== undefined) {
            if (this.currentAnimation.AnimationLocked() === true)
                return;

            this.activeItem.UseItem(new BoxCollision(data.position, this.size, this.enableCollision, this, false));

            if (ItemStats[this.activeItem.name] !== undefined && ItemStats[this.activeItem.name].animation !== undefined) {
                let direction = this.GetFacingDirection();

                if (this.animations[ItemStats[this.activeItem.name].characterAnimation + FacingDirection.ToString(direction)] !== undefined) {
                    this.ChangeAnimation(this.animations[ItemStats[this.activeItem.name].characterAnimation + FacingDirection.ToString(direction)].Clone());
                }
            }
        }
    }

    LoadAtlas() {
        if (ObjectsHasBeenInitialized === false) {
            window.requestAnimationFrame(() => this.LoadAtlas());
        } else {
            CanvasDrawer.GCD.LoadNewSpriteAtlas(this.spriteSheet, 32, this.canvasName);
        }
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
        }
    }
}

class CharacterData {
    constructor() {
        this.name = 'NPC';
        this.age = 18;
    }
}

class MainCharacter extends Character {
    constructor(spriteSheet, spriteSheetName, name, drawIndex = 0, position = new Vector2D(0, 0), animations = undefined) {
        super(spriteSheet, spriteSheetName, drawIndex, position, animations);
        this.name = name;
        this.inventory = new Inventory(this);
        this.activeItem;
        this.light = undefined;
        this.doOnce = false;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    GameBegin() {
        super.GameBegin();
        //this.light = CanvasDrawer.GCD.lights[0];
        //this.light.position.x = this.position.x;
        //this.light.position.y = this.position.y;
    }

    FlagDrawingUpdate(position) {
        if (this.light !== undefined)
            this.light.SetPosition(this.position);
        super.FlagDrawingUpdate(position);
    }

    NeedsRedraw(position) {
        if (this.light !== undefined)
            this.light.SetPosition(this.position);
        super.NeedsRedraw(position);
    }
}

export { Character, CharacterAttachments, CharacterData, MainCharacter };