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
        enemyNormalSpr.addComponent(Laya.Script);
        
        let enemyNormalCol: Laya.BoxCollider = enemyNormalSpr.getComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let enemyNormalRig: Laya.RigidBody = enemyNormalSpr.getComponent(Laya.RigidBody) as Laya.RigidBody;
        let enemyNormalScr: Laya.Script = enemyNormalSpr.getComponent(Laya.Script) as Laya.Script;
        enemyNormalCol.width = enemyNormalSpr.width;
        enemyNormalCol.height = enemyNormalSpr.height;
        enemyNormalRig.allowRotation = false;

        enemyNormalScr.onTriggerEnter = function(){
            console.log('撞到普通敵人了!');
        }
        
        Laya.stage.addChild(enemyNormalSpr);
        this.show_health(enemyNormalSpr);
        
        console.log('普通敵人生成!!!');

    }
    show_health(enemy: Laya.Sprite){
        let enemyHealthText = new Laya.Text();
        enemyHealthText.pos(enemy.x, enemy.y - 40);
        enemyHealthText.width = 100;
        enemyHealthText.height = 60;
        enemyHealthText.color = "#efefef";
        enemyHealthText.fontSize = 40;
        enemyHealthText.text = '' + String(this.health);

        Laya.stage.addChild(enemyHealthText);

        setInterval((()=>{
            if(enemy.destroyed) {
                enemyHealthText.destroy();
                enemyHealthText.destroyed = false;
                return;
            }
            enemyHealthText.pos(enemy.x, enemy.y - 40);
            enemyHealthText.text = '' + String(this.health);
        }), 30);
    }
    constructor(){
        super();
    }
}