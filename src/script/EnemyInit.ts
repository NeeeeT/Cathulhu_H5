import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";

export default class EnemyInit extends Laya.Script{
    /** @prop {name:enemyGenerateTime,tips:"經過多少時間(ms)會生成1個敵人",type:int,default:3000}*/
    enemyGenerateTime: number = 5000;
    /** @prop {name:enemyLeft,tips:"生成的敵人數量",type:int,default:50}*/
    enemyLeft: number = 50;
    /** @prop {name:roundTimeLeft,tips:"回合的時間限制(sec)",type:int,default:180}*/
    roundTimeLeft: number = 180;

    battleToggle = true;
    battleTimer = null;

    timeLeftValue: number;

    endingRewardUI: Laya.Sprite;
    endingSkillUI: Laya.Sprite;

    constructor(){
        super();
    }
    onStart(){
        this.timeLeftValue = this.roundTimeLeft;

        let player = CharacterInit.playerEnt.m_animation;
        let enemy = EnemyHandler.enemyPool;
        setInterval(() =>{
            if(CharacterInit.playerEnt.m_animation.destroyed || this.enemyLeft <= 0 || enemy.length >= 20) return;
            EnemyHandler.generator(player, 1, 0);
            this.enemyLeft--;
        }, this.enemyGenerateTime)
        this.battleTimer = setInterval(()=>{
            if(!player || player.destroyed){
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            if(this.enemyLeft <= 0 && EnemyHandler.enemyPool.length <= 0){
                // Laya.Scene.open("Village.scene");
                // Laya.stage.x = Laya.stage.y = 0; 
                this.battleToggle = false;
                this.unsetCharacter();
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            else if(this.timeLeftValue < 0){
                console.log('時間到! 你輸了:(');
                clearInterval(this.battleTimer);
                this.battleTimer = null;
                return;
            }
            this.timeLeftValue--;
        }, 1000);
        this.showBattleInfo();
    }
    onKeyUp(e: Laya.Event){
        if(this.endingRewardUI && e.keyCode === 32){
            Laya.Tween.to(this.endingRewardUI, {alpha: 0.2}, 500, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                this.endingRewardUI.destroy();
                this.endingRewardUI = null;
                this.showEndSkill();
            }), 0);
        };
    }
    showEndSkill(): void{
        let player = CharacterInit.playerEnt.m_animation;
        this.endingSkillUI = new Laya.Sprite();
        this.endingSkillUI.width = 684;
        this.endingSkillUI.height = 576;
        this.endingSkillUI.loadImage('ui/ending/skill.png');
        this.endingSkillUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 650 : 2850) : (player.x - 325), 94);//544 - 450 = 94
        this.endingSkillUI.alpha = 0;

        Laya.stage.addChild(this.endingSkillUI);

        Laya.Tween.to(this.endingSkillUI, {alpha: 1.0}, 500, Laya.Ease.linearInOut, null, 0);
    }
    unsetCharacter(): void{
        let player = CharacterInit.playerEnt.m_animation;
        Laya.Tween.to(player, {alpha: 0}, 700, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
            this.showEndRewardUI();
            player.destroy();
            player.destroyed = true;
        }), 0);
    }
    showEndRewardUI(): void{
        let player = CharacterInit.playerEnt.m_animation;
        this.endingRewardUI = new Laya.Sprite();
        this.endingRewardUI.width = 342;
        this.endingRewardUI.height = 288;
        this.endingRewardUI.loadImage('ui/ending/ending.png');
        this.endingRewardUI.pos((Laya.stage.x === -250 || Laya.stage.x === -2475) ? ((Laya.stage.x === -250) ? 810 : 3025) : (player.x - 150), 94);
        Laya.stage.addChild(this.endingRewardUI);
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
            info.text = "剩餘時間: " + String(this.timeLeftValue) + "\n剩餘敵人數量 : " + String(this.enemyLeft) + "\n場上敵人數量 : " + EnemyHandler.getEnemiesCount();
            info.pos(player.x - 50, player.y - 400);
        }, 10)
    }
}