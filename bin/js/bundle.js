(function () {
    'use strict';

    var OathStatus;
    (function (OathStatus) {
        OathStatus[OathStatus["normal"] = 0] = "normal";
        OathStatus[OathStatus["charge"] = 1] = "charge";
        OathStatus[OathStatus["overCharge"] = 2] = "overCharge";
    })(OathStatus || (OathStatus = {}));

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
            super();
            this.player = CharacterInit.playerEnt;
        }
        debuffUpdate() {
            this.player = CharacterInit.playerEnt;
        }
        debuffTextEffect(text) {
            let damageText = new Laya.Text();
            damageText.pos(this.player.m_animation.x, this.player.m_animation.y);
            damageText.bold = true;
            damageText.align = "center";
            damageText.alpha = 1;
            damageText.fontSize = 20;
            damageText.color = "red";
            damageText.text = text;
            damageText.font = "silver";
            damageText.stroke = 5;
            damageText.strokeColor = "#000";
            Laya.stage.addChild(damageText);
            Laya.Tween.to(damageText, { alpha: 0.65, fontSize: damageText.fontSize + 50, y: damageText.y + 50, }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 100 }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { damageText.destroy(); }), 0);
            }), 0);
        }
    }
    class Blind extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "哈，那東西爆掉的樣子真滑稽";
            this.blindSprite = null;
            this.blindBlackBg = null;
            this.blindCircleMask = null;
            this.blindHandler = null;
            console.log("執行 Blind Constructor");
            this.blindSprite = new Laya.Sprite();
            this.blindBlackBg = new Laya.Sprite();
            this.blindCircleMask = new Laya.Sprite();
            this.blindSprite.cacheAs = "bitmap";
            Laya.stage.addChild(this.blindSprite);
            this.blindBlackBg.graphics.drawRect(this.player.m_animation.x, 0, 1400, 768, "000");
            this.blindCircleMask.graphics.drawCircle(this.player.m_animation.x, this.player.m_animation.y, 150, "000");
            this.blindSprite.addChild(this.blindBlackBg);
            this.blindCircleMask.blendMode = "destination-out";
            this.blindSprite.addChild(this.blindCircleMask);
            this.blindHandler = setInterval(() => {
                this.debuffUpdate();
            }, 10);
        }
        debuffUpdate() {
            super.debuffUpdate();
            if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                this.blindBlackBg.x = this.player.m_animation.x - 1400 / 2;
                this.blindCircleMask.x = this.player.m_animation.x;
                this.blindCircleMask.y = this.player.m_animation.y;
            }
        }
        startBlind() {
            this.debuffTextEffect(this.debuffText);
        }
        stopBlind() {
            console.log("停止Blind");
            this.blindSprite.graphics.clear();
            this.blindBlackBg.graphics.clear();
            this.blindCircleMask.graphics.clear();
            clearInterval(this.blindHandler);
            this.blindHandler = null;
        }
    }
    class BodyCrumble extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "希望你還走得回去";
            this.bodyCrumbleHandler = null;
            this.originVM = 0;
            this.newVM = 0;
            this.originXMaxVel_basic = 0;
            this.newXMaxVel_basic = 0;
            this.originXMaxVel_buff = 0;
            this.newXMaxVel_buff = 0;
            console.log("執行 BodyCrumble Constructor");
            this.originXMaxVel_basic = this.player.m_basic_xMaxVelocity;
            this.originXMaxVel_buff = this.player.m_buff_xMaxVelocity;
            this.originVM = this.player.m_velocityMultiplier;
            this.newVM = this.player.m_velocityMultiplier * 0.3;
            this.newXMaxVel_basic = this.player.m_basic_xMaxVelocity * 0.3;
            this.newXMaxVel_buff = this.player.m_buff_xMaxVelocity * 0.3;
            this.bodyCrumbleHandler = setInterval(() => {
                this.debuffUpdate();
            }, 10);
        }
        debuffUpdate() {
            super.debuffUpdate();
            this.player.m_basic_xMaxVelocity = this.newXMaxVel_basic;
            this.player.m_buff_xMaxVelocity = this.newXMaxVel_buff;
            this.player.m_velocityMultiplier = this.newVM;
        }
        startBodyCrumble() {
            this.debuffTextEffect(this.debuffText);
        }
        stopBodyCrumble() {
            console.log("停止BodyCrumble");
            this.player.m_basic_xMaxVelocity = this.originXMaxVel_basic;
            this.player.m_buff_xMaxVelocity = this.originXMaxVel_buff;
            this.player.m_velocityMultiplier = this.originVM;
            clearInterval(this.bodyCrumbleHandler);
            this.bodyCrumbleHandler = null;
        }
    }
    class Insane extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "對力量的渴望會讓你拋棄理性";
            console.log("執行 Insane Constructor");
        }
        debuffUpdate() {
            super.debuffUpdate();
        }
        startInsane() {
            this.debuffTextEffect(this.debuffText);
        }
        stopInsane() {
            console.log("停止Insane");
        }
    }
    class Predator extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "它們循著氣息來了";
            console.log("執行 Predator Constructor");
        }
        debuffUpdate() {
            super.debuffUpdate();
        }
        startPredator() {
            this.debuffTextEffect(this.debuffText);
        }
        stopPredator() {
            console.log("停止BodyPredator");
        }
    }
    class Decay extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "為我戰鬥至到粉身碎骨吧";
            this.isDecaying = false;
            this.isKilling = false;
            this.isDamaging = false;
            this.killingTimer = 0;
            this._currentEnemyCount = 0;
            this.previousEnemyCount = 0;
            this.decayHandler = null;
            this.checkKillingHandler = null;
            console.log("執行 Decay Constructor");
            this.checkKillingHandler = setInterval(() => {
                this.currentEnemyCount = EnemyHandler.getEnemiesCount();
                if (this.currentEnemyCount < this.previousEnemyCount) {
                    this.isKilling = true;
                }
                else {
                    this.isKilling = false;
                }
            }, 100);
            this.decayHandler = setInterval(() => {
                this.debuffUpdate();
            }, 1000);
        }
        get currentEnemyCount() {
            return this._currentEnemyCount;
        }
        set currentEnemyCount(value) {
            this.previousEnemyCount = this.currentEnemyCount;
            this._currentEnemyCount = value;
        }
        debuffUpdate() {
            super.debuffUpdate();
            if (this.player.m_animation.destroyed) {
                clearInterval(this.decayHandler);
                this.decayHandler = null;
                return;
            }
            if (this.isDamaging && !EnemyInit.isWin) {
                console.log("正在傷害玩家");
                this.player.setHealth(this.player.getHealth() - this.player.m_maxHealth * 0.1);
            }
        }
        startDecay() {
            this.isDecaying = true;
            this.debuffTextEffect(this.debuffText);
        }
        stopDecay() {
            console.log("停止Decay");
            this.isDecaying = false;
            clearInterval(this.decayHandler);
            this.decayHandler = null;
        }
        killingTimerUpdate() {
            if (this.isKilling)
                this.killingTimer = 120;
            if (!this.isDecaying)
                return;
            if (this.killingTimer > 0) {
                this.killingTimer--;
                this.isDamaging = false;
            }
            else if (this.killingTimer <= 0) {
                this.isDamaging = true;
            }
            console.log("isKilling: ", this.isKilling, "killingTimer: ", this.killingTimer, "isDamaging: ", this.isDamaging);
        }
    }
    class DebuffManager extends Laya.Script {
    }

    class OathManager extends Laya.Script {
        constructor() {
            super(...arguments);
            this.oathState = 0;
            this.increaseBloodyPoint = 10;
            this.overChargeCount = 0;
            this.addDebuffTimer = null;
            this.playerDebuff = DebuffType.none;
            this.blindProto = null;
            this.bodyCrumbleProto = null;
            this.insaneProto = null;
            this.predatorProto = null;
            this.decayProto = null;
        }
        initOathSystem() {
            this.oathState = 0;
            this.addDebuffTimer = null;
            this.clearAddDebuffTimer();
            this.removeAllDebuff();
            this.clearBloodyUI();
        }
        get currentBloodyPoint() {
            return CharacterInit.playerEnt.m_bloodyPoint;
        }
        set currentBloodyPoint(amount) {
            CharacterInit.playerEnt.m_bloodyPoint = amount;
            if (!CharacterInit.playerEnt.m_animation.destroyed && this.oathBar != null)
                this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
            console.log("當前獻祭值量：", CharacterInit.playerEnt.m_bloodyPoint, "獻祭值條比例：", this.oathBar.value);
        }
        showBloodyPoint(player) {
            this.oathBar = new Laya.ProgressBar();
            this.oathBar.skin = "UI/bp_100.png";
            let timer = setInterval((() => {
                if (CharacterInit.playerEnt.m_animation.destroyed) {
                    this.clearBloodyUI();
                    clearInterval(timer);
                    return;
                }
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
                }
                if (Laya.stage.x >= -250)
                    this.oathBar.pos(935 - Laya.stage.width / 2 + 180, 107.5);
                if (Laya.stage.x <= -2475)
                    this.oathBar.pos(3155 - Laya.stage.width / 2 + 180, 107.5);
                if (!CharacterInit.playerEnt.m_animation.destroyed && this.oathBar != null)
                    this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
            }), 5);
            Laya.stage.addChild(this.oathBar);
        }
        showBloodyLogo(player) {
            this.characterLogo = new Laya.Animation();
            this.catSkillIcon = new Laya.Sprite();
            this.humanSkillIcon = new Laya.Sprite();
            this.sprintIcon = new Laya.Sprite();
            this.catSkillIconCd = new Laya.Text();
            this.humanSkillIconCd = new Laya.Text();
            this.sprintIconCd = new Laya.Text();
            this.catSkillIcon.width = this.catSkillIcon.height = 69;
            this.humanSkillIcon.width = this.humanSkillIcon.height = 69;
            this.sprintIcon.width = this.sprintIcon.height = 69;
            this.catSkillIconCd.width = this.humanSkillIconCd.width = this.sprintIconCd.width = 100;
            this.catSkillIconCd.fontSize = this.humanSkillIconCd.fontSize = this.sprintIconCd.fontSize = 42;
            this.catSkillIconCd.font = this.humanSkillIconCd.font = this.sprintIconCd.font = 'silver';
            this.catSkillIconCd.stroke = this.humanSkillIconCd.stroke = this.sprintIconCd.stroke = 2;
            this.catSkillIconCd.strokeColor = this.humanSkillIconCd.strokeColor = this.sprintIconCd.strokeColor = '#000';
            this.catSkillIconCd.color = this.humanSkillIconCd.color = this.sprintIconCd.color = '#fff';
            this.characterLogo.source = "UI/Box.png";
            this.catSkillIcon.loadImage(CharacterInit.playerEnt.m_catSkill.m_iconA);
            this.humanSkillIcon.loadImage(CharacterInit.playerEnt.m_humanSkill.m_iconA);
            this.sprintIcon.loadImage("ui/icon/sprint.png");
            let timer = setInterval((() => {
                if (CharacterInit.playerEnt.m_animation.destroyed) {
                    clearInterval(timer);
                    timer = null;
                    return;
                }
                if (!CharacterInit.playerEnt.m_animation.destroyed && this.characterLogo != null) {
                    if (Laya.stage.x < -250 && Laya.stage.x > -2475)
                        this.characterLogo.pos(player.x - Laya.stage.width / 2 + 20, 20);
                    if (Laya.stage.x >= -250)
                        this.characterLogo.pos(935 - Laya.stage.width / 2 + 20, 20);
                    if (Laya.stage.x <= -2475)
                        this.characterLogo.pos(3155 - Laya.stage.width / 2 + 20, 20);
                    let pos = {
                        'x': this.characterLogo.x,
                        'y': this.characterLogo.y,
                    };
                    this.catSkillIcon.pos(pos['x'] + 16, pos['y'] + 87);
                    this.humanSkillIcon.pos(pos['x'] + 116, pos['y'] + 87);
                    this.sprintIcon.pos(pos['x'] + 66, pos['y'] + 37);
                    this.catSkillIconCd.pos(this.catSkillIcon.x + 29, this.catSkillIcon.y + 21);
                    this.humanSkillIconCd.pos(this.humanSkillIcon.x + 29, this.humanSkillIcon.y + 21);
                    this.sprintIconCd.pos(this.sprintIcon.x + 29, this.sprintIcon.y + 21);
                    this.catSkillIcon.alpha = CharacterInit.playerEnt.m_catSkill.m_canUse ? 1 : 0.3;
                    this.humanSkillIcon.alpha = CharacterInit.playerEnt.m_humanSkill.m_canUse ? 1 : 0.3;
                    this.sprintIcon.alpha = CharacterInit.playerEnt.m_canSprint ? 1 : 0.3;
                    this.catSkillIconCd.text = CharacterInit.playerEnt.m_catSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_catSkill.m_cdCount);
                    this.humanSkillIconCd.text = CharacterInit.playerEnt.m_humanSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_humanSkill.m_cdCount);
                }
                this.sprintIconCd.text = CharacterInit.playerEnt.m_canSprint ? "" : String('冷');
            }), 5);
            Laya.stage.addChild(this.characterLogo);
            Laya.stage.addChild(this.catSkillIcon);
            Laya.stage.addChild(this.humanSkillIcon);
            Laya.stage.addChild(this.catSkillIconCd);
            Laya.stage.addChild(this.humanSkillIconCd);
            Laya.stage.addChild(this.sprintIcon);
            Laya.stage.addChild(this.sprintIconCd);
            this.characterLogo.play();
        }
        clearBloodyUI() {
            if (this.oathBar != null) {
                this.oathBar.destroy();
                this.oathBar = null;
            }
            if (this.characterLogo != null) {
                this.characterLogo.destroy();
                this.characterLogo = null;
            }
            if (this.catSkillIcon != null) {
                this.catSkillIcon.destroy();
                this.catSkillIcon = null;
            }
            if (this.humanSkillIcon != null) {
                this.humanSkillIcon.destroy();
                this.humanSkillIcon = null;
            }
            if (this.catSkillIconCd != null) {
                this.catSkillIconCd.destroy();
                this.catSkillIconCd = null;
            }
            if (this.humanSkillIconCd != null) {
                this.humanSkillIconCd.destroy();
                this.humanSkillIconCd = null;
            }
            if (this.sprintIcon != null) {
                this.sprintIcon.destroy();
                this.sprintIcon = null;
            }
            if (this.sprintIconCd != null) {
                this.sprintIconCd.destroy();
                this.sprintIconCd = null;
            }
        }
        oathChargeDetect() {
            return (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? true : false;
        }
        oathBuffUpdate() {
            if (CharacterInit.playerEnt.m_animation.destroyed)
                return;
            if (this.oathChargeDetect()) {
                CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_buff_xMaxVelocity;
                CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_buff_attackCdTime;
                CharacterInit.playerEnt.m_damageMultiplier = CharacterInit.playerEnt.m_buff_damageMultiPlier;
            }
            else {
                CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_basic_xMaxVelocity;
                CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_basic_attackCdTime;
                CharacterInit.playerEnt.m_damageMultiplier = CharacterInit.playerEnt.m_basic_damageMultiPlier;
            }
        }
        addDebuff(type) {
            switch (type) {
                case 1 << 0:
                    this.playerDebuff |= DebuffType.blind;
                    if (this.blindProto === null) {
                        console.log("add Blind");
                        this.blindProto = new Blind();
                        this.blindProto.startBlind();
                    }
                    break;
                case 1 << 1:
                    this.playerDebuff |= DebuffType.bodyCrumble;
                    if (this.bodyCrumbleProto === null) {
                        this.bodyCrumbleProto = new BodyCrumble();
                        this.bodyCrumbleProto.startBodyCrumble();
                    }
                    break;
                case 1 << 2:
                    this.playerDebuff |= DebuffType.insane;
                    if (this.insaneProto === null) {
                        this.insaneProto = new Insane();
                        this.insaneProto.startInsane();
                    }
                    break;
                case 1 << 3:
                    this.playerDebuff |= DebuffType.predator;
                    if (this.predatorProto === null) {
                        this.predatorProto = new Predator();
                        this.predatorProto.startPredator();
                    }
                    break;
                case 1 << 4:
                    this.playerDebuff |= DebuffType.decay;
                    if (this.decayProto === null) {
                        this.decayProto = new Decay();
                        this.decayProto.startDecay();
                    }
                    break;
            }
        }
        removeDebuff(type) {
            switch (type) {
                case 1 << 0:
                    this.playerDebuff ^= DebuffType.blind;
                    if (this.blindProto != null) {
                        this.blindProto.stopBlind();
                        this.blindProto = null;
                    }
                    break;
                case 1 << 1:
                    this.playerDebuff ^= DebuffType.bodyCrumble;
                    if (this.bodyCrumbleProto != null) {
                        this.bodyCrumbleProto.stopBodyCrumble();
                        this.bodyCrumbleProto = null;
                    }
                    break;
                case 1 << 2:
                    this.playerDebuff ^= DebuffType.insane;
                    if (this.insaneProto != null) {
                        this.insaneProto.stopInsane();
                        this.insaneProto = null;
                    }
                    break;
                case 1 << 3:
                    this.playerDebuff ^= DebuffType.predator;
                    if (this.predatorProto != null) {
                        this.predatorProto.stopPredator();
                        this.predatorProto = null;
                    }
                    break;
                case 1 << 4:
                    this.playerDebuff ^= DebuffType.decay;
                    if (this.decayProto != null) {
                        this.decayProto.stopDecay();
                        this.decayProto = null;
                    }
                    break;
            }
        }
        removeAllDebuff() {
            for (let i = 0; i <= 4; i++) {
                this.removeDebuff(1 << i);
            }
            this.playerDebuff = DebuffType.none;
        }
        clearAddDebuffTimer() {
            clearInterval(this.addDebuffTimer);
            this.addDebuffTimer = null;
        }
        oathUpdate() {
            switch (this.oathState) {
                case OathStatus.normal:
                    if (this.oathChargeDetect()) {
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                        CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                        this.oathState = OathStatus.charge;
                    }
                    break;
                case OathStatus.charge:
                    if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft && this.overChargeCount >= 2) {
                        console.log("轉態到overCharge");
                        this.overChargeCount = 0;
                        this.oathBar.skin = "UI/bp_150.png";
                        this.oathBar.sizeGrid = "0,200,0,50";
                        CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_hard;
                        if (this.addDebuffTimer === null) {
                            console.log("添加addDebuffTimer");
                            this.addDebuffTimer = setInterval(() => {
                                if (CharacterInit.playerEnt.m_animation.destroyed || EnemyInit.isWin) {
                                    this.clearAddDebuffTimer();
                                    return;
                                }
                                console.log("執行addDebuffTimer內函式");
                                this.randomAddDebuff();
                            }, 5000);
                        }
                        this.oathState = OathStatus.overCharge;
                        return;
                    }
                    if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft && this.overChargeCount < 2) {
                        this.overChargeCount++;
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint;
                        return;
                    }
                    if (this.currentBloodyPoint < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        this.overChargeCount = 0;
                        this.oathState = OathStatus.normal;
                        return;
                    }
                    break;
                case OathStatus.overCharge:
                    if (EnemyInit.isWin)
                        this.clearAddDebuffTimer();
                    if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_hard) {
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint;
                        return;
                    }
                    if (this.currentBloodyPoint === CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        this.oathBar.skin = "UI/bp_100.png";
                        CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                        this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
                        this.clearAddDebuffTimer();
                        this.removeAllDebuff();
                        this.oathState = OathStatus.charge;
                        return;
                    }
                    if (this.currentBloodyPoint < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        this.oathBar.skin = "UI/bp_100.png";
                        CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                        this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
                        this.clearAddDebuffTimer();
                        this.removeAllDebuff();
                        this.oathState = OathStatus.normal;
                        return;
                    }
                    break;
                default:
                    this.oathState = OathStatus.normal;
                    break;
            }
            this.debuffUpdate();
            this.oathBuffUpdate();
        }
        debuffUpdate() {
            if ((this.playerDebuff & DebuffType.blind) === DebuffType.blind) {
            }
            if ((this.playerDebuff & DebuffType.bodyCrumble) === DebuffType.bodyCrumble) {
            }
            if ((this.playerDebuff & DebuffType.insane) === DebuffType.insane) {
            }
            if ((this.playerDebuff & DebuffType.predator) === DebuffType.predator) {
            }
            if ((this.playerDebuff & DebuffType.decay) === DebuffType.decay) {
                if (this.decayProto != null)
                    this.decayProto.killingTimerUpdate();
            }
        }
        randomAddDebuff() {
            console.log("還是有執行randomAddDebuff，但>=31返回了，playerDebuff值 = ", this.playerDebuff);
            if (this.playerDebuff >= 31)
                return;
            console.log("執行randomAddDebuff");
            let type = Math.floor(Math.random() * 5);
            let isInside = false;
            for (let i = 0; i <= 4; i++) {
                if ((this.playerDebuff & 1 << i) === 1 << type)
                    isInside = true;
            }
            if (isInside) {
                console.log("debuff重複，重新抽取");
                this.randomAddDebuff();
            }
            if (!isInside) {
                this.addDebuff(1 << type);
            }
        }
        oathCastSkillCheck(cost, valve = 30) {
            if (this.currentBloodyPoint < valve || this.currentBloodyPoint < cost)
                return false;
            return true;
        }
        oathCastSkill(cost) {
            console.log("扣除了技能消耗的獻祭值");
            this.currentBloodyPoint = this.currentBloodyPoint - cost;
        }
    }

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
        CharacterStatus[CharacterStatus["sprint"] = 10] = "sprint";
    })(CharacterStatus || (CharacterStatus = {}));

    class VirtualSkill extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_canUse = true;
        }
        cast(owner, position, oathSystemCheck) {
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
        updateCdTimer() {
            this.m_cdCount = this.m_cd;
            this.m_cdTimer = setInterval(() => {
                if (this.m_canUse) {
                    clearInterval(this.m_cdTimer);
                    this.m_cdTimer = null;
                    this.m_cdCount = 0;
                    return;
                }
                this.m_cdCount = !this.m_canUse ? (this.m_cdCount - 1) : 0;
                console.log(this.m_cdCount);
            }, 1000);
        }
    }

    class Spike extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '突進斬';
            this.m_info = '向前位移，並且擊退敵人';
            this.m_cost = 30;
            this.m_id = 1;
            this.m_cd = 3;
            this.m_iconA = "ui/icon/spikeA.png";
            this.m_iconB = "ui/icon/spikeB.png";
            this.m_lastTime = 0.2;
            this.m_spikeVec = 55.0;
        }
        cast(owner, position, oathSystemCheck) {
            if (!this.m_canUse)
                return;
            if (!oathSystemCheck)
                return;
            this.m_canUse = false;
            CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
            this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_spikeDmgMultiplier);
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
            owner.hurtedEvent(1.5);
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
                console.log("技能可使用");
            }, this.m_cd * 1000);
            this.updateCdTimer();
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
                e._ent.m_rigidbody.linearVelocity = { x: rightSide ? this.m_spikeVec / 3 : -this.m_spikeVec / 3 };
            });
        }
    }
    class Behead extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '攻其不備';
            this.m_info = '製造破綻，並且追擊敵人';
            this.m_cost = 10;
            this.m_id = 2;
            this.m_cd = 3;
            this.m_iconA = "ui/icon/beheadA.png";
            this.m_iconB = "ui/icon/beheadB.png";
            this.m_preTime = 0.56;
        }
        cast(owner, position, oathSystemCheck) {
            if (!this.m_canUse)
                return;
            if (!oathSystemCheck)
                return;
            this.m_canUse = false;
            CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
            this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_beheadDmgMultiplier);
            let rightSide = owner.m_isFacingRight;
            this.m_animation = new Laya.Animation();
            this.m_animation.width = owner.m_animation.width;
            this.m_animation.height = owner.m_animation.height;
            this.m_animation.scaleX = 1.5;
            this.m_animation.scaleY = 1.5;
            this.m_animation.pos(rightSide ? position['x'] - 380 : position['x'] - 380, position['y'] - 400);
            let offsetX = rightSide ? position['x'] : position['x'] - this.m_animation.width;
            let offsetY = position['y'] - this.m_animation.height / 2 + 20;
            this.m_animation.source = "comp/Target.atlas";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 30;
            this.m_animation.alpha = 0.8;
            this.m_animation.zOrder = 5;
            this.castRoar(position);
            owner.delayMove(this.m_preTime);
            owner.m_rigidbody.linearVelocity = { x: 0.0, y: 0.0 };
            owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 125);
            let colorMat = [
                3, 2, 2, 0, -250,
                1, 6, 1, 0, -250,
                2, 1, 4, 0, -250,
                0, 0, 0, 2, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#0065ff", 8, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [glowFilter, colorFilter];
            this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            });
            Laya.stage.addChild(this.m_animation);
            setTimeout(() => {
                owner.m_rigidbody.linearVelocity = { x: 0.0, y: 10.0 };
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
            this.updateCdTimer();
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
            setTimeout(() => {
                this.targetSlash(owner, {
                    x: owner.m_animation.x,
                    y: owner.m_animation.y,
                });
            }, 15);
            setTimeout(() => {
                enemy[targetEnemy]._ent.takeDamage(this.m_damage);
            }, 80);
            enemy[targetEnemy]._ent.takeDamage(this.m_damage);
        }
        targetSlash(owner, position) {
            let slash = new Laya.Animation;
            let rightSide = owner.m_isFacingRight;
            slash = new Laya.Animation();
            slash.scaleX = 1.15;
            slash.scaleY = 1.15;
            slash.pos(rightSide ? position['x'] - 150 : position['x'] - 400, position['y'] - 450);
            slash.source = "comp/TargetSlash.atlas";
            slash.autoPlay = true;
            slash.interval = 20;
            slash.alpha = 0.83;
            slash.zOrder = 5;
            let colorMat = [
                3, 2, 2, 0, -250,
                1, 4, 1, 0, -250,
                3, 1, 5, 0, -250,
                0, 0, 0, 2, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#0065ff", 8, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slash.filters = [glowFilter, colorFilter];
            slash.on(Laya.Event.COMPLETE, this, function () {
                slash.destroy();
                slash.destroyed = true;
            });
            Laya.stage.addChild(slash);
        }
    }

    class Slam extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '猛擊';
            this.m_info = '強大的範圍傷害';
            this.m_cost = 50;
            this.m_id = 2;
            this.m_cd = 1;
            this.m_iconA = "ui/icon/slamA.png";
            this.m_iconB = "ui/icon/slamB.png";
            this.m_injuredEnemy = [];
        }
        cast(owner, position, oathSystemCheck) {
            if (!this.m_canUse)
                return;
            if (!oathSystemCheck)
                return;
            this.m_canUse = false;
            CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
            this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_slamDmgMultiplier);
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
            this.m_animation.alpha = 0.7;
            let colorMat = [
                2, 1, 0, 0, -350,
                3, Math.floor(Math.random() * 1) + 2, 1, 0, -350,
                1, 3, 1, 0, -350,
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
            this.castRoar(position);
            this.m_injuredEnemy = [];
            setTimeout(() => {
                this.m_canUse = true;
                Laya.stage.graphics.clear();
            }, this.m_cd * 1000);
            this.updateCdTimer();
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
            this.m_info = '牽引敵人並且造成傷害';
            this.m_cost = 80;
            this.m_id = 2;
            this.m_cd = 5;
            this.m_lastTime = 2;
            this.m_radius = 100;
            this.m_iconA = "ui/icon/blackholeA.png";
            this.m_iconB = "ui/icon/blackholeB.png";
        }
        cast(owner, position, oathSystemCheck) {
            if (!this.m_canUse)
                return;
            if (!oathSystemCheck)
                return;
            this.m_canUse = false;
            CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
            this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_blackHoleDmgMultiplier);
            this.m_dotDamage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_blackHoleDotDmgMultiplier);
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
                    owner.setCameraShake(100, 12);
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
            this.updateCdTimer();
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
    class BigExplosion extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '魔法大爆射';
            this.m_info = '造成全場敵人極大的損傷';
            this.m_dotDamage = 7;
            this.m_cost = 80;
            this.m_id = 2;
            this.m_cd = 15;
            this.m_lastTime = 2;
            this.m_radius = 100;
            this.m_iconA = "ui/icon/blackholeA.png";
            this.m_iconB = "ui/icon/blackholeB.png";
        }
        cast(owner, position, oathSystemCheck) {
            if (!this.m_canUse)
                return;
            if (!oathSystemCheck)
                return;
            this.m_canUse = false;
            CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
            this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_bigExplosionDmgMultiplier);
            let rightSide = owner.m_isFacingRight;
            let explosion = new Laya.Animation();
            this.m_animation = new Laya.Animation();
            this.m_animation.width = this.m_animation.height = this.m_radius;
            this.m_animation.scaleX = 0.3;
            this.m_animation.scaleY = 0.3;
            this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 400, position['y'] - 300);
            this.m_animation.alpha = 0.7;
            this.m_animation.source = "comp/FireBall.atlas";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 20;
            explosion.source = "comp/BigExplosion.atlas";
            explosion.scaleX = 6;
            explosion.scaleY = 6;
            explosion.interval = 30;
            explosion.pos(this.m_animation.x - 1400, this.m_animation.y - 1500);
            let offsetX = rightSide ? position['x'] + 140 : position['x'] - this.m_animation.width - 65;
            let offsetY = position['y'] - this.m_animation.height / 2;
            this.castRoar(position);
            let colorMat = [
                4, 0, 2, 0, -150,
                0, 1, 1, 0, -100,
                1, 2, 1, 0, -150,
                0, 0, 0, 2, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#460075", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [colorFilter];
            let colorFilterex = new Laya.ColorFilter(colorMat);
            explosion.filters = [glowFilter, colorFilter];
            let count = 0;
            let timer = setInterval(() => {
                if (count >= this.m_lastTime * 1000) {
                    Laya.stage.addChild(explosion);
                    explosion.play();
                    owner.setCameraShake(100, 12);
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
            this.updateCdTimer();
        }
        attractRangeCheck(owner, pos) {
            let enemy = EnemyHandler.enemyPool;
            let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        }
        attackRangeCheck(owner, pos, dmg) {
            let enemy = EnemyHandler.enemyPool;
            let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
            enemyFound.forEach((e) => {
                e._ent.takeDamage(dmg);
            });
        }
    }

    class ExtraData extends Laya.Script {
        static loadData() {
            let data = Laya.LocalStorage.getItem("gameData");
            if (data) {
                let Data = JSON.parse(data);
                ExtraData.currentData = {
                    "atkDmgLevel": Data.atkDmgLevel,
                    "hpLevel": Data.hpLevel,
                    "gold": Data.gold,
                    "crystal": Data.crystal,
                    "catSkill": Data.catSkill,
                    "humanSkill": Data.humanSkill,
                    "catSkillLevel": Data.catSkillLevel,
                    "humanSkillLevel": Data.humanSkillLevel,
                    "battleRound": Data.battleRound,
                };
                console.log('成功讀取檔案!');
                return;
            }
            else {
                ExtraData.currentData = {
                    "atkDmgLevel": 0,
                    "hpLevel": 0,
                    "gold": 0,
                    "crystal": 0,
                    "catSkill": 1,
                    "humanSkill": 1,
                    "catSkillLevel": 0,
                    "humanSkillLevel": 0,
                    "battleRound": 0,
                };
                ExtraData.saveData();
                console.log('創建了新的檔案');
                return;
            }
        }
        static saveData() {
            let data = JSON.stringify(ExtraData.currentData);
            Laya.LocalStorage.setItem("gameData", data);
            console.log('儲存資料完畢');
        }
        getJsonFromURL(url) {
            fetch(url).then(res => res.json()).then((out) => {
                console.log("CHECK THIS JSON!", out);
            }).catch(err => {
                throw err;
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
            this.m_canSprint = true;
            this.m_atkTimer = null;
            this.m_atkStep = 0;
            this.m_hurted = false;
            this.m_hurtTimer = null;
            this.m_slashTimer = null;
            this.m_walkTimer = null;
            this.m_cameraShakingTimer = 0;
            this.m_cameraShakingMultiplyer = 1;
            this.m_catSkill = null;
            this.m_humanSkill = null;
            this.m_walkeffect = new Laya.Animation();
        }
        spawn() {
            this.loadCharacterData();
            this.getAtkValue(this.m_atkLevel);
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
            this.m_maxBloodyPoint = this.m_maxBloodyPoint_soft;
            this.m_animation.destroyed = false;
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
                if (this.m_animation.y >= 1000.0) {
                    this.m_animation.x = 1345;
                    this.m_animation.y = 544;
                }
                this.characterMove();
            };
            this.m_script.onTriggerEnter = (col) => {
                if (col.tag === "Enemy") {
                }
                if (col.label === "ground") {
                    this.resetMove();
                    this.m_canJump = true;
                }
                this.takeDamage(this.getEnemyAttackDamage(col.tag), this.getEnemyCriticalRate(col.tag), this.getEnemyCriticalDmgRate(col.tag));
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
            this.m_collider.density = 1;
            this.m_rigidbody.allowRotation = false;
            this.m_rigidbody.gravityScale = 3;
            this.m_rigidbody.category = 4;
            this.m_rigidbody.mask = 2 | 8 | 16;
            Laya.stage.addChild(this.m_animation);
            this.cameraFollower();
            this.setSkill();
        }
        ;
        setHealth(amount) {
            this.m_health = amount;
            if (this.m_health <= 0) {
                if (CharacterInit.playerEnt != null) {
                    CharacterInit.playerEnt.clearAddDebuffTimer();
                    CharacterInit.playerEnt.removeAllDebuff();
                }
                this.death();
            }
        }
        getHealth() {
            return this.m_health;
        }
        ;
        death() {
            Laya.Tween.to(this.m_animation, { alpha: 0.0 }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
                Laya.Scene.open("Died.scene");
                Laya.stage.x = Laya.stage.y = 0;
                Laya.SoundManager.stopAll();
            }), 0);
        }
        loadCharacterData() {
            ExtraData.loadData();
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            this.m_hpLevel = data.hpLevel;
            this.m_atkLevel = data.atkDmgLevel;
        }
        getAtkValue(atkLevel) {
            this.m_atk = (30 + Math.round(Math.random() * 100)) * this.m_damageMultiplier + atkLevel * 10;
            return this.m_atk;
        }
        takeDamage(amount, criticalRate, criticalDmgRate) {
            if (amount <= 0 || this.m_animation.destroyed || !this.m_animation || this.m_hurted)
                return;
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= criticalRate);
            amount *= critical ? criticalDmgRate : 1;
            amount = Math.round(amount);
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
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.m_healthBar.pos(this.m_animation.x - Laya.stage.width / 2 + 155, 77.5);
                }
                if (Laya.stage.x >= -250)
                    this.m_healthBar.pos(935 - Laya.stage.width / 2 + 155, 77.5);
                if (Laya.stage.x <= -2475)
                    this.m_healthBar.pos(3155 - Laya.stage.width / 2 + 155, 77.5);
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
            if (this.m_keyDownList[16]) {
                if (!this.m_canSprint || EnemyInit.isWin)
                    return;
                this.m_oathManager.currentBloodyPoint = this.m_oathManager.currentBloodyPoint + 50;
                this.delayMove(0.1);
                this.hurtedEvent(0.1);
                this.updateAnimation(this.m_state, CharacterStatus.sprint, null, false, 100);
                this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? 50.0 : -50.0, y: 0.0 };
                this.m_rigidbody.mask = 2 | 16;
                this.m_collider.refresh();
                setTimeout(() => {
                    this.m_rigidbody.mask = 2 | 8 | 16;
                    this.m_collider.density = 300;
                    this.m_collider.refresh();
                    setTimeout(() => {
                        this.m_collider.density = 1;
                        this.m_collider.refresh();
                    }, 10);
                }, 500);
                this.m_canSprint = false;
                setTimeout(() => {
                    this.m_canSprint = true;
                }, 3000);
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 10, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 150, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
                }), 0);
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
            }
            if (this.m_keyDownList[32]) {
            }
            if (this.m_keyDownList[90]) {
                if (!this.m_canAttack)
                    return;
                if (this.m_atkTimer)
                    clearInterval(this.m_atkTimer);
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
                this.attackSimulation(this.m_atkStep);
                this.m_canAttack = false;
                setTimeout(() => {
                    this.m_canAttack = true;
                }, this.m_attackCdTime);
            }
            if (this.m_keyDownList[88]) {
                if (EnemyInit.isWin)
                    return;
                this.m_humanSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
            }
            if (this.m_keyDownList[67]) {
                if (EnemyInit.isWin)
                    return;
                this.m_catSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
            }
        }
        attackStepEventCheck() {
            this.m_atkTimer = setTimeout(() => {
                this.m_atkStep = 0;
                this.m_atkTimer = null;
                this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
            }, this.m_attackCdTime + 200);
        }
        attackSimulation(type) {
            let temp = this.m_animation;
            let atkRange = (type === 1) ? this.m_attackRange : this.m_attackRange * 2;
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
                    let enemyCount = 0;
                    soundNum = critical ? 0 : 1;
                    enemyFound.forEach((e) => {
                        e._ent.takeDamage(this.getAtkValue(this.m_atkLevel), this.m_critical, this.m_criticalDmgMultiplier);
                        this.setCameraShake(10, 3);
                        this.m_oathManager.currentBloodyPoint = this.m_oathManager.currentBloodyPoint + this.m_oathManager.increaseBloodyPoint;
                        if (enemyCount < 3)
                            e._ent.slashLightEffect(e._ent.m_animation);
                        this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);
                        enemyCount++;
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
            let posX;
            let posY;
            if (this.m_atkStep === 0) {
                slashEffect.scaleX = 2;
                slashEffect.scaleY = 2;
                posX = 420;
                posY = 560;
                slashEffect.source = "comp/NewSlash_1.atlas";
            }
            else if (this.m_atkStep === 1) {
                slashEffect.scaleX = 3;
                slashEffect.scaleY = 3;
                posX = 600;
                posY = 850;
                slashEffect.source = "comp/NewSlash_2.atlas";
            }
            slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            let colorNum = Math.floor(Math.random() * 5) + 2;
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashEffect.filters = [colorFilter, glowFilter];
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
                slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            }, 10);
        }
        createWalkEffect(player) {
            this.m_walkeffect = new Laya.Animation();
            this.m_walkeffect.source = "comp/WalkEffects.atlas";
            let posX = 280;
            let posY = 270;
            this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            Laya.stage.addChild(this.m_walkeffect);
            this.m_walkeffect.play();
            this.m_walkTimer = setInterval(() => {
                if (this.m_animation.destroyed || EnemyInit.isWin) {
                    this.m_walkeffect.destroy();
                    this.m_walkeffect.destroyed = true;
                }
                if (this.m_walkeffect.destroyed) {
                    clearInterval(this.m_walkTimer);
                    this.m_walkTimer = null;
                    return;
                }
                this.m_walkeffect.skewY = this.m_isFacingRight ? 0 : 180;
                this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            }, 10);
        }
        setSkill() {
            this.m_catSkill = this.getSkillTypeByExtraData('c', ExtraData.currentData['catSkill']);
            this.m_humanSkill = this.getSkillTypeByExtraData('h', ExtraData.currentData['humanSkill']);
        }
        getSkillTypeByExtraData(type, id) {
            if (type === 'c') {
                switch (id) {
                    case 1:
                        return new Slam();
                    case 2:
                        return new BlackHole();
                    default:
                        return new Slam();
                }
            }
            else if (type === 'h') {
                switch (id) {
                    case 1:
                        return new Spike();
                    case 2:
                        return new Behead();
                    default:
                        return new Spike();
                }
            }
            else {
                return null;
            }
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
                    this.m_moveDelayValue -= 0.01;
                }, 10);
            }
        }
        resetMove() {
            this.m_playerVelocity["Vx"] = 0;
            this.m_playerVelocity["Vy"] = 0;
            this.applyMoveX();
            this.applyMoveY();
        }
        applyMoveX() {
            if (this.m_moveDelayValue > 0 || this.m_animation.destroyed || !this.m_animation || EnemyInit.isWin)
                return;
            this.m_rigidbody.linearVelocity = {
                x: this.m_playerVelocity['Vx'],
                y: this.m_rigidbody.linearVelocity.y,
            };
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
            setInterval(() => {
                if (this.m_animation.destroyed) {
                    return;
                }
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
            if (!this.m_walkeffect.destroyed) {
                this.m_walkeffect.destroy();
                this.m_walkeffect.destroyed = true;
            }
            this.m_state = to;
            switch (this.m_state) {
                case CharacterStatus.attackOne:
                    this.m_animationChanging = true;
                    this.m_animation.source = 'character/Attack1.atlas';
                    this.m_animation.play();
                    this.createAttackEffect(this.m_animation);
                    break;
                case CharacterStatus.attackTwo:
                    this.m_animationChanging = true;
                    this.m_animation.source = 'character/Attack2.atlas';
                    this.m_animation.play();
                    this.createAttackEffect(this.m_animation);
                    break;
                case CharacterStatus.idle:
                    this.m_animation.source = 'character/Idle.atlas';
                    this.m_animation.play();
                    break;
                case CharacterStatus.run:
                    this.m_animation.source = 'character/Run.atlas';
                    this.m_animation.play();
                    this.createWalkEffect(this.m_animation);
                    break;
                case CharacterStatus.slam:
                    this.m_animationChanging = true;
                    this.m_animation.source = "character/Erosion.atlas";
                    this.m_animation.play();
                    break;
                case CharacterStatus.sprint:
                    this.m_animationChanging = true;
                    this.m_animation.source = "character/Sprint.atlas";
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
            let enemyInit = new EnemyInit();
            switch (tag) {
                case "EnemyNormalAttack":
                    return enemyInit.NormalEnemyDmg;
                case "EnemyShieldAttack":
                    return enemyInit.ShieldEnemyDmg;
                case "EnemyFastAttack":
                    return enemyInit.FastEnemyDmg;
                case "EnemyNewbieAttack":
                    return enemyInit.NewbieEnemyDmg;
                default:
                    return 0;
            }
        }
        getEnemyCriticalRate(tag) {
            let enemyInit = new EnemyInit();
            switch (tag) {
                case "EnemyNormalAttack":
                    return enemyInit.NormalEnemyCritical;
                case "EnemyShieldAttack":
                    return enemyInit.ShieldEnemyCritical;
                case "EnemyFastAttack":
                    return enemyInit.FastEnemyCritical;
                case "EnemyNewbieAttack":
                    return enemyInit.NewbieEnemyCritical;
                default:
                    return 0;
            }
        }
        getEnemyCriticalDmgRate(tag) {
            let enemyInit = new EnemyInit();
            switch (tag) {
                case "EnemyNormalAttack":
                    return enemyInit.NormalEnemyCriticalDmgMultiplier;
                case "EnemyShieldAttack":
                    return enemyInit.ShieldEnemyCriticalDmgMultiplier;
                case "EnemyFastAttack":
                    return enemyInit.FastEnemyCriticalDmgMultiplier;
                case "EnemyNewbieAttack":
                    return enemyInit.NewbieEnemyCriticalDmgMultiplier;
                default:
                    return 0;
            }
        }
        removeAllDebuff() {
            this.m_oathManager.removeAllDebuff();
        }
        clearAddDebuffTimer() {
            this.m_oathManager.clearAddDebuffTimer();
        }
    }
    class CharacterInit extends Laya.Script {
        constructor() {
            super();
            this.basicHealth = 1000;
            this.critical = 25;
            this.criticalDmgMultiplier = 5;
            this.damageMultiplier = 1;
            this.buff_damageMultiplier = 1.5;
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
            this.spikeDmgMultiplier = 1;
            this.beheadDmgMultiplier = 1;
            this.slamDmgMultiplier = 1;
            this.blackHoleDmgMultiplier = 1;
            this.blackHoleDotDmgMultiplier = 1;
            this.bigExplosionDmgMultiplier = 1;
        }
        onAwake() {
            let player = new Character();
            this.initSetting(player);
            player.spawn();
            CharacterInit.playerEnt = player;
            Laya.stage.addChild(CharacterInit.playerEnt.m_animation);
            player.m_oathManager.showBloodyPoint(CharacterInit.playerEnt.m_animation);
            player.m_oathManager.showBloodyLogo(CharacterInit.playerEnt.m_animation);
        }
        initSetting(player) {
            ExtraData.loadData();
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            this.health = this.basicHealth + data.hpLevel * 100;
            player.m_health = player.m_maxHealth = this.health;
            player.m_critical = this.critical;
            player.m_criticalDmgMultiplier = this.criticalDmgMultiplier;
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
            player.m_basic_damageMultiPlier = this.damageMultiplier;
            player.m_buff_damageMultiPlier = this.buff_damageMultiplier;
            player.m_spikeDmgMultiplier = this.spikeDmgMultiplier;
            player.m_beheadDmgMultiplier = this.beheadDmgMultiplier;
            player.m_slamDmgMultiplier = this.slamDmgMultiplier;
            player.m_blackHoleDmgMultiplier = this.blackHoleDmgMultiplier;
            player.m_blackHoleDotDmgMultiplier = this.blackHoleDotDmgMultiplier;
            player.m_bigExplosionDmgMultiplier = this.bigExplosionDmgMultiplier;
            player.m_maxBloodyPoint = player.m_maxBloodyPoint_soft;
            player.m_bloodyPoint = 0;
            player.m_oathManager = new OathManager();
            player.m_oathManager.initOathSystem();
            player.showHealth();
        }
        onUpdate() {
            if (CharacterInit.playerEnt.m_animation.destroyed)
                return;
            let colorNum = 2;
            let oathColorMat = [
                Math.floor(Math.random() * 2) + 2, 0, 0, 0, -100,
                1, Math.floor(Math.random() * 2) + 1, 0, 0, -100,
                1, 0, Math.floor(Math.random() * 2) + 2, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(oathColorMat);
            let glowFilter_charge = new Laya.GlowFilter("#df6ef4", 10, 0, 0);
            CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];
            CharacterInit.playerEnt.m_oathManager.characterLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];
            CharacterInit.playerEnt.m_oathManager.oathUpdate();
        }
    }

    class SkillList extends Laya.Script {
        onStart() {
            this.updateSkillList();
        }
        updateSkillList() {
            SkillList.catSkillList.push(new Slam());
            SkillList.catSkillList.push(new BlackHole());
            SkillList.humanSkillList.push(new Spike());
            SkillList.humanSkillList.push(new Behead());
        }
    }
    SkillList.catSkillList = [];
    SkillList.humanSkillList = [];

    class MissionManager extends Laya.Script {
        constructor() {
            super(...arguments);
            this.roundAddEnemy = 5;
            this.missionNum = 3;
            this.missionDifficultyArr = [];
            this.missionUI = null;
            this.eliteIcons = [];
            this.difficultyIcons = [];
            this.crystalNums = [];
            this.moneyNums = [];
            this.confirmIcons = [];
        }
        onStart() {
        }
        showMissionUI() {
            this.missionUI = new Laya.Sprite();
            this.missionUI.loadImage("UI/chioce_mission.png");
            this.missionUI.width = 1024;
            this.missionUI.height = 576;
            this.missionUI.pos(171, 96);
            this.missionUI.alpha = 1;
            Laya.stage.addChild(this.missionUI);
            if (Village.isNewbie) {
                this.setEliteIcon(0, MissionManager.missionDataPool[0]["eliteNum"]);
                this.setDifficultyIcon(0, MissionManager.missionDataPool[0]["difficulty"]);
                this.setRewardInfo(0, MissionManager.missionDataPool[0]["crystal"], MissionManager.missionDataPool[0]["money"]);
                this.setConfirmIcon(0, MissionManager.missionDataPool[0]);
                Laya.stage.addChild(this.eliteIcons[0]);
                Laya.stage.addChild(this.difficultyIcons[0]);
                Laya.stage.addChild(this.crystalNums[0]);
                Laya.stage.addChild(this.moneyNums[0]);
                Laya.stage.addChild(this.confirmIcons[0]);
            }
            else {
                for (let i = 0; i < this.missionNum; i++) {
                    this.setEliteIcon(i, MissionManager.missionDataPool[i]["eliteNum"]);
                    this.setDifficultyIcon(i, MissionManager.missionDataPool[i]["difficulty"]);
                    this.setRewardInfo(i, MissionManager.missionDataPool[i]["crystal"], MissionManager.missionDataPool[i]["money"]);
                    this.setConfirmIcon(i, MissionManager.missionDataPool[i]);
                }
                for (let i = 0; i < this.eliteIcons.length; i++) {
                    Laya.stage.addChild(this.eliteIcons[i]);
                }
                for (let i = 0; i < this.difficultyIcons.length; i++) {
                    Laya.stage.addChild(this.difficultyIcons[i]);
                }
                for (let i = 0; i < this.crystalNums.length; i++) {
                    Laya.stage.addChild(this.crystalNums[i]);
                }
                for (let i = 0; i < this.moneyNums.length; i++) {
                    Laya.stage.addChild(this.moneyNums[i]);
                }
                for (let i = 0; i < this.confirmIcons.length; i++) {
                    Laya.stage.addChild(this.confirmIcons[i]);
                }
            }
        }
        clearMissionUI() {
            for (let i = 0; i < this.eliteIcons.length; i++) {
                this.eliteIcons[i].destroy();
                this.eliteIcons[i] = null;
            }
            for (let i = 0; i < this.difficultyIcons.length; i++) {
                this.difficultyIcons[i].destroy();
                this.difficultyIcons[i] = null;
            }
            for (let i = 0; i < this.crystalNums.length; i++) {
                this.crystalNums[i].destroy();
                this.crystalNums[i] = null;
            }
            for (let i = 0; i < this.moneyNums.length; i++) {
                this.moneyNums[i].destroy();
                this.moneyNums[i] = null;
            }
            for (let i = 0; i < this.confirmIcons.length; i++) {
                this.confirmIcons[i].destroy();
                this.confirmIcons[i] = null;
            }
            this.missionUI.destroy();
            this.missionUI = null;
        }
        setEliteIcon(col, eliteNum) {
            let eliteIcon = new Laya.Sprite();
            if (eliteNum > 0)
                eliteIcon.loadImage("UI/skull.png");
            eliteIcon.width = 49;
            eliteIcon.height = 66;
            eliteIcon.pos(171 + 198.5 + col * (256 + 34), 135 + 96);
            this.eliteIcons.push(eliteIcon);
        }
        setDifficultyIcon(col, difficulty) {
            let difficultyStage = 0;
            if (difficulty > 35 && difficulty <= 50) {
                difficultyStage = 3;
            }
            else if (difficulty > 20 && difficulty <= 35) {
                difficultyStage = 2;
            }
            else if (difficulty >= 5 && difficulty <= 20) {
                difficultyStage = 1;
            }
            for (let i = 0; i < difficultyStage; i++) {
                let difficultyIcon_temp = new Laya.Sprite();
                difficultyIcon_temp.loadImage("UI/star.png");
                difficultyIcon_temp.width = 39;
                difficultyIcon_temp.height = 39;
                difficultyIcon_temp.pos(171 + 137.5 + col * (256 + 34) + (131 / (difficultyStage + 1)) * (i + 1), 308 + 10);
                this.difficultyIcons.push(difficultyIcon_temp);
            }
        }
        setRewardInfo(col, crystal, money) {
            let crystalNum = new Laya.Text();
            let moneyNum = new Laya.Text();
            crystalNum.font = "silver";
            moneyNum.font = "silver";
            crystalNum.fontSize = 45;
            moneyNum.fontSize = 45;
            crystalNum.text = crystal.toString();
            moneyNum.text = money.toString();
            crystalNum.pos(171 + 252 + 5 + col * (256 + 34), 305 + 96);
            moneyNum.pos(171 + 252 + 5 + col * (256 + 34), 375 + 96);
            this.crystalNums.push(crystalNum);
            this.moneyNums.push(moneyNum);
        }
        setConfirmIcon(col, data) {
            let confirmIcon = new Laya.Button();
            confirmIcon.width = 100;
            confirmIcon.height = 50;
            confirmIcon.loadImage("UI/chioce_mission_button_Bright.png");
            confirmIcon.pos(171 + 173 + col * (256 + 34), 458 + 96);
            confirmIcon.on(Laya.Event.MOUSE_MOVE, this, () => {
                confirmIcon.loadImage("UI/chioce_mission_button_Dark.png");
            });
            confirmIcon.on(Laya.Event.MOUSE_OUT, this, () => {
                confirmIcon.loadImage("UI/chioce_mission_button_Bright.png");
            });
            confirmIcon.on(Laya.Event.CLICK, this, () => {
                this.clearMissionUI();
                this.sendMissionData(data);
                Laya.Scene.load("Loading.scene");
                if (Village.isNewbie) {
                    Laya.Scene.open("Newbie.scene");
                }
                else {
                    let x = Math.round(Math.random());
                    if (x > 0.5) {
                        Laya.Scene.closeAll();
                        Laya.Scene.open("First.scene");
                    }
                    else {
                        Laya.Scene.closeAll();
                        Laya.Scene.open("Town.scene");
                    }
                }
            });
            this.confirmIcons.push(confirmIcon);
        }
        generateMissionData(total) {
            for (let i = 0; i < total; i++) {
                if (i < total / 3)
                    this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 35);
                if (i >= total / 3 && i < total * 2 / 3)
                    this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 20);
                if (i >= total * 2 / 3)
                    this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 5);
            }
            this.missionDifficultyArr.sort();
            this.missionDifficultyArr.reverse();
            for (let i = 0; i < total; i++) {
                let missionData = {
                    id: i,
                    missionName: "殲滅來犯敵軍",
                    difficulty: this.missionDifficultyArr[i],
                    enemyNum: Math.round((20 + this.roundAddEnemy * MissionManager.missionRound) * (1 + this.missionDifficultyArr[i] / 100)),
                    enemyHp: 1000,
                    enemyAtk: 100,
                    eliteNum: Math.round(Math.random()),
                    eliteHpMultiplier: 1.5,
                    eliteAtkMultiplier: 1.5,
                    crystal: Math.round(100 + 100 * (1 + this.missionDifficultyArr[i] / 100)),
                    money: Math.round(500 + 500 * (1 + this.missionDifficultyArr[i] / 100)),
                    map: "forest",
                };
                MissionManager.missionDataPool.push(missionData);
            }
            console.log(MissionManager.missionDataPool);
            return MissionManager.missionDataPool;
        }
        generateNewbieData() {
            let missionData = {
                id: 0,
                missionName: "新手教學",
                difficulty: 0,
                enemyNum: 3,
                enemyHp: 5000,
                enemyAtk: 0,
                eliteNum: 0,
                eliteHpMultiplier: 1.5,
                eliteAtkMultiplier: 1.5,
                crystal: 0,
                money: 0,
                map: "forest",
            };
            MissionManager.missionDataPool.push(missionData);
            console.log(MissionManager.missionDataPool);
            return MissionManager.missionDataPool;
        }
        sendMissionData(data) {
            EnemyInit.missionEnemyNum = data["enemyNum"];
            EnemyInit.missionRewardCrystalValue = data["crystal"];
            EnemyInit.missionRewardGoldValue = data["money"];
        }
    }
    MissionManager.missionRound = 0;
    MissionManager.missionDataPool = [];

    class Village extends Laya.Script {
        constructor() {
            super(...arguments);
            this.reinforceToggle = false;
            this.reinforceBtn = null;
            this.templeBtn = null;
            this.battleBtn = null;
            this.reinforceUI = null;
            this.reinforceBackBtn = null;
            this.reinforceGold = null;
            this.reinforceHpLevel = null;
            this.reinforceAtkDmgLevel = null;
            this.reinforceHpCost = null;
            this.reinforceHpCostBtn = null;
            this.reinforceAtkDmgCost = null;
            this.reinforceAtkDmgCostBtn = null;
            this.reinforceHpCostIcon = null;
            this.reinforceAtkDmgCostIcon = null;
            this.missionManager = new MissionManager();
        }
        onAwake() {
            if (Village.isNewbie) {
                this.missionManager.generateNewbieData();
            }
            else {
                MissionManager.missionDataPool = [];
                this.missionManager.generateMissionData(9);
            }
        }
        onStart() {
            this.updateData();
            Laya.stage.x = 0;
            Laya.stage.y = 0;
            this.reinforceBtn = this.owner.getChildByName("Reinforce");
            this.templeBtn = this.owner.getChildByName("Temple");
            this.battleBtn = this.owner.getChildByName("Battle");
            this.reinforceBtn.on(Laya.Event.CLICK, this, function () {
                this.showReinforceUI();
            });
            this.templeBtn.on(Laya.Event.CLICK, this, function () {
                console.log("temple");
            });
            this.battleBtn.on(Laya.Event.CLICK, this, function () {
                this.missionManager.showMissionUI();
            });
        }
        updateData() {
            ExtraData.loadData();
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            this.c_gold = data.gold;
            this.c_crystal = data.crystal;
            Village.hpLevel = data.hpLevel;
            Village.atkDmgLevel = data.atkDmgLevel;
            this.saveData();
        }
        showReinforceUI() {
            this.setReinfoceUI();
            this.setReinfoceBackBtn();
            this.setReinfoceGoldValue();
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceHpLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceHpCost();
            this.setReinforceAtkDmgCostBtn();
            this.setReinforceHpCostBtn();
            this.setReinforceAtkDmgCostIcon();
            this.setReinforceHpCostIcon();
            this.reinforceToggle = true;
        }
        clearReinforceUI() {
            if (this.reinforceToggle) {
                this.reinforceUI.destroy();
                this.reinforceBackBtn.destroy();
                this.reinforceGold.destroy();
                this.reinforceAtkDmgLevel.destroy();
                this.reinforceHpLevel.destroy();
                this.reinforceAtkDmgCost.destroy();
                this.reinforceHpCost.destroy();
                this.reinforceAtkDmgCostBtn.destroy();
                this.reinforceHpCostBtn.destroy();
                this.reinforceAtkDmgCostIcon.destroy();
                this.reinforceHpCostIcon.destroy();
                this.reinforceUI = this.reinforceBackBtn = this.reinforceGold = this.reinforceAtkDmgLevel = this.reinforceHpLevel = this.reinforceAtkDmgCost
                    = this.reinforceHpCost = this.reinforceAtkDmgCostBtn = this.reinforceHpCostBtn = this.reinforceHpCostIcon = this.reinforceAtkDmgCostIcon = null;
                this.reinforceToggle = false;
            }
        }
        setReinfoceUI() {
            this.reinforceUI = new Laya.Sprite();
            this.reinforceUI.loadImage("ui/reinforce.png");
            this.reinforceUI.width = 700;
            this.reinforceUI.height = 400;
            this.reinforceUI.pos(333, 184);
            this.reinforceUI.alpha = 1;
            Laya.stage.addChild(this.reinforceUI);
        }
        setReinfoceBackBtn() {
            this.reinforceBackBtn = new Laya.Button();
            this.reinforceBackBtn.width = this.reinforceBackBtn.height = 73;
            this.reinforceBackBtn.pos(150 + 933, 109 + 56);
            this.reinforceBackBtn.on(Laya.Event.CLICK, this, () => {
                this.clearReinforceUI();
            });
            Laya.stage.addChild(this.reinforceBackBtn);
        }
        setReinfoceGoldValue() {
            if (this.reinforceGold) {
                this.reinforceGold.text = '$' + String(this.c_gold);
                return;
            }
            this.reinforceGold = new Laya.Text();
            this.reinforceGold.font = "silver";
            this.reinforceGold.fontSize = 80;
            this.reinforceGold.color = "#FEFFF7";
            this.reinforceGold.stroke = 3;
            this.reinforceGold.strokeColor = "#000";
            this.reinforceGold.text = '$' + String(this.c_gold);
            this.reinforceGold.pos(333 + 550, 184 + 50);
            Laya.stage.addChild(this.reinforceGold);
        }
        setReinfoceAtkDmgLevel() {
            if (this.reinforceAtkDmgLevel) {
                this.reinforceAtkDmgLevel.text = 'LV.' + String(Village.atkDmgLevel);
                return;
            }
            this.reinforceAtkDmgLevel = new Laya.Text();
            this.reinforceAtkDmgLevel.font = "silver";
            this.reinforceAtkDmgLevel.fontSize = 85;
            this.reinforceAtkDmgLevel.color = "#FEFFF7";
            this.reinforceAtkDmgLevel.stroke = 3;
            this.reinforceAtkDmgLevel.strokeColor = "#000";
            this.reinforceAtkDmgLevel.text = 'LV.' + String(Village.atkDmgLevel);
            this.reinforceAtkDmgLevel.pos(333 + 255, 184 + 160);
            Laya.stage.addChild(this.reinforceAtkDmgLevel);
        }
        setReinfoceHpLevel() {
            if (this.reinforceHpLevel) {
                this.reinforceHpLevel.text = 'LV.' + String(Village.hpLevel);
                return;
            }
            this.reinforceHpLevel = new Laya.Text();
            this.reinforceHpLevel.font = "silver";
            this.reinforceHpLevel.fontSize = 85;
            this.reinforceHpLevel.color = "#FEFFF7";
            this.reinforceHpLevel.stroke = 3;
            this.reinforceHpLevel.strokeColor = "#000";
            this.reinforceHpLevel.text = 'LV.' + String(Village.hpLevel);
            this.reinforceHpLevel.pos(333 + 255, 184 + 275);
            Laya.stage.addChild(this.reinforceHpLevel);
        }
        setReinfoceAtkDmgCost() {
            if (this.reinforceAtkDmgCost) {
                this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel * 100);
                return;
            }
            this.reinforceAtkDmgCost = new Laya.Text();
            this.reinforceAtkDmgCost.font = "silver";
            this.reinforceAtkDmgCost.fontSize = 85;
            this.reinforceAtkDmgCost.color = "#fff";
            this.reinforceAtkDmgCost.stroke = 3;
            this.reinforceAtkDmgCost.strokeColor = "#000";
            this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel * 100);
            this.reinforceAtkDmgCost.pos(333 + 550, 184 + 160);
            Laya.stage.addChild(this.reinforceAtkDmgCost);
        }
        setReinfoceHpCost() {
            if (this.reinforceHpCost) {
                this.reinforceHpCost.text = '$' + String(Village.hpLevel * 100);
                return;
            }
            this.reinforceHpCost = new Laya.Text();
            this.reinforceHpCost.font = "silver";
            this.reinforceHpCost.fontSize = 85;
            this.reinforceHpCost.color = "#fff";
            this.reinforceHpCost.stroke = 3;
            this.reinforceHpCost.strokeColor = "#000";
            this.reinforceHpCost.text = '$' + String(Village.hpLevel * 100);
            this.reinforceHpCost.pos(333 + 550, 184 + 275);
            Laya.stage.addChild(this.reinforceHpCost);
        }
        setReinforceAtkDmgCostBtn() {
            this.reinforceAtkDmgCostBtn = new Laya.Button();
            this.reinforceAtkDmgCostBtn.width = 41;
            this.reinforceAtkDmgCostBtn.height = 52;
            this.reinforceAtkDmgCostBtn.pos(330 + 465, 184 + 160);
            this.reinforceAtkDmgCostBtn.on(Laya.Event.CLICK, this, () => {
                if (this.c_gold < Village.atkDmgLevel * 100) {
                    return;
                }
                this.c_gold -= Village.atkDmgLevel * 100;
                Village.atkDmgLevel++;
                this.setReinfoceAtkDmgLevel();
                this.setReinfoceAtkDmgCost();
                this.setReinfoceGoldValue();
                this.saveData();
            });
            Laya.stage.addChild(this.reinforceAtkDmgCostBtn);
        }
        setReinforceHpCostBtn() {
            this.reinforceHpCostBtn = new Laya.Button();
            this.reinforceHpCostBtn.width = 41;
            this.reinforceHpCostBtn.height = 52;
            this.reinforceHpCostBtn.pos(330 + 465, 184 + 275);
            this.reinforceHpCostBtn.on(Laya.Event.CLICK, this, () => {
                if (this.c_gold < Village.hpLevel * 100) {
                    return;
                }
                this.c_gold -= Village.hpLevel * 100;
                Village.hpLevel++;
                this.setReinfoceHpLevel();
                this.setReinfoceHpCost();
                this.setReinfoceGoldValue();
                this.saveData();
            });
            Laya.stage.addChild(this.reinforceHpCostBtn);
        }
        setReinforceAtkDmgCostIcon() {
            this.reinforceAtkDmgCostIcon = new Laya.Sprite();
            this.reinforceAtkDmgCostIcon.pos(330 + 465, 184 + 160);
            this.reinforceAtkDmgCostIcon.loadImage('ui/arrP.png');
            this.reinforceAtkDmgCostIcon.alpha = 1;
            Laya.stage.addChild(this.reinforceAtkDmgCostIcon);
        }
        setReinforceHpCostIcon() {
            this.reinforceHpCostIcon = new Laya.Sprite();
            this.reinforceHpCostIcon.pos(330 + 465, 184 + 275);
            this.reinforceHpCostIcon.loadImage('ui/arrR.png');
            this.reinforceHpCostIcon.alpha = 1;
            Laya.stage.addChild(this.reinforceHpCostIcon);
        }
        saveData() {
            ExtraData.currentData['atkDmgLevel'] = Village.atkDmgLevel;
            ExtraData.currentData['hpLevel'] = Village.hpLevel;
            ExtraData.currentData['gold'] = this.c_gold;
            ExtraData.currentData['crystal'] = this.c_crystal;
            ExtraData.saveData();
        }
    }
    Village.isNewbie = true;

    class EnemyInit extends Laya.Script {
        constructor() {
            super();
            this.enemyGenerateTime = 5000;
            this.enemyLeft = 50;
            this.roundTimeLeft = 180;
            this.NormalEnemyHealth = 1000;
            this.NormalEnemyDmg = 33;
            this.NormalEnemyCritical = 33;
            this.NormalEnemyCriticalDmgMultiplier = 3;
            this.ShieldEnemyHealth = 1500;
            this.ShieldEnemyDmg = 30;
            this.ShieldEnemyCritical = 33;
            this.ShieldEnemyCriticalDmgMultiplier = 3;
            this.FastEnemyHealth = 500;
            this.FastEnemyDmg = 70;
            this.FastEnemyCritical = 33;
            this.FastEnemyCriticalDmgMultiplier = 3;
            this.NewbieEnemyHealth = 5000;
            this.NewbieEnemyDmg = 0;
            this.NewbieEnemyCritical = 0;
            this.NewbieEnemyCriticalDmgMultiplier = 0;
            this.roundDetectTimer = null;
            this.generateTimer = null;
            this.battleToggle = true;
            this.battleTimer = null;
            this.rewardGoldValue = 500;
            this.rewardCrystalValue = 100;
        }
        onAwake() {
            this.updateMissionData();
        }
        onStart() {
            this.timeLeftValue = this.roundTimeLeft;
            EnemyInit.enemyLeftCur = this.enemyLeft;
            let player = CharacterInit.playerEnt.m_animation;
            let enemy = EnemyHandler.enemyPool;
            console.log(enemy);
            EnemyInit.isWin = false;
            this.generateTimer = setInterval(() => {
                if (player.destroyed) {
                    EnemyHandler.clearAllEnemy();
                    clearInterval(this.generateTimer);
                    this.generateTimer = null;
                    return;
                }
                if (this.enemyLeft <= 0) {
                    clearInterval(this.generateTimer);
                    this.generateTimer = null;
                    return;
                }
                if (EnemyHandler.getEnemiesCount() >= 10)
                    return;
                let x = Math.floor(Math.random() * 3) + 1;
                if (Village.isNewbie) {
                    EnemyHandler.generator(player, 4, 0);
                }
                else {
                    EnemyHandler.generator(player, x, 0);
                }
                this.enemyLeft--;
            }, this.enemyGenerateTime);
            this.battleTimer = setInterval(() => {
                if (!player || player.destroyed) {
                    clearInterval(this.battleTimer);
                    this.battleTimer = null;
                    return;
                }
                console.log(EnemyInit.enemyLeftCur, EnemyHandler.enemyPool.length);
                if (EnemyInit.enemyLeftCur <= 0) {
                    this.battleToggle = false;
                    Village.isNewbie = false;
                    EnemyInit.isWin = true;
                    CharacterInit.playerEnt.clearAddDebuffTimer();
                    CharacterInit.playerEnt.removeAllDebuff();
                    Laya.Tween.to(player, { alpha: 0.8 }, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                        this.showEndRewardUI();
                    }), 0);
                    clearInterval(this.battleTimer);
                    this.battleTimer = null;
                    CharacterInit.playerEnt.m_rigidbody.linearVelocity = { x: 0, y: 0 };
                    return;
                }
                else if (this.timeLeftValue < 0) {
                    EnemyHandler.clearAllEnemy();
                    clearInterval(this.battleTimer);
                    this.battleTimer = null;
                    CharacterInit.playerEnt.clearAddDebuffTimer();
                    CharacterInit.playerEnt.removeAllDebuff();
                    CharacterInit.playerEnt.death();
                    return;
                }
                this.timeLeftValue--;
            }, 1000);
            this.showBattleInfo();
        }
        onKeyUp(e) {
            if (this.endingRewardUI && e.keyCode === 32) {
                Laya.Tween.to(this.endingRewardUI, { alpha: 0.3 }, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    this.endingRewardUI.destroy();
                    this.rewardCrystal.destroy();
                    this.rewardGold.destroy();
                    this.rewardCrystalText.destroy();
                    this.rewardGoldText.destroy();
                    this.showEndSkill();
                }), 0);
            }
            ;
            let player = CharacterInit.playerEnt;
            if (this.endingSkillUI) {
                if (e.keyCode === 32) {
                    if (player.m_isFacingRight) {
                        this.skillChoose(2);
                    }
                    else {
                        this.skillChoose(1);
                    }
                }
                if (!this.endingSkillUI.destroyed) {
                    this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                    this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                }
            }
        }
        onKeyDown(e) {
            if (this.endingSkillUI) {
                let player = CharacterInit.playerEnt;
                if (!this.endingSkillUI.destroyed) {
                    this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                    this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                }
            }
        }
        showEndSkill() {
            let player = CharacterInit.playerEnt;
            this.endingSkillUI = new Laya.Sprite();
            this.endingSkillUI.width = 684;
            this.endingSkillUI.height = 576;
            this.endingSkillUI.loadImage('ui/ending/chooseSkill.png');
            this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.m_animation.x - 325), 30);
            this.endingSkillUI.alpha = 0.5;
            player.m_animation.pos(this.endingSkillUI.x + this.endingSkillUI.width / 2, player.m_animation.y);
            let pos = {
                'x': this.endingSkillUI.x,
                'y': this.endingSkillUI.y,
            };
            this.skillCat = new Laya.Sprite();
            this.skillHuman = new Laya.Sprite();
            this.skillCat.width = this.skillHuman.width = 130;
            this.skillCat.height = this.skillHuman.height = 130;
            this.skillCat.pos(pos['x'] + 136, pos['y'] + 140);
            this.skillHuman.pos(pos['x'] + 418, pos['y'] + 140);
            this.skillCat.loadImage('ui/ending/skillBox.png');
            this.skillHuman.loadImage('ui/ending/skillBox.png');
            this.r1 = Math.floor(Math.random() * 2);
            this.r2 = Math.floor(Math.random() * 2);
            this.skillCatIcon = new Laya.Sprite();
            this.skillHumanIcon = new Laya.Sprite();
            this.skillCatIcon.width = this.skillHumanIcon.width = 100;
            this.skillCatIcon.height = this.skillHumanIcon.height = 100;
            this.skillCatIcon.pos(this.skillCat.x + 15, this.skillCat.y + 15);
            this.skillHumanIcon.pos(this.skillHuman.x + 15, this.skillHuman.y + 15);
            this.skillCatIcon.loadImage(SkillList.catSkillList[this.r1].m_iconB);
            this.skillHumanIcon.loadImage(SkillList.humanSkillList[this.r2].m_iconB);
            this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
            this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
            this.skillCatBtn = new Laya.Button();
            this.skillHumanBtn = new Laya.Button();
            this.skillCatBtn.width = this.skillHumanBtn.width = 92;
            this.skillCatBtn.height = this.skillHumanBtn.height = 33;
            this.skillCatBtn.pos(pos['x'] + 155, pos['y'] + 302);
            this.skillHumanBtn.pos(pos['x'] + 442, pos['y'] + 302);
            this.skillCatBtn.loadImage("ui/ending/chooseBtn.png");
            this.skillHumanBtn.loadImage("ui/ending/chooseBtn.png");
            this.skillCatInfo = new Laya.Sprite();
            this.skillHumanInfo = new Laya.Sprite();
            this.skillCatInfo.width = this.skillHumanInfo.width = 205;
            this.skillCatInfo.height = this.skillHumanInfo.height = 110;
            this.skillCatInfo.pos(pos['x'] + 96, pos['y'] + 402);
            this.skillHumanInfo.pos(pos['x'] + 383, pos['y'] + 402);
            this.skillCatInfo.loadImage("ui/ending/infoBox.png");
            this.skillHumanInfo.loadImage("ui/ending/infoBox.png");
            this.skillCatInfoText = new Laya.Text();
            this.skillHumanInfoText = new Laya.Text();
            this.catSkillName = new Laya.Text();
            this.humanSkillName = new Laya.Text();
            this.skillCatInfoText.width = this.skillHumanInfoText.width = this.catSkillName.width = this.humanSkillName.width = 167;
            this.skillCatInfoText.height = this.skillHumanInfoText.height = this.catSkillName.height = this.humanSkillName.height = 70;
            this.skillCatInfoText.pos(this.skillCatInfo.x + 20, this.skillCatInfo.y + 20);
            this.skillHumanInfoText.pos(this.skillHumanInfo.x + 20, this.skillHumanInfo.y + 20);
            this.catSkillName.pos(pos['x'] + 115, pos['y'] + 295);
            this.humanSkillName.pos(pos['x'] + 405, pos['y'] + 295);
            this.skillCatInfoText.text = SkillList.catSkillList[this.r1].m_info;
            this.skillHumanInfoText.text = SkillList.humanSkillList[this.r2].m_info;
            this.catSkillName.text = SkillList.catSkillList[this.r1].m_name;
            this.humanSkillName.text = SkillList.humanSkillList[this.r2].m_name;
            this.catSkillName.align = this.humanSkillName.align = 'center';
            this.skillCatInfoText.font = this.skillHumanInfoText.font = this.catSkillName.font = this.humanSkillName.font = 'silver';
            this.skillCatInfoText.color = this.skillHumanInfoText.color = this.catSkillName.color = this.humanSkillName.color = '#fdfdfd';
            this.skillCatInfoText.fontSize = this.skillHumanInfoText.fontSize = this.catSkillName.fontSize = this.humanSkillName.fontSize = 38;
            this.skillCatInfoText.wordWrap = this.skillHumanInfoText.wordWrap = true;
            this.leftArrow = new Laya.Sprite();
            this.rightArrow = new Laya.Sprite();
            this.leftArrow.pos(pos['x'] + 175, pos['y'] + 340);
            this.rightArrow.pos(pos['x'] + 457, pos['y'] + 340);
            this.leftArrow.loadImage('ui/leftArr.png');
            this.rightArrow.loadImage('ui/rightArr.png');
            this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
            this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
            Laya.stage.addChild(this.endingSkillUI);
            Laya.stage.addChild(this.skillCat);
            Laya.stage.addChild(this.skillHuman);
            Laya.stage.addChild(this.skillCatIcon);
            Laya.stage.addChild(this.skillHumanIcon);
            Laya.stage.addChild(this.skillCatInfo);
            Laya.stage.addChild(this.skillHumanInfo);
            Laya.stage.addChild(this.skillCatInfoText);
            Laya.stage.addChild(this.skillHumanInfoText);
            Laya.stage.addChild(this.catSkillName);
            Laya.stage.addChild(this.humanSkillName);
            Laya.stage.addChild(this.leftArrow);
            Laya.stage.addChild(this.rightArrow);
            Laya.Tween.to(this.endingSkillUI, { alpha: 1.0 }, 500, Laya.Ease.linearInOut, null, 0);
        }
        skillChoose(type) {
            switch (type) {
                case 1:
                    ExtraData.currentData['catSkill'] = this.r1 + 1;
                    break;
                case 2:
                    ExtraData.currentData['humanSkill'] = this.r2 + 1;
                    break;
                default:
                    break;
            }
            ExtraData.saveData();
            this.clearUI();
            this.unsetCharacter();
        }
        unsetCharacter() {
            let player = CharacterInit.playerEnt.m_animation;
            Laya.Tween.to(player, { alpha: 0.0 }, 2500, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                player.destroy();
                player.destroyed = true;
                this.changeToVillage();
            }), 0);
        }
        showEndRewardUI() {
            let player = CharacterInit.playerEnt.m_animation;
            this.endingRewardUI = new Laya.Sprite();
            this.endingRewardUI.width = 342;
            this.endingRewardUI.height = 288;
            this.endingRewardUI.loadImage('ui/ending/ending.png');
            this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);
            let pos = {
                'x': this.endingRewardUI.x,
                'y': this.endingRewardUI.y,
            };
            this.rewardCrystal = new Laya.Sprite();
            this.rewardGold = new Laya.Sprite();
            this.rewardCrystalText = new Laya.Text();
            this.rewardGoldText = new Laya.Text();
            this.rewardCrystal.width = this.rewardGold.width = 50;
            this.rewardCrystal.height = this.rewardGold.height = 50;
            this.rewardCrystalText.width = this.rewardGoldText.width = 135;
            this.rewardCrystalText.height = this.rewardGoldText.height = 35;
            this.rewardCrystalText.font = this.rewardGoldText.font = "silver";
            this.rewardCrystalText.fontSize = this.rewardGoldText.fontSize = 50;
            this.rewardCrystalText.color = this.rewardGoldText.color = "#FCFF56";
            this.rewardCrystalText.text = '+' + String(this.rewardCrystalValue);
            this.rewardGoldText.text = '+' + String(this.rewardGoldValue);
            this.rewardCrystal.pos(pos['x'] + 98, pos['y'] + 98);
            this.rewardCrystalText.pos(pos['x'] + 168, pos['y'] + 104);
            this.rewardGold.pos(pos['x'] + 94, pos['y'] + 154);
            this.rewardGoldText.pos(pos['x'] + 168, pos['y'] + 161);
            this.rewardCrystal.loadImage('ui/ending/crystal.png');
            this.rewardGold.loadImage('ui/ending/gold.png');
            Laya.stage.addChild(this.endingRewardUI);
            Laya.stage.addChild(this.rewardCrystal);
            Laya.stage.addChild(this.rewardGold);
            Laya.stage.addChild(this.rewardCrystalText);
            Laya.stage.addChild(this.rewardGoldText);
            this.endingUpdateData();
        }
        showBattleInfo() {
            this.enemyLeftIcon = new Laya.Sprite();
            this.enemyInfo = new Laya.Text();
            let player = CharacterInit.playerEnt.m_animation;
            this.enemyInfo.fontSize = 60;
            this.enemyInfo.color = "#fff";
            this.enemyInfo.stroke = 3;
            this.enemyInfo.font = "silver";
            this.enemyInfo.strokeColor = "#000";
            this.enemyLeftIcon.loadImage('ui/skull.png');
            this.enemyLeftIcon.width = 30;
            this.enemyLeftIcon.height = 40;
            Laya.stage.addChild(this.enemyInfo);
            Laya.stage.addChild(this.enemyLeftIcon);
            this.roundDetectTimer = setInterval(() => {
                if (!this.battleToggle || player.destroyed) {
                    this.enemyInfo.text = "";
                    this.enemyInfo.destroy();
                    this.enemyLeftIcon.destroy();
                    clearInterval(this.roundDetectTimer);
                    this.roundDetectTimer = null;
                    return;
                }
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.enemyLeftIcon.pos(player.x - 70, 110);
                }
                if (Laya.stage.x >= -250) {
                    this.enemyLeftIcon.pos(935 - 70, 110);
                }
                if (Laya.stage.x <= -2475) {
                    this.enemyLeftIcon.pos(3155 - 70, 110);
                }
                this.enemyInfo.pos(this.enemyLeftIcon.x + 44, this.enemyLeftIcon.y - 2);
                this.enemyInfo.text = 'x' + String(EnemyInit.enemyLeftCur);
            }, 5);
        }
        updateMissionData() {
            this.enemyLeft = EnemyInit.missionEnemyNum;
            this.rewardCrystalValue = EnemyInit.missionRewardCrystalValue;
            this.rewardGoldValue = EnemyInit.missionRewardGoldValue;
        }
        endingUpdateData() {
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            ExtraData.currentData['crystal'] = data.crystal + this.rewardCrystalValue;
            ExtraData.currentData['gold'] = data.gold + this.rewardGoldValue;
            ExtraData.saveData();
        }
        changeToVillage() {
            EnemyHandler.clearAllEnemy();
            Laya.Scene.load("Loading.scene");
            Laya.Scene.open("Village.scene", true);
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
        }
        clearUI() {
            this.endingSkillUI.destroy();
            this.skillCat.destroy();
            this.skillHuman.destroy();
            this.skillCatBtn.destroy();
            this.skillHumanBtn.destroy();
            this.skillCatIcon.destroy();
            this.skillHumanIcon.destroy();
            this.skillCatInfo.destroy();
            this.skillHumanInfo.destroy();
            this.skillCatInfoText.destroy();
            this.skillHumanInfoText.destroy();
            this.catSkillName.destroy();
            this.humanSkillName.destroy();
            this.leftArrow.destroy();
            this.rightArrow.destroy();
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
            this.m_moveVelocity = { "Vx": 0, "Vy": 0 };
            this.m_rectangle = { "x0": 0, "x1": 0, "y0": 0, "y1": 0, "h": 0, "w": 0 };
            this.m_playerPushVelOffset = { "Vx": 0, "Vy": 0 };
            this.m_attackRange = 100;
            this.m_hurtDelay = 0;
            this.m_atkCd = true;
            this.m_isFacingRight = true;
            this.m_moveDelayValue = 0.0;
            this.m_moveDelayTimer = null;
            this.m_deadTimer = null;
            this.m_animationChanging = false;
            this.m_hurtDelayTimer = null;
            this.m_state = EnemyStatus.idle;
        }
        spawn(player, id, point, enemyType) {
            this.m_animation = new Laya.Animation();
            this.m_animation.filters = [];
            this.m_animation.scaleX = 1.5;
            this.m_animation.scaleY = 1.5;
            this.m_animation.width = 160;
            this.m_animation.height = 160;
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
            let enemyInit = new EnemyInit();
            switch (enemyType) {
                case 1:
                    this.m_health = enemyInit.NormalEnemyHealth;
                    this.m_dmg = enemyInit.NormalEnemyDmg;
                    this.m_critical = enemyInit.NormalEnemyCritical;
                    this.m_criticalDmgMultiplier = enemyInit.NormalEnemyCriticalDmgMultiplier;
                    break;
                case 2:
                    this.m_health = enemyInit.ShieldEnemyHealth;
                    this.m_dmg = enemyInit.ShieldEnemyDmg;
                    this.m_critical = enemyInit.ShieldEnemyCritical;
                    this.m_criticalDmgMultiplier = enemyInit.ShieldEnemyCriticalDmgMultiplier;
                    break;
                case 3:
                    this.m_health = enemyInit.FastEnemyHealth;
                    this.m_dmg = enemyInit.FastEnemyDmg;
                    this.m_critical = enemyInit.FastEnemyCritical;
                    this.m_criticalDmgMultiplier = enemyInit.FastEnemyCriticalDmgMultiplier;
                    break;
                case 4:
                    this.m_health = enemyInit.NewbieEnemyHealth;
                    this.m_dmg = enemyInit.NewbieEnemyDmg;
                    this.m_critical = enemyInit.NewbieEnemyCritical;
                    this.m_criticalDmgMultiplier = enemyInit.NewbieEnemyCriticalDmgMultiplier;
                    break;
                default:
                    break;
            }
            this.m_maxHealth = this.m_health;
            this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
            this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
            this.m_script = this.m_animation.addComponent(Laya.Script);
            this.m_script.onUpdate = () => {
                this.enemyAIMain();
                this.checkPosition();
            };
            this.m_script.onTriggerEnter = (col) => {
                if (col.tag === 'Player') {
                }
            };
            this.m_collider.width = this.m_animation.width - 64;
            this.m_collider.height = this.m_animation.height - 20;
            this.m_collider.x = 0;
            this.m_collider.y = -10;
            this.m_collider.label = id;
            this.m_collider.tag = 'Enemy';
            this.m_collider.density = 300;
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
            if (amount <= 0) {
                this.m_state = EnemyStatus.idle;
                this.m_deadTimer = setInterval((() => {
                    if (this.m_animation.destroyed || !this.m_animation)
                        return;
                    this.m_animation.alpha -= 0.1;
                    if (this.m_animation.alpha <= 0) {
                        clearInterval(this.m_deadTimer);
                        this.destroy();
                        EnemyInit.enemyLeftCur--;
                        EnemyHandler.updateEnemies();
                    }
                }), 25);
                return;
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
        takeDamage(amount, criticalRate, criticalDmgRate) {
            if (this.m_animation.destroyed || amount <= 0 || !this.m_animation)
                return;
            let fakeNum = Math.random() * 100;
            let critical = (fakeNum <= criticalRate);
            this.delayMove(this.m_mdelay);
            amount *= critical ? criticalDmgRate : 1;
            amount = Math.round(amount);
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
                this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? -6.0 : 6.0, y: 0.0 };
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
            Laya.Tween.to(damageText, { alpha: 0.65, fontSize: damageText.fontSize + 50, y: damageText.y + 80, }, 650, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 130 }, 650, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { damageText.destroy(); }), 0);
            }), 0);
        }
        showHealth() {
            this.m_healthBar = new Laya.ProgressBar();
            this.m_healthBar.height = 10;
            this.m_healthBar.width = this.m_animation.width;
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
                this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) + 20, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
                this.m_healthBar.value = this.m_health / this.m_maxHealth;
            }), 10);
        }
        slashLightEffect(enemy) {
            let slashLightEffect = new Laya.Animation();
            let sourceArray = ["comp/NewSlahLight.atlas", "comp/NewSlashLight90.atlas", "comp/NewSlashLight-43.5.atlas"];
            let sourceNum = Math.floor(Math.random() * 3);
            slashLightEffect.scaleX = 2;
            slashLightEffect.scaleY = 2;
            slashLightEffect.interval = 15;
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 40, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashLightEffect.filters = [glowFilter, colorFilter];
            slashLightEffect.pos(this.m_isFacingRight ? enemy.x - 500 : enemy.x - 500, enemy.y - 500 + 30);
            slashLightEffect.source = sourceArray[sourceNum];
            slashLightEffect.alpha = 1;
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
                if (this.m_health <= 0)
                    return;
                if (this.m_moveDelayValue <= 0.0)
                    this.m_rigidbody.linearVelocity = { x: 0.0, y: 0.0 };
                this.tryAttack();
                this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer;
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
            let lastDirection = this.m_isFacingRight;
            this.m_animation.skewY = rightSide ? 0 : 180;
            this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false;
            if (lastDirection != this.m_isFacingRight) {
                this.m_rigidbody.linearVelocity.x = 0.0;
            }
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
            let atkCircleTempX = this.m_isFacingRight ? this.m_animation.x + this.m_animation.width / 2 - 5 : this.m_animation.x - 3 * this.m_animation.width / 2 + 50;
            let atkCircleTempY = this.m_animation.y - this.m_animation.height / 2 + 30;
            atkCircle.pos(atkCircleTempX, atkCircleTempY);
            let atkBoxCollider = atkCircle.addComponent(Laya.BoxCollider);
            let atkCircleRigid = atkCircle.addComponent(Laya.RigidBody);
            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
            atkCircleRigid.category = 8;
            atkCircleRigid.mask = 4;
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;
            this.updateAnimation(EnemyStatus.idle, EnemyStatus.attack);
            setTimeout(() => {
                Laya.stage.addChild(atkCircle);
                atkBoxCollider.tag = this.m_atkTag;
                this.m_atkTimer = 100;
            }, 500);
            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 600);
            setTimeout(() => {
                this.m_atkCd = true;
            }, 1000);
            if (!this.m_moveDelayTimer)
                this.delayMove(0.35);
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
                    this.m_moveDelayValue -= 0.01;
                }, 10);
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
            this.m_armor = 100;
            this.m_speed = 1.7;
            this.m_tag = 'n';
            this.m_attackRange = 100;
            this.m_mdelay = 0.1;
            this.m_atkTag = "EnemyNormalAttack";
        }
    }
    class Shield extends VirtualEnemy {
        constructor() {
            super(...arguments);
            this.m_name = '裝甲敵人';
            this.m_armor = 500;
            this.m_speed = 1.5;
            this.m_tag = 's';
            this.m_attackRange = 100;
            this.m_mdelay = 0.05;
            this.m_atkTag = "EnemyShieldAttack";
        }
    }
    class Fast extends VirtualEnemy {
        constructor() {
            super(...arguments);
            this.m_name = '快攻敵人';
            this.m_armor = 100;
            this.m_speed = 7;
            this.m_tag = 's';
            this.m_attackRange = 100;
            this.m_mdelay = 0.7;
            this.m_atkTag = "EnemyFastAttack";
        }
    }
    class Newbie extends VirtualEnemy {
        constructor() {
            super(...arguments);
            this.m_name = '新手敵人';
            this.m_armor = 100;
            this.m_speed = 3;
            this.m_tag = 's';
            this.m_attackRange = 100;
            this.m_mdelay = 1.5;
            this.m_atkTag = "EnemyNewbieAttack";
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
            enemy.spawn(player, id, point[randomPoint], enemyType);
            this.enemyPool.push({ '_id': id, '_ent': enemy });
            this.updateEnemies();
            console.log(this.enemyPool);
            return enemy;
        }
        static decideEnemyType(enemyType) {
            switch (enemyType) {
                case 1: return new Normal();
                case 2: return new Shield();
                case 3: return new Fast();
                case 4: return new Newbie();
                default: return new Normal();
            }
            ;
        }
        static updateEnemies() {
            return this.enemyPool = this.enemyPool.filter(data => data._ent.m_animation.destroyed === false);
        }
        static getEnemiesCount() {
            return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_animation.destroyed === false)).length;
        }
        static getEnemyByLabel(label) {
            return this.enemyPool.filter(data => data._id === label)[0]['_ent'];
        }
        static clearAllEnemy() {
            let aliveEnemy = EnemyHandler.enemyPool.filter(data => data._ent.m_animation != null);
            for (let i = 0; i < aliveEnemy.length; i++) {
                if (aliveEnemy[i]._ent.m_animation.destroyed)
                    return;
                aliveEnemy[i]._ent.m_animation.zOrder = -15;
                aliveEnemy[i]._ent.m_animation.destroy();
                aliveEnemy[i]._ent.m_animation.destroyed = true;
            }
            this.enemyPool = [];
        }
    }
    EnemyHandler.enemyIndex = 0;
    EnemyHandler.enemyPool = [];

    class BackToVillage extends Laya.Script {
        onKeyUp(e) {
            if (e.keyCode === 32) {
                Laya.Scene.load("Loading.scene");
                Laya.Scene.open("Village.scene", true);
                Laya.stage.x = Laya.stage.y = 0;
                Laya.SoundManager.stopAll();
                EnemyHandler.clearAllEnemy();
            }
        }
    }

    class SceneInit extends Laya.Script {
        constructor() {
            super();
            this.sceneBackgroundColor = '#4a4a4a';
            this.resourceLoad = ["Audio/Bgm/BGM1.wav", "font/silver.ttf", "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
                "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas",
                "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas",
                "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas", "ui/loading.png",
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

    class Loading extends Laya.Script {
        constructor() {
            super(...arguments);
            this.resourceLoad = ["Audio/Bgm/BGM1.wav", "font/silver.ttf", "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
                "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas",
                "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas",
                "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas", "ui/loading.png",
            ];
        }
        onStart() {
            Laya.loader.load(this.resourceLoad, Laya.Handler.create(this, () => {
                Laya.Scene.open("Village.scene");
            }));
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/BackToVillage.ts", BackToVillage);
            reg("script/SceneInit.ts", SceneInit);
            reg("script/EnemyInit.ts", EnemyInit);
            reg("script/CharacterInit.ts", CharacterInit);
            reg("script/SkillList.ts", SkillList);
            reg("script/Loading.ts", Loading);
            reg("script/Village.ts", Village);
        }
    }
    GameConfig.width = 1366;
    GameConfig.height = 768;
    GameConfig.scaleMode = "noscale";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Village.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
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
