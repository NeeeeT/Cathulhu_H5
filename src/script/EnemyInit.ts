import EnemyHandler from "./EnemyHandler";
import Character from "./CharacterManager";
import CharacterInit from "./CharacterInit";

export default class EnemyInit extends Laya.Script{
    /** @prop {name:EnemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;

    constructor(){
        super();
    }
    onAwake(){
        let player: Laya.Animation = CharacterInit.playerEnt.m_animation;
        let isFacingRight: boolean = CharacterInit.playerEnt.m_isFacingRight;
        setInterval(() =>{
            EnemyHandler.generator(player, isFacingRight ? 1 : 2, 0);
        }, this.enemyGenerateTime)
    }
}