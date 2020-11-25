import CharacterInit, { Character } from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";
import EnemyInit from "./EnemyInit";
import Turtorial from "./Tutorial";

export enum DebuffType{
    none = 0,
    blind = 1 << 0, //失明
    bodyCrumble = 1 << 1, //肢體崩壞
    decay = 1 << 2,//侵蝕
    insane = 1 << 3, //理智喪失
    predator = 1 << 4, //掠食者
}

export abstract class DebuffProto extends Laya.Script {
    player: Character = CharacterInit.playerEnt;
    debuffText: string;
    
    constructor() {
        super();
    }

    public debuffUpdate(): void {
        this.player = CharacterInit.playerEnt;
        
    }
    public debuffTextEffect(text: string): void {
        let damageText = new Laya.Text();

        // damageText.pos(this.m_animation.x - this.m_animation.width/2 - 20, this.m_animation.y - this.m_animation.height - 100);
        damageText.pos(this.player.m_animation.x, this.player.m_animation.y);
        damageText.bold = true;
        damageText.align = "center";
        damageText.alpha = 1;

        damageText.fontSize = 20;
        damageText.color = "red";

        damageText.text = text;
        damageText.font = "silver";
        damageText.stroke = 5;
        damageText.strokeColor = "#000";

        //soundNum = critical ? 0 : 1;
        //this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
        Laya.stage.addChild(damageText);

        Laya.Tween.to(damageText, { alpha: 0.65, fontSize: damageText.fontSize + 50, y: damageText.y + 50, }, 450, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 100 }, 450, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { damageText.destroy() }), 0);
            }), 0);
    }
}

export class Blind extends DebuffProto{
    debuffText = "哈，那東西爆掉的樣子真滑稽";
    blindSprite: Laya.Sprite = null;
    blindBlackBg: Laya.Sprite = null;
    blindCircleMask: Laya.Sprite = null;
    blindHandler = null;
    public debuffUpdate() {
        
        super.debuffUpdate();
        if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
            this.blindBlackBg.x = this.player.m_animation.x - 1400 / 2;
            this.blindCircleMask.x = this.player.m_animation.x;
            this.blindCircleMask.y = this.player.m_animation.y;
        }

    }
    constructor() {
        super();
        // console.log("執行 Blind Constructor");
        
        this.blindSprite = new Laya.Sprite();
        this.blindBlackBg = new Laya.Sprite();
        this.blindCircleMask = new Laya.Sprite();
        this.blindSprite.cacheAs = "bitmap";
        Laya.stage.addChild(this.blindSprite);
        
        this.blindBlackBg.graphics.drawRect(this.player.m_animation.x, 0, 1400, 768, "000");
        this.blindCircleMask.graphics.drawCircle(this.player.m_animation.x, this.player.m_animation.y, 150, "000");
        this.blindSprite.addChild(this.blindBlackBg);
        this.blindCircleMask.blendMode = "destination-out";
        this.blindSprite.addChild(this.blindCircleMask);

        this.blindHandler = setInterval(() => {
            this.debuffUpdate();
        }, 10)
        
    }
    
    public startBlind() {
        this.debuffTextEffect(this.debuffText);
    }

    public stopBlind() {
        // console.log("停止Blind");
        this.blindSprite.graphics.clear();
        this.blindBlackBg.graphics.clear();
        this.blindCircleMask.graphics.clear();
        clearInterval(this.blindHandler);
        this.blindHandler = null;
    }
}

export class BodyCrumble extends DebuffProto{
    debuffText = "希望你還走得回去";
    bodyCrumbleHandler = null;
    originVM: number = 0;
    newVM: number = 0;
    originXMaxVel_basic: number = 0;
    newXMaxVel_basic: number = 0;
    originXMaxVel_buff: number = 0;
    newXMaxVel_buff: number = 0;
    public debuffUpdate() {
        super.debuffUpdate();
        this.player.m_basic_xMaxVelocity = this.newXMaxVel_basic;
        this.player.m_buff_xMaxVelocity = this.newXMaxVel_buff;
        this.player.m_velocityMultiplier = this.newVM;
    }
    constructor() {
        super();
        // console.log("執行 BodyCrumble Constructor");
        this.originXMaxVel_basic = this.player.m_basic_xMaxVelocity;
        this.originXMaxVel_buff = this.player.m_buff_xMaxVelocity;
        this.originVM = this.player.m_velocityMultiplier;
        this.newVM = this.player.m_velocityMultiplier * 0.3;
        this.newXMaxVel_basic = this.player.m_basic_xMaxVelocity * 0.3;
        this.newXMaxVel_buff = this.player.m_buff_xMaxVelocity * 0.3;

        this.bodyCrumbleHandler = setInterval(() => {
            this.debuffUpdate();
        }, 10)
        
    }
    
    public startBodyCrumble() {
        this.debuffTextEffect(this.debuffText);
    }

    public stopBodyCrumble() {
        // console.log("停止BodyCrumble");
        
         this.player.m_basic_xMaxVelocity = this.originXMaxVel_basic;
         this.player.m_buff_xMaxVelocity = this.originXMaxVel_buff;
        this.player.m_velocityMultiplier = this.originVM;
        clearInterval(this.bodyCrumbleHandler);
        this.bodyCrumbleHandler = null;
    }
}

export class Decay extends DebuffProto{
    debuffText = "為我戰鬥至到粉身碎骨吧";
    isDecaying = false;
    isKilling: boolean = false;
    isDamaging: boolean = false;
    killingTimer: number = 0;
    _currentEnemyCount: number = 0;
    previousEnemyCount: number = 0;
    decayHandler = null;
    checkKillingHandler = null;

    public get currentEnemyCount() {
        return this._currentEnemyCount;
    }

    public set currentEnemyCount(value: number) {
        this.previousEnemyCount = this.currentEnemyCount;
        this._currentEnemyCount = value;
        
        // console.log("上次儲存敵人數：", this.previousEnemyCount,"當前敵人數",this.currentEnemyCount,"是否殺戮中：", this.isKilling);
        
    }

    public debuffUpdate() {
        super.debuffUpdate();
        if (this.player.m_animation.destroyed) {
            clearInterval(this.decayHandler);
            this.decayHandler = null;
            return;
        }    
        if (this.isDamaging && !EnemyInit.isWin) {
            // console.log("正在傷害玩家");
            if (Turtorial.safeDebuff && this.player.getHealth() > this.player.m_maxHealth * 0.2) {
                this.player.setHealth(this.player.getHealth() - this.player.m_maxHealth * 0.1);
                return;
            };
            if(!Turtorial.safeDebuff) this.player.setHealth(this.player.getHealth() - this.player.m_maxHealth * 0.1);
        }

    }
    constructor() {
        super();
        // console.log("執行 Decay Constructor");
        this.checkKillingHandler = setInterval(() => {
            this.currentEnemyCount = EnemyHandler.getEnemiesCount();
            if (this.currentEnemyCount < this.previousEnemyCount) {
                this.isKilling = true;
            } else {
                this.isKilling = false;
            }
        }, 100);
        this.decayHandler = setInterval(() => {
            this.debuffUpdate();
        }, 1000)
        
    }
    
    public startDecay() {
        this.isDecaying = true;
        this.debuffTextEffect(this.debuffText);
    }
    
    public stopDecay() {
        // console.log("停止Decay");
        this.isDecaying = false;
        clearInterval(this.decayHandler);
        this.decayHandler = null;
    }
    
    public killingTimerUpdate() {
        
        if (this.isKilling) this.killingTimer = 120;
        if (!this.isDecaying) return;
        if (this.killingTimer > 0) {
            this.killingTimer--;
            this.isDamaging = false;
        }else if (this.killingTimer <= 0) {
            this.isDamaging = true;
        }
        // console.log("isKilling: ", this.isKilling ,"killingTimer: ",this.killingTimer, "isDamaging: ", this.isDamaging);
        
    }
    // public checkKilling(){
    //     setTimeout(() => {
    //         this.priviousEnemyCount = EnemyHandler.getEnemiesCount();
    //     }, 100);
    //     this.currentEnemyCount = EnemyHandler.getEnemiesCount();
    //     console.log(this.currentEnemyCount - this.priviousEnemyCount);
        
    //     if (this.currentEnemyCount - this.priviousEnemyCount > 0) this.killingTimer = 120;
    //     if (this.killingTimer > 0) {
    //         this.isKilling = true;
    //         this.killingTimer--;
    //     } else {
    //         this.isKilling = false;
    //     }
    // }

    // public decayEffect() {
    //     this.checkKilling();
    //     setInterval(() => {
    //         if (this.isKilling) {
    //             this.player.setHealth(this.player.getHealth() - (this.player.m_maxHealth * 0.1));
    //         }
    //     }, 1000)
    // }

}

export class Insane extends DebuffProto{
    debuffText = "對力量的渴望會讓你拋棄理性";
    public debuffUpdate() {
        super.debuffUpdate();

    }
    constructor() {
        super();
        // console.log("執行 Insane Constructor");
 
        
    }
    
    public startInsane() {
        this.debuffTextEffect(this.debuffText);
    }

    public stopInsane() {
        // console.log("停止Insane");
    }
}

export class Predator extends DebuffProto{
    debuffText = "它們循著氣息來了";
    public debuffUpdate() {
        super.debuffUpdate();

    }
    constructor() {
        super();
        // console.log("執行 Predator Constructor");
 
        
    }
    
    public startPredator() {
        this.debuffTextEffect(this.debuffText);
    }

    public stopPredator() {
        // console.log("停止BodyPredator");
    }
}
