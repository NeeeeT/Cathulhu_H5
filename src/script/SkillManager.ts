abstract class Skill extends Laya.Script{
    abstract m_name: string;
    abstract m_damage: number;
    abstract m_cost: number;
    abstract m_id: number;
    abstract m_cd: number;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_collider;

    m_canUse: boolean = true;

    cast(position: object): void{ 
    }
    takeDamage(damage: number): void{
    }
}

export class SkillSpike extends Skill{
    m_name = '突進斬';
    m_damage = 100;
    m_cost = 0;
    m_id = 1;
    m_cd = 2;

    cast(position: object):void{
        if(!this.m_canUse) return;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 328;
        this.m_animation.height = 130;
        this.m_animation.pos(position['x'], position['y']);
        this.m_animation.source = "Skill/spike.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 100;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);

        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;

        this.m_rigidbody.gravityScale = 0;
        this.m_rigidbody.allowRotation = false;

        this.m_canUse = false;

        Laya.stage.addChild(this.m_animation);
        

        setTimeout(() => {
            this.m_canUse = true;
        }, 3000);
    }
}