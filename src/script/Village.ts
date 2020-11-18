import { ExtraData } from "./ExtraData";
import MissionManager from "./MissionManager";

export default class Village extends Laya.Script{

    reinforceToggle: boolean = false;

    reinforceBtn: Laya.Button = null;
    templeBtn: Laya.Button = null;
    battleBtn: Laya.Button = null;

    reinforceUI: Laya.Sprite = null;
    reinforceBackBtn: Laya.Button = null;
    reinforceGold: Laya.Text = null;
    reinforceHpLevel: Laya.Text = null;
    reinforceAtkDmgLevel: Laya.Text = null;

    reinforceHpCost: Laya.Text = null;
    reinforceHpCostBtn: Laya.Button = null;
    reinforceAtkDmgCost: Laya.Text = null;
    reinforceAtkDmgCostBtn: Laya.Button = null;

    reinforceHpCostIcon: Laya.Sprite = null;
    reinforceAtkDmgCostIcon: Laya.Sprite = null;

    c_gold: number;
    c_crystal: number;
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
    onStart(){
        // Laya.stage.pos(0, 0);
        this.updateData();

        Laya.stage.x = 0;
        Laya.stage.y = 0;
        this.reinforceBtn = this.owner.getChildByName("Reinforce") as Laya.Button;
        this.templeBtn = this.owner.getChildByName("Temple") as Laya.Button;
        this.battleBtn = this.owner.getChildByName("Battle") as Laya.Button;
        this.reinforceBtn.on(Laya.Event.CLICK, this, function(){
            this.showReinforceUI();
        })
        this.templeBtn.on(Laya.Event.CLICK, this, function(){
            console.log("temple");
        })
        this.battleBtn.on(Laya.Event.CLICK, this, function(){
            this.missionManager.showMissionUI();
        })
    }
    updateData(): void{
        ExtraData.loadData();

        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        this.c_gold = data.gold;
        this.c_crystal = data.crystal;
        Village.hpLevel = data.hpLevel;
        Village.atkDmgLevel = data.atkDmgLevel;
        
        this.saveData();
    }
    showReinforceUI(): void{
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
    clearReinforceUI(): void{
        if(this.reinforceToggle){
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
    setReinfoceUI(): void{
        this.reinforceUI = new Laya.Sprite();
        this.reinforceUI.loadImage("ui/reinforce.png");
        this.reinforceUI.width = 700;
        this.reinforceUI.height = 400;
        this.reinforceUI.pos(333, 184);//(1366 - 1066) / 2, (768 - 550) / 2
        this.reinforceUI.alpha = 1;
        Laya.stage.addChild(this.reinforceUI);
    }
    setReinfoceBackBtn(): void{
        this.reinforceBackBtn = new Laya.Button();
        this.reinforceBackBtn.width = this.reinforceBackBtn.height = 73;
        this.reinforceBackBtn.pos(150+933, 109+56);
        this.reinforceBackBtn.on(Laya.Event.CLICK, this, ()=>{
            this.clearReinforceUI();
        })
        Laya.stage.addChild(this.reinforceBackBtn);
    }
    setReinfoceGoldValue(): void{
        if(this.reinforceGold){
            this.reinforceGold.text = '$' + String(this.c_gold);
            return;
        }
        this.reinforceGold = new Laya.Text();
        this.reinforceGold.font = "silver";
        this.reinforceGold.fontSize = 80;
        this.reinforceGold.color = "#FEFFF7";  
        this.reinforceGold.stroke = 3;
        this.reinforceGold.strokeColor = "#000";
        this.reinforceGold.text = '$'+String(this.c_gold);
        this.reinforceGold.pos(333+550, 184+50);
        Laya.stage.addChild(this.reinforceGold);
    }
    setReinfoceAtkDmgLevel(): void{
        if(this.reinforceAtkDmgLevel){
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
        this.reinforceAtkDmgLevel.pos(333+255, 184+160);
        Laya.stage.addChild(this.reinforceAtkDmgLevel);
    }
    setReinfoceHpLevel(): void{
        if(this.reinforceHpLevel){
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
        this.reinforceHpLevel.pos(333+255, 184+275);
        Laya.stage.addChild(this.reinforceHpLevel);
    }
    setReinfoceAtkDmgCost(): void{
        if(this.reinforceAtkDmgCost){
            this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel*100);
            return;
        }
        this.reinforceAtkDmgCost = new Laya.Text();
        this.reinforceAtkDmgCost.font = "silver";
        this.reinforceAtkDmgCost.fontSize = 85;
        this.reinforceAtkDmgCost.color = "#fff";
        this.reinforceAtkDmgCost.stroke = 3;
        this.reinforceAtkDmgCost.strokeColor = "#000";
        this.reinforceAtkDmgCost.text = '$' + String(Village.atkDmgLevel*100);
        this.reinforceAtkDmgCost.pos(333+550, 184+160);
        Laya.stage.addChild(this.reinforceAtkDmgCost);
    }
    setReinfoceHpCost(): void{
        if(this.reinforceHpCost){
            this.reinforceHpCost.text = '$' + String(Village.hpLevel*100);
            return;
        }
        this.reinforceHpCost = new Laya.Text();
        this.reinforceHpCost.font = "silver";
        this.reinforceHpCost.fontSize = 85;
        this.reinforceHpCost.color = "#fff";
        this.reinforceHpCost.stroke = 3;
        this.reinforceHpCost.strokeColor = "#000";
        this.reinforceHpCost.text = '$' + String(Village.hpLevel*100);
        this.reinforceHpCost.pos(333+550, 184+275);
        Laya.stage.addChild(this.reinforceHpCost);
    }
    setReinforceAtkDmgCostBtn(): void{
        this.reinforceAtkDmgCostBtn = new Laya.Button();
        this.reinforceAtkDmgCostBtn.width = 41;
        this.reinforceAtkDmgCostBtn.height = 52;
        this.reinforceAtkDmgCostBtn.pos(330+465, 184+160);
        this.reinforceAtkDmgCostBtn.on(Laya.Event.CLICK, this, ()=>{
            if(this.c_gold < Village.atkDmgLevel*100){
                return;
            }
            this.c_gold -= Village.atkDmgLevel*100;
            Village.atkDmgLevel++;
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceGoldValue();
            this.saveData();
        })
        Laya.stage.addChild(this.reinforceAtkDmgCostBtn);
    }
    setReinforceHpCostBtn(): void{
        this.reinforceHpCostBtn = new Laya.Button();
        this.reinforceHpCostBtn.width = 41;
        this.reinforceHpCostBtn.height = 52;
        this.reinforceHpCostBtn.pos(330+465, 184+275);
        this.reinforceHpCostBtn.on(Laya.Event.CLICK, this, ()=>{            
            if(this.c_gold < Village.hpLevel*100){
                return;
            }
            this.c_gold -= Village.hpLevel*100;
            Village.hpLevel++;
            this.setReinfoceHpLevel();
            this.setReinfoceHpCost();
            this.setReinfoceGoldValue();
            this.saveData();
        })
        Laya.stage.addChild(this.reinforceHpCostBtn);
    }
    setReinforceAtkDmgCostIcon(): void{
        this.reinforceAtkDmgCostIcon = new Laya.Sprite();
        this.reinforceAtkDmgCostIcon.pos(330+465, 184+160);
        this.reinforceAtkDmgCostIcon.loadImage('ui/arrP.png');
        this.reinforceAtkDmgCostIcon.alpha = 1;
        Laya.stage.addChild(this.reinforceAtkDmgCostIcon);
    }
    setReinforceHpCostIcon(): void{
        this.reinforceHpCostIcon = new Laya.Sprite();
        this.reinforceHpCostIcon.pos(330+465, 184+275);
        this.reinforceHpCostIcon.loadImage('ui/arrR.png');
        this.reinforceHpCostIcon.alpha = 1;
        Laya.stage.addChild(this.reinforceHpCostIcon);
    }
    saveData(): void{
        ExtraData.currentData['atkDmgLevel'] = Village.atkDmgLevel;
        ExtraData.currentData['hpLevel'] = Village.hpLevel;
        ExtraData.currentData['gold'] = this.c_gold;
        ExtraData.currentData['crystal'] = this.c_crystal;
        
        ExtraData.saveData();
    }
}