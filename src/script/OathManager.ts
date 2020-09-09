import EnemyHandler from "./EnemyHandler";

import CharacterInit from "./CharacterInit";

export default class OathManager extends Laya.Script{

    public static increaseBloodyPoint: number = 10;
    public static isCharging: boolean = false;

    public static getBloodyPoint(){
        return CharacterInit.playerEnt.m_bloodPoint;
    }
    public static setBloodyPoint(amount: number){
        CharacterInit.playerEnt.m_bloodPoint = (amount > CharacterInit.playerEnt.m_maxBloodPoint) ? CharacterInit.playerEnt.m_maxBloodPoint : amount;
        return CharacterInit.playerEnt.m_bloodPoint;
    }
    public static showBloodyPoint(player: Laya.Animation) {
        let oathBar = new Laya.ProgressBar();
        oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 50);
        oathBar.height = 50;
        oathBar.width = 300;
        oathBar.skin = "comp/progress.png";
        setInterval((() => {
            oathBar.pos(player.x - Laya.stage.width / 2 + 50, player.y - Laya.stage.height / 2 + 100);
            oathBar.value = CharacterInit.playerEnt.m_bloodPoint / CharacterInit.playerEnt.m_maxBloodPoint;
        }), 10);
        Laya.stage.addChild(oathBar);
    }
    
    public static charge(){
        if(!this.isCharging){
            if(CharacterInit.playerEnt.m_bloodPoint < 20) return;
            CharacterInit.playerEnt.m_bloodPoint -= 20;
            this.isCharging = true;
        }
    }

    public static chargeAttack(enemyLabel: string){
        if(!this.isCharging) return;
        
        let victim = EnemyHandler.getEnemyByLabel(enemyLabel);
        
        EnemyHandler.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 1000));
        console.log("ChargeAttack!");
        this.isCharging = false;
        
    }
    
}