import { ExtraData } from "./ExtraData";

export default class Village extends Laya.Script{

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

    c_gold: number;
    c_crystal: number;
    c_hpLevel: number;
    c_atkDmgLevel: number;

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
            // this.clearReinforceUI();
        })
        this.battleBtn.on(Laya.Event.CLICK, this, function(){
            Laya.Scene.open("First.scene");
            // this.clearReinforceUI();
        })
    }
    updateData(): void{
        let p = new ExtraData();
        this.c_gold = p.e_gold;
        this.c_crystal = p.e_crystal;
        this.c_hpLevel = p.e_hpLevel;
        this.c_atkDmgLevel = p.e_atkDmgLevel;
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
    }
    clearReinforceUI(): void{
        this.reinforceUI.destroy();
        this.reinforceBackBtn.destroy();
        this.reinforceGold.destroy();
        this.reinforceAtkDmgLevel.destroy();
        this.reinforceHpLevel.destroy();
        this.reinforceAtkDmgCost.destroy();
        this.reinforceHpCost.destroy();
        this.reinforceAtkDmgCostBtn.destroy();
        this.reinforceHpCostBtn.destroy();

        this.reinforceUI = this.reinforceBackBtn = this.reinforceGold = this.reinforceAtkDmgLevel = this.reinforceHpLevel = this.reinforceAtkDmgCost
        = this.reinforceHpCost = this.reinforceAtkDmgCostBtn = this.reinforceHpCostBtn = null;
    }
    setReinfoceUI(): void{
        this.reinforceUI = new Laya.Sprite();
        this.reinforceUI.loadImage("ui/reinforce.png");
        this.reinforceUI.width = 1066;
        this.reinforceUI.height = 550;
        this.reinforceUI.pos(150, 109);//(1366 - 1066) / 2, (768 - 550) / 2
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
            this.reinforceGold.text = String(this.c_gold);
            return;
        }
        this.reinforceGold = new Laya.Text();
        this.reinforceGold.font = "silver";
        this.reinforceGold.fontSize = 100;
        this.reinforceGold.color = "#fff";  
        this.reinforceGold.text = String(this.c_gold);
        this.reinforceGold.pos(150+433, 109+404);
        Laya.stage.addChild(this.reinforceGold);
    }
    setReinfoceAtkDmgLevel(): void{
        if(this.reinforceAtkDmgLevel){
            this.reinforceAtkDmgLevel.text = String(this.c_atkDmgLevel);
            return;
        }
        this.reinforceAtkDmgLevel = new Laya.Text();
        this.reinforceAtkDmgLevel.font = "silver";
        this.reinforceAtkDmgLevel.fontSize = 100;
        this.reinforceAtkDmgLevel.color = "#00FFFF";
        this.reinforceAtkDmgLevel.stroke = 10;
        this.reinforceAtkDmgLevel.strokeColor = "#000";
        this.reinforceAtkDmgLevel.text = String(this.c_atkDmgLevel);
        this.reinforceAtkDmgLevel.pos(150+578, 109+198);
        Laya.stage.addChild(this.reinforceAtkDmgLevel);
    }
    setReinfoceHpLevel(): void{
        if(this.reinforceHpLevel){
            this.reinforceHpLevel.text = String(this.c_hpLevel);
            return;
        }
        this.reinforceHpLevel = new Laya.Text();
        this.reinforceHpLevel.font = "silver";
        this.reinforceHpLevel.fontSize = 100;
        this.reinforceHpLevel.color = "#00FFFF";
        this.reinforceHpLevel.stroke = 10;
        this.reinforceHpLevel.strokeColor = "#000";
        this.reinforceHpLevel.text = String(this.c_hpLevel);
        this.reinforceHpLevel.pos(150+578, 109+297);
        Laya.stage.addChild(this.reinforceHpLevel);
    }
    setReinfoceAtkDmgCost(): void{
        if(this.reinforceAtkDmgCost){
            this.reinforceAtkDmgCost.text = '-' + String(this.c_atkDmgLevel*100);
            return;
        }
        this.reinforceAtkDmgCost = new Laya.Text();
        this.reinforceAtkDmgCost.font = "silver";
        this.reinforceAtkDmgCost.fontSize = 100;
        this.reinforceAtkDmgCost.color = "#d1ce07";
        this.reinforceAtkDmgCost.stroke = 10;
        this.reinforceAtkDmgCost.strokeColor = "#000";
        this.reinforceAtkDmgCost.text = '-' + String(this.c_atkDmgLevel*100);
        this.reinforceAtkDmgCost.pos(150+908, 109+193);
        Laya.stage.addChild(this.reinforceAtkDmgCost);
    }
    setReinfoceHpCost(): void{
        if(this.reinforceHpCost){
            this.reinforceHpCost.text = '-' + String(this.c_hpLevel*100);
            return;
        }
        this.reinforceHpCost = new Laya.Text();
        this.reinforceHpCost.font = "silver";
        this.reinforceHpCost.fontSize = 100;
        this.reinforceHpCost.color = "#d1ce07";
        this.reinforceHpCost.stroke = 10;
        this.reinforceHpCost.strokeColor = "#000";
        this.reinforceHpCost.text = '-' + String(this.c_hpLevel*100);
        this.reinforceHpCost.pos(150+908, 109+299);
        Laya.stage.addChild(this.reinforceHpCost);
    }
    setReinforceAtkDmgCostBtn(): void{
        this.reinforceAtkDmgCostBtn = new Laya.Button();
        this.reinforceAtkDmgCostBtn.width = 103;
        this.reinforceAtkDmgCostBtn.height = 60;
        this.reinforceAtkDmgCostBtn.pos(150+726, 109+203);
        this.reinforceAtkDmgCostBtn.on(Laya.Event.CLICK, this, ()=>{
            if(this.c_gold < this.c_atkDmgLevel*100){
                return;
            }
            this.c_gold -= this.c_atkDmgLevel*100;
            this.c_atkDmgLevel++;
            this.setReinfoceAtkDmgLevel();
            this.setReinfoceAtkDmgCost();
            this.setReinfoceGoldValue();
        })
        Laya.stage.addChild(this.reinforceAtkDmgCostBtn);
    }
    setReinforceHpCostBtn(): void{
        this.reinforceHpCostBtn = new Laya.Button();
        this.reinforceHpCostBtn.width = 103;
        this.reinforceHpCostBtn.height = 60;
        this.reinforceHpCostBtn.pos(150+726, 109+307);
        this.reinforceHpCostBtn.on(Laya.Event.CLICK, this, ()=>{
            console.log(this.c_crystal);
            console.log(this.c_gold);
            
            
            if(this.c_gold < this.c_hpLevel*100){
                return;
            }
            this.c_gold -= this.c_hpLevel*100;
            this.c_hpLevel++;
            this.setReinfoceHpLevel();
            this.setReinfoceHpCost();
            this.setReinfoceGoldValue();
        })
        Laya.stage.addChild(this.reinforceHpCostBtn);
    }
}