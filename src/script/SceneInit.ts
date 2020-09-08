import { EnemyNormal } from "./EnemyManager";
import Character from "./CharacterManager";
import EnemyHandler from "./EnemyHandler";

export default class SceneInit extends Laya.Script {
    public charcc = new Character();
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