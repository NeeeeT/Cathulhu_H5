export default class SceneInit extends Laya.Script {
    /** @prop {name:sceneBackgroundColor,tips:"戰鬥場景的背景顏色",type:string,default:"#4a4a4a"}*/
    sceneBackgroundColor: string = '#4a4a4a';

    constructor() {
        super();
    }
    onAwake() {
        // Laya.Scene.open("Loading.scene");
        // Laya.loader.load(this.resourceLoad, Laya.Handler.create(this, ()=>{
            
        // }))

        Laya.stage.bgColor = this.sceneBackgroundColor;
        this.setMusic(0.6, "Audio/Bgm/BGM01.mp3", 0);
    }
    private setMusic(volume: number, url: string, loop: number): void {
        Laya.SoundManager.playMusic(url, loop);
        Laya.SoundManager.setMusicVolume(volume);
    }
}