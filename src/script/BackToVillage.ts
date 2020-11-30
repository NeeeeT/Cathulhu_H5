import EnemyHandler from "./EnemyHandler";
import MissionManager from "./MissionManager";

export default class BackToVillage extends Laya.Script{
    onStart():void {
        Laya.stage.on(Laya.Event.CLICK, this, () => {
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
            EnemyHandler.clearAllEnemy();
            
            let missionManager = new MissionManager();
            missionManager.generateMissionData(9);
            missionManager.showMissionUI();
        })
    }

    onKeyUp(e: Laya.Event):void{
        if(e.keyCode === 32){
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
            EnemyHandler.clearAllEnemy();
            
            let missionManager = new MissionManager();
            missionManager.generateMissionData(9);
            missionManager.showMissionUI();
        }
    }
}