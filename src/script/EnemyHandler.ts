import CharacterInit from "./CharacterInit";
import EnemyInit from "./EnemyInit";
import ZOrderManager from "./ZOrderManager";

// import CharacterInit, { Character } from "./CharacterInit";
export enum EnemyStatus{
    idle = 0,
    run,
    jump,
    down,
    attack,
    useSkill,
    hurt,
    defend,
    death
}
/** (虛擬)敵人基礎設定 */
export abstract class VirtualEnemy extends Laya.Script {
    abstract m_health: number;
    abstract m_dmg: number;
    abstract m_critical: number;
    abstract m_criticalDmgMultiplier: number;
    abstract m_armor: number;
    abstract m_speed: number;
    /** 受到攻擊時的硬直秒數，單位:seconds。 */
    abstract m_mdelay: number;
    abstract m_tag: string;
    abstract m_name: string;
    abstract m_atkTag: string;
    m_animSheet: string;
    
    m_isElite: boolean;

    m_moveVelocity: object = { "Vx": 0, "Vy": 0 };
    m_rectangle: object = { "x0": 0, "x1": 0, "y0": 0, "y1": 0, "h": 0, "w": 0 };
    m_playerPushVelOffset: object = { "Vx": 0, "Vy": 0 };
    // m_collideScript: Laya.Script;

    m_maxHealth: number;
    m_attackRange: number = 100;
    m_hurtDelay: number = 0;
    m_atkCd: boolean = true;
    m_atkTimer: number;
    m_isFacingRight: boolean = true;

    m_moveDelayValue: number = 0.0;
    m_moveDelayTimer = null;
    m_deadTimer = null;

    m_animationChanging: boolean = false;

    m_animation: Laya.Animation;
    m_collider: Laya.BoxCollider;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_player: Laya.Animation;
    m_hurtDelayTimer = null;

    m_healthBar: Laya.ProgressBar;
    m_state = EnemyStatus.idle;


    spawn(player: Laya.Animation, id: string, point: object, enemyType: number): void {
        this.m_animation = new Laya.Animation();
        this.m_animation.filters = [];
        //10/14匯入normalEnemy後調整
        this.m_animation.scaleX = 1.5;
        this.m_animation.scaleY = 1.5;

        // this.m_animation.width = 96;
        // this.m_animation.height = 140;
        this.m_animation.width = 160;
        this.m_animation.height = 160;
        //
        this.m_animation.pivotX = this.m_animation.width  / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;
        let enemyPos: number[] = [-200, 200];//9/12新增
        // this.m_animation.pos(player.x + enemyPos[Math.floor(Math.random() * 2)], player.y - (player.height / 2));//9/12更改
        this.m_animation.pos(point['x'], point['y']);

        this.m_animation.autoPlay = true;
        this.m_animation.source = 'normalEnemy/Idle.atlas';
        this.m_animation.interval = 100;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, () => {
            this.m_animationChanging = false;
            if(this.m_state === EnemyStatus.attack){
                this.m_animation.stop();
            }
        })

        let enemyInit: EnemyInit = new EnemyInit();
        switch (enemyType) {
            case 1:
                this.m_health = enemyInit.NormalEnemyHealth;
                this.m_dmg = enemyInit.NormalEnemyDmg;
                this.m_critical = enemyInit.NormalEnemyCritical;
                this.m_criticalDmgMultiplier = enemyInit.NormalEnemyCriticalDmgMultiplier;
                break;
            case 2:
                this.m_health = enemyInit.ShieldEnemyHealth;
                this.m_dmg = enemyInit.ShieldEnemyDmg;
                this.m_critical = enemyInit.ShieldEnemyCritical;
                this.m_criticalDmgMultiplier = enemyInit.ShieldEnemyCriticalDmgMultiplier;
            break;
            case 3:
                this.m_health = enemyInit.FastEnemyHealth;
                this.m_dmg = enemyInit.FastEnemyDmg;
                this.m_critical = enemyInit.FastEnemyCritical;
                this.m_criticalDmgMultiplier = enemyInit.FastEnemyCriticalDmgMultiplier;
            break;
            case 4:
                this.m_health = enemyInit.NewbieEnemyHealth;
                this.m_dmg = enemyInit.NewbieEnemyDmg;
                this.m_critical = enemyInit.NewbieEnemyCritical;
                this.m_criticalDmgMultiplier = enemyInit.NewbieEnemyCriticalDmgMultiplier;
            break;
            default:
                break;
        }

        this.m_maxHealth = this.m_health;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);
        this.m_script.onUpdate = () => {
            this.enemyAIMain();
            this.checkPosition();  
        }
        this.m_script.onTriggerEnter = (col) => {
            if(col.tag === 'Player'){
                // this.m_rigidbody.linearVelocity.x = 0.0;
            }
        }

        this.m_collider.width = this.m_animation.width - 64;
        this.m_collider.height = this.m_animation.height - 20;
        this.m_collider.x = 0;
        this.m_collider.y = -10;
        this.m_collider.label = id;
        this.m_collider.tag = 'Enemy';

        this.m_collider.density = 300;

        this.m_rigidbody.category = 8;
        this.m_rigidbody.mask = 4 | 2;
        this.m_rigidbody.allowRotation = false;
        // this.m_rigidbody.gravityScale = 5;

        this.m_player = player;

        Laya.stage.addChild(this.m_animation);
        this.showHealth();
        if(this.m_isElite){
            this.setEnemyEliteColor();
        }
    };
    destroy(): void {
        this.m_animation.destroy();
        this.m_animation.destroyed = true;
    };
    setHealth(amount: number): void {
        this.m_health = amount;
        if (amount <= 0) {
            // this.m_animation.filters = null;
            // this.setSound(0.05, "Audio/EnemyDie/death1.wav", 1)
            //this.bloodSplitEffect(this.m_animation);
            this.m_state = EnemyStatus.idle;
            this.m_deadTimer = setInterval((() => {
            if (this.m_animation.destroyed || !this.m_animation) return;
            this.m_animation.alpha -= 0.1;
            if(this.m_animation.alpha <= 0)
            {
                clearInterval(this.m_deadTimer);
                this.destroy();
                EnemyInit.enemyLeftCur--;
                EnemyHandler.updateEnemies();
            }
            }), 25);//可能要再優化
            return;
        }
    }
    getHealth(): number {
        return this.m_health;
    };
    setArmor(amount: number): void {
        this.m_armor = amount;
    };
    getArmor(): number {
        return this.m_armor;
    };
    setSpeed(amount: number): void {
        this.m_speed = amount;
    };
    getSpeed(): number {
        return this.m_speed;
    };
    setLabel(index: string): void {
        this.m_collider.label = index;
    };
    takeDamage(amount: number, criticalRate: number, criticalDmgRate: number) {
        if (this.m_animation.destroyed || amount <= 0 || !this.m_animation) return;

        let fakeNum = Math.random() * 100;
        let critical: boolean = (fakeNum <= criticalRate);

        // if(!this.m_moveDelayValue)
        //     this.delayMove(this.m_mdelay);

        amount *= critical ? criticalDmgRate : 1;
        amount = Math.round(amount);
        this.setHealth(this.getHealth() - amount);
        this.damageTextEffect(amount, critical);
        this.m_healthBar.alpha = 1;
        if (this.m_hurtDelayTimer) {
            this.m_hurtDelay += 0.5;
        }
        else {
            this.m_hurtDelay = 1.0;
            this.m_hurtDelayTimer = setInterval(() => {
                if (this.m_hurtDelay <= 0) {
                    clearInterval(this.m_hurtDelayTimer);
                    this.m_hurtDelayTimer = null;
                    this.m_hurtDelay = -1;
                }
                this.m_hurtDelay -= 0.1;
            }, 100);
        }
        if (critical){
            if(this.m_moveDelayValue <= 0)
                this.delayMove(0.6);
            let facingRight:boolean = (CharacterInit.playerEnt.m_animation.x - this.m_animation.x) > 0.0 ? true : false;
            this.m_rigidbody.linearVelocity = {x: facingRight?-4.0:4.0, y:0.0};
        }
        this.m_atkTimer = 60;
        // this.delayMove(1.0);
        this.updateAnimation(this.m_state, EnemyStatus.idle);
        this.enemyInjuredColor();
    }
    private damageTextEffect(amount: number, critical: boolean): void {
        let damageText = new Laya.Text();
        //let soundNum: number;

        let fakeX: number = Math.random() * 60;
        let fakeY: number = Math.random() * 50;

        // damageText.pos(this.m_animation.x - this.m_animation.width/2 - 20, this.m_animation.y - this.m_animation.height - 100);
        damageText.pos(this.m_animation.x - fakeX, (this.m_animation.y - this.m_animation.height) - 100);
        damageText.bold = true;
        damageText.align = "center";
        damageText.alpha = 0.8;

        damageText.fontSize = critical ? 40 : 20;
        damageText.color = critical ? '#FA7B1E' : "white";

        if (amount >= 3000) {
            damageText.fontSize = 55;
            damageText.color = "#00DDDD";
        }

        let temp_text = "";
        for (let i = 0; i < String(amount).length; i++) {
            temp_text += String(amount)[i];
            temp_text += " ";
        }

        damageText.text = temp_text;
        damageText.font = "silver";
        damageText.stroke = 3;
        damageText.strokeColor = "#000";

        Laya.stage.addChild(damageText);

        Laya.Tween.to(damageText, { alpha: 0.4, fontSize: damageText.fontSize + 50, y: damageText.y + 80, }, 650, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 130 }, 650, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { damageText.destroy() }), 0);
            }), 0);
    }
    private showHealth() {
        this.m_healthBar = new Laya.ProgressBar();
        this.m_healthBar.height = 10;
        this.m_healthBar.width = this.m_animation.width;
        this.m_healthBar.skin = "comp/progress.png";
        this.m_healthBar.value = 1;
        this.m_healthBar.alpha = 1;
        Laya.stage.addChild(this.m_healthBar);

        let healthBarFunc = function (){
            if (this.m_animation.destroyed) {
                this.m_healthBar.destroy();
                this.m_healthBar.destroyed = true;
                Laya.timer.clear(this, healthBarFunc);
                return;
            }
            
            this.m_healthBar.alpha -= (this.m_healthBar.alpha > 0 && this.m_hurtDelay <= 0) ? 0.02 : 0;
            this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) + 20, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
            this.m_healthBar.value = this.m_health / this.m_maxHealth;
        }
        Laya.timer.frameLoop(1, this, healthBarFunc);

        // setInterval((() => {
        //     if (this.m_healthBar.destroyed)
        //         return;
        //     if (this.m_animation.destroyed) {
        //         this.m_healthBar.destroy();
        //         this.m_healthBar.destroyed = true;
        //         return;
        //     }
        //     this.m_healthBar.alpha -= (this.m_healthBar.alpha > 0 && this.m_hurtDelay <= 0) ? 0.02 : 0;
        //     this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) + 20, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
        //     this.m_healthBar.value = this.m_health / this.m_maxHealth;
        // }), 10);
    }
    // private bloodSplitEffect(enemy: Laya.Sprite) {
    //     let bloodEffect: Laya.Animation = new Laya.Animation();
    //     bloodEffect.scaleX = 2;
    //     bloodEffect.scaleY = 2;
    //     let colorMat: Array<number> =
    //         [
    //             2, 0, 0, 0, -100, //R
    //             0, 1, 0, 0, -100, //G
    //             0, 0, 1, 0, -100, //B
    //             0, 0, 0, 1, 0, //A
    //         ];
    //     let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
    //     let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);

    //     bloodEffect.filters = [glowFilter, colorFilter];
    //     bloodEffect.pos(enemy.x - 500, enemy.y - 500 + 30);
    //     bloodEffect.source = "comp/NewBlood.atlas";
    //     bloodEffect.on(Laya.Event.COMPLETE, this, function () {
    //         bloodEffect.destroy();
    //         bloodEffect.destroyed = true;
    //     });
    //     Laya.stage.addChild(bloodEffect);
    //     bloodEffect.play();
    // }
    slashLightEffect(enemy: Laya.Sprite) {
        let slashLightEffect: Laya.Animation = new Laya.Animation();
        let sourceArray : Array<string> = ["comp/NewSlahLight.atlas","comp/NewSlashLight90.atlas","comp/NewSlashLight-43.5.atlas"];
        let sourceNum : number = Math.floor(Math.random() * 3);
        slashLightEffect.scaleX = 3;
        slashLightEffect.scaleY = 2.6;
        slashLightEffect.interval = 15;
        let colorMat: Array<number> =
            [
                1, 0, 0, 0, 500, //R
                0, 1, 0, 0, 500, //G
                0, 0, 1, 0, 500, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ffffff", 40, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        slashLightEffect.filters = [colorFilter];
        //enemy.x + 6 * rotation - 220 : enemy.x + 6 * rotation - 320,checkRotation ? enemy.y + 0.1 * rotation - 250 + 30 : enemy.y - 2.2 * rotation - 250 + 30
        slashLightEffect.pos(this.m_isFacingRight ? enemy.x - 760 : enemy.x - 760, enemy.y - 640 + 30);//y軸需再修正
        slashLightEffect.source = sourceArray[sourceNum];
        slashLightEffect.alpha = 1;
        slashLightEffect.on(Laya.Event.COMPLETE, this, function () {
            slashLightEffect.destroy();
            slashLightEffect.destroyed = true;
        });
        Laya.stage.addChild(slashLightEffect);
        slashLightEffect.play();
    }
    private setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    //敵人行為主邏輯
    public enemyAIMain() {
        if (this.m_animation.destroyed){
            return;
        }
        if (this.playerRangeCheck(this.m_attackRange * 2)) {
            if(this.m_health <= 0) return;
            
            if(this.m_moveDelayValue <= 0.0)
                this.m_rigidbody.linearVelocity = {x:0.0,y:0.0};
                
            this.tryAttack();
            this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer

            return;
        }
        this.pursuitPlayer();
    }
    private checkPosition() {
        this.m_rectangle['x0'] = this.m_animation.x - (this.m_animation.width / 2);
        this.m_rectangle['x1'] = this.m_animation.x + (this.m_animation.width / 2);
        this.m_rectangle['y0'] = this.m_animation.y - (this.m_animation.height / 2);
        this.m_rectangle['y1'] = this.m_animation.y + (this.m_animation.height / 2);
        this.m_rectangle['w'] = this.m_animation.width;
        this.m_rectangle['h'] = this.m_animation.height;
    }
    private pursuitPlayer() {
        if (this.m_player.destroyed) {
            this.updateAnimation(this.m_state, EnemyStatus.idle);
            return;
        }
        let dir: number = this.m_player.x - this.m_animation.x;
        let rightSide: boolean = (this.m_player.x - this.m_animation.x) > 0;
        let lastDirection: boolean = this.m_isFacingRight;

        this.m_animation.skewY = rightSide ? 0 : 180;
        this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false

        if(lastDirection != this.m_isFacingRight){
            this.m_rigidbody.linearVelocity.x = 0.0;
        }

        if (Math.abs(this.m_moveVelocity["Vx"]) <= this.m_speed) {
            this.m_moveVelocity["Vx"] += (dir > 0) ? 0.03 : -0.03;
        } else {
            this.m_moveVelocity["Vx"] = (dir > 0) ? this.m_speed : -this.m_speed;
        }
        if (!this.m_animationChanging)
            this.updateAnimation(this.m_state, EnemyStatus.run);
        else
            this.m_moveVelocity["Vx"] = 0;
        
        this.applyMoveX();
    }
    private playerRangeCheck(detectRange: number): boolean {
        //取得角色與敵人的最短路徑長度
        let dist: number = Math.sqrt(Math.pow((this.m_player.x - this.m_animation.x), 2) + Math.pow((this.m_player.y - this.m_animation.y), 2));
        return (dist <= detectRange) ? true : false;
    }
    private tryAttack() {
        if (this.m_atkTimer > 0 || this.m_player.destroyed) return;
        
        this.m_atkCd = false;
        // this.rigidbody.setVelocity({x:0, y:this.rigidbody.linearVelocity.y});
        this.m_moveVelocity["Vx"] = 0;
        let atkCircle = new Laya.Sprite();

        let atkCircleTempX: number = this.m_isFacingRight ? this.m_animation.x + this.m_animation.width / 2 - 5 : this.m_animation.x - 3 * this.m_animation.width / 2 + 50;
        let atkCircleTempY: number = this.m_animation.y - this.m_animation.height / 2 + 30;

        atkCircle.pos(atkCircleTempX, atkCircleTempY);
        
        //生成攻擊球
        // if (this.m_isFacingRight) {
        //     atkCircle.pos(
        //         // this.sprite.x + x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
        //         this.m_animation.x + this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2
        //     );
        // } else {
        //     atkCircle.pos(
        //         // this.sprite.x - x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
        //         this.m_animation.x - 3 * this.m_animation.width / 2 - 30, this.m_animation.y - this.m_animation.height / 2,//11/5更改
        //     );
        // }
        
        let atkBoxCollider: Laya.BoxCollider = atkCircle.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(Laya.RigidBody) as Laya.RigidBody;

        atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
        atkCircleRigid.category = 8;
        atkCircleRigid.mask = 4;
        
        atkBoxCollider.isSensor = true;
        atkCircleRigid.gravityScale = 0;
        this.updateAnimation(EnemyStatus.idle, EnemyStatus.attack);
        // Laya.stage.addChild(atkCircle);
        // atkBoxCollider.tag = this.m_atkTag;
        // this.m_atkTimer = 100;
        setTimeout(() => {
            Laya.stage.addChild(atkCircle);
            atkBoxCollider.tag = this.m_atkTag;
            this.m_atkTimer = 100;
        }, 500);
        setTimeout(() => {
            atkCircle.destroy();
            atkCircle.destroyed = true;
        }, 600);
        setTimeout(() => {
            this.m_atkCd = true;
        }, 1000);
        if(!this.m_moveDelayTimer)
            this.delayMove(0.1);
    }
    public delayMove(time: number): void {
        if (this.m_moveDelayTimer) {
            this.m_moveDelayValue += time;
        }
        else {
            this.m_moveDelayValue = time;
            this.m_moveDelayTimer = setInterval(() => {
                if (this.m_moveDelayValue <= 0) {
                    clearInterval(this.m_moveDelayTimer);
                    this.m_moveDelayTimer = null;
                    // this.m_moveVelocity["Vx"] = 0;
                    this.m_moveDelayValue = 0;
                }
                this.m_moveDelayValue -= 0.01;
                // console.log('working!', this.m_moveDelayValue);
            }, 10)
        }
    }
    private applyMoveX(): void {
        if (this.m_moveDelayValue > 0 || this.m_animation.destroyed) return;
        
        this.m_rigidbody.setVelocity({
            x: this.m_moveVelocity["Vx"],
            y: this.m_rigidbody.linearVelocity.y,
        });
    }
    // private applyMoveY(): void {
    //     this.m_rigidbody.setVelocity({
    //         x: this.m_rigidbody.linearVelocity.x,
    //         y: this.m_moveVelocity["Vy"],
    //     });
    // }
    public updateAnimation(from: EnemyStatus, to: EnemyStatus, onCallBack: () => void = null, force: boolean = false, rate: number = 100): void{
        if(from === to || this.m_animationChanging) return;
        this.m_state = to;
        switch (this.m_state) {
            case EnemyStatus.attack:
                this.m_animationChanging = true;
                this.m_animation.source = 'normalEnemy/Attack.atlas';
                this.m_animation.play();
                break;
            case EnemyStatus.idle:
                this.m_animation.source = 'normalEnemy/Idle.atlas';
                break;
            case EnemyStatus.run:
                this.m_animation.source = 'normalEnemy/Walk.atlas';
                this.m_animation.play();
                break;
            default:
                this.m_animation.source = 'normalEnemy/Idle.atlas';
                break;
        }
        this.m_animation.interval = rate;
        if (typeof onCallBack === 'function')
            onCallBack();
    }
    public enemyInjuredColor(): void//0921新增
    {
        if (this.m_animation.destroyed || !this.m_animation) return;
        this.m_animation.alpha = 1;
        let colorMat: Array<number> =
            [
                // 4, 0, 0, 0, 10, //R
                // 0, 1, 0, 0, 10, //G
                // 0, 0, 4, 0, 10, //B
                // 0, 0, 0, 1, 0, //A
                2, 0, 0, 0, 10, //R
                0, 1, 0, 0, 10, //G
                0, 0, 0, 0, 10, //B
                0, 0, 0, 1, 0, //A
            ];
        // let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ef1ff8", 1, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [colorFilter];
        setTimeout(() => {
            if(!this.m_animation || this.m_animation.destroyed){
                return;
            }
            this.m_animation.alpha = 1;
            this.m_animation.filters = null;
        }, 200);
    }
    public setEnemyEliteColor(): void
    {
        if (this.m_animation.destroyed || !this.m_animation) return;
        this.m_animation.alpha = 1;
        let colorMat: Array<number> =
            [
                0, 0, 1, 0, 10, //R
                0, 1, 0, 0, 10, //G
                0, 0, 0, 0, 10, //B
                0, 0, 0, 1, 0, //A
            ];
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        // this.m_animation.filters = [colorFilter];
        let timer = setInterval(() => {
            if(!this.m_animation || this.m_animation.destroyed){
                clearInterval(timer);
                return;
            }
            this.m_animation.filters = [colorFilter];
        }, 100);
    }
}
export class Normal extends VirtualEnemy {
    m_name = '普通敵人';
    m_health: number;
    m_dmg: number;
    m_critical: number;
    m_criticalDmgMultiplier: number;
    m_armor = 100;
    m_speed = 1.7;
    m_tag = 'n';
    m_attackRange = 100;
    m_mdelay = 0.1;

    m_atkTag = "EnemyNormalAttack";
}
export class Shield extends VirtualEnemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health: number;
    m_dmg: number;
    m_critical: number;
    m_criticalDmgMultiplier: number;
    m_speed = 1.5;
    m_tag = 's';
    m_attackRange = 100;
    m_mdelay = 0.05;
    m_atkTag = "EnemyShieldAttack";
}
export class Fast extends VirtualEnemy {
    m_name = '快攻敵人';
    m_armor = 100;
    m_health: number;
    m_dmg: number;
    m_critical: number;
    m_criticalDmgMultiplier: number;
    m_speed = 7;
    m_tag = 's';
    m_attackRange = 100;
    m_mdelay = 0.7;
    m_atkTag = "EnemyFastAttack";
}
export class Newbie extends VirtualEnemy {
    m_name = '新手敵人';
    m_armor = 100;
    m_health: number;
    m_dmg: number;
    m_critical: number;
    m_criticalDmgMultiplier: number;
    m_speed = 3;
    m_tag = 's';
    m_attackRange = 100;
    m_mdelay = 0.5;
    m_atkTag = "EnemyNewbieAttack";
}


export default class EnemyHandler extends Laya.Script {
    public static enemyIndex: number = 0;
    public static enemyPool = [];

    public static generator(player: Laya.Animation, enemyType: number, spawnPoint: number): VirtualEnemy {
        let enemy: VirtualEnemy = this.decideEnemyType(enemyType);
        let id: string = enemy.m_tag + String(++this.enemyIndex);
        let point = [
            {"x": 150.0, "y": 450.0},
            {"x": 3935.0, "y": 450.0}
        ];
        let randomPoint = Math.floor(Math.random() * point.length);
        enemy.m_isElite = true;
        enemy.spawn(player, id, point[randomPoint], enemyType);
        
        this.enemyPool.push({ '_id': id, '_ent': enemy });
        this.updateEnemies();

        // console.log(this.enemyPool);
        
        return enemy;
    }
    private static decideEnemyType(enemyType: number) {
        switch (enemyType) {
            case 1: return new Normal();
            case 2: return new Shield();
            case 3: return new Fast();
            case 4: return new Newbie();
            default: return new Normal();
        };
    }
    public static updateEnemies(): any {
        return this.enemyPool = this.enemyPool.filter(data => data._ent.m_animation.destroyed === false);
    }
    public static getEnemiesCount(): number {
        return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_animation.destroyed === false)).length;
    }
    public static getEnemyByLabel(label: string): VirtualEnemy {
        return this.enemyPool.filter(data => data._id === label)[0]['_ent'] as VirtualEnemy;
    }
    public static clearAllEnemy(): void{
        let aliveEnemy = EnemyHandler.enemyPool.filter(data => data._ent.m_animation != null);
        for(let i = 0; i < aliveEnemy.length; i++){
            if(aliveEnemy[i]._ent.m_animation.destroyed) return;
            // aliveEnemy[i]._ent.m_animation.zOrder = -15;
            ZOrderManager.setZOrder(aliveEnemy[i]._ent.m_animation, -15);
            aliveEnemy[i]._ent.m_animation.destroy();
            aliveEnemy[i]._ent.m_animation.destroyed = true;
        }
        this.enemyPool = [];
    }
}