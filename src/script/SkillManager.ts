import EnemyHandler from "./EnemyHandler";

export abstract class VirtualSkill extends Laya.Script{
    /** 技能名稱 */
    abstract m_name: string;
    /** 技能傷害 */
    abstract m_damage: number;
    /** 技能獻祭值消耗 */
    abstract m_cost: number;
    /** 技能ID */
    abstract m_id: number;
    /** 技能冷卻時間 */
    abstract m_cd: number;
    
    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_collider: Laya.BoxCollider;

    m_canUse: boolean = true;

    cast(position: object): void{ 
    };
    attackRangeCheck(pos:object, type: string): void{
        let enemy = EnemyHandler.enemyPool;
        switch (type) {
          case 'rect':
            let enemyFound = enemy.filter(data => this.rectIntersect(pos, data._ent.m_rectangle) === true);
            enemyFound.forEach((e) => {
              e._ent.takeDamage(this.m_damage);
            });
            break;
          default:
            break;
        }
    }
    rectIntersect(r1, r2): boolean{
        let aLeftOfB:boolean = r1.x1 < r2.x0;
        let aRightOfB:boolean = r1.x0 > r2.x1;
        let aAboveB:boolean = r1.y0 > r2.y1;
        let aBelowB:boolean = r1.y1 < r2.y0;
        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }
}
// export class Slam extends VirtualSkill{
// }