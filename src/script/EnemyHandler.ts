import { EnemyNormal, EnemyShield } from "./EnemyManager";
import CharacterController from "./CharacterController";

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

        if (critical) enemy.m_animation.x--;
    }
    private static setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    private static damageTextEffect(enemy: EnemyType, amount: number, critical: boolean): void {
        let damageText = new Laya.Text();
        let soundNum: number;

        damageText.pos((enemy.m_animation.x - enemy.m_animation.width / 2) - 20, (enemy.m_animation.y - enemy.m_animation.height) - 110);
        damageText.bold = true;
        damageText.align = "left";
        damageText.alpha = 1;

        damageText.fontSize = critical ? 40 : 16;
        damageText.color = critical ? 'orange' : "white";
        damageText.text = String(amount);
        damageText.font = "opensans-bold";
        soundNum = critical ? 0 : 1;
        this.setSound(0.1, "Audio/EnemyHurt/EnemyHurt" + soundNum + ".wav", 1);//loop:0為循環播放
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