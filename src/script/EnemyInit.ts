import EnemyHandler from "./EnemyHandler";
import CharacterInit from "./CharacterInit";

export default class EnemyInit extends Laya.Script{
    /** @prop {name:enemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;

    constructor(){
        super();
    }
    onStart(){
        let player: Laya.Animation = CharacterInit.playerEnt.m_animation;
        let isFacingRight: boolean = CharacterInit.playerEnt.m_isFacingRight;
        setInterval(() =>{
            if(CharacterInit.playerEnt.m_animation.destroyed) return;
            EnemyHandler.generator(player, 1, 0);
        }, this.enemyGenerateTime)
    }
}