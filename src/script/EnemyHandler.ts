import { EnemyNormal, EnemyShield } from "./Enemy";

export default class EnemyHandler extends Laya.Script{
    public static enemyCount:number = 0;
    public static enemyIndex:number = 0;
    public static enenmyPool = [];

    constructor(){
        super();
    }

    public static generator(player: Laya.Sprite):void{
        let enemyNormal: EnemyNormal = new EnemyNormal();
        this.enemyIndex++;
        enemyNormal.m_id = this.enemyIndex; 
        let _id:string = 'n' + String(this.enemyIndex);
        // let _obj = {};

        enemyNormal.spawn(player);
        enemyNormal.setLabel(_id);

        this.enenmyPool.push({ '_id':_id, '_ent':enemyNormal});
        this.enemyCount++;

        console.log(this.enemyCount);
        console.log(this.enenmyPool);
    }
    public static takeDamage(enemy: EnemyNormal, amount: number){
        enemy.setHealth(enemy.getHealth() - amount);
    }
}