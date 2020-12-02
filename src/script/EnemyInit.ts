import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";
import { ExtraData } from "./ExtraData";
import MissionManager from "./MissionManager";
import SkillList from "./SkillList";
import Village from "./Village";
import ZOrderManager from "./ZOrderManager";

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
    public NewbieEnemyHealth: number = 1000;
    /** @prop {name:NewbieEnemyDmg,tips:"新手敵人攻擊力",type:int,default:0}*/
    public NewbieEnemyDmg: number = 1;
    /** @prop {name:NewbieEnemyCritical,tips:"新手敵人爆擊率",type:int,default:0}*/
    public NewbieEnemyCritical: number = 20;
    /** @prop {name:NewbieEnemyCriticalDmgMultiplier,tips:"新手敵人爆傷倍率",type:int,default:0}*/
    public NewbieEnemyCriticalDmgMultiplier: number = 0;

    roundDetectTimer = null;
    generateTimer = null;

    battleToggle = true;
    battleTimer = null;

    timeLeftValue: number;
    enemyLeftIcon: Laya.Sprite;
    enemyInfo: Laya.Text;
    
    public static enemyLeftCur: number = 0;
    public static newbieDone: boolean;

    endingRewardUIToggle: boolean = false;
    endingRewardUI: Laya.Sprite;
    endingSkillUIToggle: boolean = false;
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
    onUpdate() {
        // console.log(CharacterInit.playerEnt.m_isFacingRight);
    }
    onStart() {

        this.timeLeftValue = this.roundTimeLeft;
        EnemyInit.enemyLeftCur = this.enemyLeft;

        let player = CharacterInit.playerEnt.m_animation;
        let enemy = EnemyHandler.enemyPool;

        // console.log(enemy);
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
            // else if(this.timeLeftValue < 0){
            //     EnemyHandler.clearAllEnemy();
            //     clearInterval(this.battleTimer);
            //     this.battleTimer = null;
            //     CharacterInit.playerEnt.clearAddDebuffTimer();
            //     CharacterInit.playerEnt.removeAllDebuff();
            //     CharacterInit.playerEnt.death();
            //     return;
            // }
            this.timeLeftValue--;
        }, 1000);
        this.showBattleInfo();
        if (Laya.Browser.onMobile) {
            this.mobileClick();
        }
    }
    mobileClick(): void {

        let mobileAtkBtnConfirmFunc = function () {
            let player = CharacterInit.playerEnt
            if (Village.reinforceToggle) {
                this.villageManager.clearReinforceUI();
                // new MissionManager().showMissionUI();
            }
            if (this.endingRewardUIToggle) {
                Laya.Tween.to(this.endingRewardUI, { alpha: 0.0 }, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                    // this.endingRewardUI.destroy();
                    // this.rewardCrystal.destroy();
                    // this.rewardGold.destroy();
                    // this.rewardCrystalText.destroy();
                    // this.rewardGoldText.destroy();
                    this.clearEndRewardUI();
                    this.showEndSkillUI();
                }), 0);
            };
            if (this.endingSkillUIToggle) {
                // if(e.keyCode === 32){
                if (player.m_isFacingRight) {
                    this.skillChoose(2);
                }
                else {
                    this.skillChoose(1);
                }
                // }
                if (!this.endingSkillUIToggle) {
                    this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                    this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                }
            }
        }

        let mobileMoveBtnChooseFunc = function () {
            if (this.endingSkillUI) {
                let player = CharacterInit.playerEnt
                if (!this.endingSkillUI.destroyed) {
                    this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
                    this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
                    this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
                }
            }
        }

        //reset
        CharacterInit.playerEnt.m_mobileAtkBtn.off(Laya.Event.CLICK, this, mobileAtkBtnConfirmFunc);
        CharacterInit.playerEnt.m_mobileLeftBtn.off(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
        CharacterInit.playerEnt.m_mobileRightBtn.off(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
        //-------------------------
        CharacterInit.playerEnt.m_mobileAtkBtn.on(Laya.Event.CLICK, this, mobileAtkBtnConfirmFunc);
        CharacterInit.playerEnt.m_mobileLeftBtn.on(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
        CharacterInit.playerEnt.m_mobileRightBtn.on(Laya.Event.CLICK, this, mobileMoveBtnChooseFunc);
    }
    onKeyUp(e: Laya.Event){
        let player = CharacterInit.playerEnt
        if(Village.reinforceToggle && e.keyCode === 32){
            this.villageManager.clearReinforceUI();
            // new MissionManager().showMissionUI();
        }
        if(this.endingRewardUIToggle && e.keyCode === 32){
            Laya.Tween.to(this.endingRewardUI, {alpha: 0.3}, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                // this.endingRewardUI.destroy();
                // this.rewardCrystal.destroy();
                // this.rewardGold.destroy();
                // this.rewardCrystalText.destroy();
                // this.rewardGoldText.destroy();

                // Laya.stage.removeChild(this.endingRewardUI);
                // Laya.stage.removeChild(this.rewardCrystal);
                // Laya.stage.removeChild(this.rewardGold);
                // Laya.stage.removeChild(this.rewardCrystalText);
                // Laya.stage.removeChild(this.rewardGoldText);

                // Laya.Pool.recover("endingRewardUI",this.endingRewardUI);
                // Laya.Pool.recover("rewardCrystal",this.rewardCrystal);
                // Laya.Pool.recover("rewardGold",this.rewardGold);
                // Laya.Pool.recover("rewardCrystalText",this.rewardCrystalText);
                // Laya.Pool.recover("rewardGoldText",this.rewardGoldText);

                this.clearEndRewardUI();
                this.showEndSkillUI();
            }), 0);
        };
        if(this.endingSkillUIToggle){
            if(e.keyCode === 32){
                if(player.m_isFacingRight){
                    this.skillChoose(2);
                }
                else{
                    this.skillChoose(1);
                }
            }
            // if(!this.endingSkillUIToggle){
            this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
            this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
            this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
            this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
            // console.log(CharacterInit.playerEnt.m_isFacingRight);
            // }
        }
    }
    // onKeyDown(e: Laya.Event){
    //     if(this.endingSkillUIToggle){
    //         let player = CharacterInit.playerEnt;
    //         this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
    //         this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;
    //         this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
    //         this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
    //         console.log('ooo!');
    //         console.log(CharacterInit.playerEnt.m_isFacingRight);
    //     }
    // }
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

    //新的
    showEndSkillUI(): void{
        if(this.endingSkillUIToggle) return;

        let player = CharacterInit.playerEnt;

        this.endingSkillUIToggle = true;

        // this.endingSkillUI = new Laya.Sprite();
        this.endingSkillUI = Laya.Pool.getItemByClass("endingSkillUI", Laya.Sprite);
        this.endingSkillUI.width = 684;
        this.endingSkillUI.height = 576;
        this.endingSkillUI.loadImage('UI/ending/chooseSkill.png');

        this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.m_animation.x - 325), 30);//544 - 450 = 94
        this.endingSkillUI.alpha = 0.5;

        player.m_animation.pos(this.endingSkillUI.x + this.endingSkillUI.width/2, player.m_animation.y);

        let pos:object = {
            'x': this.endingSkillUI.x,
            'y': this.endingSkillUI.y,
        }

        // this.skillCat = new Laya.Sprite();
        this.skillCat = Laya.Pool.getItemByClass("skillCat", Laya.Sprite);
        // this.skillHuman = new Laya.Sprite();
        this.skillHuman = Laya.Pool.getItemByClass("skillHuman", Laya.Sprite);

        this.skillCat.width = this.skillHuman.width = 130;
        this.skillCat.height = this.skillHuman.height = 130;
        this.skillCat.pos(pos['x']+136, pos['y']+140);
        this.skillHuman.pos(pos['x']+418, pos['y']+140);
        this.skillCat.loadImage('UI/ending/skillBox.png');
        this.skillHuman.loadImage('UI/ending/skillBox.png');

        this.r1 = Math.floor(Math.random()*2);
        this.r2 = Math.floor(Math.random()*2);
        // this.skillCatIcon = new Laya.Sprite();
        this.skillCatIcon = Laya.Pool.getItemByClass("skillCatIcon", Laya.Sprite);
        // this.skillHumanIcon = new Laya.Sprite();
        this.skillHumanIcon = Laya.Pool.getItemByClass("skillHumanIcon", Laya.Sprite);

        this.skillCatIcon.width = this.skillHumanIcon.width = 100;
        this.skillCatIcon.height = this.skillHumanIcon.height = 100;
        this.skillCatIcon.pos(this.skillCat.x+15,this.skillCat.y+15);
        this.skillHumanIcon.pos(this.skillHuman.x+15, this.skillHuman.y+15);
        this.skillCatIcon.loadImage(SkillList.catSkillList[this.r1].m_iconB);
        this.skillHumanIcon.loadImage(SkillList.humanSkillList[this.r2].m_iconB);
        this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
        this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;

        // this.skillCatInfo = new Laya.Sprite();
        this.skillCatInfo = Laya.Pool.getItemByClass("skillCatInfo", Laya.Sprite);
        // this.skillHumanInfo = new Laya.Sprite();
        this.skillHumanInfo = Laya.Pool.getItemByClass("skillHumanInfo", Laya.Sprite);

        this.skillCatInfo.width = this.skillHumanInfo.width = 205;
        this.skillCatInfo.height = this.skillHumanInfo.height = 110;
        this.skillCatInfo.pos(pos['x']+96,pos['y']+402);
        this.skillHumanInfo.pos(pos['x']+383,pos['y']+402);
        this.skillCatInfo.loadImage("UI/ending/infoBox.png");
        this.skillHumanInfo.loadImage("UI/ending/infoBox.png");

        // this.skillCatInfoText = new Laya.Text();
        this.skillCatInfoText = Laya.Pool.getItemByClass("skillCatInfoText", Laya.Text);
        // this.skillHumanInfoText = new Laya.Text();
        this.skillHumanInfoText = Laya.Pool.getItemByClass("skillHumanInfoText", Laya.Text);
        // this.catSkillName = new Laya.Text();
        this.catSkillName = Laya.Pool.getItemByClass("catSkillName", Laya.Text);
        // this.humanSkillName = new Laya.Text();
        this.humanSkillName = Laya.Pool.getItemByClass("humanSkillName", Laya.Text);

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
        this.skillCatInfoText.fontSize = this.skillHumanInfoText.fontSize = this.catSkillName.fontSize = this.humanSkillName.fontSize = 32;
        this.skillCatInfoText.wordWrap = this.skillHumanInfoText.wordWrap = true;

        // this.leftArrow = new Laya.Sprite();
        this.leftArrow = Laya.Pool.getItemByClass("leftArrow", Laya.Sprite);
        // this.rightArrow = new Laya.Sprite();
        this.rightArrow = Laya.Pool.getItemByClass("rightArrow", Laya.Sprite);

        this.leftArrow.pos(pos['x']+175, pos['y']+340);
        this.rightArrow.pos(pos['x']+457, pos['y']+340);
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

        Laya.Tween.to(this.endingSkillUI, {alpha: 1.0}, 500, Laya.Ease.linearInOut, null, 0);
    }



    //原本的
    // showEndSkill(): void{
    //     let player = CharacterInit.playerEnt;
    //     this.endingSkillUI = new Laya.Sprite();
    //     this.endingSkillUI.width = 684;
    //     this.endingSkillUI.height = 576;
    //     this.endingSkillUI.loadImage('UI/ending/chooseSkill.png');

    //     this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.m_animation.x - 325), 30);//544 - 450 = 94
    //     this.endingSkillUI.alpha = 0.5;

    //     player.m_animation.pos(this.endingSkillUI.x + this.endingSkillUI.width/2, player.m_animation.y);

    //     let pos:object = {
    //         'x': this.endingSkillUI.x,
    //         'y': this.endingSkillUI.y,
    //     }

    //     this.skillCat = new Laya.Sprite();
    //     this.skillHuman = new Laya.Sprite();
    //     this.skillCat.width = this.skillHuman.width = 130;
    //     this.skillCat.height = this.skillHuman.height = 130;
    //     this.skillCat.pos(pos['x']+136, pos['y']+140);
    //     this.skillHuman.pos(pos['x']+418, pos['y']+140);
    //     this.skillCat.loadImage('UI/ending/skillBox.png');
    //     this.skillHuman.loadImage('UI/ending/skillBox.png');

    //     this.r1 = Math.floor(Math.random()*2);
    //     this.r2 = Math.floor(Math.random()*2);
    //     this.skillCatIcon = new Laya.Sprite();
    //     this.skillHumanIcon = new Laya.Sprite();
    //     this.skillCatIcon.width = this.skillHumanIcon.width = 100;
    //     this.skillCatIcon.height = this.skillHumanIcon.height = 100;
    //     this.skillCatIcon.pos(this.skillCat.x+15,this.skillCat.y+15);
    //     this.skillHumanIcon.pos(this.skillHuman.x+15, this.skillHuman.y+15);
    //     this.skillCatIcon.loadImage(SkillList.catSkillList[this.r1].m_iconB);
    //     this.skillHumanIcon.loadImage(SkillList.humanSkillList[this.r2].m_iconB);
    //     this.skillHumanIcon.alpha = player.m_isFacingRight ? 1 : 0.2;
    //     this.skillCatIcon.alpha = player.m_isFacingRight ? 0.2 : 1;

    //     this.skillCatInfo = new Laya.Sprite();
    //     this.skillHumanInfo = new Laya.Sprite();
    //     this.skillCatInfo.width = this.skillHumanInfo.width = 205;
    //     this.skillCatInfo.height = this.skillHumanInfo.height = 110;
    //     this.skillCatInfo.pos(pos['x']+96,pos['y']+402);
    //     this.skillHumanInfo.pos(pos['x']+383,pos['y']+402);
    //     this.skillCatInfo.loadImage("UI/ending/infoBox.png");
    //     this.skillHumanInfo.loadImage("UI/ending/infoBox.png");

    //     this.skillCatInfoText = new Laya.Text();
    //     this.skillHumanInfoText = new Laya.Text();
    //     this.catSkillName = new Laya.Text();
    //     this.humanSkillName = new Laya.Text();
    //     this.skillCatInfoText.width = this.skillHumanInfoText.width = this.catSkillName.width = this.humanSkillName.width = 167;
    //     this.skillCatInfoText.height = this.skillHumanInfoText.height = this.catSkillName.height = this.humanSkillName.height = 70;
    //     this.skillCatInfoText.pos(this.skillCatInfo.x+20,this.skillCatInfo.y+20);
    //     this.skillHumanInfoText.pos(this.skillHumanInfo.x+20,this.skillHumanInfo.y+20);
    //     this.catSkillName.pos(pos['x']+115,pos['y']+295);
    //     this.humanSkillName.pos(pos['x']+405,pos['y']+295);
    //     this.skillCatInfoText.text = SkillList.catSkillList[this.r1].m_info;
    //     this.skillHumanInfoText.text = SkillList.humanSkillList[this.r2].m_info;
    //     this.catSkillName.text = SkillList.catSkillList[this.r1].m_name;
    //     this.humanSkillName.text = SkillList.humanSkillList[this.r2].m_name;
    //     this.catSkillName.align = this.humanSkillName.align = 'center';
    //     this.skillCatInfoText.font = this.skillHumanInfoText.font = this.catSkillName.font = this.humanSkillName.font = 'silver';
    //     this.skillCatInfoText.color = this.skillHumanInfoText.color = this.catSkillName.color = this.humanSkillName.color = '#fdfdfd';
    //     this.skillCatInfoText.fontSize = this.skillHumanInfoText.fontSize = this.catSkillName.fontSize = this.humanSkillName.fontSize = 32;
    //     this.skillCatInfoText.wordWrap = this.skillHumanInfoText.wordWrap = true;

    //     this.leftArrow = new Laya.Sprite();
    //     this.rightArrow = new Laya.Sprite();
    //     this.leftArrow.pos(pos['x']+175, pos['y']+340);
    //     this.rightArrow.pos(pos['x']+457, pos['y']+340);
    //     this.leftArrow.loadImage('UI/leftArr.png');
    //     this.rightArrow.loadImage('UI/rightArr.png');
    //     this.rightArrow.alpha = player.m_isFacingRight ? 1 : 0.2;
    //     this.leftArrow.alpha = player.m_isFacingRight ? 0.2 : 1;
        
    //     Laya.stage.addChild(this.endingSkillUI);
    //     Laya.stage.addChild(this.skillCat);
    //     Laya.stage.addChild(this.skillHuman);
    //     Laya.stage.addChild(this.skillCatIcon);
    //     Laya.stage.addChild(this.skillHumanIcon);
    //     Laya.stage.addChild(this.skillCatInfo);
    //     Laya.stage.addChild(this.skillHumanInfo);
    //     Laya.stage.addChild(this.skillCatInfoText);
    //     Laya.stage.addChild(this.skillHumanInfoText);
    //     Laya.stage.addChild(this.catSkillName);
    //     Laya.stage.addChild(this.humanSkillName);
    //     Laya.stage.addChild(this.leftArrow);
    //     Laya.stage.addChild(this.rightArrow);

    //     Laya.Tween.to(this.endingSkillUI, {alpha: 1.0}, 500, Laya.Ease.linearInOut, null, 0);
    // }
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
        this.clearEndSkillUI();
        CharacterInit.playerEnt.resetMobileBtnEvent();
        this.unsetCharacter();
    }
    unsetCharacter(): void{
        let player = CharacterInit.playerEnt.m_animation;
        Laya.Tween.to(player, { alpha: 0.0 }, 2500, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            Laya.stage.removeChild(player);
            player.destroy();
            player.destroyed = true;
            CharacterInit.generated = false;
            // this.changeToVillage();
            this.villageManager.showReinforceUI();
        }), 0);
    }
    showEndRewardUI(): void{
        let player = CharacterInit.playerEnt.m_animation;

        this.endingRewardUIToggle = true;

        // this.endingRewardUI = new Laya.Sprite();
        this.endingRewardUI = Laya.Pool.getItemByClass("endingRewardUI", Laya.Sprite);
        this.endingRewardUI.width = 342;
        this.endingRewardUI.height = 288;
        this.endingRewardUI.alpha = 1;
        this.endingRewardUI.loadImage('UI/ending/ending.png');
        this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);
        // this.endingRewardUI.pos(-683, 94);
        let pos:object = {
            'x': this.endingRewardUI.x,
            'y': this.endingRewardUI.y,
        }

        // this.rewardCrystal = new Laya.Sprite();
        // this.rewardGold = new Laya.Sprite();
        // this.rewardCrystalText = new Laya.Text();
        // this.rewardGoldText = new Laya.Text();
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

        
        this.rewardCrystal.pos(pos['x']+98,pos['y']+98);
        this.rewardCrystalText.pos(pos['x']+168,pos['y']+104);
        this.rewardGold.pos(pos['x']+94,pos['y']+154);
        this.rewardGoldText.pos(pos['x']+168,pos['y']+161);
        this.rewardCrystal.loadImage('UI/ending/crystal.png')
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

    clearEndRewardUI(): void{
        // this.endingRewardUI.destroy();
        // this.rewardCrystal.destroy();
        // this.rewardGold.destroy();
        // this.rewardCrystalText.destroy();
        // this.rewardGoldText.destroy();

        this.endingRewardUIToggle = false;

        Laya.stage.removeChild(this.endingRewardUI);
        Laya.stage.removeChild(this.rewardCrystal);
        Laya.stage.removeChild(this.rewardGold);
        Laya.stage.removeChild(this.rewardCrystalText);
        Laya.stage.removeChild(this.rewardGoldText);

        Laya.Pool.recover("endingRewardUI",this.endingRewardUI);
        Laya.Pool.recover("rewardCrystal",this.rewardCrystal);
        Laya.Pool.recover("rewardGold",this.rewardGold);
        Laya.Pool.recover("rewardCrystalText",this.rewardCrystalText);
        Laya.Pool.recover("rewardGoldText",this.rewardGoldText);
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

        this.enemyLeftIcon.loadImage('UI/skull.png');
        this.enemyLeftIcon.width = 30;
        this.enemyLeftIcon.height = 40;

        Laya.stage.addChild(this.enemyInfo);
        Laya.stage.addChild(this.enemyLeftIcon);

        ZOrderManager.setZOrder(this.enemyInfo, 105);
        ZOrderManager.setZOrder(this.enemyLeftIcon, 105);

        let roundDetectFunc = function () {
            if(!this.battleToggle || player.destroyed){
                this.enemyInfo.text = "";
                Laya.stage.removeChild(this.enemyInfo);
                Laya.stage.removeChild(this.enemyLeftIcon);
                this.enemyInfo.destroy();
                this.enemyLeftIcon.destroy();
                // clearInterval(this.roundDetectTimer);
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
            this.enemyInfo.text = (EnemyInit.enemyLeftCur === 0) ? '': 'x' + String(EnemyInit.enemyLeftCur);
            this.enemyLeftIcon.alpha = (EnemyInit.enemyLeftCur === 0) ? 0 : 1;
        }
        Laya.timer.frameLoop(1, this, roundDetectFunc);
        // this.roundDetectTimer = setInterval(()=>{
        //     if(!this.battleToggle || player.destroyed){
        //         this.enemyInfo.text = "";
        //         this.enemyInfo.destroy();
        //         this.enemyLeftIcon.destroy();
        //         clearInterval(this.roundDetectTimer);
        //         this.roundDetectTimer = null;
        //         return;
        //     }
        //     if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
        //         this.enemyLeftIcon.pos(player.x - 50, 100);
        //     }
        //     if (Laya.stage.x >= -250) {
        //         this.enemyLeftIcon.pos(935 - 50, 100);
        //     }
        //     if (Laya.stage.x <= -2475) {
        //         this.enemyLeftIcon.pos(3155 - 50, 100);
        //     }

        //     this.enemyInfo.pos(this.enemyLeftIcon.x + 44, this.enemyLeftIcon.y - 2);
        //     this.enemyInfo.text = (EnemyInit.enemyLeftCur === 0) ? '': 'x' + String(EnemyInit.enemyLeftCur);
        //     this.enemyLeftIcon.alpha = (EnemyInit.enemyLeftCur === 0) ? 0 : 1;
        // }, 5);
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
        ExtraData.currentData['gold'] = data.gold + this.rewardGoldValue;


        ExtraData.saveData();
    }
    changeToVillage(): void{
        EnemyHandler.clearAllEnemy();
        Laya.Scene.open("Village.scene", true);
        Laya.stage.x = Laya.stage.y = 0; 
        Laya.SoundManager.stopAll();
    }

    //新的
    clearEndSkillUI(): void{

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

        Laya.Pool.recover("endingSkillUI",this.endingSkillUI);
        Laya.Pool.recover("skillCat",this.skillCat);
        Laya.Pool.recover("skillHuman",this.skillHuman);
        Laya.Pool.recover("skillCatIcon",this.skillCatIcon);
        Laya.Pool.recover("skillHumanIcon",this.skillHumanIcon);
        Laya.Pool.recover("skillCatInfo",this.skillCatInfo);
        Laya.Pool.recover("skillHumanInfo",this.skillHumanInfo);
        Laya.Pool.recover("skillCatInfoText",this.skillCatInfoText);
        Laya.Pool.recover("skillHumanInfoText",this.skillHumanInfoText);
        Laya.Pool.recover("catSkillName",this.catSkillName);
        Laya.Pool.recover("humanSkillName",this.humanSkillName);
        Laya.Pool.recover("leftArrow",this.leftArrow);
        Laya.Pool.recover("rightArrow",this.rightArrow);

        // this.endingSkillUI.destroy();
        // this.skillCat.destroy();
        // this.skillHuman.destroy();
        // this.skillCatIcon.destroy();
        // this.skillHumanIcon.destroy();
        // this.skillCatInfo.destroy();
        // this.skillHumanInfo.destroy();
        // this.skillCatInfoText.destroy();
        // this.skillHumanInfoText.destroy();
        // this.catSkillName.destroy();
        // this.humanSkillName.destroy();
        // this.leftArrow.destroy();
        // this.rightArrow.destroy();
    }

    //原本的
    // clearUI(): void{
    //     this.endingSkillUI.destroy();
    //     this.skillCat.destroy();
    //     this.skillHuman.destroy();
    //     // this.skillCatBtn.destroy();
    //     // this.skillHumanBtn.destroy();
    //     this.skillCatIcon.destroy();
    //     this.skillHumanIcon.destroy();
    //     this.skillCatInfo.destroy();
    //     this.skillHumanInfo.destroy();
    //     this.skillCatInfoText.destroy();
    //     this.skillHumanInfoText.destroy();
    //     this.catSkillName.destroy();
    //     this.humanSkillName.destroy();
    //     this.leftArrow.destroy();
    //     this.rightArrow.destroy();
    // }
}