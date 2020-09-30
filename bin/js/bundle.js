(function () {
    'use strict';

    class SceneInit extends Laya.Script {
        constructor() {
            super();
            this.sceneBackgroundColor = '#4a4a4a';
        }
        onAwake() {
            Laya.stage.bgColor = this.sceneBackgroundColor;
            this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
        }
        generator() {
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
    }

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

    class OathManager extends Laya.Script {
        static getBloodyPoint() {
            return CharacterInit.playerEnt.m_bloodyPoint;
        }
        static setBloodyPoint(amount) {
            CharacterInit.playerEnt.m_bloodyPoint = (amount > CharacterInit.playerEnt.m_maxBloodyPoint) ? CharacterInit.playerEnt.m_maxBloodyPoint : amount;
            return CharacterInit.playerEnt.m_bloodyPoint;
        }
        static showBloodyPoint(player) {
            let oathBar = new Laya.ProgressBar();
            oathBar.pos(player.x - Laya.stage.width / 2 + 160, player.y - Laya.stage.height / 2 + 50);
            oathBar.height = 40;
            oathBar.width = 300;
            oathBar.skin = "comp/progress.png";
            setInterval((() => {
                oathBar.pos(player.x - Laya.stage.width / 2 + 140, 100);
                oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
            }), 5);
            Laya.stage.addChild(oathBar);
        }
        static showBloodyLogo(player, url) {
            this.catLogo = new Laya.Animation();
            this.catLogo.scaleX = 0.6;
            this.catLogo.scaleY = 0.6;
            this.catLogo.source = url;
            setInterval((() => {
                this.catLogo.pos(player.x - Laya.stage.width / 2 + 30, -35 + 100);
            }), 10);
            Laya.stage.addChild(this.catLogo);
            this.catLogo.play();
        }
        static charge() {
            if (!this.isCharging) {
                if (CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint < 0.3)
                    return;
                CharacterInit.playerEnt.m_bloodyPoint -= 20;
                this.isCharging = true;
            }
        }
        static chargeAttack(enemyLabel) {
            if (!this.isCharging)
                return;
            let victim = EnemyHandler.getEnemyByLabel(enemyLabel);
            victim.takeDamage(Math.round(Math.floor(Math.random() * 51) + 1000));
            console.log("ChargeAttack!");
            this.isCharging = false;
        }
        static oathChargeDetect() {
            return (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint) ? true : false;
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
    }
    OathManager.increaseBloodyPoint = 10;
    OathManager.isCharging = false;

    class VirtualSkill extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_canUse = true;
        }
        cast(position) {
        }
        ;
        attackRangeCheck(pos, type) {
            let enemy = EnemyHandler.enemyPool;
            switch (type) {
                case 'rect':
                    let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
                    enemyFound.forEach((e) => {
                        e._ent.takeDamage(this.m_damage);
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
    }

    class Spike extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '突進斬';
            this.m_damage = 111;
            this.m_cost = 0;
            this.m_id = 1;
            this.m_cd = 3;
            this.m_lasTime = 0.2;
            this.m_spikeVec = 55.0;
        }
        cast(position) {
            if (!this.m_canUse)
                return;
            let player = CharacterInit.playerEnt;
            let rightSide = player.m_isFacingRight;
            this.m_animation = new Laya.Animation();
            this.m_animation.width = 400;
            this.m_animation.height = 200;
            this.m_animation.scaleX = 2;
            this.m_animation.scaleY = 2;
            this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
            let offsetX = rightSide ? position['x'] : position['x'] - this.m_animation.width;
            let offsetY = position['y'] - this.m_animation.height / 2 + 20;
            this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 20;
            this.m_canUse = false;
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
            player.delayMove(this.m_lasTime);
            player.m_rigidbody.setVelocity({ x: rightSide ? this.m_spikeVec : -this.m_spikeVec, y: 0 });
            this.attackRangeCheck({
                "x0": offsetX,
                "x1": offsetX + this.m_animation.width,
                "y0": offsetY,
                "y1": offsetY + this.m_animation.height,
            }, "rect");
            Laya.stage.addChild(this.m_animation);
            setTimeout(() => {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            }, 200);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
        }
        attackRangeCheck(pos, type) {
            let enemy = EnemyHandler.enemyPool;
            let player = CharacterInit.playerEnt;
            let rightSide = player.m_isFacingRight;
            switch (type) {
                case 'rect':
                    let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
                    enemyFound.forEach((e) => {
                        e._ent.m_rigidbody.setVelocity({
                            x: rightSide ? 25 : -25,
                            y: 0,
                        });
                        e._ent.takeDamage(this.m_damage);
                        e._ent.delayMove(0.1);
                    });
                    break;
                default:
                    break;
            }
        }
    }

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
            this.m_moveDelayValue = 0;
            this.m_isFacingRight = true;
            this.m_canJump = true;
            this.m_canAttack = true;
            this.m_catSkill = null;
            this.m_humanSkill = null;
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
            this.m_animation.pos(1345, 544);
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
            this.m_animation.interval = 200;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                this.m_animationChanging = false;
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
            this.m_rigidbody.category = 4;
            this.m_rigidbody.mask = 8 | 2;
            Laya.stage.addChild(this.m_animation);
            OathManager.showBloodyPoint(this.m_animation);
            OathManager.showBloodyLogo(this.m_animation, "comp/Cat.png");
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
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= 33);
            amount *= critical ? 3 : 1;
            this.setHealth(this.getHealth() - amount);
            this.damageTextEffect(amount, critical);
        }
        damageTextEffect(amount, critical) {
            let damageText = new Laya.Text();
            let soundNum;
            damageText.pos((this.m_animation.x - this.m_animation.width / 2) + 15, (this.m_animation.y - this.m_animation.height) - 3);
            damageText.bold = true;
            damageText.align = "left";
            damageText.alpha = 1;
            damageText.fontSize = critical ? 42 : 17;
            damageText.color = critical ? '#ff31c8' : "red";
            damageText.text = String(amount);
            damageText.font = "opensans-bold";
            Laya.stage.addChild(damageText);
            Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 30, }, 350, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 350, Laya.Ease.linearInOut, null, 0);
            }), 0);
            setTimeout((() => {
                if (damageText.destroyed)
                    return;
                damageText.destroy();
                damageText.destroyed = true;
            }), 700);
        }
        listenKeyBoard() {
            this.m_keyDownList = [];
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
        showHealth() {
            this.m_healthBar = new Laya.ProgressBar();
            this.m_healthBar.height = 13;
            this.m_healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
            this.m_healthBar.skin = "comp/progress.png";
            this.m_healthBar.value = 1;
            this.m_healthBar.alpha = 1;
            Laya.stage.addChild(this.m_healthBar);
            setInterval((() => {
                if (this.m_animation.destroyed) {
                    this.m_healthBar.destroy();
                    this.m_healthBar.destroyed = true;
                    return;
                }
                this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) - 10, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
                this.m_healthBar.value = this.m_health / this.m_maxHealth;
            }), 10);
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
                    this.updateAnimation(this.m_state, CharacterStatus.run, null, false);
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
                if (!this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.m_animation.skewY = 0;
                    this.m_isFacingRight = true;
                }
                this.applyMoveX();
                if (!this.m_animationChanging)
                    this.updateAnimation(this.m_state, CharacterStatus.run, null, false);
            }
            if (this.m_keyDownList[40]) {
                console.log('技能槽: ', '貓技: ', this.m_catSkill, '人技: ', this.m_humanSkill);
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
                this.createAttackEffect(this.m_animation);
                this.attackSimulation();
                this.m_canAttack = false;
                setTimeout(() => {
                    this.m_canAttack = true;
                }, this.m_attackCdTime);
            }
            if (this.m_keyDownList[16])
                OathManager.charge();
            if (this.m_keyDownList[49] && this.m_keyDownList[37] || this.m_keyDownList[49] && this.m_keyDownList[39]) {
                this.m_humanSkill.cast({
                    x: this.m_animation.x,
                    y: this.m_animation.y - 65,
                });
            }
        }
        attackSimulation() {
            let temp = this.m_animation;
            let atkRange = 100;
            let offsetX = this.m_isFacingRight ? (temp.x + (temp.width / 2)) : (temp.x - (temp.width / 2) - atkRange);
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
                    enemyFound.forEach((e) => {
                        e._ent.takeDamage(Math.round(Math.floor(Math.random() * 51) + 150));
                        if (!OathManager.isCharging) {
                            Character.setCameraShake(10, 3);
                            OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
                        }
                        else {
                            Character.setCameraShake(50, 5);
                        }
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
            slashEffect.source = "comp/SlashEffects/Slash_0029.png,comp/SlashEffects/Slash_0030.png,comp/SlashEffects/Slash_0031.png,comp/SlashEffects/Slash_0032.png,comp/SlashEffects/Slash_0033.png,comp/SlashEffects/Slash_0034.png,comp/SlashEffects/Slash_0035.png";
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
        setSkill() {
            this.m_humanSkill = new Spike();
        }
        delayMove(time) {
            if (this.m_moveDelayValue > 0) {
                this.m_moveDelayValue += time;
            }
            else {
                this.m_moveDelayValue = time;
                this.m_moveDelayTimer = setInterval(() => {
                    if (this.m_moveDelayValue <= 0) {
                        this.resetMove();
                        clearInterval(this.m_moveDelayTimer);
                        this.m_moveDelayValue = 0;
                    }
                    this.m_moveDelayValue -= 0.1;
                    console.log('reducing move delay, now move delay: ', this.m_moveDelayValue);
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
            if (this.m_moveDelayValue > 0)
                return;
            this.m_rigidbody.setVelocity({
                x: this.m_playerVelocity["Vx"],
                y: this.m_rigidbody.linearVelocity.y,
            });
            if (!this.m_animationChanging && this.m_playerVelocity["Vx"] === 0)
                this.updateAnimation(this.m_state, CharacterStatus.idle, null, false);
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
        cameraFollower() {
            if (this.m_animation.destroyed)
                return;
            let player_pivot_x = Laya.stage.width / 2;
            let player_pivot_y = Laya.stage.height / 2;
            setInterval(() => {
                if (this.m_animation.destroyed)
                    return;
                if (Character.m_cameraShakingTimer > 0) {
                    let randomSign = (Math.floor(Math.random() * 2) == 1) ? 1 : -1;
                    Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                    Laya.stage.y = 0 + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                    Character.m_cameraShakingTimer--;
                }
                else {
                    Laya.stage.x = player_pivot_x - this.m_animation.x;
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
            switch (this.m_state) {
                case CharacterStatus.attack:
                    this.m_animationChanging = true;
                    this.m_animation.interval = 300;
                    this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
                    this.m_animation.play();
                    break;
                case CharacterStatus.idle:
                    this.m_animation.interval = 500;
                    this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
                    break;
                case CharacterStatus.run:
                    this.m_animation.source = 'character/player_run_01.png,character/player_run_02.png,character/player_run_03.png,character/player_run_04.png';
                    this.m_animation.interval = 100;
                    this.m_animation.play();
                    break;
                default:
                    this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
                    break;
            }
            if (typeof onCallBack === 'function')
                onCallBack();
        }
    }
    Character.m_cameraShakingTimer = 0;
    Character.m_cameraShakingMultiplyer = 1;

    class CharacterInit extends Laya.Script {
        constructor() {
            super();
            this.health = 1000;
            this.bloodyPoint = 0;
            this.maxBloodyPoint = 100;
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
        }
        initSetting(player) {
            player.m_maxHealth = player.m_health = this.health;
            player.m_bloodyPoint = this.bloodyPoint;
            player.m_maxBloodyPoint = this.maxBloodyPoint;
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
            CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint) ? [glowFilter_charge, colorFilter] : [];
            OathManager.catLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint) ? [glowFilter_charge, colorFilter] : [];
            OathManager.oathBuffUpdate();
        }
    }

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
            this.m_name = '';
            this.m_health = 1000;
            this.m_armor = 0;
            this.m_speed = 3;
            this.m_mdelay = 0.5;
            this.m_tag = '';
            this.m_moveVelocity = { "Vx": 0, "Vy": 0 };
            this.m_rectangle = { "x0": 0, "x1": 0, "y0": 0, "y1": 0 };
            this.m_attackRange = 100;
            this.m_hurtDelay = 0;
            this.m_atkCd = true;
            this.m_isFacingRight = true;
            this.m_moveDelayValue = 0;
            this.m_animationChanging = false;
            this.m_state = EnemyStatus.idle;
        }
        spawn(player, id) {
            this.m_animation = new Laya.Animation();
            this.m_animation.filters = [];
            this.m_animation.scaleX = 4;
            this.m_animation.scaleY = 4;
            this.m_animation.width = 35;
            this.m_animation.height = 35;
            this.m_animation.pivotX = this.m_animation.width / 2;
            this.m_animation.pivotY = this.m_animation.height / 2;
            let enemyPos = [-200, 200];
            this.m_animation.pos(player.x + enemyPos[Math.floor(Math.random() * 2)], player.y - (player.height / 2));
            this.m_animation.autoPlay = true;
            this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
            this.m_animation.interval = 100;
            this.m_animation.loop = true;
            this.m_animation.on(Laya.Event.COMPLETE, this, () => {
                this.m_animationChanging = false;
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
            if (this.m_animation.destroyed)
                return;
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= 50);
            this.delayMove(this.m_mdelay);
            amount *= critical ? 5 : 1;
            this.setHealth(this.getHealth() - amount);
            this.damageTextEffect(amount, critical);
            this.m_healthBar.alpha = 1;
            if (critical) {
                this.m_animation.x--;
                this.m_animation.y++;
            }
            if (this.m_hurtDelay > 0) {
                this.m_hurtDelay += 2.0;
            }
            else {
                this.m_hurtDelay = 2.0;
                this.m_hurtDelayTimer = setInterval(() => {
                    if (this.m_hurtDelay <= 0) {
                        console.log('< 0!!!!');
                        clearInterval(this.m_hurtDelayTimer);
                        this.m_hurtDelay = 0;
                    }
                    this.m_hurtDelay -= 0.1;
                }, 100);
            }
        }
        damageTextEffect(amount, critical) {
            let damageText = new Laya.Text();
            let soundNum;
            damageText.pos((this.m_animation.x - this.m_animation.width / 2) - 20, (this.m_animation.y - this.m_animation.height) - 110);
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
            Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 30, }, 350, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 350, Laya.Ease.linearInOut, null, 0);
            }), 0);
            setTimeout((() => {
                if (damageText.destroyed)
                    return;
                damageText.destroy();
                damageText.destroyed = true;
            }), 700);
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
        checkPosition() {
            this.m_rectangle['x0'] = this.m_animation.x - (this.m_animation.width / 2);
            this.m_rectangle['x1'] = this.m_animation.x + (this.m_animation.width / 2);
            this.m_rectangle['y0'] = this.m_animation.y - (this.m_animation.height / 2);
            this.m_rectangle['y1'] = this.m_animation.y + (this.m_animation.height / 2);
        }
        pursuitPlayer() {
            if (CharacterInit.playerEnt.m_animation.destroyed) {
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
            if (this.m_atkTimer > 0 || CharacterInit.playerEnt.m_animation.destroyed)
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
            let atkCircleScript = atkCircle.addComponent(Laya.Script);
            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
            atkCircleRigid.category = 8;
            atkCircleRigid.mask = 4;
            atkCircleScript.onTriggerEnter = function (col) {
                if (col.tag === 'Player') {
                    let victim = CharacterInit.playerEnt;
                    victim.m_animation.alpha = 0.3;
                    victim.takeDamage(30);
                    setTimeout(() => {
                        if (victim.m_animation.destroyed)
                            return;
                        victim.m_animation.alpha = 1;
                    }, 150);
                }
            };
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            this.updateAnimation(this.m_state, EnemyStatus.attack);
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
        delayMove(time) {
            if (this.m_moveDelayValue > 0) {
                this.m_moveDelayValue += time;
            }
            else {
                this.m_moveDelayValue = time;
                this.m_moveDelayTimer = setInterval(() => {
                    if (this.m_moveDelayValue <= 0) {
                        this.m_moveVelocity["Vx"] = 0;
                        clearInterval(this.m_moveDelayTimer);
                        this.m_moveDelayValue = 0;
                    }
                    this.m_moveDelayValue -= 0.1;
                }, 100);
            }
        }
        applyMoveX() {
            if (this.m_moveDelayValue > 0)
                return;
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
        updateAnimation(from, to, onCallBack = null, force = false) {
            if (this.m_state === to || this.m_animationChanging)
                return;
            this.m_state = to;
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
        enemyInjuredColor() {
            this.m_animation.alpha = 1;
            let colorMat = [
                4, 0, 0, 0, 10,
                0, 1, 0, 0, 10,
                0, 0, 4, 0, 10,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ef1ff8", 3, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [colorFilter, glowFilter];
            setTimeout(() => {
                if (this.m_animation.destroyed)
                    return;
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
        }
    }

    class EnemyHandler extends Laya.Script {
        static generator(player, enemyType, spawnPoint) {
            let enemy = this.decideEnemyType(enemyType);
            let id = enemy.m_tag + String(++this.enemyIndex);
            enemy.spawn(player, id);
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

    class EnemyInit extends Laya.Script {
        constructor() {
            super();
            this.enemyGenerateTime = 5000;
        }
        onStart() {
            let player = CharacterInit.playerEnt.m_animation;
            let isFacingRight = CharacterInit.playerEnt.m_isFacingRight;
            setInterval(() => {
                if (CharacterInit.playerEnt.m_animation.destroyed)
                    return;
                EnemyHandler.generator(player, 1, 0);
            }, this.enemyGenerateTime);
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
                console.log("battle");
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
