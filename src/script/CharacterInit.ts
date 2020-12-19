import OathManager from "./OathManager";

import { VirtualSkill } from "./SkillManager";
import { CharacterStatus } from "./CharacterStatus";

import * as hSkill from "./SkillHuman";
import * as cSkill from "./SkillCat";

import EnemyHandler, { Fast, Newbie, Normal, Shield } from "./EnemyHandler";

import { ExtraData } from "./ExtraData";
import EnemyInit from "./EnemyInit";
import Turtorial from "./Tutorial";
import ZOrderManager from "./ZOrderManager";
import Village from "./Village";
import SceneDestroyer from "./SceneDestroyer";
import SceneInit from "./SceneInit";


export class Character extends Laya.Script {
    m_state: number;
    m_name: string;

    //當前使用數值
    m_health: number;
    m_maxHealth: number;
    m_bloodyPoint: number;
    m_maxBloodyPoint: number;
    m_maxBloodyPoint_soft: number;
    m_maxBloodyPoint_hard: number;
    m_atk: number;
    m_damageMultiplier: number;
    m_critical: number;
    m_criticalDmgMultiplier: number;
    m_defense: number;
    m_xMaxVelocity: number;
    m_yMaxVelocity: number;
    m_velocityMultiplier: number;
    m_attackRange: number;
    m_attackCdTime: number;
    
    m_moveDelayValue: number = 0;
    m_moveDelayTimer = null;
    
    //基礎數值
    m_basic_xMaxVelocity: number;
    // m_basic_velocityMultiplier: number;
    m_basic_attackCdTime: number;
    m_basic_damageMultiPlier: number;
    
    //誓約強化數值
    // m_buff_velocityMultiplier: number;
    m_buff_xMaxVelocity: number;
    m_buff_attackCdTime: number;
    m_buff_damageMultiPlier: number;
    
    //技能傷害倍率
    m_spikeDmgMultiplier: number;
    m_beheadDmgMultiplier: number;
    m_slamDmgMultiplier: number;
    m_blackHoleDmgMultiplier: number;
    m_blackHoleDotDmgMultiplier: number;
    m_bigExplosionDmgMultiplier: number;

    m_playerVelocity: object;

    m_isFacingRight: boolean = true;
    m_canJump: boolean = true;
    m_canAttack: boolean = true;
    m_canSprint: boolean = true;
    m_sprintCdCount: number;
    m_sprintCdTimer = null;
    m_animationChanging: boolean;


    m_atkTimer = null;
    m_atkStep: number = 0;

    m_hurted: boolean = false;
    m_hurtTimer = null;

    m_slashTimer = null;
    // m_walkTimer = null;

    //強化等級
    m_hpLevel: number;
    m_atkLevel: number;

    public m_cameraShakingTimer: number = 0;
    public m_cameraShakingMultiplyer: number = 1;

    m_keyDownList: Array<boolean>;

    m_catSkill: VirtualSkill = null;
    m_humanSkill: VirtualSkill = null;

    m_animation: Laya.Animation;
    m_walkeffect: Laya.Animation = new Laya.Animation();
    m_rigidbody: Laya.RigidBody;
    m_collider: Laya.BoxCollider;
    m_script: Laya.Script;
    m_healthBar: Laya.ProgressBar;

    m_oathManager: OathManager;

    //mobile UI
    m_mobileUIToggle: boolean;
    m_mobileLeftBtn: Laya.Sprite;
    m_mobileRightBtn: Laya.Sprite;
    m_mobileAtkBtn: Laya.Sprite;
    m_mobileSprintBtn: Laya.Sprite;
    m_mobileHumanSkillBtn: Laya.Sprite;
    m_mobileCatSkillBtn: Laya.Sprite;
    m_mobileSprintCd: Laya.Text;
    m_mobileHumanSkillCd: Laya.Text;
    m_mobileCatSkillCd: Laya.Text;

    m_mobileLeftBtnClicked: boolean = false;
    m_mobileRightBtnClicked: boolean = false;
    m_mobileAtkBtnClicked: boolean = false;
    m_mobileSprintBtnClicked: boolean = false;

    mobileLeftBtnResetFunc = () => { };
    mobileRightBtnResetFunc = () => { };
    mobileAtkBtnFunc = () => { };
    mobileSprintBtnFunc = () => { };
    mobileCatSkillBtnFunc = () => { };
    mobileHumanSkillBtnFunc = () => { };

    emptySprForMobile: Laya.Sprite;

    //for scroll background
    BG_Sky_1: Laya.Sprite = new Laya.Sprite();
    BG_Sky_2: Laya.Sprite = new Laya.Sprite();
    BG_Sky_3: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_B_1: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_B_2: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_B_3: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_F_1: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_F_2: Laya.Sprite = new Laya.Sprite();
    BG_Landscape_F_3: Laya.Sprite = new Laya.Sprite();
    BG_Grass_1: Laya.Sprite = new Laya.Sprite();
    BG_Grass_2: Laya.Sprite = new Laya.Sprite();
    BG_Grass_3: Laya.Sprite = new Laya.Sprite();
    BG_Ground_1: Laya.Sprite = new Laya.Sprite();
    BG_Ground_2: Laya.Sprite = new Laya.Sprite();
    BG_Ground_3: Laya.Sprite = new Laya.Sprite();
    BG_Front_1: Laya.Sprite = new Laya.Sprite();
    BG_Front_2: Laya.Sprite = new Laya.Sprite();
    BG_Front_3: Laya.Sprite = new Laya.Sprite();
    

    spawn() {
        console.log('角色生成一次');

        this.loadCharacterData();
        this.getAtkValue(this.m_atkLevel);

        this.m_state = CharacterStatus.idle;

        this.m_animation = new Laya.Animation();
        // this.m_animation = Laya.Pool.getItemByClass("m_animation", Laya.Animation);
        this.m_animation.scaleX = 1;
        this.m_animation.scaleY = 1;
        // this.m_animation.zOrder = 10;
        ZOrderManager.setZOrder(this.m_animation, 10);

        this.m_animation.name = "Player";

        this.m_animation.width = 200;
        this.m_animation.height = 128;
        this.m_animation.pivotX = this.m_animation.width / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;

        this.m_maxBloodyPoint = this.m_maxBloodyPoint_soft;

        this.m_animation.destroyed = false;
        this.m_animation.pos(1345, 544);
        this.m_animation.autoPlay = true;
        this.m_animation.source = 'character/Idle.atlas';
        this.m_animation.interval = 200;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, () => {
            if (this.m_state === CharacterStatus.attackOne || this.m_state === CharacterStatus.attackTwo)
                this.m_animation.stop();

            this.m_animationChanging = false;
            if (Math.abs(this.m_playerVelocity["Vx"]) <= 0 && !this.m_atkTimer)
                this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
        });
        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);

        this.m_script.onAwake = () => {
            this.m_playerVelocity = { Vx: 0, Vy: 0 };
            this.listenKeyBoard();
        }
        this.m_script.onUpdate = () => {
            if (this.m_playerVelocity["Vx"] < -this.m_xMaxVelocity) this.m_playerVelocity["Vx"] = -this.m_xMaxVelocity;
            if (this.m_playerVelocity["Vx"] > this.m_xMaxVelocity) this.m_playerVelocity["Vx"] = this.m_xMaxVelocity;
            if (this.m_animation.y >= 1000.0) {
                this.m_animation.x = 1345;
                this.m_animation.y = 544;
            }
            this.characterMove();
        }
        this.m_script.onTriggerEnter = (col: Laya.BoxCollider | Laya.CircleCollider | Laya.ChainCollider) => {
            if (col.tag === "Enemy") {
                // let rig = col.owner.getComponent(Laya.RigidBody) as Laya.RigidBody;
                // rig.mask = 2;
            }
            if (col.label === "ground") {
                this.resetMove();
                this.m_canJump = true;
            }
            // console.log("敵人攻擊力：",this.getEnemyAttackDamage(col.tag),"敵人爆擊率：",this.getEnemyCriticalRate(col.tag), "敵人爆傷率：", this.getEnemyCriticalDmgRate(col.tag));
            
            
            this.takeDamage(this.getEnemyAttackDamage(col.tag), this.getEnemyCriticalRate(col.tag), this.getEnemyCriticalDmgRate(col.tag));
        }
        this.m_script.onKeyUp = (e: Laya.Event) => {
            if (this.m_canJump) {
                this.m_playerVelocity["Vx"] = 0;
            }
            this.applyMoveX();
            delete this.m_keyDownList[e["keyCode"]];
        }
        this.m_script.onKeyDown = (e: Laya.Event) => {
            let keyCode: number = e["keyCode"];
            this.m_keyDownList[keyCode] = true;
        }
        this.m_collider.width = this.m_animation.width * 0.6;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.x += 38;
        this.m_collider.y -= 1;
        this.m_collider.tag = 'Player';
        // this.m_collider.friction = 1;
        this.m_collider.density = 1;


        this.m_rigidbody.allowRotation = false;
        this.m_rigidbody.gravityScale = 3;
        this.m_rigidbody.category = 4;
        this.m_rigidbody.mask = 2 | 8 | 16;

        Laya.stage.addChild(this.m_animation);
        ZOrderManager.setZOrder(this.m_animation, 20);

        // this.m_oathManager = new OathManager();
        // this.m_oathManager.initOathSystem();
        // this.m_oathManager.showBloodyPoint(this.m_animation);
        // this.m_oathManager.showBloodyLogo(this.m_animation);//角色UI狀態方法
        // this.showHealth();

        if (Laya.Browser.onMobile) {
            this.showMobileUI(this.m_animation);
        }

        
        this.cameraFollower();
        this.setSkill();
        // this.checkJumpTimer();
    };

    onDestroy() {
        this.clearBackground();
    }

    public setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            
            if (CharacterInit.playerEnt != null) {
                //消除角色身上所有Debuff與Debuff計時器
                CharacterInit.playerEnt.clearAddDebuffTimer();
                CharacterInit.playerEnt.removeAllDebuff();
            }

            this.resetMobileBtnEvent();
            this.death();
        }
    }
    public getHealth(): number {
        return this.m_health;
    };
    public death() {
        Laya.Tween.to(this.m_animation, { alpha: 0.0 }, 100, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            Laya.stage.removeChild(this.m_animation);
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
            CharacterInit.generated = false;
            SceneDestroyer.wake();
            CharacterInit.playerEnt.clearBackground();
            Laya.Scene.open("Died.scene");
            Laya.stage.x = Laya.stage.y = 0;
            Laya.SoundManager.stopAll();
        }), 0);
    }
    loadCharacterData(): void {
        ExtraData.loadData();

        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        this.m_hpLevel = data.hpLevel;
        this.m_atkLevel = data.atkDmgLevel;
    }
    getAtkValue(atkLevel: number): number {
        this.m_atk = (30 + Math.round(Math.random() * 100)) * this.m_damageMultiplier + atkLevel * 10;
        return this.m_atk;
    }
    takeDamage(amount: number, criticalRate: number, criticalDmgRate: number) {
        if (amount <= 0 || this.m_animation.destroyed || !this.m_animation || this.m_hurted) return;

        let fakeNum = Math.random() * 100;
        let critical: boolean = (fakeNum <= criticalRate);

        amount *= critical ? criticalDmgRate : 1;
        amount = Math.round(amount);
        this.setHealth(this.getHealth() - amount);
        this.damageTextEffect(amount, critical);

        Laya.Tween.to(this.m_animation, { alpha: 0.65 }, 250, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 250, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
            }), 0);

        this.hurtedEvent(0.5);
        this.bloodSplitEffect(this.m_animation);
    }
    private checkJumpTimer() {
        let timer = setInterval(() => {
            if (!this.m_animation || this.m_animation.destroyed) {
                clearInterval(timer);
                return;
            }
            this.m_canJump = (Math.abs(this.m_animation.y + (this.m_animation.height / 2) - 590) < 10) ? true : false;
            // console.log(this.m_canJump);
        }, 1000);
    }
    private hurtedEvent(time: number) {
        this.m_hurted = true;

        this.m_hurtTimer = setTimeout(() => {
            this.m_hurted = false;
            this.m_hurtTimer = null;
        }, 1000 * time);
    }
    private damageTextEffect(amount: number, critical: boolean): void {
        // let damageText = new Laya.Text();
        let damageText: Laya.Text = Laya.Pool.getItemByClass("damageText", Laya.Text);
        let soundNum: number;

        damageText.pos((this.m_animation.x - this.m_animation.width / 2) + 80, (this.m_animation.y - this.m_animation.height) - 3);
        damageText.bold = true;
        damageText.align = "left";
        damageText.alpha = 1;

        damageText.fontSize = critical ? 40 : 20;
        damageText.color = critical ? '#ff31c8' : "red";

        let temp_text = "";
        for (let i = 0; i < String(amount).length; i++) {
            temp_text += String(amount)[i];
            temp_text += " ";
        }

        damageText.text = temp_text;
        damageText.font = "silver";
        damageText.stroke = 3;
        damageText.strokeColor = "#fff";
        // soundNum = critical ? 0 : 1;
        // this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
        Laya.stage.addChild(damageText);
        ZOrderManager.setZOrder(damageText, 80);
        Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 50, }, 450, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 450, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => {
                        // damageText.destroy()
                        Laya.stage.removeChild(damageText);
                        Laya.Pool.recover("damageText", damageText);
                    }), 0);
            }), 0);
    }
    private listenKeyBoard(): void {
        this.m_keyDownList = [];
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }
    public showHealth() {
        this.m_healthBar = new Laya.ProgressBar();
        // this.m_healthBar.height = 13;
        // this.m_healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
        this.m_healthBar.skin = "UI/hp.png";
        // this.m_healthBar.value = 1;
        // this.m_healthBar.alpha = 1;
        Laya.stage.addChild(this.m_healthBar);
        ZOrderManager.setZOrder(this.m_healthBar, 100);

        let healthBarFunc = function(){
            if (this.m_animation.destroyed) {
                Laya.stage.removeChild(this.m_healthBar);
                this.m_healthBar.destroy();
                this.m_healthBar.destroyed = true;
                Laya.timer.clear(this, healthBarFunc);
                return;
            }
            if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                this.m_healthBar.pos(this.m_animation.x - Laya.stage.width / 2 + 155, 77.5);
            }
            if (Laya.stage.x >= -250) this.m_healthBar.pos(935 - Laya.stage.width / 2 + 155, 77.5);
            if (Laya.stage.x <= -2475) this.m_healthBar.pos(3155 - Laya.stage.width / 2 + 155, 77.5);
            this.m_healthBar.value = this.m_health / this.m_maxHealth;
        }
        Laya.timer.frameLoop(1, this, healthBarFunc);

        // setInterval((() => {
        //     if (this.m_animation.destroyed) {
        //         this.m_healthBar.destroy();
        //         this.m_healthBar.destroyed = true;
        //         return;
        //     }
        //     if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
        //         this.m_healthBar.pos(this.m_animation.x - Laya.stage.width / 2 + 155, 77.5);
        //     }
        //     if (Laya.stage.x >= -250) this.m_healthBar.pos(935 - Laya.stage.width / 2 + 155, 77.5);
        //     if (Laya.stage.x <= -2475) this.m_healthBar.pos(3155 - Laya.stage.width / 2 + 155, 77.5);
        //     this.m_healthBar.value = this.m_health / this.m_maxHealth;
        // }), 15);
    }

    private characterMove() {
        //Left
        if (this.m_keyDownList[37]) {
            this.m_playerVelocity["Vx"] += -1 * this.m_velocityMultiplier;
            if (this.m_isFacingRight) {
                this.m_playerVelocity["Vx"] = 0;
                this.m_animation.skewY = 180;
                this.m_isFacingRight = false;
            }
            this.applyMoveX();
            if (!this.m_animationChanging) this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
        }
        if (this.m_keyDownList[16]) {
            if (!this.m_canSprint || EnemyInit.isWin) return;

            //OathManager test
            // this.m_oathManager.currentBloodyPoint += 50;

            this.delayMove(0.08);
            this.hurtedEvent(1.5);
            this.updateAnimation(this.m_state, CharacterStatus.sprint, null, false, 100);

            this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? 100.0 : -100.0, y: 0.0 };
            this.m_rigidbody.mask = 2 | 16;
            this.m_collider.refresh();


            // let sprintCdDone = () => {
            //     this.m_canSprint = true;
            // }

            // setTimeout(() => {
            //     this.m_rigidbody.mask = 2 | 8 | 16;
            //     this.m_collider.density = 300;
            //     this.m_collider.refresh();
            //     setTimeout(() => {
            //         this.m_collider.density = 1;
            //         this.m_collider.refresh();
            //     }, 10);
            // }, 500)

            let sprintDone = () => {
                this.m_rigidbody.mask = 2 | 8 | 16;
                this.m_collider.density = 300;
                this.m_collider.refresh();

                this.m_collider.density = 1;
                this.m_collider.refresh();
            };
            this.updateSprintCdTimer();
            Laya.stage.frameOnce(30, this, sprintDone);
            // Laya.stage.frameOnce(180, this, () => { this.m_canSprint = true; });
            this.m_canSprint = false;
            Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 10, Laya.Ease.linearInOut,
                Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 150, Laya.Ease.linearInOut,
                        Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
                }), 0);
            setTimeout(() => {
                this.m_canSprint = true;
            },3000);
            this.setSound(0.6, "Audio/Misc/dash.wav", 1);
        }
        //Up
        // if (this.m_keyDownList[38]) {
        //     if (this.m_canJump) {
        //         this.m_playerVelocity["Vy"] -= 12;
        //         this.applyMoveY();
        //         this.m_canJump = false;
        //     }
        // }
        //Right
        if (this.m_keyDownList[39]) {
            this.m_playerVelocity["Vx"] += 1 * this.m_velocityMultiplier;
            if (!this.m_isFacingRight) {
                this.m_playerVelocity["Vx"] = 0;
                this.m_animation.skewY = 0;
                this.m_isFacingRight = true;
            }
            this.applyMoveX();
            if (!this.m_animationChanging) this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
        }
        if (this.m_keyDownList[40]) {//Down
            // new Village().showReinforceUI();
        }
        if (this.m_keyDownList[32]) {
            // let width_offset: number =
            //     (this.m_animation.width / 2.5) * (this.m_isFacingRight ? 1 : -1);
            // let raycast_range: number = 300 * (this.m_isFacingRight ? 1 : -1);
            // let random_color: string =
            //     "#" + (((1 << 24) * Math.random()) | 0).toString(16);
            // let direction: number = this.m_isFacingRight ? 1 : 0;
            // let Raycast_return: object = Raycast._RayCast(
            //     this.m_animation.x + width_offset,
            //     this.m_animation.y,
            //     this.m_animation.x + width_offset + raycast_range,
            //     this.m_animation.y,
            //     direction
            // );
            // DrawCmd.DrawLine(
            //     this.m_animation.x + width_offset,
            //     this.m_animation.y,
            //     this.m_animation.x + width_offset + raycast_range,
            //     this.m_animation.y,
            //     random_color,
            //     2
            // );
            // if (Raycast_return["Hit"]) {
            //     let rig: Laya.RigidBody[] = Raycast_return[
            //     "Rigidbody"
            //     ] as Laya.RigidBody[];
            //     let spr: Laya.Sprite[] = Raycast_return["Sprite"] as Laya.Sprite[];
            //     let world = Laya.Physics.I.world;

            //     //以下實作Raycast貫穿射線(foreach)，若要單體則取物件index，0為靠最近的，依此類推。
            //     spr.forEach((e) => {
            //     e.destroy();
            //     e.destroyed = true;
            //     });
            // }
            // setTimeout(() => {
            //     Laya.stage.graphics.clear();
            //     // this.cd_ray = true;
            // }, 500);
        }
        if (this.m_keyDownList[90]) {
            if (!this.m_canAttack) return;

            // this.m_animation.interval = 100;
            // this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';

            // if(this.m_atkTimerValue > 0)
            // {
            //     this.m_atkTimerValue += this.m_atkTimerInterval;
            // }
            // else{
            //     this.m_atkTimerValue = this.m_atkTimerInterval;
            //     this.m_atkTimer = setInterval(()=>{
            //         if(this.m_atkTimerValue <= 0){
            //             clearInterval(this.m_atkTimer);
            //             this.m_atkTimerValue = -1;
            //             this.m_atkStep = 0;
            //         }
            //         this.m_atkTimerValue -= 0.1;
            //         console.log('working..', this.m_atkTimerValue);
            //     }, 100)
            // }
            if (this.m_atkTimer) clearInterval(this.m_atkTimer);
            // this.createAttackEffect(this.m_animation);
            this.attackStepEventCheck();

            if (!this.m_animationChanging) {
                if (this.m_atkStep === 1) {
                    // ,1,2,3,4, 逗號數為分母(圖數+1)
                    this.updateAnimation(this.m_state, CharacterStatus.attackTwo, null, false, this.m_attackCdTime / 3);
                    // console.log('ATTACK2');
                }
                else if (this.m_atkStep === 0) {
                    this.updateAnimation(this.m_state, CharacterStatus.attackOne, null, false, this.m_attackCdTime / 8);
                    // console.log('ATTACK1');
                }
            }
            this.m_atkStep = this.m_atkStep === 1 ? 0 : 1;
            this.attackSimulation(this.m_atkStep);//另類攻擊判定



            this.m_canAttack = false;

            // this.m_animation.on(Laya.Event.COMPLETE, this, function () {
            //   this.m_animation.interval = 200;
            // this.m_animation.source = 'character/player_idle.atlas'
            //   this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
            // });
            setTimeout(() => {
                this.m_canAttack = true;
            }, this.m_attackCdTime);
        }
        // if (this.m_keyDownList[16]) {
        //     console.log(("按下shift"));
            
        //     // this.m_oathManager.addDebuff(1 << 0);
        //     // this.m_oathManager.setBloodyPoint(100);
        // } 
        if (this.m_keyDownList[67]) {
            if (EnemyInit.isWin) return;
            // console.log("施放人技");
            
            this.m_humanSkill.cast(CharacterInit.playerEnt,
                {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
        }
        if (this.m_keyDownList[88]) {
            if (EnemyInit.isWin) return;
            this.m_catSkill.cast(CharacterInit.playerEnt,
                {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_catSkill.m_cost));
        }
    }
    /*private createAttackCircle(player: Laya.Animation) {
        let atkCircle = new Laya.Sprite();
        let x_offset: number = this.m_isFacingRight ? (player.width * 1) / 2 + 3 : (player.width * 5) / 4 + 3;
        let soundNum: number = Math.floor(Math.random() * 2);
        if (this.m_isFacingRight) {
        atkCircle.pos(
            player.x + x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8
        );
        } else {
        atkCircle.pos(
            player.x - x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8
        );
        }
        let atkBoxCollider: Laya.BoxCollider = atkCircle.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(Laya.RigidBody) as Laya.RigidBody;
        let atkCircleScript: Laya.Script = atkCircle.addComponent(Laya.Script) as Laya.Script;

        atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
        atkCircleRigid.category = 2;
        atkCircleRigid.mask = 8;

        atkCircleScript.onTriggerEnter = function (col: Laya.BoxCollider) {
        if (col.tag === 'Enemy') {
            let eh = EnemyHandler;//敵人控制器
            let victim = eh.getEnemyByLabel(col.label);
            // victim.enemyInjuredColor();//0921新增
            // eh.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 150));//Math.random() * Max-Min +1 ) + Min

            //誓約系統測試
            // OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
            if (!OathManager.isCharging) {
            victim.takeDamage(Math.round(Math.floor(Math.random() * 51) + 150));//Math.random() * Max-Min +1 ) + Min
            Character.setCameraShake(10, 3);
            //誓約系統測試
            OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
            } else {
            OathManager.chargeAttack(col.label);
            Character.setCameraShake(50, 5);
            }
        }
        };
        this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);//loop:0為循環播放
        atkBoxCollider.isSensor = true;
        atkCircleRigid.gravityScale = 0;

        Laya.stage.addChild(atkCircle);

        setTimeout(() => {
        atkCircle.destroy();
        atkCircle.destroyed = true;
        }, 100);
    }*/
    private attackStepEventCheck() {
        this.m_atkTimer = setTimeout(() => {
            this.m_atkStep = 0;
            this.m_atkTimer = null
            this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
        }, this.m_attackCdTime + 200);
    }
    private attackSimulation(type: number): void {
        let temp: Laya.Animation = this.m_animation;
        let atkRange: number = (type === 1) ? this.m_attackRange : this.m_attackRange*2;
        let offsetX: number = this.m_isFacingRight ? (temp.x + (temp.width * 1 / 3)) : (temp.x - (temp.width * 1 / 3) - atkRange);
        let offsetY: number = temp.y - (temp.height / 3);
        let soundNum: number = Math.floor(Math.random() * 2);

        //測試攻擊距離繪圖
        // if(type === 1){
        //     Laya.stage.graphics.drawRect(offsetX, offsetY, atkRange, atkRange, 'red', 'red', 2);
        // }
        // else if(type === 0){
        //     Laya.stage.graphics.drawRect(offsetX, offsetY, atkRange, atkRange, 'yellow', 'yellow', 2);
        // }


        this.attackRangeCheck({
            'x0': offsetX,
            'x1': offsetX + atkRange,
            'y0': offsetY,
            'y1': offsetY + atkRange,
        }, 'rect');

        this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);
    }
    public attackRangeCheck(pos: object, type: string): void {
        // 可做其他形狀的範圍偵測判斷 ex.三角形、圓形, etc...
        let enemy = EnemyHandler.enemyPool;
        switch (type) {
            case 'rect':
                let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
                let soundNum: number;
                let fakeNum = Math.random() * 100;//需再修正
                let critical: boolean = (fakeNum <= 25);//需再修正
                let enemyCount = 0;
                soundNum = critical ? 0 : 1;//需再修正
                enemyFound.forEach((e) => {
                    //敵人受傷傳參(攻擊力函式)
                    e._ent.takeDamage(this.getAtkValue(this.m_atkLevel), this.m_critical, this.m_criticalDmgMultiplier);
                    // e._ent.takeDamage(Math.round(Math.floor(Math.random() * 51) + 150));
                    // if (!OathManager.isCharging) {
                    this.setCameraShake(10, 3);
                    //攻擊增加獻祭值
                    if(!Turtorial.noOath)
                        this.m_oathManager.currentBloodyPoint = this.m_oathManager.currentBloodyPoint + this.m_oathManager.increaseBloodyPoint;
                    if (enemyCount < 3) e._ent.slashLightEffect(e._ent.m_animation);
                    this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
                    enemyCount++;

                    // } else {
                    //     // OathManager.chargeAttack(col.label);
                    //     Character.setCameraShake(50, 5);
                    // }
                });
                break;
            default:
                break;
        }
    }
    public rectIntersect(r1, r2): boolean {
        let aLeftOfB: boolean = r1.x1 < r2.x0;
        let aRightOfB: boolean = r1.x0 > r2.x1;
        let aAboveB: boolean = r1.y0 > r2.y1;
        let aBelowB: boolean = r1.y1 < r2.y0;

        return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
    }
    public createAttackEffect(player: Laya.Animation) {
        // let slashEffect: Laya.Animation = new Laya.Animation();
        let slashEffect: Laya.Animation = Laya.Pool.getItemByClass("slashEffect", Laya.Animation);
        let posX: number;
        let posY: number;
        if (this.m_atkStep === 0) {
            slashEffect.scaleX = 2;
            slashEffect.scaleY = 2;
            posX = 420;
            posY = 560;
            slashEffect.source = "comp/NewSlash_1.atlas";
        }
        else if (this.m_atkStep === 1) {
            slashEffect.scaleX = 3;
            slashEffect.scaleY = 3;
            posX = 600;
            posY = 850;
            slashEffect.source = "comp/NewSlash_2.atlas";
        }
        slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
        slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);        


        //待優化區域
        //濾鏡
        let colorMat: Array<number> =
            [
                1, 0, 0, 0, 500, //R
                0, 1, 0, 0, 500, //G
                0, 0, 1, 0, 500, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        
        slashEffect.filters = [colorFilter];
        //待優化區域end

        slashEffect.on(Laya.Event.COMPLETE, this, function () {
            // slashEffect.destroy();
            // slashEffect.destroyed = true;
            Laya.stage.removeChild(slashEffect);
            Laya.Pool.recover("slashEffect", slashEffect);
            Laya.timer.clear(this, slashTimerFunc);
        });
        Laya.stage.addChild(slashEffect);
        ZOrderManager.setZOrder(slashEffect, 60);
        slashEffect.play();

        let slashTimerFunc = function() {
            // if (slashEffect.destroyed) {
            //     clearInterval(m_slashTimer);
            //     m_slashTimer = null;
            //     return;
            // }
            slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
            slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
        }

        // let m_slashTimer = setInterval(() => {
        //     if (slashEffect.destroyed) {
        //         clearInterval(m_slashTimer);
        //         m_slashTimer = null;
        //         return;
        //     }
        //     slashEffect.skewY = this.m_isFacingRight ? 0 : 180;
        //     slashEffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
        // }, 10);
    }
    public createWalkEffect(player: Laya.Animation) {
        // this.m_walkeffect = new Laya.Animation();

        this.m_walkeffect = Laya.Pool.getItemByClass("walkeffect", Laya.Animation);

        this.m_walkeffect.source = "comp/WalkEffects.atlas";
        let posX: number = 280;
        let posY: number = 270;
        this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
        //濾鏡
        let colorMat: Array<number> =
            [
                1, 0, 0, 0, 500, //R
                0, 1, 0, 0, 500, //G
                0, 0, 1, 0, 500, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        //this.m_walkeffect.filters = [colorFilter, glowFilter];
        // this.m_walkeffect.on(Laya.Event.COMPLETE, this, function () {
        //     this.m_walkeffect.destroy();
        //     this.m_walkeffect.destroyed = true;
        // });
        Laya.stage.addChild(this.m_walkeffect);
        ZOrderManager.setZOrder(this.m_walkeffect, 24);
        this.m_walkeffect.play();

        let walkTimerFunc = function () {
            if (this.m_animation.destroyed || EnemyInit.isWin){
                // this.m_walkeffect.destroy();
                // this.m_walkeffect.destroyed = true;
                Laya.stage.removeChild(this.m_walkeffect);
                Laya.Pool.recover("walkeffect", this.m_walkeffect);
                Laya.timer.clear(this, walkTimerFunc);
                return;
            }
            // if (this.m_walkeffect.destroyed) {
            //     clearInterval(this.m_walkTimer);
            //     this.m_walkTimer = null;
            //     return;
            // }
            this.m_walkeffect.skewY = this.m_isFacingRight ? 0 : 180;
            this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
        }
        Laya.timer.frameLoop(1, this, walkTimerFunc);


        // this.m_walkTimer = setInterval(() => {
        //     if (this.m_animation.destroyed || EnemyInit.isWin){
        //         this.m_walkeffect.destroy();
        //         this.m_walkeffect.destroyed = true;
        //     }
        //     if (this.m_walkeffect.destroyed) {
        //         clearInterval(this.m_walkTimer);
        //         this.m_walkTimer = null;
        //         return;
        //     }
        //     this.m_walkeffect.skewY = this.m_isFacingRight ? 0 : 180;
        //     this.m_walkeffect.pos(player.x + (this.m_isFacingRight ? -posX : posX), player.y - posY + 10);
        // }, 10);
    }
    private setSkill(): void {
        this.m_catSkill = this.getSkillTypeByExtraData('c', ExtraData.currentData['catSkill']);
        this.m_humanSkill = this.getSkillTypeByExtraData('h', ExtraData.currentData['humanSkill']);
        // if(Village.isNewbie){
        //     this.m_catSkill = new cSkill.None();
        //     this.m_humanSkill = new cSkill.None();
        // }
    }
    public getSkillTypeByExtraData(type: string, id: number): VirtualSkill {
        if (type === 'c') {
            switch (id) {
                case 0:
                    return new cSkill.None();
                case 1:
                    return new cSkill.Slam();
                case 2:
                    return new cSkill.BlackHole();
                default:
                    return new cSkill.None();
            }
        }
        else if (type === 'h') {
            switch (id) {
                case 0:
                    return new hSkill.None();
                case 1:
                    return new hSkill.Spike();
                case 2:
                    return new hSkill.Behead();
                default:
                    return new hSkill.None();
            }
        }
        else {
            return null;
        }
    }
    /** 設置角色移動的延遲時間，期間內可進行Velocity的改動，時間可堆疊。單位: seconds */
    public delayMove(time: number): void {
        if (this.m_moveDelayTimer) {
            this.m_moveDelayValue += time;
        }
        else {
            this.m_moveDelayValue = time;
            this.m_moveDelayTimer = setInterval(() => {
                if (this.m_moveDelayValue <= 0) {
                    this.resetMove();
                    clearInterval(this.m_moveDelayTimer);
                    this.m_moveDelayTimer = null;
                    this.m_moveDelayValue = 0;
                }
                this.m_moveDelayValue -= 0.01;
                // console.log('working');
            }, 10)
        }
    }
    private resetMove(): void {
        this.m_playerVelocity["Vx"] = 0;
        this.m_playerVelocity["Vy"] = 0;
        this.applyMoveX();
        this.applyMoveY();
    }
    private applyMoveX(): void {
        if (this.m_moveDelayValue > 0 || this.m_animation.destroyed || !this.m_animation || EnemyInit.isWin)
            return;
        this.m_rigidbody.linearVelocity = {
            x: this.m_playerVelocity['Vx'],
            y: this.m_rigidbody.linearVelocity.y,
        };
        // this.m_rigidbody.setVelocity({
        // x: this.m_playerVelocity["Vx"],
        // y: this.m_rigidbody.linearVelocity.y,
        // });

        if (!this.m_animationChanging && this.m_playerVelocity["Vx"] === 0)
            this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
    }
    private applyMoveY(): void {
        if (!this.m_animation || this.m_animation.destroyed)
            return;
        this.m_rigidbody.setVelocity({
            x: this.m_rigidbody.linearVelocity.x,
            y: this.m_playerVelocity["Vy"],
        });
    }
    public setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    private cameraFollower(): void {
        if (this.m_animation.destroyed) return;

        //移動整個舞台的背景模式
        let player_pivot_x: number = Laya.stage.width / 2;

        // let player_pivot_y: number = Laya.stage.height / 2;

        // let BG_Sky_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Sky_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Sky_3: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_B_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_B_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_B_3: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_F_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_F_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Landscape_F_3: Laya.Sprite = new Laya.Sprite();
        // let BG_Grass_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Grass_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Grass_3: Laya.Sprite = new Laya.Sprite();
        // let BG_Ground_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Ground_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Ground_3: Laya.Sprite = new Laya.Sprite();
        // let BG_Front_1: Laya.Sprite = new Laya.Sprite();
        // let BG_Front_2: Laya.Sprite = new Laya.Sprite();
        // let BG_Front_3: Laya.Sprite = new Laya.Sprite();

        

        //以幀為主體的更新
        let camTimerFunc = function(){
            if (this.m_animation.destroyed) {
                Laya.timer.clear(this, camTimerFunc);
                return;
            }

            if (this.m_cameraShakingTimer > 0) {
                let randomSign: number = (Math.floor(Math.random() * 2) == 1) ? 1 : -1; //隨機取正負數
                Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                Laya.stage.y = Math.random() * this.m_cameraShakingMultiplyer * randomSign;
                this.m_cameraShakingTimer--;
            } else {

                this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (player_pivot_x - this.m_animation.x);
                this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (player_pivot_x - this.m_animation.x);
                this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (player_pivot_x - this.m_animation.x);
                
                this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (player_pivot_x - this.m_animation.x);
                this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (player_pivot_x - this.m_animation.x);
                this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (player_pivot_x - this.m_animation.x);
                
                this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (player_pivot_x - this.m_animation.x);
                this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (player_pivot_x - this.m_animation.x);
                this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (player_pivot_x - this.m_animation.x);

                this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (player_pivot_x - this.m_animation.x);
                this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (player_pivot_x - this.m_animation.x);
                this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (player_pivot_x - this.m_animation.x);
                
                this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (player_pivot_x - this.m_animation.x);
                this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (player_pivot_x - this.m_animation.x);
                this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (player_pivot_x - this.m_animation.x);

                this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (player_pivot_x - this.m_animation.x);
                this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (player_pivot_x - this.m_animation.x);
                this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (player_pivot_x - this.m_animation.x);

                Laya.stage.y = 0

                //移動整個舞台的背景模式
                Laya.stage.x = player_pivot_x - this.m_animation.x;
                // Laya.stage.y = 0
            }
            //移動整個舞台的背景模式
            if (Laya.stage.x >= -250.0){
                Laya.stage.x = -250.0;
                this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (-250);
                this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (-250);
                this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (-250);
                
                this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (-250);
                this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (-250);
                this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (-250);
                
                this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (-250);
                this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (-250);
                this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (-250);

                this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (-250);
                this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (-250);
                this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (-250);
                
                this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (-250);
                this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (-250);
                this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (-250);

                this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (-250);
                this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (-250);
                this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (-250);
            }
            if (Laya.stage.x <= -2475.0){
                Laya.stage.x = -2475.0;

                this.BG_Sky_1.x = -662 + Laya.stage.width * 0 - 0.9 * (-2475);
                this.BG_Sky_2.x = -662 + Laya.stage.width * 1 - 0.9 * (-2475);
                this.BG_Sky_3.x = -662 + Laya.stage.width * 2 - 0.9 * (-2475);
                
                this.BG_Landscape_B_1.x = -662 + Laya.stage.width * 0 - 0.7 * (-2475);
                this.BG_Landscape_B_2.x = -662 + Laya.stage.width * 1 - 0.7 * (-2475);
                this.BG_Landscape_B_3.x = -662 + Laya.stage.width * 2 - 0.7 * (-2475);
                
                this.BG_Landscape_F_1.x = -662 + Laya.stage.width * 0 - 0.5 * (-2475);
                this.BG_Landscape_F_2.x = -662 + Laya.stage.width * 1 - 0.5 * (-2475);
                this.BG_Landscape_F_3.x = -662 + Laya.stage.width * 2 - 0.5 * (-2475);

                this.BG_Grass_1.x = -662 + Laya.stage.width * 0 - 0.4 * (-2475);
                this.BG_Grass_2.x = -662 + Laya.stage.width * 1 - 0.4 * (-2475);
                this.BG_Grass_3.x = -662 + Laya.stage.width * 2 - 0.4 * (-2475);
                
                this.BG_Ground_1.x = -662 + Laya.stage.width * 0 - 0.2 * (-2475);
                this.BG_Ground_2.x = -662 + Laya.stage.width * 1 - 0.2 * (-2475);
                this.BG_Ground_3.x = -662 + Laya.stage.width * 2 - 0.2 * (-2475);

                this.BG_Front_1.x = -662 + Laya.stage.width * 0 - 0.05 * (-2475);
                this.BG_Front_2.x = -662 + Laya.stage.width * 1 - 0.05 * (-2475);
                this.BG_Front_3.x = -662 + Laya.stage.width * 2 - 0.05 * (-2475);
            }    
        }
        Laya.timer.frameLoop(1, this, camTimerFunc);
    }
    public setCameraShake(timer: number, multiplier: number) {
        this.m_cameraShakingMultiplyer = multiplier;
        this.m_cameraShakingTimer = timer;
    }

    public setBackground(map: string): void{
        this.BG_Sky_1 = new Laya.Sprite();
        this.BG_Sky_2 = new Laya.Sprite();
        this.BG_Sky_3 = new Laya.Sprite();
        this.BG_Landscape_B_1 = new Laya.Sprite();
        this.BG_Landscape_B_2 = new Laya.Sprite();
        this.BG_Landscape_B_3 = new Laya.Sprite();
        this.BG_Landscape_F_1 = new Laya.Sprite();
        this.BG_Landscape_F_2 = new Laya.Sprite();
        this.BG_Landscape_F_3 = new Laya.Sprite();
        this.BG_Grass_1 = new Laya.Sprite();
        this.BG_Grass_2 = new Laya.Sprite();
        this.BG_Grass_3 = new Laya.Sprite();
        this.BG_Ground_1 = new Laya.Sprite();
        this.BG_Ground_2 = new Laya.Sprite();
        this.BG_Ground_3 = new Laya.Sprite();
        this.BG_Front_1 = new Laya.Sprite();
        this.BG_Front_2 = new Laya.Sprite();
        this.BG_Front_3 = new Laya.Sprite();

        this.BG_Sky_1.size(1366, 768);
        this.BG_Sky_2.size(1366, 768);
        this.BG_Sky_3.size(1366, 768);
        this.BG_Landscape_B_1.size(1366, 768);
        this.BG_Landscape_B_2.size(1366, 768);
        this.BG_Landscape_B_3.size(1366, 768);
        this.BG_Landscape_F_1.size(1366, 768);
        this.BG_Landscape_F_2.size(1366, 768);
        this.BG_Landscape_F_3.size(1366, 768);
        this.BG_Grass_1.size(1366, 768);
        this.BG_Grass_2.size(1366, 768);
        this.BG_Grass_3.size(1366, 768);
        this.BG_Ground_1.size(1366, 768);
        this.BG_Ground_2.size(1366, 768);
        this.BG_Ground_3.size(1366, 768);
        this.BG_Front_1.size(1366, 768);
        this.BG_Front_2.size(1366, 768);
        this.BG_Front_3.size(1366, 768);
        
        switch (map) {
            case "RedForest":
                this.BG_Sky_1.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Sky_2.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Sky_3.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Landscape_B_1.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_B_2.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_B_3.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_F_1.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Landscape_F_2.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Landscape_F_3.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Grass_1.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Grass_2.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Grass_3.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Ground_1.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Ground_2.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Ground_3.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Front_1.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                this.BG_Front_2.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                this.BG_Front_3.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                break;
            case "Town":
                this.BG_Sky_1.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                this.BG_Sky_2.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                this.BG_Sky_3.loadImage("Background(0912)/Gray Town/0.gray town_bgrd.png");
                this.BG_Landscape_B_1.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                this.BG_Landscape_B_2.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                this.BG_Landscape_B_3.loadImage("Background(0912)/Gray Town/1.gray town_bgrd.png");
                this.BG_Landscape_F_1.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                this.BG_Landscape_F_2.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                this.BG_Landscape_F_3.loadImage("Background(0912)/Gray Town/2.gray town_bgrd.png");
                this.BG_Grass_1.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                this.BG_Grass_2.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                this.BG_Grass_3.loadImage("Background(0912)/Gray Town/3.gray town_bgrd.png");
                this.BG_Ground_1.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                this.BG_Ground_2.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                this.BG_Ground_3.loadImage("Background(0912)/Gray Town/4.gray town_ground.png");
                this.BG_Front_1.loadImage("");
                this.BG_Front_2.loadImage("");
                this.BG_Front_3.loadImage("");
                break;
            case "NewbieForest":
                this.BG_Sky_1.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Sky_2.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Sky_3.loadImage("Background(0912)/Red Forest/0.red forest_bgrd.png");
                this.BG_Landscape_B_1.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_B_2.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_B_3.loadImage("Background(0912)/Red Forest/1.red forest_bgrd_tree1.png");
                this.BG_Landscape_F_1.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Landscape_F_2.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Landscape_F_3.loadImage("Background(0912)/Red Forest/3.red forest_bgrd_tree3.png");
                this.BG_Grass_1.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Grass_2.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Grass_3.loadImage("Background(0912)/Red Forest/4.red forest_grass.png");
                this.BG_Ground_1.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Ground_2.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Ground_3.loadImage("Background(0912)/Red Forest/5.red forest_ground.png");
                this.BG_Front_1.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                this.BG_Front_2.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                this.BG_Front_3.loadImage("Background(0912)/Red Forest/6.red forest_black.png");
                break;
            default:
                break;
        }
        
        
        ZOrderManager.setZOrder(this.BG_Sky_1, 5);
        ZOrderManager.setZOrder(this.BG_Sky_2, 5);
        ZOrderManager.setZOrder(this.BG_Sky_3, 5);
        ZOrderManager.setZOrder(this.BG_Landscape_B_1, 6);
        ZOrderManager.setZOrder(this.BG_Landscape_B_2, 6);
        ZOrderManager.setZOrder(this.BG_Landscape_B_3, 6);
        ZOrderManager.setZOrder(this.BG_Landscape_F_1, 8);
        ZOrderManager.setZOrder(this.BG_Landscape_F_2, 8);
        ZOrderManager.setZOrder(this.BG_Landscape_F_3, 8);
        ZOrderManager.setZOrder(this.BG_Grass_1, 9);
        ZOrderManager.setZOrder(this.BG_Grass_2, 9);
        ZOrderManager.setZOrder(this.BG_Grass_3, 9);
        ZOrderManager.setZOrder(this.BG_Ground_1, 10);
        ZOrderManager.setZOrder(this.BG_Ground_2, 10);
        ZOrderManager.setZOrder(this.BG_Ground_3, 10);
        ZOrderManager.setZOrder(this.BG_Front_1, 25);
        ZOrderManager.setZOrder(this.BG_Front_2, 25);
        ZOrderManager.setZOrder(this.BG_Front_3, 25);

        Laya.stage.addChild(this.BG_Sky_1);
        Laya.stage.addChild(this.BG_Sky_2);
        Laya.stage.addChild(this.BG_Sky_3);
        Laya.stage.addChild(this.BG_Landscape_B_1);
        Laya.stage.addChild(this.BG_Landscape_B_2);
        Laya.stage.addChild(this.BG_Landscape_B_3);
        Laya.stage.addChild(this.BG_Landscape_F_1);
        Laya.stage.addChild(this.BG_Landscape_F_2);
        Laya.stage.addChild(this.BG_Landscape_F_3);
        Laya.stage.addChild(this.BG_Grass_1);
        Laya.stage.addChild(this.BG_Grass_2);
        Laya.stage.addChild(this.BG_Grass_3);
        Laya.stage.addChild(this.BG_Ground_1);
        Laya.stage.addChild(this.BG_Ground_2);
        Laya.stage.addChild(this.BG_Ground_3);
        Laya.stage.addChild(this.BG_Front_1);
        Laya.stage.addChild(this.BG_Front_2);
        Laya.stage.addChild(this.BG_Front_3);
    }
    public clearBackground(): void{

        console.log("清除背景圖層");
        

        Laya.stage.removeChild(this.BG_Sky_1);
        Laya.stage.removeChild(this.BG_Sky_2);
        Laya.stage.removeChild(this.BG_Sky_3);
        Laya.stage.removeChild(this.BG_Landscape_B_1);
        Laya.stage.removeChild(this.BG_Landscape_B_2);
        Laya.stage.removeChild(this.BG_Landscape_B_3);
        Laya.stage.removeChild(this.BG_Landscape_F_1);
        Laya.stage.removeChild(this.BG_Landscape_F_2);
        Laya.stage.removeChild(this.BG_Landscape_F_3);
        Laya.stage.removeChild(this.BG_Grass_1);
        Laya.stage.removeChild(this.BG_Grass_2);
        Laya.stage.removeChild(this.BG_Grass_3);
        Laya.stage.removeChild(this.BG_Ground_1);
        Laya.stage.removeChild(this.BG_Ground_2);
        Laya.stage.removeChild(this.BG_Ground_3);
        Laya.stage.removeChild(this.BG_Front_1);
        Laya.stage.removeChild(this.BG_Front_2);
        Laya.stage.removeChild(this.BG_Front_3);

        if(this.BG_Sky_1 != null){ this.BG_Sky_1.destroy(); this.BG_Sky_1.destroyed = true};
        if(this.BG_Sky_2 != null){ this.BG_Sky_2.destroy(); this.BG_Sky_2.destroyed = true};
        if(this.BG_Sky_3 != null){ this.BG_Sky_3.destroy(); this.BG_Sky_3.destroyed = true};
        if(this.BG_Landscape_B_1 != null){ this.BG_Landscape_B_1.destroy(); this.BG_Landscape_B_1.destroyed = true};
        if(this.BG_Landscape_B_2 != null){ this.BG_Landscape_B_2.destroy(); this.BG_Landscape_B_2.destroyed = true};
        if(this.BG_Landscape_B_3 != null){ this.BG_Landscape_B_3.destroy(); this.BG_Landscape_B_3.destroyed = true};
        if(this.BG_Landscape_F_1 != null){ this.BG_Landscape_F_1.destroy(); this.BG_Landscape_F_1.destroyed = true};
        if(this.BG_Landscape_F_2 != null){ this.BG_Landscape_F_2.destroy(); this.BG_Landscape_F_2.destroyed = true};
        if(this.BG_Landscape_F_3 != null){ this.BG_Landscape_F_3.destroy(); this.BG_Landscape_F_3.destroyed = true};
        if(this.BG_Grass_1 != null){ this.BG_Grass_1.destroy(); this.BG_Grass_1.destroyed = true};
        if(this.BG_Grass_2 != null){ this.BG_Grass_2.destroy(); this.BG_Grass_2.destroyed = true};
        if(this.BG_Grass_3 != null){ this.BG_Grass_3.destroy(); this.BG_Grass_3.destroyed = true};
        if(this.BG_Ground_1 != null){ this.BG_Ground_1.destroy(); this.BG_Ground_1.destroyed = true};
        if(this.BG_Ground_2 != null){ this.BG_Ground_2.destroy(); this.BG_Ground_2.destroyed = true};
        if(this.BG_Ground_3 != null){ this.BG_Ground_3.destroy(); this.BG_Ground_3.destroyed = true};
        if(this.BG_Front_1 != null){ this.BG_Front_1.destroy(); this.BG_Front_1.destroyed = true};
        if(this.BG_Front_2 != null){ this.BG_Front_2.destroy(); this.BG_Front_2.destroyed = true};
        if(this.BG_Front_3 != null){ this.BG_Front_3.destroy(); this.BG_Front_3.destroyed = true};

        this.BG_Sky_1 = null;
        this.BG_Sky_2 = null;
        this.BG_Sky_3 = null;
        this.BG_Landscape_B_1 = null;
        this.BG_Landscape_B_2 = null;
        this.BG_Landscape_B_3 = null;
        this.BG_Landscape_F_1 = null;
        this.BG_Landscape_F_2 = null;
        this.BG_Landscape_F_3 = null;
        this.BG_Grass_1 = null;
        this.BG_Grass_2 = null;
        this.BG_Grass_3 = null;
        this.BG_Ground_1 = null;
        this.BG_Ground_2 = null;
        this.BG_Ground_3 = null;
        this.BG_Front_1 = null;
        this.BG_Front_2 = null;
        this.BG_Front_3 = null;
    }

    private bloodSplitEffect(enemy: Laya.Animation) {
        // let bloodEffect: Laya.Animation = new Laya.Animation();
        let bloodEffect: Laya.Animation = Laya.Pool.getItemByClass("bloodEffect", Laya.Animation);
        bloodEffect.scaleX = 1.2;
        bloodEffect.scaleY = 1.2;
        bloodEffect.interval = 30;
        // bloodEffect.zOrder = 5;
        ZOrderManager.setZOrder(bloodEffect, 5);

        //待優化
        let colorMat: Array<number> =
            [
                2, 1, 1, 0, -100, //R
                0, 1, 0, 0, -100, //G
                0, 0, 1, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        bloodEffect.filters = [colorFilter];
        //
        
        bloodEffect.pos(enemy.x - 325, enemy.y - 310);
        bloodEffect.source = "comp/Hurt.atlas";
        bloodEffect.on(Laya.Event.COMPLETE, this, function () {
            // bloodEffect.destroy();
            // bloodEffect.destroyed = true;
            Laya.stage.removeChild(bloodEffect);
            Laya.Pool.recover("bloodEffect", bloodEffect);
        });
        Laya.stage.addChild(bloodEffect);
        ZOrderManager.setZOrder(bloodEffect, 60);
        bloodEffect.play();
}
    public updateAnimation(from: CharacterStatus, to: CharacterStatus, onCallBack: () => void = null, force: boolean = false, rate: number = 100): void {
        if (from === to || this.m_animationChanging) return;
        // if (!this.m_walkeffect.destroyed){
        //     this.m_walkeffect.destroy();
        //     this.m_walkeffect.destroyed = true;
        // }
        Laya.stage.removeChild(this.m_walkeffect);
        Laya.Pool.recover("walkeffect", this.m_walkeffect);
        this.m_state = to;
        // console.log('Player status from', from, 'convert to ', to);
        switch (this.m_state) {
            case CharacterStatus.attackOne:
                this.m_animationChanging = true;
                this.m_animation.source = 'character/Attack1.atlas';
                this.m_animation.play();
                this.createAttackEffect(this.m_animation);
                // this.m_walkeffect.destroy();
                break;
            case CharacterStatus.attackTwo:
                this.m_animationChanging = true;
                this.m_animation.source = 'character/Attack2.atlas';
                this.m_animation.play();
                this.createAttackEffect(this.m_animation);
                // this.m_walkeffect.destroy();
                break;
            case CharacterStatus.idle:
                this.m_animation.source = 'character/Idle.atlas';
                this.m_animation.play();
                // this.m_walkeffect.destroy();
                break;
            case CharacterStatus.run:
                this.m_animation.source = 'character/Run.atlas';
                this.m_animation.play();
                this.createWalkEffect(this.m_animation);
                break;
            case CharacterStatus.slam:
                this.m_animationChanging = true;
                this.m_animation.source = "character/Erosion.atlas";
                this.m_animation.play();
                // this.m_walkeffect.destroy();
                break;
            case CharacterStatus.sprint:
                this.m_animationChanging = true;
                this.m_animation.source = "character/Sprint.atlas";
                this.m_animation.play();
                // this.m_walkeffect.destroy();
                break;
            default:
                this.m_animation.source = 'character/Idle.atlas';
                this.m_animation.play();
                // this.m_walkeffect.destroy();
                break;
        }
        this.m_animation.interval = rate;
        if (typeof onCallBack === 'function')
            onCallBack();
    }
    public updateSprintCdTimer(): void{
        this.m_sprintCdCount = 3;
        if(this.m_sprintCdTimer){
            clearInterval(this.m_sprintCdTimer);
        }
        this.m_sprintCdTimer = setInterval(()=>{
            if(this.m_canSprint){
                clearInterval(this.m_sprintCdTimer);
                this.m_sprintCdTimer = null;
                this.m_sprintCdCount = 0;
                return;
            }
            this.m_sprintCdCount = !this.m_canSprint ? (this.m_sprintCdCount - 1):0;
        }, 1000);
        // Laya.stage.frameLoop(60, this, sprintTimer);
        
        // this.m_sprintCdTimer = setInterval(()=>{
        //     if(this.m_canSprint){
        //         clearInterval(this.m_sprintCdTimer);
        //         this.m_sprintCdTimer = null;
        //         this.m_sprintCdCount = 0;
        //         return;
        //     }
        //     this.m_sprintCdCount = !this.m_canSprint ? (this.m_sprintCdCount - 1):0;
        // }, 1000);
    }
    public getEnemyAttackDamage(tag: string): number {
        let enemyInit: EnemyInit = new EnemyInit();
        switch (tag) {
            case "EnemyNormalAttack":
                return enemyInit.NormalEnemyDmg;
            case "EnemyShieldAttack":
                return enemyInit.ShieldEnemyDmg;
            case "EnemyFastAttack":
                return enemyInit.FastEnemyDmg;
            case "EnemyNewbieAttack":
                return enemyInit.NewbieEnemyDmg;
            default:
                return 0;
        }
    }
    public getEnemyCriticalRate(tag: string): number {
        let enemyInit: EnemyInit = new EnemyInit();
        switch (tag) {
            case "EnemyNormalAttack":
                return enemyInit.NormalEnemyCritical;
            case "EnemyShieldAttack":
                return enemyInit.ShieldEnemyCritical;
            case "EnemyFastAttack":
                return enemyInit.FastEnemyCritical;
            case "EnemyNewbieAttack":
                return enemyInit.NewbieEnemyCritical;
            default:
                return 0;
        }
    }
    public getEnemyCriticalDmgRate(tag: string): number {
        let enemyInit: EnemyInit = new EnemyInit();
        switch (tag) {
            case "EnemyNormalAttack":
                return enemyInit.NormalEnemyCriticalDmgMultiplier;
            case "EnemyShieldAttack":
                return enemyInit.ShieldEnemyCriticalDmgMultiplier;
            case "EnemyFastAttack":
                return enemyInit.FastEnemyCriticalDmgMultiplier;
            case "EnemyNewbieAttack":
                return enemyInit.NewbieEnemyCriticalDmgMultiplier;
            default:
                return 0;
        }
    }
    public removeAllDebuff(): void{
        this.m_oathManager.removeAllDebuff();
    }
    public clearAddDebuffTimer(): void{
        this.m_oathManager.clearAddDebuffTimer();
    }

    public resetMobileBtnEvent(): void{
        if (Laya.Browser.onMobile) {
            //reset
            this.m_mobileLeftBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileLeftBtnClicked = true; this.m_mobileLeftBtn.alpha = 0.5;});
            this.m_mobileLeftBtn.off(Laya.Event.MOUSE_UP, this, this.mobileLeftBtnResetFunc);
            this.m_mobileLeftBtn.off(Laya.Event.MOUSE_OUT, this, this.mobileLeftBtnResetFunc);
            this.m_mobileRightBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileRightBtnClicked = true; this.m_mobileRightBtn.alpha = 0.5;})
            this.m_mobileRightBtn.off(Laya.Event.MOUSE_UP, this, this.mobileRightBtnResetFunc);
            this.m_mobileRightBtn.off(Laya.Event.MOUSE_OUT, this, this.mobileRightBtnResetFunc);
            this.m_mobileAtkBtn.off(Laya.Event.CLICK, this, this.mobileAtkBtnFunc);
            this.m_mobileAtkBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileAtkBtn.alpha = 0.5; });
            this.m_mobileAtkBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileAtkBtn.alpha = 1; });
            this.m_mobileAtkBtn.on(Laya.Event.MOUSE_OUT, this, () => { this.m_mobileAtkBtn.alpha = 1; });
            
            this.m_mobileSprintBtn.off(Laya.Event.MOUSE_DOWN, this, this.mobileSprintBtnFunc);
            this.m_mobileSprintBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileSprintBtnClicked = false;});
            this.m_mobileCatSkillBtn.off(Laya.Event.CLICK, this, this.mobileCatSkillBtnFunc);
            // this.m_mobileCatSkillBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileCatSkillBtn.alpha = 0.5;});
            // this.m_mobileCatSkillBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileCatSkillBtn.alpha = 1;});
            this.m_mobileHumanSkillBtn.off(Laya.Event.CLICK, this, this.mobileHumanSkillBtnFunc);
            // this.m_mobileHumanSkillBtn.off(Laya.Event.MOUSE_DOWN, this, () => { this.m_mobileHumanSkillBtn.alpha = 0.5;});
            // this.m_mobileHumanSkillBtn.off(Laya.Event.MOUSE_UP, this, () => { this.m_mobileHumanSkillBtn.alpha = 1;});
            this.m_mobileUIToggle = false;
        }
    }

    public updateMobileSkillBtnUI(): void{
        console.log("更新手機板技能UI");
        console.log("角色的：",this.m_humanSkill.m_id,"currentData的：",ExtraData.currentData['humanSkill']);
        console.log("角色的：",this.m_catSkill.m_id,"currentData的：",ExtraData.currentData['catSkill']);
        if (ExtraData.currentData['humanSkill'] === 0) {
            this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileEmpty.png');
        } else if (ExtraData.currentData['humanSkill'] === 1) {
            this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileSpike.png');
        } else if (ExtraData.currentData['humanSkill'] === 2) {
            this.m_mobileHumanSkillBtn.loadImage('UI/mobile/mobileBehead.png');
        }
        if (ExtraData.currentData['catSkill'] === 0) {
            this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileEmpty.png');
        } else if (ExtraData.currentData['catSkill'] === 1) {
            this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileSlam.png');
        } else if (ExtraData.currentData['catSkill'] === 2) {
            this.m_mobileCatSkillBtn.loadImage('UI/mobile/mobileBlackhole.png');
        }
    }

    public showMobileUI(player: Laya.Animation): void{
        this.m_mobileUIToggle = true;
        // let leftBtnPos: object = { "x": player.x - Laya.stage.width / 2 + 155, "y": 620 };
        // let rightBtnPos: object;
        let stageHitArea = new Laya.HitArea();
        stageHitArea.hit.drawRect(0,0,4098,768, '#fff');
        Laya.stage.hitArea = stageHitArea;

        // this.m_mobileLeftBtn = new Laya.Sprite();
        // this.m_mobileRightBtn = new Laya.Sprite();
        // this.m_mobileAtkBtn = new Laya.Sprite();
        // this.m_mobileSprintBtn = new Laya.Sprite();
        // this.m_mobileHumanSkillBtn = new Laya.Sprite();
        // this.m_mobileCatSkillBtn = new Laya.Sprite();

        this.m_mobileLeftBtn = Laya.Pool.getItemByClass("mobileLeftBtn", Laya.Sprite);
        this.m_mobileRightBtn = Laya.Pool.getItemByClass("mobileRightBtn", Laya.Sprite);
        this.m_mobileAtkBtn = Laya.Pool.getItemByClass("mobileAtkBtn", Laya.Sprite);
        this.m_mobileSprintBtn = Laya.Pool.getItemByClass("mobileSprintBtn", Laya.Sprite);
        this.m_mobileHumanSkillBtn = Laya.Pool.getItemByClass("mobileHumanSkillBtn", Laya.Sprite);
        this.m_mobileCatSkillBtn = Laya.Pool.getItemByClass("mobileCatSkillBtn", Laya.Sprite);
        this.m_mobileSprintCd = Laya.Pool.getItemByClass("mobileSprintCd", Laya.Text);
        this.m_mobileCatSkillCd = Laya.Pool.getItemByClass("mobileCatSkillCd", Laya.Text);
        this.m_mobileHumanSkillCd = Laya.Pool.getItemByClass("mobileHumanSkillCd", Laya.Text);

        this.m_mobileLeftBtn.size(150, 119);
        this.m_mobileRightBtn.size(150, 119);
        this.m_mobileAtkBtn.size(135, 135);
        this.m_mobileSprintBtn.size(110, 110);
        this.m_mobileHumanSkillBtn.size(110, 110);
        this.m_mobileCatSkillBtn.size(110, 110);
        this.m_mobileLeftBtn.loadImage('UI/mobile/mobileLeftBtn.png');
        this.m_mobileRightBtn.loadImage('UI/mobile/mobileRightBtn.png');
        this.m_mobileAtkBtn.loadImage('UI/mobile/mobileAtkBtn.png');
        this.m_mobileSprintBtn.loadImage('UI/mobile/mobileSprintBtn.png');

        this.updateMobileSkillBtnUI();

        this.m_mobileSprintCd.fontSize = this.m_mobileCatSkillCd.fontSize = this.m_mobileHumanSkillCd.fontSize = 100;
        this.m_mobileSprintCd.font = this.m_mobileCatSkillCd.font = this.m_mobileHumanSkillCd.font = "silver";
        this.m_mobileSprintCd.stroke = this.m_mobileCatSkillCd.stroke = this.m_mobileHumanSkillCd.stroke = 2;
        this.m_mobileSprintCd.strokeColor = this.m_mobileCatSkillCd.strokeColor = this.m_mobileHumanSkillCd.strokeColor = '#000';
        this.m_mobileSprintCd.color = this.m_mobileCatSkillCd.color = this.m_mobileHumanSkillCd.color = '#fff';

        this.m_mobileLeftBtn.autoSize = true;
        this.m_mobileRightBtn.autoSize = true;
        this.m_mobileAtkBtn.autoSize = true;
        this.m_mobileSprintBtn.autoSize = true;
        this.m_mobileHumanSkillBtn.autoSize = true;
        this.m_mobileCatSkillBtn.autoSize = true;

        Laya.stage.addChild(this.m_mobileLeftBtn);
        Laya.stage.addChild(this.m_mobileRightBtn);
        Laya.stage.addChild(this.m_mobileAtkBtn);
        Laya.stage.addChild(this.m_mobileSprintBtn);
        Laya.stage.addChild(this.m_mobileCatSkillBtn);
        Laya.stage.addChild(this.m_mobileHumanSkillBtn);
        Laya.stage.addChild(this.m_mobileSprintCd);
        Laya.stage.addChild(this.m_mobileCatSkillCd);
        Laya.stage.addChild(this.m_mobileHumanSkillCd);

        ZOrderManager.setZOrder(this.m_mobileLeftBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileRightBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileAtkBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileSprintBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileCatSkillBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileHumanSkillBtn, 100);
        ZOrderManager.setZOrder(this.m_mobileSprintCd, 103);
        ZOrderManager.setZOrder(this.m_mobileCatSkillCd, 103);
        ZOrderManager.setZOrder(this.m_mobileHumanSkillCd, 103);

        this.mobileLeftBtnResetFunc = function () {
            this.m_mobileLeftBtnClicked = false;
            this.m_mobileLeftBtn.alpha = 1;
            if (this.m_canJump) {
                this.m_playerVelocity["Vx"] = 0;
            }
            this.applyMoveX();
        }
        this.mobileRightBtnResetFunc = function () {
            this.m_mobileRightBtnClicked = false;
            this.m_mobileRightBtn.alpha = 1;
            if (this.m_canJump) {
                this.m_playerVelocity["Vx"] = 0;
            }
            this.applyMoveX();
        }

        //左走
        this.m_mobileLeftBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.m_mobileLeftBtnClicked = true;
            this.m_mobileLeftBtn.alpha = 0.5;
        });
        this.m_mobileLeftBtn.on(Laya.Event.MOUSE_UP, this, this.mobileLeftBtnResetFunc);
        this.m_mobileLeftBtn.on(Laya.Event.MOUSE_OUT, this, this.mobileLeftBtnResetFunc);
        //右走
        this.m_mobileRightBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.m_mobileRightBtnClicked = true;
            this.m_mobileRightBtn.alpha = 0.5;
        })
        this.m_mobileRightBtn.on(Laya.Event.MOUSE_UP, this, this.mobileRightBtnResetFunc);
        this.m_mobileRightBtn.on(Laya.Event.MOUSE_OUT, this, this.mobileRightBtnResetFunc);
        //移動更新
        let mobileMoveFunc = function () {
            if (this.m_mobileLeftBtnClicked) {
                this.m_playerVelocity["Vx"] += -1 * this.m_velocityMultiplier;
                if (this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.m_animation.skewY = 180;
                    this.m_isFacingRight = false;
                }
                this.applyMoveX();
                if (!this.m_animationChanging) this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
            }
            if (this.m_mobileRightBtnClicked) {
                this.m_playerVelocity["Vx"] += 1 * this.m_velocityMultiplier;
                if (!this.m_isFacingRight) {
                    this.m_playerVelocity["Vx"] = 0;
                    this.m_animation.skewY = 0;
                    this.m_isFacingRight = true;
                }
                this.applyMoveX();
                if (!this.m_animationChanging) this.updateAnimation(this.m_state, CharacterStatus.run, null, false, 100);
            }
        }

        //攻擊
        this.mobileAtkBtnFunc = function () {
            if (!this.m_canAttack) return;
            if (this.m_atkTimer) clearInterval(this.m_atkTimer);
            this.attackStepEventCheck();

            if (!this.m_animationChanging) {
                if (this.m_atkStep === 1) {
                    // ,1,2,3,4, 逗號數為分母(圖數+1)
                    this.updateAnimation(this.m_state, CharacterStatus.attackTwo, null, false, this.m_attackCdTime / 3);
                }
                else if (this.m_atkStep === 0) {
                    this.updateAnimation(this.m_state, CharacterStatus.attackOne, null, false, this.m_attackCdTime / 8);
                }
            }
            this.m_atkStep = this.m_atkStep === 1 ? 0 : 1;
            this.attackSimulation(this.m_atkStep);//另類攻擊判定

            this.m_canAttack = false;

            setTimeout(() => {
                this.m_canAttack = true;
            }, this.m_attackCdTime);
        }

        this.m_mobileAtkBtn.on(Laya.Event.CLICK, this, this.mobileAtkBtnFunc);
        this.m_mobileAtkBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.m_mobileAtkBtn.alpha = 0.5;
        });
        this.m_mobileAtkBtn.on(Laya.Event.MOUSE_UP, this, () => {
            this.m_mobileAtkBtn.alpha = 1;
        });
        this.m_mobileAtkBtn.on(Laya.Event.MOUSE_OUT, this, () => {
            this.m_mobileAtkBtn.alpha = 1;
        });

        //衝刺
        this.mobileSprintBtnFunc = function () {
            this.m_mobileSprintBtnClicked = true;
            // this.m_mobileSprintBtn.alpha = 0.5;
            if (!this.m_canSprint || EnemyInit.isWin) return;

            this.delayMove(0.08);
            this.hurtedEvent(1.5);
            this.updateAnimation(this.m_state, CharacterStatus.sprint, null, false, 100);

            this.m_rigidbody.linearVelocity = { x: this.m_isFacingRight ? 100.0 : -100.0, y: 0.0 };
            this.m_rigidbody.mask = 2 | 16;
            this.m_collider.refresh();

            let sprintDone = () =>{
                this.m_rigidbody.mask = 2 | 8 | 16;
                this.m_collider.density = 300;
                this.m_collider.refresh();

                this.m_collider.density = 1;
                this.m_collider.refresh();
            };
            this.updateSprintCdTimer();
            Laya.stage.frameOnce(30, this, sprintDone);
            // Laya.stage.frameOnce(180, this, () => { this.m_canSprint = true; });
            setTimeout(()=>{ this.m_canSprint = true; }, 3000);
            this.m_canSprint = false;
            Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 10, Laya.Ease.linearInOut,
                Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 150, Laya.Ease.linearInOut,
                        Laya.Handler.create(this, () => { this.m_animation.alpha = 1;
                         }), 0);
                }), 0);
            this.setSound(0.6, "Audio/Misc/dash.wav", 1);
        }

        this.m_mobileSprintBtn.on(Laya.Event.MOUSE_DOWN, this, this.mobileSprintBtnFunc);
        this.m_mobileSprintBtn.on(Laya.Event.MOUSE_UP, this, () => {
            this.m_mobileSprintBtnClicked = false;
            // this.m_mobileSprintBtn.alpha = 1;
        });
        //貓技
        this.mobileCatSkillBtnFunc = function () {
            if (EnemyInit.isWin) return;
            this.m_catSkill.cast(CharacterInit.playerEnt,
                {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
        }

        this.m_mobileCatSkillBtn.on(Laya.Event.CLICK, this, this.mobileCatSkillBtnFunc);
        // this.m_mobileCatSkillBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
        //     this.m_mobileCatSkillBtn.alpha = 0.5;
        // });
        // this.m_mobileCatSkillBtn.on(Laya.Event.MOUSE_UP, this, () => {
        //     this.m_mobileCatSkillBtn.alpha = 1;
        // });
        
        //人技
        this.mobileHumanSkillBtnFunc = function () {
            if (EnemyInit.isWin) return;
            this.m_humanSkill.cast(CharacterInit.playerEnt,
                {
                    x: this.m_animation.x,
                    y: this.m_animation.y,
                }, this.m_oathManager.oathCastSkillCheck(this.m_humanSkill.m_cost));
        }

        this.m_mobileHumanSkillBtn.on(Laya.Event.CLICK, this, this.mobileHumanSkillBtnFunc);
        // this.m_mobileHumanSkillBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
        //     this.m_mobileHumanSkillBtn.alpha = 0.5;
        // });
        // this.m_mobileHumanSkillBtn.on(Laya.Event.MOUSE_UP, this, () => {
        //     this.m_mobileHumanSkillBtn.alpha = 1;
        // });
        //以幀為主體的更新
        let mobileUIFunc = () => {
            if (!this.m_mobileUIToggle) {
                
                Laya.stage.removeChild(this.m_mobileLeftBtn);
                Laya.stage.removeChild(this.m_mobileRightBtn);
                Laya.stage.removeChild(this.m_mobileAtkBtn);
                Laya.stage.removeChild(this.m_mobileSprintBtn);
                Laya.stage.removeChild(this.m_mobileHumanSkillBtn);
                Laya.stage.removeChild(this.m_mobileCatSkillBtn);
                Laya.stage.removeChild(this.m_mobileSprintCd);
                Laya.stage.removeChild(this.m_mobileCatSkillCd);
                Laya.stage.removeChild(this.m_mobileHumanSkillCd);

                Laya.Pool.recover("mobileLeftBtn",this.m_mobileLeftBtn);
                Laya.Pool.recover("mobileRightBtn",this.m_mobileRightBtn);
                Laya.Pool.recover("mobileAtkBtn",this.m_mobileAtkBtn);
                Laya.Pool.recover("mobileSprintBtn",this.m_mobileSprintBtn);
                Laya.Pool.recover("mobileHumanSkillBtn",this.m_mobileHumanSkillBtn);
                Laya.Pool.recover("mobileCatSkillBtn", this.m_mobileCatSkillBtn);
                Laya.Pool.recover("mobileSprintCd", this.m_mobileSprintCd);
                Laya.Pool.recover("mobileCatSkillCd", this.m_mobileCatSkillCd);
                Laya.Pool.recover("mobileHumanSkillCd",this.m_mobileHumanSkillCd);

                Laya.timer.clear(this, mobileUIFunc);
                Laya.timer.clear(this, mobileMoveFunc);
                return;
            }

            this.m_mobileSprintBtn.alpha = CharacterInit.playerEnt.m_canSprint ? 1 : 0.5;
            this.m_mobileHumanSkillBtn.alpha = CharacterInit.playerEnt.m_humanSkill.m_canUse ? 1 : 0.5;
            this.m_mobileCatSkillBtn.alpha = CharacterInit.playerEnt.m_catSkill.m_canUse ? 1 : 0.5;
            
            this.m_mobileSprintCd.text = CharacterInit.playerEnt.m_canSprint ? "":String(CharacterInit.playerEnt.m_sprintCdCount);
            this.m_mobileCatSkillCd.text = CharacterInit.playerEnt.m_catSkill.m_canUse ? "":String(CharacterInit.playerEnt.m_catSkill.m_cdCount);
            this.m_mobileHumanSkillCd.text = CharacterInit.playerEnt.m_humanSkill.m_canUse ? "":String(CharacterInit.playerEnt.m_humanSkill.m_cdCount);

            if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                this.m_mobileLeftBtn.pos(player.x - Laya.stage.width / 2 + 50, 620);
                this.m_mobileRightBtn.pos(player.x - Laya.stage.width / 2 + 50 + 165, 620);
                this.m_mobileAtkBtn.pos(player.x + Laya.stage.width / 2 - 200, 620);
                this.m_mobileSprintBtn.pos(player.x + Laya.stage.width / 2 - 350, 630);
                this.m_mobileCatSkillBtn.pos(player.x + Laya.stage.width / 2 - 290, 530);
                this.m_mobileHumanSkillBtn.pos(player.x + Laya.stage.width / 2 - 200, 460);
                this.m_mobileSprintCd.pos(player.x + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                this.m_mobileCatSkillCd.pos(player.x + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                this.m_mobileHumanSkillCd.pos(player.x + Laya.stage.width / 2 - 200 + 40, 460 + 20);
            }
            if (Laya.stage.x >= -250) {
                this.m_mobileLeftBtn.pos(935 - Laya.stage.width / 2 + 50, 620);
                this.m_mobileRightBtn.pos(935 - Laya.stage.width / 2 + 50 + 165, 620);
                this.m_mobileAtkBtn.pos(935 + Laya.stage.width / 2 - 200, 620);
                this.m_mobileSprintBtn.pos(935 + Laya.stage.width / 2 - 350, 630);
                this.m_mobileCatSkillBtn.pos(935 + Laya.stage.width / 2 - 290, 530);
                this.m_mobileHumanSkillBtn.pos(935 + Laya.stage.width / 2 - 200, 460);
                this.m_mobileSprintCd.pos(935 + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                this.m_mobileCatSkillCd.pos(935 + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                this.m_mobileHumanSkillCd.pos(935 + Laya.stage.width / 2 - 200 + 40, 460 + 20);
            }
            if (Laya.stage.x <= -2475) {
                this.m_mobileLeftBtn.pos(3155 - Laya.stage.width / 2 + 50, 620);
                this.m_mobileRightBtn.pos(3155 - Laya.stage.width / 2 + 50 + 165, 620);
                this.m_mobileAtkBtn.pos(3155 + Laya.stage.width / 2 - 200, 620);
                this.m_mobileSprintBtn.pos(3155 + Laya.stage.width / 2 - 350, 630);
                this.m_mobileCatSkillBtn.pos(3155 + Laya.stage.width / 2 - 290, 530);
                this.m_mobileHumanSkillBtn.pos(3155 + Laya.stage.width / 2 - 200, 460);
                this.m_mobileSprintCd.pos(3155 + Laya.stage.width / 2 - 350 + 40, 630 + 20);
                this.m_mobileCatSkillCd.pos(3155 + Laya.stage.width / 2 - 290 + 40, 530 + 20);
                this.m_mobileHumanSkillCd.pos(3155 + Laya.stage.width / 2 - 200 + 40, 460 + 20);
            }
        }
        Laya.timer.frameLoop(1, this, mobileUIFunc);
        Laya.timer.frameLoop(1, this, mobileMoveFunc);
        
    }
}

export default class CharacterInit extends Laya.Script {
    health: number;
    /** @prop {name:basicHealth,tips:"角色初始血量",type:int,default:1000}*/
    basicHealth: number = 1000;
    /** @prop {name:critical,tips:"角色爆擊率",type:int,default:25}*/
    critical: number = 25;
    /** @prop {name:criticalDmgMultiplier,tips:"角色爆擊傷害",type:Number,default:5}*/
    criticalDmgMultiplier: number = 5;
    /** @prop {name:damageMultiplier,tips:"調整傷害倍率",type:Number,default:1}*/
    damageMultiplier: number = 1;
    /** @prop {name:buff_damageMultiplier,tips:"誓約充能時，調整傷害倍率",type:Number,default:1.5}*/
    buff_damageMultiplier: number = 1.5;


    /** @prop {name:bloodyPoint,tips:"角色初始獻祭值",type:int,default:0}*/
    bloodyPoint: number = 0;
    /** @prop {name:maxBloodyPoint_soft,tips:"角色充能獻祭值上限",type:int,default:100}*/
    maxBloodyPoint_soft: number = 100;
    /** @prop {name:maxBloodyPoint_hard,tips:"角色過度充能獻祭值上限",type:int,default:150}*/
    maxBloodyPoint_hard: number = 150;
    /** @prop {name:xMaxVelocity,tips:"x軸速度上限",type:int,default:5}*/
    xMaxVelocity: number = 5;
    /** @prop {name:buff_xMaxVelocity,tips:"誓約充能時，x軸速度上限",type:int,default:5.75}*/
    buff_xMaxVelocity: number = 5.75;
    /** @prop {name:yMaxVelocity,tips:"y軸速度上限",type:int,default:5}*/
    yMaxVelocity: number = 5;
    /** @prop {name:velocityMultiplier,tips:"改變角色速度增加幅度",type:int,default:5}*/
    velocityMultiplier: number = 5;
    /** prop {name:buff_velocityMultiplier,tips:"誓約充能時，角色速度增加幅度",type:int,default:5.75}*/
    // buff_velocityMultiplier: number = 5.75;
    /** @prop {name:attackRange,tips:"調整攻擊範圍",type:int,default:100}*/
    attackRange: number = 100;
    /** @prop {name:attackCdTime,tips:"調整攻擊速度，越低越快",type:int,default:500}*/
    attackCdTime: number = 500;
    /** @prop {name:buff_attackCdTime,tips:"誓約充能時，角色攻擊速度，越低越快",type:int,default:425}*/
    buff_attackCdTime: number = 425;

    /** @prop {name:spikeDmgMultiplier,tips:"調整突進斬傷害倍率",type:Number,default:1}*/
    spikeDmgMultiplier: number = 1;
    /** @prop {name:beheadDmgMultiplier,tips:"調整攻其不備傷害倍率",type:Number,default:1}*/
    beheadDmgMultiplier: number = 1;
    /** @prop {name:slamDmgMultiplier,tips:"調整猛擊傷害倍率",type:Number,default:1}*/
    slamDmgMultiplier: number = 1;
    /** @prop {name:blackHoleDmgMultiplier,tips:"調整深淵侵蝕最終傷害倍率",type:Number,default:1}*/
    blackHoleDmgMultiplier: number = 1;
    /** @prop {name:blackHoleDotDmgMultiplier,tips:"調整深淵侵蝕持續傷害倍率",type:Number,default:1}*/
    blackHoleDotDmgMultiplier: number = 1;
    /** @prop {name:bigExplosionDmgMultiplier,tips:"調整魔法大爆射傷害倍率",type:Number,default:1}*/
    bigExplosionDmgMultiplier: number = 1;





    public static playerEnt: Character;
    public static generated: boolean = false;
    player: Character;
    constructor() {
        super();
    }
    onAwake() {
        if (this.player != undefined || CharacterInit.generated) return;
        CharacterInit.generated = true
        this.player = new Character();
        this.initSetting(this.player);
        this.player.spawn();
        CharacterInit.playerEnt = this.player;
        Laya.stage.addChild(CharacterInit.playerEnt.m_animation);
        ZOrderManager.setZOrder(CharacterInit.playerEnt.m_animation, 20);
        this.player.m_oathManager.showBloodyPoint(CharacterInit.playerEnt.m_animation);
        this.player.m_oathManager.showBloodyLogo(CharacterInit.playerEnt.m_animation);//角色UI狀態方法

    }
    private initSetting(player: Character): void {

        //生命值強化公式
        ExtraData.loadData();
        let data = JSON.parse(Laya.LocalStorage.getItem("gameData"));
        this.health = this.basicHealth + data.hpLevel * 100;
        player.m_health = player.m_maxHealth = this.health;

        player.m_critical = this.critical;
        player.m_criticalDmgMultiplier = this.criticalDmgMultiplier;

        player.m_bloodyPoint = this.bloodyPoint;
        player.m_maxBloodyPoint_soft = this.maxBloodyPoint_soft;
        player.m_maxBloodyPoint_hard = this.maxBloodyPoint_hard;
        player.m_basic_xMaxVelocity = this.xMaxVelocity;
        player.m_buff_xMaxVelocity = this.buff_xMaxVelocity;
        player.m_yMaxVelocity = this.yMaxVelocity;
        player.m_velocityMultiplier = this.velocityMultiplier;
        // player.m_buff_velocityMultiplier = this.buff_velocityMultiplier;
        player.m_attackRange = this.attackRange;
        player.m_basic_attackCdTime = this.attackCdTime;
        player.m_buff_attackCdTime = this.buff_attackCdTime;

        player.m_basic_damageMultiPlier = this.damageMultiplier;
        player.m_buff_damageMultiPlier = this.buff_damageMultiplier;
        
        //技能傷害倍率
        player.m_spikeDmgMultiplier = this.spikeDmgMultiplier;
        player.m_beheadDmgMultiplier = this.beheadDmgMultiplier;
        player.m_slamDmgMultiplier = this.slamDmgMultiplier;
        player.m_blackHoleDmgMultiplier = this.blackHoleDmgMultiplier;
        player.m_blackHoleDotDmgMultiplier = this.blackHoleDotDmgMultiplier;
        player.m_bigExplosionDmgMultiplier = this.bigExplosionDmgMultiplier;

        player.m_maxBloodyPoint = player.m_maxBloodyPoint_soft;
        player.m_bloodyPoint = 0;
        player.m_oathManager = new OathManager();
        player.m_oathManager.initOathSystem();
        player.showHealth();
        player.m_catSkill = player.getSkillTypeByExtraData('c', 0);
        player.m_humanSkill = player.getSkillTypeByExtraData('h', 0);

        player.setBackground(SceneInit.currentMap);
    }
    //9/13新增
    onUpdate() {
        if (CharacterInit.playerEnt.m_animation.destroyed)
            return;

        let colorNum: number = 2;
        let oathColorMat: Array<number> =
            [
                Math.floor(Math.random() * 2) + 2, 0, 0, 0, -100, //R
                1, Math.floor(Math.random() * 2) + 1, 0, 0, -100, //G
                1, 0, Math.floor(Math.random() * 2) + 2, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(oathColorMat);
        let glowFilter_charge: Laya.GlowFilter = new Laya.GlowFilter("#df6ef4", 10, 0, 0);
        CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [colorFilter, glowFilter_charge] : [];
        CharacterInit.playerEnt.m_oathManager.characterLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [colorFilter, glowFilter_charge] : [];

        //更新誓約所影響的數值變化
        CharacterInit.playerEnt.m_oathManager.oathUpdate();
    }
}