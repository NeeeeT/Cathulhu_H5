import CharacterInit from "./CharacterInit";
import Character from "./CharacterManager";
import EnemyHandler from "./EnemyHandler";

abstract class Skill extends Laya.Script{
    abstract m_name: string;
    abstract m_damage: number;
    abstract m_cost: number;
    abstract m_id: number;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_collider;

    cast(position: object): void{ 
    }
}

export class SkillSpike extends Skill{
    m_name = '突進斬';
    m_damage = 100;
    m_cost = 0;
    m_id = 1;

    cast(position: object):void{
        let player: Character = CharacterInit.playerEnt;
        let rightSide: boolean = player.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 328;
        this.m_animation.height = 130;
        this.m_animation.pos(rightSide ? position['x'] + 100 : position['x'] - 150, position['y']);
        this.m_animation.source = "Skill/spike.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 100;

        this.m_animation.skewY = rightSide ? 0 : 180;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);

        this.m_script.onTriggerEnter = (col:Laya.BoxCollider) => {
            if(col.tag === 'Enemy'){
                let victim = EnemyHandler.getEnemyByLabel(col.label)
                victim.takeDamage(777);
            }
        }
        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.isSensor = true;

        this.m_rigidbody.gravityScale = 0;
        this.m_rigidbody.allowRotation = false;

        this.m_rigidbody.category = 2;
        this.m_rigidbody.mask = 8;

        Laya.stage.addChild(this.m_animation);

        setTimeout(() => {
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
        }, 200);
        player.m_animation.x += this.m_animation.width * (player.m_isFacingRight ? 1 : -1);
    }
}