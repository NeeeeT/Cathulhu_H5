abstract class Enemy extends Laya.Script{
    abstract m_name: string = '';
    abstract m_health: number = 1000;
    abstract m_armor: number = 0;
    abstract m_speed: number = 3;
    abstract m_imgSrc: string = '';
    abstract m_tag: string = '';

    m_maxHealth: number;
    m_sprite: Laya.Sprite;
    collider: Laya.BoxCollider;
    rigidbody: Laya.RigidBody;
    m_script:Laya.Script;
    m_player:Laya.Sprite;

    spawn(player: Laya.Sprite, id: string): void {
        this.m_maxHealth = this.m_health;

        this.m_sprite = new Laya.Sprite();
        this.m_sprite.loadImage(this.m_imgSrc);
        this.m_sprite.pos(player.x - 170, player.y - (player.height / 2));
        this.m_sprite.width = player.width * 2 / 3;
        this.m_sprite.height = player.height;

        this.collider = this.m_sprite.addComponent(Laya.BoxCollider);
        this.rigidbody = this.m_sprite.addComponent(Laya.RigidBody);
        this.m_script = this.m_sprite.addComponent(Laya.Script);
        this.m_script.onUpdate = ()=>{this.pursuitPlayer()}
        

        this.collider.width = this.m_sprite.width;
        this.collider.height = this.m_sprite.height
        this.collider.label = id;
        this.collider.tag = 'Enemy';
        this.rigidbody.allowRotation = false;

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
        this.collider.label = index;
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
    public pursuitPlayer(){
        let dir:number = this.m_player.x - this.m_sprite.x;
        if(dir > 0){
            this.m_sprite.x += this.m_speed;
        }else if(dir < 0){
            this.m_sprite.x += -this.m_speed;
        }
    }
    private playerRangeCheck(){
        let dist:number = 0;
    }
    private attack(){
    }
}
export class EnemyNormal extends Enemy{
    m_name = '普通敵人';
    m_health = 1000;
    m_armor = 100;
    m_speed = 2;
    m_imgSrc = "comp/monster_normal.png";
    m_tag = 'n';
}
export class EnemyShield extends Enemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_imgSrc = 'comp/monster_shield.png';
    m_tag = 's';
}