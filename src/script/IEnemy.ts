export interface IEnemy extends Laya.Script{
    // 定義敵人介面
    name:string;
    health:number;
    spawn(player:Laya.Sprite):void;
}