import {
    GameObject, Inventory, ItemStats, InputState, UsableItem, Collision, AmbientLight,
    AtlasController, Vector2D, Shadow2D, BoxCollision, CollisionHandler, OperationType, CMath,
    ParticleSystem, Rectangle, ColorParticle, ParticleFilters, ParticleGeneratorSettings,
    ParticleType, AnimationType, BWDrawingType, CAnimation, PlayerController, CustomLogger
} from '../../internal.js';

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
            default: return 'Down';
        }
    }
};

/**
 * @class
 * @constructor
 * @extends GameObject
 */
class CharacterAttachments extends GameObject {

    /**
     * 
     * @param {Vector2D} position 
     * @param {string} name 
     * @param {Number} drawIndex 
     * @param {Object.<string, CAnimation>} animations 
     * @param {*} skeletonBones 
     */
    constructor(position, name, drawIndex = 0, animations = undefined, skeletonBones = undefined) {
        super(name, position, false, drawIndex);
        //this.spriteSheet = spriteSheet;

        /** @type {Object.<string, CAnimation>} */
        this.animations = animations;

        /** @type {CAnimation} */
        this.currentAnimation = undefined;

        this.skeletonBones = skeletonBones;

        /** @type {string} */
        this.name = name;

        /** @type {Vector2D} */
        this.offset = new Vector2D(0, 0);
    }

    /**
     * 
     * @param {CAnimation} animation 
     * @param {boolean} mustExist 
     */
    ChangeAnimation(animation, mustExist = false) {
        if (this.animations !== undefined && this.animations[animation.name] !== undefined) {
            this.currentAnimation = this.animations[animation.name].Clone();
        } else if (mustExist === false) {
            if (this.currentAnimation !== animation)
                this.currentAnimation = animation;
        } else {
            this.currentAnimation = undefined;
        }

        if (this.skeletonBones !== undefined && this.currentAnimation !== undefined && this.skeletonBones[this.currentAnimation.name].bones[this.currentAnimation.currentFrame] !== undefined) {
            if (this.drawingOperation !== undefined && this.drawingOperation.oldPosition !== undefined)
                this.drawingOperation.Update(
                    new Vector2D(
                        this.drawingOperation.oldPosition.x,
                        this.drawingOperation.oldPosition.y
                    )
                );

            this.offset.x = this.skeletonBones[this.currentAnimation.name].bones[this.currentAnimation.currentFrame].x;
            this.offset.y = this.skeletonBones[this.currentAnimation.name].bones[this.currentAnimation.currentFrame].y;
        }
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    PlayAnimaion(position) {
        this.CreateDrawOperation(this.currentAnimation.GetFrame(), position, false, this.canvas, OperationType.gameObjects);

        if (this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType !== BWDrawingType.None)
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile, true);
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.currentAnimation !== undefined && this.currentAnimation.frameUpdate === true && this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType !== BWDrawingType.None) {
            this.drawingOperation.shadowOperation.UpdateShadow();
        }
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType === BWDrawingType.None) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.GenerateShadow();
        }
    }
}

/**
 * @class
 * @constructor
 */
class CharacterStats {
    constructor(maxHealth) {
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }
}

/**
 * @readonly
 * @enum {Number}
 */
const AttributeEnum = {
    Strength: 0,
    Constitution: 1,
    Dexterity: 2,
    Agility: 3,
    Intelligence: 4,
    Wisdom: 5,
    Charisma: 6,
    Luck: 7,
}

/**
 * @class
 * @constructor
 */
class CharacterAttributes {

    /**
     * 
     * @param {Number} strength 
     * @param {Number} constituion 
     * @param {Number} dexterity 
     * @param {Number} agility 
     * @param {Number} intelligence 
     * @param {Number} wisdom 
     * @param {Number} luck 
     * @param {Number} charisma 
     */
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

    /**
     * 
     * @param {AttributeEnum} attribute 
     * @param {Number} value 
     */
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

    /**
     * 
     * @param {Number} value 
     */
    UpdateHealth(value) {
        this.CharacterStats.health += Number(value);
    }

    /**
     * 
     * @returns {Number}
     */
    GetHealth() {
        return this.CharacterStats.health;
    }

    /**
     * 
     * @returns {Number}
     */
    GetDamage() {
        return CMath.RandomFloat(this.Strength * 0.69 + this.Dexterity * 0.34, this.Strength * 1.72 + this.Dexterity * 0.41);
    }
}

/**
 * @class
 * @constructor
 * @extends GameObject
 */
class Character extends GameObject {

    /**
     * 
     * @param {string} spriteSheetName 
     * @param {Number} drawIndex 
     * @param {Vector2D} position 
     * @param {Object.<string, CAnimation>} animations 
     * @param {CharacterAttributes} characterAttributes 
     * @param {PlayerController} controller 
     */
    constructor(spriteSheetName, drawIndex = 0, position = new Vector2D(0, 0), animations = undefined, characterAttributes = new CharacterAttributes(5, 5, 5, 5, 5, 5, 0, 0), controller = undefined) {
        super(spriteSheetName, position, false, drawIndex);

        /** @type {PlayerController} */
        this.controller = controller;

        /** @type {CharacterData} */
        this.characterData = new CharacterData();

        /** @type {CharacterAttributes} */
        this.characterAttributes = characterAttributes;
        //this.spriteSheet = spriteSheet;

        /** @type {Object.<string, CAnimation>} */
        this.animations = animations;

        /** @type {CAnimation} */
        this.currentAnimation = undefined;

        /** @type {CharacterAttachments} */
        this.shadowAttachment = new CharacterAttachments(this.position, 'shadow');
        //this.realTimeShadow = undefined;

        /** @type {CharacterAttachments} */
        this.itemAttachment = undefined;

        /** @type {Object<string, CharacterAttachments>} */
        this.attachments = {};

        /** @type {boolean} */
        this.isRunning = false;

        /** @type {boolean} */
        this.isIdle = false;

        /** @type {BoxCollision} */
        this.BlockingCollision = new BoxCollision(this.GetPosition(), new Vector2D(16, 16), true, this, true);

        /** @type {Shadow2D} */
        this.realtimeShadow = undefined;
    }

    /**
     * 
     * @param {string} name 
     * @param {Number} drawIndex 
     * @param {Object.<string, CAnimation>} animations 
     */
    AddAttachment(name, drawIndex = 0, animations = undefined) {
        let newAttachment = new CharacterAttachments(this.position, name, drawIndex, animations);
        newAttachment.GameBegin();
        this.attachments[name] = newAttachment;
    }

    /**
     * 
     * @param {CAnimation} animation 
     */
    ChangeAnimation(animation) {
        if (this.currentAnimation === undefined || this.currentAnimation.name != animation.name) {
            this.currentAnimation = animation;

            if (animation.animationType === AnimationType.Idle)
                this.isIdle = true;

            if (this.shadowAttachment !== undefined)
                this.shadowAttachment.ChangeAnimation(animation.Clone());

            this.size = this.BoxCollision.size = new Vector2D(animation.h, animation.w);
            this.BoxCollision.SetPosition(this.GetPosition());
            //this.BoxCollision.CalculateBoundingBox();
            //this.BoxCollision.position = this.GetPosition();

            if (this.itemAttachment !== undefined) {
                this.itemAttachment.ChangeAnimation(animation.Clone(), true);
                this.itemAttachment.BoxCollision.SetPosition(this.GetPosition());
                //this.itemAttachment.BoxCollision.CalculateBoundingBox();
                //this.itemAttachment.BoxCollision.position = this.GetPosition();
                this.itemAttachment.size = this.itemAttachment.BoxCollision.size = new Vector2D(32, 32);// new Vector2D(animation.h, animation.w);
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                this.attachments[keys[i]].ChangeAnimation(animation.Clone());
                this.attachments[keys[i]].BoxCollision.SetPosition(this.GetPosition());
                //this.attachments[keys[i]].BoxCollision.CalculateBoundingBox();
                //this.attachments[keys[i]].BoxCollision.position = this.GetPosition();
                this.attachments[keys[i]].size = this.attachments[keys[i]].BoxCollision.size = new Vector2D(animation.h, animation.w);
            }

            if (this.realtimeShadow !== undefined)
                this.realtimeShadow.BoxCollision.SetPosition(this.realtimeShadow.BoxCollision.position);
        }
    }

    /**
     * 
     * @param {Vector2D} position 
     */
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

    /**
     * 
     * @param {Vector2D} position 
     */
    NeedsRedraw(position) {
        super.NeedsRedraw(position);

        this.BoxCollision.SetPosition(this.BoxCollision.position);

        if (this.shadowAttachment !== undefined)
            this.shadowAttachment.BoxCollision.SetPosition(this.shadowAttachment.BoxCollision.position);

        if (this.itemAttachment !== undefined)
            this.itemAttachment.BoxCollision.SetPosition(this.itemAttachment.BoxCollision.position);

        let keys = Object.keys(this.attachments);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (this.attachments[keys[i]] !== undefined)
                this.attachments[keys[i]].BoxCollision.SetPosition(this.attachments[keys[i]].BoxCollision.position);
        }

        if (this.drawingOperation !== undefined)
            this.FlagDrawingUpdate(position);

        if (this.shadowAttachment !== undefined && this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.FlagDrawingUpdate(position);

        if (this.itemAttachment !== undefined && this.itemAttachment.drawingOperation !== undefined)
            this.itemAttachment.FlagDrawingUpdate(position);

        keys = Object.keys(this.attachments);
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].FlagDrawingUpdate(position);
        }

        if (this.drawingOperation !== undefined && this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType !== BWDrawingType.None)
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile, true);

        if (this.realtimeShadow !== undefined)
            this.UpdateRealTimeShadow();
    }

    PlayAnimation() {
        if (this.currentAnimation === undefined)
            return;

        let frame = this.currentAnimation.GetFrame();

        if (frame !== null) {
            this.NeedsRedraw(this.GetPosition());

            if (this.shadowAttachment !== undefined) {
                //this.shadowAttachment.position = this.position.Clone();
                this.shadowAttachment.SetPosition(this.position.Clone());
                this.shadowAttachment.PlayAnimaion(this.GetPosition());
            }

            if (this.itemAttachment !== undefined && this.itemAttachment.currentAnimation !== undefined) {
                //this.itemAttachment.position = this.GetPosition().Clone();
                this.itemAttachment.SetPosition(this.GetPosition());

                if (this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame] !== undefined) {
                    this.itemAttachment.offset.x = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].x;
                    this.itemAttachment.offset.y = this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame].y;
                }
                this.itemAttachment.drawingOperation.Update(new Vector2D(this.GetPosition().x + this.itemAttachment.offset.x, this.GetPosition().y + this.itemAttachment.offset.y));

                if (this.itemAttachment.skeletonBones[this.itemAttachment.currentAnimation.name].bones[this.itemAttachment.currentAnimation.currentFrame] !== undefined) {
                    this.itemAttachment.CreateDrawOperation(
                        this.itemAttachment.currentAnimation.GetFrame(),
                        new Vector2D(
                            this.GetPosition().x + this.itemAttachment.offset.x,
                            this.GetPosition().y + this.itemAttachment.offset.y
                        ),
                        false,
                        this.itemAttachment.canvas,
                        OperationType.gameObjects
                    );

                    this.itemAttachment.drawingOperation.debugDraw = false;
                }
            }

            this.CreateDrawOperation(frame, this.GetPosition(), true, this.canvas, OperationType.gameObjects);

            let facingDirection = this.GetFacingDirection();
            switch (facingDirection) {
                case FacingDirection.Up:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 2;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 2;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 0;
                    break;

                case FacingDirection.Left:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 0;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;

                case FacingDirection.Right:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 0;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;

                case FacingDirection.Down:
                    if (this.attachments.redHair !== undefined)
                        this.attachments.redHair.drawIndex = 0;
                    if (this.itemAttachment !== undefined)
                        this.itemAttachment.drawIndex = 2;
                    if (this.attachments.underDress !== undefined)
                        this.attachments.underDress.drawIndex = 2;
                    break;
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                this.attachments[keys[i]].SetPosition(this.position);
                //this.attachments[keys[i]].position = this.position.Clone();
                this.attachments[keys[i]].PlayAnimaion(this.GetPosition());
            }

            this.UpdateRealTimeShadow();
        } else {
            if (this.shadowAttachment !== undefined)
                this.shadowAttachment.currentAnimation.GetFrame();

            if (this.itemAttachment !== undefined && this.itemAttachment.currentAnimation !== undefined) {
                this.itemAttachment.currentAnimation.GetFrame();
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

    UpdateRealTimeShadow() {
        if (this.realtimeShadow.shadowObject.UpdatedThisFrame === true)
            return;

        if (this.drawingOperation !== undefined && this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType !== BWDrawingType.None)
            this.drawingOperation.shadowOperation.UpdateShadow(this.drawingOperation.tile, true);

        if (this.realtimeShadow !== undefined) {
            this.realtimeShadow.position = this.position.Clone();
            this.realtimeShadow.AddShadow(this.drawingOperation.tile);
            this.realtimeShadow.AddShadow(this.shadowAttachment.drawingOperation.tile);

            let keys = Object.keys(this.attachments);
            for (let i = 0, l = keys.length; i < l; ++i) {
                if (this.attachments[keys[i]] !== undefined && this.attachments[keys[i]].drawingOperation !== undefined)
                    this.realtimeShadow.AddShadow(this.attachments[keys[i]].drawingOperation.tile);
            }

            this.realtimeShadow.UpdateShadow(this.drawingOperation.tile);
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
            this.BoxCollision.position = this.GetPosition();
            this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, y: this.BlockingCollision.size.y - this.BlockingCollision.size.y });

            if (CollisionHandler.GCH.CheckCollisions(this.BlockingCollision) === true) {
                this.previousPosition = this.GetPosition();
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
                this.SetPosition(this.position);
                this.UpdateRealTimeShadow();
            } else {
                this.SetPosition(this.position);
                this.UpdateRealTimeShadow();
            }
        }
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    UpdateCollision(position) {
        this.BoxCollision.position = position;
        this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
        this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x + this.BlockingCollision.size.x * 0.5, y: 32 });
    }

    /**
     * 
     * @returns {Number}
     */
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

        return FacingDirection.Down;
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

    /**
     * 
     * @param {Number} damage 
     * @param {Collision} source 
     */
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

    /**
     * 
     * @param {string} direction 
     * @param {Number} value 
     * @returns {void}
     */
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

        //this.NeedsRedraw(this.GetPosition());
    }

    StopMovement() {
        this.Velocity.x = this.Velocity.y = 0;
        this.NeedsRedraw(this.GetPosition());
    }

    /**
     * 
     * @param {string} type 
     * @param {Number} speed 
     * @returns {void}
     */
    SetMovement(type, speed) {
        if (this.currentAnimation.AnimationLocked() === true)
            return;

        switch (type) {
            case 'running': this.isRunning = true; break;
            case 'walking': this.isRunning = false; break;
        }

        this.MovementSpeed.y = this.MovementSpeed.x = speed;
        //this.NeedsRedraw(this.GetPosition());
    }

    Interact() {
        let overlaps = CollisionHandler.GCH.GetInRange(this.BoxCollision, 100);

        for (let overlap of overlaps) {
            if (overlap.CEvent !== undefined)
                overlap.CEvent('use', this);
        }
    }

    StoppedInteracting() {
        let overlaps = CollisionHandler.GCH.GetInRange(this.BoxCollision, 100);

        for (let overlap of overlaps) {
            if (overlap.CEvent !== undefined)
                overlap.CEvent('useStopped', this);
        }
    }

    /**
     * 
     * @param {UsableItem} item 
     * @returns {void}
     */
    SetActiveItem(item) {
        if (item === undefined)
            return;

        this.activeItem = item;

        if (this.controller !== undefined)
            this.controller.TogglePreviewCursor(item.drawTilePreview);

        if (ItemStats[this.activeItem.name] !== undefined && ItemStats[this.activeItem.name].atlas !== undefined) {
            this.itemAttachment = new CharacterAttachments(this.position, this.activeItem.name, 1, ItemStats[this.activeItem.name].animation, ItemStats[this.activeItem.name].bones);
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

    /**
     * 
     * @param {{eventType: InputState, position: Vector2D}} data 
     * @returns {void}
     */
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

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.gameObjects) {
        super.CreateDrawOperation(frame, position, clear, canvas, operationType, AtlasController.GetAtlas(canvas.id).canvasObject);

        if (this.drawingOperation.shadowOperation !== undefined && this.drawingOperation.shadowOperation.drawType === BWDrawingType.None) {
            this.drawingOperation.shadowOperation.drawType = BWDrawingType.Front;
            this.drawingOperation.shadowOperation.GenerateShadow();

            this.realtimeShadow = new Shadow2D(this, this.canvasName, this.GetPosition(), new Vector2D(frame.w, frame.h), this.drawingOperation.tile);
            this.realtimeShadow.GameBegin();
        }
    }

    //@ts-ignore
    CEvent(eventType, key, data) {
        switch (eventType) {
        }
    }
}

/**
 * @class
 * @constructor
 */
class CharacterData {
    constructor() {
        this.name = 'NPC';
        this.age = 18;
    }
}

/**
 * @class
 * @constructor
 * @extends Character
 */
class MainCharacter extends Character {

    /**
     * 
     * @param {string} spriteSheetName 
     * @param {string} name 
     * @param {Number} drawIndex 
     * @param {Vector2D} position
     * @param {Object.<string, CAnimation>} animations 
     */
    constructor(spriteSheetName, name, drawIndex = 0, position = new Vector2D(0, 0), animations = undefined) {
        super(spriteSheetName, drawIndex, position, animations);

        /** @type {string} */
        this.name = name;

        /** @type {Inventory} */
        this.inventory = new Inventory(this);

        /** @type {UsableItem} */
        this.activeItem;

        /** @type {AmbientLight} */
        this.light = undefined;

        /** @type {boolean} */
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

    /**
     * 
     * @param {Vector2D} position 
     */
    FlagDrawingUpdate(position) {
        if (this.light !== undefined)
            this.light.SetPosition(this.position);

        super.FlagDrawingUpdate(position);
    }

    /**
     * 
     * @param {Vector2D} position 
     */
    NeedsRedraw(position) {
        if (this.light !== undefined)
            this.light.SetPosition(this.position);
        super.NeedsRedraw(position);
    }
}

export { Character, CharacterAttachments, CharacterData, MainCharacter };

/*
    UpdateRealTimeShadow() {
        this.realTimeShadow.canvasCtx.clearRect(0, 0, this.drawingOperation.tile.size.x, this.drawingOperation.tile.size.y);
        this.realTimeShadow.canvasCtx.drawImage(
            AtlasController.GetAtlas(this.drawingOperation.tile.atlas).GetCanvas(),
            this.drawingOperation.tile.GetPosX(),
            this.drawingOperation.tile.GetPosY(),
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y,
            0,
            0,
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y
        );

        this.realTimeShadow.canvasCtx.drawImage(
            AtlasController.GetAtlas(this.attachments['redHair'].drawingOperation.tile.atlas).GetCanvas(),
            this.drawingOperation.tile.GetPosX(),
            this.drawingOperation.tile.GetPosY(),
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y,
            0,
            0,
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y
        );

        this.realTimeShadow.canvasCtx.drawImage(
            AtlasController.GetAtlas(this.attachments['underDress'].drawingOperation.tile.atlas).GetCanvas(),
            this.drawingOperation.tile.GetPosX(),
            this.drawingOperation.tile.GetPosY(),
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y,
            0,
            0,
            this.drawingOperation.tile.size.x,
            this.drawingOperation.tile.size.y
        );

        this.realTimeShadow.cutoutData = this.realTimeShadow.canvasCtx.getImageData(0, 0, this.realTimeShadow.canvas.width, this.realTimeShadow.canvas.height);

        let color = LightSystem.SkyLight.color.Clone();
        color.AlphaMultiply();
        for (let i = 0, l = this.realTimeShadow.cutoutData.data.length; i < l; ++i) {
            this.realTimeShadow.cutoutData.data[i] = color.red;
            this.realTimeShadow.cutoutData.data[++i] = color.green;
            this.realTimeShadow.cutoutData.data[++i] = color.blue;
            if (this.realTimeShadow.cutoutData.data[i + 1] > 0) {
                this.realTimeShadow.cutoutData.data[++i] = 160;
            } else
                ++i;
        }

        let overlaps = CollisionHandler.GCH.GetOverlapByClass(this.BoxCollision, 'AmbientLight');

        if (overlaps !== false) {
            let shadowPos = this.position.Clone();
            shadowPos.y -= 15;
            let rotation = CMath.LookAt2D(shadowPos, overlaps.collisionOwner.position.Clone());
            rotation -= 90;
            this.RotateRealTimeShadow(rotation);
            let rotationArr = [new Vector4D(32, 64, 32, 0)];
            Math3D.Rotate(0, 0, CMath.DegreesToRadians(rotation), rotationArr, new Vector(32, 32, 32));
            this.realTimeShadow.centerPosition = new Vector2D(rotationArr[0].x, rotationArr[0].y);
            this.realTimeShadow.centerPosition.x -= 32;
            this.realTimeShadow.centerPosition.y -= 64 - 10;
        }

        this.realTimeShadow.canvasCtx.putImageData(this.realTimeShadow.cutoutData, 0, 0);
    }

    RotateRealTimeShadow(rotation) {
        Math3D.RotatePixelData2D(this.realTimeShadow.cutoutData.data, new Vector2D(this.drawingOperation.tile.size.x, this.drawingOperation.tile.size.y), new Vector(0, 0, rotation), 0, new Vector(32, 32, 32));
        this.realTimeShadow.canvasCtx.putImageData(this.realTimeShadow.cutoutData, 0, 0);
    }

    GenerateRealTimeShadow() {
        let size = this.drawingOperation.GetSize();
        this.realTimeShadow.canvas = document.createElement('canvas');
        this.realTimeShadow.canvas.width = size.x;
        this.realTimeShadow.canvas.height = size.y;

        document.body.appendChild(this.realTimeShadow.canvas);
        this.realTimeShadow.canvasCtx = this.realTimeShadow.canvas.getContext('2d');
        this.realTimeShadow.canvasCtx.imageSmoothingEnabled = false;

        this.realTimeShadow.canvasCtx.drawImage(AtlasController.GetAtlas(this.drawingOperation.tile.atlas).GetCanvas(), 0, 0);

        this.realTimeShadow.cutoutData = this.realTimeShadow.canvasCtx.getImageData(0, 0, this.realTimeShadow.canvas.width, this.realTimeShadow.canvas.height);

        for (let i = 0, l = this.realTimeShadow.cutoutData.data.length; i < l; ++i) {
            this.realTimeShadow.cutoutData.data[i] = LightSystem.SkyLight.color.red;
            this.realTimeShadow.cutoutData.data[++i] = LightSystem.SkyLight.color.green;
            this.realTimeShadow.cutoutData.data[++i] = LightSystem.SkyLight.color.blue;
            ++i;
        }

        this.realTimeShadow.canvasCtx.putImageData(this.realTimeShadow.cutoutData, 0, 0);
        this.realTimeShadow.centerPosition = new Vector2D(0, 0);
        this.realTimeShadow;
    }
*/