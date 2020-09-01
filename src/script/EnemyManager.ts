abstract class Enemy extends Laya.Script {
    abstract m_name: string = '';
    abstract m_health: number = 1000;
    abstract m_armor: number = 0;
    abstract m_speed: number = 3;
    abstract m_imgSrc: string = '';
    abstract m_tag: string = '';

    m_moveVelocity: object = { "Vx": 0, "Vy": 0 };
    m_attackRange: number = 100;
    m_atkCd: boolean = true;

    m_maxHealth: number;
    m_sprite: Laya.Sprite;
    m_collider: Laya.BoxCollider;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_player: Laya.Sprite;

    m_isFacingRight: boolean = true;

    spawn(player: Laya.Sprite, id: string): void {
        this.m_sprite = new Laya.Sprite();
        this.m_sprite.loadImage(this.m_imgSrc);
        this.m_sprite.pos(player.x - 170, player.y - (player.height / 2));
        this.m_sprite.width = player.width * 2 / 3;
        this.m_sprite.height = player.height;
        this.m_sprite.pivotX = this.m_sprite.width / 2;
        this.m_sprite.pivotY = this.m_sprite.height / 2;
        this.m_maxHealth = this.m_health;

        this.m_collider = this.m_sprite.addComponent(Laya.BoxCollider);
        this.m_rigidbody = this.m_sprite.addComponent(Laya.RigidBody);
        this.m_script = this.m_sprite.addComponent(Laya.Script);
        this.m_script.onUpdate = () => { this.pursuitPlayer() }


        this.m_collider.width = this.m_sprite.width;
        this.m_collider.height = this.m_sprite.height
        this.m_collider.label = id;
        this.m_collider.tag = 'Enemy';
        this.m_rigidbody.allowRotation = false;

        this.m_player = player;

        Laya.stage.addChild(this.m_sprite);
        this.showHealth(this.m_sprite);
    };
    destroy(): void {
        this.m_sprite.destroy();
    };
    setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            this.bloodSplitEffect(this.m_sprite);
            this.m_sprite.destroy();
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

    private showHealth(enemy: Laya.Sprite) {
        let healthBar = new Laya.ProgressBar();
        healthBar.pos(enemy.x, enemy.y - 10);
        healthBar.height = 10;
        healthBar.width = 90;
        healthBar.skin = "comp/progress.png";
        healthBar.value = 1;
        Laya.stage.addChild(healthBar);

        setInterval((() => {
            if (enemy.destroyed) {
                healthBar.destroy();
                healthBar.destroyed = true;
                return;
            }
            healthBar.pos(enemy.x, enemy.y - 10);
            healthBar.value = this.m_health / this.m_maxHealth;
        }), 30);
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
    public pursuitPlayer() {
        let dir: number = this.m_player.x - this.m_sprite.x;
        this.m_sprite.skewY = (this.m_moveVelocity["Vx"] > 0) ? 0 : 180;
        this.m_isFacingRight = (this.m_moveVelocity["Vx"] > 0) ? true : false
        if (Math.abs(this.m_moveVelocity["Vx"]) <= this.m_speed) {
            this.m_moveVelocity["Vx"] += (dir > 0) ? 0.03 : -0.03;
        } else {
            this.m_moveVelocity["Vx"] = (dir > 0) ? this.m_speed : -this.m_speed;
        }

        console.log(this.m_moveVelocity["Vx"]);
        this.applyMoveX();
    }
    private playerRangeCheck(detectRange: number): boolean {
        //取得角色與敵人的最短路徑長度
        let dist: number = Math.sqrt(Math.pow((this.m_player.x - this.m_sprite.x), 2) + Math.pow((this.m_player.y - this.m_sprite.y), 2));
        return (dist <= detectRange) ? true : false;
    }
    private attack() {
        if (this.m_atkCd) {
            this.m_atkCd = false;
            // this.rigidbody.setVelocity({x:0, y:this.rigidbody.linearVelocity.y});
            this.m_moveVelocity["Vx"] = 0;
            let atkCircle = new Laya.Sprite();
            let x_offset: number = this.m_isFacingRight
                ? (this.m_sprite.width * 1) / 2 + 3
                : (this.m_sprite.width * 5) / 4 + 3;
            if (this.m_isFacingRight) {
                atkCircle.pos(
                    // this.sprite.x + x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
                    this.m_sprite.x + this.m_sprite.width / 2, this.m_sprite.y - this.m_sprite.height / 2
                );
            } else {
                atkCircle.pos(
                    // this.sprite.x - x_offset, this.sprite.y - (this.sprite.height * 1) / 2 + (this.sprite.height * 1) / 8
                    this.m_sprite.x - 3 * this.m_sprite.width / 2, this.m_sprite.y - this.m_sprite.height / 2
                );
            }
            let atkBoxCollider: Laya.BoxCollider = atkCircle.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
            let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(Laya.RigidBody) as Laya.RigidBody;
            let atkCircleScript: Laya.Script = atkCircle.addComponent(Laya.Script) as Laya.Script;

            atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;

            atkCircleScript.onTriggerEnter = function (col: Laya.BoxCollider) {
                //攻擊擊中判定
                if (col.label === 'Player') {
                    console.log("打到玩家了");

                    //     let eh = EnemyHandler;//敵人控制器
                    //     let victim = eh.getEnemyByLabel(col.label);
                    //     eh.takeDamage(victim, 600);
                }
            };
            atkBoxCollider.isSensor = true;
            atkCircleRigid.gravityScale = 0;

            atkCircle.graphics.drawRect(0, 0, 100, 100, "red", "red", 1);
            Laya.stage.addChild(atkCircle);

            setTimeout(() => {
                atkCircle.destroy();
                atkCircle.destroyed = true;
            }, 100);

            setTimeout(() => {
                this.m_atkCd = true;
            }, 500);
        }
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
}
export class EnemyNormal extends Enemy {
    m_name = '普通敵人';
    m_health = 1000;
    m_armor = 100;
    m_speed = 2;
    m_imgSrc = "comp/monster_normal.png";
    m_tag = 'n';
    m_attackRange = 100;
}
export class EnemyShield extends Enemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_imgSrc = 'comp/monster_shield.png';
    m_tag = 's';
    m_attackRange = 100;
}