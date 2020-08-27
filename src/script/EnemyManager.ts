abstract class Enemy extends Laya.Script {
    m_name: string = '';
    m_health: number = 1000;
    m_armor: number = 0;
    m_speed: number = 3;
    m_imgSrc: string = '';
    m_id: number = -1;

    sprite: Laya.Sprite;
    collider: Laya.BoxCollider;
    rigidbody: Laya.RigidBody;

    spawn(player: Laya.Sprite): void {
        this.sprite = new Laya.Sprite();

        this.sprite.pos(player.x - 170, player.y - (player.height / 2));
        this.sprite.width = player.width * 2 / 3;
        this.sprite.height = player.height;
        this.sprite.loadImage(this.m_imgSrc);

        this.collider = this.sprite.addComponent(Laya.BoxCollider);
        this.rigidbody = this.sprite.addComponent(Laya.RigidBody);

        // this.collider.isSensor = true;
        this.collider.width = this.sprite.width;
        this.collider.height = this.sprite.height
        this.rigidbody.allowRotation = false;

        Laya.stage.addChild(this.sprite);
        this.showHealth(this.sprite);
    };
    destroy(): void {
        this.sprite.destroy();
    };
    setHealth(amount: number): void {
        this.m_health = amount;
        if (this.m_health <= 0) {
            this.bloodSplitEffect(this.sprite);
            this.sprite.destroy();
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
        });
        Laya.stage.addChild(bloodEffect);
        bloodEffect.play();
    }
}
export class EnemyNormal extends Enemy {
    m_name = '普通敵人';
    m_health = 1000;
    m_speed = 2;
    m_imgSrc = "comp/monster_normal.png";

}
export class EnemyShield extends Enemy {
    m_name = '裝甲敵人';
    m_armor = 500;
    m_health = 1500;
    m_speed = 1;
    m_imgSrc = '';
}