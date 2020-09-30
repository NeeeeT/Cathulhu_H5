import * as Enemy from "./EnemyManager";

export default class EnemyHandler extends Laya.Script {
    public static enemyIndex: number = 0;
    public static enemyPool = [];

    public static generator(player: Laya.Animation, enemyType: number, spawnPoint: number): Enemy.VirtualEnemy{
        let enemy: Enemy.VirtualEnemy = this.decideEnemyType(enemyType);
        let id: string = enemy.m_tag + String(++this.enemyIndex);

        enemy.spawn(player, id);

        this.enemyPool.push({ '_id': id, '_ent': enemy });
        this.updateEnemies();

        return enemy;
    }
    private static decideEnemyType(enemyType: number) {
        switch (enemyType) {
            case 1: return new Enemy.Normal(); 
            case 2: return new Enemy.Shield();
            default: return new Enemy.Normal();
        };
    }
    private static updateEnemies(): any {
        return this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null);
    }
    public static getEnemiesCount(): number {
        return (this.enemyPool = this.enemyPool.filter(data => data._ent.m_collider.owner != null)).length;
    }
    public static getEnemyByLabel(label: string): Enemy.VirtualEnemy {
        return this.enemyPool.filter(data => data._id === label)[0]['_ent'] as Enemy.VirtualEnemy;
    }
}