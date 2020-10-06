import CharacterInit from "./CharacterInit";

export default class SceneInit extends Laya.Script {
    /** @prop {name:sceneBackgroundColor,tips:"戰鬥場景的背景顏色",type:string,default:"#4a4a4a"}*/
    sceneBackgroundColor: string = '#4a4a4a';

    constructor() {
        super();
    }
    onAwake() {
        Laya.loader.load(["font/silver.ttf"], Laya.Handler.create(this, ()=>{
            console.log('字體加載完畢!!!');
        }))//加載字體

        Laya.stage.bgColor = this.sceneBackgroundColor;
        this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
    }
    private generator(): void {
        //生成怪物、玩家
    }
    private setSound(volume: number, url: string, loop: number): void {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
}