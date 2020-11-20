import CharacterInit from "./CharacterInit";

import { OathStatus } from "./OathStatus";
import { DebuffType, Blind, BodyCrumble, Insane, Predator, Decay } from "./DebuffType";
import EnemyInit from "./EnemyInit";
import Turtorial from "./Tutorial";

export default class OathManager extends Laya.Script {

    public oathState: number = 0;
    public increaseBloodyPoint: number = 10;
    public overChargeCount: number = 0;
    public addDebuffTimer = null;
    public playerDebuff: DebuffType = DebuffType.none;
    public blindProto: Blind = null;
    public bodyCrumbleProto: BodyCrumble = null;
    public insaneProto: Insane = null;
    public predatorProto: Predator = null;
    public decayProto: Decay = null;
    
    public characterLogo: Laya.Animation;
    public oathBar: Laya.ProgressBar;

    public catSkillIcon: Laya.Sprite;
    public humanSkillIcon: Laya.Sprite;
    public sprintIcon: Laya.Sprite;

    public catSkillIconCd: Laya.Text;
    public humanSkillIconCd: Laya.Text;
    public sprintIconCd: Laya.Text;
    
    
    

    public initOathSystem() {
        this.oathState = 0;
        this.addDebuffTimer = null;
        // CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
        // this.currentBloodyPoint = 0;
        // this.playerDebuff = DebuffType.none;
        // for (let i = 0; i <= 4; i++) {
        //     this.removeDebuff(1 << i);
        // }
        this.clearAddDebuffTimer();
        this.removeAllDebuff();
        this.clearBloodyUI();
    }
    // public getBloodyPoint(){
    //     return CharacterInit.playerEnt.m_bloodyPoint;
    // }
    // public setBloodyPoint(amount: number){
    //     CharacterInit.playerEnt.m_bloodyPoint = amount;
    //     return CharacterInit.playerEnt.m_bloodyPoint;
    // }

    public get currentBloodyPoint() {
        return CharacterInit.playerEnt.m_bloodyPoint;
    }

    public set currentBloodyPoint(amount: number) {
        CharacterInit.playerEnt.m_bloodyPoint = amount;
        if (Turtorial.noOath) return;
        if (!CharacterInit.playerEnt.m_animation.destroyed && this.oathBar != null)
            this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
        console.log("當前獻祭值量：",CharacterInit.playerEnt.m_bloodyPoint, "獻祭值條比例：",this.oathBar.value);
    }
        
        
    public showBloodyPoint(player: Laya.Animation) {
        this.oathBar = new Laya.ProgressBar();
        this.oathBar.skin = "UI/bp_100.png";
        let timer = setInterval((() => {
            if (CharacterInit.playerEnt.m_animation.destroyed) {
                this.clearBloodyUI();
                clearInterval(timer);
                return;
            }
            if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                this.oathBar.pos(player.x - Laya.stage.width / 2 + 180, 107.5);
            }
            if (Laya.stage.x >= -250) this.oathBar.pos(935 - Laya.stage.width / 2 + 180, 107.5);
            if (Laya.stage.x <= -2475) this.oathBar.pos(3155 - Laya.stage.width / 2 + 180, 107.5);
            if (!CharacterInit.playerEnt.m_animation.destroyed && this.oathBar != null)
                this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
            // console.log(CharacterInit.playerEnt.m_bloodyPoint);
            
            
        }), 5);
        Laya.stage.addChild(this.oathBar);
    }
    //10/21新增
    public showBloodyLogo(player: Laya.Animation) {

        this.characterLogo = new Laya.Animation();

        this.catSkillIcon = new Laya.Sprite();
        this.humanSkillIcon = new Laya.Sprite();
        this.sprintIcon = new Laya.Sprite();

        this.catSkillIconCd = new Laya.Text();
        this.humanSkillIconCd = new Laya.Text();
        this.sprintIconCd = new Laya.Text();

        this.catSkillIcon.width = this.catSkillIcon.height = 69;
        this.humanSkillIcon.width = this.humanSkillIcon.height = 69;
        this.sprintIcon.width = this.sprintIcon.height = 69;
        this.catSkillIconCd.width = this.humanSkillIconCd.width = this.sprintIconCd.width = 100; 
        this.catSkillIconCd.fontSize = this.humanSkillIconCd.fontSize = this.sprintIconCd.fontSize = 42;
        this.catSkillIconCd.font = this.humanSkillIconCd.font = this.sprintIconCd.font = 'silver';
        this.catSkillIconCd.stroke = this.humanSkillIconCd.stroke = this.sprintIconCd.stroke = 2;
        this.catSkillIconCd.strokeColor = this.humanSkillIconCd.strokeColor = this.sprintIconCd.strokeColor = '#000';
        this.catSkillIconCd.color = this.humanSkillIconCd.color = this.sprintIconCd.color = '#fff';


        this.characterLogo.source = "UI/Box.png";
             
        this.sprintIcon.loadImage("ui/icon/sprint.png");
        let timer = setInterval((() => {
            
            if (CharacterInit.playerEnt.m_animation.destroyed) {
                clearInterval(timer);
                timer = null;
                return;
            }
            if (!CharacterInit.playerEnt.m_animation.destroyed && this.characterLogo != null){
                if (Laya.stage.x < -250 && Laya.stage.x > -2475) this.characterLogo.pos(player.x - Laya.stage.width / 2 + 20, 20);
                if (Laya.stage.x >= -250) this.characterLogo.pos(935 - Laya.stage.width / 2 + 20, 20);
                if (Laya.stage.x <= -2475) this.characterLogo.pos(3155 - Laya.stage.width / 2 + 20, 20);
                let pos: object = {
                    'x': this.characterLogo.x,
                    'y': this.characterLogo.y,
                }
                this.catSkillIcon.loadImage(CharacterInit.playerEnt.m_catSkill.m_iconA);
                this.humanSkillIcon.loadImage(CharacterInit.playerEnt.m_humanSkill.m_iconA);
                this.catSkillIcon.pos(pos['x']+16, pos['y']+87);
                this.humanSkillIcon.pos(pos['x']+116, pos['y']+87);
                this.sprintIcon.pos(pos['x']+66,pos['y']+37);
                this.catSkillIconCd.pos(this.catSkillIcon.x+29,this.catSkillIcon.y+21);
                this.humanSkillIconCd.pos(this.humanSkillIcon.x+29,this.humanSkillIcon.y+21);
                this.sprintIconCd.pos(this.sprintIcon.x+29,this.sprintIcon.y+21);
                this.catSkillIcon.alpha = CharacterInit.playerEnt.m_catSkill.m_canUse ? 1:0.3;
                this.humanSkillIcon.alpha = CharacterInit.playerEnt.m_humanSkill.m_canUse ? 1:0.3;
                this.sprintIcon.alpha = CharacterInit.playerEnt.m_canSprint ? 1:0.3;
                this.catSkillIconCd.text = CharacterInit.playerEnt.m_catSkill.m_canUse ? "":String(CharacterInit.playerEnt.m_catSkill.m_cdCount);
                this.humanSkillIconCd.text = CharacterInit.playerEnt.m_humanSkill.m_canUse ? "":String(CharacterInit.playerEnt.m_humanSkill.m_cdCount);
}          
            this.sprintIconCd.text = CharacterInit.playerEnt.m_canSprint ? "":String(CharacterInit.playerEnt.m_sprintCdCount);
        }), 5);
        Laya.stage.addChild(this.characterLogo);
        Laya.stage.addChild(this.catSkillIcon);
        Laya.stage.addChild(this.humanSkillIcon);
        Laya.stage.addChild(this.catSkillIconCd);
        Laya.stage.addChild(this.humanSkillIconCd)
        Laya.stage.addChild(this.sprintIcon);
        Laya.stage.addChild(this.sprintIconCd);
        this.characterLogo.play();
        
    }
    public clearBloodyUI() {
        if(this.oathBar != null){
            this.oathBar.destroy();
            this.oathBar = null;
        }
        if(this.characterLogo != null){
            this.characterLogo.destroy();
            this.characterLogo = null;
        }
        if(this.catSkillIcon != null){
            this.catSkillIcon.destroy();
            this.catSkillIcon = null;
        }
        if(this.humanSkillIcon != null){
            this.humanSkillIcon.destroy();
            this.humanSkillIcon = null;
        }
        if(this.catSkillIconCd != null){
            this.catSkillIconCd.destroy();
            this.catSkillIconCd = null;
        }
        if(this.humanSkillIconCd != null){
            this.humanSkillIconCd.destroy();
            this.humanSkillIconCd = null;
        }
        if(this.sprintIcon != null){
            this.sprintIcon.destroy();
            this.sprintIcon = null;
        }
        if(this.sprintIconCd != null){
            this.sprintIconCd.destroy();
            this.sprintIconCd = null;
        }
    }
    public oathChargeDetect(): boolean{
        return (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? true : false;
    }

    public oathBuffUpdate(){
        if(CharacterInit.playerEnt.m_animation.destroyed) return;

        if(this.oathChargeDetect()){
            CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_buff_xMaxVelocity;
            // CharacterInit.playerEnt.m_velocityMultiplier = CharacterInit.playerEnt.m_buff_velocityMultiplier;
            CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_buff_attackCdTime;
            CharacterInit.playerEnt.m_damageMultiplier = CharacterInit.playerEnt.m_buff_damageMultiPlier;
        }else{
            CharacterInit.playerEnt.m_xMaxVelocity = CharacterInit.playerEnt.m_basic_xMaxVelocity;
            // CharacterInit.playerEnt.m_velocityMultiplier = CharacterInit.playerEnt.m_basic_velocityMultiplier;
            CharacterInit.playerEnt.m_attackCdTime = CharacterInit.playerEnt.m_basic_attackCdTime;
            CharacterInit.playerEnt.m_damageMultiplier = CharacterInit.playerEnt.m_basic_damageMultiPlier;
        }
    }

    public addDebuff(type: number): void {
        switch (type) {
            case 1 << 0:
                this.playerDebuff |= DebuffType.blind;
                if (this.blindProto === null) {
                    console.log("add Blind");
                    
                    this.blindProto = new Blind();
                    this.blindProto.startBlind();
                }
                break;
            case 1 << 1:
                this.playerDebuff |= DebuffType.bodyCrumble;
                if (this.bodyCrumbleProto === null) {
                    this.bodyCrumbleProto = new BodyCrumble();
                    this.bodyCrumbleProto.startBodyCrumble();
                }
                break;
            case 1 << 2:
                this.playerDebuff |= DebuffType.insane;
                if (this.insaneProto === null) {
                    this.insaneProto = new Insane();
                    this.insaneProto.startInsane();
                }
                break;
            case 1 << 3:
                this.playerDebuff |= DebuffType.predator;
                if (this.predatorProto === null) {
                    this.predatorProto = new Predator();
                    this.predatorProto.startPredator();
                }
                break;
            case 1 << 4:
                this.playerDebuff |= DebuffType.decay;
                if (this.decayProto === null) {
                    this.decayProto = new Decay();
                    this.decayProto.startDecay();
                }
                break;
        }
    }

    public removeDebuff(type: number): void {
        switch (type) {
            case 1 << 0:
                this.playerDebuff ^= DebuffType.blind;
                if (this.blindProto != null) {
                    this.blindProto.stopBlind();
                    this.blindProto = null;
                }
                break;
            case 1 << 1:
                this.playerDebuff ^= DebuffType.bodyCrumble;
                if (this.bodyCrumbleProto != null) {
                    this.bodyCrumbleProto.stopBodyCrumble();
                    this.bodyCrumbleProto = null;
                }
                break;
            case 1 << 2:
                this.playerDebuff ^= DebuffType.insane;
                if (this.insaneProto != null) {
                    this.insaneProto.stopInsane();
                    this.insaneProto = null;
                }
                break;
            case 1 << 3:
                this.playerDebuff ^= DebuffType.predator;
                if (this.predatorProto != null) {
                    this.predatorProto.stopPredator();
                    this.predatorProto = null;
                }
                break;
            case 1 << 4:
                this.playerDebuff ^= DebuffType.decay;
                if (this.decayProto != null) {
                    this.decayProto.stopDecay();
                    this.decayProto = null;
                }
                break;
        }
    }

    public removeAllDebuff(): void {
        for (let i = 0; i <= 4; i++) {
            this.removeDebuff(1 << i);
        }
        this.playerDebuff = DebuffType.none;
    }

    public clearAddDebuffTimer(): void{
        clearInterval(this.addDebuffTimer);
        this.addDebuffTimer = null;
    }
    public oathUpdate() {
        switch (this.oathState) {
            case OathStatus.normal:
                //目前普通狀態無特殊效果
                
                //若達到上限則轉為charge狀態
                if (this.oathChargeDetect()) {
                    this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                    CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                    this.oathState = OathStatus.charge; 
                }
                break;
            case OathStatus.charge:
                
                //overCharge計數達到上限，轉為overCharge狀態
                if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft && this.overChargeCount >= 2) {
                    console.log("轉態到overCharge");
                    this.overChargeCount = 0;
                    this.oathBar.skin = "UI/bp_150.png";
                    this.oathBar.sizeGrid = "0,200,0,50";
                    CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_hard;

                    if (this.addDebuffTimer === null) {
                        console.log("添加addDebuffTimer");
                        this.addDebuffTimer = setInterval(() => {
                            if (CharacterInit.playerEnt.m_animation.destroyed || EnemyInit.isWin) {
                                this.clearAddDebuffTimer();
                                return;
                            }    
                            console.log("執行addDebuffTimer內函式");
                            this.randomAddDebuff();
                        }, 5000);    
                    }

                    this.oathState = OathStatus.overCharge;
                    return;
                }
                //overCharge計數未達到上限，增加overCharge計數
                if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_soft  && this.overChargeCount < 2) {
                    this.overChargeCount ++;
                    this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint;
                    return;
                }
                //若BP低於上限則清空overCharge計數，並轉為normal
                if (this.currentBloodyPoint < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    this.overChargeCount = 0;
                    this.oathState = OathStatus.normal;
                    return;
                }
                break;
            case OathStatus.overCharge:

                if (EnemyInit.isWin) this.clearAddDebuffTimer();
                //視當前BP值轉換狀態
                if (this.currentBloodyPoint > CharacterInit.playerEnt.m_maxBloodyPoint_hard) {
                    this.currentBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint;
                    return;
                }
                if (this.currentBloodyPoint === CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    this.oathBar.skin = "UI/bp_100.png";
                    CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                    this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
                    this.clearAddDebuffTimer();
                    this.removeAllDebuff();
                    this.oathState = OathStatus.charge;
                    return;
                } 
                if (this.currentBloodyPoint < CharacterInit.playerEnt.m_maxBloodyPoint_soft) {
                    this.oathBar.skin = "UI/bp_100.png";
                    CharacterInit.playerEnt.m_maxBloodyPoint = CharacterInit.playerEnt.m_maxBloodyPoint_soft;
                    this.oathBar.value = CharacterInit.playerEnt.m_bloodyPoint / CharacterInit.playerEnt.m_maxBloodyPoint;
                    this.clearAddDebuffTimer();
                    this.removeAllDebuff();
                    this.oathState = OathStatus.normal;
                    return;
                }
                break;
                default:
                    this.oathState = OathStatus.normal;
                    break;
        }
        //更新Debuff中需要更新的資訊，如計時器
        this.debuffUpdate();
        //更新角色充能時數值
        this.oathBuffUpdate();
    }

    public debuffUpdate(): void {
        
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
    
    public randomAddDebuff() {
        console.log("還是有執行randomAddDebuff，但>=31返回了，playerDebuff值 = ",this.playerDebuff);
        
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
            this.addDebuff(1 << type);
        }
    }

    public oathCastSkillCheck(cost: number, valve: number = 30): boolean{
        //施放閥值
        if (this.currentBloodyPoint < valve || this.currentBloodyPoint < cost) return false; 
        return true;
    }

    public oathCastSkill(cost: number): void {
        //操作OathManager
        console.log("扣除了技能消耗的獻祭值");
        this.currentBloodyPoint = this.currentBloodyPoint - cost;
    }
}