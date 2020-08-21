export default class CameraHandler extends Laya.Script{
    constructor(){
        super();
    }
    public static CameraFollower(sprite:Laya.Sprite):void{
        setInterval((()=>{
            let player_pivot:number = Laya.stage.width / 2;
            Laya.stage.x = player_pivot - sprite.x;
        }), 0);
    };
}