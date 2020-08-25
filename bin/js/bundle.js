(function () {
    'use strict';

    class DrawCmd extends Laya.Script {
        constructor() {
            super();
        }
        static DrawLine(startX, startY, endX, endY, color, width) {
            Laya.stage.graphics.drawLine(startX, startY, endX, endY, color, width);
        }
    }
    ;

    class Raycast extends Laya.Script {
        constructor() {
            super();
        }
        static _RayCast(startX, startY, endX, endY, direction) {
            let world = Laya.Physics.I.world;
            let hit = 0;
            let rigidbody_arr = [];
            let sprite_arr = [];
            world.RayCast(function (fixture, point, normal, fraction) {
                let rigidbody = fixture.m_body;
                let sprite = fixture.collider.owner;
                rigidbody_arr.push(rigidbody);
                sprite_arr.push(sprite);
                hit++;
            }, { x: startX / Laya.Physics.PIXEL_RATIO, y: startY / Laya.Physics.PIXEL_RATIO }, { x: endX / Laya.Physics.PIXEL_RATIO, y: endY / Laya.Physics.PIXEL_RATIO });
            console.log('射中物體數: ', hit);
            return {
                'Hit': hit,
                'Rigidbody': rigidbody_arr,
                'Sprite': (direction) ? sprite_arr.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0) : sprite_arr.sort((a, b) => a.x > b.x ? -1 : a.x > b.x ? 1 : 0),
            };
        }
        ;
    }
    ;

    class CameraHandler extends Laya.Script {
        constructor() {
            super();
        }
        static CameraFollower(sprite) {
            setInterval(() => {
                let player_pivot_x = Laya.stage.width / 2;
                let player_pivot_y = Laya.stage.height / 2;
                Laya.stage.x = player_pivot_x - sprite.x;
                Laya.stage.y = player_pivot_y - sprite.y;
            }, 0);
        }
    }

    class CharacterMove extends Laya.Script {
        constructor() {
            super();
            this.isFacingRight = true;
            this.canMove = false;
            this.canJump = false;
            this.timestamp = true;
            this.cd_ray = true;
            this.characterNode = null;
            this.characterSprite = null;
            this.attackNode_Left = null;
            this.attackSprite_Left = null;
            this.attackCollider_Left = null;
            this.attackNode_Right = null;
            this.attackSprite_Right = null;
            this.attackCollider_Right = null;
            this.xMaxVelocity = 1;
            this.yMaxVelocity = 1;
            this.velocityMultiplier = 1;
        }
        onAwake() {
        }
        onStart() {
            this.setup();
            CameraHandler.CameraFollower(this.characterSprite);
        }
        onUpdate() {
            if (this.playerVelocity["Vx"] < -this.xMaxVelocity) {
                this.playerVelocity["Vx"] = -this.xMaxVelocity;
            }
            if (this.playerVelocity["Vx"] > this.xMaxVelocity) {
                this.playerVelocity["Vx"] = this.xMaxVelocity;
            }
            this.characterMove();
        }
        setup() {
            this.characterSprite = this.characterNode;
            this.characterAnim = this.characterNode;
            this.attackSprite_Left = this.attackNode_Left;
            this.attackSprite_Right = this.attackNode_Right;
            this.attackCollider_Left = this.attackNode_Left.getComponent(Laya.CircleCollider);
            this.attackCollider_Right = this.attackNode_Right.getComponent(Laya.CircleCollider);
            this.attackNode_Right.active = false;
            this.attackNode_Left.active = false;
            this.characterAnim.source = "character/player_01.png,character/player_02.png";
            this.playerVelocity = { Vx: 0, Vy: 0 };
            this.playerRig = this.owner.getComponent(Laya.RigidBody);
            this.listenKeyboard();
        }
        listenKeyboard() {
            this.keyDownList = [];
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
        onTriggerEnter(col) {
            if (col.label == "BoxCollider") {
                this.resetMove();
                this.canJump = true;
                this.canMove = true;
            }
        }
        onKeyDown(e) {
            var keyCode = e["keyCode"];
            this.keyDownList[keyCode] = true;
        }
        onKeyUp(e) {
            if (this.canJump) {
                this.playerVelocity["Vx"] = 0;
                this.characterAnim.source =
                    "character/player_01.png,character/player_02.png";
                this.characterAnim.interval = 500;
                this.applyMoveX();
            }
            delete this.keyDownList[e["keyCode"]];
        }
        characterMove() {
            if (this.keyDownList[37]) {
                this.playerVelocity["Vx"] += -1 * this.velocityMultiplier;
                this.characterAnim.source =
                    "character/player_walk_01.png,character/player_walk_02.png";
                this.characterAnim.interval = 100;
                this.applyMoveX();
                if (this.isFacingRight) {
                    this.playerVelocity["Vx"] = 0;
                    this.applyMoveX();
                    this.characterSprite.skewY = 180;
                    this.isFacingRight = false;
                }
            }
            if (this.keyDownList[38]) {
                if (this.canJump) {
                    this.playerVelocity["Vy"] += -10;
                    this.applyMoveY();
                    this.canJump = false;
                }
            }
            if (this.keyDownList[39]) {
                this.playerVelocity["Vx"] += 1 * this.velocityMultiplier;
                this.characterAnim.source =
                    "character/player_walk_01.png,character/player_walk_02.png";
                this.characterAnim.interval = 100;
                this.applyMoveX();
                if (!this.isFacingRight) {
                    this.playerVelocity["Vx"] = 0;
                    this.applyMoveX();
                    this.characterSprite.skewY = 0;
                    this.isFacingRight = true;
                }
            }
            if (this.keyDownList[40]) {
            }
            if (this.keyDownList[32]) {
                if (!this.cd_ray)
                    return;
                this.cd_ray = false;
                let width_offset = (this.characterSprite.width / 2.5) * (this.isFacingRight ? 1 : -1);
                let raycast_range = 300 * (this.isFacingRight ? 1 : -1);
                let random_color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
                let direction = this.isFacingRight ? 1 : 0;
                let Raycast_return = Raycast._RayCast(this.characterSprite.x + width_offset, this.characterSprite.y, this.characterSprite.x + width_offset + raycast_range, this.characterSprite.y, direction);
                DrawCmd.DrawLine(this.characterSprite.x + width_offset, this.characterSprite.y, this.characterSprite.x + width_offset + raycast_range, this.characterSprite.y, random_color, 2);
                if (Raycast_return["Hit"]) {
                    let rig = Raycast_return["Rigidbody"];
                    let spr = Raycast_return["Sprite"];
                    let world = Laya.Physics.I.world;
                    rig.forEach((e) => {
                        world.DestroyBody(e);
                    });
                    spr.forEach((e) => {
                        console.log(e);
                        e.graphics.destroy();
                    });
                }
                setTimeout(() => {
                    Laya.stage.graphics.clear();
                    this.cd_ray = true;
                }, 500);
            }
            if (this.keyDownList[17]) {
                if (this.isFacingRight) {
                    this.attackNode_Right.active = true;
                    this.attackSprite_Right.y = this.characterSprite.y;
                    this.attackSprite_Right.x = this.characterSprite.x + 75;
                    setTimeout(() => {
                        this.attackSprite_Right.y = -1000;
                        this.attackNode_Right.active = false;
                    }, 100);
                }
                else {
                    this.attackNode_Left.active = true;
                    this.attackSprite_Left.y = this.characterSprite.y;
                    this.attackSprite_Left.x = this.characterSprite.x - 75;
                    setTimeout(() => {
                        this.attackSprite_Left.y = -1000;
                        this.attackNode_Left.active = false;
                    }, 100);
                }
            }
        }
        resetMove() {
            this.playerVelocity["Vx"] = 0;
            this.playerVelocity["Vy"] = 0;
            this.applyMoveX();
            this.applyMoveY();
        }
        applyMoveX() {
            this.playerRig.setVelocity({
                x: this.playerVelocity["Vx"],
                y: this.playerRig.linearVelocity.y,
            });
        }
        applyMoveY() {
            this.playerRig.setVelocity({
                x: this.playerRig.linearVelocity.x,
                y: this.playerVelocity["Vy"],
            });
        }
    }

    class AtkRange extends Laya.Script {
        constructor() {
            super();
        }
        onStart() { }
        onUpdate() {
            let x = this.owner.getComponent(Laya.RigidBody);
            x.linearVelocity = { x: 0, y: 0 };
        }
        onTriggerEnter(col) {
            if (!this.owner.active)
                return;
            console.log("哦哦哦哦撞到了!");
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/CharacterMove.ts", CharacterMove);
            reg("script/AtkRange.ts", AtkRange);
        }
    }
    GameConfig.width = 1366;
    GameConfig.height = 768;
    GameConfig.scaleMode = "noscale";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "First.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
