import EnemyHandler from "./EnemyHandler";

import CharacterInit from "./CharacterInit";

export default class OathManager extends Laya.Script {

    public static increaseBloodyPoint: number = 10;
    public static isCharging: boolean = false;

    public static getBloodyPoint(){
        return CharacterInit.playerEnt.m_bloodyPoint;
    }
    public static setBloodyPoint(amount: number){
        CharacterInit.playerEnt.m_bloodyPoint = (amount > CharacterInit.playerEnt.m_maxBloodyPoint) ? CharacterInit.playerEnt.m_maxBloodyPoint : amount;
        return CharacterInit.playerEnt.m_bloodyPoint;
    }
    public static showBloodyPoint(player: Laya.Animation) {
        let oathBar = new Laya.ProgressBar();
        oathBar.pos(player.x - Laya.stage.width / 2 + 160, player.y - Laya.stage.height / 2 + 50);
        oathBar.height = 40;
        oathBar.width = 300;
        oathBar.skin = "comp/progress.png";
        setInterval((() => {
            oathBar.pos(player.x - Laya.stage.width / 2 + 140, player.y - Laya.stage.height / 2 + 80);
            oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
        }), 10);
        Laya.stage.addChild(oathBar);
    }
    //9/12新增邪貓logo
    public static showBloodyLogo(player: Laya.Animation, url: string) {
        let catLogo: Laya.Animation = new Laya.Animation();
        catLogo.scaleX = 0.6;
        catLogo.scaleY = 0.6;
        catLogo.source = url;
        setInterval((() => {
            catLogo.pos(player.x - Laya.stage.width / 2 + 30, player.y - Laya.stage.height / 2 + 45);
        }), 10);
        Laya.stage.addChild(catLogo);
        catLogo.play();
    }
    
    public static charge(){
        if(!this.isCharging){
            if(CharacterInit.playerEnt.m_bloodyPoint < 20) return;
            CharacterInit.playerEnt.m_bloodyPoint -= 20;
            this.isCharging = true;
        }
    }
    public static chargeAttack(enemyLabel: string){
        if(!this.isCharging) return;
        
        let victim = EnemyHandler.getEnemyByLabel(enemyLabel);
        victim.takeDamage(Math.round(Math.floor(Math.random() * 51) + 1000));
        console.log("ChargeAttack!");
        this.isCharging = false;

    }

}