import Character from "./CharacterManager";
import OathManager from "./OathManager";

export default class CharacterInit extends Laya.Script {
    /** @prop {name:health,tips:"角色初始血量",type:int,default:1000}*/
    health: number = 1000;
    /** @prop {name:bloodyPoint,tips:"角色初始獻祭值",type:int,default:0}*/
    bloodyPoint: number = 0;
    /** @prop {name:maxBloodyPoint,tips:"角色最大獻祭值",type:int,default:100}*/
    maxBloodyPoint: number = 100;
    /** @prop {name:xMaxVelocity,tips:"x軸速度上限",type:int,default:5}*/
    xMaxVelocity: number = 5;
    /** @prop {name:buff_xMaxVelocity,tips:"誓約充能時，x軸速度上限",type:int,default:5.75}*/
    buff_xMaxVelocity: number = 5.75;
    /** @prop {name:yMaxVelocity,tips:"y軸速度上限",type:int,default:5}*/
    yMaxVelocity: number = 5;
    /** @prop {name:velocityMultiplier,tips:"改變角色速度增加幅度",type:int,default:5}*/
    velocityMultiplier: number = 5;
    /** prop {name:buff_velocityMultiplier,tips:"誓約充能時，角色速度增加幅度",type:int,default:5.75}*/
    // buff_velocityMultiplier: number = 5.75;
    /** @prop {name:attackRange,tips:"調整攻擊範圍",type:int,default:100}*/
    attackRange: number = 100;
    /** @prop {name:attackCdTime,tips:"調整攻擊速度，越低越快",type:int,default:500}*/
    attackCdTime: number = 500;
    /** @prop {name:buff_attackCdTime,tips:"誓約充能時，角色攻擊速度，越低越快",type:int,default:425}*/
    buff_attackCdTime: number = 425;

    public static playerEnt: Character;

    constructor() {
        super();
    }
    onAwake() {
        let player: Character = new Character();
        this.initSetting(player);
        player.spawn();
        CharacterInit.playerEnt = player;
    }
    private initSetting(player: Character): void {
        player.m_maxHealth = player.m_health = this.health;
        player.m_bloodyPoint = this.bloodyPoint;
        player.m_maxBloodyPoint = this.maxBloodyPoint;
        player.m_basic_xMaxVelocity = this.xMaxVelocity;
        player.m_buff_xMaxVelocity = this.buff_xMaxVelocity;
        player.m_yMaxVelocity = this.yMaxVelocity;
        player.m_velocityMultiplier = this.velocityMultiplier;
        // player.m_buff_velocityMultiplier = this.buff_velocityMultiplier;
        player.m_attackRange = this.attackRange;
        player.m_basic_attackCdTime = this.attackCdTime;
        player.m_buff_attackCdTime = this.buff_attackCdTime;
    }
    //9/13新增
    onUpdate() {
        let colorNum: number = 2;
        let colorMat: Array<number> =
            [
                Math.floor(Math.random() * 2) + 2, 0, 0, 0, -100, //R
                0, Math.floor(Math.random() * 2) + 1, 0, 0, -100, //G
                0, 0, Math.floor(Math.random() * 2) + 2, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        let glowFilter_charge: Laya.GlowFilter = new Laya.GlowFilter("#df6ef4", 40, 0, 0);
        CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint) ? [glowFilter_charge, colorFilter] : [];
        OathManager.catLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint) ? [glowFilter_charge, colorFilter] : [];

        //更新誓約所影響的數值變化
        OathManager.oathBuffUpdate();
    }
}