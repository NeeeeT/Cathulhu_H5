/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import BackToVillage from "./script/BackToVillage"
import SceneInit from "./script/SceneInit"
import EnemyInit from "./script/EnemyInit"
import CharacterInit from "./script/CharacterInit"
import SkillList from "./script/SkillList"
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
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/BackToVillage.ts",BackToVillage);
        reg("script/SceneInit.ts",SceneInit);
        reg("script/EnemyInit.ts",EnemyInit);
        reg("script/CharacterInit.ts",CharacterInit);
        reg("script/SkillList.ts",SkillList);
        reg("script/Village.ts",Village);
    }
}
GameConfig.init();