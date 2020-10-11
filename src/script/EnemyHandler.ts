// import CharacterInit, { Character } from "./CharacterInit";

export enum EnemyStatus {
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
    abstract m_name: string = '';
    abstract m_health: number = 1000;
    abstract m_armor: number = 0;
    abstract m_speed: number = 3;
    /** 受到攻擊時的硬直秒數，單位:seconds。 */
    abstract m_mdelay: number = 0.5;
    abstract m_tag: string = '';
    m_animSheet: string;

    m_moveVelocity: object = { "Vx": 0, "Vy": 0 };
    m_rectangle: object = { "x0": 0, "x1": 0, "y0": 0, "y1": 0, "h": 0, "w": 0 };
    m_maxHealth: number;
    m_attackRange: number = 100;
    m_hurtDelay: number = 0;
    m_atkCd: boolean = true;
    m_atkTimer: number;
    m_isFacingRight: boolean = true;

    m_moveDelayValue: number = 0;
    m_moveDelayTimer;

    m_animationChanging: boolean = false;

    m_animation: Laya.Animation;
    m_collider: Laya.BoxCollider;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_player: Laya.Animation;
    m_hurtDelayTimer;

    m_healthBar: Laya.ProgressBar;
    m_state = EnemyStatus.idle;

    spawn(player: Laya.Animation, id: string): void {
        this.m_animation = new Laya.Animation();
        this.m_animation.filters = [];
        this.m_animation.scaleX = 4;
        this.m_animation.scaleY = 4;

        this.m_animation.width = 35;
        this.m_animation.height = 35;
        this.m_animation.pivotX = this.m_animation.width / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;
        let enemyPos: number[] = [-200, 200];//9/12新增
        this.m_animation.pos(player.x + enemyPos[Math.floor(Math.random() * 2)], player.y - (player.height / 2));//9/12更改
        this.m_animation.autoPlay = true;
        this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
        this.m_animation.interval = 100;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, () => {
            this.m_animationChanging = false;
        })

        this.m_maxHealth = this.m_health;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);
        this.m_script.onUpdate = () => {
            this.enemyAIMain();
            this.checkPosition();
        }

        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.x -= 13;
        this.m_collider.y -= 10;
        this.m_collider.label = id;
        this.m_collider.tag = 'Enemy';

        this.m_rigidbody.category = 8;
        this.m_rigidbody.mask = 4 | 2;
        this.m_rigidbody.allowRotation = false;

        this.m_player = player;

        Laya.stage.addChild(this.m_animation);
        this.showHealth();

    };
    destroy(): void {
        this.m_animation.destroy();
        this.m_animation.destroyed = true;
    };
    setHealth(amount: number): void {
        if (amount <= 0) {
            // this.m_animation.filters = null;
            // this.setSound(0.05, "Audio/EnemyDie/death1.wav", 1)
            // this.bloodSplitEffect(this.m_animation);
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
            return;
        }
        this.m_health = amount;
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
    takeDamage(amount: number) {
        if (this.m_animation.destroyed || amount <= 0) return;

        let fakeNum = Math.random() * 100;
        let critical: boolean = (fakeNum <= 25);

        this.delayMove(this.m_mdelay);
        amount *= critical ? 5 : 1;
        this.setHealth(this.getHealth() - amount);
        this.damageTextEffect(amount, critical);
        this.m_healthBar.alpha = 1;
        // if (critical){
        //     this.m_animation.x--;
        //     this.m_animation.y++;
        // }
        //this.enemyInjuredColor();
        if (this.m_hurtDelay > 0) {
            this.m_hurtDelay += 2.0;
        }
        else {
            this.m_hurtDelay = 2.0;
            this.m_hurtDelayTimer = setInterval(() => {
                if (this.m_hurtDelay <= 0) {
                    clearInterval(this.m_hurtDelayTimer);
                    this.m_hurtDelay = -1;
                }
                this.m_hurtDelay -= 0.1;
            }, 100);
        }
    }
    private damageTextEffect(amount: number, critical: boolean): void {
        let damageText = new Laya.Text();
        let soundNum: number;

        let fakeX: number = Math.random() * 60;
        let fakeY: number = Math.random() * 50;

        // damageText.pos(this.m_animation.x - this.m_animation.width/2 - 20, this.m_animation.y - this.m_animation.height - 100);
        damageText.pos(this.m_animation.x - fakeX, (this.m_animation.y - this.m_animation.height) - 100);
        damageText.bold = true;
        damageText.align = "center";
        damageText.alpha = 1;

        damageText.fontSize = critical ? 40 : 20;
        damageText.color = critical ? 'orange' : "white";

        if (amount >= 10000) {
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
        damageText.stroke = 5;
        damageText.strokeColor = "#000";

        soundNum = critical ? 0 : 1;
        this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
        Laya.stage.addChild(damageText);

        Laya.Tween.to(damageText, { alpha: 0.65, fontSize: damageText.fontSize + 50, y: damageText.y + 50, }, 450, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 100 }, 450, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { damageText.destroy() }), 0);
            }), 0);
    }
    private showHealth() {
        this.m_healthBar = new Laya.ProgressBar();
        this.m_healthBar.height = 10;
        this.m_healthBar.width = this.m_animation.width * this.m_animation.scaleX * 1.2;
        this.m_healthBar.skin = "comp/progress.png";
        this.m_healthBar.value = 1;
        this.m_healthBar.alpha = 1;
        Laya.stage.addChild(this.m_healthBar);

        setInterval((() => {
            if (this.m_healthBar.destroyed)
                return;
            if (this.m_animation.destroyed) {
                this.m_healthBar.destroy();
                this.m_healthBar.destroyed = true;
                return;
            }
            this.m_healthBar.alpha -= (this.m_healthBar.alpha > 0 && this.m_hurtDelay <= 0) ? 0.02 : 0;
            this.m_healthBar.pos(this.m_animation.x - ((this.m_animation.width * this.m_animation.scaleX) / 2) - 10, (this.m_animation.y - (this.m_animation.height * this.m_animation.scaleY) / 2) - 20);
            this.m_healthBar.value = this.m_health / this.m_maxHealth;
        }), 10);
    }
    private bloodSplitEffect(enemy: Laya.Sprite) {
        let bloodEffect: Laya.Animation = new Laya.Animation();
        bloodEffect.scaleX = 2;
        bloodEffect.scaleY = 2;
        let colorMat: Array<number> =
            [
                2, 0, 0, 0, -100, //R
                0, 1, 0, 0, -100, //G
                0, 0, 1, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ff0028", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);

        bloodEffect.filters = [glowFilter, colorFilter];
        bloodEffect.pos(enemy.x - 500, enemy.y - 500 + 30);
        bloodEffect.source = "comp/NewBlood/Blood_0000.png,comp/NewBlood/Blood_0001.png,comp/NewBlood/Blood_0002.png,comp/NewBlood/Blood_0003.png,comp/NewBlood/Blood_0004.png,comp/NewBlood/Blood_0005.png,comp/NewBlood/Blood_0006.png,comp/NewBlood/Blood_0007.png";
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
        if (this.m_animation.destroyed) return;

        this.pursuitPlayer();
        this.m_atkTimer = (this.m_atkTimer > 0) ? (this.m_atkTimer - 1) : this.m_atkTimer
        // console.log(this.m_atkTimer);

        if (this.playerRangeCheck(this.m_attackRange * 2)) {
            this.tryAttack();
        }
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
        // this.m_animation.skewY = (this.m_moveVelocity["Vx"] > 0) ? 0 : 180;
        let rightSide: boolean = (this.m_player.x - this.m_animation.x) > 0;
        this.m_animation.skewY = rightSide ? 0 : 180;
        this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false
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
                this.m_animation.x - 3 * this.m_animation.width / 2 - 80, this.m_animation.y - this.m_animation.height / 2,//9/15更改
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
                let victim = Laya.stage.getChildByName("Player") as Laya.Animation;
                // console.log(victim);
                console.log(col);


                if (victim.alpha != 1) return;
                Laya.Tween.to(victim, { alpha: 0.3 }, 350, Laya.Ease.linearInOut,
                    Laya.Handler.create(this, () => { victim.alpha = 1; }));

            }
        };
        atkBoxCollider.isSensor = true;
        atkCircleRigid.gravityScale = 0;
        this.updateAnimation(this.m_state, EnemyStatus.attack);
        // this.m_animation.skew
        // atkCircle.graphics.drawRect(0, 0, 100, 100, "red", "red", 1);
        Laya.stage.addChild(atkCircle);

        this.m_atkTimer = 100;

        setTimeout(() => {
            atkCircle.destroy();
            atkCircle.destroyed = true;
        }, 100);
        setTimeout(() => {
            this.m_atkCd = true;
        }, 500);

        this.delayMove(0.3);
    }
    public delayMove(time: number): void {
        if (this.m_moveDelayValue > 0) {
            this.m_moveDelayValue += time;
        }
        else {
            this.m_moveDelayValue = time;
            this.m_moveDelayTimer = setInterval(() => {
                if (this.m_moveDelayValue <= 0) {
                    this.m_moveVelocity["Vx"] = 0;
                    clearInterval(this.m_moveDelayTimer);
                    this.m_moveDelayValue = 0;
                }
                this.m_moveDelayValue -= 0.1;
            }, 100)
        }
    }
    private applyMoveX(): void {
        if (this.m_moveDelayValue > 0 || this.m_animation.destroyed) return;
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
    private updateAnimation(from: EnemyStatus, to: EnemyStatus, onCallBack: () => void = null, force: boolean = false): void {
        if (this.m_state === to || this.m_animationChanging) return;
        this.m_state = to;
        // console.log(from, 'convert to ', to);
        switch (this.m_state) {
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
        if (typeof onCallBack === 'function')
            onCallBack();
    }
    public enemyInjuredColor(): void//0921新增
    {
        if (this.m_animation.destroyed) return;
        this.m_animation.alpha = 1;
        let colorMat: Array<number> =
            [
                4, 0, 0, 0, 10, //R
                0, 1, 0, 0, 10, //G
                0, 0, 4, 0, 10, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ef1ff8", 3, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [colorFilter, glowFilter];
        setTimeout(() => {
            this.m_animation.alpha = 1;
            this.m_animation.filters = null;
        }, 200);
    }
}
export class Normal extends VirtualEnemy {
    m_name = '普通敵人';
    m_health = 1000;
    m_armor = 100;
    m_speed = 2;
    m_tag = 'n';
    m_attackRange = 100;
    m_mdelay = 0.1;
}
export class Shield extends VirtualEnemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_tag = 's';
    m_attackRange = 100;
    m_mdelay = 0.05;
}

export default class EnemyHandler extends Laya.Script {
    public static enemyIndex: number = 0;
    public static enemyPool = [];

    public static generator(player: Laya.Animation, enemyType: number, spawnPoint: number): VirtualEnemy {
        let enemy: VirtualEnemy = this.decideEnemyType(enemyType);
        let id: string = enemy.m_tag + String(++this.enemyIndex);

        enemy.spawn(player, id);

        this.enemyPool.push({ '_id': id, '_ent': enemy });
        this.updateEnemies();

        return enemy;
    }
    private static decideEnemyType(enemyType: number) {
        switch (enemyType) {
            case 1: return new Normal();
            case 2: return new Shield();
            default: return new Normal();
        };
    }
    private static updateEnemies(): any {
        return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
    }
    public static getEnemiesCount(): number {
        return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
    }
    public static getEnemyByLabel(label: string): VirtualEnemy {
        return this.enemyPool.filter(data => data._id === label)[0]['_ent'] as VirtualEnemy;
    }
}