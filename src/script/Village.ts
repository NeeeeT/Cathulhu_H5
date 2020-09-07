export default class Village extends Laya.Script{

    reinforceBtn:Laya.Button = null;
    templeBtn:Laya.Button = null;
    battleBtn:Laya.Button = null;
    onStart(){
        
        this.reinforceBtn = this.owner.getChildByName("Reinforce") as Laya.Button;
        this.templeBtn = this.owner.getChildByName("Temple") as Laya.Button;
        this.battleBtn = this.owner.getChildByName("Battle") as Laya.Button;
        this.reinforceBtn.on(Laya.Event.CLICK, this, function(){
            console.log("reinforce");
        })
        this.templeBtn.on(Laya.Event.CLICK, this, function(){
            console.log("temple");
        })
        this.battleBtn.on(Laya.Event.CLICK, this, function(){
            console.log("battle");
            // Laya.Scene.load("First.scene");
            Laya.Scene.open("First.scene");
            
        })
    }

}