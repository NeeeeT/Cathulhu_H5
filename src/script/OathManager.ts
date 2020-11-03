import EnemyHandler from "./EnemyHandler";
import CharacterInit from "./CharacterInit";

import { OathStatus } from "./OathStatus";
import { DebuffType, Blind, BodyCrumble, Insane, Predator, Decay } from "./DebuffType";

export default class OathManager extends Laya.Script {

    public static oathState: number = 0;
    public static increaseBloodyPoint: number = 10;
    public static isCharging: boolean = false;
    public static overChargeCount: number = 0;
    public static addDebuffTimer = null;
    public static playerDebuff: DebuffType = DebuffType.none;
    public static blindProto: Blind = null;
    public static bodyCrumbleProto: BodyCrumble = null;
    public static insaneProto: Insane = null;
    public static predatorProto: Predator = null;
    public static decayProto: Decay = null;
    
    public static characterLogo: Laya.Animation;
    public static oathBar: Laya.ProgressBar;
    // public static oathBarSkinUrl: string; 

    public static initOathSystem() {
        
    }
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
            if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                OathManager.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
            }
            OathManager.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint_hard;
            
        }), 5);
        Laya.stage.addChild(OathManager.oathBar);
    }
    //10/21新增
    public static showBloodyLogo(player: Laya.Animation) {

        this.characterLogo = new Laya.Animation();
        // this.characterLogo.scaleX = 0.6;
        // this.characterLogo.scaleY = 0.6;
        this.characterLogo.source = "UI/Box.png";
        setInterval((() => {
            if (Laya.stage.x < -252.5 && Laya.stage.x > -2472.5) {
                this.characterLogo.pos(player.x - Laya.stage.width / 2 + 20, 20);
            }
        }), 5);
        Laya.stage.addChild(this.characterLogo);
        this.characterLogo.play();
        
    }
    
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
            case 1 << 0:
                OathManager.playerDebuff |= DebuffType.blind;
                if (this.blindProto === null) {
                    console.log("add Blind");
                    
                    this.blindProto = new Blind();
                    this.blindProto.startBlind();
                }
                break;
            case 1 << 1:
                OathManager.playerDebuff |= DebuffType.bodyCrumble;
                if (this.bodyCrumbleProto === null) {
                    this.bodyCrumbleProto = new BodyCrumble();
                    this.bodyCrumbleProto.startBodyCrumble();
                }
                break;
            case 1 << 2:
                OathManager.playerDebuff |= DebuffType.insane;
                if (this.insaneProto === null) {
                    this.insaneProto = new Insane();
                    this.insaneProto.startInsane();
                }
                break;
            case 1 << 3:
                OathManager.playerDebuff |= DebuffType.predator;
                if (this.predatorProto === null) {
                    this.predatorProto = new Predator();
                    this.predatorProto.startPredator();
                }
                break;
            case 1 << 4:
                OathManager.playerDebuff |= DebuffType.decay;
                if (this.decayProto === null) {
                    this.decayProto = new Decay();
                    this.decayProto.startDecay();
                }
                break;
        }
    }

    public static removeDebuff(type: number): void {
        switch (type) {
            case 1 << 0:
                OathManager.playerDebuff ^= DebuffType.blind;
                if (this.blindProto != null) {
                    this.blindProto.stopBlind();
                    this.blindProto = null;
                }
                break;
            case 1 << 1:
                OathManager.playerDebuff ^= DebuffType.bodyCrumble;
                if (this.bodyCrumbleProto != null) {
                    this.bodyCrumbleProto.stopBodyCrumble();
                    this.bodyCrumbleProto = null;
                }
                break;
            case 1 << 2:
                OathManager.playerDebuff ^= DebuffType.insane;
                if (this.insaneProto != null) {
                    this.insaneProto.stopInsane();
                    this.insaneProto = null;
                }
                break;
            case 1 << 3:
                OathManager.playerDebuff ^= DebuffType.predator;
                if (this.predatorProto != null) {
                    this.predatorProto.stopPredator();
                    this.predatorProto = null;
                }
                break;
            case 1 << 4:
                OathManager.playerDebuff ^= DebuffType.decay;
                if (this.decayProto != null) {
                    this.decayProto.stopDecay();
                    this.decayProto = null;
                }
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
                    // OathManager.addDebuff(1 << 4);
                    
                }
                break;
            case OathStatus.charge:
                
                //overCharge計數達到上限，轉為overCharge狀態
                if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_soft && OathManager.overChargeCount >= 2) {
                    console.log("轉態到overCharge");
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
                // let addDebuffTimer = setTimeout(() => {
                //     //debuff
                //     OathManager.addDebuff(1 << Math.ceil(Math.random() * 4));
                //     console.log("debuff", this.playerDebuff);
                    
                // }, 5000);
                if (this.addDebuffTimer === null) {
                    console.log(this.addDebuffTimer);
                    
                    console.log("添加addDebuffTimer");
                    this.addDebuffTimer = setInterval(() => {
                        console.log("執行addDebuffTimer內函式");
                        console.log(this.playerDebuff);
                        if (CharacterInit.playerEnt === null) clearInterval(this.addDebuffTimer);
                        this.randomAddDebuff();

                    }, 5000);    
                    console.log(this.addDebuffTimer);
                }
                //視當前BP值轉換狀態
                if (OathManager.getBloodyPoint() > CharacterInit.playerEnt.m_maxBloodyPoint_hard) {
                    OathManager.setBloodyPoint(CharacterInit.playerEnt.m_maxBloodyPoint_hard);
                    return;
                }
                if (OathManager.getBloodyPoint() === CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    clearInterval(this.addDebuffTimer);
                    this.addDebuffTimer = null;
                    for (let i = 0; i <= 4; i++) {
                        this.removeDebuff(1 << i);
                    }
                    this.playerDebuff = DebuffType.none;
                    OathManager.oathBar.skin = "UI/bp_100.png";
                    this.oathState = OathStatus.charge;
                    return;
                } 
                if (OathManager.getBloodyPoint() < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    clearInterval(this.addDebuffTimer);
                    this.addDebuffTimer = null;
                    for (let i = 0; i <= 4; i++) {
                        this.removeDebuff(1 << i);
                    }
                    this.playerDebuff = DebuffType.none;
                    OathManager.oathBar.skin = "UI/bp_100.png";
                    this.oathState = OathStatus.normal;
                    return;
                }
                break;
                default:
                    this.oathState = OathStatus.normal;
                    break;
        }
        
        // console.log(this.playerDebuff);
        
                OathManager.debuffUpdate();
                //更新角色充能時數值
                OathManager.oathBuffUpdate();
    }

    public static debuffUpdate(): void {
        if ((this.playerDebuff & DebuffType.blind) === DebuffType.blind) {
            
        }
        if ((this.playerDebuff & DebuffType.bodyCrumble) === DebuffType.bodyCrumble) {
            
        }
        if ((this.playerDebuff & DebuffType.insane) === DebuffType.insane) {
            
        }
        if ((this.playerDebuff & DebuffType.predator) === DebuffType.predator) {
            
        }
        if ((this.playerDebuff & DebuffType.decay) === DebuffType.decay) {
            if(this.decayProto != null) this.decayProto.killingTimerUpdate();
        }
    }
    
    public static randomAddDebuff() {
        if (this.playerDebuff >= 31) return;
        console.log("執行randomAddDebuff");
        
        let type = Math.floor(Math.random() * 5);
        let isInside = false;
        for (let i = 0; i <= 4; i++) {
            if ((this.playerDebuff & 1 << i) === 1 << type) isInside = true;
        }
        if (isInside) {
            console.log("debuff重複，重新抽取");
            this.randomAddDebuff();
        }
        if (!isInside) {
            OathManager.addDebuff(1 << type);
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