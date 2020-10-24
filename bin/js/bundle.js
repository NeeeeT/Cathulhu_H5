(function () {
    'use strict';

    class SceneInit extends Laya.Script {
        constructor() {
            super();
            this.sceneBackgroundColor = '#4a4a4a';
            this.resourceLoad = ["font/silver.ttf", "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
                "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas",
                "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas",
                "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas"
            ];
        }
        onAwake() {
            Laya.loader.load(this.resourceLoad, Laya.Handler.create(this, () => {
            }));
            Laya.stage.bgColor = this.sceneBackgroundColor;
            this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
    }

    var OathStatus;
    (function (OathStatus) {
        OathStatus[OathStatus["normal"] = 0] = "normal";
        OathStatus[OathStatus["charge"] = 1] = "charge";
        OathStatus[OathStatus["overCharge"] = 2] = "overCharge";
    })(OathStatus || (OathStatus = {}));

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
    class VirtualEnemy extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_moveVelocity = { "Vx": 0, "Vy": 0 };
            this.m_rectangle = { "x0": 0, "x1": 0, "y0": 0, "y1": 0, "h": 0, "w": 0 };
            this.m_attackRange = 100;
            this.m_hurtDelay = 0;
            this.m_atkCd = true;
            this.m_isFacingRight = true;
            this.m_moveDelayValue = 0;
            this.m_moveDelayTimer = null;
            this.m_animationChanging = false;
            this.m_hurtDelayTimer = null;
            this.m_state = EnemyStatus.idle;
        }
        spawn(player, id, point) {
            this.m_animation = new Laya.Animation();
            this.m_animation.filters = [];
            this.m_animation.scaleX = 1.5;
            this.m_animation.scaleY = 1.5;
            this.m_animation.width = 96;
            this.m_animation.height = 140;
            this.m_animation.pivotX = this.m_animation.width / 2;
            this.m_animation.pivotY = this.m_animation.height / 2;
            let enemyPos = [-200, 200];
            this.m_animation.pos(point['x'], point['y']);
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'normalEnemy/Idle.atlas';
            this.m_animation.interval = 100;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                this.m_animationChanging = false;
                if (this.m_state === EnemyStatus.attack) {
                    this.m_animation.stop();
                }
            });
            this.m_maxHealth = this.m_health;
            this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
            this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
            this.m_script = this.m_animation.addComponent(Laya.Script);
            this.m_script.onUpdate = () => {
                this.enemyAIMain();
                this.checkPosition();
            };
            this.m_collider.width = this.m_animation.width;
            this.m_collider.height = this.m_animation.height;
            this.m_collider.x -= 13;
            this.m_collider.y -= 10;
            this.m_collider.label = id;
            this.m_collider.tag = 'Enemy';
            this.m_rigidbody.category = 8;
            this.m_rigidbody.mask = 4 | 2;
            this.m_rigidbody.allowRotation = false;
            this.m_rigidbody.gravityScale = 5;
            this.m_player = player;
            Laya.stage.addChild(this.m_animation);
            this.showHealth();
        }
        ;
        destroy() {
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
        }
        ;
        setHealth(amount) {
            if (amount <= 0) {
                this.bloodSplitEffect(this.m_animation);
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
                return;
            }
            this.m_health = amount;
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
        takeDamage(amount) {
            if (this.m_animation.destroyed || amount <= 0 || !this.m_animation)
                return;
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= 25);
            this.delayMove(this.m_mdelay);
            amount *= critical ? 5 : 1;
            this.setHealth(this.getHealth() - amount);
            this.damageTextEffect(amount, critical);
            this.m_healthBar.alpha = 1;
            if (this.m_hurtDelayTimer) {
                this.m_hurtDelay += 2.0;
            }
            else {
                this.m_hurtDelay = 2.0;
                this.m_hurtDelayTimer = setInterval(() => {
                    if (this.m_hurtDelay <= 0) {
                        clearInterval(this.m_hurtDelayTimer);
                        this.m_hurtDelayTimer = null;
                        this.m_hurtDelay = -1;
                    }
                    this.m_hurtDelay -= 0.1;
                }, 100);
            }
            if (critical) {
                this.delayMove(0.2);
                this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? -10.0 : 10.0, y: 0.0 };
            }
            this.enemyInjuredColor();
        }
        damageTextEffect(amount, critical) {
            let damageText = new Laya.Text();
            let fakeX = Math.random() * 60;
            let fakeY = Math.random() * 50;
            damageText.pos(this.m_animation.x - fakeX, (this.m_animation.y - this.m_animation.height) - 100);
            damageText.bold = true;
            damageText.align = "center";
            damageText.alpha = 1;
            damageText.fontSize = critical ? 40 : 20;
            damageText.color = critical ? 'orange' : "white";
            if (amount >= 10000) {
                damageText.fontSize = 55;
                damageText.color = "#00DDDD";
            }
            let temp_text = "";
            for (let i = 0; i < String(amount).length; i++) {
                temp_text += String(amount)[i];
                temp_text += " ";
            }
            damageText.text = temp_text;
            damageText.font = "silver";
            damageText.stroke = 5;
            damageText.strokeColor = "#000";
            Laya.stage.addChild(damageText);
            Laya.Tween.to(damageText, { alpha: 0.65, fontSize: damageText.fontSize + 50, y: damageText.y + 50, }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 100 }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { damageText.destroy(); }), 0);
            }), 0);
        }
        showHealth() {
            this.m_healthBar = new Laya.ProgressBar();
            this.m_healthBar.height = 10;
            this.m_healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
            this.m_healthBar.skin = "comp/progress.png";
            this.m_healthBar.value = 1;
            this.m_healthBar.alpha = 1;
            Laya.stage.addChild(this.m_healthBar);
            setInterval((() => {
                if (this.m_healthBar.destroyed)
                    return;
                if (this.m_animation.destroyed) {
                    this.m_healthBar.destroy();
                    this.m_healthBar.destroyed = true;
                    return;
                }
                this.m_healthBar.alpha -= (this.m_healthBar.alpha > 0 && this.m_hurtDelay <= 0) ? 0.02 : 0;
                this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) - 10, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
                this.m_healthBar.value = this.m_health / this.m_maxHealth;
            }), 10);
        }
        bloodSplitEffect(enemy) {
            let bloodEffect = new Laya.Animation();
            bloodEffect.scaleX = 2;
            bloodEffect.scaleY = 2;
            let colorMat = [
                2, 0, 0, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            bloodEffect.filters = [glowFilter, colorFilter];
            bloodEffect.pos(enemy.x - 500, enemy.y - 500 + 30);
            bloodEffect.source = "comp/NewBlood.atlas";
            bloodEffect.on(Laya.Event.COMPLETE, this, function () {
                bloodEffect.destroy();
                bloodEffect.destroyed = true;
            });
            Laya.stage.addChild(bloodEffect);
            bloodEffect.play();
        }
        slashLightEffect(enemy) {
            let slashLightEffect = new Laya.Animation();
            slashLightEffect.scaleX = 2;
            slashLightEffect.scaleY = 2;
            let colorMat = [
                6, 1, 1, 0, -100,
                1, 5, 2, 0, -100,
                1, 0, 6, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashLightEffect.filters = [glowFilter, colorFilter];
            slashLightEffect.pos(this.m_isFacingRight ? enemy.x - 450 : enemy.x - 580, enemy.y - 500 + 30);
            slashLightEffect.source = "comp/SlashLight.atlas";
            slashLightEffect.alpha = 0.75;
            slashLightEffect.on(Laya.Event.COMPLETE, this, function () {
                slashLightEffect.destroy();
                slashLightEffect.destroyed = true;
            });
            Laya.stage.addChild(slashLightEffect);
            slashLightEffect.play();
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        enemyAIMain() {
            if (this.m_animation.destroyed) {
                return;
            }
            if (this.playerRangeCheck(this.m_attackRange * 2)) {
                this.tryAttack();
                this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer;
                if (!this.m_moveDelayValue)
                    this.m_rigidbody.linearVelocity = { x: 0.0, y: 0.0 };
                return;
            }
            this.pursuitPlayer();
        }
        checkPosition() {
            this.m_rectangle['x0'] = this.m_animation.x - (this.m_animation.width / 2);
            this.m_rectangle['x1'] = this.m_animation.x + (this.m_animation.width / 2);
            this.m_rectangle['y0'] = this.m_animation.y - (this.m_animation.height / 2);
            this.m_rectangle['y1'] = this.m_animation.y + (this.m_animation.height / 2);
            this.m_rectangle['w'] = this.m_animation.width;
            this.m_rectangle['h'] = this.m_animation.height;
        }
        pursuitPlayer() {
            if (this.m_player.destroyed) {
                this.updateAnimation(this.m_state, EnemyStatus.idle);
                return;
            }
            let dir = this.m_player.x - this.m_animation.x;
            let rightSide = (this.m_player.x - this.m_animation.x) > 0;
            this.m_animation.skewY = rightSide ? 0 : 180;
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
            if (this.m_atkTimer > 0 || this.m_player.destroyed)
                return;
            this.m_atkCd = false;
            this.m_moveVelocity["Vx"] = 0;
            let atkCircle = new Laya.Sprite();
            if (this.m_isFacingRight) {
                atkCircle.pos(this.m_animation.x + this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2);
            }
            else {
                atkCircle.pos(this.m_animation.x - 3 * this.m_animation.width / 2 - 80, this.m_animation.y - this.m_animation.height / 2);
            }
            let atkBoxCollider = atkCircle.addComponent(Laya.BoxCollider);
            let atkCircleRigid = atkCircle.addComponent(Laya.RigidBody);
            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
            atkCircleRigid.category = 8;
            atkCircleRigid.mask = 4;
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            this.updateAnimation(EnemyStatus.idle, EnemyStatus.attack);
            Laya.stage.addChild(atkCircle);
            atkBoxCollider.tag = this.m_atkTag;
            this.m_atkTimer = 100;
            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 100);
            setTimeout(() => {
                this.m_atkCd = true;
            }, 500);
            this.delayMove(0.3);
        }
        delayMove(time) {
            if (this.m_moveDelayTimer) {
                this.m_moveDelayValue += time;
            }
            else {
                this.m_moveDelayValue = time;
                this.m_moveDelayTimer = setInterval(() => {
                    if (this.m_moveDelayValue <= 0) {
                        clearInterval(this.m_moveDelayTimer);
                        this.m_moveDelayTimer = null;
                        this.m_moveDelayValue = 0;
                    }
                    this.m_moveDelayValue -= 0.1;
                }, 100);
            }
        }
        applyMoveX() {
            if (this.m_moveDelayValue > 0 || this.m_animation.destroyed)
                return;
            this.m_rigidbody.setVelocity({
                x: this.m_moveVelocity["Vx"],
                y: this.m_rigidbody.linearVelocity.y,
            });
        }
        updateAnimation(from, to, onCallBack = null, force = false, rate = 100) {
            if (from === to || this.m_animationChanging)
                return;
            this.m_state = to;
            switch (this.m_state) {
                case EnemyStatus.attack:
                    this.m_animationChanging = true;
                    this.m_animation.source = 'normalEnemy/Attack.atlas';
                    this.m_animation.play();
                    break;
                case EnemyStatus.idle:
                    this.m_animation.source = 'normalEnemy/Idle.atlas';
                    break;
                case EnemyStatus.run:
                    this.m_animation.source = 'normalEnemy/Walk.atlas';
                    this.m_animation.play();
                    break;
                default:
                    this.m_animation.source = 'normalEnemy/Idle.atlas';
                    break;
            }
            this.m_animation.interval = rate;
            if (typeof onCallBack === 'function')
                onCallBack();
        }
        enemyInjuredColor() {
            if (this.m_animation.destroyed || !this.m_animation)
                return;
            this.m_animation.alpha = 1;
            let colorMat = [
                2, 0, 0, 0, 10,
                0, 1, 0, 0, 10,
                0, 0, 0, 0, 10,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ef1ff8", 3, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [colorFilter, glowFilter];
            setTimeout(() => {
                if (!this.m_animation || this.m_animation.destroyed) {
                    return;
                }
                this.m_animation.alpha = 1;
                this.m_animation.filters = null;
            }, 200);
        }
    }
    class Normal extends VirtualEnemy {
        constructor() {
            super(...arguments);
            this.m_name = '普通敵人';
            this.m_health = 1000;
            this.m_armor = 100;
            this.m_speed = 2;
            this.m_tag = 'n';
            this.m_attackRange = 100;
            this.m_mdelay = 0.1;
            this.m_dmg = 33;
            this.m_atkTag = "EnemyNormalAttack";
        }
    }
    class Shield extends VirtualEnemy {
        constructor() {
            super(...arguments);
            this.m_name = '裝甲敵人';
            this.m_armor = 500;
            this.m_health = 1500;
            this.m_speed = 1;
            this.m_tag = 's';
            this.m_attackRange = 100;
            this.m_mdelay = 0.05;
            this.m_dmg = 30;
            this.m_atkTag = "EnemyShieldAttack";
        }
    }
    class EnemyHandler extends Laya.Script {
        static generator(player, enemyType, spawnPoint) {
            let enemy = this.decideEnemyType(enemyType);
            let id = enemy.m_tag + String(++this.enemyIndex);
            let point = [
                { "x": 150.0, "y": 450.0 },
                { "x": 3935.0, "y": 450.0 }
            ];
            let randomPoint = Math.floor(Math.random() * point.length);
            enemy.spawn(player, id, point[randomPoint]);
            this.enemyPool.push({ '_id': id, '_ent': enemy });
            this.updateEnemies();
            return enemy;
        }
        static decideEnemyType(enemyType) {
            switch (enemyType) {
                case 1: return new Normal();
                case 2: return new Shield();
                default: return new Normal();
            }
            ;
        }
        static updateEnemies() {
            return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
        }
        static getEnemiesCount() {
            return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
        }
        static getEnemyByLabel(label) {
            return this.enemyPool.filter(data => data._id === label)[0]['_ent'];
        }
    }
    EnemyHandler.enemyIndex = 0;
    EnemyHandler.enemyPool = [];

    var DebuffType;
    (function (DebuffType) {
        DebuffType[DebuffType["none"] = 0] = "none";
        DebuffType[DebuffType["blind"] = 1] = "blind";
        DebuffType[DebuffType["bodyCrumble"] = 2] = "bodyCrumble";
        DebuffType[DebuffType["insane"] = 4] = "insane";
        DebuffType[DebuffType["predator"] = 8] = "predator";
        DebuffType[DebuffType["decay"] = 16] = "decay";
    })(DebuffType || (DebuffType = {}));
    class DebuffProto extends Laya.Script {
        constructor() {
            super(...arguments);
            this.player = CharacterInit.playerEnt;
        }
        debuffUpdate() {
        }
    }
    class Blind extends DebuffProto {
        constructor() {
            super(...arguments);
            this.debuffText = "哈，那東西爆掉的樣子真滑稽";
        }
    }
    class BodyCrumble extends DebuffProto {
        constructor() {
            super(...arguments);
            this.debuffText = "希望你還走得回去";
        }
    }
    class Insane extends DebuffProto {
        constructor() {
            super(...arguments);
            this.debuffText = "對力量的渴望會讓你拋棄理性";
        }
    }
    class Predator extends DebuffProto {
        constructor() {
            super(...arguments);
            this.debuffText = "它們循著氣息來了";
        }
    }
    class Decay extends DebuffProto {
        constructor() {
            super(...arguments);
            this.debuffText = "為我戰鬥至到粉身碎骨吧";
            this.isKilling = false;
            this.killingTimer = 0;
            this.currentEnemyCount = 0;
            this.priviousEnemyCount = 0;
        }
        checkKilling() {
            setTimeout(() => {
                this.priviousEnemyCount = EnemyHandler.getEnemiesCount();
            }, 100);
            this.currentEnemyCount = EnemyHandler.getEnemiesCount();
            console.log(this.currentEnemyCount - this.priviousEnemyCount);
            if (this.currentEnemyCount - this.priviousEnemyCount > 0)
                this.killingTimer = 120;
            if (this.killingTimer > 0) {
                this.isKilling = true;
                this.killingTimer--;
            }
            else {
                this.isKilling = false;
            }
        }
        decayEffect() {
            this.checkKilling();
            setInterval(() => {
                if (this.isKilling) {
                    this.player.setHealth(this.player.getHealth() - (this.player.m_maxHealth * 0.1));
                }
            }, 1000);
        }
        debuffUpdate() {
            super.debuffUpdate();
            this.decayEffect();
        }
    }
    class DebuffManager extends Laya.Script {
        static CastDeBuff(debuffType) {
            let debuff = this.decideDebuffType(debuffType);
            debuff.debuffUpdate();
            return debuff;
        }
        static decideDebuffType(debuffType) {
            switch (debuffType) {
                case 1 << 0: return new Blind();
                case 1 << 1: return new BodyCrumble();
                case 1 << 2: return new Insane();
                case 1 << 3: return new Predator();
                case 1 << 4: return new Decay();
            }
            ;
        }
    }

    class OathManager extends Laya.Script {
        static initOathSystem() {
        }
        static getBloodyPoint() {
            return CharacterInit.playerEnt.m_bloodyPoint;
        }
        static setBloodyPoint(amount) {
            CharacterInit.playerEnt.m_bloodyPoint = amount;
            return CharacterInit.playerEnt.m_bloodyPoint;
        }
        static showBloodyPoint(player) {
            OathManager.oathBar = new Laya.ProgressBar();
            OathManager.oathBar.skin = "UI/bp_100.png";
            setInterval((() => {
                if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                    OathManager.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
                }
                OathManager.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint_hard;
            }), 5);
            Laya.stage.addChild(OathManager.oathBar);
        }
        static showBloodyLogo(player) {
            this.characterLogo = new Laya.Animation();
            this.characterLogo.source = "UI/Box.png";
            setInterval((() => {
                if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                    this.characterLogo.pos(player.x - Laya.stage.width / 2 + 20, 20);
                }
            }), 5);
            Laya.stage.addChild(this.characterLogo);
            this.characterLogo.play();
        }
        static oathChargeDetect() {
            return (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? true : false;
        }
        static oathBuffUpdate() {
            if (CharacterInit.playerEnt.m_animation.destroyed)
                return;
            if (OathManager.oathChargeDetect()) {
                CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_buff_xMaxVelocity;
                CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_buff_attackCdTime;
            }
            else {
                CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_basic_xMaxVelocity;
                CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_basic_attackCdTime;
            }
        }
        static addDebuff(type) {
            switch (type) {
                case 1 << 0:
                    OathManager.playerDebuff |= DebuffType.blind;
                    break;
                case 1 << 1:
                    OathManager.playerDebuff |= DebuffType.bodyCrumble;
                    break;
                case 1 << 2:
                    OathManager.playerDebuff |= DebuffType.insane;
                    break;
                case 1 << 3:
                    OathManager.playerDebuff |= DebuffType.predator;
                    break;
                case 1 << 4:
                    OathManager.playerDebuff |= DebuffType.decay;
                    break;
            }
        }
        static removeDebuff(type) {
            switch (type) {
                case 1 << 0:
                    OathManager.playerDebuff ^= DebuffType.blind;
                    break;
                case 1 << 1:
                    OathManager.playerDebuff ^= DebuffType.bodyCrumble;
                    break;
                case 1 << 2:
                    OathManager.playerDebuff ^= DebuffType.insane;
                    break;
                case 1 << 3:
                    OathManager.playerDebuff ^= DebuffType.predator;
                    break;
                case 1 << 4:
                    OathManager.playerDebuff ^= DebuffType.decay;
                    break;
            }
        }
        static oathUpdate() {
            switch (this.oathState) {
                case OathStatus.normal:
                    if (OathManager.oathChargeDetect()) {
                        OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_soft);
                        this.oathState = OathStatus.charge;
                        OathManager.addDebuff(1 << 4);
                    }
                    break;
                case OathStatus.charge:
                    if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_soft && OathManager.overChargeCount >= 2) {
                        OathManager.overChargeCount = 0;
                        OathManager.oathBar.skin = "UI/bp_150.png";
                        this.oathState = OathStatus.overCharge;
                        return;
                    }
                    if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_soft && OathManager.overChargeCount < 2) {
                        OathManager.overChargeCount++;
                        OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_soft);
                        return;
                    }
                    if (OathManager.getBloodyPoint() < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        OathManager.overChargeCount = 0;
                        this.oathState = OathStatus.normal;
                        return;
                    }
                    break;
                case OathStatus.overCharge:
                    let addDebuffTimer = setTimeout(() => {
                        OathManager.addDebuff(1 << Math.ceil(Math.random() * 4));
                        console.log("debuff", this.playerDebuff);
                    }, 5000);
                    if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_hard) {
                        OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_hard);
                        return;
                    }
                    if (OathManager.getBloodyPoint() === CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        clearInterval(addDebuffTimer);
                        OathManager.oathBar.skin = "UI/bp_100.png";
                        this.oathState = OathStatus.charge;
                        return;
                    }
                    if (OathManager.getBloodyPoint() < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        clearInterval(addDebuffTimer);
                        OathManager.oathBar.skin = "UI/bp_100.png";
                        this.oathState = OathStatus.normal;
                        return;
                    }
                    break;
                default:
                    this.oathState = OathStatus.normal;
                    break;
            }
            OathManager.oathBuffUpdate();
        }
        static debuffUpdate() {
            if ((this.playerDebuff & DebuffType.blind) === DebuffType.blind) {
            }
            if ((this.playerDebuff & DebuffType.bodyCrumble) === DebuffType.bodyCrumble) {
            }
            if ((this.playerDebuff & DebuffType.insane) === DebuffType.insane) {
            }
            if ((this.playerDebuff & DebuffType.predator) === DebuffType.predator) {
            }
            if ((this.playerDebuff & DebuffType.decay) === DebuffType.decay) {
                let debuffText = "為我戰鬥至到粉身碎骨吧";
                let isKilling = false;
                let killingTimer = 0;
                let currentEnemyCount = 0;
                let priviousEnemyCount = 0;
            }
        }
        static oathCastSkill(cost, valve = 30) {
            if (OathManager.getBloodyPoint() < valve || OathManager.getBloodyPoint() < cost)
                return false;
            OathManager.setBloodyPoint(OathManager.getBloodyPoint() - cost);
            return true;
        }
    }
    OathManager.oathState = 0;
    OathManager.increaseBloodyPoint = 10;
    OathManager.isCharging = false;
    OathManager.overChargeCount = 0;
    OathManager.playerDebuff = DebuffType.none;

    var CharacterStatus;
    (function (CharacterStatus) {
        CharacterStatus[CharacterStatus["idle"] = 0] = "idle";
        CharacterStatus[CharacterStatus["run"] = 1] = "run";
        CharacterStatus[CharacterStatus["jump"] = 2] = "jump";
        CharacterStatus[CharacterStatus["down"] = 3] = "down";
        CharacterStatus[CharacterStatus["attackOne"] = 4] = "attackOne";
        CharacterStatus[CharacterStatus["attackTwo"] = 5] = "attackTwo";
        CharacterStatus[CharacterStatus["slam"] = 6] = "slam";
        CharacterStatus[CharacterStatus["hurt"] = 7] = "hurt";
        CharacterStatus[CharacterStatus["defend"] = 8] = "defend";
        CharacterStatus[CharacterStatus["death"] = 9] = "death";
    })(CharacterStatus || (CharacterStatus = {}));

    class VirtualSkill extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_canUse = true;
        }
        cast(owner, position) {
        }
        ;
        castRoar(pos) {
            let roarText = new Laya.Text();
            roarText.pos(pos['x'] - 30, pos['y'] - 130);
            roarText.bold = true;
            roarText.align = "left";
            roarText.alpha = 1;
            roarText.width = 300;
            roarText.wordWrap = false;
            roarText.fontSize = 70;
            roarText.color = '#FF3333';
            let temp_name = "";
            for (let i = 0; i < this.m_name.length; i++) {
                temp_name += this.m_name[i];
                temp_name += " ";
            }
            roarText.text = temp_name;
            roarText.font = "silver";
            Laya.stage.addChild(roarText);
            Laya.Tween.to(roarText, { alpha: 0.55, fontSize: roarText.fontSize + 30, }, 350, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(roarText, { alpha: 0, fontSize: roarText.fontSize - 13, y: roarText.y - 50 }, 350, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { roarText.destroy(); }), 0);
            }), 0);
        }
        rectIntersect(r1, r2) {
            let aLeftOfB = r1.x1 < r2.x0;
            let aRightOfB = r1.x0 > r2.x1;
            let aAboveB = r1.y0 > r2.y1;
            let aBelowB = r1.y1 < r2.y0;
            return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
        }
        rectCircleIntersect(circle, rect) {
            let distX = Math.abs(circle.x - rect.x0 - rect.w / 2);
            let distY = Math.abs(circle.y - rect.y0 - rect.h / 2);
            if (distX > (rect.w / 2 + circle.r)) {
                return false;
            }
            if (distY > (rect.h / 2 + circle.r)) {
                return false;
            }
            if (distX <= (rect.w / 2)) {
                return true;
            }
            if (distY <= (rect.h / 2)) {
                return true;
            }
            var dx = distX - rect.w / 2;
            var dy = distY - rect.h / 2;
            return (dx * dx + dy * dy <= (circle.r * circle.r));
        }
    }

    class Spike extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '突進斬';
            this.m_damage = 111;
            this.m_cost = 0;
            this.m_id = 1;
            this.m_cd = 3;
            this.m_lastTime = 0.2;
            this.m_spikeVec = 55.0;
        }
        cast(owner, position) {
            if (!this.m_canUse)
                return;
            let rightSide = owner.m_isFacingRight;
            this.m_animation = new Laya.Animation();
            this.m_animation.width = 400;
            this.m_animation.height = 200;
            this.m_animation.scaleX = 2;
            this.m_animation.scaleY = 2;
            this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 195);
            let offsetX = rightSide ? position['x'] : position['x'] - this.m_animation.width;
            let offsetY = position['y'] - this.m_animation.height / 2 + 20;
            this.m_animation.source = "comp/Spike.atlas";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 20;
            this.m_canUse = false;
            this.castRoar(position);
            let colorMat = [
                2, 0, 0, 0, -100,
                0, 4, 0, 0, -100,
                0, 0, Math.floor(Math.random() * 2) + 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [glowFilter, colorFilter];
            this.m_animation.skewY = rightSide ? 0 : 180;
            owner.delayMove(this.m_lastTime);
            owner.m_rigidbody.linearVelocity = { x: rightSide ? this.m_spikeVec : -this.m_spikeVec };
            owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 150);
            owner.hurtedEvent(0.5);
            this.attackRangeCheck(owner, {
                "x0": offsetX,
                "x1": offsetX + this.m_animation.width,
                "y0": offsetY,
                "y1": offsetY + this.m_animation.height,
            });
            Laya.stage.addChild(this.m_animation);
            setTimeout(() => {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            }, 200);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
        }
        attackRangeCheck(owner, pos) {
            let enemy = EnemyHandler.enemyPool;
            let rightSide = owner.m_isFacingRight;
            let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true));
            enemyFound.forEach((e) => {
                if (e._ent.m_animation.destroyed === true)
                    return;
                e._ent.takeDamage(this.m_damage);
                e._ent.delayMove(0.1);
                e._ent.m_rigidbody.linearVelocity = { x: rightSide ? this.m_spikeVec / 2 : -this.m_spikeVec / 2 };
            });
        }
    }
    class Behead extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '攻其不備';
            this.m_damage = 444;
            this.m_cost = 0;
            this.m_id = 1;
            this.m_cd = 3;
            this.m_preTime = 1.0;
        }
        cast(owner, position) {
            if (!this.m_canUse)
                return;
            let rightSide = owner.m_isFacingRight;
            this.m_animation = new Laya.Animation();
            this.m_animation.width = owner.m_animation.width;
            this.m_animation.height = owner.m_animation.height;
            this.m_animation.scaleX = 1;
            this.m_animation.scaleY = 1;
            this.m_animation.pos(rightSide ? position['x'] - 240 : position['x'] - 240, position['y'] - 250);
            let offsetX = rightSide ? position['x'] : position['x'] - this.m_animation.width;
            let offsetY = position['y'] - this.m_animation.height / 2 + 20;
            this.m_animation.source = "comp/Target.atlas";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 25;
            this.m_canUse = false;
            this.castRoar(position);
            owner.delayMove(this.m_preTime);
            owner.m_rigidbody.linearVelocity = { x: 0.0, y: 0.0 };
            owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 125);
            let colorMat = [
                3, 0, 2, 0, -300,
                0, 3, 0, 0, -100,
                3, 0, 3, 0, -300,
                0, 0, 0, 2, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#8400ff", 50, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [glowFilter, colorFilter];
            this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            });
            Laya.stage.addChild(this.m_animation);
            setTimeout(() => {
                owner.m_rigidbody.setVelocity({ x: 0.0, y: 10.0 });
                this.attackRangeCheck(owner, {
                    "x0": offsetX,
                    "x1": offsetX + this.m_animation.width,
                    "y0": offsetY,
                    "y1": offsetY + this.m_animation.height,
                });
            }, this.m_preTime * 1000);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
        }
        attackRangeCheck(owner, pos) {
            let enemy = EnemyHandler.enemyPool;
            let targetEnemy = Math.floor(Math.random() * enemy.length);
            if (enemy.length === 0) {
                console.log('目前沒有敵人，無法使用 ', this.m_name);
                return;
            }
            console.log('攻擊標記(目前隨機)敵人: ', targetEnemy, enemy[targetEnemy]);
            owner.m_animation.x = enemy[targetEnemy]._ent.m_animation.x + (enemy[targetEnemy]._ent.m_animation.skewY === 0 ? 50 : -50);
            owner.m_animation.y = enemy[targetEnemy]._ent.m_animation.y;
            owner.updateAnimation(owner.m_state, CharacterStatus.attackTwo, null, false, 125);
            enemy[targetEnemy]._ent.takeDamage(this.m_damage);
        }
    }

    class Slam extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '猛擊';
            this.m_damage = 125;
            this.m_cost = 0;
            this.m_id = 2;
            this.m_cd = 1;
            this.m_injuredEnemy = [];
        }
        cast(owner, position) {
            if (!this.m_canUse)
                return;
            let rightSide = owner.m_isFacingRight;
            this.m_animation = new Laya.Animation();
            this.m_animation.width = 350;
            this.m_animation.height = 350;
            this.m_animation.scaleX = 1.5;
            this.m_animation.scaleY = 1.5;
            this.m_animation.source = "comp/Slam.atlas";
            this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 700, position['y'] - 550);
            this.m_animation.autoPlay = false;
            this.m_animation.interval = 25;
            this.m_animation.alpha = 1;
            let colorMat = [
                4, 0, 0, 0, -180,
                0, Math.floor(Math.random() * 4) + 2, 0, 0, -180,
                0, 0, 4, 0, -180,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#8400ff", 50, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [glowFilter, colorFilter];
            this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            });
            Laya.stage.addChild(this.m_animation);
            setTimeout(() => {
                this.m_animation.play();
                let timer = setInterval(() => {
                    if (rangeY > offsetInterval) {
                        clearInterval(timer);
                    }
                    offsetY += rangeY;
                    Laya.stage.graphics.drawRect(offsetX, offsetY, this.m_animation.width, this.m_animation.height, 'red', 'red');
                    this.attackRangeCheck(owner, {
                        "x0": offsetX,
                        "x1": offsetX + this.m_animation.width,
                        "y0": offsetY,
                        "y1": offsetY + this.m_animation.height,
                    });
                    rangeY += 5;
                }, 50);
            }, 180);
            owner.updateAnimation(owner.m_state, CharacterStatus.slam, null, false, 100);
            let offsetX = rightSide ? position['x'] + 65 : position['x'] - this.m_animation.width - 65;
            let offsetY = position['y'] - this.m_animation.height - 70;
            let offsetInterval = 40;
            let rangeY = 0;
            this.m_canUse = false;
            this.castRoar(position);
            this.m_injuredEnemy = [];
            setTimeout(() => {
                this.m_canUse = true;
                Laya.stage.graphics.clear();
            }, this.m_cd * 1000);
        }
        attackRangeCheck(owner, pos) {
            let enemy = EnemyHandler.enemyPool;
            let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true && this.m_injuredEnemy.indexOf(data._id) === -1));
            enemyFound.forEach((e) => {
                e._ent.delayMove(0.3);
                e._ent.takeDamage(this.m_damage);
                this.m_injuredEnemy.push(e._id);
                owner.setCameraShake(50, 12);
            });
        }
    }
    class BlackHole extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '深淵侵蝕';
            this.m_damage = 99999;
            this.m_dotDamage = 7;
            this.m_cost = 0;
            this.m_id = 2;
            this.m_cd = 5;
            this.m_lastTime = 2;
            this.m_radius = 100;
        }
        cast(owner, position) {
            if (!this.m_canUse)
                return;
            let rightSide = owner.m_isFacingRight;
            let explosion = new Laya.Animation();
            this.m_animation = new Laya.Animation();
            this.m_animation.width = this.m_animation.height = this.m_radius;
            this.m_animation.scaleX = 1;
            this.m_animation.scaleY = 1;
            this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 400, position['y'] - 300);
            this.m_animation.alpha = 0.7;
            this.m_animation.source = "comp/BlackHole.atlas";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 20;
            explosion.source = "comp/BlackExplosion.atlas";
            explosion.scaleX = 1;
            explosion.scaleY = 1;
            explosion.interval = 30;
            explosion.pos(this.m_animation.x, this.m_animation.y);
            let offsetX = rightSide ? position['x'] + 140 : position['x'] - this.m_animation.width - 65;
            let offsetY = position['y'] - this.m_animation.height / 2;
            this.m_canUse = false;
            this.castRoar(position);
            let colorMat = [
                4, 0, 2, 0, -150,
                0, 1, 1, 0, -100,
                1, 2, 1, 0, -150,
                0, 0, 0, 2, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#460075", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [glowFilter, colorFilter];
            let colorFilterex = new Laya.ColorFilter(colorMat);
            explosion.filters = [glowFilter, colorFilter];
            let count = 0;
            let timer = setInterval(() => {
                if (count >= this.m_lastTime * 1000) {
                    Laya.stage.addChild(explosion);
                    explosion.play();
                    setTimeout(() => {
                        explosion.destroy();
                    }, 300);
                    this.attackRangeCheck(owner, {
                        "x": offsetX,
                        "y": offsetY,
                        "r": this.m_radius,
                    }, this.m_damage);
                    clearInterval(timer);
                }
                this.attractRangeCheck(owner, {
                    "x": offsetX,
                    "y": offsetY,
                    "r": this.m_radius + 100,
                });
                this.attackRangeCheck(owner, {
                    "x": offsetX,
                    "y": offsetY,
                    "r": this.m_radius + 100,
                }, this.m_dotDamage);
                count += 100;
            }, 100);
            setTimeout(() => {
                this.m_animation.destroy();
            }, this.m_lastTime * 1000);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
            Laya.stage.addChild(this.m_animation);
            this.m_animation.play();
        }
        attractRangeCheck(owner, pos) {
            let enemy = EnemyHandler.enemyPool;
            let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
            enemyFound.forEach((e) => {
                if (e._ent.m_animation.destroyed === true)
                    return;
                e._ent.m_rigidbody.setVelocity({
                    "x": (pos['x'] - (e._ent.m_rectangle['x0'] + e._ent.m_animation.width / 2)) * 0.1,
                    "y": (pos['y'] - (e._ent.m_rectangle['y0'] + e._ent.m_animation.height / 2)) * 0.1,
                });
            });
        }
        attackRangeCheck(owner, pos, dmg) {
            let enemy = EnemyHandler.enemyPool;
            let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
            enemyFound.forEach((e) => {
                e._ent.takeDamage(dmg);
            });
        }
    }

    class Character extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_moveDelayValue = 0;
            this.m_moveDelayTimer = null;
            this.m_isFacingRight = true;
            this.m_canJump = true;
            this.m_canAttack = true;
            this.m_atkTimer = null;
            this.m_atkStep = 0;
            this.m_hurted = false;
            this.m_hurtTimer = null;
            this.m_slashTimer = null;
            this.m_cameraShakingTimer = 0;
            this.m_cameraShakingMultiplyer = 1;
            this.m_catSkill = null;
            this.m_humanSkill = null;
        }
        spawn() {
            this.m_state = CharacterStatus.idle;
            this.m_animation = new Laya.Animation();
            this.m_animation.scaleX = 1;
            this.m_animation.scaleY = 1;
            this.m_animation.zOrder = 10;
            this.m_animation.name = "Player";
            this.m_animation.width = 200;
            this.m_animation.height = 128;
            this.m_animation.pivotX = this.m_animation.width / 2;
            this.m_animation.pivotY = this.m_animation.height / 2;
            this.m_animation.pos(1345, 544);
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'character/Idle.atlas';
            this.m_animation.interval = 200;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                if (this.m_state === CharacterStatus.attackOne || this.m_state === CharacterStatus.attackTwo)
                    this.m_animation.stop();
                this.m_animationChanging = false;
                if (Math.abs(this.m_playerVelocity["Vx"]) <= 0 && !this.m_atkTimer)
                    this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
            });
            this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
            this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
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
                if (col.label === "ground") {
                    this.resetMove();
                    this.m_canJump = true;
                }
                if (col.tag === "Enemy" && !this.m_hurtTimer) {
                    this.delayMove(0.15);
                    this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? -10.0 : 10.0, y: 0.0 };
                    this.takeDamage(50.0);
                }
                this.takeDamage(this.getEnemyAttackDamage(col.tag));
            };
            this.m_script.onKeyUp = (e) => {
                if (this.m_canJump) {
                    this.m_playerVelocity["Vx"] = 0;
                }
                this.applyMoveX();
                delete this.m_keyDownList[e["keyCode"]];
            };
            this.m_script.onKeyDown = (e) => {
                let keyCode = e["keyCode"];
                this.m_keyDownList[keyCode] = true;
            };
            this.m_collider.width = this.m_animation.width * 0.6;
            this.m_collider.height = this.m_animation.height;
            this.m_collider.x += 38;
            this.m_collider.y -= 1;
            this.m_collider.tag = 'Player';
            this.m_collider.friction = 0;
            this.m_rigidbody.allowRotation = false;
            this.m_rigidbody.gravityScale = 3;
            this.m_rigidbody.category = 4;
            this.m_rigidbody.mask = 8 | 2 | 16;
            Laya.stage.addChild(this.m_animation);
            OathManager.showBloodyPoint(this.m_animation);
            OathManager.showBloodyLogo(this.m_animation);
            this.cameraFollower();
            this.showHealth();
            this.setSkill();
        }
        ;
        setHealth(amount) {
            this.m_health = amount;
            if (this.m_health <= 0) {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            }
        }
        getHealth() {
            return this.m_health;
        }
        ;
        takeDamage(amount) {
            if (amount <= 0 || this.m_animation.destroyed || !this.m_animation || this.m_hurted)
                return;
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= 33);
            amount *= critical ? 3 : 1;
            this.setHealth(this.getHealth() - amount);
            this.damageTextEffect(amount, critical);
            Laya.Tween.to(this.m_animation, { alpha: 0.65 }, 250, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 250, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
            }), 0);
            this.hurtedEvent(0.5);
        }
        checkJumpTimer() {
            let timer = setInterval(() => {
                if (!this.m_animation || this.m_animation.destroyed) {
                    clearInterval(timer);
                    return;
                }
                this.m_canJump = (Math.abs(this.m_animation.y + (this.m_animation.height / 2) - 590) < 10) ? true : false;
                console.log(this.m_canJump);
            }, 1000);
        }
        hurtedEvent(time) {
            this.m_hurted = true;
            this.m_hurtTimer = setTimeout(() => {
                this.m_hurted = false;
                this.m_hurtTimer = null;
            }, 1000 * time);
        }
        damageTextEffect(amount, critical) {
            let damageText = new Laya.Text();
            let soundNum;
            damageText.pos((this.m_animation.x - this.m_animation.width / 2) + 15, (this.m_animation.y - this.m_animation.height) - 3);
            damageText.bold = true;
            damageText.align = "left";
            damageText.alpha = 1;
            damageText.fontSize = critical ? 40 : 20;
            damageText.color = critical ? '#ff31c8' : "red";
            let temp_text = "";
            for (let i = 0; i < String(amount).length; i++) {
                temp_text += String(amount)[i];
                temp_text += " ";
            }
            damageText.text = temp_text;
            damageText.font = "silver";
            Laya.stage.addChild(damageText);
            Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 50, }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { damageText.destroy(); }), 0);
            }), 0);
        }
        listenKeyBoard() {
            this.m_keyDownList = [];
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
        showHealth() {
            this.m_healthBar = new Laya.ProgressBar();
            this.m_healthBar.skin = "UI/hp.png";
            Laya.stage.addChild(this.m_healthBar);
            setInterval((() => {
                if (this.m_animation.destroyed) {
                    this.m_healthBar.destroy();
                    this.m_healthBar.destroyed = true;
                    return;
                }
                if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                    this.m_healthBar.pos(this.m_animation.x - Laya.stage.width / 2 + 155, 77.5);
                }
                this.m_healthBar.value = this.m_health / this.m_maxHealth;
            }), 5);
        }
        characterMove() {
            if (this.m_keyDownList[37]) {
                this.m_playerVelocity["Vx"] += -1 * this.m_velocityMultiplier;
                if (this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.m_animation.skewY = 180;
                    this.m_isFacingRight = false;
                }
                this.applyMoveX();
                if (!this.m_animationChanging)
                    this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
            }
            if (this.m_keyDownList[38]) {
                if (this.m_canJump) {
                    this.m_playerVelocity["Vy"] -= 12;
                    this.applyMoveY();
                    this.m_canJump = false;
                }
            }
            if (this.m_keyDownList[39]) {
                this.m_playerVelocity["Vx"] += 1 * this.m_velocityMultiplier;
                if (!this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.m_animation.skewY = 0;
                    this.m_isFacingRight = true;
                }
                this.applyMoveX();
                if (!this.m_animationChanging)
                    this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
            }
            if (this.m_keyDownList[40]) {
                this.m_humanSkill = new Behead();
                this.m_catSkill = new Slam();
            }
            if (this.m_keyDownList[32]) {
            }
            if (this.m_keyDownList[17]) {
                if (!this.m_canAttack)
                    return;
                if (this.m_atkTimer)
                    clearInterval(this.m_atkTimer);
                this.createAttackEffect(this.m_animation);
                this.attackStepEventCheck();
                if (!this.m_animationChanging) {
                    if (this.m_atkStep === 1) {
                        this.updateAnimation(this.m_state, CharacterStatus.attackTwo, null, false, this.m_attackCdTime / 3);
                    }
                    else if (this.m_atkStep === 0) {
                        this.updateAnimation(this.m_state, CharacterStatus.attackOne, null, false, this.m_attackCdTime / 8);
                    }
                }
                this.m_atkStep = this.m_atkStep === 1 ? 0 : 1;
                this.attackSimulation();
                this.m_canAttack = false;
                setTimeout(() => {
                    this.m_canAttack = true;
                }, this.m_attackCdTime);
            }
            if (this.m_keyDownList[16])
                console.log(OathManager.playerDebuff);
            if (this.m_keyDownList[49] && this.m_keyDownList[37] || this.m_keyDownList[49] && this.m_keyDownList[39]) {
                this.m_humanSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                });
            }
            if (this.m_keyDownList[50] && this.m_keyDownList[37] || this.m_keyDownList[50] && this.m_keyDownList[39]) {
                this.m_catSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                });
            }
        }
        attackStepEventCheck() {
            this.m_atkTimer = setTimeout(() => {
                this.m_atkStep = 0;
                this.m_atkTimer = null;
                this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
            }, this.m_attackCdTime + 200);
        }
        attackSimulation() {
            let temp = this.m_animation;
            let atkRange = this.m_attackRange;
            let offsetX = this.m_isFacingRight ? (temp.x + (temp.width * 1 / 3)) : (temp.x - (temp.width * 1 / 3) - atkRange);
            let offsetY = temp.y - (temp.height / 3);
            let soundNum = Math.floor(Math.random() * 2);
            this.attackRangeCheck({
                'x0': offsetX,
                'x1': offsetX + atkRange,
                'y0': offsetY,
                'y1': offsetY + atkRange,
            }, 'rect');
            this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);
        }
        attackRangeCheck(pos, type) {
            let enemy = EnemyHandler.enemyPool;
            switch (type) {
                case 'rect':
                    let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
                    let soundNum;
                    let fakeNum = Math.random() * 100;
                    let critical = (fakeNum <= 25);
                    soundNum = critical ? 0 : 1;
                    enemyFound.forEach((e) => {
                        e._ent.takeDamage(Math.round(Math.floor(Math.random() * 51) + 150));
                        this.setCameraShake(10, 3);
                        OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
                        e._ent.slashLightEffect(e._ent.m_animation);
                        this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);
                    });
                    break;
                default:
                    break;
            }
        }
        rectIntersect(r1, r2) {
            let aLeftOfB = r1.x1 < r2.x0;
            let aRightOfB = r1.x0 > r2.x1;
            let aAboveB = r1.y0 > r2.y1;
            let aBelowB = r1.y1 < r2.y0;
            return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
        }
        createAttackEffect(player) {
            let slashEffect = new Laya.Animation();
            slashEffect.scaleX = 2;
            slashEffect.scaleY = 2;
            if (this.m_atkStep === 0) {
                slashEffect.source = "comp/NewSlash_1.atlas";
            }
            else if (this.m_atkStep === 1) {
                slashEffect.source = "comp/NewSlash_2.atlas";
            }
            let colorNum = Math.floor(Math.random() * 5) + 2;
            let colorMat = [
                colorNum, 0, 4, 0, -150,
                3, Math.floor(Math.random() * 4) + 2, 0, 0, -150,
                0, 0, colorNum, 0, -150,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#af06ff", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashEffect.filters = [colorFilter, glowFilter];
            if (this.m_isFacingRight) {
                slashEffect.skewY = 0;
                slashEffect.pos(player.x - 420, player.y - 560 + 10);
            }
            else {
                slashEffect.skewY = 180;
                slashEffect.pos(player.x + 420, player.y - 560 + 10);
            }
            slashEffect.on(Laya.Event.COMPLETE, this, function () {
                slashEffect.destroy();
                slashEffect.destroyed = true;
            });
            Laya.stage.addChild(slashEffect);
            slashEffect.play();
            let m_slashTimer = setInterval(() => {
                if (slashEffect.destroyed) {
                    clearInterval(m_slashTimer);
                    m_slashTimer = null;
                    return;
                }
                slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
                slashEffect.pos(player.x + (this.m_isFacingRight ? -420 : 420), player.y - 560 + 10);
            }, 10);
        }
        setSkill() {
            this.m_humanSkill = new Spike();
            this.m_catSkill = new BlackHole();
        }
        delayMove(time) {
            if (this.m_moveDelayTimer) {
                this.m_moveDelayValue += time;
            }
            else {
                this.m_moveDelayValue = time;
                this.m_moveDelayTimer = setInterval(() => {
                    if (this.m_moveDelayValue <= 0) {
                        this.resetMove();
                        clearInterval(this.m_moveDelayTimer);
                        this.m_moveDelayTimer = null;
                        this.m_moveDelayValue = 0;
                    }
                    this.m_moveDelayValue -= 0.1;
                }, 100);
            }
        }
        resetMove() {
            this.m_playerVelocity["Vx"] = 0;
            this.m_playerVelocity["Vy"] = 0;
            this.applyMoveX();
            this.applyMoveY();
        }
        applyMoveX() {
            if (this.m_moveDelayValue > 0 || this.m_animation.destroyed || !this.m_animation)
                return;
            this.m_rigidbody.setVelocity({
                x: this.m_playerVelocity["Vx"],
                y: this.m_rigidbody.linearVelocity.y,
            });
            if (!this.m_animationChanging && this.m_playerVelocity["Vx"] === 0)
                this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
        }
        applyMoveY() {
            if (!this.m_animation || this.m_animation.destroyed)
                return;
            this.m_rigidbody.setVelocity({
                x: this.m_rigidbody.linearVelocity.x,
                y: this.m_playerVelocity["Vy"],
            });
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
        cameraFollower() {
            if (this.m_animation.destroyed)
                return;
            let player_pivot_x = Laya.stage.width / 2;
            let player_pivot_y = Laya.stage.height / 2;
            setInterval(() => {
                if (this.m_animation.destroyed)
                    return;
                if (this.m_cameraShakingTimer > 0) {
                    let randomSign = (Math.floor(Math.random() * 2) == 1) ? 1 : -1;
                    Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                    Laya.stage.y = 0 + Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                    this.m_cameraShakingTimer--;
                }
                else {
                    Laya.stage.x = player_pivot_x - this.m_animation.x;
                }
                if (Laya.stage.x >= -250.0)
                    Laya.stage.x = -250.0;
                if (Laya.stage.x <= -2475.0)
                    Laya.stage.x = -2475.0;
            }, 10);
        }
        setCameraShake(timer, multiplier) {
            this.m_cameraShakingMultiplyer = multiplier;
            this.m_cameraShakingTimer = timer;
        }
        updateAnimation(from, to, onCallBack = null, force = false, rate = 100) {
            if (from === to || this.m_animationChanging)
                return;
            this.m_state = to;
            switch (this.m_state) {
                case CharacterStatus.attackOne:
                    this.m_animationChanging = true;
                    this.m_animation.source = 'character/Attack1.atlas';
                    this.m_animation.play();
                    break;
                case CharacterStatus.attackTwo:
                    this.m_animationChanging = true;
                    this.m_animation.source = 'character/Attack2.atlas';
                    this.m_animation.play();
                    break;
                case CharacterStatus.idle:
                    this.m_animation.source = 'character/Idle.atlas';
                    this.m_animation.play();
                    break;
                case CharacterStatus.run:
                    this.m_animation.source = 'character/Run.atlas';
                    this.m_animation.play();
                    break;
                case CharacterStatus.slam:
                    this.m_animationChanging = true;
                    this.m_animation.source = "character/Slam.atlas";
                    this.m_animation.play();
                    break;
                default:
                    this.m_animation.source = 'character/Idle.atlas';
                    this.m_animation.play();
                    break;
            }
            this.m_animation.interval = rate;
            if (typeof onCallBack === 'function')
                onCallBack();
        }
        getEnemyAttackDamage(tag) {
            switch (tag) {
                case "EnemyNormalAttack":
                    return new Normal().m_dmg;
                case "EnemyShieldAttack":
                    return new Shield().m_dmg;
                default:
                    return 0;
            }
        }
    }
    class CharacterInit extends Laya.Script {
        constructor() {
            super();
            this.health = 1000;
            this.bloodyPoint = 0;
            this.maxBloodyPoint_soft = 100;
            this.maxBloodyPoint_hard = 150;
            this.xMaxVelocity = 5;
            this.buff_xMaxVelocity = 5.75;
            this.yMaxVelocity = 5;
            this.velocityMultiplier = 5;
            this.attackRange = 100;
            this.attackCdTime = 500;
            this.buff_attackCdTime = 425;
        }
        onAwake() {
            let player = new Character();
            this.initSetting(player);
            player.spawn();
            CharacterInit.playerEnt = player;
            Laya.stage.addChild(CharacterInit.playerEnt.m_animation);
        }
        initSetting(player) {
            player.m_maxHealth = player.m_health = this.health;
            player.m_bloodyPoint = this.bloodyPoint;
            player.m_maxBloodyPoint_soft = this.maxBloodyPoint_soft;
            player.m_maxBloodyPoint_hard = this.maxBloodyPoint_hard;
            player.m_basic_xMaxVelocity = this.xMaxVelocity;
            player.m_buff_xMaxVelocity = this.buff_xMaxVelocity;
            player.m_yMaxVelocity = this.yMaxVelocity;
            player.m_velocityMultiplier = this.velocityMultiplier;
            player.m_attackRange = this.attackRange;
            player.m_basic_attackCdTime = this.attackCdTime;
            player.m_buff_attackCdTime = this.buff_attackCdTime;
        }
        onUpdate() {
            if (CharacterInit.playerEnt.m_animation.destroyed)
                return;
            let colorNum = 2;
            let oathColorMat = [
                Math.floor(Math.random() * 2) + 2, 0, 0, 0, -100,
                0, Math.floor(Math.random() * 2) + 1, 0, 0, -100,
                0, 0, Math.floor(Math.random() * 2) + 2, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(oathColorMat);
            let glowFilter_charge = new Laya.GlowFilter("#df6ef4", 40, 0, 0);
            CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];
            OathManager.characterLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];
            OathManager.oathUpdate();
        }
    }

    class EnemyInit extends Laya.Script {
        constructor() {
            super();
            this.enemyGenerateTime = 5000;
            this.enemyLeft = 50;
            this.battleToggle = true;
        }
        onStart() {
            let player = CharacterInit.playerEnt.m_animation;
            let enemy = EnemyHandler.enemyPool;
            EnemyHandler.generator(player, 1, 0);
            setInterval(() => {
                if (CharacterInit.playerEnt.m_animation.destroyed || this.enemyLeft <= 0 || enemy.length >= 20)
                    return;
                EnemyHandler.generator(player, 1, 0);
                this.enemyLeft--;
            }, this.enemyGenerateTime);
            this.showBattleInfo();
        }
        onUpdate() {
            if (this.enemyLeft <= 0 && EnemyHandler.enemyPool.length <= 0) {
                CharacterInit.playerEnt.m_animation.destroy();
                Laya.Scene.open("Village.scene");
                Laya.stage.x = Laya.stage.y = 0;
                this.battleToggle = false;
            }
        }
        showBattleInfo() {
            let info = new Laya.Text();
            let player = CharacterInit.playerEnt.m_animation;
            info.fontSize = 45;
            info.color = "#efefef";
            info.stroke = 3;
            info.font = "silver";
            info.strokeColor = "#000";
            Laya.stage.addChild(info);
            let timer = setInterval(() => {
                if (!this.battleToggle) {
                    clearInterval(timer);
                    info.destroy();
                    return;
                }
                info.text = "剩餘敵人數量 : " + String(this.enemyLeft) + "\n場上敵人數量 : " + EnemyHandler.getEnemiesCount();
                info.pos(player.x - 50, player.y - 400);
            }, 10);
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
            Laya.stage.x = 0;
            Laya.stage.y = 0;
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
                Laya.Scene.open("First.scene");
            });
            console.log(Laya.stage.x, Laya.stage.y);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/SceneInit.ts", SceneInit);
            reg("script/EnemyInit.ts", EnemyInit);
            reg("script/CharacterInit.ts", CharacterInit);
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
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
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
