import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";

export default class EnemyInit extends Laya.Script{
    /** @prop {name:enemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;
    /** @prop {name:enemyLeft,tips:"生成的敵人數量",type:int,default:50}*/
    enemyLeft: number = 50;
    battleToggle = true;

    constructor(){
        super();
    }
    onStart(){
        let player = CharacterInit.playerEnt.m_animation;
        let enemy = EnemyHandler.enemyPool;
        // let isFacingRight: boolean = CharacterInit.playerEnt.m_isFacingRight;

        EnemyHandler.generator(player, 1, 0);
        setInterval(() =>{
            if(CharacterInit.playerEnt.m_animation.destroyed || this.enemyLeft <= 0 || enemy.length >= 20) return;
            EnemyHandler.generator(player, 1, 0);
            this.enemyLeft--;
        }, this.enemyGenerateTime)
        this.showBattleInfo();
    }
    onUpdate(){
        if(this.enemyLeft <= 0 && EnemyHandler.enemyPool.length <= 0){
            CharacterInit.playerEnt.m_animation.destroy();
            Laya.Scene.open("Village.scene");
            Laya.stage.x = Laya.stage.y = 0;
            this.battleToggle = false;
        }
    }
    showBattleInfo(): void{
        let info = new Laya.Text();
        let player = CharacterInit.playerEnt.m_animation;

        info.fontSize = 45;
        info.color = "#efefef";
        info.stroke = 3;
        info.font = "silver";
        info.strokeColor = "#000";

        Laya.stage.addChild(info);

        let timer = setInterval(()=>{
            if(!this.battleToggle){
                clearInterval(timer);
                info.destroy();
                return;
            }
            info.text = "剩餘敵人數量 : " + String(this.enemyLeft) + "\n場上敵人數量 : " + EnemyHandler.getEnemiesCount();
            info.pos(player.x - 50, player.y - 400);
        }, 10)
    }
}