import OathManager from "./OathManager";

import { VirtualSkill } from "./SkillManager";
import * as hSkill from "./SkillHuman";
import * as cSkill from "./SkillCat";

import EnemyHandler, { Normal, Shield } from "./EnemyHandler";
import { CharacterStatus } from "./CharacterStatus";

  
export class Character extends Laya.Script {
    m_state: number;
    m_name: string;

    //當前使用數值
    m_health: number;
    m_maxHealth: number;
    m_bloodyPoint: number;
    m_maxBloodyPoint_soft: number;
    m_maxBloodyPoint_hard: number;
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

    //誓約強化數值
    // m_buff_velocityMultiplier: number;
    m_buff_xMaxVelocity: number;
    m_buff_attackCdTime: number;

    m_playerVelocity: object;

    m_isFacingRight: boolean = true;
    m_canJump: boolean = true;
    m_canAttack: boolean = true;
    m_animationChanging: boolean;

    m_atkTimer = null;
    m_atkStep: number = 0;

    m_hurted: boolean = false;
    m_hurtTimer = null;

    m_slashTimer = null;

    public static m_cameraShakingTimer: number = 0;
    public static m_cameraShakingMultiplyer: number = 1;

    m_keyDownList: Array<boolean>;

    private m_catSkill: VirtualSkill = null;
    private m_humanSkill: VirtualSkill = null;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_collider: Laya.BoxCollider;
    m_script: Laya.Script;
    m_healthBar: Laya.ProgressBar;

    spawn() {
        this.m_state = CharacterStatus.idle;

        this.m_animation = new Laya.Animation();
        this.m_animation.scaleX = 1;
        this.m_animation.scaleY = 1;

        this.m_animation.name = "Player";

        this.m_animation.width = 200;
        this.m_animation.height = 128;
        this.m_animation.pivotX = this.m_animation.width / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;

        // this.m_bloodyPoint;
        // this.m_maxBloodyPoint;

        this.m_animation.pos(1345, 544);
        this.m_animation.autoPlay = true;
        this.m_animation.source = 'character/Idle.atlas';
        this.m_animation.interval = 200;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, () => {
            if(this.m_state === CharacterStatus.attackOne || this.m_state === CharacterStatus.attackTwo)
                this.m_animation.stop();

            if(this.m_state === CharacterStatus.slam)
                console.log('Slam end!');
                

            this.m_animationChanging = false;
            if(Math.abs(this.m_playerVelocity["Vx"]) <= 0 && !this.m_atkTimer)
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
            this.characterMove();
        }
        this.m_script.onTriggerEnter = (col: Laya.BoxCollider | Laya.CircleCollider | Laya.ChainCollider) => {
            if (col.label === "ground") {
                this.resetMove();
                this.m_canJump = true;
            }
            if (col.tag === "Enemy" && !this.m_hurtTimer) {
                this.delayMove(0.15);
                this.m_rigidbody.linearVelocity = {x:this.m_isFacingRight?-5.0:5.0, y:0.0};
                this.takeDamage(50.0);
            }
            this.takeDamage(this.getEnemyAttackDamage(col.tag))
        }
        this.m_script.onKeyUp = (e: Laya.Event) => {
            if (this.m_canJump) {
                this.m_playerVelocity["Vx"] = 0;
                this.applyMoveX();
            }
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
        this.m_collider.friction = 0;

        this.m_rigidbody.allowRotation = false;
        this.m_rigidbody.gravityScale = 3;
        this.m_rigidbody.category = 4;
        this.m_rigidbody.mask = 8 | 2 | 16;

        Laya.stage.addChild(this.m_animation);

        OathManager.showBloodyPoint(this.m_animation);

        OathManager.showBloodyLogo(this.m_animation);//角色UI狀態方法

        this.cameraFollower();
        this.showHealth();
        this.setSkill();
    };
    setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            // this.setSound(0.05, "Audio/EnemyDie/death1.wav", 1)//loop:0為循環播放;
            // this.bloodSplitEffect(this.m_animation);
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
            // setTimeout(()=>{
            //   Laya.Scene.open("Village.scene");
            // }, 1000)
        }
    }
    getHealth(): number {
        return this.m_health;
    };
    takeDamage(amount: number) {
        if(amount <= 0 || this.m_animation.destroyed || !this.m_animation || this.m_hurted) return;
        
        let fakeNum = Math.random() * 100;
        let critical: boolean = (fakeNum <= 33);

        amount *= critical ? 3 : 1;
        this.setHealth(this.getHealth() - amount);
        this.damageTextEffect(amount, critical);

        Laya.Tween.to(this.m_animation, { alpha: 0.65}, 250, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(this.m_animation, { alpha: 0.35 }, 250, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { this.m_animation.alpha = 1; }), 0);
            }), 0);
        
        this.huredEvent(0.5);
        // this.resetMove();
    }
    private huredEvent(time: number){
        this.m_hurted = true;
                
        this.m_hurtTimer = setTimeout(()=>{
            this.m_hurted = false;
            this.m_hurtTimer = null;             
        }, 1000*time);
    }
    private damageTextEffect(amount: number, critical: boolean): void {
        let damageText = new Laya.Text();
        let soundNum: number;

        damageText.pos((this.m_animation.x - this.m_animation.width / 2) + 15, (this.m_animation.y - this.m_animation.height) - 3);
        damageText.bold = true;
        damageText.align = "left";
        damageText.alpha = 1;

        damageText.fontSize = critical ? 40 : 20;
        damageText.color = critical ? '#ff31c8' : "red";

        let temp_text = "";
        for(let i = 0; i < String(amount).length; i++){
            temp_text += String(amount)[i];
            temp_text += " ";
        }

        damageText.text = temp_text;
        damageText.font = "silver";
        // soundNum = critical ? 0 : 1;
        // this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
        Laya.stage.addChild(damageText);

        Laya.Tween.to(damageText, { alpha: 0.55, fontSize: damageText.fontSize + 50, }, 450, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 450, Laya.Ease.linearInOut,
                Laya.Handler.create(this, ()=>{ damageText.destroy() }), 0);
            }), 0);
    }
    private listenKeyBoard(): void {
        this.m_keyDownList = [];
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }
    private showHealth() {
        this.m_healthBar = new Laya.ProgressBar();
        // this.m_healthBar.height = 13;
        // this.m_healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
        this.m_healthBar.skin = "UI/hp.png";
        // this.m_healthBar.value = 1;
        // this.m_healthBar.alpha = 1;
        Laya.stage.addChild(this.m_healthBar);

        setInterval((() => {
            if (this.m_animation.destroyed) {
                this.m_healthBar.destroy();
                this.m_healthBar.destroyed = true;
                return;
            }
            this.m_healthBar.pos(this.m_animation.x - Laya.stage.width / 2 + 155, 77.5);
            this.m_healthBar.value = this.m_health / this.m_maxHealth;
        }), 10);
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
        //Up
        if (this.m_keyDownList[38]) {
            if (this.m_canJump) {
                this.m_playerVelocity["Vy"] += -12;
                this.applyMoveY();
                this.m_canJump = false;
            }
        }
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
        if (this.m_keyDownList[40]) {
            //Down
            console.log('技能槽: ', '貓技: ', this.m_catSkill, '人技: ', this.m_humanSkill);
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
        if (this.m_keyDownList[17]) {
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
            if(this.m_atkTimer) clearInterval(this.m_atkTimer);
            this.createAttackEffect(this.m_animation);
            this.attackStepEventCheck();

            if (!this.m_animationChanging){
                if(this.m_atkStep === 1){
                    // ,1,2,3,4, 逗號數為分母(圖數+1)
                    this.updateAnimation(this.m_state, CharacterStatus.attackTwo, null, false, this.m_attackCdTime / 3);
                    // console.log('ATTACK2');
                }
                else if(this.m_atkStep === 0){
                    this.updateAnimation(this.m_state, CharacterStatus.attackOne, null, false, this.m_attackCdTime / 8);
                    // console.log('ATTACK1');
                }
            }
            this.m_atkStep = this.m_atkStep === 1 ? 0 : 1;
            this.attackSimulation();//另類攻擊判定



            this.m_canAttack = false;

            // this.m_animation.on(Laya.Event.COMPLETE, this, function () {
            //   this.m_animation.interval = 200;
            //   this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
            // });
            setTimeout(() => {
                this.m_canAttack = true;
            }, this.m_attackCdTime);
        }
        if (this.m_keyDownList[16]) console.log(OathManager.playerDebuff);
        if (this.m_keyDownList[49]&&this.m_keyDownList[37] || this.m_keyDownList[49]&&this.m_keyDownList[39]){
            this.m_humanSkill.cast(CharacterInit.playerEnt,
            {
                x: this.m_animation.x,
                y: this.m_animation.y,
            });
        }
        if (this.m_keyDownList[50]&&this.m_keyDownList[37] || this.m_keyDownList[50]&&this.m_keyDownList[39]){
            this.m_catSkill.cast(CharacterInit.playerEnt,
            {
                x: this.m_animation.x,
                y: this.m_animation.y,
            });
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
    private attackStepEventCheck(){
        this.m_atkTimer = setTimeout(()=>{
            this.m_atkStep = 0;
            this.m_atkTimer = null
            this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
        }, this.m_attackCdTime + 200);
    }
    private attackSimulation(): void{
        let temp:Laya.Animation = this.m_animation;
        let atkRange:number = this.m_attackRange;
        let offsetX:number = this.m_isFacingRight ? (temp.x + (temp.width*1/3)) : (temp.x - (temp.width*1/3) - atkRange);
        let offsetY:number = temp.y - (temp.height/3);
        let soundNum: number = Math.floor(Math.random() * 2);

        // Laya.stage.graphics.drawRect(offsetX, offsetY, atkRange, atkRange, 'red', 'red', 2);

        this.attackRangeCheck({
            'x0': offsetX,
            'x1': offsetX + atkRange,
            'y0': offsetY,
            'y1': offsetY + atkRange,
        }, 'rect');

        this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);
    }
    private attackRangeCheck(pos:object, type: string): void{
        // 可做其他形狀的範圍偵測判斷 ex.三角形、圓形, etc...
        let enemy = EnemyHandler.enemyPool;
        switch (type) {
            case 'rect':
                let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
                enemyFound.forEach((e) => {
                e._ent.takeDamage(Math.round(Math.floor(Math.random() * 51) + 150));
                // if (!OathManager.isCharging) {
                    Character.setCameraShake(10, 3);
                    //誓約系統測試
                    OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
                    
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
    public rectIntersect(r1, r2): boolean{
        let aLeftOfB:boolean = r1.x1 < r2.x0;
        let aRightOfB:boolean = r1.x0 > r2.x1;
        let aAboveB:boolean = r1.y0 > r2.y1;
        let aBelowB:boolean = r1.y1 < r2.y0;

        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }
    public createAttackEffect(player: Laya.Animation) {
        let slashEffect: Laya.Animation = new Laya.Animation();
        // slashEffect.source = "comp/NewSlash/Slash_0030.png,comp/NewSlash/Slash_0031.png,comp/NewSlash/Slash_0032.png,comp/NewSlash/Slash_0033.png,comp/NewSlash/Slash_0034.png,comp/NewSlash/Slash_0035.png,comp/NewSlash/Slash_0036.png,comp/NewSlash/Slash_0037.png";
        slashEffect.scaleX = 2;
        slashEffect.scaleY = 2;

        if(this.m_atkStep === 0){
            slashEffect.source = "comp/NewSlash/Slash_0060.png,comp/NewSlash/Slash_0061.png,comp/NewSlash/Slash_0062.png";
        }
        else if(this.m_atkStep === 1){
            slashEffect.source = "comp/NewSlash/Slash_0033.png,comp/NewSlash/Slash_0032.png,comp/NewSlash/Slash_0031.png,comp/NewSlash/Slash_0030.png";
        }

        let colorNum: number = Math.floor(Math.random() * 5) + 2;
        //濾鏡
        let colorMat: Array<number> =
        [
            colorNum, 0, 4, 0, -150, //R
            3, Math.floor(Math.random() * 4) + 2, 0, 0, -150, //G
            0, 0, colorNum, 0, -150, //B
            0, 0, 0, 1, 0, //A
        ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#af06ff", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        // if (!OathManager.isCharging) {
        slashEffect.filters = [colorFilter, glowFilter];
        // } else {
        // let colorMat_charge: Array<number> =
        //     [
        //     5, 0, 0, 0, -100, //R
        //     5, 0, 0, 0, -100, //G
        //     0, 0, 0, 0, -100, //B
        //     0, 0, 0, 1, 0, //A
        //     ];
        // let colorFilter_charge: Laya.ColorFilter = new Laya.ColorFilter(colorMat_charge);
        // let glowFilter_charge: Laya.GlowFilter = new Laya.GlowFilter("#F7F706", 20, 0, 0);
        // slashEffect.filters = [colorFilter_charge, glowFilter_charge];
        // }
        //濾鏡
        if (this.m_isFacingRight) {
            slashEffect.skewY = 0;
            slashEffect.pos(player.x - 420, player.y - 560 + 10);
        } else {
            slashEffect.skewY = 180;
            slashEffect.pos(player.x + 420, player.y - 560 + 10);
        }
        // slashEffect.source =
        // "comp/NewSlash/Slash_0030.png,comp/NewSlash/Slash_0031.png,comp/NewSlash/Slash_0032.png,comp/NewSlash/Slash_0033.png,comp/NewSlash/Slash_0034.png,comp/NewSlash/Slash_0035.png,comp/NewSlash/Slash_0036.png,comp/NewSlash/Slash_0037.png";
        slashEffect.on(Laya.Event.COMPLETE, this, function () {
        slashEffect.destroy();
        slashEffect.destroyed = true;
    });
        Laya.stage.addChild(slashEffect);
        slashEffect.play();

        let m_slashTimer = setInterval(()=>{
            if(slashEffect.destroyed)
            {
                clearInterval(m_slashTimer);
                m_slashTimer = null;
                return;
            }
            slashEffect.skewY = this.m_isFacingRight? 0:180;
            slashEffect.pos(player.x + (this.m_isFacingRight?-420:420), player.y - 560 + 10);
        }, 10);
    }
    private setSkill(): void{
        // this.m_humanSkill = new hSkill.Spike();//設定人類技能為 "突進斬"
        this.m_humanSkill = new hSkill.Behead();

        this.m_catSkill = new cSkill.Slam()//設定貓類技能為 "猛擊"
        // this.m_catSkill = new cSkill.BlackHole();
    }
    /** 設置角色移動的延遲時間，期間內可進行Velocity的改動，時間可堆疊。單位: seconds */
    public delayMove(time: number): void{
        if(this.m_moveDelayTimer){
            this.m_moveDelayValue += time;
        }
        else{
            this.m_moveDelayValue = time;
            this.m_moveDelayTimer = setInterval(()=>{
                if(this.m_moveDelayValue <= 0){
                    this.resetMove();
                    clearInterval(this.m_moveDelayTimer);
                    this.m_moveDelayTimer = null;
                    this.m_moveDelayValue = 0;
                }
                this.m_moveDelayValue -= 0.1;
            }, 100)
        }
    }
    private resetMove(): void {
        this.m_playerVelocity["Vx"] = 0;
        this.m_playerVelocity["Vy"] = 0;
        this.applyMoveX();
        this.applyMoveY();
        // if(Math.abs(this.m_animation.y - 590.0) < 12)
        //     this.m_canJump = true;
    }
    private applyMoveX(): void {
        if(this.m_moveDelayValue > 0 || this.m_animation.destroyed || !this.m_animation)
            return;
        this.m_rigidbody.setVelocity({
        x: this.m_playerVelocity["Vx"],
        y: this.m_rigidbody.linearVelocity.y,
        });
        if (!this.m_animationChanging && this.m_playerVelocity["Vx"] === 0)
            this.updateAnimation(this.m_state, CharacterStatus.idle, null, false, 500);
    }
    private applyMoveY(): void {
        if(!this.m_animation || this.m_animation.destroyed)
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
        if(this.m_animation.destroyed) return;

        let player_pivot_x: number = Laya.stage.width / 2;
        let player_pivot_y: number = Laya.stage.height / 2;

        setInterval(() => {
            if(this.m_animation.destroyed) return;

            if (Character.m_cameraShakingTimer > 0) {
                let randomSign: number = (Math.floor(Math.random() * 2) == 1) ? 1 : -1; //隨機取正負數
                Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                Laya.stage.y = /*(player_pivot_y - this.m_animation.y + 150)*/0 + Math.random() * Character.m_cameraShakingMultiplyer * randomSign;
                Character.m_cameraShakingTimer--;
            } else {
                Laya.stage.x = player_pivot_x - this.m_animation.x;
                // Laya.stage.y = player_pivot_y - this.m_animation.y + 150;
            }
            if(Laya.stage.x >= -250.0) Laya.stage.x = -250.0;
            if(Laya.stage.x <= -2475.0) Laya.stage.x = -2475.0;
        }, 10);
    }
    public static setCameraShake(timer: number, multiplier: number) {
        Character.m_cameraShakingMultiplyer = multiplier;
        Character.m_cameraShakingTimer = timer;
    }
    public updateAnimation(from: CharacterStatus, to: CharacterStatus, onCallBack: () => void = null, force: boolean = false, rate: number = 100): void{
        if(from === to || this.m_animationChanging) return;
        this.m_state = to;
        // console.log('Player status from', from, 'convert to ', to);
        switch(this.m_state){
            case CharacterStatus.attackOne:
                this.m_animationChanging = true;
                this.m_animation.source = 'character/Attack1.atlas';
                this.m_animation.play();
                break;
            case CharacterStatus.attackTwo:
                this.m_animationChanging = true;
                this.m_animation.source = 'character/Attack2.atlas';
                this.m_animation.play();
                break;
            case CharacterStatus.idle:
                this.m_animation.source = 'character/Idle.atlas';
                this.m_animation.play();
                break;
            case CharacterStatus.run:
                this.m_animation.source = 'character/Run.atlas';
                this.m_animation.play();
                break;
            case CharacterStatus.slam:
                this.m_animationChanging = true;
                this.m_animation.source = "character/Slam.atlas";
                this.m_animation.play()
                break;
            default:
                this.m_animation.source = 'character/Idle.atlas';
                this.m_animation.play();
                break;
        }
        this.m_animation.interval = rate;
        if(typeof onCallBack === 'function')
            onCallBack();
    }
    public getEnemyAttackDamage(tag: string): number{
        switch (tag) {
            case "EnemyNormalAttack":
                return new Normal().m_dmg;
            case "EnemyShieldAttack":
                return new Shield().m_dmg;
            default:
                return 0;
        }
    }
}

export default class CharacterInit extends Laya.Script {
    /** @prop {name:health,tips:"角色初始血量",type:int,default:1000}*/
    health: number = 1000;
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

    public static playerEnt: Character;

    constructor() {
        super();
    }
    onAwake() {
        let player: Character = new Character();
        this.initSetting(player);
        player.spawn();
        CharacterInit.playerEnt = player;
        Laya.stage.addChild(CharacterInit.playerEnt.m_animation);
    }
    private initSetting(player: Character): void {
        player.m_maxHealth = player.m_health = this.health;
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
    }
    //9/13新增
    onUpdate() {
        if(CharacterInit.playerEnt.m_animation.destroyed)
            return;
            
        let colorNum: number = 2;
        let oathColorMat: Array<number> =
            [
                Math.floor(Math.random() * 2) + 2, 0, 0, 0, -100, //R
                0, Math.floor(Math.random() * 2) + 1, 0, 0, -100, //G
                0, 0, Math.floor(Math.random() * 2) + 2, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(oathColorMat);
        let glowFilter_charge: Laya.GlowFilter = new Laya.GlowFilter("#df6ef4", 40, 0, 0);
        CharacterInit.playerEnt.m_animation.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];
        OathManager.characterLogo.filters = (CharacterInit.playerEnt.m_bloodyPoint >= CharacterInit.playerEnt.m_maxBloodyPoint_soft) ? [glowFilter_charge, colorFilter] : [];

        //更新誓約所影響的數值變化
        OathManager.oathUpdate();
    }
}