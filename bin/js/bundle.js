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
        static _RayCast(startX, startY, endX, endY, direction) {
            let world = Laya.Physics.I.world;
            let hit = 0;
            let sprite_arr = [];
            world.RayCast(function (fixture, point, normal, fraction) {
                let rigidbody = fixture.m_body;
                let sprite = fixture.collider.owner;
                sprite_arr.push(sprite);
                hit++;
            }, { x: startX / Laya.Physics.PIXEL_RATIO, y: startY / Laya.Physics.PIXEL_RATIO }, { x: endX / Laya.Physics.PIXEL_RATIO, y: endY / Laya.Physics.PIXEL_RATIO });
            console.log('射中物體數: ', hit);
            return {
                'Hit': hit,
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
            }, 10);
        }
    }

    class Enemy extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_name = '';
            this.m_health = 1000;
            this.m_armor = 0;
            this.m_speed = 3;
            this.m_imgSrc = '';
            this.m_tag = '';
        }
        spawn(player, id) {
            this.sprite = new Laya.Sprite();
            this.sprite.pos(player.x - 170, player.y - (player.height / 2));
            this.sprite.width = player.width * 2 / 3;
            this.sprite.height = player.height;
            this.sprite.loadImage(this.m_imgSrc);
            this.collider = this.sprite.addComponent(Laya.BoxCollider);
            this.rigidbody = this.sprite.addComponent(Laya.RigidBody);
            this.collider.width = this.sprite.width;
            this.collider.height = this.sprite.height;
            this.collider.label = id;
            this.rigidbody.allowRotation = false;
            Laya.stage.addChild(this.sprite);
            this.showHealth(this.sprite);
        }
        ;
        destroy() {
            this.sprite.destroy();
        }
        ;
        setHealth(amount) {
            this.m_health = amount;
            if (this.m_health <= 0) {
                this.bloodSplitEffect(this.sprite);
                this.sprite.destroy();
            }
        }
        getHealth() {
            return this.m_health;
        }
        ;
        setArmor(amount) {
            this.m_armor = amount;
        }
        ;
        getArmor() {
            return this.m_armor;
        }
        ;
        setSpeed(amount) {
            this.m_speed = amount;
        }
        ;
        getSpeed() {
            return this.m_speed;
        }
        ;
        setLabel(index) {
            this.collider.label = index;
        }
        ;
        showHealth(enemy) {
            let enemyHealthText = new Laya.Text();
            enemyHealthText.pos(enemy.x, enemy.y - 40);
            enemyHealthText.width = 100;
            enemyHealthText.height = 60;
            enemyHealthText.color = "#efefef";
            enemyHealthText.fontSize = 40;
            enemyHealthText.text = '' + String(this.m_health);
            Laya.stage.addChild(enemyHealthText);
            setInterval((() => {
                if (enemy.destroyed) {
                    enemyHealthText.destroy();
                    enemyHealthText.destroyed = true;
                    return;
                }
                enemyHealthText.pos(enemy.x, enemy.y - 40);
                enemyHealthText.text = '' + String(this.m_health);
            }), 30);
        }
        bloodSplitEffect(enemy) {
            let bloodEffect = new Laya.Animation();
            let colorMat = [
                2, 0, 0, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            bloodEffect.filters = [colorFilter, glowFilter];
            bloodEffect.pos(enemy.x - 250, enemy.y - 250 + 30);
            bloodEffect.source = "comp/Blood/Blood_0000.png,comp/Blood/Blood_0001.png,comp/Blood/Blood_0002.png,comp/Blood/Blood_0003.png,comp/Blood/Blood_0004.png,comp/Blood/Blood_0005.png,comp/Blood/Blood_0006.png,comp/Blood/Blood_0007.png,comp/Blood/Blood_0008.png,comp/Blood/Blood_0009.png,comp/Blood/Blood_0010.png,comp/Blood/Blood_0011.png,comp/Blood/Blood_0012.png,comp/Blood/Blood_0013.png,comp/Blood/Blood_0014.png";
            bloodEffect.on(Laya.Event.COMPLETE, this, function () {
                bloodEffect.destroy();
                bloodEffect.destroyed = true;
            });
            Laya.stage.addChild(bloodEffect);
            bloodEffect.play();
        }
    }
    class EnemyNormal extends Enemy {
        constructor() {
            super(...arguments);
            this.m_name = '普通敵人';
            this.m_health = 1000;
            this.m_speed = 2;
            this.m_imgSrc = "comp/monster_normal.png";
            this.m_tag = 'n';
        }
    }
    class EnemyShield extends Enemy {
        constructor() {
            super(...arguments);
            this.m_name = '裝甲敵人';
            this.m_armor = 500;
            this.m_health = 1500;
            this.m_speed = 1;
            this.m_imgSrc = 'comp/monster_shield.png';
            this.m_tag = 's';
        }
    }

    class EnemyHandler extends Laya.Script {
        static generator(player) {
            let enemyNormal = new EnemyShield();
            let _id = enemyNormal.m_tag + String(++this.enemyIndex);
            enemyNormal.spawn(player, _id);
            this.enenmyPool.push({ '_id': _id, '_ent': enemyNormal });
            console.log(this.getEnemiesCount());
            console.log(this.enenmyPool);
        }
        static takeDamage(enemy, amount) {
            enemy.setHealth(enemy.getHealth() - amount);
        }
        static getEnemiesCount() {
            return (this.enenmyPool = this.enenmyPool.filter(data => data._ent.collider.owner != null)).length;
        }
    }
    EnemyHandler.enemyIndex = 0;
    EnemyHandler.enenmyPool = [];

    class CharacterController extends Laya.Script {
        constructor() {
            super();
            this.isFacingRight = true;
            this.canMove = false;
            this.canJump = false;
            this.timestamp = true;
            this.cd_ray = true;
            this.cd_atk = true;
            this.characterNode = null;
            this.characterSprite = null;
            this.xMaxVelocity = 5;
            this.yMaxVelocity = 5;
            this.velocityMultiplier = 5;
            this.attackBoxRange = 100;
        }
        onAwake() {
        }
        onStart() {
            this.setup();
            CameraHandler.CameraFollower(this.characterSprite);
        }
        onUpdate() {
            if (this.playerVelocity["Vx"] < -this.xMaxVelocity)
                this.playerVelocity["Vx"] = -this.xMaxVelocity;
            if (this.playerVelocity["Vx"] > this.xMaxVelocity)
                this.playerVelocity["Vx"] = this.xMaxVelocity;
            this.characterMove();
        }
        setup() {
            this.characterSprite = this.characterNode;
            this.characterAnim = this.characterNode;
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
                    spr.forEach((e) => {
                        e.destroy();
                        e.destroyed = true;
                    });
                }
                setTimeout(() => {
                    Laya.stage.graphics.clear();
                    this.cd_ray = true;
                }, 500);
                EnemyHandler.generator(this.characterSprite);
            }
            if (this.keyDownList[17]) {
                if (!this.cd_atk)
                    return;
                this.characterAnim.interval = 20;
                this.characterAnim.source =
                    "cahracter/Player_attack_0.png,cahracter/Player_attack_1.png,cahracter/Player_attack_2.png,cahracter/Player_attack_3.png,cahracter/Player_attack_4.png,cahracter/Player_attack_5.png";
                this.createAttackCircle(this.characterSprite);
                this.createEffect(this.characterSprite);
                this.cd_atk = false;
                this.characterAnim.on(Laya.Event.COMPLETE, this, function () {
                    this.characterAnim.interval = 500;
                    this.characterAnim.source = "character/player_01.png,character/player_02.png";
                });
                setTimeout(() => {
                    this.cd_atk = true;
                }, 500);
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
        createAttackCircle(player) {
            let atkCircle = new Laya.Sprite();
            let x_offset = this.isFacingRight
                ? (player.width * 1) / 2 + 3
                : (player.width * 5) / 4 + 3;
            if (this.isFacingRight) {
                atkCircle.pos(player.x + x_offset, player.y -
                    (this.characterSprite.height * 1) / 2 +
                    (this.characterSprite.height * 1) / 8);
            }
            else {
                atkCircle.pos(player.x - x_offset, player.y -
                    (this.characterSprite.height * 1) / 2 +
                    (this.characterSprite.height * 1) / 8);
            }
            let atkBoxCollider = atkCircle.addComponent(Laya.BoxCollider);
            let atkCircleRigid = atkCircle.addComponent(Laya.RigidBody);
            let atkCircleScript = atkCircle.addComponent(Laya.Script);
            atkBoxCollider.height = atkBoxCollider.width = this.attackBoxRange;
            atkCircleScript.onTriggerEnter = function (col) {
                if (col.label[0] === 'n') {
                    let eh = EnemyHandler;
                    eh.takeDamage(eh.enenmyPool.filter(enemy => enemy._id === col.label)[0]['_ent'], 600);
                }
                else if (col.label[0] === 's') {
                    let eh = EnemyHandler;
                    eh.takeDamage(eh.enenmyPool.filter(enemy => enemy._id === col.label)[0]['_ent'], 300);
                    console.log(col.owner.parent);
                    console.log(col.owner);
                }
            };
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            Laya.stage.addChild(atkCircle);
            atkCircle.graphics.drawRect(0, 0, 100, 100, "gray", "gray", 1);
            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 100);
        }
        createEffect(player) {
            Laya.SoundManager.playSound("Audio/SlashAudio.wav", 1);
            let slashEffect = new Laya.Animation();
            let colorMat = [
                2, 0, 0, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 2, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashEffect.filters = [colorFilter, glowFilter];
            if (this.isFacingRight) {
                slashEffect.skewY = 0;
                slashEffect.pos(player.x - 100, player.y - 250 + 30);
            }
            else {
                slashEffect.skewY = 180;
                slashEffect.pos(player.x + 100, player.y - 250 + 30);
            }
            slashEffect.source =
                "comp/SlashEffects/Slash_0030.png,comp/SlashEffects/Slash_0031.png,comp/SlashEffects/Slash_0032.png,comp/SlashEffects/Slash_0033.png,comp/SlashEffects/Slash_0034.png,comp/SlashEffects/Slash_0035.png";
            slashEffect.on(Laya.Event.COMPLETE, this, function () {
                slashEffect.destroy();
                slashEffect.destroyed = true;
            });
            Laya.stage.addChild(slashEffect);
            slashEffect.play();
        }
    }

    class SceneInit extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            Laya.stage.bgColor = 'gray';
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/CharacterController.ts", CharacterController);
            reg("script/SceneInit.ts", SceneInit);
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
            Laya.ClassUtils.regClass("laya.effect.ColorFilterSetter", Laya.ColorFilterSetter);
            Laya.ClassUtils.regClass("laya.effect.GlowFilterSetter", Laya.GlowFilterSetter);
            Laya.ClassUtils.regClass("laya.effect.BlurFilterSetter", Laya.BlurFilterSetter);
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
