(function () {
    'use strict';

    var OathStatus;
    (function (OathStatus) {
        OathStatus[OathStatus["normal"] = 0] = "normal";
        OathStatus[OathStatus["charge"] = 1] = "charge";
        OathStatus[OathStatus["overCharge"] = 2] = "overCharge";
    })(OathStatus || (OathStatus = {}));

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
                return;
            }
            else {
                ExtraData.currentData = {
                    "atkDmgLevel": 0,
                    "hpLevel": 0,
                    "gold": 0,
                    "crystal": 0,
                    "catSkill": 0,
                    "humanSkill": 0,
                    "catSkillLevel": 0,
                    "humanSkillLevel": 0,
                    "battleRound": 0,
                };
                ExtraData.saveData();
                return;
            }
        }
        static saveData() {
            let data = JSON.stringify(ExtraData.currentData);
            Laya.LocalStorage.setItem("gameData", data);
        }
        getJsonFromURL(url) {
            fetch(url).then(res => res.json()).then((out) => {
            }).catch(err => {
                throw err;
            });
        }
    }

    class ZOrderManager extends Laya.Script {
        constructor(parameters) {
            super();
        }
        static setZOrder(target, z) {
            target.zOrder = z;
            Laya.stage.updateZOrder();
        }
    }

    class Village extends Laya.Script {
        constructor() {
            super(...arguments);
            this.reinforceBtn = null;
            this.templeBtn = null;
            this.battleBtn = null;
            this.reinforceUI = null;
            this.reinforceGold = null;
            this.reinforceHpLevel = null;
            this.reinforceAtkDmgLevel = null;
            this.reinforceHpCost = null;
            this.reinforceAtkDmgCost = null;
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
        onKeyDown(e) {
        }
        onStart() {
            Village.updateData();
        }
        static updateData() {
            ExtraData.loadData();
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            Village.gold = data.gold;
            Village.hpLevel = data.hpLevel;
            Village.atkDmgLevel = data.atkDmgLevel;
            this.saveData();
        }
        showReinforceUI() {
            Village.updateData();
            this.setReinfoceUI();
            this.setReinfoceGoldValue();
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceHpLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceHpCost();
            this.setReinforceAtkDmgCostIcon();
            this.setReinforceHpCostIcon();
            this.setSkipIcon();
            Village.reinforceToggle = true;
        }
        clearReinforceUI() {
            if (Village.reinforceToggle) {
                Laya.stage.removeChild(this.reinforceUI);
                Laya.stage.removeChild(this.reinforceGold);
                Laya.stage.removeChild(this.reinforceAtkDmgLevel);
                Laya.stage.removeChild(this.reinforceHpLevel);
                Laya.stage.removeChild(this.reinforceAtkDmgCost);
                Laya.stage.removeChild(this.reinforceHpCost);
                Laya.stage.removeChild(this.reinforceAtkDmgCostIcon);
                Laya.stage.removeChild(this.reinforceHpCostIcon);
                Laya.stage.removeChild(this.skipIcon);
                this.reinforceUI.destroy();
                this.reinforceGold.destroy();
                this.reinforceAtkDmgLevel.destroy();
                this.reinforceHpLevel.destroy();
                this.reinforceAtkDmgCost.destroy();
                this.reinforceHpCost.destroy();
                this.reinforceAtkDmgCostIcon.destroy();
                this.reinforceHpCostIcon.destroy();
                this.skipIcon.destroy();
                this.reinforceUI = this.reinforceGold = this.reinforceAtkDmgLevel = this.reinforceHpLevel = this.reinforceAtkDmgCost
                    = this.reinforceHpCost = this.reinforceHpCostIcon = this.reinforceAtkDmgCostIcon =
                        this.skipIcon = null;
                this.missionManager.clearCurrentMissionData();
                this.missionManager.generateMissionData(9);
                this.missionManager.showMissionUI();
                Laya.SoundManager.stopAll();
                Village.reinforceToggle = false;
            }
        }
        setReinfoceUI() {
            Laya.stage.x = Laya.stage.y = 0;
            this.reinforceUI = new Laya.Sprite();
            this.reinforceUI.loadImage("UI/reinforce.png");
            this.reinforceUI.width = 700;
            this.reinforceUI.height = 400;
            this.reinforceUI.pos(333, 184);
            this.reinforceUI.alpha = 1;
            Laya.stage.addChild(this.reinforceUI);
            ZOrderManager.setZOrder(this.reinforceUI, 100);
        }
        setSkipIcon() {
            this.skipIcon = new Laya.Sprite();
            this.skipIcon.pos(this.reinforceUI.x + 281, this.reinforceUI.y + 353);
            this.skipIcon.loadImage('UI/skip.png');
            this.skipIcon.on(Laya.Event.MOUSE_OVER, this, () => {
                this.skipIcon.loadImage('UI/skip2.png');
            });
            this.skipIcon.on(Laya.Event.MOUSE_OUT, this, () => {
                this.skipIcon.loadImage('UI/skip.png');
            });
            this.skipIcon.on(Laya.Event.CLICK, this, () => {
                this.clearReinforceUI();
            });
            Laya.stage.addChild(this.skipIcon);
            ZOrderManager.setZOrder(this.skipIcon, 103);
        }
        setReinfoceGoldValue() {
            if (this.reinforceGold) {
                this.reinforceGold.text = '$' + String(Village.gold);
                return;
            }
            this.reinforceGold = new Laya.Text();
            this.reinforceGold.font = "silver";
            this.reinforceGold.fontSize = 70;
            this.reinforceGold.color = "#FEFFF7";
            this.reinforceGold.stroke = 3;
            this.reinforceGold.strokeColor = "#000";
            this.reinforceGold.text = '$' + String(Village.gold);
            this.reinforceGold.pos(333 + 520, 184 + 50);
            Laya.stage.addChild(this.reinforceGold);
            ZOrderManager.setZOrder(this.reinforceGold, 101);
        }
        setReinfoceAtkDmgLevel() {
            if (this.reinforceAtkDmgLevel) {
                this.reinforceAtkDmgLevel.text = ': ' + String(Village.atkDmgLevel);
                return;
            }
            this.reinforceAtkDmgLevel = new Laya.Text();
            this.reinforceAtkDmgLevel.font = "silver";
            this.reinforceAtkDmgLevel.fontSize = 70;
            this.reinforceAtkDmgLevel.color = "#FEFFF7";
            this.reinforceAtkDmgLevel.stroke = 3;
            this.reinforceAtkDmgLevel.strokeColor = "#000";
            this.reinforceAtkDmgLevel.text = ': ' + String(Village.atkDmgLevel);
            this.reinforceAtkDmgLevel.pos(333 + 255, 184 + 160);
            Laya.stage.addChild(this.reinforceAtkDmgLevel);
            ZOrderManager.setZOrder(this.reinforceAtkDmgLevel, 101);
        }
        setReinfoceHpLevel() {
            if (this.reinforceHpLevel) {
                this.reinforceHpLevel.text = ': ' + String(Village.hpLevel);
                return;
            }
            this.reinforceHpLevel = new Laya.Text();
            this.reinforceHpLevel.font = "silver";
            this.reinforceHpLevel.fontSize = 70;
            this.reinforceHpLevel.color = "#FEFFF7";
            this.reinforceHpLevel.stroke = 3;
            this.reinforceHpLevel.strokeColor = "#000";
            this.reinforceHpLevel.text = ': ' + String(Village.hpLevel);
            this.reinforceHpLevel.pos(333 + 255, 184 + 275);
            Laya.stage.addChild(this.reinforceHpLevel);
            ZOrderManager.setZOrder(this.reinforceHpLevel, 101);
        }
        setReinfoceAtkDmgCost() {
            if (this.reinforceAtkDmgCost) {
                this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel * 100);
                return;
            }
            this.reinforceAtkDmgCost = new Laya.Text();
            this.reinforceAtkDmgCost.font = "silver";
            this.reinforceAtkDmgCost.fontSize = 70;
            this.reinforceAtkDmgCost.color = "#fff";
            this.reinforceAtkDmgCost.stroke = 3;
            this.reinforceAtkDmgCost.strokeColor = "#000";
            this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel * 100);
            this.reinforceAtkDmgCost.pos(333 + 550, 184 + 160);
            Laya.stage.addChild(this.reinforceAtkDmgCost);
            ZOrderManager.setZOrder(this.reinforceAtkDmgCost, 101);
        }
        setReinfoceHpCost() {
            if (this.reinforceHpCost) {
                this.reinforceHpCost.text = '$' + String(Village.hpLevel * 100);
                return;
            }
            this.reinforceHpCost = new Laya.Text();
            this.reinforceHpCost.font = "silver";
            this.reinforceHpCost.fontSize = 70;
            this.reinforceHpCost.color = "#fff";
            this.reinforceHpCost.stroke = 3;
            this.reinforceHpCost.strokeColor = "#000";
            this.reinforceHpCost.text = '$' + String(Village.hpLevel * 100);
            this.reinforceHpCost.pos(333 + 550, 184 + 275);
            Laya.stage.addChild(this.reinforceHpCost);
            ZOrderManager.setZOrder(this.reinforceHpCost, 101);
        }
        setReinforceAtkDmgCostIcon() {
            this.reinforceAtkDmgCostIcon = new Laya.Sprite();
            this.reinforceAtkDmgCostIcon.pos(330 + 465, 184 + 162);
            this.reinforceAtkDmgCostIcon.loadImage('UI/arrP.png');
            this.reinforceAtkDmgCostIcon.alpha = 0.75;
            this.reinforceAtkDmgCostIcon.off(Laya.Event.CLICK, this, this.addAtkLevel);
            this.reinforceAtkDmgCostIcon.on(Laya.Event.MOUSE_OVER, this, () => {
                this.reinforceAtkDmgCostIcon.alpha = 1;
            });
            this.reinforceAtkDmgCostIcon.on(Laya.Event.MOUSE_OUT, this, () => {
                this.reinforceAtkDmgCostIcon.alpha = 0.75;
            });
            this.reinforceAtkDmgCostIcon.on(Laya.Event.CLICK, this, this.addAtkLevel);
            Laya.stage.addChild(this.reinforceAtkDmgCostIcon);
            ZOrderManager.setZOrder(this.reinforceAtkDmgCostIcon, 101);
        }
        setReinforceHpCostIcon() {
            this.reinforceHpCostIcon = new Laya.Sprite();
            this.reinforceHpCostIcon.pos(330 + 465, 184 + 275);
            this.reinforceHpCostIcon.loadImage('UI/arrR.png');
            this.reinforceHpCostIcon.alpha = 0.75;
            Laya.stage.addChild(this.reinforceHpCostIcon);
            ZOrderManager.setZOrder(this.reinforceHpCostIcon, 101);
            this.reinforceHpCostIcon.off(Laya.Event.CLICK, this, this.addHpLevel);
            this.reinforceHpCostIcon.off(Laya.Event.KEY_DOWN, this, this.addHpLevel);
            this.reinforceHpCostIcon.on(Laya.Event.MOUSE_OVER, this, () => {
                this.reinforceHpCostIcon.alpha = 1.0;
            });
            this.reinforceHpCostIcon.on(Laya.Event.MOUSE_OUT, this, () => {
                this.reinforceHpCostIcon.alpha = 0.75;
            });
            this.reinforceHpCostIcon.on(Laya.Event.CLICK, this, this.addHpLevel);
            this.reinforceHpCostIcon.on(Laya.Event.KEY_DOWN, this, (e) => {
                if (e.keyCode === 90) {
                    this.addAtkLevel();
                }
                else if (e.keyCode === 88) {
                    this.addHpLevel();
                }
            });
            Laya.stage.focus = this.reinforceHpCostIcon;
        }
        addAtkLevel() {
            if (Village.gold < Village.atkDmgLevel * 100) {
                return;
            }
            Village.gold -= Village.atkDmgLevel * 100;
            Village.atkDmgLevel++;
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceGoldValue();
            Village.saveData();
        }
        addHpLevel() {
            if (Village.gold < Village.hpLevel * 100) {
                return;
            }
            Village.gold -= Village.hpLevel * 100;
            Village.hpLevel++;
            this.setReinfoceHpLevel();
            this.setReinfoceHpCost();
            this.setReinfoceGoldValue();
            Village.saveData();
        }
        static saveData() {
            ExtraData.currentData['atkDmgLevel'] = Village.atkDmgLevel;
            ExtraData.currentData['hpLevel'] = Village.hpLevel;
            ExtraData.currentData['gold'] = Village.gold;
            ExtraData.saveData();
        }
    }
    Village.reinforceToggle = false;
    Village.isNewbie = true;

    class SceneDestroyer extends Laya.Script {
    }
    SceneDestroyer.wake = () => {
        let allScene = Laya.Scene.unDestroyedScenes;
        allScene.forEach((e) => {
            Laya.Scene.destroy(e.url);
        });
    };

    var step;
    (function (step) {
        step[step["first"] = 0] = "first";
        step[step["preScene1"] = 1] = "preScene1";
        step[step["preScene2"] = 2] = "preScene2";
    })(step || (step = {}));
    class Loading2 extends Laya.Script {
        constructor() {
            super(...arguments);
            this.preparedTimer = null;
            this.storyInfoCard = [
                '曾經有這麼一片森林－－它作物叢生，萬物繁榮，是人們賴以維生的『生命之林』。但如今，那裡只剩下會奪走生命的機械。',
                '其實貓貓邪神沒有必要是一隻貓，祂能以邪神之力變換成狗、人類、甚至是巨大的怪物……只不過祂習慣了，和祂平時追趕老鼠的行為一樣。',
                '人類最後的堡壘是一座城鎮，要是失去它，人們就無處可去了。',
                '機械士兵看起來相同，卻又不盡相同。就像每一個血肉生命，都有彼此的不同差異。',
                '獻祭值越多，貓貓邪神就會越興奮－－不過這對你的凡人之軀不一定是好事。',
                '珍惜你的劍，你已經沒有認識的朋友會鍛造武器了。',
                '有些時候比起戰鬥所受的傷，貓貓邪神坐在你頭上所造成的頸部損傷更加讓你痛苦不堪。但你別無他法，你絕不能開口提及祂的體重。',
                '『你應該要造一個神殿，祀奉貓貓邪神，供奉祂一些活祭品之類的喵。』',
                '『要是你膽敢對貓貓邪神的體重有意見，貓貓邪神會把你的頭扯下來喵。』',
                '『在戰鬥的時候你的動作應該要小一點，以免不小心把貓貓邪神甩下頭喵。』',
            ];
        }
        onKeyDown() {
            if (!this.prepared)
                return;
            Laya.stage.removeChild(this.storyInfo);
            Laya.stage.removeChild(this.loadingProgress);
            Laya.stage.removeChild(this.anyKeyIcon);
            this.storyInfo.destroy();
            this.loadingProgress.destroy();
            this.anyKeyIcon.destroy();
            SceneDestroyer.wake();
            Laya.Scene.open(Loading2.nextSceneName);
        }
        onStart() {
            this.prepared = false;
            this.preparedSeconds = 2.5;
            this.setStoryInfoCard();
            this.setProgressBar();
            this.setAnyKeyIcon();
            Laya.stage.on(Laya.Event.CLICK, this, () => {
                if (!this.prepared)
                    return;
                Laya.stage.removeChild(this.storyInfo);
                Laya.stage.removeChild(this.loadingProgress);
                Laya.stage.removeChild(this.anyKeyIcon);
                this.storyInfo.destroy();
                this.loadingProgress.destroy();
                this.anyKeyIcon.destroy();
                SceneDestroyer.wake();
                Laya.Scene.open(Loading2.nextSceneName);
            });
            this.preparedTimer = setInterval(() => {
                if (this.preparedSeconds <= 0) {
                    this.prepared = true;
                    this.anyKeyIcon.visible = true;
                    clearInterval(this.preparedTimer);
                    Laya.Tween.to(this.anyKeyIcon, {
                        alpha: 1,
                    }, 300, Laya.Ease.linearInOut);
                    return;
                }
                this.preparedSeconds -= 0.5;
                Laya.Tween.to(this.loadingProgress, {
                    value: this.loadingProgress.value + 0.2,
                }, 400, Laya.Ease.linearInOut);
            }, 500);
        }
        setProgressBar() {
            this.loadingProgress = new Laya.ProgressBar("comp/prog.png");
            this.loadingProgress.size(700, 20);
            this.loadingProgress.sizeGrid = "0,10,0,10";
            this.loadingProgress.pos(338, 510);
            this.loadingProgress.value = 0.0;
            Laya.stage.addChild(this.loadingProgress);
            ZOrderManager.setZOrder(this.loadingProgress, 101);
        }
        setStoryInfoCard() {
            let randomCard = Math.floor(Math.random() * this.storyInfoCard.length);
            this.storyInfo = new Laya.Text();
            this.storyInfo.text = this.storyInfoCard[randomCard];
            this.storyInfo.color = "#fff";
            this.storyInfo.stroke = 4;
            this.storyInfo.strokeColor = "#000";
            this.storyInfo.font = "silver";
            this.storyInfo.fontSize = 40;
            this.storyInfo.wordWrap = true;
            this.storyInfo.size(837, 180);
            this.storyInfo.pos(267, 230);
            Laya.stage.addChild(this.storyInfo);
            ZOrderManager.setZOrder(this.storyInfo, 101);
        }
        setAnyKeyIcon() {
            this.anyKeyIcon = new Laya.Sprite();
            this.anyKeyIcon.loadImage('UI/anykey.png');
            this.anyKeyIcon.pos(587, 420);
            this.anyKeyIcon.alpha = 0;
            this.anyKeyIcon.visible = false;
            Laya.stage.addChild(this.anyKeyIcon);
            ZOrderManager.setZOrder(this.anyKeyIcon, 102);
        }
    }

    class SceneInit extends Laya.Script {
        constructor() {
            super();
            this.sceneBackgroundColor = '#4a4a4a';
        }
        onAwake() {
            Laya.stage.bgColor = this.sceneBackgroundColor;
            this.setMusic(0.6, "Audio/Bgm/BGM01.mp3", 0);
        }
        setMusic(volume, url, loop) {
            Laya.SoundManager.playMusic(url, loop);
            Laya.SoundManager.setMusicVolume(volume);
        }
    }

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
        firstEnter() {
            MissionManager.missionDataPool = [];
            this.generateNewbieData();
            this.sendMissionData(MissionManager.missionDataPool[0]);
        }
        showMissionUI() {
            this.missionUI = new Laya.Sprite();
            this.missionUI.loadImage("UI/chioce_mission.png");
            this.missionUI.width = 1024;
            this.missionUI.height = 576;
            this.missionUI.pos(171, 96);
            this.missionUI.alpha = 1;
            Laya.stage.addChild(this.missionUI);
            ZOrderManager.setZOrder(this.missionUI, 100);
            if (Village.isNewbie) {
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
                    ZOrderManager.setZOrder(this.eliteIcons[i], 101);
                }
                for (let i = 0; i < this.difficultyIcons.length; i++) {
                    Laya.stage.addChild(this.difficultyIcons[i]);
                    ZOrderManager.setZOrder(this.difficultyIcons[i], 101);
                }
                for (let i = 0; i < this.crystalNums.length; i++) {
                    Laya.stage.addChild(this.crystalNums[i]);
                    ZOrderManager.setZOrder(this.crystalNums[i], 101);
                }
                for (let i = 0; i < this.moneyNums.length; i++) {
                    Laya.stage.addChild(this.moneyNums[i]);
                    ZOrderManager.setZOrder(this.moneyNums[i], 101);
                }
                for (let i = 0; i < this.confirmIcons.length; i++) {
                    Laya.stage.addChild(this.confirmIcons[i]);
                    ZOrderManager.setZOrder(this.confirmIcons[i], 101);
                }
            }
        }
        clearMissionUI() {
            for (let i = 0; i < this.eliteIcons.length; i++) {
                Laya.stage.removeChild(this.eliteIcons[i]);
                this.eliteIcons[i].destroy();
                this.eliteIcons[i] = null;
            }
            for (let i = 0; i < this.difficultyIcons.length; i++) {
                Laya.stage.removeChild(this.difficultyIcons[i]);
                this.difficultyIcons[i].destroy();
                this.difficultyIcons[i] = null;
            }
            for (let i = 0; i < this.crystalNums.length; i++) {
                Laya.stage.removeChild(this.crystalNums[i]);
                this.crystalNums[i].destroy();
                this.crystalNums[i] = null;
            }
            for (let i = 0; i < this.moneyNums.length; i++) {
                Laya.stage.removeChild(this.moneyNums[i]);
                this.moneyNums[i].destroy();
                this.moneyNums[i] = null;
            }
            for (let i = 0; i < this.confirmIcons.length; i++) {
                Laya.stage.removeChild(this.confirmIcons[i]);
                this.confirmIcons[i].destroy();
                this.confirmIcons[i] = null;
            }
            Laya.stage.removeChild(this.missionUI);
            this.missionUI.destroy();
            this.missionUI = null;
        }
        sendMissionData(data) {
            EnemyInit.missionEnemyNum = data["enemyNum"];
            EnemyInit.missionRewardCrystalValue = data["crystal"];
            EnemyInit.missionRewardGoldValue = data["money"];
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
            confirmIcon.pos(171 + 173 + col * (256 + 34), 458 + 96);
            let switchSceneFunc = () => {
                console.log('任務執行一次');
                if (Village.isNewbie) {
                    Loading2.nextSceneName = 'Newbie_scroll.scene';
                    Laya.Scene.open('Loading2.scene', true);
                }
                else {
                    let x = Math.round(Math.random());
                    if (x > 0.5) {
                        Laya.Scene.destroy;
                        Loading2.nextSceneName = 'First_scroll.scene';
                        SceneInit.currentMap = "RedForest";
                        CharacterInit.playerEnt.clearBackground();
                        Laya.Scene.open('Loading2.scene');
                    }
                    else {
                        Loading2.nextSceneName = 'Town_scroll.scene';
                        SceneInit.currentMap = "Town";
                        CharacterInit.playerEnt.clearBackground();
                        Laya.Scene.open('Loading2.scene');
                    }
                }
            };
            let confirmFunc = () => {
                this.clearMissionUI();
                this.sendMissionData(data);
                switchSceneFunc();
            };
            switch (col) {
                case 0:
                    confirmIcon.loadImage("UI/Zbtn.png");
                    break;
                case 1:
                    confirmIcon.loadImage("UI/Xbtn.png");
                    break;
                case 2:
                    confirmIcon.loadImage("UI/Cbtn.png");
                    break;
                default:
                    break;
            }
            confirmIcon.on(Laya.Event.MOUSE_MOVE, this, () => {
                confirmIcon.alpha = 0.5;
            });
            confirmIcon.on(Laya.Event.MOUSE_OUT, this, () => {
                confirmIcon.alpha = 1;
            });
            confirmIcon.off(Laya.Event.CLICK, this, confirmFunc);
            confirmIcon.off(Laya.Event.KEY_DOWN, this, confirmFunc);
            confirmIcon.on(Laya.Event.CLICK, this, confirmFunc);
            confirmIcon.on(Laya.Event.KEY_DOWN, this, (e) => {
                if (e.keyCode === 90 || e.keyCode === 88 || e.keyCode === 67) {
                    confirmFunc();
                }
            });
            Laya.stage.focus = confirmIcon;
            this.confirmIcons.push(confirmIcon);
        }
        generateMissionData(total) {
            for (let i = 0; i < total; i++) {
                if (i < total / 3)
                    this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 105);
                if (i >= total / 3 && i < total * 2 / 3)
                    this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 55);
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
                    crystal: 0,
                    money: Math.round(500 + 500 * (1 + this.missionDifficultyArr[i] / 90)),
                    map: "forest",
                };
                MissionManager.missionDataPool.push(missionData);
            }
            return MissionManager.missionDataPool;
        }
        clearCurrentMissionData() {
            MissionManager.missionDataPool = [];
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
                crystal: 1300,
                money: 500,
                map: "forest",
            };
            MissionManager.missionDataPool.push(missionData);
            return MissionManager.missionDataPool;
        }
    }
    MissionManager.missionRound = 0;
    MissionManager.missionDataPool = [];
    MissionManager.hasSetBtn = false;

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
            roarText.pos(pos['x'] - 10, pos['y'] - 200);
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
            roarText.strokeColor = "#fff";
            roarText.stroke = 3;
            Laya.stage.addChild(roarText);
            ZOrderManager.setZOrder(roarText, 80);
            Laya.Tween.to(roarText, { alpha: 0.55, fontSize: roarText.fontSize + 30, }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(roarText, { alpha: 0, fontSize: roarText.fontSize - 18, y: roarText.y - 50 }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.stage.removeChild(roarText);
                    roarText.destroy();
                }), 0);
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
            }, 1000);
        }
        setSound(volume, url, loop) {
            Laya.SoundManager.playSound(url, loop);
            Laya.SoundManager.setSoundVolume(volume, url);
        }
    }

    class Slam extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '猛擊';
            this.m_info = '強大的範圍傷害';
            this.m_cost = 50;
            this.m_id = 1;
            this.m_cd = 3;
            this.m_iconA = "UI/icon/slamA.png";
            this.m_iconB = "UI/icon/slamB.png";
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
            this.m_animation.filters = [colorFilter];
            this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            });
            Laya.stage.addChild(this.m_animation);
            ZOrderManager.setZOrder(this.m_animation, 60);
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
            this.setSound(0.6, 'Audio/Misc/cat.mp3', 1);
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
            this.m_iconA = "UI/icon/blackholeA.png";
            this.m_iconB = "UI/icon/blackholeB.png";
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
            explosion.filters = [colorFilter];
            let count = 0;
            let timer = setInterval(() => {
                if (count >= this.m_lastTime * 1000) {
                    Laya.stage.addChild(explosion);
                    ZOrderManager.setZOrder(explosion, 60);
                    explosion.play();
                    owner.setCameraShake(100, 12);
                    setTimeout(() => {
                        Laya.stage.removeChild(explosion);
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
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
            }, this.m_lastTime * 1000);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
            Laya.stage.addChild(this.m_animation);
            ZOrderManager.setZOrder(this.m_animation, 60);
            this.m_animation.play();
            this.updateCdTimer();
            this.setSound(0.6, 'Audio/Misc/blackhole.wav', 1);
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
            this.m_id = 3;
            this.m_cd = 15;
            this.m_lastTime = 2;
            this.m_radius = 100;
            this.m_iconA = "UI/icon/blackholeA.png";
            this.m_iconB = "UI/icon/blackholeB.png";
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
                    ZOrderManager.setZOrder(explosion, 60);
                    explosion.play();
                    owner.setCameraShake(100, 12);
                    setTimeout(() => {
                        Laya.stage.removeChild(explosion);
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
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
            }, this.m_lastTime * 1000);
            setTimeout(() => {
                this.m_canUse = true;
            }, this.m_cd * 1000);
            Laya.stage.addChild(this.m_animation);
            ZOrderManager.setZOrder(this.m_animation, 60);
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
    class None extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '無';
            this.m_info = '無';
            this.m_damage = 0;
            this.m_cost = 0;
            this.m_id = 0;
            this.m_cd = 0;
            this.m_iconA = "";
            this.m_iconB = "";
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
            this.m_iconA = "UI/icon/spikeA.png";
            this.m_iconB = "UI/icon/spikeB.png";
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
            this.m_animation.scaleX = 1.2;
            this.m_animation.scaleY = 1.2;
            this.m_animation.interval = 35;
            this.m_animation.alpha = 0.45;
            this.m_animation.pos(rightSide ? position['x'] - 520 : position['x'] + 500, position['y'] - 300);
            let offsetX = rightSide ? position['x'] : position['x'] - this.m_animation.width;
            let offsetY = position['y'] - this.m_animation.height / 2 + 20;
            this.m_animation.source = "comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
            this.m_animation.autoPlay = true;
            this.m_animation.interval = 20;
            this.castRoar(position);
            let colorMat = [
                1, 1, 3, 0, -100,
                0, 2, 1, 0, -100,
                2, 0, 3, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [colorFilter];
            this.m_animation.skewY = rightSide ? 0 : 180;
            owner.delayMove(this.m_lastTime);
            owner.m_rigidbody.linearVelocity = { x: rightSide ? this.m_spikeVec : -this.m_spikeVec };
            owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 150);
            owner.hurtedEvent(2.0);
            this.attackRangeCheck(owner, {
                "x0": offsetX,
                "x1": offsetX + this.m_animation.width,
                "y0": offsetY,
                "y1": offsetY + this.m_animation.height,
            });
            Laya.stage.addChild(this.m_animation);
            ZOrderManager.setZOrder(this.m_animation, 60);
            setTimeout(() => {
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            }, 200);
            setTimeout(() => {
                this.m_canUse = true;
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
                e._ent.delayMove(0.05);
                e._ent.m_rigidbody.linearVelocity = { x: rightSide ? this.m_spikeVec / 3 : -this.m_spikeVec / 3 };
            });
        }
    }
    class Behead extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '攻其不備';
            this.m_info = '製造破綻，瞬移並攻擊隨機敵人';
            this.m_cost = 10;
            this.m_id = 2;
            this.m_cd = 3;
            this.m_iconA = "UI/icon/beheadA.png";
            this.m_iconB = "UI/icon/beheadB.png";
            this.m_preTime = 0.2;
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
            ZOrderManager.setZOrder(this.m_animation, 5);
            this.castRoar(position);
            if (owner.m_moveDelayValue <= 0)
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
            this.m_animation.filters = [colorFilter, glowFilter];
            this.m_animation.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
            });
            Laya.stage.addChild(this.m_animation);
            ZOrderManager.setZOrder(this.m_animation, 60);
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
            if (enemy.length === 0 || (enemy[targetEnemy]._ent.m_animation.x <= 300 || enemy[targetEnemy]._ent.m_animation.x > 3800)) {
                return;
            }
            owner.m_animation.x = enemy[targetEnemy]._ent.m_animation.x + (enemy[targetEnemy]._ent.m_animation.skewY === 0 ? -50 : 50);
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
            ZOrderManager.setZOrder(slash, 5);
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
                Laya.stage.removeChild(slash);
                slash.destroy();
                slash.destroyed = true;
            });
            Laya.stage.addChild(slash);
            ZOrderManager.setZOrder(slash, 60);
        }
    }
    class None$1 extends VirtualSkill {
        constructor() {
            super(...arguments);
            this.m_name = '無';
            this.m_info = '無';
            this.m_damage = 0;
            this.m_cost = 0;
            this.m_id = 0;
            this.m_cd = 0;
            this.m_iconA = "";
            this.m_iconB = "";
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
            this.NewbieEnemyHealth = 1000;
            this.NewbieEnemyDmg = 1;
            this.NewbieEnemyCritical = 20;
            this.NewbieEnemyCriticalDmgMultiplier = 0;
            this.roundDetectTimer = null;
            this.generateTimer = null;
            this.battleToggle = true;
            this.battleTimer = null;
            this.endingRewardUIToggle = false;
            this.endingSkillUIToggle = false;
            this.rewardGoldValue = 500;
            this.rewardCrystalValue = 100;
            this.villageManager = new Village();
            this.missionManager = new MissionManager();
        }
        onAwake() {
            this.updateMissionData();
        }
        onUpdate() {
        }
        onStart() {
            this.timeLeftValue = this.roundTimeLeft;
            EnemyInit.enemyLeftCur = this.enemyLeft;
            let player = CharacterInit.playerEnt.m_animation;
            let enemy = EnemyHandler.enemyPool;
            EnemyInit.isWin = false;
            this.generateTimer = setInterval(() => {
                if (player.destroyed) {
                    EnemyHandler.clearAllEnemy();
                    clearInterval(this.generateTimer);
                    this.generateTimer = null;
                    return;
                }
                if (this.enemyLeft <= 0 || EnemyInit.isWin) {
                    clearInterval(this.generateTimer);
                    this.generateTimer = null;
                    return;
                }
                if (EnemyHandler.getEnemiesCount() >= 10)
                    return;
                let x = Math.floor(Math.random() * 3) + 1;
                if (Village.isNewbie) {
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
                if ((EnemyInit.enemyLeftCur <= 0 && !Village.isNewbie) || (Village.isNewbie && EnemyInit.newbieDone)) {
                    this.battleToggle = false;
                    Village.isNewbie = false;
                    EnemyInit.newbieDone = false;
                    EnemyInit.isWin = true;
                    CharacterInit.playerEnt.clearAddDebuffTimer();
                    CharacterInit.playerEnt.removeAllDebuff();
                    Laya.Tween.to(player, { alpha: 0.8 }, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                        this.showEndRewardUI();
                    }), 0);
                    clearInterval(this.battleTimer);
                    this.battleTimer = null;
                    CharacterInit.playerEnt.m_rigidbody.linearVelocity = { x: 0, y: 0 };
                    EnemyHandler.clearAllEnemy();
                    return;
                }
                this.timeLeftValue--;
            }, 1000);
            this.showBattleInfo();
            if (Laya.Browser.onMobile) {
                this.mobileClick();
            }
        }
        mobileClick() {
            let mobileAtkBtnConfirmFunc = function () {
                let player = CharacterInit.playerEnt;
                if (Village.reinforceToggle) {
                    this.villageManager.clearReinforceUI();
                }
                if (this.endingRewardUIToggle) {
                    Laya.Tween.to(this.endingRewardUI, { alpha: 0.0 }, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                        this.clearEndRewardUI();
                        this.showEndSkillUI();
                    }), 0);
                }
                ;
                if (this.endingSkillUIToggle) {
                    if (player.m_isFacingRight) {
                        this.skillChoose(2);
                    }
                    else {
                        this.skillChoose(1);
                    }
                    if (!this.endingSkillUIToggle) {
                        this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                        this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                        this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                        this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                    }
                }
            };
            let mobileMoveBtnChooseFunc = function () {
                if (this.endingSkillUI) {
                    let player = CharacterInit.playerEnt;
                    if (!this.endingSkillUI.destroyed) {
                        this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                        this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                        this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                        this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                    }
                }
            };
            CharacterInit.playerEnt.m_mobileAtkBtn.off(Laya.Event.CLICK, this, mobileAtkBtnConfirmFunc);
            CharacterInit.playerEnt.m_mobileLeftBtn.off(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
            CharacterInit.playerEnt.m_mobileRightBtn.off(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
            CharacterInit.playerEnt.m_mobileAtkBtn.on(Laya.Event.CLICK, this, mobileAtkBtnConfirmFunc);
            CharacterInit.playerEnt.m_mobileLeftBtn.on(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
            CharacterInit.playerEnt.m_mobileRightBtn.on(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
        }
        onKeyUp(e) {
            let player = CharacterInit.playerEnt;
            if (Village.reinforceToggle && e.keyCode === 32) {
                this.villageManager.clearReinforceUI();
            }
            if (this.endingRewardUIToggle && e.keyCode === 32) {
                Laya.Tween.to(this.endingRewardUI, { alpha: 0.3 }, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    this.clearEndRewardUI();
                    this.showEndSkillUI();
                }), 0);
            }
            ;
            if (this.endingSkillUIToggle) {
                if (e.keyCode === 32) {
                    if (player.m_isFacingRight) {
                        this.skillChoose(2);
                    }
                    else {
                        this.skillChoose(1);
                    }
                }
                this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
            }
        }
        endTheBattle() {
            this.battleToggle = false;
            Village.isNewbie = false;
            EnemyInit.isWin = true;
            CharacterInit.playerEnt.clearAddDebuffTimer();
            CharacterInit.playerEnt.removeAllDebuff();
            Laya.Tween.to(CharacterInit.playerEnt.m_animation, { alpha: 0.8 }, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                this.showEndRewardUI();
            }), 0);
            clearInterval(this.battleTimer);
            this.battleTimer = null;
            CharacterInit.playerEnt.m_rigidbody.linearVelocity = { x: 0, y: 0 };
        }
        showEndSkillUI() {
            if (this.endingSkillUIToggle)
                return;
            let player = CharacterInit.playerEnt;
            this.endingSkillUIToggle = true;
            this.endingSkillUI = Laya.Pool.getItemByClass("endingSkillUI", Laya.Sprite);
            this.endingSkillUI.width = 684;
            this.endingSkillUI.height = 576;
            this.endingSkillUI.loadImage('UI/ending/chooseSkill.png');
            this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.m_animation.x - 325), 30);
            this.endingSkillUI.alpha = 0.5;
            player.m_animation.pos(this.endingSkillUI.x + this.endingSkillUI.width / 2, player.m_animation.y);
            let pos = {
                'x': this.endingSkillUI.x,
                'y': this.endingSkillUI.y,
            };
            this.skillCat = Laya.Pool.getItemByClass("skillCat", Laya.Sprite);
            this.skillHuman = Laya.Pool.getItemByClass("skillHuman", Laya.Sprite);
            this.skillCat.width = this.skillHuman.width = 130;
            this.skillCat.height = this.skillHuman.height = 130;
            this.skillCat.pos(pos['x'] + 136, pos['y'] + 140);
            this.skillHuman.pos(pos['x'] + 418, pos['y'] + 140);
            this.skillCat.loadImage('UI/ending/skillBox.png');
            this.skillHuman.loadImage('UI/ending/skillBox.png');
            this.r1 = Math.floor(Math.random() * 2);
            this.r2 = Math.floor(Math.random() * 2);
            this.skillCatIcon = Laya.Pool.getItemByClass("skillCatIcon", Laya.Sprite);
            this.skillHumanIcon = Laya.Pool.getItemByClass("skillHumanIcon", Laya.Sprite);
            this.skillCatIcon.width = this.skillHumanIcon.width = 100;
            this.skillCatIcon.height = this.skillHumanIcon.height = 100;
            this.skillCatIcon.pos(this.skillCat.x + 15, this.skillCat.y + 15);
            this.skillHumanIcon.pos(this.skillHuman.x + 15, this.skillHuman.y + 15);
            this.skillCatIcon.loadImage(SkillList.catSkillList[this.r1].m_iconB);
            this.skillHumanIcon.loadImage(SkillList.humanSkillList[this.r2].m_iconB);
            this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
            this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
            this.skillCatInfo = Laya.Pool.getItemByClass("skillCatInfo", Laya.Sprite);
            this.skillHumanInfo = Laya.Pool.getItemByClass("skillHumanInfo", Laya.Sprite);
            this.skillCatInfo.width = this.skillHumanInfo.width = 205;
            this.skillCatInfo.height = this.skillHumanInfo.height = 110;
            this.skillCatInfo.pos(pos['x'] + 96, pos['y'] + 402);
            this.skillHumanInfo.pos(pos['x'] + 383, pos['y'] + 402);
            this.skillCatInfo.loadImage("UI/ending/infoBox.png");
            this.skillHumanInfo.loadImage("UI/ending/infoBox.png");
            this.skillCatInfoText = Laya.Pool.getItemByClass("skillCatInfoText", Laya.Text);
            this.skillHumanInfoText = Laya.Pool.getItemByClass("skillHumanInfoText", Laya.Text);
            this.catSkillName = Laya.Pool.getItemByClass("catSkillName", Laya.Text);
            this.humanSkillName = Laya.Pool.getItemByClass("humanSkillName", Laya.Text);
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
            this.skillCatInfoText.fontSize = this.skillHumanInfoText.fontSize = this.catSkillName.fontSize = this.humanSkillName.fontSize = 32;
            this.skillCatInfoText.wordWrap = this.skillHumanInfoText.wordWrap = true;
            this.leftArrow = Laya.Pool.getItemByClass("leftArrow", Laya.Sprite);
            this.rightArrow = Laya.Pool.getItemByClass("rightArrow", Laya.Sprite);
            this.leftArrow.pos(pos['x'] + 175, pos['y'] + 340);
            this.rightArrow.pos(pos['x'] + 457, pos['y'] + 340);
            this.leftArrow.loadImage('UI/leftArr.png');
            this.rightArrow.loadImage('UI/rightArr.png');
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
            ZOrderManager.setZOrder(this.endingSkillUI, 100);
            ZOrderManager.setZOrder(this.skillCat, 101);
            ZOrderManager.setZOrder(this.skillHuman, 101);
            ZOrderManager.setZOrder(this.skillCatIcon, 103);
            ZOrderManager.setZOrder(this.skillHumanIcon, 103);
            ZOrderManager.setZOrder(this.skillCatInfo, 103);
            ZOrderManager.setZOrder(this.skillHumanInfo, 103);
            ZOrderManager.setZOrder(this.skillCatInfoText, 104);
            ZOrderManager.setZOrder(this.skillHumanInfoText, 104);
            ZOrderManager.setZOrder(this.catSkillName, 103);
            ZOrderManager.setZOrder(this.humanSkillName, 103);
            ZOrderManager.setZOrder(this.leftArrow, 103);
            ZOrderManager.setZOrder(this.rightArrow, 103);
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
            this.clearEndSkillUI();
            CharacterInit.playerEnt.resetMobileBtnEvent();
            this.unsetCharacter();
        }
        unsetCharacter() {
            let player = CharacterInit.playerEnt.m_animation;
            Laya.Tween.to(player, { alpha: 0.0 }, 2500, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.stage.removeChild(player);
                player.destroy();
                player.destroyed = true;
                CharacterInit.generated = false;
                this.villageManager.showReinforceUI();
            }), 0);
        }
        showEndRewardUI() {
            let player = CharacterInit.playerEnt.m_animation;
            this.endingRewardUIToggle = true;
            this.endingRewardUI = Laya.Pool.getItemByClass("endingRewardUI", Laya.Sprite);
            this.endingRewardUI.width = 342;
            this.endingRewardUI.height = 288;
            this.endingRewardUI.alpha = 1;
            this.endingRewardUI.loadImage('UI/ending/ending.png');
            this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);
            let pos = {
                'x': this.endingRewardUI.x,
                'y': this.endingRewardUI.y,
            };
            this.rewardCrystal = Laya.Pool.getItemByClass("rewardCrystal", Laya.Sprite);
            this.rewardGold = Laya.Pool.getItemByClass("rewardGold", Laya.Sprite);
            this.rewardCrystalText = Laya.Pool.getItemByClass("rewardCrystalText", Laya.Text);
            this.rewardGoldText = Laya.Pool.getItemByClass("rewardGoldText", Laya.Text);
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
            this.rewardCrystal.loadImage('UI/ending/crystal.png');
            this.rewardGold.loadImage('UI/ending/gold.png');
            Laya.stage.addChild(this.endingRewardUI);
            Laya.stage.addChild(this.rewardCrystal);
            Laya.stage.addChild(this.rewardGold);
            Laya.stage.addChild(this.rewardCrystalText);
            Laya.stage.addChild(this.rewardGoldText);
            ZOrderManager.setZOrder(this.endingRewardUI, 100);
            ZOrderManager.setZOrder(this.rewardCrystal, 101);
            ZOrderManager.setZOrder(this.rewardGold, 101);
            ZOrderManager.setZOrder(this.rewardCrystalText, 102);
            ZOrderManager.setZOrder(this.rewardGoldText, 102);
            this.endingUpdateData();
        }
        clearEndRewardUI() {
            this.endingRewardUIToggle = false;
            Laya.stage.removeChild(this.endingRewardUI);
            Laya.stage.removeChild(this.rewardCrystal);
            Laya.stage.removeChild(this.rewardGold);
            Laya.stage.removeChild(this.rewardCrystalText);
            Laya.stage.removeChild(this.rewardGoldText);
            Laya.Pool.recover("endingRewardUI", this.endingRewardUI);
            Laya.Pool.recover("rewardCrystal", this.rewardCrystal);
            Laya.Pool.recover("rewardGold", this.rewardGold);
            Laya.Pool.recover("rewardCrystalText", this.rewardCrystalText);
            Laya.Pool.recover("rewardGoldText", this.rewardGoldText);
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
            this.enemyLeftIcon.loadImage('UI/skull.png');
            this.enemyLeftIcon.width = 30;
            this.enemyLeftIcon.height = 40;
            Laya.stage.addChild(this.enemyInfo);
            Laya.stage.addChild(this.enemyLeftIcon);
            ZOrderManager.setZOrder(this.enemyInfo, 105);
            ZOrderManager.setZOrder(this.enemyLeftIcon, 105);
            let roundDetectFunc = function () {
                if (!this.battleToggle || player.destroyed) {
                    this.enemyInfo.text = "";
                    Laya.stage.removeChild(this.enemyInfo);
                    Laya.stage.removeChild(this.enemyLeftIcon);
                    this.enemyInfo.destroy();
                    this.enemyLeftIcon.destroy();
                    Laya.timer.clear(this, roundDetectFunc);
                    this.roundDetectTimer = null;
                    return;
                }
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.enemyLeftIcon.pos(player.x - 50, 100);
                }
                if (Laya.stage.x >= -250) {
                    this.enemyLeftIcon.pos(935 - 50, 100);
                }
                if (Laya.stage.x <= -2475) {
                    this.enemyLeftIcon.pos(3155 - 50, 100);
                }
                this.enemyInfo.pos(this.enemyLeftIcon.x + 44, this.enemyLeftIcon.y - 2);
                this.enemyInfo.text = (EnemyInit.enemyLeftCur === 0) ? '' : 'x' + String(EnemyInit.enemyLeftCur);
                this.enemyLeftIcon.alpha = (EnemyInit.enemyLeftCur === 0) ? 0 : 1;
            };
            Laya.timer.frameLoop(1, this, roundDetectFunc);
        }
        updateMissionData() {
            this.enemyLeft = EnemyInit.missionEnemyNum;
            this.rewardCrystalValue = EnemyInit.missionRewardCrystalValue;
            this.rewardGoldValue = EnemyInit.missionRewardGoldValue;
        }
        endingUpdateData() {
            let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
            ExtraData.currentData['gold'] = data.gold + this.rewardGoldValue;
            ExtraData.saveData();
        }
        changeToVillage() {
            EnemyHandler.clearAllEnemy();
            Laya.Scene.open("Village.scene", true);
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
        }
        clearEndSkillUI() {
            this.endingSkillUIToggle = false;
            Laya.stage.removeChild(this.endingSkillUI);
            Laya.stage.removeChild(this.skillCat);
            Laya.stage.removeChild(this.skillHuman);
            Laya.stage.removeChild(this.skillCatIcon);
            Laya.stage.removeChild(this.skillHumanIcon);
            Laya.stage.removeChild(this.skillCatInfo);
            Laya.stage.removeChild(this.skillHumanInfo);
            Laya.stage.removeChild(this.skillCatInfoText);
            Laya.stage.removeChild(this.skillHumanInfoText);
            Laya.stage.removeChild(this.catSkillName);
            Laya.stage.removeChild(this.humanSkillName);
            Laya.stage.removeChild(this.leftArrow);
            Laya.stage.removeChild(this.rightArrow);
            Laya.Pool.recover("endingSkillUI", this.endingSkillUI);
            Laya.Pool.recover("skillCat", this.skillCat);
            Laya.Pool.recover("skillHuman", this.skillHuman);
            Laya.Pool.recover("skillCatIcon", this.skillCatIcon);
            Laya.Pool.recover("skillHumanIcon", this.skillHumanIcon);
            Laya.Pool.recover("skillCatInfo", this.skillCatInfo);
            Laya.Pool.recover("skillHumanInfo", this.skillHumanInfo);
            Laya.Pool.recover("skillCatInfoText", this.skillCatInfoText);
            Laya.Pool.recover("skillHumanInfoText", this.skillHumanInfoText);
            Laya.Pool.recover("catSkillName", this.catSkillName);
            Laya.Pool.recover("humanSkillName", this.humanSkillName);
            Laya.Pool.recover("leftArrow", this.leftArrow);
            Laya.Pool.recover("rightArrow", this.rightArrow);
        }
    }
    EnemyInit.enemyLeftCur = 0;

    var turtorialHintStep;
    (function (turtorialHintStep) {
        turtorialHintStep[turtorialHintStep["none"] = 0] = "none";
        turtorialHintStep[turtorialHintStep["tryMove"] = 1] = "tryMove";
        turtorialHintStep[turtorialHintStep["trySprint"] = 2] = "trySprint";
        turtorialHintStep[turtorialHintStep["tryAttack"] = 3] = "tryAttack";
        turtorialHintStep[turtorialHintStep["trySkill"] = 4] = "trySkill";
        turtorialHintStep[turtorialHintStep["seeInfoA"] = 5] = "seeInfoA";
        turtorialHintStep[turtorialHintStep["seeInfoB"] = 6] = "seeInfoB";
        turtorialHintStep[turtorialHintStep["seeInfoC"] = 7] = "seeInfoC";
    })(turtorialHintStep || (turtorialHintStep = {}));
    class Turtorial extends Laya.Script {
        constructor() {
            super(...arguments);
            this.moveLeft = false;
            this.moveRight = false;
            this.stepChanging = false;
            this.currentHintUI = new Laya.Sprite();
            this.bg = new Laya.Sprite();
            this.hintTimer = null;
        }
        onAwake() {
        }
        onStart() {
            this.resetTutorial();
            if (Laya.Browser.onMobile) {
                this.mobileClick();
            }
        }
        mobileClick() {
            let mobileTutorialFunc = function () {
                if (this.stepChanging)
                    return;
                let player = CharacterInit.playerEnt;
                switch (this.currentHintStep) {
                    case turtorialHintStep.tryMove:
                        if (player.m_mobileLeftBtnClicked) {
                            this.moveLeft = true;
                        }
                        else if (player.m_mobileRightBtnClicked) {
                            this.moveRight = true;
                        }
                        if (this.moveRight && this.moveLeft) {
                            this.setHintStep(turtorialHintStep.trySprint);
                        }
                        break;
                    case turtorialHintStep.trySprint:
                        if (player.m_mobileSprintBtnClicked) {
                            this.setHintStep(turtorialHintStep.tryAttack);
                        }
                        break;
                    case turtorialHintStep.tryAttack:
                        if (EnemyInit.enemyLeftCur <= 0) {
                            this.setHintStep(turtorialHintStep.trySkill);
                            player.m_catSkill = player.getSkillTypeByExtraData('c', 1);
                            player.m_humanSkill = player.getSkillTypeByExtraData('h', 1);
                            let data = ExtraData.currentData;
                            data['humanSkill'] = 1;
                            data['catSkill'] = 1;
                            ExtraData.saveData();
                            if (Laya.Browser.onMobile) {
                                player.updateMobileSkillBtnUI();
                            }
                            Turtorial.noOath = false;
                        }
                        break;
                    case turtorialHintStep.trySkill:
                        if (EnemyInit.enemyLeftCur <= 0) {
                            CharacterInit.playerEnt.clearAddDebuffTimer();
                            CharacterInit.playerEnt.removeAllDebuff();
                            Turtorial.safeDebuff = false;
                            this.setHintStep(turtorialHintStep.seeInfoA);
                        }
                        break;
                    case turtorialHintStep.seeInfoA:
                        this.setHintStep(turtorialHintStep.seeInfoB);
                        break;
                    case turtorialHintStep.seeInfoB:
                        this.setHintStep(turtorialHintStep.seeInfoC);
                        break;
                    case turtorialHintStep.seeInfoC:
                        EnemyInit.newbieDone = true;
                        Laya.stage.removeChild(this.currentHintUI);
                        this.currentHintUI.destroy();
                        this.currentHintUI.destroyed = true;
                        break;
                    default:
                        break;
                }
            };
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, mobileTutorialFunc);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, mobileTutorialFunc);
        }
        onKeyDown(e) {
            if (this.stepChanging)
                return;
            let player = CharacterInit.playerEnt;
            switch (this.currentHintStep) {
                case turtorialHintStep.tryMove:
                    if (e.keyCode === 37) {
                        this.moveLeft = true;
                    }
                    else if (e.keyCode === 39) {
                        this.moveRight = true;
                    }
                    if (this.moveRight && this.moveLeft) {
                        this.setHintStep(turtorialHintStep.trySprint);
                    }
                    break;
                case turtorialHintStep.trySprint:
                    if (e.keyCode === 16) {
                        if (CharacterInit.playerEnt.m_canSprint)
                            this.setHintStep(turtorialHintStep.tryAttack);
                    }
                    break;
                case turtorialHintStep.tryAttack:
                    if (EnemyInit.enemyLeftCur <= 0) {
                        this.setHintStep(turtorialHintStep.trySkill);
                        player.m_catSkill = player.getSkillTypeByExtraData('c', 1);
                        player.m_humanSkill = player.getSkillTypeByExtraData('h', 1);
                        let data = ExtraData.currentData;
                        data['humanSkill'] = 1;
                        data['catSkill'] = 1;
                        ExtraData.saveData();
                        Turtorial.noOath = false;
                    }
                    break;
                case turtorialHintStep.trySkill:
                    if (EnemyInit.enemyLeftCur <= 0) {
                        CharacterInit.playerEnt.clearAddDebuffTimer();
                        CharacterInit.playerEnt.removeAllDebuff();
                        Turtorial.safeDebuff = false;
                        this.setHintStep(turtorialHintStep.seeInfoA);
                    }
                    break;
                case turtorialHintStep.seeInfoA:
                    if (e.keyCode === 32) {
                        this.setHintStep(turtorialHintStep.seeInfoB);
                    }
                    break;
                case turtorialHintStep.seeInfoB:
                    if (e.keyCode === 32) {
                        this.setHintStep(turtorialHintStep.seeInfoC);
                    }
                    break;
                case turtorialHintStep.seeInfoC:
                    if (e.keyCode === 32) {
                        EnemyInit.newbieDone = true;
                        Laya.stage.removeChild(this.currentHintUI);
                        this.currentHintUI.destroy();
                        this.currentHintUI.destroyed = true;
                    }
                    break;
                default:
                    break;
            }
        }
        resetTutorial() {
            let player = CharacterInit.playerEnt.m_animation;
            this.currentHintStep = turtorialHintStep.none;
            this.setHintStep(turtorialHintStep.tryMove);
            EnemyInit.enemyLeftCur = 0;
            this.currentHintUI.destroyed = false;
            let hintTimerFunc = function () {
                if (player.destroyed || !Village.isNewbie) {
                    Laya.timer.clear(this, hintTimerFunc);
                    this.hintTimer = null;
                    if (!this.currentHintUI.destroyed)
                        Laya.stage.removeChild(this.currentHintUI);
                    this.currentHintUI.destroy();
                    return;
                }
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.currentHintUI.pos(player.x - 150, 160);
                }
                if (Laya.stage.x >= -250) {
                    this.currentHintUI.pos(935 - 150, 160);
                }
                if (Laya.stage.x <= -2475) {
                    this.currentHintUI.pos(3155 - 150, 160);
                }
            };
            Laya.timer.frameLoop(1, this, hintTimerFunc);
            Laya.stage.addChild(this.currentHintUI);
            ZOrderManager.setZOrder(this.currentHintUI, 999);
        }
        setHintStep(step) {
            if (this.currentHintStep === turtorialHintStep.none) {
                this.currentHintUI.loadImage('UI/tutorial/1.png');
                this.currentHintStep = step;
                return;
            }
            if (step === turtorialHintStep.tryAttack || step === turtorialHintStep.trySkill) {
                EnemyInit.enemyLeftCur = 3;
                let i = 0;
                let timer = setInterval(() => {
                    if (i >= 3) {
                        clearInterval(timer);
                        return;
                    }
                    EnemyHandler.generator(CharacterInit.playerEnt.m_animation, 4, 0);
                    i++;
                }, 1500);
            }
            this.currentHintStep = step;
            this.stepChanging = true;
            Laya.Tween.to(this.currentHintUI, { alpha: 0 }, 1000, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
                this.currentHintUI.loadImage('UI/tutorial/' + step + '.png');
                Laya.Tween.to(this.currentHintUI, { alpha: 1 }, 1500, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    this.stepChanging = false;
                }), 0);
            }), 0);
        }
    }
    Turtorial.noOath = true;
    Turtorial.safeDebuff = true;

    var DebuffType;
    (function (DebuffType) {
        DebuffType[DebuffType["none"] = 0] = "none";
        DebuffType[DebuffType["blind"] = 1] = "blind";
        DebuffType[DebuffType["bodyCrumble"] = 2] = "bodyCrumble";
        DebuffType[DebuffType["decay"] = 4] = "decay";
        DebuffType[DebuffType["insane"] = 8] = "insane";
        DebuffType[DebuffType["predator"] = 16] = "predator";
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
            let tempRandomX = 200 * Math.random();
            let tempRandomY = 300 + 100 * Math.random();
            if (Laya.stage.x < -250 && Laya.stage.x > -2475)
                damageText.pos(this.player.m_animation.x - 300 + tempRandomX, tempRandomY);
            if (Laya.stage.x >= -250)
                damageText.pos(935 - 300 + tempRandomX, tempRandomY);
            if (Laya.stage.x <= -2475)
                damageText.pos(3155 - 300 + tempRandomX, tempRandomY);
            damageText.align = "left";
            damageText.alpha = 1;
            damageText.fontSize = 65;
            damageText.color = '#34A853';
            damageText.text = text;
            damageText.font = "silver";
            damageText.stroke = 5;
            damageText.strokeColor = "#fff";
            damageText.alpha = 0.1;
            Laya.stage.addChild(damageText);
            ZOrderManager.setZOrder(damageText, 80);
            Laya.Tween.to(damageText, { y: tempRandomY + 10, alpha: 0.8 }, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { y: tempRandomY + 200, alpha: 0 }, 2500, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.stage.removeChild(damageText);
                    damageText.destroy();
                }), 0);
            }), 0);
        }
    }
    class Blind extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "失明 ─ 哈，那東西爆掉的樣子真滑稽";
            this.blindSprite = null;
            this.blindBlackBg = null;
            this.blindCircleMask = null;
            this.blindHandler = null;
            this.blindSprite = new Laya.Sprite();
            this.blindBlackBg = new Laya.Sprite();
            this.blindCircleMask = new Laya.Sprite();
            this.blindBlackBg.size(1366, 768);
            this.blindBlackBg.pos(CharacterInit.playerEnt.m_animation.x - Laya.stage.width / 2, 0);
            this.blindBlackBg.loadImage("Background(0912)/blackBg.png");
            Laya.stage.addChild(this.blindBlackBg);
            ZOrderManager.setZOrder(this.blindBlackBg, 70);
            this.blindHandler = setInterval(() => {
                this.debuffUpdate();
            }, 10);
        }
        debuffUpdate() {
            super.debuffUpdate();
            if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                this.blindBlackBg.pos(CharacterInit.playerEnt.m_animation.x - Laya.stage.width / 2, 0);
            }
            if (Laya.stage.x >= -250) {
                this.blindBlackBg.pos(935 - Laya.stage.width / 2, 0);
            }
            if (Laya.stage.x <= -2475) {
                this.blindBlackBg.pos(3155 - Laya.stage.width / 2, 0);
            }
        }
        startBlind() {
            this.debuffTextEffect(this.debuffText);
        }
        stopBlind() {
            Laya.stage.removeChild(this.blindBlackBg);
            this.blindBlackBg.destroy();
            this.blindBlackBg = null;
            clearInterval(this.blindHandler);
            this.blindHandler = null;
        }
    }
    class BodyCrumble extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "殘廢 ─ 希望你還走得回去";
            this.bodyCrumbleHandler = null;
            this.originVM = 0;
            this.newVM = 0;
            this.originXMaxVel_basic = 0;
            this.newXMaxVel_basic = 0;
            this.originXMaxVel_buff = 0;
            this.newXMaxVel_buff = 0;
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
            this.player.m_basic_xMaxVelocity = this.originXMaxVel_basic;
            this.player.m_buff_xMaxVelocity = this.originXMaxVel_buff;
            this.player.m_velocityMultiplier = this.originVM;
            clearInterval(this.bodyCrumbleHandler);
            this.bodyCrumbleHandler = null;
        }
    }
    class Decay extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "失血 ─ 為我戰鬥至到粉身碎骨吧";
            this.isDecaying = false;
            this.isKilling = false;
            this.isDamaging = false;
            this.killingTimer = 0;
            this._currentEnemyCount = 0;
            this.previousEnemyCount = 0;
            this.decayHandler = null;
            this.checkKillingHandler = null;
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
                if (Turtorial.safeDebuff && this.player.getHealth() > this.player.m_maxHealth * 0.2) {
                    this.player.setHealth(this.player.getHealth() - this.player.m_maxHealth * 0.1);
                    return;
                }
                ;
                if (!Turtorial.safeDebuff)
                    this.player.setHealth(this.player.getHealth() - this.player.m_maxHealth * 0.1);
            }
        }
        startDecay() {
            this.isDecaying = true;
            this.debuffTextEffect(this.debuffText);
            this.debuffBloodEffect(this.player.m_animation);
        }
        stopDecay() {
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
        }
        debuffBloodEffect(player) {
            let blood = Laya.Pool.getItemByClass("blood", Laya.Animation);
            blood.scaleX = 0.7;
            blood.scaleY = 0.7;
            blood.interval = 20;
            blood.alpha = 0.5;
            ZOrderManager.setZOrder(blood, 5);
            let colorMat = [
                2, 0, 0, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(colorMat);
            blood.filters = [colorFilter];
            blood.pos(this.player.m_isFacingRight ? player.x - 180 : player.x - 185, player.y - 160);
            blood.source = "comp/DebuffBlood.atlas";
            blood.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(blood);
                Laya.Pool.recover("blood", blood);
            });
            Laya.stage.addChild(blood);
            ZOrderManager.setZOrder(blood, 60);
            blood.play();
        }
    }
    class Insane extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "對力量的渴望會讓你拋棄理性";
        }
        debuffUpdate() {
            super.debuffUpdate();
        }
        startInsane() {
            this.debuffTextEffect(this.debuffText);
        }
        stopInsane() {
        }
    }
    class Predator extends DebuffProto {
        constructor() {
            super();
            this.debuffText = "它們循著氣息來了";
        }
        debuffUpdate() {
            super.debuffUpdate();
        }
        startPredator() {
            this.debuffTextEffect(this.debuffText);
        }
        stopPredator() {
        }
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
            if (CharacterInit.playerEnt.m_bloodyPoint < 0)
                CharacterInit.playerEnt.m_bloodyPoint = 0;
            if (Turtorial.noOath)
                return;
        }
        showBloodyPoint(player) {
            this.oathBar = new Laya.ProgressBar();
            this.oathBar.skin = "UI/bp_100.png";
            this.oathBar_overCharge = new Laya.ProgressBar();
            this.oathBar_overCharge.skin = "UI/bp_150.png";
            this.oathBar_overCharge.visible = false;
            ZOrderManager.setZOrder(this.oathBar, 100);
            ZOrderManager.setZOrder(this.oathBar_overCharge, 100);
            let oathBarFunc = function () {
                if (CharacterInit.playerEnt.m_animation.destroyed) {
                    this.clearBloodyUI();
                    Laya.timer.clear(this, oathBarFunc);
                    return;
                }
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
                    this.oathBar_overCharge.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
                }
                if (Laya.stage.x >= -250) {
                    this.oathBar.pos(935 - Laya.stage.width / 2 + 180, 107.5);
                    this.oathBar_overCharge.pos(935 - Laya.stage.width / 2 + 180, 107.5);
                }
                if (Laya.stage.x <= -2475) {
                    this.oathBar.pos(3155 - Laya.stage.width / 2 + 180, 107.5);
                    this.oathBar_overCharge.pos(3155 - Laya.stage.width / 2 + 180, 107.5);
                }
                if (!CharacterInit.playerEnt.m_animation.destroyed && this.oathBar != null)
                    this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                this.oathBar_overCharge.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint_hard;
            };
            Laya.timer.frameLoop(1, this, oathBarFunc);
            Laya.stage.addChild(this.oathBar);
            Laya.stage.addChild(this.oathBar_overCharge);
            ZOrderManager.setZOrder(this.oathBar, 100);
            ZOrderManager.setZOrder(this.oathBar_overCharge, 100);
        }
        showBloodyLogo(player) {
            this.characterLogo = new Laya.Animation();
            this.catSkillIcon = new Laya.Sprite();
            this.humanSkillIcon = new Laya.Sprite();
            this.sprintIcon = new Laya.Sprite();
            this.goldImage = new Laya.Sprite();
            this.catSkillIconCd = new Laya.Text();
            this.humanSkillIconCd = new Laya.Text();
            this.sprintIconCd = new Laya.Text();
            this.goldValue = new Laya.Text();
            this.catSkillIcon.size(69, 69);
            this.humanSkillIcon.size(69, 69);
            this.sprintIcon.size(69, 69);
            this.catSkillIconCd.size(100, 100);
            this.goldImage.size(50, 50);
            this.goldValue.size(100, 60);
            this.catSkillIconCd.fontSize = this.humanSkillIconCd.fontSize = this.sprintIconCd.fontSize = this.goldValue.fontSize = 42;
            this.catSkillIconCd.font = this.humanSkillIconCd.font = this.sprintIconCd.font = this.goldValue.font = 'silver';
            this.catSkillIconCd.stroke = this.humanSkillIconCd.stroke = this.sprintIconCd.stroke = this.goldValue.stroke = 2;
            this.catSkillIconCd.strokeColor = this.humanSkillIconCd.strokeColor = this.sprintIconCd.strokeColor = this.goldValue.strokeColor = '#000';
            this.catSkillIconCd.color = this.humanSkillIconCd.color = this.sprintIconCd.color = this.goldValue.color = '#fff';
            this.characterLogo.source = "UI/Box.png";
            this.sprintIcon.loadImage("UI/icon/sprint.png");
            this.goldImage.loadImage("UI/Gold.png");
            this.goldValue.text = String(ExtraData.currentData['gold']);
            let oathLogoFunc = function () {
                if (CharacterInit.playerEnt.m_animation.destroyed) {
                    Laya.timer.clear(this, oathLogoFunc);
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
                    this.catSkillIcon.loadImage(CharacterInit.playerEnt.m_catSkill.m_iconA);
                    this.humanSkillIcon.loadImage(CharacterInit.playerEnt.m_humanSkill.m_iconA);
                    this.catSkillIcon.pos(pos['x'] + 16, pos['y'] + 87);
                    this.humanSkillIcon.pos(pos['x'] + 116, pos['y'] + 87);
                    this.sprintIcon.pos(pos['x'] + 66, pos['y'] + 37);
                    this.catSkillIconCd.pos(this.catSkillIcon.x + 29, this.catSkillIcon.y + 21);
                    this.humanSkillIconCd.pos(this.humanSkillIcon.x + 29, this.humanSkillIcon.y + 21);
                    this.sprintIconCd.pos(this.sprintIcon.x + 29, this.sprintIcon.y + 21);
                    this.goldImage.pos(pos['x'] + 205, pos['y'] + 110);
                    this.goldValue.pos(this.goldImage.x + 45, this.goldImage.y + 10);
                    this.catSkillIcon.alpha = CharacterInit.playerEnt.m_catSkill.m_canUse ? 1 : 0.3;
                    this.humanSkillIcon.alpha = CharacterInit.playerEnt.m_humanSkill.m_canUse ? 1 : 0.3;
                    this.sprintIcon.alpha = CharacterInit.playerEnt.m_canSprint ? 1 : 0.3;
                    this.catSkillIconCd.text = CharacterInit.playerEnt.m_catSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_catSkill.m_cdCount);
                    this.humanSkillIconCd.text = CharacterInit.playerEnt.m_humanSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_humanSkill.m_cdCount);
                }
                this.sprintIconCd.text = CharacterInit.playerEnt.m_canSprint ? "" : String(CharacterInit.playerEnt.m_sprintCdCount);
            };
            Laya.timer.frameLoop(1, this, oathLogoFunc);
            Laya.stage.addChild(this.characterLogo);
            Laya.stage.addChild(this.catSkillIcon);
            Laya.stage.addChild(this.humanSkillIcon);
            Laya.stage.addChild(this.catSkillIconCd);
            Laya.stage.addChild(this.humanSkillIconCd);
            Laya.stage.addChild(this.sprintIcon);
            Laya.stage.addChild(this.sprintIconCd);
            Laya.stage.addChild(this.goldImage);
            Laya.stage.addChild(this.goldValue);
            this.characterLogo.play();
            ZOrderManager.setZOrder(this.characterLogo, 100);
            ZOrderManager.setZOrder(this.catSkillIcon, 101);
            ZOrderManager.setZOrder(this.catSkillIconCd, 102);
            ZOrderManager.setZOrder(this.humanSkillIcon, 101);
            ZOrderManager.setZOrder(this.humanSkillIconCd, 102);
            ZOrderManager.setZOrder(this.sprintIcon, 101);
            ZOrderManager.setZOrder(this.sprintIconCd, 102);
            ZOrderManager.setZOrder(this.goldImage, 102);
            ZOrderManager.setZOrder(this.goldValue, 102);
        }
        clearBloodyUI() {
            if (this.oathBar != null) {
                Laya.stage.removeChild(this.oathBar);
                this.oathBar.destroy();
                this.oathBar = null;
            }
            if (this.oathBar_overCharge != null) {
                Laya.stage.removeChild(this.oathBar_overCharge);
                this.oathBar_overCharge.destroy();
                this.oathBar_overCharge = null;
            }
            if (this.characterLogo != null) {
                Laya.stage.removeChild(this.characterLogo);
                this.characterLogo.destroy();
                this.characterLogo = null;
            }
            if (this.catSkillIcon != null) {
                Laya.stage.removeChild(this.catSkillIcon);
                this.catSkillIcon.destroy();
                this.catSkillIcon = null;
            }
            if (this.humanSkillIcon != null) {
                Laya.stage.removeChild(this.humanSkillIcon);
                this.humanSkillIcon.destroy();
                this.humanSkillIcon = null;
            }
            if (this.catSkillIconCd != null) {
                Laya.stage.removeChild(this.catSkillIconCd);
                this.catSkillIconCd.destroy();
                this.catSkillIconCd = null;
            }
            if (this.humanSkillIconCd != null) {
                Laya.stage.removeChild(this.humanSkillIconCd);
                this.humanSkillIconCd.destroy();
                this.humanSkillIconCd = null;
            }
            if (this.sprintIcon != null) {
                Laya.stage.removeChild(this.sprintIcon);
                this.sprintIcon.destroy();
                this.sprintIcon = null;
            }
            if (this.sprintIconCd != null) {
                Laya.stage.removeChild(this.sprintIconCd);
                this.sprintIconCd.destroy();
                this.sprintIconCd = null;
            }
            if (this.goldImage != null) {
                Laya.stage.removeChild(this.goldImage);
                this.goldImage.destroy();
                this.goldImage = null;
            }
            if (this.goldValue != null) {
                Laya.stage.removeChild(this.goldValue);
                this.goldValue.destroy();
                this.goldValue = null;
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
                    this.playerDebuff |= DebuffType.decay;
                    if (this.decayProto === null) {
                        this.decayProto = new Decay();
                        this.decayProto.startDecay();
                    }
                    break;
                case 1 << 3:
                    this.playerDebuff |= DebuffType.insane;
                    if (this.insaneProto === null) {
                        this.insaneProto = new Insane();
                        this.insaneProto.startInsane();
                    }
                    break;
                case 1 << 4:
                    this.playerDebuff |= DebuffType.predator;
                    if (this.predatorProto === null) {
                        this.predatorProto = new Predator();
                        this.predatorProto.startPredator();
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
                    this.playerDebuff ^= DebuffType.decay;
                    if (this.decayProto != null) {
                        this.decayProto.stopDecay();
                        this.decayProto = null;
                    }
                    break;
                case 1 << 3:
                    this.playerDebuff ^= DebuffType.insane;
                    if (this.insaneProto != null) {
                        this.insaneProto.stopInsane();
                        this.insaneProto = null;
                    }
                    break;
                case 1 << 4:
                    this.playerDebuff ^= DebuffType.predator;
                    if (this.predatorProto != null) {
                        this.predatorProto.stopPredator();
                        this.predatorProto = null;
                    }
                    break;
            }
        }
        removeAllDebuff() {
            for (let i = 0; i <= 2; i++) {
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
                        this.oathState = OathStatus.charge;
                    }
                    break;
                case OathStatus.charge:
                    if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft && this.overChargeCount >= 2) {
                        this.overChargeCount = 0;
                        this.oathBar.visible = false;
                        this.oathBar_overCharge.visible = true;
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                        if (this.addDebuffTimer === null) {
                            this.addDebuffTimer = setInterval(() => {
                                if (CharacterInit.playerEnt.m_animation.destroyed || EnemyInit.isWin) {
                                    this.clearAddDebuffTimer();
                                    return;
                                }
                                this.randomAddDebuff();
                            }, 5000);
                        }
                        this.oathState = OathStatus.overCharge;
                        return;
                    }
                    if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft && this.overChargeCount < 2) {
                        this.overChargeCount++;
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
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
                        this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_hard;
                        return;
                    }
                    if (this.currentBloodyPoint < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                        this.oathBar.visible = true;
                        this.oathBar_overCharge.visible = false;
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
            if ((this.playerDebuff & DebuffType.decay) === DebuffType.decay) {
                if (this.decayProto != null)
                    this.decayProto.killingTimerUpdate();
            }
            if ((this.playerDebuff & DebuffType.insane) === DebuffType.insane) {
            }
            if ((this.playerDebuff & DebuffType.predator) === DebuffType.predator) {
            }
        }
        randomAddDebuff() {
            if (this.playerDebuff >= 7)
                return;
            let type = Math.floor(Math.random() * 3);
            let isInside = false;
            for (let i = 0; i <= 2; i++) {
                if ((this.playerDebuff & 1 << i) === 1 << type)
                    isInside = true;
            }
            if (isInside) {
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
            this.currentBloodyPoint = this.currentBloodyPoint - cost;
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
            this.m_sprintCdTimer = null;
            this.m_atkTimer = null;
            this.m_atkStep = 0;
            this.m_hurted = false;
            this.m_hurtTimer = null;
            this.m_slashTimer = null;
            this.m_cameraShakingTimer = 0;
            this.m_cameraShakingMultiplyer = 1;
            this.m_catSkill = null;
            this.m_humanSkill = null;
            this.m_walkeffect = new Laya.Animation();
            this.m_mobileLeftBtnClicked = false;
            this.m_mobileRightBtnClicked = false;
            this.m_mobileAtkBtnClicked = false;
            this.m_mobileSprintBtnClicked = false;
            this.mobileLeftBtnResetFunc = () => { };
            this.mobileRightBtnResetFunc = () => { };
            this.mobileAtkBtnFunc = () => { };
            this.mobileSprintBtnFunc = () => { };
            this.mobileCatSkillBtnFunc = () => { };
            this.mobileHumanSkillBtnFunc = () => { };
            this.BG_Sky_1 = new Laya.Sprite();
            this.BG_Sky_2 = new Laya.Sprite();
            this.BG_Sky_3 = new Laya.Sprite();
            this.BG_Landscape_B_1 = new Laya.Sprite();
            this.BG_Landscape_B_2 = new Laya.Sprite();
            this.BG_Landscape_B_3 = new Laya.Sprite();
            this.BG_Landscape_F_1 = new Laya.Sprite();
            this.BG_Landscape_F_2 = new Laya.Sprite();
            this.BG_Landscape_F_3 = new Laya.Sprite();
            this.BG_Grass_1 = new Laya.Sprite();
            this.BG_Grass_2 = new Laya.Sprite();
            this.BG_Grass_3 = new Laya.Sprite();
            this.BG_Ground_1 = new Laya.Sprite();
            this.BG_Ground_2 = new Laya.Sprite();
            this.BG_Ground_3 = new Laya.Sprite();
            this.BG_Front_1 = new Laya.Sprite();
            this.BG_Front_2 = new Laya.Sprite();
            this.BG_Front_3 = new Laya.Sprite();
        }
        spawn() {
            console.log('角色生成一次');
            this.loadCharacterData();
            this.getAtkValue(this.m_atkLevel);
            this.m_state = CharacterStatus.idle;
            this.m_animation = new Laya.Animation();
            this.m_animation.scaleX = 1;
            this.m_animation.scaleY = 1;
            ZOrderManager.setZOrder(this.m_animation, 10);
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
            ZOrderManager.setZOrder(this.m_animation, 20);
            if (Laya.Browser.onMobile) {
                this.showMobileUI(this.m_animation);
            }
            this.cameraFollower();
            this.setSkill();
        }
        ;
        onDestroy() {
            this.clearBackground();
        }
        setHealth(amount) {
            this.m_health = amount;
            if (this.m_health <= 0) {
                if (CharacterInit.playerEnt != null) {
                    CharacterInit.playerEnt.clearAddDebuffTimer();
                    CharacterInit.playerEnt.removeAllDebuff();
                }
                this.resetMobileBtnEvent();
                this.death();
            }
        }
        getHealth() {
            return this.m_health;
        }
        ;
        death() {
            Laya.Tween.to(this.m_animation, { alpha: 0.0 }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.stage.removeChild(this.m_animation);
                this.m_animation.destroy();
                this.m_animation.destroyed = true;
                CharacterInit.generated = false;
                SceneDestroyer.wake();
                CharacterInit.playerEnt.clearBackground();
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
            this.bloodSplitEffect(this.m_animation);
        }
        checkJumpTimer() {
            let timer = setInterval(() => {
                if (!this.m_animation || this.m_animation.destroyed) {
                    clearInterval(timer);
                    return;
                }
                this.m_canJump = (Math.abs(this.m_animation.y + (this.m_animation.height / 2) - 590) < 10) ? true : false;
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
            let damageText = Laya.Pool.getItemByClass("damageText", Laya.Text);
            let soundNum;
            damageText.pos((this.m_animation.x - this.m_animation.width / 2) + 80, (this.m_animation.y - this.m_animation.height) - 3);
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
            damageText.stroke = 3;
            damageText.strokeColor = "#fff";
            Laya.stage.addChild(damageText);
            ZOrderManager.setZOrder(damageText, 80);
            Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 50, }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 450, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.stage.removeChild(damageText);
                    Laya.Pool.recover("damageText", damageText);
                }), 0);
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
            ZOrderManager.setZOrder(this.m_healthBar, 100);
            let healthBarFunc = function () {
                if (this.m_animation.destroyed) {
                    Laya.stage.removeChild(this.m_healthBar);
                    this.m_healthBar.destroy();
                    this.m_healthBar.destroyed = true;
                    Laya.timer.clear(this, healthBarFunc);
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
            };
            Laya.timer.frameLoop(1, this, healthBarFunc);
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
                this.delayMove(0.08);
                this.hurtedEvent(1.5);
                this.updateAnimation(this.m_state, CharacterStatus.sprint, null, false, 100);
                this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? 100.0 : -100.0, y: 0.0 };
                this.m_rigidbody.mask = 2 | 16;
                this.m_collider.refresh();
                let sprintDone = () => {
                    this.m_rigidbody.mask = 2 | 8 | 16;
                    this.m_collider.density = 300;
                    this.m_collider.refresh();
                    this.m_collider.density = 1;
                    this.m_collider.refresh();
                };
                this.updateSprintCdTimer();
                Laya.stage.frameOnce(30, this, sprintDone);
                this.m_canSprint = false;
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 10, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 150, Laya.Ease.linearInOut, Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
                }), 0);
                setTimeout(() => {
                    this.m_canSprint = true;
                }, 3000);
                this.setSound(0.6, "Audio/Misc/dash.wav", 1);
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
                this.debuffBloodEffect(this.m_animation);
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
            if (this.m_keyDownList[67]) {
                if (EnemyInit.isWin)
                    return;
                this.m_humanSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
            }
            if (this.m_keyDownList[88]) {
                if (EnemyInit.isWin)
                    return;
                this.m_catSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_catSkill.m_cost));
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
                        if (!Turtorial.noOath)
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
            let slashEffect = Laya.Pool.getItemByClass("slashEffect", Laya.Animation);
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
            slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
            slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashEffect.filters = [colorFilter];
            slashEffect.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(slashEffect);
                Laya.Pool.recover("slashEffect", slashEffect);
                Laya.timer.clear(this, slashTimerFunc);
            });
            Laya.stage.addChild(slashEffect);
            ZOrderManager.setZOrder(slashEffect, 60);
            slashEffect.play();
            let slashTimerFunc = function () {
                slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
                slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            };
        }
        createWalkEffect(player) {
            this.m_walkeffect = Laya.Pool.getItemByClass("walkeffect", Laya.Animation);
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
            ZOrderManager.setZOrder(this.m_walkeffect, 24);
            this.m_walkeffect.play();
            let walkTimerFunc = function () {
                if (this.m_animation.destroyed || EnemyInit.isWin) {
                    Laya.stage.removeChild(this.m_walkeffect);
                    Laya.Pool.recover("walkeffect", this.m_walkeffect);
                    Laya.timer.clear(this, walkTimerFunc);
                    return;
                }
                this.m_walkeffect.skewY = this.m_isFacingRight ? 0 : 180;
                this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
            };
            Laya.timer.frameLoop(1, this, walkTimerFunc);
        }
        debuffBloodEffect(player) {
            let blood = Laya.Pool.getItemByClass("blood", Laya.Animation);
            blood.scaleX = 0.7;
            blood.scaleY = 0.7;
            blood.interval = 20;
            blood.alpha = 0.6;
            ZOrderManager.setZOrder(blood, 5);
            let colorMat = [
                2, 0, 1, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(colorMat);
            blood.filters = [colorFilter];
            blood.pos(this.m_isFacingRight ? player.x - 180 : player.x - 185, player.y - 160);
            blood.source = "comp/DebuffBlood.atlas";
            blood.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(blood);
                Laya.Pool.recover("blood", blood);
            });
            Laya.stage.addChild(blood);
            ZOrderManager.setZOrder(blood, 60);
            blood.play();
        }
        setSkill() {
            this.m_catSkill = this.getSkillTypeByExtraData('c', ExtraData.currentData['catSkill']);
            this.m_humanSkill = this.getSkillTypeByExtraData('h', ExtraData.currentData['humanSkill']);
        }
        getSkillTypeByExtraData(type, id) {
            if (type === 'c') {
                switch (id) {
                    case 0:
                        return new None();
                    case 1:
                        return new Slam();
                    case 2:
                        return new BlackHole();
                    default:
                        return new None();
                }
            }
            else if (type === 'h') {
                switch (id) {
                    case 0:
                        return new None$1();
                    case 1:
                        return new Spike();
                    case 2:
                        return new Behead();
                    default:
                        return new None$1();
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
            let camTimerFunc = function () {
                if (this.m_animation.destroyed) {
                    Laya.timer.clear(this, camTimerFunc);
                    return;
                }
                if (this.m_cameraShakingTimer > 0) {
                    let randomSign = (Math.floor(Math.random() * 2) == 1) ? 1 : -1;
                    Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                    Laya.stage.y = Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                    this.m_cameraShakingTimer--;
                }
                else {
                    this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (player_pivot_x - this.m_animation.x);
                    this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (player_pivot_x - this.m_animation.x);
                    this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (player_pivot_x - this.m_animation.x);
                    this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (player_pivot_x - this.m_animation.x);
                    this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (player_pivot_x - this.m_animation.x);
                    this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (player_pivot_x - this.m_animation.x);
                    this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (player_pivot_x - this.m_animation.x);
                    this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (player_pivot_x - this.m_animation.x);
                    this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (player_pivot_x - this.m_animation.x);
                    this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (player_pivot_x - this.m_animation.x);
                    this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (player_pivot_x - this.m_animation.x);
                    this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (player_pivot_x - this.m_animation.x);
                    this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (player_pivot_x - this.m_animation.x);
                    Laya.stage.y = 0;
                    Laya.stage.x = player_pivot_x - this.m_animation.x;
                }
                if (Laya.stage.x >= -250.0) {
                    Laya.stage.x = -250.0;
                    this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (-250);
                    this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (-250);
                    this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (-250);
                    this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (-250);
                    this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (-250);
                    this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (-250);
                    this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (-250);
                    this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (-250);
                    this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (-250);
                    this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (-250);
                    this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (-250);
                    this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (-250);
                    this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (-250);
                    this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (-250);
                    this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (-250);
                    this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (-250);
                    this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (-250);
                    this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (-250);
                }
                if (Laya.stage.x <= -2475.0) {
                    Laya.stage.x = -2475.0;
                    this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (-2475);
                    this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (-2475);
                    this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (-2475);
                    this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (-2475);
                    this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (-2475);
                    this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (-2475);
                    this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (-2475);
                    this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (-2475);
                    this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (-2475);
                    this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (-2475);
                    this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (-2475);
                    this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (-2475);
                    this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (-2475);
                    this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (-2475);
                    this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (-2475);
                    this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (-2475);
                    this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (-2475);
                    this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (-2475);
                }
            };
            Laya.timer.frameLoop(1, this, camTimerFunc);
        }
        setCameraShake(timer, multiplier) {
            this.m_cameraShakingMultiplyer = multiplier;
            this.m_cameraShakingTimer = timer;
        }
        setBackground(map) {
            this.BG_Sky_1 = new Laya.Sprite();
            this.BG_Sky_2 = new Laya.Sprite();
            this.BG_Sky_3 = new Laya.Sprite();
            this.BG_Landscape_B_1 = new Laya.Sprite();
            this.BG_Landscape_B_2 = new Laya.Sprite();
            this.BG_Landscape_B_3 = new Laya.Sprite();
            this.BG_Landscape_F_1 = new Laya.Sprite();
            this.BG_Landscape_F_2 = new Laya.Sprite();
            this.BG_Landscape_F_3 = new Laya.Sprite();
            this.BG_Grass_1 = new Laya.Sprite();
            this.BG_Grass_2 = new Laya.Sprite();
            this.BG_Grass_3 = new Laya.Sprite();
            this.BG_Ground_1 = new Laya.Sprite();
            this.BG_Ground_2 = new Laya.Sprite();
            this.BG_Ground_3 = new Laya.Sprite();
            this.BG_Front_1 = new Laya.Sprite();
            this.BG_Front_2 = new Laya.Sprite();
            this.BG_Front_3 = new Laya.Sprite();
            this.BG_Sky_1.size(1366, 768);
            this.BG_Sky_2.size(1366, 768);
            this.BG_Sky_3.size(1366, 768);
            this.BG_Landscape_B_1.size(1366, 768);
            this.BG_Landscape_B_2.size(1366, 768);
            this.BG_Landscape_B_3.size(1366, 768);
            this.BG_Landscape_F_1.size(1366, 768);
            this.BG_Landscape_F_2.size(1366, 768);
            this.BG_Landscape_F_3.size(1366, 768);
            this.BG_Grass_1.size(1366, 768);
            this.BG_Grass_2.size(1366, 768);
            this.BG_Grass_3.size(1366, 768);
            this.BG_Ground_1.size(1366, 768);
            this.BG_Ground_2.size(1366, 768);
            this.BG_Ground_3.size(1366, 768);
            this.BG_Front_1.size(1366, 768);
            this.BG_Front_2.size(1366, 768);
            this.BG_Front_3.size(1366, 768);
            switch (map) {
                case "RedForest":
                    this.BG_Sky_1.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Sky_2.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Sky_3.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Landscape_B_1.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_B_2.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_B_3.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_F_1.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Landscape_F_2.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Landscape_F_3.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Grass_1.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Grass_2.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Grass_3.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Ground_1.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Ground_2.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Ground_3.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Front_1.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    this.BG_Front_2.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    this.BG_Front_3.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    break;
                case "Town":
                    this.BG_Sky_1.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                    this.BG_Sky_2.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                    this.BG_Sky_3.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                    this.BG_Landscape_B_1.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                    this.BG_Landscape_B_2.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                    this.BG_Landscape_B_3.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                    this.BG_Landscape_F_1.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                    this.BG_Landscape_F_2.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                    this.BG_Landscape_F_3.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                    this.BG_Grass_1.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                    this.BG_Grass_2.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                    this.BG_Grass_3.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                    this.BG_Ground_1.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                    this.BG_Ground_2.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                    this.BG_Ground_3.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                    this.BG_Front_1.loadImage("");
                    this.BG_Front_2.loadImage("");
                    this.BG_Front_3.loadImage("");
                    break;
                case "NewbieForest":
                    this.BG_Sky_1.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Sky_2.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Sky_3.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                    this.BG_Landscape_B_1.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_B_2.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_B_3.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                    this.BG_Landscape_F_1.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Landscape_F_2.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Landscape_F_3.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                    this.BG_Grass_1.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Grass_2.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Grass_3.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                    this.BG_Ground_1.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Ground_2.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Ground_3.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                    this.BG_Front_1.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    this.BG_Front_2.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    this.BG_Front_3.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                    break;
                default:
                    break;
            }
            ZOrderManager.setZOrder(this.BG_Sky_1, 5);
            ZOrderManager.setZOrder(this.BG_Sky_2, 5);
            ZOrderManager.setZOrder(this.BG_Sky_3, 5);
            ZOrderManager.setZOrder(this.BG_Landscape_B_1, 6);
            ZOrderManager.setZOrder(this.BG_Landscape_B_2, 6);
            ZOrderManager.setZOrder(this.BG_Landscape_B_3, 6);
            ZOrderManager.setZOrder(this.BG_Landscape_F_1, 8);
            ZOrderManager.setZOrder(this.BG_Landscape_F_2, 8);
            ZOrderManager.setZOrder(this.BG_Landscape_F_3, 8);
            ZOrderManager.setZOrder(this.BG_Grass_1, 9);
            ZOrderManager.setZOrder(this.BG_Grass_2, 9);
            ZOrderManager.setZOrder(this.BG_Grass_3, 9);
            ZOrderManager.setZOrder(this.BG_Ground_1, 10);
            ZOrderManager.setZOrder(this.BG_Ground_2, 10);
            ZOrderManager.setZOrder(this.BG_Ground_3, 10);
            ZOrderManager.setZOrder(this.BG_Front_1, 25);
            ZOrderManager.setZOrder(this.BG_Front_2, 25);
            ZOrderManager.setZOrder(this.BG_Front_3, 25);
            Laya.stage.addChild(this.BG_Sky_1);
            Laya.stage.addChild(this.BG_Sky_2);
            Laya.stage.addChild(this.BG_Sky_3);
            Laya.stage.addChild(this.BG_Landscape_B_1);
            Laya.stage.addChild(this.BG_Landscape_B_2);
            Laya.stage.addChild(this.BG_Landscape_B_3);
            Laya.stage.addChild(this.BG_Landscape_F_1);
            Laya.stage.addChild(this.BG_Landscape_F_2);
            Laya.stage.addChild(this.BG_Landscape_F_3);
            Laya.stage.addChild(this.BG_Grass_1);
            Laya.stage.addChild(this.BG_Grass_2);
            Laya.stage.addChild(this.BG_Grass_3);
            Laya.stage.addChild(this.BG_Ground_1);
            Laya.stage.addChild(this.BG_Ground_2);
            Laya.stage.addChild(this.BG_Ground_3);
            Laya.stage.addChild(this.BG_Front_1);
            Laya.stage.addChild(this.BG_Front_2);
            Laya.stage.addChild(this.BG_Front_3);
        }
        clearBackground() {
            console.log("清除背景圖層");
            Laya.stage.removeChild(this.BG_Sky_1);
            Laya.stage.removeChild(this.BG_Sky_2);
            Laya.stage.removeChild(this.BG_Sky_3);
            Laya.stage.removeChild(this.BG_Landscape_B_1);
            Laya.stage.removeChild(this.BG_Landscape_B_2);
            Laya.stage.removeChild(this.BG_Landscape_B_3);
            Laya.stage.removeChild(this.BG_Landscape_F_1);
            Laya.stage.removeChild(this.BG_Landscape_F_2);
            Laya.stage.removeChild(this.BG_Landscape_F_3);
            Laya.stage.removeChild(this.BG_Grass_1);
            Laya.stage.removeChild(this.BG_Grass_2);
            Laya.stage.removeChild(this.BG_Grass_3);
            Laya.stage.removeChild(this.BG_Ground_1);
            Laya.stage.removeChild(this.BG_Ground_2);
            Laya.stage.removeChild(this.BG_Ground_3);
            Laya.stage.removeChild(this.BG_Front_1);
            Laya.stage.removeChild(this.BG_Front_2);
            Laya.stage.removeChild(this.BG_Front_3);
            if (this.BG_Sky_1 != null) {
                this.BG_Sky_1.destroy();
                this.BG_Sky_1.destroyed = true;
            }
            ;
            if (this.BG_Sky_2 != null) {
                this.BG_Sky_2.destroy();
                this.BG_Sky_2.destroyed = true;
            }
            ;
            if (this.BG_Sky_3 != null) {
                this.BG_Sky_3.destroy();
                this.BG_Sky_3.destroyed = true;
            }
            ;
            if (this.BG_Landscape_B_1 != null) {
                this.BG_Landscape_B_1.destroy();
                this.BG_Landscape_B_1.destroyed = true;
            }
            ;
            if (this.BG_Landscape_B_2 != null) {
                this.BG_Landscape_B_2.destroy();
                this.BG_Landscape_B_2.destroyed = true;
            }
            ;
            if (this.BG_Landscape_B_3 != null) {
                this.BG_Landscape_B_3.destroy();
                this.BG_Landscape_B_3.destroyed = true;
            }
            ;
            if (this.BG_Landscape_F_1 != null) {
                this.BG_Landscape_F_1.destroy();
                this.BG_Landscape_F_1.destroyed = true;
            }
            ;
            if (this.BG_Landscape_F_2 != null) {
                this.BG_Landscape_F_2.destroy();
                this.BG_Landscape_F_2.destroyed = true;
            }
            ;
            if (this.BG_Landscape_F_3 != null) {
                this.BG_Landscape_F_3.destroy();
                this.BG_Landscape_F_3.destroyed = true;
            }
            ;
            if (this.BG_Grass_1 != null) {
                this.BG_Grass_1.destroy();
                this.BG_Grass_1.destroyed = true;
            }
            ;
            if (this.BG_Grass_2 != null) {
                this.BG_Grass_2.destroy();
                this.BG_Grass_2.destroyed = true;
            }
            ;
            if (this.BG_Grass_3 != null) {
                this.BG_Grass_3.destroy();
                this.BG_Grass_3.destroyed = true;
            }
            ;
            if (this.BG_Ground_1 != null) {
                this.BG_Ground_1.destroy();
                this.BG_Ground_1.destroyed = true;
            }
            ;
            if (this.BG_Ground_2 != null) {
                this.BG_Ground_2.destroy();
                this.BG_Ground_2.destroyed = true;
            }
            ;
            if (this.BG_Ground_3 != null) {
                this.BG_Ground_3.destroy();
                this.BG_Ground_3.destroyed = true;
            }
            ;
            if (this.BG_Front_1 != null) {
                this.BG_Front_1.destroy();
                this.BG_Front_1.destroyed = true;
            }
            ;
            if (this.BG_Front_2 != null) {
                this.BG_Front_2.destroy();
                this.BG_Front_2.destroyed = true;
            }
            ;
            if (this.BG_Front_3 != null) {
                this.BG_Front_3.destroy();
                this.BG_Front_3.destroyed = true;
            }
            ;
            this.BG_Sky_1 = null;
            this.BG_Sky_2 = null;
            this.BG_Sky_3 = null;
            this.BG_Landscape_B_1 = null;
            this.BG_Landscape_B_2 = null;
            this.BG_Landscape_B_3 = null;
            this.BG_Landscape_F_1 = null;
            this.BG_Landscape_F_2 = null;
            this.BG_Landscape_F_3 = null;
            this.BG_Grass_1 = null;
            this.BG_Grass_2 = null;
            this.BG_Grass_3 = null;
            this.BG_Ground_1 = null;
            this.BG_Ground_2 = null;
            this.BG_Ground_3 = null;
            this.BG_Front_1 = null;
            this.BG_Front_2 = null;
            this.BG_Front_3 = null;
        }
        bloodSplitEffect(enemy) {
            let bloodEffect = Laya.Pool.getItemByClass("bloodEffect", Laya.Animation);
            bloodEffect.scaleX = 1.2;
            bloodEffect.scaleY = 1.2;
            bloodEffect.interval = 30;
            ZOrderManager.setZOrder(bloodEffect, 5);
            let colorMat = [
                2, 1, 1, 0, -100,
                0, 1, 0, 0, -100,
                0, 0, 1, 0, -100,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(colorMat);
            bloodEffect.filters = [colorFilter];
            bloodEffect.pos(enemy.x - 325, enemy.y - 310);
            bloodEffect.source = "comp/Hurt.atlas";
            bloodEffect.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(bloodEffect);
                Laya.Pool.recover("bloodEffect", bloodEffect);
            });
            Laya.stage.addChild(bloodEffect);
            ZOrderManager.setZOrder(bloodEffect, 60);
            bloodEffect.play();
        }
        updateAnimation(from, to, onCallBack = null, force = false, rate = 100) {
            if (from === to || this.m_animationChanging)
                return;
            Laya.stage.removeChild(this.m_walkeffect);
            Laya.Pool.recover("walkeffect", this.m_walkeffect);
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
        updateSprintCdTimer() {
            this.m_sprintCdCount = 3;
            if (this.m_sprintCdTimer) {
                clearInterval(this.m_sprintCdTimer);
            }
            this.m_sprintCdTimer = setInterval(() => {
                if (this.m_canSprint) {
                    clearInterval(this.m_sprintCdTimer);
                    this.m_sprintCdTimer = null;
                    this.m_sprintCdCount = 0;
                    return;
                }
                this.m_sprintCdCount = !this.m_canSprint ? (this.m_sprintCdCount - 1) : 0;
            }, 1000);
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
        resetMobileBtnEvent() {
            if (Laya.Browser.onMobile) {
                this.m_mobileLeftBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileLeftBtnClicked = true; this.m_mobileLeftBtn.alpha = 0.5; });
                this.m_mobileLeftBtn.off(Laya.Event.MOUSE_UP, this, this.mobileLeftBtnResetFunc);
                this.m_mobileLeftBtn.off(Laya.Event.MOUSE_OUT, this, this.mobileLeftBtnResetFunc);
                this.m_mobileRightBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileRightBtnClicked = true; this.m_mobileRightBtn.alpha = 0.5; });
                this.m_mobileRightBtn.off(Laya.Event.MOUSE_UP, this, this.mobileRightBtnResetFunc);
                this.m_mobileRightBtn.off(Laya.Event.MOUSE_OUT, this, this.mobileRightBtnResetFunc);
                this.m_mobileAtkBtn.off(Laya.Event.CLICK, this, this.mobileAtkBtnFunc);
                this.m_mobileAtkBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileAtkBtn.alpha = 0.5; });
                this.m_mobileAtkBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileAtkBtn.alpha = 1; });
                this.m_mobileAtkBtn.on(Laya.Event.MOUSE_OUT, this, () => { this.m_mobileAtkBtn.alpha = 1; });
                this.m_mobileSprintBtn.off(Laya.Event.MOUSE_DOWN, this, this.mobileSprintBtnFunc);
                this.m_mobileSprintBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileSprintBtnClicked = false; });
                this.m_mobileCatSkillBtn.off(Laya.Event.CLICK, this, this.mobileCatSkillBtnFunc);
                this.m_mobileHumanSkillBtn.off(Laya.Event.CLICK, this, this.mobileHumanSkillBtnFunc);
                this.m_mobileUIToggle = false;
            }
        }
        updateMobileSkillBtnUI() {
            console.log("更新手機板技能UI");
            console.log("角色的：", this.m_humanSkill.m_id, "currentData的：", ExtraData.currentData['humanSkill']);
            console.log("角色的：", this.m_catSkill.m_id, "currentData的：", ExtraData.currentData['catSkill']);
            if (ExtraData.currentData['humanSkill'] === 0) {
                this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileEmpty.png');
            }
            else if (ExtraData.currentData['humanSkill'] === 1) {
                this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileSpike.png');
            }
            else if (ExtraData.currentData['humanSkill'] === 2) {
                this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileBehead.png');
            }
            if (ExtraData.currentData['catSkill'] === 0) {
                this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileEmpty.png');
            }
            else if (ExtraData.currentData['catSkill'] === 1) {
                this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileSlam.png');
            }
            else if (ExtraData.currentData['catSkill'] === 2) {
                this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileBlackhole.png');
            }
        }
        showMobileUI(player) {
            this.m_mobileUIToggle = true;
            let stageHitArea = new Laya.HitArea();
            stageHitArea.hit.drawRect(0, 0, 4098, 768, '#fff');
            Laya.stage.hitArea = stageHitArea;
            this.m_mobileLeftBtn = Laya.Pool.getItemByClass("mobileLeftBtn", Laya.Sprite);
            this.m_mobileRightBtn = Laya.Pool.getItemByClass("mobileRightBtn", Laya.Sprite);
            this.m_mobileAtkBtn = Laya.Pool.getItemByClass("mobileAtkBtn", Laya.Sprite);
            this.m_mobileSprintBtn = Laya.Pool.getItemByClass("mobileSprintBtn", Laya.Sprite);
            this.m_mobileHumanSkillBtn = Laya.Pool.getItemByClass("mobileHumanSkillBtn", Laya.Sprite);
            this.m_mobileCatSkillBtn = Laya.Pool.getItemByClass("mobileCatSkillBtn", Laya.Sprite);
            this.m_mobileSprintCd = Laya.Pool.getItemByClass("mobileSprintCd", Laya.Text);
            this.m_mobileCatSkillCd = Laya.Pool.getItemByClass("mobileCatSkillCd", Laya.Text);
            this.m_mobileHumanSkillCd = Laya.Pool.getItemByClass("mobileHumanSkillCd", Laya.Text);
            this.m_mobileLeftBtn.size(150, 119);
            this.m_mobileRightBtn.size(150, 119);
            this.m_mobileAtkBtn.size(135, 135);
            this.m_mobileSprintBtn.size(110, 110);
            this.m_mobileHumanSkillBtn.size(110, 110);
            this.m_mobileCatSkillBtn.size(110, 110);
            this.m_mobileLeftBtn.loadImage('UI/mobile/mobileLeftBtn.png');
            this.m_mobileRightBtn.loadImage('UI/mobile/mobileRightBtn.png');
            this.m_mobileAtkBtn.loadImage('UI/mobile/mobileAtkBtn.png');
            this.m_mobileSprintBtn.loadImage('UI/mobile/mobileSprintBtn.png');
            this.updateMobileSkillBtnUI();
            this.m_mobileSprintCd.fontSize = this.m_mobileCatSkillCd.fontSize = this.m_mobileHumanSkillCd.fontSize = 100;
            this.m_mobileSprintCd.font = this.m_mobileCatSkillCd.font = this.m_mobileHumanSkillCd.font = "silver";
            this.m_mobileSprintCd.stroke = this.m_mobileCatSkillCd.stroke = this.m_mobileHumanSkillCd.stroke = 2;
            this.m_mobileSprintCd.strokeColor = this.m_mobileCatSkillCd.strokeColor = this.m_mobileHumanSkillCd.strokeColor = '#000';
            this.m_mobileSprintCd.color = this.m_mobileCatSkillCd.color = this.m_mobileHumanSkillCd.color = '#fff';
            this.m_mobileLeftBtn.autoSize = true;
            this.m_mobileRightBtn.autoSize = true;
            this.m_mobileAtkBtn.autoSize = true;
            this.m_mobileSprintBtn.autoSize = true;
            this.m_mobileHumanSkillBtn.autoSize = true;
            this.m_mobileCatSkillBtn.autoSize = true;
            Laya.stage.addChild(this.m_mobileLeftBtn);
            Laya.stage.addChild(this.m_mobileRightBtn);
            Laya.stage.addChild(this.m_mobileAtkBtn);
            Laya.stage.addChild(this.m_mobileSprintBtn);
            Laya.stage.addChild(this.m_mobileCatSkillBtn);
            Laya.stage.addChild(this.m_mobileHumanSkillBtn);
            Laya.stage.addChild(this.m_mobileSprintCd);
            Laya.stage.addChild(this.m_mobileCatSkillCd);
            Laya.stage.addChild(this.m_mobileHumanSkillCd);
            ZOrderManager.setZOrder(this.m_mobileLeftBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileRightBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileAtkBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileSprintBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileCatSkillBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileHumanSkillBtn, 100);
            ZOrderManager.setZOrder(this.m_mobileSprintCd, 103);
            ZOrderManager.setZOrder(this.m_mobileCatSkillCd, 103);
            ZOrderManager.setZOrder(this.m_mobileHumanSkillCd, 103);
            this.mobileLeftBtnResetFunc = function () {
                this.m_mobileLeftBtnClicked = false;
                this.m_mobileLeftBtn.alpha = 1;
                if (this.m_canJump) {
                    this.m_playerVelocity["Vx"] = 0;
                }
                this.applyMoveX();
            };
            this.mobileRightBtnResetFunc = function () {
                this.m_mobileRightBtnClicked = false;
                this.m_mobileRightBtn.alpha = 1;
                if (this.m_canJump) {
                    this.m_playerVelocity["Vx"] = 0;
                }
                this.applyMoveX();
            };
            this.m_mobileLeftBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.m_mobileLeftBtnClicked = true;
                this.m_mobileLeftBtn.alpha = 0.5;
            });
            this.m_mobileLeftBtn.on(Laya.Event.MOUSE_UP, this, this.mobileLeftBtnResetFunc);
            this.m_mobileLeftBtn.on(Laya.Event.MOUSE_OUT, this, this.mobileLeftBtnResetFunc);
            this.m_mobileRightBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.m_mobileRightBtnClicked = true;
                this.m_mobileRightBtn.alpha = 0.5;
            });
            this.m_mobileRightBtn.on(Laya.Event.MOUSE_UP, this, this.mobileRightBtnResetFunc);
            this.m_mobileRightBtn.on(Laya.Event.MOUSE_OUT, this, this.mobileRightBtnResetFunc);
            let mobileMoveFunc = function () {
                if (this.m_mobileLeftBtnClicked) {
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
                if (this.m_mobileRightBtnClicked) {
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
            };
            this.mobileAtkBtnFunc = function () {
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
            };
            this.m_mobileAtkBtn.on(Laya.Event.CLICK, this, this.mobileAtkBtnFunc);
            this.m_mobileAtkBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.m_mobileAtkBtn.alpha = 0.5;
            });
            this.m_mobileAtkBtn.on(Laya.Event.MOUSE_UP, this, () => {
                this.m_mobileAtkBtn.alpha = 1;
            });
            this.m_mobileAtkBtn.on(Laya.Event.MOUSE_OUT, this, () => {
                this.m_mobileAtkBtn.alpha = 1;
            });
            this.mobileSprintBtnFunc = function () {
                this.m_mobileSprintBtnClicked = true;
                if (!this.m_canSprint || EnemyInit.isWin)
                    return;
                this.delayMove(0.08);
                this.hurtedEvent(1.5);
                this.updateAnimation(this.m_state, CharacterStatus.sprint, null, false, 100);
                this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? 100.0 : -100.0, y: 0.0 };
                this.m_rigidbody.mask = 2 | 16;
                this.m_collider.refresh();
                let sprintDone = () => {
                    this.m_rigidbody.mask = 2 | 8 | 16;
                    this.m_collider.density = 300;
                    this.m_collider.refresh();
                    this.m_collider.density = 1;
                    this.m_collider.refresh();
                };
                this.updateSprintCdTimer();
                Laya.stage.frameOnce(30, this, sprintDone);
                setTimeout(() => { this.m_canSprint = true; }, 3000);
                this.m_canSprint = false;
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 10, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 150, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                        this.m_animation.alpha = 1;
                    }), 0);
                }), 0);
                this.setSound(0.6, "Audio/Misc/dash.wav", 1);
            };
            this.m_mobileSprintBtn.on(Laya.Event.MOUSE_DOWN, this, this.mobileSprintBtnFunc);
            this.m_mobileSprintBtn.on(Laya.Event.MOUSE_UP, this, () => {
                this.m_mobileSprintBtnClicked = false;
            });
            this.mobileCatSkillBtnFunc = function () {
                if (EnemyInit.isWin)
                    return;
                this.m_catSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
            };
            this.m_mobileCatSkillBtn.on(Laya.Event.CLICK, this, this.mobileCatSkillBtnFunc);
            this.mobileHumanSkillBtnFunc = function () {
                if (EnemyInit.isWin)
                    return;
                this.m_humanSkill.cast(CharacterInit.playerEnt, {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
            };
            this.m_mobileHumanSkillBtn.on(Laya.Event.CLICK, this, this.mobileHumanSkillBtnFunc);
            let mobileUIFunc = () => {
                if (!this.m_mobileUIToggle) {
                    Laya.stage.removeChild(this.m_mobileLeftBtn);
                    Laya.stage.removeChild(this.m_mobileRightBtn);
                    Laya.stage.removeChild(this.m_mobileAtkBtn);
                    Laya.stage.removeChild(this.m_mobileSprintBtn);
                    Laya.stage.removeChild(this.m_mobileHumanSkillBtn);
                    Laya.stage.removeChild(this.m_mobileCatSkillBtn);
                    Laya.stage.removeChild(this.m_mobileSprintCd);
                    Laya.stage.removeChild(this.m_mobileCatSkillCd);
                    Laya.stage.removeChild(this.m_mobileHumanSkillCd);
                    Laya.Pool.recover("mobileLeftBtn", this.m_mobileLeftBtn);
                    Laya.Pool.recover("mobileRightBtn", this.m_mobileRightBtn);
                    Laya.Pool.recover("mobileAtkBtn", this.m_mobileAtkBtn);
                    Laya.Pool.recover("mobileSprintBtn", this.m_mobileSprintBtn);
                    Laya.Pool.recover("mobileHumanSkillBtn", this.m_mobileHumanSkillBtn);
                    Laya.Pool.recover("mobileCatSkillBtn", this.m_mobileCatSkillBtn);
                    Laya.Pool.recover("mobileSprintCd", this.m_mobileSprintCd);
                    Laya.Pool.recover("mobileCatSkillCd", this.m_mobileCatSkillCd);
                    Laya.Pool.recover("mobileHumanSkillCd", this.m_mobileHumanSkillCd);
                    Laya.timer.clear(this, mobileUIFunc);
                    Laya.timer.clear(this, mobileMoveFunc);
                    return;
                }
                this.m_mobileSprintBtn.alpha = CharacterInit.playerEnt.m_canSprint ? 1 : 0.5;
                this.m_mobileHumanSkillBtn.alpha = CharacterInit.playerEnt.m_humanSkill.m_canUse ? 1 : 0.5;
                this.m_mobileCatSkillBtn.alpha = CharacterInit.playerEnt.m_catSkill.m_canUse ? 1 : 0.5;
                this.m_mobileSprintCd.text = CharacterInit.playerEnt.m_canSprint ? "" : String(CharacterInit.playerEnt.m_sprintCdCount);
                this.m_mobileCatSkillCd.text = CharacterInit.playerEnt.m_catSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_catSkill.m_cdCount);
                this.m_mobileHumanSkillCd.text = CharacterInit.playerEnt.m_humanSkill.m_canUse ? "" : String(CharacterInit.playerEnt.m_humanSkill.m_cdCount);
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                    this.m_mobileLeftBtn.pos(player.x - Laya.stage.width / 2 + 50, 620);
                    this.m_mobileRightBtn.pos(player.x - Laya.stage.width / 2 + 50 + 165, 620);
                    this.m_mobileAtkBtn.pos(player.x + Laya.stage.width / 2 - 200, 620);
                    this.m_mobileSprintBtn.pos(player.x + Laya.stage.width / 2 - 350, 630);
                    this.m_mobileCatSkillBtn.pos(player.x + Laya.stage.width / 2 - 290, 530);
                    this.m_mobileHumanSkillBtn.pos(player.x + Laya.stage.width / 2 - 200, 460);
                    this.m_mobileSprintCd.pos(player.x + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                    this.m_mobileCatSkillCd.pos(player.x + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                    this.m_mobileHumanSkillCd.pos(player.x + Laya.stage.width / 2 - 200 + 40, 460 + 20);
                }
                if (Laya.stage.x >= -250) {
                    this.m_mobileLeftBtn.pos(935 - Laya.stage.width / 2 + 50, 620);
                    this.m_mobileRightBtn.pos(935 - Laya.stage.width / 2 + 50 + 165, 620);
                    this.m_mobileAtkBtn.pos(935 + Laya.stage.width / 2 - 200, 620);
                    this.m_mobileSprintBtn.pos(935 + Laya.stage.width / 2 - 350, 630);
                    this.m_mobileCatSkillBtn.pos(935 + Laya.stage.width / 2 - 290, 530);
                    this.m_mobileHumanSkillBtn.pos(935 + Laya.stage.width / 2 - 200, 460);
                    this.m_mobileSprintCd.pos(935 + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                    this.m_mobileCatSkillCd.pos(935 + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                    this.m_mobileHumanSkillCd.pos(935 + Laya.stage.width / 2 - 200 + 40, 460 + 20);
                }
                if (Laya.stage.x <= -2475) {
                    this.m_mobileLeftBtn.pos(3155 - Laya.stage.width / 2 + 50, 620);
                    this.m_mobileRightBtn.pos(3155 - Laya.stage.width / 2 + 50 + 165, 620);
                    this.m_mobileAtkBtn.pos(3155 + Laya.stage.width / 2 - 200, 620);
                    this.m_mobileSprintBtn.pos(3155 + Laya.stage.width / 2 - 350, 630);
                    this.m_mobileCatSkillBtn.pos(3155 + Laya.stage.width / 2 - 290, 530);
                    this.m_mobileHumanSkillBtn.pos(3155 + Laya.stage.width / 2 - 200, 460);
                    this.m_mobileSprintCd.pos(3155 + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                    this.m_mobileCatSkillCd.pos(3155 + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                    this.m_mobileHumanSkillCd.pos(3155 + Laya.stage.width / 2 - 200 + 40, 460 + 20);
                }
            };
            Laya.timer.frameLoop(1, this, mobileUIFunc);
            Laya.timer.frameLoop(1, this, mobileMoveFunc);
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
            if (this.player != undefined || CharacterInit.generated)
                return;
            CharacterInit.generated = true;
            this.player = new Character();
            this.initSetting(this.player);
            this.player.spawn();
            CharacterInit.playerEnt = this.player;
            Laya.stage.addChild(CharacterInit.playerEnt.m_animation);
            ZOrderManager.setZOrder(CharacterInit.playerEnt.m_animation, 20);
            this.player.m_oathManager.showBloodyPoint(CharacterInit.playerEnt.m_animation);
            this.player.m_oathManager.showBloodyLogo(CharacterInit.playerEnt.m_animation);
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
            player.m_catSkill = player.getSkillTypeByExtraData('c', 0);
            player.m_humanSkill = player.getSkillTypeByExtraData('h', 0);
            player.setBackground(SceneInit.currentMap);
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
            CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [colorFilter, glowFilter_charge] : [];
            CharacterInit.playerEnt.m_oathManager.characterLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [colorFilter, glowFilter_charge] : [];
            CharacterInit.playerEnt.m_oathManager.oathUpdate();
        }
    }
    CharacterInit.generated = false;

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
            ZOrderManager.setZOrder(this.m_animation, 15);
            this.showHealth();
            if (this.m_isElite) {
                this.setEnemyEliteColor();
            }
        }
        ;
        destroy() {
            Laya.stage.removeChild(this.m_animation);
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
            amount *= critical ? criticalDmgRate : 1;
            amount = Math.round(amount);
            this.setHealth(this.getHealth() - amount);
            this.damageTextEffect(amount, critical);
            this.m_healthBar.alpha = 1;
            if (this.m_hurtDelayTimer) {
                this.m_hurtDelay += 0.5;
            }
            else {
                this.m_hurtDelay = 1.0;
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
                if (this.m_moveDelayValue <= 0)
                    this.delayMove(0.6);
                let facingRight = (CharacterInit.playerEnt.m_animation.x - this.m_animation.x) > 0.0 ? true : false;
                this.m_rigidbody.linearVelocity = { x: facingRight ? -4.0 : 4.0, y: 0.0 };
            }
            this.m_atkTimer = 60;
            this.updateAnimation(this.m_state, EnemyStatus.idle);
            this.enemyInjuredColor();
        }
        damageTextEffect(amount, critical) {
            let damageText = new Laya.Text();
            let fakeX = Math.random() * 60;
            let fakeY = Math.random() * 50;
            damageText.pos(this.m_animation.x - fakeX, (this.m_animation.y - this.m_animation.height) - 100);
            damageText.bold = true;
            damageText.align = "center";
            damageText.alpha = 0.8;
            damageText.fontSize = critical ? 40 : 20;
            damageText.color = critical ? '#FA7B1E' : "white";
            if (amount >= 3000) {
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
            damageText.stroke = 3;
            damageText.strokeColor = "#000";
            Laya.stage.addChild(damageText);
            ZOrderManager.setZOrder(damageText, 80);
            Laya.Tween.to(damageText, { alpha: 0.4, fontSize: damageText.fontSize + 50, y: damageText.y + 80, }, 650, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
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
            ZOrderManager.setZOrder(this.m_healthBar, 100);
            let healthBarFunc = function () {
                if (this.m_animation.destroyed) {
                    Laya.stage.removeChild(this.m_healthBar);
                    this.m_healthBar.destroy();
                    this.m_healthBar.destroyed = true;
                    Laya.timer.clear(this, healthBarFunc);
                    return;
                }
                this.m_healthBar.alpha -= (this.m_healthBar.alpha > 0 && this.m_hurtDelay <= 0) ? 0.02 : 0;
                this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) + 20, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
                this.m_healthBar.value = this.m_health / this.m_maxHealth;
            };
            Laya.timer.frameLoop(1, this, healthBarFunc);
        }
        slashLightEffect(enemy) {
            let slashLightEffect = new Laya.Animation();
            let sourceArray = ["comp/NewSlahLight.atlas", "comp/NewSlashLight90.atlas", "comp/NewSlashLight-43.5.atlas"];
            let sourceNum = Math.floor(Math.random() * 3);
            slashLightEffect.scaleX = 3;
            slashLightEffect.scaleY = 2.6;
            slashLightEffect.interval = 15;
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 40, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            slashLightEffect.filters = [colorFilter];
            slashLightEffect.pos(this.m_isFacingRight ? enemy.x - 760 : enemy.x - 760, enemy.y - 640 + 30);
            slashLightEffect.source = sourceArray[sourceNum];
            slashLightEffect.alpha = 1;
            slashLightEffect.on(Laya.Event.COMPLETE, this, function () {
                Laya.stage.removeChild(slashLightEffect);
                slashLightEffect.destroy();
                slashLightEffect.destroyed = true;
            });
            Laya.stage.addChild(slashLightEffect);
            ZOrderManager.setZOrder(slashLightEffect, 60);
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
                ZOrderManager.setZOrder(atkCircle, 0);
                atkBoxCollider.tag = this.m_atkTag;
                this.m_atkTimer = 100;
            }, 500);
            setTimeout(() => {
                Laya.stage.removeChild(atkCircle);
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 600);
            setTimeout(() => {
                this.m_atkCd = true;
            }, 1000);
            if (!this.m_moveDelayTimer)
                this.delayMove(0.1);
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
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.m_animation.filters = [colorFilter];
            setTimeout(() => {
                if (!this.m_animation || this.m_animation.destroyed) {
                    return;
                }
                this.m_animation.alpha = 1;
                this.m_animation.filters = null;
            }, 200);
        }
        setEnemyEliteColor() {
            if (this.m_animation.destroyed || !this.m_animation)
                return;
            this.m_animation.alpha = 1;
            let colorMat = [
                0, 0, 1, 0, 10,
                0, 1, 0, 0, 10,
                0, 0, 0, 0, 10,
                0, 0, 0, 1, 0,
            ];
            let colorFilter = new Laya.ColorFilter(colorMat);
            let timer = setInterval(() => {
                if (!this.m_animation || this.m_animation.destroyed) {
                    clearInterval(timer);
                    return;
                }
                this.m_animation.filters = [colorFilter];
            }, 100);
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
            this.m_mdelay = 0.5;
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
                ZOrderManager.setZOrder(aliveEnemy[i]._ent.m_animation, -15);
                Laya.stage.removeChild(aliveEnemy[i]._ent.m_animation);
                aliveEnemy[i]._ent.m_animation.destroy();
                aliveEnemy[i]._ent.m_animation.destroyed = true;
            }
            this.enemyPool = [];
        }
    }
    EnemyHandler.enemyIndex = 0;
    EnemyHandler.enemyPool = [];

    class BackToVillage extends Laya.Script {
        onStart() {
            Laya.stage.once(Laya.Event.CLICK, this, this.nextStep);
        }
        onKeyUp(e) {
            if (e.keyCode === 32) {
                this.nextStep();
            }
        }
        nextStep() {
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
            EnemyHandler.clearAllEnemy();
            let missionManager = new MissionManager();
            missionManager.generateMissionData(9);
            missionManager.showMissionUI();
        }
    }

    class Loading extends Laya.Script {
        constructor() {
            super(...arguments);
            this.resourceLoad = [
                'Audio/Attack/Attack0.wav',
                'Audio/Attack/Attack1.wav',
                "Audio/Bgm/BGM01.mp3",
                'Audio/EnemyHurt/EnemyHurt0.wav',
                'Audio/EnemyHurt/EnemyHurt1.wav',
                'Audio/Misc/wind.wav',
                "Audio/Misc/dash.wav",
                "Audio/Misc/cat.mp3",
                "Audio/Misc/blackhole.wav",
                "font/silver.ttf",
                "Background(0912)/Red Forest/Red Forest(0912).png",
                "Background(0912)/gray town(1126).png",
                "Background(0912)/Loading2.png",
                "Background(0912)/blackBg.png",
                "Background(0912)/Gray Town/0.gray town_bgrd.png",
                "Background(0912)/Gray Town/1.gray town_bgrd.png",
                "Background(0912)/Gray Town/2.gray town_bgrd.png",
                "Background(0912)/Gray Town/3.gray town_bgrd.png",
                "Background(0912)/Gray Town/4.gray town_ground.png",
                "Background(0912)/Red Forest/0.red forest_bgrd.png",
                "Background(0912)/Red Forest/1.red forest_bgrd_tree1.png",
                "Background(0912)/Red Forest/3.red forest_bgrd_tree3.png",
                "Background(0912)/Red Forest/4.red forest_grass.png",
                "Background(0912)/Red Forest/5.red forest_ground.png",
                "Background(0912)/Red Forest/6.red forest_black.png",
                "character/Idle.atlas",
                "character/Attack1.atlas",
                "character/Attack2.atlas",
                "character/Erosion.atlas",
                "character/Run.atlas",
                "character/Slam.atlas",
                "character/Sprint.atlas",
                "comp/WalkEffects.atlas",
                "comp/Hurt.atlas",
                "comp/BlackHole.atlas",
                "UI/icon/blackholeA.png",
                "UI/icon/blackholeB.png",
                "comp/BlackExplosion.atlas",
                "UI/icon/blackholeA.png",
                "UI/icon/blackholeB.png",
                "comp/NewBlood.atlas",
                "comp/Slam.atlas",
                "UI/icon/slamA.png",
                "UI/icon/slamB.png",
                "comp/Target.atlas",
                "comp/TargetSlash.atlas",
                "UI/icon/beheadA.png",
                "UI/icon/beheadB.png",
                "comp/Spike.atlas",
                "UI/icon/spikeA.png",
                "UI/icon/spikeB.png",
                "comp/NewSlash_1.atlas",
                "comp/NewSlash_2.atlas",
                "comp/SlashLight.atlas",
                "comp/FireBall.atlas",
                "normalEnemy/Attack.atlas",
                "normalEnemy/Idle.atlas",
                "normalEnemy/Walk.atlas",
                "comp/NewSlahLight.atlas",
                "comp/NewSlashLight90.atlas",
                "comp/NewSlashLight-43.5.atlas",
                'UI/mobile/mobileLeftBtn.png',
                'UI/mobile/mobileRightBtn.png',
                'UI/mobile/mobileAtkBtn.png',
                'UI/mobile/mobileSprintBtn.png',
                'UI/mobile/mobileBehead.png',
                'UI/mobile/mobileSpike.png',
                'UI/mobile/mobileBlackhole.png',
                'UI/mobile/mobileSlam.png',
                'UI/mobile/mobileEmpty.png',
                'UI.png',
                "UI/Zbtn.png",
                "UI/Xbtn.png",
                "UI/Cbtn.png",
                "UI/reinforce.png",
                "UI/hp.png",
                "comp/progress.png",
                "comp/prog.png",
                "UI/arrP.png",
                "UI/arrR.png",
                "UI/reinforce.png",
                "UI/skip.png",
                "UI/skip2.png",
                'UI/ending/chooseSkill.png',
                'UI/ending/skillBox.png',
                "UI/ending/infoBox.png",
                'UI/leftArr.png',
                'UI/rightArr.png',
                'UI/ending/ending.png',
                'UI/ending/gold.png',
                'UI/ending/crystal.png',
                'UI/anykey.png',
                "UI/bp_100.png",
                "UI/bp_150.png",
                "UI/Box.png",
                "UI/icon/sprint.png",
                "UI/Gold.png",
                "UI/chioce_mission.png",
                "UI/skull.png",
                "UI/star.png",
                "UI/chioce_mission_button_Bright.png",
                "UI/chioce_mission_button_Dark.png",
                'UI/tutorial/1.png',
                'UI/tutorial/2.png',
                'UI/tutorial/3.png',
                'UI/tutorial/4.png',
                'UI/tutorial/5.png',
                'UI/tutorial/6.png',
                'UI/tutorial/7.png',
            ];
        }
        onStart() {
            this.setProgressBar();
            Laya.loader.load(this.resourceLoad, null, Laya.Handler.create(this, this.onProgress, null, false));
        }
        setProgressBar() {
            this.loadingProgress = new Laya.ProgressBar("comp/prog.png");
            this.loadingProgress.width = 700;
            this.loadingProgress.height = 20;
            this.loadingProgress.sizeGrid = "0,10,0,10";
            this.loadingProgress.pos(333, 487);
            this.loadingProgress.value = 0.5;
            Laya.stage.addChild(this.loadingProgress);
            ZOrderManager.setZOrder(this.loadingProgress, 101);
        }
        onProgress(value) {
            this.loadingProgress.value = value;
            if (this.loadingProgress.value >= 1) {
                this.loadingProgress.value = 1;
                new MissionManager().firstEnter();
                if (Village.isNewbie) {
                    SceneInit.currentMap = "NewbieForest";
                    Laya.Scene.open("Newbie_scroll.scene");
                }
                Laya.stage.removeChild(this.loadingProgress);
                this.loadingProgress.destroy();
                return;
            }
        }
    }

    class MainToLoading extends Laya.Script {
        constructor() {
            super(...arguments);
            this.windBgm = 'Audio/Misc/wind.wav';
            this.mainToLoadFunc = () => { };
        }
        onAwake() {
            Laya.loader.load(this.windBgm, Laya.Handler.create(this, () => {
                Laya.SoundManager.playMusic(this.windBgm, 0);
                Laya.SoundManager.setMusicVolume(0.8);
            }));
            this.mainToLoadFunc = () => {
                Laya.stage.removeChild(this.dirtEffect);
                this.dirtEffect.destroy();
                Laya.Scene.open('Loading.scene', true, 0, Laya.Handler.create(this, () => {
                    Laya.Scene.destroy("Main.scene");
                }));
            };
        }
        onKeyDown() {
            this.mainToLoadFunc();
        }
        onStart() {
            this.createDirtEffect();
            Laya.stage.on(Laya.Event.CLICK, this, () => {
                this.mainToLoadFunc();
                Laya.stage.off(Laya.Event.CLICK, this, this.mainToLoadFunc);
            });
        }
        createDirtEffect() {
            this.dirtEffect = new Laya.Animation();
            this.dirtEffect.source = "comp/DirtEffect.atlas";
            this.dirtEffect.scaleX = 3.4;
            this.dirtEffect.scaleY = 2;
            let posX = 20;
            let posY = -100;
            this.dirtEffect.interval = 45;
            this.dirtEffect.pos(posX, posY);
            let colorMat = [
                1, 0, 0, 0, 500,
                0, 1, 0, 0, 500,
                0, 0, 1, 0, 500,
                0, 0, 0, 1, 0,
            ];
            let glowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
            let colorFilter = new Laya.ColorFilter(colorMat);
            this.dirtEffect.filters = [colorFilter];
            this.dirtEffect.alpha = 0.5;
            Laya.stage.addChild(this.dirtEffect);
            ZOrderManager.setZOrder(this.dirtEffect, 100);
            this.dirtEffect.play();
        }
    }

    class NewbieBackground extends Laya.Script {
        constructor() {
            super(...arguments);
            this.bg2LastX = 0;
        }
        onStart() {
            this.backgroundImageInit();
            setInterval(() => {
                Laya.Tween.to(this.bg2, {
                    x: this.bg2LastX - 5,
                }, 50, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    this.bg2LastX = this.bg2.x;
                }));
            }, 50);
        }
        backgroundImageInit() {
            this.bg1 = new Laya.Sprite();
            this.bg2 = new Laya.Sprite();
            this.bg3 = new Laya.Sprite();
            this.bg1.pos(0, 0);
            this.bg2.pos(0, -50);
            this.bg3.pos(0, -70);
            this.bg1.loadImage('Background/nBg1.png');
            this.bg2.loadImage('Background/nBg2.png');
            this.bg3.loadImage('Background/nBg3.png');
            Laya.stage.addChild(this.bg2);
            Laya.stage.addChild(this.bg3);
            Laya.stage.addChild(this.bg1);
        }
        backgroundImageHandler() {
            let player = CharacterInit.playerEnt.m_animation;
            Laya.Tween.to(this.bg2, {
                x: player.x - 500,
            }, 50, Laya.Ease.linearInOut, null);
            Laya.Tween.to(this.bg1, {
                x: player.x - 500,
            }, 10, Laya.Ease.linearInOut, null);
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
            reg("script/Loading2.ts", Loading2);
            reg("script/MainToLoading.ts", MainToLoading);
            reg("script/Tutorial.ts", Turtorial);
            reg("script/NewbieBackground.ts", NewbieBackground);
        }
    }
    GameConfig.width = 1366;
    GameConfig.height = 768;
    GameConfig.scaleMode = "exactfit";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
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
