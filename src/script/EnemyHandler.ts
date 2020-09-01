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
            default: return new EnemyNormal()
        };
    }
    private static updateEnemies(): any {
        return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
    }
    public static takeDamage(enemy: EnemyType, amount: number) {
        let damageText = new Laya.Text();
        let x = new Number();
        x = Math.random() * 100;
        if (x <= 50) {
            amount *= 5;
            damageText.text = String(amount);
            damageText.pos((enemy.m_sprite.x - enemy.m_sprite.width / 2) + 45, (enemy.m_sprite.y - enemy.m_sprite.height) - 5);
            damageText.fontSize = 45;
            damageText.bold = true;
            damageText.align = "center";
            damageText.color = "red";
        }
        else {
            damageText.text = String(amount);
            damageText.pos((enemy.m_sprite.x - enemy.m_sprite.width / 2) + 20, (enemy.m_sprite.y - enemy.m_sprite.height) - 5);
            damageText.fontSize = 25;
            damageText.bold = false;
            damageText.align = "center";
            damageText.color = "white";
        }
        enemy.setHealth(enemy.getHealth() - amount);
        Laya.stage.addChild(damageText);

        setInterval((() => {
            if (damageText.destroyed) return;

            damageText.pos((enemy.m_sprite.x - enemy.m_sprite.width / 2) + 20, (enemy.m_sprite.y - enemy.m_sprite.height) - 5);
            damageText.align = "center";
        }), 10);
        setTimeout((() => {
            if (damageText.destroyed) return;

            damageText.destroy();
            damageText.destroyed = true;
        }), 500);
    }
    public static getEnemiesCount(): number {
        return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
    }
    public static getEnemyByLabel(label: string): EnemyType {
        return this.enemyPool.filter(data => data._id === label)[0]['_ent'] as EnemyType;;
    }
}