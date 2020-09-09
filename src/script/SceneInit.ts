import { EnemyNormal } from "./EnemyManager";
import EnemyHandler from "./EnemyHandler";
import CharacterManager from "./CharacterManager"

export default class SceneInit extends Laya.Script {
    /** @prop {name:xMaxVelocity,tips:"x軸速度上限",type:int,default:5}*/
    xMaxVelocity: number;
    /** @prop {name:yMaxVelocity,tips:"y軸速度上限",type:int,default:5}*/
    yMaxVelocity: number;
    /** @prop {name:velocityMultiplier,tips:"改變角色速度增加幅度",type:int,default:5}*/
    velocityMultiplier: number;
    /** @prop {name:attackBoxRange,tips:"調整攻擊範圍方塊距離",type:int,default:100}*/
    attackBoxRange: number;

    constructor() {
        super();
    }
    onAwake() {
        Laya.stage.bgColor = '#000';
        this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
    }
    private generator(): void{
        //生成怪物、玩家
    }
    private setSound(volume: number, url: string, loop: number): void{
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
}