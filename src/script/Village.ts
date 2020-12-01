import { ExtraData } from "./ExtraData";
import MissionManager from "./MissionManager";
import ZOrderManager from "./ZOrderManager";

export default class Village extends Laya.Script{

    public static reinforceToggle: boolean = false;

    reinforceBtn: Laya.Button = null;
    templeBtn: Laya.Button = null;
    battleBtn: Laya.Button = null;

    reinforceUI: Laya.Sprite = null;
    reinforceGold: Laya.Text = null;
    reinforceHpLevel: Laya.Text = null;
    reinforceAtkDmgLevel: Laya.Text = null;

    reinforceHpCost: Laya.Text = null;
    reinforceAtkDmgCost: Laya.Text = null;

    reinforceHpCostIcon: Laya.Sprite = null;
    reinforceAtkDmgCostIcon: Laya.Sprite = null;

    skipIcon: Laya.Sprite;

    c_crystal: number;
    public static gold: number;
    public static hpLevel: number;
    public static atkDmgLevel: number;

    missionManager: MissionManager = new MissionManager();

    public static isNewbie = true;

    onAwake() {
        if (Village.isNewbie) {
            this.missionManager.generateNewbieData();
        } else {
            MissionManager.missionDataPool = [];
            this.missionManager.generateMissionData(9);
        }
    }
    // onKeyDown(e: Laya.Event): void{
    //     if(e.keyCode === 32 && Village.reinforceToggle){
    //         this.clearReinforceUI();
    //     }
    // }
    onStart(){
        // Laya.stage.pos(0, 0);
        Village.updateData();
        // Laya.stage.x = 0;
        // Laya.stage.y = 0;
        // this.reinforceBtn = this.owner.getChildByName("Reinforce") as Laya.Button;
        // this.templeBtn = this.owner.getChildByName("Temple") as Laya.Button;
        // this.battleBtn = this.owner.getChildByName("Battle") as Laya.Button;
        // this.reinforceBtn.on(Laya.Event.CLICK, this, function(){
        //     if(this.reinforceToggle) return;
        //     this.showReinforceUI();
        // })
        // this.templeBtn.on(Laya.Event.CLICK, this, function(){
        //     console.log("temple");
        // })
        // this.battleBtn.on(Laya.Event.CLICK, this, function(){
        //     this.missionManager.showMissionUI();
        // })
    }
    public static updateData(): void{
        ExtraData.loadData();

        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        Village.gold = data.gold;
        Village.hpLevel = data.hpLevel;
        Village.atkDmgLevel = data.atkDmgLevel;
        
        this.saveData();
    }
    showReinforceUI(): void{
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
    clearReinforceUI(): void{
        if(Village.reinforceToggle){
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
            this.skipIcon =  null;

            this.missionManager.clearCurrentMissionData();
            this.missionManager.generateMissionData(9);
            this.missionManager.showMissionUI();

            Laya.SoundManager.stopAll();
            Village.reinforceToggle = false;
        }
    }
    setReinfoceUI(): void{
        Laya.stage.x = Laya.stage.y = 0;
        this.reinforceUI = new Laya.Sprite();
        this.reinforceUI.loadImage("UI/reinforce.png");
        this.reinforceUI.width = 700;
        this.reinforceUI.height = 400;
        this.reinforceUI.pos(333,184);//(1366 - 1066) / 2, (768 - 550) / 2
        this.reinforceUI.alpha = 1;
        Laya.stage.addChild(this.reinforceUI);
        ZOrderManager.setZOrder(this.reinforceUI, 100);
    }
    setSkipIcon(): void{
        this.skipIcon = new Laya.Sprite();
        this.skipIcon.pos(this.reinforceUI.x+281,this.reinforceUI.y+353);
        this.skipIcon.loadImage('UI/skip.png');

        this.skipIcon.on(Laya.Event.MOUSE_OVER, this, ()=>{
            this.skipIcon.loadImage('UI/skip2.png');
        });
        this.skipIcon.on(Laya.Event.MOUSE_OUT, this, ()=>{
            this.skipIcon.loadImage('UI/skip.png');
        })
        this.skipIcon.on(Laya.Event.CLICK, this, ()=>{
            this.clearReinforceUI();
        })
        Laya.stage.addChild(this.skipIcon);
        ZOrderManager.setZOrder(this.skipIcon, 103);
    }
    setReinfoceGoldValue(): void{
        if(this.reinforceGold){
            this.reinforceGold.text = '$' + String(Village.gold);
            return;
        }
        this.reinforceGold = new Laya.Text();
        this.reinforceGold.font = "silver";
        this.reinforceGold.fontSize = 70;
        this.reinforceGold.color = "#FEFFF7";  
        this.reinforceGold.stroke = 3;
        this.reinforceGold.strokeColor = "#000";
        this.reinforceGold.text = '$'+String(Village.gold);
        this.reinforceGold.pos(333+520, 184+50);
        Laya.stage.addChild(this.reinforceGold);
        ZOrderManager.setZOrder(this.reinforceGold, 101);
    }
    setReinfoceAtkDmgLevel(): void{
        if(this.reinforceAtkDmgLevel){
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
        this.reinforceAtkDmgLevel.pos(333+255, 184+160);
        Laya.stage.addChild(this.reinforceAtkDmgLevel);
        ZOrderManager.setZOrder(this.reinforceAtkDmgLevel, 101);
    }
    setReinfoceHpLevel(): void{
        if(this.reinforceHpLevel){
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
        this.reinforceHpLevel.pos(333+255, 184+275);
        Laya.stage.addChild(this.reinforceHpLevel);
        ZOrderManager.setZOrder(this.reinforceHpLevel, 101);
    }
    setReinfoceAtkDmgCost(): void{
        if(this.reinforceAtkDmgCost){
            this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel*100);
            return;
        }
        this.reinforceAtkDmgCost = new Laya.Text();
        this.reinforceAtkDmgCost.font = "silver";
        this.reinforceAtkDmgCost.fontSize = 70;
        this.reinforceAtkDmgCost.color = "#fff";
        this.reinforceAtkDmgCost.stroke = 3;
        this.reinforceAtkDmgCost.strokeColor = "#000";
        this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel*100);
        this.reinforceAtkDmgCost.pos(333+550, 184+160);
        Laya.stage.addChild(this.reinforceAtkDmgCost);
        ZOrderManager.setZOrder(this.reinforceAtkDmgCost, 101);
    }
    setReinfoceHpCost(): void{
        if(this.reinforceHpCost){
            this.reinforceHpCost.text = '$' + String(Village.hpLevel*100);
            return;
        }
        this.reinforceHpCost = new Laya.Text();
        this.reinforceHpCost.font = "silver";
        this.reinforceHpCost.fontSize = 70;
        this.reinforceHpCost.color = "#fff";
        this.reinforceHpCost.stroke = 3;
        this.reinforceHpCost.strokeColor = "#000";
        this.reinforceHpCost.text = '$' + String(Village.hpLevel*100);
        this.reinforceHpCost.pos(333+550, 184+275);
        Laya.stage.addChild(this.reinforceHpCost);
        ZOrderManager.setZOrder(this.reinforceHpCost, 101);
    }
    setReinforceAtkDmgCostIcon(): void{
        this.reinforceAtkDmgCostIcon = new Laya.Sprite();
        this.reinforceAtkDmgCostIcon.pos(330+465, 184+157);
        this.reinforceAtkDmgCostIcon.loadImage('UI/arrP.png');
        this.reinforceAtkDmgCostIcon.alpha = 0.75;

        this.reinforceAtkDmgCostIcon.on(Laya.Event.MOUSE_OVER, this, ()=>{
            this.reinforceAtkDmgCostIcon.alpha = 1;
        });
        this.reinforceAtkDmgCostIcon.on(Laya.Event.MOUSE_OUT, this, ()=>{
            this.reinforceAtkDmgCostIcon.alpha = 0.75
        })
        this.reinforceAtkDmgCostIcon.on(Laya.Event.CLICK, this, ()=>{
            if(Village.gold < Village.atkDmgLevel*100){
                return;
            }
            Village.gold -= Village.atkDmgLevel*100;
            Village.atkDmgLevel++;
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceGoldValue();
            Village.saveData();
        })

        Laya.stage.addChild(this.reinforceAtkDmgCostIcon);
        ZOrderManager.setZOrder(this.reinforceAtkDmgCostIcon, 101);
    }
    setReinforceHpCostIcon(): void{
        this.reinforceHpCostIcon = new Laya.Sprite();
        this.reinforceHpCostIcon.pos(330+465, 184+272);
        this.reinforceHpCostIcon.loadImage('UI/arrR.png');
        this.reinforceHpCostIcon.alpha = 0.75;
        Laya.stage.addChild(this.reinforceHpCostIcon);
        ZOrderManager.setZOrder(this.reinforceHpCostIcon, 101);
        this.reinforceHpCostIcon.on(Laya.Event.MOUSE_OVER, this, ()=>{
            this.reinforceHpCostIcon.alpha = 1.0;
        });
        this.reinforceHpCostIcon.on(Laya.Event.MOUSE_OUT, this, ()=>{
            this.reinforceHpCostIcon.alpha = 0.75;
        })
        this.reinforceHpCostIcon.on(Laya.Event.CLICK, this, ()=>{
            if(Village.gold < Village.hpLevel*100){
                return;
            }
            Village.gold -= Village.hpLevel*100;
            Village.hpLevel++;
            this.setReinfoceHpLevel();
            this.setReinfoceHpCost();
            this.setReinfoceGoldValue();
            Village.saveData();
        })
    }
    public static saveData(): void{
        ExtraData.currentData['atkDmgLevel'] = Village.atkDmgLevel;
        ExtraData.currentData['hpLevel'] = Village.hpLevel;
        ExtraData.currentData['gold'] = Village.gold;
        // ExtraData.currentData['crystal'] = this.c_crystal;
        
        ExtraData.saveData();
    }
}