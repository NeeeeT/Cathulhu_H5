/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import CharacterMove from "./script/CharacterMove"
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
    static startScene:any="First.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=true;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/CharacterMove.ts",CharacterMove);
    }
}
GameConfig.init();