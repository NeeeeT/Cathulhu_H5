import Character from "./CharacterManager";

export default class CharacterInit extends Laya.Script{
    /** @prop {name:health,tips:"角色初始血量",type:int,default:1000}*/
    health: number = 1000;
    /** @prop {name:xMaxVelocity,tips:"x軸速度上限",type:int,default:5}*/
    xMaxVelocity: number = 5;
    /** @prop {name:yMaxVelocity,tips:"y軸速度上限",type:int,default:5}*/
    yMaxVelocity: number = 5;
    /** @prop {name:velocityMultiplier,tips:"改變角色速度增加幅度",type:int,default:5}*/
    velocityMultiplier: number = 5;
    /** @prop {name:attackRange,tips:"調整攻擊範圍",type:int,default:100}*/
    attackRange: number = 100;

    public static playerEnt: Character;

    constructor(){
        super();
    }
    onAwake(){
        let player: Character = new Character();
        this.initSetting(player);
        player.spawn();
        CharacterInit.playerEnt = player;
    }
    initSetting(player: Character): void{
        player.m_health = this.health;
        player.m_xMaxVelocity = this.xMaxVelocity;
        player.m_yMaxVelocity = this.yMaxVelocity;
        player.m_velocityMultiplier = this.velocityMultiplier;
        player.m_attackRange = this.attackRange;
    }
}