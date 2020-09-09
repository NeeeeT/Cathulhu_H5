(function () {
    'use strict';

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

    class DrawCmd extends Laya.Script {
        constructor() {
            super();
        }
        static DrawLine(startX, startY, endX, endY, color, width) {
            Laya.stage.graphics.drawLine(startX, startY, endX, endY, color, width);
        }
    }
    ;

    var EnemyStatus;
    (function (EnemyStatus) {
        EnemyStatus[EnemyStatus["idle"] = 0] = "idle";
        EnemyStatus[EnemyStatus["run"] = 1] = "run";
        EnemyStatus[EnemyStatus["jump"] = 2] = "jump";
        EnemyStatus[EnemyStatus["down"] = 3] = "down";
        EnemyStatus[EnemyStatus["attack"] = 4] = "attack";
        EnemyStatus[EnemyStatus["useSkill"] = 5] = "useSkill";
        EnemyStatus[EnemyStatus["hurt"] = 6] = "hurt";
        EnemyStatus[EnemyStatus["defend"] = 7] = "defend";
        EnemyStatus[EnemyStatus["death"] = 8] = "death";
    })(EnemyStatus || (EnemyStatus = {}));
    class Enemy extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_name = '';
            this.m_health = 1000;
            this.m_armor = 0;
            this.m_speed = 3;
            this.m_tag = '';
            this.m_moveVelocity = { "Vx": 0, "Vy": 0 };
            this.m_attackRange = 100;
            this.m_atkCd = true;
            this.m_isFacingRight = true;
            this.m_animationChanging = false;
            this.m_state = EnemyStatus.idle;
        }
        spawn(player, id) {
            this.m_animation = new Laya.Animation();
            this.m_animation.scaleX = 4;
            this.m_animation.scaleY = 4;
            this.m_animation.width = 35;
            this.m_animation.height = 35;
            this.m_animation.pivotX = this.m_animation.width / 2;
            this.m_animation.pivotY = this.m_animation.height / 2;
            this.m_animation.pos(player.x - 170, player.y - (player.height / 2));
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
            this.m_animation.interval = 100;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                this.m_animationChanging = false;
            });
            this.m_maxHealth = this.m_health;
            this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
            this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
            this.m_script = this.m_animation.addComponent(Laya.Script);
            this.m_script.onUpdate = () => {
                this.enemyAIMain();
            };
            this.m_collider.width = this.m_animation.width;
            this.m_collider.height = this.m_animation.height;
            this.m_collider.x -= 13;
            this.m_collider.y -= 10;
            this.m_collider.label = id;
            this.m_collider.tag = 'Enemy';
            this.m_rigidbody.allowRotation = false;
            this.m_player = player;
            Laya.stage.addChild(this.m_animation);
            this.showHealth(this.m_animation);
        }
        ;
        destroy() {
            this.m_animation.destroy();
        }
        ;
        setHealth(amount) {
            this.m_health = amount;
            if (this.m_health <= 0) {
                this.setSound(0.05, "Audio/EnemyDie/death1.wav", 1);
                this.bloodSplitEffect(this.m_animation);
                this.m_animation.destroy();
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
            this.m_collider.label = index;
        }
        ;
        showHealth(enemy) {
            let healthBar = new Laya.ProgressBar();
            healthBar.height = 10;
            healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
            healthBar.skin = "comp/progress.png";
            healthBar.value = 1;
            Laya.stage.addChild(healthBar);
            setInterval((() => {
                if (enemy.destroyed) {
                    healthBar.destroy();
                    healthBar.destroyed = true;
                    return;
                }
                healthBar.pos(enemy.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) - 10, (enemy.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
                healthBar.value = this.m_health / this.m_maxHealth;
            }), 10);
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
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        enemyAIMain() {
            this.pursuitPlayer();
            this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer;
            if (this.playerRangeCheck(this.m_attackRange * 2)) {
                this.tryAttack();
            }
        }
        pursuitPlayer() {
            let dir = this.m_player.x - this.m_animation.x;
            this.m_animation.skewY = (this.m_moveVelocity["Vx"] > 0) ? 0 : 180;
            this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false;
            if (Math.abs(this.m_moveVelocity["Vx"]) <= this.m_speed) {
                this.m_moveVelocity["Vx"] += (dir > 0) ? 0.03 : -0.03;
            }
            else {
                this.m_moveVelocity["Vx"] = (dir > 0) ? this.m_speed : -this.m_speed;
            }
            if (!this.m_animationChanging)
                this.updateAnimation(this.m_state, EnemyStatus.run);
            else
                this.m_moveVelocity["Vx"] = 0;
            this.applyMoveX();
        }
        playerRangeCheck(detectRange) {
            let dist = Math.sqrt(Math.pow((this.m_player.x - this.m_animation.x), 2) + Math.pow((this.m_player.y - this.m_animation.y), 2));
            return (dist <= detectRange) ? true : false;
        }
        tryAttack() {
            if (this.m_atkTimer > 0)
                return;
            this.m_atkCd = false;
            this.m_moveVelocity["Vx"] = 0;
            let atkCircle = new Laya.Sprite();
            let x_offset = this.m_isFacingRight
                ? (this.m_animation.width * 1) / 2 + 3
                : (this.m_animation.width * 5) / 4 + 3;
            if (this.m_isFacingRight) {
                atkCircle.pos(this.m_animation.x + this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2);
            }
            else {
                atkCircle.pos(this.m_animation.x - 3 * this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2);
            }
            let atkBoxCollider = atkCircle.addComponent(Laya.BoxCollider);
            let atkCircleRigid = atkCircle.addComponent(Laya.RigidBody);
            let atkCircleScript = atkCircle.addComponent(Laya.Script);
            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
            atkCircleScript.onTriggerEnter = function (col) {
                if (col.label === 'Player') {
                    console.log("打到玩家了");
                }
            };
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            this.updateAnimation(this.m_state, EnemyStatus.attack);
            atkCircle.graphics.drawRect(0, 0, 100, 100, "red", "red", 1);
            Laya.stage.addChild(atkCircle);
            this.m_atkTimer = 100;
            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 100);
            setTimeout(() => {
                this.m_atkCd = true;
            }, 500);
        }
        applyMoveX() {
            this.m_rigidbody.setVelocity({
                x: this.m_moveVelocity["Vx"],
                y: this.m_rigidbody.linearVelocity.y,
            });
        }
        applyMoveY() {
            this.m_rigidbody.setVelocity({
                x: this.m_rigidbody.linearVelocity.x,
                y: this.m_moveVelocity["Vy"],
            });
        }
        updateAnimation(from, to, onCallBack) {
            if (this.m_state === to || this.m_animationChanging)
                return;
            this.m_state = to;
            console.log(from, 'convert to ', to);
            switch (this.m_state) {
                case EnemyStatus.attack:
                    this.m_animationChanging = true;
                    this.m_animation.interval = 100;
                    this.m_animation.source = 'goblin/attack_05.png,goblin/attack_06.png,goblin/attack_07.png,goblin/attack_08.png';
                    this.m_animation.play();
                    break;
                case EnemyStatus.idle:
                    this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                    break;
                case EnemyStatus.run:
                    this.m_animation.source = 'goblin/run_01.png,goblin/run_02.png,goblin/run_03.png,goblin/run_04.png,goblin/run_05.png,goblin/run_06.png,goblin/run_07.png,goblin/run_08.png';
                    this.m_animation.interval = 100;
                    this.m_animation.play();
                    break;
                default:
                    this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                    break;
            }
            if (typeof onCallBack === 'function')
                onCallBack();
        }
    }
    class EnemyNormal extends Enemy {
        constructor() {
            super(...arguments);
            this.m_name = '普通敵人';
            this.m_health = 1000;
            this.m_armor = 100;
            this.m_speed = 2;
            this.m_tag = 'n';
            this.m_attackRange = 100;
        }
    }
    class EnemyShield extends Enemy {
        constructor() {
            super(...arguments);
            this.m_name = '裝甲敵人';
            this.m_armor = 500;
            this.m_health = 1500;
            this.m_speed = 1;
            this.m_tag = 's';
            this.m_attackRange = 100;
        }
    }

    class EnemyHandler extends Laya.Script {
        static generator(player, enemyType, spawnPoint) {
            let enemy = this.decideEnemyType(enemyType);
            let id = enemy.m_tag + String(++this.enemyIndex);
            enemy.spawn(player, id);
            this.enemyPool.push({ '_id': id, '_ent': enemy });
            this.updateEnemies();
            console.log(this.enemyPool);
            return enemy;
        }
        static decideEnemyType(enemyType) {
            switch (enemyType) {
                case 1: return new EnemyNormal();
                case 2: return new EnemyShield();
                default: return new EnemyNormal();
            }
            ;
        }
        static updateEnemies() {
            return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
        }
        static takeDamage(enemy, amount) {
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= 50);
            amount *= critical ? 5 : 1;
            enemy.setHealth(enemy.getHealth() - amount);
            this.damageTextEffect(enemy, amount, critical);
            if (critical)
                enemy.m_animation.x--;
        }
        static setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        static damageTextEffect(enemy, amount, critical) {
            let damageText = new Laya.Text();
            let soundNum;
            damageText.pos((enemy.m_animation.x - enemy.m_animation.width / 2) - 20, (enemy.m_animation.y - enemy.m_animation.height) - 110);
            damageText.bold = true;
            damageText.align = "left";
            damageText.alpha = 1;
            damageText.fontSize = critical ? 40 : 16;
            damageText.color = critical ? 'orange' : "white";
            damageText.text = String(amount);
            damageText.font = "opensans-bold";
            soundNum = critical ? 0 : 1;
            this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);
            Laya.stage.addChild(damageText);
            Laya.Tween.to(damageText, { alpha: 0.5, fontSize: damageText.fontSize + 30, }, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 350, Laya.Ease.linearInOut, null, 0);
            }), 0);
            setTimeout((() => {
                if (damageText.destroyed)
                    return;
                damageText.destroy();
                damageText.destroyed = true;
            }), 550);
        }
        static getEnemiesCount() {
            return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
        }
        static getEnemyByLabel(label) {
            return this.enemyPool.filter(data => data._id === label)[0]['_ent'];
            ;
        }
    }
    EnemyHandler.enemyIndex = 0;
    EnemyHandler.enemyPool = [];

    class OathManager extends Laya.Script {
        static getBloodyPoint() {
            return CharacterInit.playerEnt.m_bloodPoint;
        }
        static setBloodyPoint(amount) {
            CharacterInit.playerEnt.m_bloodPoint = (amount > CharacterInit.playerEnt.m_maxBloodPoint) ? CharacterInit.playerEnt.m_maxBloodPoint : amount;
            return CharacterInit.playerEnt.m_bloodPoint;
        }
        static showBloodyPoint(player) {
            let oathBar = new Laya.ProgressBar();
            oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 50);
            oathBar.height = 50;
            oathBar.width = 300;
            oathBar.skin = "comp/progress.png";
            setInterval((() => {
                oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 100);
                oathBar.value = CharacterInit.playerEnt.m_bloodPoint / CharacterInit.playerEnt.m_maxBloodPoint;
            }), 10);
            Laya.stage.addChild(oathBar);
        }
        static charge() {
            if (!this.isCharging) {
                if (CharacterInit.playerEnt.m_bloodPoint < 20)
                    return;
                CharacterInit.playerEnt.m_bloodPoint -= 20;
                this.isCharging = true;
            }
        }
        static chargeAttack(enemyLabel) {
            if (!this.isCharging)
                return;
            let victim = EnemyHandler.getEnemyByLabel(enemyLabel);
            EnemyHandler.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 1000));
            console.log("ChargeAttack!");
            this.isCharging = false;
        }
    }
    OathManager.increaseBloodyPoint = 10;
    OathManager.isCharging = false;

    var CharacterStatus;
    (function (CharacterStatus) {
        CharacterStatus[CharacterStatus["idle"] = 0] = "idle";
        CharacterStatus[CharacterStatus["run"] = 1] = "run";
        CharacterStatus[CharacterStatus["jump"] = 2] = "jump";
        CharacterStatus[CharacterStatus["down"] = 3] = "down";
        CharacterStatus[CharacterStatus["attack"] = 4] = "attack";
        CharacterStatus[CharacterStatus["useSkill"] = 5] = "useSkill";
        CharacterStatus[CharacterStatus["hurt"] = 6] = "hurt";
        CharacterStatus[CharacterStatus["defend"] = 7] = "defend";
        CharacterStatus[CharacterStatus["death"] = 8] = "death";
    })(CharacterStatus || (CharacterStatus = {}));
    class Character extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_isFacingRight = true;
            this.m_canJump = true;
            this.m_canAttack = true;
        }
        spawn() {
            this.m_state = CharacterStatus.idle;
            this.m_animation = new Laya.Animation();
            this.m_animation.scaleX = 1;
            this.m_animation.scaleY = 1;
            this.m_animation.width = 130;
            this.m_animation.height = 130;
            this.m_animation.pivotX = this.m_animation.width / 2;
            this.m_animation.pivotY = this.m_animation.height / 2;
            this.m_bloodPoint = 50;
            this.m_maxBloodPoint = 100;
            this.m_animation.pos(1345, 544);
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
            this.m_animation.interval = 200;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                this.m_animationChanging = false;
            });
            this.m_maxHealth = this.m_health;
            this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
            this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
            this.m_script = this.m_animation.addComponent(Laya.Script);
            this.m_script.onAwake = () => {
                this.m_playerVelocity = { Vx: 0, Vy: 0 };
                this.listenKeyBoard();
            };
            this.m_script.onUpdate = () => {
                if (this.m_playerVelocity["Vx"] < -this.m_xMaxVelocity)
                    this.m_playerVelocity["Vx"] = -this.m_xMaxVelocity;
                if (this.m_playerVelocity["Vx"] > this.m_xMaxVelocity)
                    this.m_playerVelocity["Vx"] = this.m_xMaxVelocity;
                this.characterMove();
            };
            this.m_script.onTriggerEnter = (col) => {
                if (col.label == "BoxCollider") {
                    this.resetMove();
                    this.m_canJump = true;
                }
            };
            this.m_script.onKeyUp = (e) => {
                if (this.m_canJump) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.applyMoveX();
                }
                delete this.m_keyDownList[e["keyCode"]];
            };
            this.m_script.onKeyDown = (e) => {
                let keyCode = e["keyCode"];
                this.m_keyDownList[keyCode] = true;
            };
            this.m_collider.width = this.m_animation.width;
            this.m_collider.height = this.m_animation.height;
            this.m_collider.x -= 5;
            this.m_collider.y -= 5;
            this.m_collider.tag = 'Player';
            this.m_collider.friction = 0;
            this.m_rigidbody.allowRotation = false;
            this.m_rigidbody.gravityScale = 3;
            Laya.stage.addChild(this.m_animation);
            OathManager.showBloodyPoint(this.m_animation);
            this.CameraFollower();
        }
        listenKeyBoard() {
            this.m_keyDownList = [];
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
        characterMove() {
            if (this.m_keyDownList[37]) {
                this.m_playerVelocity["Vx"] += -1 * this.m_velocityMultiplier;
                this.m_animation.source = "character/player_run_01.png,character/player_run_02.png,character/player_run_03.png,character/player_run_04.png";
                this.m_animation.interval = 200;
                this.applyMoveX();
                if (this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.applyMoveX();
                    this.m_animation.skewY = 180;
                    this.m_isFacingRight = false;
                }
            }
            if (this.m_keyDownList[38]) {
                if (this.m_canJump) {
                    this.m_playerVelocity["Vy"] += -10;
                    this.applyMoveY();
                    this.m_canJump = false;
                }
            }
            if (this.m_keyDownList[39]) {
                this.m_playerVelocity["Vx"] += 1 * this.m_velocityMultiplier;
                this.m_animation.source = "character/player_run_01.png,character/player_run_02.png,character/player_run_03.png,character/player_run_04.png";
                this.m_animation.interval = 100;
                this.applyMoveX();
                if (!this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.applyMoveX();
                    this.m_animation.skewY = 0;
                    this.m_isFacingRight = true;
                }
            }
            if (this.m_keyDownList[40]) {
            }
            if (this.m_keyDownList[32]) {
                let width_offset = (this.m_animation.width / 2.5) * (this.m_isFacingRight ? 1 : -1);
                let raycast_range = 300 * (this.m_isFacingRight ? 1 : -1);
                let random_color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
                let direction = this.m_isFacingRight ? 1 : 0;
                let Raycast_return = Raycast._RayCast(this.m_animation.x + width_offset, this.m_animation.y, this.m_animation.x + width_offset + raycast_range, this.m_animation.y, direction);
                DrawCmd.DrawLine(this.m_animation.x + width_offset, this.m_animation.y, this.m_animation.x + width_offset + raycast_range, this.m_animation.y, random_color, 2);
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
                }, 500);
            }
            if (this.m_keyDownList[17]) {
                if (!this.m_canAttack)
                    return;
                this.m_animation.interval = 100;
                this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
                this.createAttackCircle(this.m_animation);
                this.createAttackEffect(this.m_animation);
                this.m_canAttack = false;
                this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                    this.m_animation.interval = 200;
                    this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
                });
                setTimeout(() => {
                    this.m_canAttack = true;
                }, 500);
            }
            if (this.m_keyDownList[16])
                OathManager.charge();
        }
        createAttackCircle(player) {
            let atkCircle = new Laya.Sprite();
            let x_offset = this.m_isFacingRight ? (player.width * 1) / 2 + 3 : (player.width * 5) / 4 + 3;
            let soundNum = Math.floor(Math.random() * 2);
            if (this.m_isFacingRight) {
                atkCircle.pos(player.x + x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8);
            }
            else {
                atkCircle.pos(player.x - x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8);
            }
            let atkBoxCollider = atkCircle.addComponent(Laya.BoxCollider);
            let atkCircleRigid = atkCircle.addComponent(Laya.RigidBody);
            let atkCircleScript = atkCircle.addComponent(Laya.Script);
            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
            atkCircleScript.onTriggerEnter = function (col) {
                if (col.tag === 'Enemy') {
                    let eh = EnemyHandler;
                    let victim = eh.getEnemyByLabel(col.label);
                    if (!OathManager.isCharging) {
                        eh.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 150));
                        Character.setCameraShake(10, 3);
                        OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
                    }
                    else {
                        OathManager.chargeAttack(col.label);
                        Character.setCameraShake(50, 10);
                    }
                }
            };
            this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            atkCircle.graphics.drawRect(0, 0, 100, 100, "gray", "gray", 1);
            Laya.stage.addChild(atkCircle);
            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 100);
        }
        createAttackEffect(player) {
            let slashEffect = new Laya.Animation();
            let colorNum = Math.floor(Math.random() * 3) + 2;
            let colorMat = [
                colorNum, 0, 0, 0, -100,
                0, Math.floor(Math.random() * 2) + 1, 0, 0, -100,
                0, 0, colorNum, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            if (!OathManager.isCharging) {
                slashEffect.filters = [colorFilter, glowFilter];
            }
            else {
                let colorMat_charge = [
                    5, 0, 0, 0, -100,
                    5, 0, 0, 0, -100,
                    0, 0, 0, 0, -100,
                    0, 0, 0, 1, 0,
                ];
                let colorFilter_charge = new Laya.ColorFilter(colorMat_charge);
                let glowFilter_charge = new Laya.GlowFilter("#F7F706", 20, 0, 0);
                slashEffect.filters = [colorFilter_charge, glowFilter_charge];
            }
            if (this.m_isFacingRight) {
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
        resetMove() {
            this.m_playerVelocity["Vx"] = 0;
            this.m_playerVelocity["Vy"] = 0;
            this.applyMoveX();
            this.applyMoveY();
        }
        applyMoveX() {
            this.m_rigidbody.setVelocity({
                x: this.m_playerVelocity["Vx"],
                y: this.m_rigidbody.linearVelocity.y,
            });
        }
        applyMoveY() {
            this.m_rigidbody.setVelocity({
                x: this.m_rigidbody.linearVelocity.x,
                y: this.m_playerVelocity["Vy"],
            });
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        CameraFollower() {
            let player_pivot_x = Laya.stage.width / 2;
            let player_pivot_y = Laya.stage.height / 2;
            setInterval(() => {
                if (Character.m_cameraShakingTimer > 0) {
                    let randomSign = (Math.floor(Math.random() * 2) == 1) ? 1 : -1;
                    Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                    Laya.stage.y = (player_pivot_y - this.m_animation.y) + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                    Character.m_cameraShakingTimer--;
                }
                else {
                    Laya.stage.x = player_pivot_x - this.m_animation.x;
                    Laya.stage.y = player_pivot_y - this.m_animation.y;
                }
            }, 10);
        }
        static setCameraShake(timer, multiplier) {
            Character.m_cameraShakingMultiplyer = multiplier;
            Character.m_cameraShakingTimer = timer;
        }
        updateAnimation(from, to, onCallBack = null, force = false) {
            if (this.m_state === to || this.m_animationChanging)
                return;
            this.m_state = to;
            console.log(from, 'convert to ', to);
            switch (this.m_state) {
                case CharacterStatus.attack:
                    this.m_animationChanging = true;
                    this.m_animation.interval = 100;
                    this.m_animation.source = 'goblin/attack_05.png,goblin/attack_06.png,goblin/attack_07.png,goblin/attack_08.png';
                    this.m_animation.play();
                    break;
                case CharacterStatus.idle:
                    this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                    break;
                case CharacterStatus.run:
                    this.m_animation.source = 'goblin/run_01.png,goblin/run_02.png,goblin/run_03.png,goblin/run_04.png,goblin/run_05.png,goblin/run_06.png,goblin/run_07.png,goblin/run_08.png';
                    this.m_animation.interval = 100;
                    this.m_animation.play();
                    break;
                default:
                    this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                    break;
            }
            onCallBack();
        }
    }
    Character.m_cameraShakingTimer = 0;
    Character.m_cameraShakingMultiplyer = 1;

    class CharacterInit extends Laya.Script {
        constructor() {
            super();
            this.health = 1000;
            this.xMaxVelocity = 5;
            this.yMaxVelocity = 5;
            this.velocityMultiplier = 5;
            this.attackRange = 100;
        }
        onAwake() {
            let player = new Character();
            this.initSetting(player);
            player.spawn();
            CharacterInit.playerEnt = player;
        }
        initSetting(player) {
            player.m_health = this.health;
            player.m_xMaxVelocity = this.xMaxVelocity;
            player.m_yMaxVelocity = this.yMaxVelocity;
            player.m_velocityMultiplier = this.velocityMultiplier;
            player.m_attackRange = this.attackRange;
        }
    }

    class SceneInit extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            Laya.stage.bgColor = '#000';
            this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
            setTimeout((() => {
                console.log(CharacterInit.playerEnt);
            }), 5000);
        }
        generator() {
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
    }

    class EnemyInit extends Laya.Script {
        constructor() {
            super();
            this.EnemyGenerateTime = 3000;
        }
        onAwake() {
            let player = CharacterInit.playerEnt.m_animation;
            let isFacingRight = CharacterInit.playerEnt.m_isFacingRight;
            setInterval(() => {
                EnemyHandler.generator(player, isFacingRight ? 1 : 2, 0);
            }, this.EnemyGenerateTime);
        }
    }

    class Village extends Laya.Script {
        constructor() {
            super(...arguments);
            this.reinforceBtn = null;
            this.templeBtn = null;
            this.battleBtn = null;
        }
        onStart() {
            this.reinforceBtn = this.owner.getChildByName("Reinforce");
            this.templeBtn = this.owner.getChildByName("Temple");
            this.battleBtn = this.owner.getChildByName("Battle");
            this.reinforceBtn.on(Laya.Event.CLICK, this, function () {
                console.log("reinforce");
            });
            this.templeBtn.on(Laya.Event.CLICK, this, function () {
                console.log("temple");
            });
            this.battleBtn.on(Laya.Event.CLICK, this, function () {
                console.log("battle");
                Laya.Scene.open("First.scene");
            });
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/SceneInit.ts", SceneInit);
            reg("script/CharacterInit.ts", CharacterInit);
            reg("script/EnemyInit.ts", EnemyInit);
            reg("script/Village.ts", Village);
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
    GameConfig.stat = false;
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
