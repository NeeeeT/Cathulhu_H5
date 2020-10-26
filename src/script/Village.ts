import { ExtraData } from "./ExtraData";

export default class Village extends Laya.Script{

    reinforceBtn: Laya.Button;
    templeBtn: Laya.Button;
    battleBtn: Laya.Button;

    reinforceUI: Laya.Sprite;
    reinforceBackBtn: Laya.Button;
    reinforceGold: Laya.Text;

    c_gold: number;
    c_crystal: number;

    onStart(){
        // Laya.stage.pos(0, 0);
        this.precacheData();

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
            Laya.Scene.open("First.scene");
        })
    }
    precacheData(): void{
        let p = new ExtraData();
        this.c_gold = p.e_gold;
        this.c_crystal = p.e_crystal;
    }
    showReinforceUI(): void{
        this.reinforceUI = new Laya.Sprite();
        this.reinforceUI.loadImage("ui/reinforce.png");
        this.reinforceUI.width = 1066;
        this.reinforceUI.height = 550;
        this.reinforceUI.pos(150, 109);//(1366 - 1066) / 2, (768 - 550) / 2
        this.reinforceUI.alpha = 1;

        this.reinforceBackBtn = new Laya.Button();
        this.reinforceBackBtn.width = this.reinforceBackBtn.height = 73;
        this.reinforceBackBtn.pos(150+933, 109+56);
        this.reinforceBackBtn.on(Laya.Event.CLICK, this, ()=>{
            this.reinforceUI.destroy();
            this.reinforceBackBtn.destroy();
            this.reinforceGold.destroy();
        })

        this.reinforceGold = new Laya.Text();
        this.reinforceGold.font = "silver";
        this.reinforceGold.fontSize = 120;
        this.reinforceGold.color = "#fff";  
        this.reinforceGold.text = String(this.c_gold);
        this.reinforceGold.pos(150+433, 109+393);
        

        Laya.stage.addChild(this.reinforceUI);
        Laya.stage.addChild(this.reinforceBackBtn);
        Laya.stage.addChild(this.reinforceGold);
    }
}