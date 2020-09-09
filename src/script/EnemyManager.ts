import { CharacterIdleState } from "./CharacterState";
import CharacterController from "./CharacterController";

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

abstract class Enemy extends Laya.Script {
    abstract m_name: string = '';
    abstract m_health: number = 1000;
    abstract m_armor: number = 0;
    abstract m_speed: number = 3;
    abstract m_tag: string = '';
    m_animSheet: string;

    m_moveVelocity: object = { "Vx": 0, "Vy": 0 };
    m_maxHealth: number;
    m_attackRange: number = 100;
    m_atkCd: boolean = true;
    m_atkTimer: number;
    m_isFacingRight: boolean = true;

    m_animationChanging: boolean = false;

    m_animation: Laya.Animation;
    m_collider: Laya.BoxCollider;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_player: Laya.Animation;

    m_state = EnemyStatus.idle;

    spawn(player: Laya.Animation, id: string): void {
        this.m_animation = new Laya.Animation();
        this.m_animation.scaleX = 4;
        this.m_animation.scaleY = 4;

        this.m_animation.width = 35;
        this.m_animation.height = 35;
        this.m_animation.pivotX = this.m_animation.width / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;

        this.m_animation.pos(player.x - 170, player.y - (player.height / 2));
        this.m_animation.autoPlay = true;
        this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
        this.m_animation.interval = 100;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, ()=>{
            this.m_animationChanging = false;
        })
        
        this.m_maxHealth = this.m_health;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);
        this.m_script.onUpdate = () => {
            this.enemyAIMain();
        }

        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.x -= 13;
        this.m_collider.y -= 10;
        this.m_collider.label = id;
        this.m_collider.tag = 'Enemy';
        
        // this.m_rigidbody.mask = 0;
        this.m_rigidbody.category = 8;
        this.m_rigidbody.mask = 4 | 2;
        this.m_rigidbody.allowRotation = false;

        this.m_player = player;

        Laya.stage.addChild(this.m_animation);
        this.showHealth(this.m_animation);

    };
    destroy(): void {
        this.m_animation.destroy();
    };
    setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            this.setSound(0.05, "Audio/EnemyDie/death1.wav", 1)//loop:0為循環播放;
            this.bloodSplitEffect(this.m_animation);
            this.m_animation.destroy();
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

    private showHealth(enemy: Laya.Animation) {
        let healthBar = new Laya.ProgressBar();
        healthBar.height = 10;
        healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
        healthBar.skin = "comp/progress.png";
        healthBar.value = 1;
        Laya.stage.addChild(healthBar);

        setInterval((() => {
            if (enemy.destroyed) {
                healthBar.destroy();
                healthBar.destroyed = true;
                return;
            }
            healthBar.pos(enemy.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) - 10, (enemy.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
            healthBar.value = this.m_health / this.m_maxHealth;
        }), 10);
    }
    private bloodSplitEffect(enemy: Laya.Sprite) {
        let bloodEffect: Laya.Animation = new Laya.Animation();
        let colorMat: Array<number> =
            [
                2, 0, 0, 0, -100, //R
                0, 1, 0, 0, -100, //G
                0, 0, 1, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);

        bloodEffect.filters = [colorFilter, glowFilter];
        bloodEffect.pos(enemy.x - 250, enemy.y - 250 + 30);
        bloodEffect.source = "comp/Blood/Blood_0000.png,comp/Blood/Blood_0001.png,comp/Blood/Blood_0002.png,comp/Blood/Blood_0003.png,comp/Blood/Blood_0004.png,comp/Blood/Blood_0005.png,comp/Blood/Blood_0006.png,comp/Blood/Blood_0007.png,comp/Blood/Blood_0008.png,comp/Blood/Blood_0009.png,comp/Blood/Blood_0010.png,comp/Blood/Blood_0011.png,comp/Blood/Blood_0012.png,comp/Blood/Blood_0013.png,comp/Blood/Blood_0014.png";
        bloodEffect.on(Laya.Event.COMPLETE, this, function () {
            bloodEffect.destroy();
            bloodEffect.destroyed = true;
        });
        Laya.stage.addChild(bloodEffect);
        bloodEffect.play();
    }

    private setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    //敵人行為主邏輯
    public enemyAIMain() {

        this.pursuitPlayer();
        this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer
        // console.log(this.m_atkTimer);

        if (this.playerRangeCheck(this.m_attackRange * 2)) {
            this.tryAttack();
        }
    }

    public pursuitPlayer() {
        let dir: number = this.m_player.x - this.m_animation.x;
        // this.m_animation.skewY = (this.m_moveVelocity["Vx"] > 0) ? 0 : 180;
        let rightSide: boolean = (this.m_player.x - this.m_animation.x) > 0;
        this.m_animation.skewY = rightSide ? 0 : 180;
        this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false
        if (Math.abs(this.m_moveVelocity["Vx"]) <= this.m_speed) {
            this.m_moveVelocity["Vx"] += (dir > 0) ? 0.03 : -0.03;
        } else {
            this.m_moveVelocity["Vx"] = (dir > 0) ? this.m_speed : -this.m_speed;
        }
        if(!this.m_animationChanging)
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
        if (this.m_atkTimer > 0) return;
        this.m_atkCd = false;
        // this.rigidbody.setVelocity({x:0, y:this.rigidbody.linearVelocity.y});
        this.m_moveVelocity["Vx"] = 0;
        let atkCircle = new Laya.Sprite();
        // let x_offset: number = this.m_isFacingRight
        //     ? (this.m_animation.width * 1) / 2 + 3
        //     : (this.m_animation.width * 5) / 4 + 3;
        if (this.m_isFacingRight) {
            atkCircle.pos(
                // this.sprite.x + x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
                this.m_animation.x + this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2
            );
        } else {
            atkCircle.pos(
                // this.sprite.x - x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
                this.m_animation.x - 3 * this.m_animation.width / 2 + 30, this.m_animation.y - this.m_animation.height / 2
            );
        }
        let atkBoxCollider: Laya.BoxCollider = atkCircle.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(Laya.RigidBody) as Laya.RigidBody;
        let atkCircleScript: Laya.Script = atkCircle.addComponent(Laya.Script) as Laya.Script;

        atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
        atkCircleRigid.category = 8;
        atkCircleRigid.mask = 4;

        atkCircleScript.onTriggerEnter = function (col: Laya.BoxCollider) {
            if (col.tag === 'Player') {
                console.log("打到玩家了");
            }
        };
        atkBoxCollider.isSensor = true;
        atkCircleRigid.gravityScale = 0;
        this.updateAnimation(this.m_state, EnemyStatus.attack);
        // this.m_animation.skew
        atkCircle.graphics.drawRect(0, 0, 100, 100, "red", "red", 1);
        Laya.stage.addChild(atkCircle);

        this.m_atkTimer = 100;

        setTimeout(() => {
            atkCircle.destroy();
            atkCircle.destroyed = true;
        }, 100);

        setTimeout(() => {
            this.m_atkCd = true;
        }, 500);
    }
    private applyMoveX(): void {
        this.m_rigidbody.setVelocity({
            x: this.m_moveVelocity["Vx"],
            y: this.m_rigidbody.linearVelocity.y,
        });
    }
    private applyMoveY(): void {
        this.m_rigidbody.setVelocity({
            x: this.m_rigidbody.linearVelocity.x,
            y: this.m_moveVelocity["Vy"],
        });
    }
    private updateAnimation(from: EnemyStatus, to: EnemyStatus, onCallBack: () => void = null, force: boolean = false): void{
        if(this.m_state === to || this.m_animationChanging) return;
        this.m_state = to;
        // console.log(from, 'convert to ', to);
        switch(this.m_state){
            case EnemyStatus.attack:
                this.m_animationChanging = true;
                this.m_animation.interval = 100;
                this.m_animation.source = 'goblin/attack_05.png,goblin/attack_06.png,goblin/attack_07.png,goblin/attack_08.png';
                this.m_animation.play();
                break;
            case EnemyStatus.idle:
                this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                break;
            case EnemyStatus.run:
                this.m_animation.source = 'goblin/run_01.png,goblin/run_02.png,goblin/run_03.png,goblin/run_04.png,goblin/run_05.png,goblin/run_06.png,goblin/run_07.png,goblin/run_08.png';
                this.m_animation.interval = 100;
                this.m_animation.play();
                break;
            default:
                this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                break;
        }
        if(typeof onCallBack === 'function')
            onCallBack();
    }
}
export class EnemyNormal extends Enemy {
    m_name = '普通敵人';
    m_health = 1000;
    m_armor = 100;
    m_speed = 2;
    m_tag = 'n';
    m_attackRange = 100; 
}
export class EnemyShield extends Enemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_tag = 's';
    m_attackRange = 100;
}