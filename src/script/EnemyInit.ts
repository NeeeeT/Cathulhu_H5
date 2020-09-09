import EnemyHandler from "./EnemyHandler";
import Character from "./CharacterManager";
import CharacterInit from "./CharacterInit";

export default class EnemyInit extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        let player: Laya.Animation = CharacterInit.playerEnt.m_animation;
        let isFacingRight: boolean = CharacterInit.playerEnt.m_isFacingRight;
        EnemyHandler.generator(player, isFacingRight ? 1 : 2, 0);
    }
}