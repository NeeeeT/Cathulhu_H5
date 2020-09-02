import { EnemyNormal, EnemyShield } from "./EnemyManager";

type EnemyType = EnemyNormal | EnemyShield;//會使用到的敵人類型

export default class EnemyHandler extends Laya.Script {
    public static enemyIndex: number = 0;
    public static enemyPool = [];

    public static generator(player: Laya.Sprite, enemyType: number, spawnPoint: number): EnemyType {
        let enemy: EnemyType = this.decideEnemyType(enemyType);
        let id: string = enemy.m_tag + String(++this.enemyIndex);

        enemy.spawn(player, id);

        this.enemyPool.push({ '_id': id, '_ent': enemy });
        this.updateEnemies();

        console.log(this.enemyPool);

        return enemy;
    }
    private static decideEnemyType(enemyType: number) {
        switch (enemyType) {
            case 1: return new EnemyNormal();
            case 2: return new EnemyShield();
            default: return new EnemyNormal();
        };
    }
    private static updateEnemies(): any {
        return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
    }
    public static takeDamage(enemy: EnemyType, amount: number) {
        let fakeNum = Math.random() * 100;
        let critical: boolean = (fakeNum <= 50);

        amount *= critical ? 5 : 1;
        enemy.setHealth(enemy.getHealth() - amount);

        this.damageTextEffect(enemy, amount, critical);
    }
    private static damageTextEffect(enemy: EnemyType, amount: number, critical: boolean): void {
        let damageText = new Laya.Text();
        let soundNum: number = Math.floor(Math.random() * 2);

        damageText.pos((enemy.m_sprite.x - enemy.m_sprite.width / 2) + 45, (enemy.m_sprite.y - enemy.m_sprite.height) - 5);
        damageText.bold = true;
        damageText.align = "center";
        damageText.alpha = 1;

        damageText.fontSize = critical ? 40 : 16;
        damageText.color = critical ? "red" : "white";
        damageText.text = String(amount);
        damageText.font = "opensans-bold";

        Laya.SoundManager.playSound("Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);
        Laya.stage.addChild(damageText);

        Laya.Tween.to(damageText, { alpha: 0.5, fontSize: damageText.fontSize + 30, }, 200, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(damageText, { alpha: 0, fontSize: damageText.fontSize - 13, y: damageText.y - 50 }, 350, Laya.Ease.linearInOut, null, 0);
            }), 0);

        setTimeout((() => {
            if (damageText.destroyed) return;

            damageText.destroy();
            damageText.destroyed = true;
        }), 550);
    }
    public static getEnemiesCount(): number {
        return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
    }
    public static getEnemyByLabel(label: string): EnemyType {
        return this.enemyPool.filter(data => data._id === label)[0]['_ent'] as EnemyType;;
    }
}