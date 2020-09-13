/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import CharacterInit from "./script/CharacterInit"
import EnemyInit from "./script/EnemyInit"
import SceneInit from "./script/SceneInit"
import Village from "./script/Village"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1366;
    static height:number=768;
    static scaleMode:string="noscale";
    static screenMode:string="none";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="Village.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=true;
    static physicsDebug:boolean=true;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/CharacterInit.ts",CharacterInit);
        reg("script/EnemyInit.ts",EnemyInit);
        reg("script/SceneInit.ts",SceneInit);
        reg("script/Village.ts",Village);
    }
}
GameConfig.init();