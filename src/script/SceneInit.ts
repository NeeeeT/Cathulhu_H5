import EnemyInit from "./EnemyInit";
import Village from "./Village";
import ZOrderManager from "./ZOrderManager";

export default class SceneInit extends Laya.Script {
    /** @prop {name:sceneBackgroundColor,tips:"戰鬥場景的背景顏色",type:string,default:"#4a4a4a"}*/
    sceneBackgroundColor: string = '#4a4a4a';

    // public static battleMapName: string;
    // backgroundMap: Laya.Sprite;

    constructor() {
        super();
    }
    onAwake() {
        // Laya.Scene.open("Loading.scene");
        // Laya.loader.load(this.resourceLoad, Laya.Handler.create(this, ()=>{
            
        // }))

        Laya.stage.bgColor = this.sceneBackgroundColor;
        this.setMusic(0.6, "Audio/Bgm/BGM01.mp3", 0);
        // let bg: Laya.Sprite = this.owner.scene.getChildByName('Background') as Laya.Sprite;
        // ZOrderManager.setZOrder(bg, 5);
        
        // this.backgroundMap = Laya.Pool.getItemByClass("backgroundMap", Laya.Sprite);
        // this.backgroundMap.size(4098, 768);
        // this.backgroundMap.pos(0, 0);
        // Laya.stage.addChild(this.backgroundMap);
        // ZOrderManager.setZOrder(this.backgroundMap, 5);
        // this.changeMap();
    }
    private setMusic(volume: number, url: string, loop: number): void {
        Laya.SoundManager.playMusic(url, loop);
        Laya.SoundManager.setMusicVolume(volume);
    }
    // public static setBattleMap(mapName: string) {
    //     SceneInit.battleMapName = mapName;
    // }
    // public changeMap() {
    //     switch (SceneInit.battleMapName) {
    //         case 'RedForest':
    //             this.backgroundMap.loadImage("Background(0912)/Red Forest/Red Forest(x3)(0912).png");
    //             break;
    //         case 'Town':
    //             this.backgroundMap.loadImage("Background(0912)/gray town(x3)(0911).png");
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // public static removeMap() {
        
    // }
}