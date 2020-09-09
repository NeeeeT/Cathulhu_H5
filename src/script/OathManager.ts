export default class OathManager extends Laya.Script{

    public static currentBloodyPoint: number = 50;
    public static maxBloodyPoint: number = 100;
    public static increaseBloodyPoint: number = 10;

    public static getBloodyPoint(){
        return OathManager.currentBloodyPoint;
    }
    public static setBloodyPoint(amount: number){
        OathManager.currentBloodyPoint = (amount > this.maxBloodyPoint) ? this.maxBloodyPoint : amount;
        return OathManager.currentBloodyPoint;
    }
    public static showBloodyPoint(player: Laya.Animation) {
        let oathBar = new Laya.ProgressBar();
        oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 50);
        oathBar.height = 50;
        oathBar.width = 300;
        oathBar.skin = "comp/progress.png";
        oathBar.value = 50;
        setInterval((() => {
            oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 100);
            oathBar.value = this.currentBloodyPoint / this.maxBloodyPoint;
        }), 10);
        Laya.stage.addChild(oathBar);
    }
}