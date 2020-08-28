import { EnemyNormal, EnemyShield } from "./EnemyManager";

type EnemyType =  EnemyNormal | EnemyShield;

export default class EnemyHandler extends Laya.Script{
    public static enemyIndex:number = 0;
    public static enenmyPool = [];

    public static generator(player: Laya.Sprite):void{
        let enemyNormal: EnemyShield = new EnemyShield();
        let _id:string = enemyNormal.m_tag + String(++this.enemyIndex);

        enemyNormal.spawn(player, _id);
        // enemyNormal.setLabel(_id);

        this.enenmyPool.push({ '_id':_id, '_ent':enemyNormal});

        console.log(this.getEnemiesCount());
        console.log(this.enenmyPool);
    }
    public static takeDamage(enemy: EnemyType, amount: number){
        enemy.setHealth(enemy.getHealth() - amount);
    }
    public static getEnemiesCount():number{
        return (this.enenmyPool = this.enenmyPool.filter(data => data._ent.collider.owner != null)).length;
    }
}