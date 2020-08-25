import { IEnemy } from "./IEnemy";

export class EnemyNormal extends Laya.Script implements IEnemy{
    // 實作敵人介面 -> 普通敵人

    name = '普通敵人';
    health = 1000;

    spawn(player: Laya.Sprite):void{
        //動態生成sprite
        let enemyNormalSpr = new Laya.Sprite();
        enemyNormalSpr.pos(player.x - 170, player.y - (player.height / 2));
        enemyNormalSpr.width = player.width * 2/3;
        enemyNormalSpr.height = player.height;
        enemyNormalSpr.loadImage("comp/monster_normal.png");
        enemyNormalSpr.addComponent(Laya.RigidBody);
        enemyNormalSpr.addComponent(Laya.BoxCollider);
        
        let enemyNormalCol: Laya.BoxCollider = enemyNormalSpr.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        enemyNormalCol.width = enemyNormalSpr.width;
        enemyNormalCol.height = enemyNormalSpr.height;

        Laya.stage.addChild(enemyNormalSpr);
        // enemyNormalSpr.addComponent()
    
        console.log(enemyNormalSpr.width, enemyNormalSpr.height);
        console.log(enemyNormalCol.width, enemyNormalCol.height);
        
        

        console.log('普通敵人生成!!!');
    }
    constructor(){
        super();
    }
}