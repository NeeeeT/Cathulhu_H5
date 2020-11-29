export default class SceneInit extends Laya.Script {
    /** @prop {name:sceneBackgroundColor,tips:"戰鬥場景的背景顏色",type:string,default:"#4a4a4a"}*/
    sceneBackgroundColor: string = '#4a4a4a';
    
    resourceLoad = ["Audio/Bgm/BGM01.mp3", "Audio/Attack/Attack0.wav", "Audio/Attack/Attack1.wav", "font/silver.ttf", "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
                    "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas",
                    "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas",
                    "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas", "UI/loading.png",
                ];

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