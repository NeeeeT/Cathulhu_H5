import CharacterInit, { Character } from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";

export enum DebuffType{
    none = 0,
    blind = 1 << 0, //失明
    bodyCrumble = 1 << 1, //肢體崩壞
    insane = 1 << 2, //理智喪失
    predator = 1 << 3, //掠食者
    decay = 1 << 4,//侵蝕
}

export abstract class DebuffProto extends Laya.Script {
    player: Character = CharacterInit.playerEnt;
    debuffText: string;
    
    public debuffUpdate(): void {
        
    }
}

export class Blind extends DebuffProto{
    debuffText = "哈，那東西爆掉的樣子真滑稽";
}

export class BodyCrumble extends DebuffProto{
    debuffText = "希望你還走得回去";
}

export class Insane extends DebuffProto{
    debuffText = "對力量的渴望會讓你拋棄理性";
}

export class Predator extends DebuffProto{
    debuffText = "它們循著氣息來了";
}

export class Decay extends DebuffProto{
    debuffText = "為我戰鬥至到粉身碎骨吧";
    isKilling: boolean = false;
    killingTimer: number = 0;
    currentEnemyCount: number = 0;
    priviousEnemyCount: number = 0;
    
    public checkKilling(){
        setTimeout(() => {
            this.priviousEnemyCount = EnemyHandler.getEnemiesCount();
        }, 100);
        this.currentEnemyCount = EnemyHandler.getEnemiesCount();
        console.log(this.currentEnemyCount - this.priviousEnemyCount);
        
        if (this.currentEnemyCount - this.priviousEnemyCount > 0) this.killingTimer = 120;
        if (this.killingTimer > 0) {
            this.isKilling = true;
            this.killingTimer--;
        } else {
            this.isKilling = false;
        }
    }
    public decayEffect() {
        this.checkKilling();
        setInterval(() => {
            if (this.isKilling) {
                this.player.setHealth(this.player.getHealth() - (this.player.m_maxHealth * 0.1));
            }
        }, 1000)
    }
    public debuffUpdate() {
        super.debuffUpdate();
        this.decayEffect();
    }
}

export class DebuffManager extends Laya.Script{

    public static CastDeBuff(debuffType: number) {
        let debuff: DebuffProto = this.decideDebuffType(debuffType);

        debuff.debuffUpdate();
        return debuff;
    }

    private static decideDebuffType(debuffType: number) {
        switch (debuffType) {
            case 1 << 0: return new Blind();
            case 1 << 1: return new BodyCrumble();
            case 1 << 2: return new Insane();
            case 1 << 3: return new Predator();
            case 1 << 4: return new Decay();
        };
    }
}