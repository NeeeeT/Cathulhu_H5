import { EnemyNormal } from "./Enemy";

export default class EnemyHandler extends Laya.Script{
    public static enemyCount:number = 0;
    public static enemyIndex:number = 0;
    public static enenmyPool = [];

    constructor(){
        super();
    }

    public static generator(player: Laya.Sprite):void{
        let enemyNormal: EnemyNormal = new EnemyNormal();
        let _id:number = enemyNormal.m_id = ++this.enemyIndex;
        let _ent:EnemyNormal = enemyNormal;
        // let _obj = {};

        enemyNormal.spawn(player);

        this.enenmyPool.push({ '_id':_id, '_ent':_ent});
        this.enemyCount++;

        console.log(this.enemyCount);
        console.log(this.enenmyPool);
    }
}