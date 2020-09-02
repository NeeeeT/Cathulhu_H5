abstract class Skill extends Laya.Script{
    abstract m_name: string;
    abstract m_damage: number;
    abstract m_cost: number;
    abstract m_id: number;

    m_sprite: Laya.Sprite;
    m_rigidbody: Laya.RigidBody;
    m_collider: Laya.BoxCollider | Laya.CircleCollider | Laya.ChainCollider;

    skillUse(): void{
    }
    skillAttack(damage: number): void{
    }
}

class SkillSpike extends Skill{
    m_name = '突刺斬';
    m_damage = 100;
    m_cost = 0;
    m_id = 1;
}