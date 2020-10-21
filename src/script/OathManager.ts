import EnemyHandler from "./EnemyHandler";
import CharacterInit from "./CharacterInit";

import { OathStatus } from "./OathStatus";
import { DebuffType } from "./DebuffType";

export default class OathManager extends Laya.Script {

    public static oathState: number = 0;
    public static increaseBloodyPoint: number = 10;
    public static isCharging: boolean = false;
    public static overChargeCount: number = 0;
    public static playerDebuff: DebuffType = DebuffType.none;
    
    public static characterLogo: Laya.Animation;
    public static oathBar: Laya.ProgressBar;
    // public static oathBarSkinUrl: string; 

    public static getBloodyPoint(){
        return CharacterInit.playerEnt.m_bloodyPoint;
    }
    public static setBloodyPoint(amount: number){
        CharacterInit.playerEnt.m_bloodyPoint = amount;
        return CharacterInit.playerEnt.m_bloodyPoint;
    }
    public static showBloodyPoint(player: Laya.Animation) {
        
        OathManager.oathBar = new Laya.ProgressBar();
        OathManager.oathBar.skin = "UI/bp_100.png";
        setInterval((() => {
            OathManager.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
            OathManager.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint_hard;
            
        }), 10);
        Laya.stage.addChild(OathManager.oathBar);
    }
    //10/21新增
    public static showBloodyLogo(player: Laya.Animation) {

        this.characterLogo = new Laya.Animation();
        // this.characterLogo.scaleX = 0.6;
        // this.characterLogo.scaleY = 0.6;
        this.characterLogo.source = "UI/Box.png";
        setInterval((() => {
            this.characterLogo.pos(player.x - Laya.stage.width / 2 + 20, 20);
        }), 10);
        Laya.stage.addChild(this.characterLogo);
        this.characterLogo.play();
        
    }
    
    // public static charge(){
    //     if(!this.isCharging){
    //         //當獻祭值超過最大值的30%才能施放技能
    //         if(CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint < 0.3) return;
    //         CharacterInit.playerEnt.m_bloodyPoint -= 20;
    //         this.isCharging = true;
    //     }
    // }
    // public static chargeAttack(enemyLabel: string){
    //     if(!this.isCharging) return;
        
    //     let victim = EnemyHandler.getEnemyByLabel(enemyLabel);
    //     victim.takeDamage(Math.round(Math.floor(Math.random() * 51) + 1000));
    //     console.log("ChargeAttack!");
    //     this.isCharging = false;

    // }
    public static oathChargeDetect(): boolean{
        return (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? true : false;
    }

    public static oathBuffUpdate(){
        if(CharacterInit.playerEnt.m_animation.destroyed) return;

        if(OathManager.oathChargeDetect()){
            CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_buff_xMaxVelocity;
            // CharacterInit.playerEnt.m_velocityMultiplier = CharacterInit.playerEnt.m_buff_velocityMultiplier;
            CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_buff_attackCdTime;
        }else{
            CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_basic_xMaxVelocity;
            // CharacterInit.playerEnt.m_velocityMultiplier = CharacterInit.playerEnt.m_basic_velocityMultiplier;
            CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_basic_attackCdTime;
        }
    }

    public static addDebuff(type: number): void {
        switch (type) {
            case 1:
                OathManager.playerDebuff |= DebuffType.blind;
                break;
            case 2:
                OathManager.playerDebuff |= DebuffType.bodyCrumble;
                break;
            case 3:
                OathManager.playerDebuff |= DebuffType.insane;
                break;
            case 4:
                OathManager.playerDebuff |= DebuffType.predator;
                break;
            case 5:
                OathManager.playerDebuff |= DebuffType.decay;
                break;
        }
    }

    public static removeDebuff(type: number): void {
        switch (type) {
            case 1:
                OathManager.playerDebuff ^= DebuffType.blind;
                break;
            case 2:
                OathManager.playerDebuff ^= DebuffType.bodyCrumble;
                break;
            case 3:
                OathManager.playerDebuff ^= DebuffType.insane;
                break;
            case 4:
                OathManager.playerDebuff ^= DebuffType.predator;
                break;
            case 5:
                OathManager.playerDebuff ^= DebuffType.decay;
                break;
        }
    }

    public static oathUpdate() {
        switch (this.oathState) {
            case OathStatus.normal:
                //目前普通狀態無特殊效果

                //若達到上限則轉為charge狀態
                if (OathManager.oathChargeDetect()) {
                    OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_soft);
                    this.oathState = OathStatus.charge;
                }
                break;
            case OathStatus.charge:
                
                //更新角色充能時數值
                OathManager.oathBuffUpdate();
                //overCharge計數達到上限，轉為overCharge狀態
                if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_soft && OathManager.overChargeCount >= 2) {
                    OathManager.overChargeCount = 0;
                    OathManager.oathBar.skin = "UI/bp_150.png";
                    this.oathState = OathStatus.overCharge;
                    return;
                }
                //overCharge計數未達到上限，增加overCharge計數
                if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_soft  && OathManager.overChargeCount < 2) {
                    OathManager.overChargeCount ++;
                    OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_soft);
                    return;
                }
                //若BP低於上限則清空overCharge計數，並轉為normal
                if (OathManager.getBloodyPoint() < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    OathManager.overChargeCount = 0;
                    this.oathState = OathStatus.normal;
                    return;
                }
                break;
            case OathStatus.overCharge:
                //計算處於此狀態時間，時間到時給予debuff
                let addDebuffTimer = setTimeout(() => {
                    //debuff
                    OathManager.addDebuff(Math.floor(Math.random() * 4 + 1));
                    console.log("debuff", this.playerDebuff);
                    
                }, 5000);

                //視當前BP值轉換狀態
                if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_hard) {
                    OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_hard);
                    return;
                }
                if (OathManager.getBloodyPoint() === CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    clearInterval(addDebuffTimer);
                    OathManager.oathBar.skin = "UI/bp_100.png";
                    this.oathState = OathStatus.charge;
                    return;
                } 
                if (OathManager.getBloodyPoint() < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    clearInterval(addDebuffTimer);
                    OathManager.oathBar.skin = "UI/bp_100.png";
                    this.oathState = OathStatus.normal;
                    return;
                }
                break;
            default:
                this.oathState = OathStatus.normal;
                break;
        }
    }

    public static oathCastSkill(cost: number, valve: number = 30): boolean {
        //施放閥值
        if (OathManager.getBloodyPoint() < valve || OathManager.getBloodyPoint() < cost) return false;
        //操作OathManager
        OathManager.setBloodyPoint(OathManager.getBloodyPoint() - cost);
        
        return true;
    }



}