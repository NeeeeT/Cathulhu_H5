/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import BackToVillage from "./script/BackToVillage"
import SceneInit from "./script/SceneInit"
import EnemyInit from "./script/EnemyInit"
import CharacterInit from "./script/CharacterInit"
import SkillList from "./script/SkillList"
import Loading from "./script/Loading"
import Village from "./script/Village"
import MainToLoading from "./script/MainToLoading"
import Tutorial from "./script/Tutorial"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1366;
    static height:number=768;
    static scaleMode:string="exactfit";
    static screenMode:string="horizontal";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="Main.scene";
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
        reg("script/Loading.ts",Loading);
        reg("script/Village.ts",Village);
        reg("script/MainToLoading.ts",MainToLoading);
        reg("script/Tutorial.ts",Tutorial);
    }
}
GameConfig.init();