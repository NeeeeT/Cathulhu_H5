interface IEnemy extends Laya.Script{
    // 定義敵人介面
    m_name:string;
    m_armor:number;
    m_health:number;
    m_speed:number;
    m_id?:number;

    spawn(player:Laya.Sprite):void;
    setHealth(amount:number):void;
    getHealth():number;
    setArmor(amount:number):void;
    getArmor():number;
    setSpeed(amount:number):void;
    getSpeed():number;

}
export class EnemyNormal extends Laya.Script implements IEnemy{
    // 實作敵人介面 -> 普通敵人
    m_name = '普通敵人';
    m_armor = 0;
    m_health = 1000;
    m_speed = 2;
    m_id = -1;

    constructor(){
        super();
    }
    spawn(player: Laya.Sprite): void{
        //動態生成sprite
        let enemyNormalSpr = new Laya.Sprite();
        
        enemyNormalSpr.pos(player.x - 170, player.y - (player.height / 2));
        enemyNormalSpr.width = player.width * 2/3;
        enemyNormalSpr.height = player.height;
        enemyNormalSpr.loadImage("comp/monster_normal.png");

        let enemyNormalCol = enemyNormalSpr.addComponent(Laya.BoxCollider);
        let enemyNormalRig = enemyNormalSpr.addComponent(Laya.RigidBody);
        let enemyNormalScr = enemyNormalSpr.addComponent(Laya.Script);
        
        enemyNormalCol.width = enemyNormalSpr.width;
        enemyNormalCol.height = enemyNormalSpr.height;
        // enemyNormalCol.label = 'EnemyNormal';
        enemyNormalRig.allowRotation = false;

        enemyNormalScr.onTriggerEnter = function(){
            // console.log('撞到普通敵人了!');
            // console.log(this);
            // console.log(this.class);
            // console.log(this.constructor);
        }
        
        Laya.stage.addChild(enemyNormalSpr);
        this.showHealth(enemyNormalSpr);
        console.log('普通敵人生成!!!');

    }
    showHealth(enemy: Laya.Sprite){
        let enemyHealthText = new Laya.Text();
        enemyHealthText.pos(enemy.x, enemy.y - 40);
        enemyHealthText.width = 100;
        enemyHealthText.height = 60;
        enemyHealthText.color = "#efefef";
        enemyHealthText.fontSize = 40;
        enemyHealthText.text = '' + String(this.m_health);

        Laya.stage.addChild(enemyHealthText);

        setInterval((()=>{
            if(enemy.destroyed) {
                enemyHealthText.destroy();
                enemyHealthText.destroyed = false;
                return;
            }
            enemyHealthText.pos(enemy.x, enemy.y - 40);
            enemyHealthText.text = '' + String(this.m_health);
        }), 30);
    }
    setHealth(amount: number): void{ this.m_health = amount; }
    setArmor(amount: number): void{ this.m_armor = amount; }
    setSpeed(amount: number): void{ this.m_speed = amount; }
    getHealth(): number{ return this.m_health; }
    getArmor(): number{ return this.m_armor; }
    getSpeed(): number{ return this.m_speed; }
}
export class EnemyShield extends Laya.Script implements IEnemy{
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_id = -1;

    constructor(){
        super();
    }
    spawn(){
    }
    setHealth(amount: number): void{ this.m_health = amount; }
    setArmor(amount: number): void{ this.m_armor = amount; }
    setSpeed(amount: number): void{ this.m_speed = amount; }
    getHealth(): number{ return this.m_health; }
    getArmor(): number{ return this.m_armor; }
    getSpeed(): number{ return this.m_speed; }
}