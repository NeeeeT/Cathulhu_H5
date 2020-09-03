export default class SceneInit extends Laya.Script {
    constructor() {
        super();
    }
    onAwake() {
        Laya.stage.bgColor = '#000';
        this.setSound(0.6, "Audio/Bgm/BGM1.wav", 0);
    }

    private setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
}