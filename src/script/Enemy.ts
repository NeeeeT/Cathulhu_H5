interface IEnemy extends Laya.Script {
    // 定義敵人介面
    m_name: string;
    m_armor: number;
    m_health: number;
    m_speed: number;
    m_id: number;

    sprite: Laya.Sprite;
    collider: Laya.BoxCollider;

    spawn(player: Laya.Sprite): void;
    destroy(): void;

    setHealth(amount: number): void;
    getHealth(): number;

    setArmor(amount: number): void;
    getArmor(): number;

    setSpeed(amount: number): void;
    getSpeed(): number;

    setLabel(index: string): void;
}
export class EnemyNormal extends Laya.Script implements IEnemy {
    // 實作敵人介面 -> 普通敵人
    m_name = '普通敵人';
    m_armor = 0;
    m_health = 1000;
    m_speed = 2;
    m_id = 0;

    sprite: Laya.Sprite;
    collider: Laya.BoxCollider;

    constructor() {
        super();
    }
    spawn(player: Laya.Sprite): void {
        //動態生成sprite
        this.sprite = new Laya.Sprite();

        this.sprite.pos(player.x - 170, player.y - (player.height / 2));
        this.sprite.width = player.width * 2 / 3;
        this.sprite.height = player.height;
        this.sprite.loadImage("comp/monster_normal.png");

        this.collider = this.sprite.addComponent(Laya.BoxCollider);
        let enemyNormalRig = this.sprite.addComponent(Laya.RigidBody);

        this.collider.width = this.sprite.width;
        this.collider.height = this.sprite.height
        enemyNormalRig.allowRotation = false;

        Laya.stage.addChild(this.sprite);
        this.showHealth(this.sprite);
        console.log('普通敵人生成!!!');
        console.log(this.sprite.x);
        console.log(this.sprite.y);
    }
    showHealth(enemy: Laya.Sprite) {
        let enemyHealthText = new Laya.Text();
        enemyHealthText.pos(enemy.x, enemy.y - 40);
        enemyHealthText.width = 100;
        enemyHealthText.height = 60;
        enemyHealthText.color = "#efefef";
        enemyHealthText.fontSize = 40;
        enemyHealthText.text = '' + String(this.m_health);

        Laya.stage.addChild(enemyHealthText);

        setInterval((() => {
            if (enemy.destroyed) {
                enemyHealthText.destroy();
                enemyHealthText.destroyed = false;
                return;
            }
            enemyHealthText.pos(enemy.x, enemy.y - 40);
            enemyHealthText.text = '' + String(this.m_health);
        }), 30);
    }
    setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            this.createEffect(this.sprite);
            this.sprite.destroy();
        }
    }
    private createEffect(enemy: Laya.Sprite) {
        let bloodEffect: Laya.Animation = new Laya.Animation();
        //濾鏡
        let colorMat: Array<number> =
            [
                2, 0, 0, 0, -100, //R
                0, 1, 0, 0, -100, //G
                0, 0, 1, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#fd081c", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        bloodEffect.filters = [colorFilter, glowFilter];
        //濾鏡
        bloodEffect.pos(enemy.x - 250, enemy.y - 250 + 30);
        bloodEffect.source =
            "comp/Blood/Blood_0000.png,comp/Blood/Blood_0001.png,comp/Blood/Blood_0002.png,comp/Blood/Blood_0003.png,comp/Blood/Blood_0004.png,comp/Blood/Blood_0005.png,comp/Blood/Blood_0006.png,comp/Blood/Blood_0007.png,comp/Blood/Blood_0008.png,comp/Blood/Blood_0009.png,comp/Blood/Blood_0010.png,comp/Blood/Blood_0011.png,comp/Blood/Blood_0012.png,comp/Blood/Blood_0013.png,comp/Blood/Blood_0014.png";
        bloodEffect.on(Laya.Event.COMPLETE, this, function () {
            bloodEffect.destroy();
        });
        Laya.stage.addChild(bloodEffect);
        bloodEffect.play();
    }
    setArmor(amount: number): void { this.m_armor = amount; }
    setSpeed(amount: number): void { this.m_speed = amount; }
    getHealth(): number { return this.m_health; }
    getArmor(): number { return this.m_armor; }
    getSpeed(): number { return this.m_speed; }
    setLabel(index: string): void { this.collider.label = index };
    destroy(): void { this.sprite.destroy() };
}
export class EnemyShield extends Laya.Script implements IEnemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_id = 0;

    sprite: Laya.Sprite;
    collider: Laya.BoxCollider;

    constructor() {
        super();
    }
    spawn(): void { };
    destroy(): void { };
    setHealth(amount: number): void {
        if (this.m_health <= 0) {
            this.sprite.destroy();
            return;
        }
        this.m_health = amount;
    }
    setArmor(amount: number): void { this.m_armor = amount; }
    setSpeed(amount: number): void { this.m_speed = amount; }
    getHealth(): number { return this.m_health; }
    getArmor(): number { return this.m_armor; }
    getSpeed(): number { return this.m_speed; }
    setLabel(index: string): void { this.collider.label = index };
}