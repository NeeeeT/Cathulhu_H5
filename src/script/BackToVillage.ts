export default class BackToVillage extends Laya.Script{
    onKeyUp(e: Laya.Event):void{
        if(e.keyCode === 32){
            // let theScene: Laya.Sprite = Laya.stage.getChildByName("died") as Laya.Sprite;
            // Laya.Tween.to(theScene, {alpha: 0.1}, 1500, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
            // }), 0);
            Laya.Scene.open("Village.scene");
            Laya.stage.x = Laya.stage.y = 0;
        }
    }
}