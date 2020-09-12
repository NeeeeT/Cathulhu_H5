import CharacterInit from "./CharacterInit";

export default class SceneInit extends Laya.Script {
    constructor() {
        super();
    }
    onAwake() {
        Laya.stage.bgColor = '#4a4a4a';//9/12更改
        this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);

        setTimeout((()=>{
            console.log(CharacterInit.playerEnt);
        }), 5000);
    }
    private generator(): void{
        //生成怪物、玩家
    }
    private setSound(volume: number, url: string, loop: number): void{
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
}