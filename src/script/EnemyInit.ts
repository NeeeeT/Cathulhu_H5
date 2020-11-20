import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";
import { ExtraData } from "./ExtraData";
import MissionManager from "./MissionManager";
import SkillList from "./SkillList";
import Village from "./Village";

export default class EnemyInit extends Laya.Script{

    public static missionEnemyNum;
    public static missionRewardGoldValue;
    public static missionRewardCrystalValue;
    public static isWin;

    /** @prop {name:enemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;
    /** @prop {name:enemyLeft,tips:"生成的敵人數量",type:int,default:50}*/
    enemyLeft: number = 50;
    /** @prop {name:roundTimeLeft,tips:"回合的時間限制(sec)",type:int,default:180}*/
    roundTimeLeft: number = 180;

    /** @prop {name:NormalEnemyHealth,tips:"普通敵人血量",type:int,default:1000}*/
    public NormalEnemyHealth: number = 1000;
    /** @prop {name:NormalEnemyDmg,tips:"普通敵人攻擊力",type:int,default:33}*/
    public NormalEnemyDmg: number = 33;
    /** @prop {name:NormalEnemyCritical,tips:"普通敵人爆擊率",type:int,default:33}*/
    public NormalEnemyCritical: number = 33;
    /** @prop {name:NormalEnemyCriticalDmgMultiplier,tips:"普通敵人爆傷倍率",type:int,default:3}*/
    public NormalEnemyCriticalDmgMultiplier: number = 3;

    /** @prop {name:ShieldEnemyHealth,tips:"裝甲敵人血量",type:int,default:1500}*/
    public ShieldEnemyHealth: number = 1500;
    /** @prop {name:ShieldEnemyDmg,tips:"裝甲敵人攻擊力",type:int,default:30}*/
    public ShieldEnemyDmg: number = 30;
    /** @prop {name:ShieldEnemyCritical,tips:"裝甲敵人爆擊率",type:int,default:33}*/
    public ShieldEnemyCritical: number = 33;
    /** @prop {name:ShieldEnemyCriticalDmgMultiplier,tips:"裝甲敵人爆傷倍率",type:int,default:3}*/
    public ShieldEnemyCriticalDmgMultiplier: number = 3;

    /** @prop {name:FastEnemyHealth,tips:"快攻敵人血量",type:int,default:500}*/
    public FastEnemyHealth: number = 500;
    /** @prop {name:FastEnemyDmg,tips:"快攻敵人攻擊力",type:int,default:70}*/
    public FastEnemyDmg: number = 70;
    /** @prop {name:FastEnemyCritical,tips:"快攻敵人爆擊率",type:int,default:33}*/
    public FastEnemyCritical: number = 33;
    /** @prop {name:FastEnemyCriticalDmgMultiplier,tips:"快攻敵人爆傷倍率",type:int,default:3}*/
    public FastEnemyCriticalDmgMultiplier: number = 3;
    
    /** @prop {name:NewbieEnemyHealth,tips:"新手敵人血量",type:int,default:5000}*/
    public NewbieEnemyHealth: number = 5000;
    /** @prop {name:NewbieEnemyDmg,tips:"新手敵人攻擊力",type:int,default:0}*/
    public NewbieEnemyDmg: number = 0;
    /** @prop {name:NewbieEnemyCritical,tips:"新手敵人爆擊率",type:int,default:0}*/
    public NewbieEnemyCritical: number = 0;
    /** @prop {name:NewbieEnemyCriticalDmgMultiplier,tips:"新手敵人爆傷倍率",type:int,default:0}*/
    public NewbieEnemyCriticalDmgMultiplier: number = 0;

    roundDetectTimer = null;
    generateTimer = null;

    battleToggle = true;
    battleTimer = null;

    timeLeftValue: number;
    enemyLeftIcon: Laya.Sprite;
    enemyInfo: Laya.Text;
    
    public static enemyLeftCur: number;
    public static newbieDone: boolean;

    endingRewardUI: Laya.Sprite;
    endingSkillUI: Laya.Sprite;
    
    rewardGold: Laya.Sprite;
    rewardCrystal: Laya.Sprite;
    rewardGoldText: Laya.Text;
    rewardCrystalText: Laya.Text;

    rewardGoldValue: number = 500;
    rewardCrystalValue: number = 100;

    skillCat: Laya.Sprite;
    skillHuman: Laya.Sprite;
    skillCatIcon: Laya.Sprite;
    skillHumanIcon: Laya.Sprite;
    
    leftArrow: Laya.Sprite;
    rightArrow: Laya.Sprite;

    skillCatInfo: Laya.Sprite;
    skillHumanInfo: Laya.Sprite;

    skillCatInfoText: Laya.Text;
    skillHumanInfoText: Laya.Text;

    skillCatBtn: Laya.Button;
    skillHumanBtn: Laya.Button;
    skillCatBtnPos: object;
    skillHumanBtnPos: object;
    r1: number
    r2: number

    catSkillName: Laya.Text;
    humanSkillName: Laya.Text;

    villageManager: Village = new Village();
    missionManager: MissionManager = new MissionManager();

    
    constructor(){
        super();
    }
    onAwake() {
        this.updateMissionData();
    }
    onStart(){
        this.timeLeftValue = this.roundTimeLeft;
        EnemyInit.enemyLeftCur = this.enemyLeft;

        let player = CharacterInit.playerEnt.m_animation;
        let enemy = EnemyHandler.enemyPool;

        console.log(enemy);
        EnemyInit.isWin = false;

        this.generateTimer = setInterval(() =>{
            if(player.destroyed){
                EnemyHandler.clearAllEnemy();
                clearInterval(this.generateTimer);
                this.generateTimer = null;
                return;
            }
            if(this.enemyLeft <= 0 || EnemyInit.isWin){
                clearInterval(this.generateTimer);
                this.generateTimer = null;
                return;
            }
            if(EnemyHandler.getEnemiesCount() >= 10) return;
            let x = Math.floor(Math.random() * 3) + 1; //1~3
            // console.log("是否為新手關卡：",Village.isNewbie);
            
            if (Village.isNewbie) {
                // console.log("生成新手敵人");
                // EnemyHandler.generator(player, 4, 0);
                // 此處改由Tutorial.ts呼叫
            } else {
                EnemyHandler.generator(player, x, 0);
            }
            this.enemyLeft--;
        }, this.enemyGenerateTime);

        this.battleTimer = setInterval(()=>{
            if(!player || player.destroyed){
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }            
            if((EnemyInit.enemyLeftCur <= 0 && !Village.isNewbie) || (Village.isNewbie && EnemyInit.newbieDone)){
                this.battleToggle = false;
                Village.isNewbie = false;
                EnemyInit.newbieDone = false;
                EnemyInit.isWin = true;
                // this.updateMissionData();
                CharacterInit.playerEnt.clearAddDebuffTimer();
                CharacterInit.playerEnt.removeAllDebuff();
                Laya.Tween.to(player, {alpha: 0.8}, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                    this.showEndRewardUI();
                }), 0);
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                CharacterInit.playerEnt.m_rigidbody.linearVelocity = {x:0,y:0};
                EnemyHandler.clearAllEnemy();
                return;
            }
            else if(this.timeLeftValue < 0){
                EnemyHandler.clearAllEnemy();
                // console.log('時間到! 你輸了:(');
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                //消除角色身上所有Debuff與Debuff計時器
                CharacterInit.playerEnt.clearAddDebuffTimer();
                CharacterInit.playerEnt.removeAllDebuff();
                CharacterInit.playerEnt.death();
                return;
            }
            this.timeLeftValue--;
        }, 1000);
        this.showBattleInfo();
    }
    onKeyUp(e: Laya.Event){
        let player = CharacterInit.playerEnt
        if(Village.reinforceToggle && e.keyCode === 32){
            this.villageManager.clearReinforceUI();
            // new MissionManager().showMissionUI();
        }
        if(this.endingRewardUI && e.keyCode === 32){
            Laya.Tween.to(this.endingRewardUI, {alpha: 0.3}, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                this.endingRewardUI.destroy();
                this.rewardCrystal.destroy();
                this.rewardGold.destroy();
                this.rewardCrystalText.destroy();
                this.rewardGoldText.destroy();
                this.showEndSkill();
            }), 0);
        };
        if(this.endingSkillUI){
            if(e.keyCode === 32){
                if(player.m_isFacingRight){
                    this.skillChoose(2);
                }
                else{
                    this.skillChoose(1);
                }
            }
            if(!this.endingSkillUI.destroyed){
                this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
            }
        }
    }
    onKeyDown(e: Laya.Event){
        if(this.endingSkillUI){
            let player = CharacterInit.playerEnt;
            if(!this.endingSkillUI.destroyed){
                this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
            }
        }
    }
    endTheBattle(): void{
        this.battleToggle = false;
                //新手教學結束
                Village.isNewbie = false;
                EnemyInit.isWin = true;
                //消除角色身上所有Debuff與Debuff計時器
                CharacterInit.playerEnt.clearAddDebuffTimer();
                CharacterInit.playerEnt.removeAllDebuff();
                // this.unsetCharacter();
                Laya.Tween.to(CharacterInit.playerEnt.m_animation, {alpha: 0.8}, 1000, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                    this.showEndRewardUI();
                }), 0);

                clearInterval(this.battleTimer);
                this.battleTimer = null;
                CharacterInit.playerEnt.m_rigidbody.linearVelocity = {x:0,y:0};
    }
    showEndSkill(): void{
        let player = CharacterInit.playerEnt;
        this.endingSkillUI = new Laya.Sprite();
        this.endingSkillUI.width = 684;
        this.endingSkillUI.height = 576;
        this.endingSkillUI.loadImage('ui/ending/chooseSkill.png');

        this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.m_animation.x - 325), 30);//544 - 450 = 94
        this.endingSkillUI.alpha = 0.5;

        player.m_animation.pos(this.endingSkillUI.x + this.endingSkillUI.width/2, player.m_animation.y);

        let pos:object = {
            'x': this.endingSkillUI.x,
            'y': this.endingSkillUI.y,
        }

        this.skillCat = new Laya.Sprite();
        this.skillHuman = new Laya.Sprite();
        this.skillCat.width = this.skillHuman.width = 130;
        this.skillCat.height = this.skillHuman.height = 130;
        this.skillCat.pos(pos['x']+136, pos['y']+140);
        this.skillHuman.pos(pos['x']+418, pos['y']+140);
        this.skillCat.loadImage('ui/ending/skillBox.png');
        this.skillHuman.loadImage('ui/ending/skillBox.png');

        this.r1 = Math.floor(Math.random()*2);
        this.r2 = Math.floor(Math.random()*2);
        this.skillCatIcon = new Laya.Sprite();
        this.skillHumanIcon = new Laya.Sprite();
        this.skillCatIcon.width = this.skillHumanIcon.width = 100;
        this.skillCatIcon.height = this.skillHumanIcon.height = 100;
        this.skillCatIcon.pos(this.skillCat.x+15,this.skillCat.y+15);
        this.skillHumanIcon.pos(this.skillHuman.x+15, this.skillHuman.y+15);
        this.skillCatIcon.loadImage(SkillList.catSkillList[this.r1].m_iconB);
        this.skillHumanIcon.loadImage(SkillList.humanSkillList[this.r2].m_iconB);
        this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
        this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;

        this.skillCatBtn = new Laya.Button();
        this.skillHumanBtn = new Laya.Button();
        this.skillCatBtn.width = this.skillHumanBtn.width = 92;
        this.skillCatBtn.height = this.skillHumanBtn.height = 33;
        this.skillCatBtn.pos(pos['x'] + 155, pos['y'] + 302);  
        this.skillHumanBtn.pos(pos['x']+442, pos['y']+302);
        this.skillCatBtn.loadImage("ui/ending/chooseBtn.png")
        this.skillHumanBtn.loadImage("ui/ending/chooseBtn.png");


        this.skillCatInfo = new Laya.Sprite();
        this.skillHumanInfo = new Laya.Sprite();
        this.skillCatInfo.width = this.skillHumanInfo.width = 205;
        this.skillCatInfo.height = this.skillHumanInfo.height = 110;
        this.skillCatInfo.pos(pos['x']+96,pos['y']+402);
        this.skillHumanInfo.pos(pos['x']+383,pos['y']+402);
        this.skillCatInfo.loadImage("ui/ending/infoBox.png");
        this.skillHumanInfo.loadImage("ui/ending/infoBox.png");

        this.skillCatInfoText = new Laya.Text();
        this.skillHumanInfoText = new Laya.Text();
        this.catSkillName = new Laya.Text();
        this.humanSkillName = new Laya.Text();
        this.skillCatInfoText.width = this.skillHumanInfoText.width = this.catSkillName.width = this.humanSkillName.width = 167;
        this.skillCatInfoText.height = this.skillHumanInfoText.height = this.catSkillName.height = this.humanSkillName.height = 70;
        this.skillCatInfoText.pos(this.skillCatInfo.x+20,this.skillCatInfo.y+20);
        this.skillHumanInfoText.pos(this.skillHumanInfo.x+20,this.skillHumanInfo.y+20);
        this.catSkillName.pos(pos['x']+115,pos['y']+295);
        this.humanSkillName.pos(pos['x']+405,pos['y']+295);
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
        this.leftArrow.pos(pos['x']+175, pos['y']+340);
        this.rightArrow.pos(pos['x']+457, pos['y']+340);
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

        Laya.Tween.to(this.endingSkillUI, {alpha: 1.0}, 500, Laya.Ease.linearInOut, null, 0);
    }
    skillChoose(type: number): void{
        switch(type){
            case 1:
                ExtraData.currentData['catSkill'] = this.r1+1;
                break;
            case 2:
                ExtraData.currentData['humanSkill'] = this.r2+1;
                break;
            default:
                break;
        }
        ExtraData.saveData();
        this.clearUI();
        this.unsetCharacter();
    }
    unsetCharacter(): void{
        let player = CharacterInit.playerEnt.m_animation;
        Laya.Tween.to(player, {alpha: 0.0}, 2500, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
            player.destroy();
            player.destroyed = true;
            // this.changeToVillage();
            this.villageManager.showReinforceUI();
        }), 0);
    }
    showEndRewardUI(): void{
        let player = CharacterInit.playerEnt.m_animation;
        this.endingRewardUI = new Laya.Sprite();
        this.endingRewardUI.width = 342;
        this.endingRewardUI.height = 288;
        this.endingRewardUI.loadImage('ui/ending/ending.png');
        this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);
        // this.endingRewardUI.pos(-683, 94);
        let pos:object = {
            'x': this.endingRewardUI.x,
            'y': this.endingRewardUI.y,
        }

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

        
        this.rewardCrystal.pos(pos['x']+98,pos['y']+98);
        this.rewardCrystalText.pos(pos['x']+168,pos['y']+104);
        this.rewardGold.pos(pos['x']+94,pos['y']+154);
        this.rewardGoldText.pos(pos['x']+168,pos['y']+161);
        this.rewardCrystal.loadImage('ui/ending/crystal.png')
        this.rewardGold.loadImage('ui/ending/gold.png');

        Laya.stage.addChild(this.endingRewardUI);
        Laya.stage.addChild(this.rewardCrystal);
        Laya.stage.addChild(this.rewardGold);
        Laya.stage.addChild(this.rewardCrystalText);
        Laya.stage.addChild(this.rewardGoldText);
        
        this.endingUpdateData();
    }
    showBattleInfo(): void{
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

        this.roundDetectTimer = setInterval(()=>{
            if(!this.battleToggle || player.destroyed){
                this.enemyInfo.text = "";
                this.enemyInfo.destroy();
                this.enemyLeftIcon.destroy();
                clearInterval(this.roundDetectTimer);
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
            this.enemyInfo.text = (EnemyInit.enemyLeftCur === 0) ? '': 'x' + String(EnemyInit.enemyLeftCur);
            this.enemyLeftIcon.alpha = (EnemyInit.enemyLeftCur === 0) ? 0 : 1;
        }, 5);
    }
    updateMissionData() {
        this.enemyLeft = EnemyInit.missionEnemyNum;
        this.rewardCrystalValue = EnemyInit.missionRewardCrystalValue;
        this.rewardGoldValue = EnemyInit.missionRewardGoldValue;
    }
    endingUpdateData(): void{
        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        // ExtraData.currentData['crystal'] = data.crystal + this.rewardCrystalValue;
        // ExtraData.currentData['gold'] = data.gold + this.rewardGoldValue;
        ExtraData.currentData['gold'] = data.gold + this.rewardCrystalValue;


        ExtraData.saveData();
    }
    changeToVillage(): void{
        EnemyHandler.clearAllEnemy();
        Laya.Scene.load("Loading.scene");
        Laya.Scene.open("Village.scene", true);
        Laya.stage.x = Laya.stage.y = 0; 
        Laya.SoundManager.stopAll();
    }
    clearUI(): void{
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