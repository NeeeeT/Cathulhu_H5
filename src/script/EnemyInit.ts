import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";
import { ExtraData } from "./ExtraData";
import SkillList from "./SkillList";

export default class EnemyInit extends Laya.Script{
    /** @prop {name:enemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;
    /** @prop {name:enemyLeft,tips:"生成的敵人數量",type:int,default:50}*/
    enemyLeft: number = 50;
    /** @prop {name:roundTimeLeft,tips:"回合的時間限制(sec)",type:int,default:180}*/
    roundTimeLeft: number = 180;

    battleToggle = true;
    battleTimer = null;

    timeLeftValue: number;

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

    skillCatInfo: Laya.Sprite;
    skillHumanInfo: Laya.Sprite;

    skillCatInfoText: Laya.Text;
    skillHumanInfoText: Laya.Text;

    skillCatBtn: Laya.Button;
    skillHumanBtn: Laya.Button;
    
    constructor(){
        super();
    }
    onStart(){
        this.timeLeftValue = this.roundTimeLeft;

        let player = CharacterInit.playerEnt.m_animation;
        let enemy = EnemyHandler.enemyPool;
        setInterval(() =>{
            if(CharacterInit.playerEnt.m_animation.destroyed || this.enemyLeft <= 0 || enemy.length >= 20) return;
            let x = Math.floor(Math.random()*4);
            console.log(x);
            
            EnemyHandler.generator(player, x, 0);
            this.enemyLeft--;
        }, this.enemyGenerateTime)
        this.battleTimer = setInterval(()=>{
            if(!player || player.destroyed){
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            if(this.enemyLeft <= 0 && EnemyHandler.enemyPool.length <= 0){
                // Laya.Scene.open("Village.scene");
                // Laya.stage.x = Laya.stage.y = 0; 
                this.battleToggle = false;
                this.unsetCharacter();
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            else if(this.timeLeftValue < 0){
                console.log('時間到! 你輸了:(');
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            this.timeLeftValue--;
        }, 1000);
        this.showBattleInfo();
    }
    onKeyUp(e: Laya.Event){
        if(this.endingRewardUI && e.keyCode === 32){
            Laya.Tween.to(this.endingRewardUI, {alpha: 0.3}, 300, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                this.endingRewardUI.destroy();
                this.rewardCrystal.destroy();
                this.rewardGold.destroy();
                this.rewardCrystalText.destroy();
                this.rewardGoldText.destroy();
                // this.endingRewardUI = null;
                this.showEndSkill();
            }), 0);
        };
    }
    showEndSkill(): void{
        let player = CharacterInit.playerEnt.m_animation;
        this.endingSkillUI = new Laya.Sprite();
        this.endingSkillUI.width = 684;
        this.endingSkillUI.height = 576;
        this.endingSkillUI.loadImage('ui/ending/chooseSkill.png');
        this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.x - 325), 94);//544 - 450 = 94
        this.endingSkillUI.alpha = 0;

        let pos:object = {
            'x': this.endingSkillUI.x,
            'y': this.endingSkillUI.y,
        }

        this.skillCat = new Laya.Sprite();
        this.skillHuman = new Laya.Sprite();
        this.skillCat.width = this.skillHuman.width = 130;
        this.skillCat.height = this.skillHuman.height = 130;
        this.skillCat.pos(pos['x']+136, pos['y']+158);
        this.skillHuman.pos(pos['x']+423, pos['y']+158);
        this.skillCat.loadImage('ui/ending/skillBox.png');
        this.skillHuman.loadImage('ui/ending/skillBox.png');

        let r1: number = Math.floor(Math.random()*2);
        let r2: number = Math.floor(Math.random()*2);
        this.skillCatIcon = new Laya.Sprite();
        this.skillHumanIcon = new Laya.Sprite();
        this.skillCatIcon.width = this.skillHumanIcon.width = 88;
        this.skillCatIcon.height = this.skillHumanIcon.height = 88;
        this.skillCatIcon.pos(this.skillCat.x+21,this.skillCat.y+21);
        this.skillHumanIcon.pos(this.skillHuman.x+21, this.skillHuman.y+21);
        this.skillCatIcon.loadImage(SkillList.catSkillList[r1].m_iconB);
        this.skillHumanIcon.loadImage(SkillList.humanSkillList[r2].m_iconB);

        this.skillCatBtn = new Laya.Button();
        this.skillHumanBtn = new Laya.Button();
        this.skillCatBtn.width = this.skillHumanBtn.width = 92;
        this.skillCatBtn.height = this.skillHumanBtn.height = 33;
        this.skillCatBtn.pos(pos['x']+155, pos['y']+302);    
        this.skillHumanBtn.pos(pos['x']+442, pos['y']+302);
        this.skillCatBtn.loadImage("ui/ending/chooseBtn.png")
        this.skillHumanBtn.loadImage("ui/ending/chooseBtn.png");

        this.skillCatBtn.on(Laya.Event.CLICK, this, ()=>{
            ExtraData.currentData['catSkill'] = r1+1;
            ExtraData.saveData();
            this.changeToVillage();
            this.clearUI();
        })
        this.skillHumanBtn.on(Laya.Event.CLICK, this, ()=>{
            ExtraData.currentData['humanSkill'] = r2+1;
            ExtraData.saveData();
            this.changeToVillage();
            this.clearUI();
        })

        this.skillCatInfo = new Laya.Sprite();
        this.skillHumanInfo = new Laya.Sprite();
        this.skillCatInfo.width = this.skillHumanInfo.width = 205;
        this.skillCatInfo.height = this.skillHumanInfo.height = 110;
        this.skillCatInfo.pos(pos['x']+98,pos['y']+356);
        this.skillHumanInfo.pos(pos['x']+385,pos['y']+356);
        this.skillCatInfo.loadImage("ui/ending/infoBox.png");
        this.skillHumanInfo.loadImage("ui/ending/infoBox.png");

        this.skillCatInfoText = new Laya.Text();
        this.skillHumanInfoText = new Laya.Text();
        this.skillCatInfoText.width = this.skillHumanInfoText.width = 167;
        this.skillCatInfoText.height = this.skillHumanInfoText.height = 70;
        this.skillCatInfoText.pos(this.skillCatInfo.x+19,this.skillCatInfo.y+20);
        this.skillHumanInfoText.pos(this.skillHumanInfo.x+19,this.skillHumanInfo.y+20);
        this.skillCatInfoText.text = SkillList.catSkillList[r1].m_info;
        this.skillHumanInfoText.text = SkillList.humanSkillList[r2].m_info;
        this.skillCatInfoText.font = 'silver';
        this.skillHumanInfoText.font = 'silver';
        this.skillCatInfoText.color = '#fdfdfd';
        this.skillHumanInfoText.color = '#fdfdfd';
        this.skillCatInfoText.fontSize = 38;
        this.skillHumanInfoText.fontSize = 38;
        this.skillCatInfoText.wordWrap = true;
        this.skillHumanInfoText.wordWrap = true;
        
        Laya.stage.addChild(this.endingSkillUI);
        Laya.stage.addChild(this.skillCat);
        Laya.stage.addChild(this.skillHuman);
        Laya.stage.addChild(this.skillCatBtn);
        Laya.stage.addChild(this.skillHumanBtn);
        Laya.stage.addChild(this.skillCatIcon);
        Laya.stage.addChild(this.skillHumanIcon);
        Laya.stage.addChild(this.skillCatInfo);
        Laya.stage.addChild(this.skillHumanInfo);
        Laya.stage.addChild(this.skillCatInfoText);
        Laya.stage.addChild(this.skillHumanInfoText);

        Laya.Tween.to(this.endingSkillUI, {alpha: 1.0}, 500, Laya.Ease.linearInOut, null, 0);
    }
    unsetCharacter(): void{
        let player = CharacterInit.playerEnt.m_animation;
        Laya.Tween.to(player, {alpha: 0}, 700, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
            this.showEndRewardUI();
            player.destroy();
            player.destroyed = true;
        }), 0);
    }
    showEndRewardUI(): void{
        let player = CharacterInit.playerEnt.m_animation;
        this.endingRewardUI = new Laya.Sprite();
        this.endingRewardUI.width = 342;
        this.endingRewardUI.height = 288;
        this.endingRewardUI.loadImage('ui/ending/ending.png');
        this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);

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
        let info = new Laya.Text();
        let player = CharacterInit.playerEnt.m_animation;

        info.fontSize = 45;
        info.color = "#efefef";
        info.stroke = 3;
        info.font = "silver";
        info.strokeColor = "#000";

        Laya.stage.addChild(info);

        let timer = setInterval(()=>{
            if(!this.battleToggle){
                clearInterval(timer);
                info.destroy();
                return;
            }
            info.text = "剩餘時間: " + String(this.timeLeftValue) + "\n剩餘敵人數量 : " + String(this.enemyLeft) + "\n場上敵人數量 : " + EnemyHandler.getEnemiesCount();
            info.pos(player.x - 50, player.y - 400);
        }, 10)
    }
    endingUpdateData(): void{
        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        ExtraData.currentData['crystal'] = data.crystal + this.rewardCrystalValue;
        ExtraData.currentData['gold'] = data.gold + this.rewardGoldValue;

        ExtraData.saveData();
    }
    changeToVillage(): void{
        Laya.Scene.open("Village.scene");
        Laya.stage.x = Laya.stage.y = 0; 
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
    }
}