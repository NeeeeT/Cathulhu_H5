import { EnemyNormal, EnemyShield } from "./EnemyManager";

export default class EnemyHandler extends Laya.Script{
    public static enemyIndex:number = 0;
    public static enenmyPool = [];

    public static generator(player: Laya.Sprite):void{
        let enemyNormal: EnemyNormal = new EnemyNormal();
        enemyNormal.m_id = ++this.enemyIndex; 
        let _id:string = 'n' + String(this.enemyIndex);

        enemyNormal.spawn(player);
        enemyNormal.setLabel(_id);

        this.enenmyPool.push({ '_id':_id, '_ent':enemyNormal});

        console.log(this.getEnemiesCount());
        console.log(this.enenmyPool);
    }
    public static takeDamage(enemy: EnemyNormal, amount: number){
        enemy.setHealth(enemy.getHealth() - amount);
    }
    public static getEnemiesCount():number{
        return (this.enenmyPool = this.enenmyPool.filter(data => data._ent.collider.owner != null)).length;;
    }
}