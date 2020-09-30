import CharacterInit from "./CharacterInit";
import Character from "./CharacterManager";
import EnemyHandler from "./EnemyHandler";

/** (虛擬)技能基礎設定 */
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
    }
}

export class Spike extends VirtualSkill{
    m_name = '突進斬';
    m_damage = 1;
    m_cost = 0;
    m_id = 1;
    m_cd = 3;

    cast(position: object):void{
        if(!this.m_canUse) return;

        let player: Character = CharacterInit.playerEnt;
        let rightSide: boolean = player.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 400;
        this.m_animation.height = 200;
        this.m_animation.scaleX = 2;
        this.m_animation.scaleY = 2;
        this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
        this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        this.m_canUse = false;

        let colorMat: Array<number> =
        [
          2, 0, 0, 0, -100, //R
          0, 4, 0, 0, -100, //G
          0, 0, Math.floor(Math.random() * 2) + 1, 0, -100, //B
          0, 0, 0, 1, 0, //A
        ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [glowFilter,colorFilter];

        this.m_animation.skewY = rightSide ? 0 : 180;

        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_script = this.m_animation.addComponent(Laya.Script);

        this.m_script.onTriggerEnter = (col:Laya.BoxCollider) => {
            if(col.tag === 'Enemy'){
                let victim = EnemyHandler.getEnemyByLabel(col.label)
                // victim.enemyInjuredColor();//0921新增
                victim.takeDamage(this.m_damage);
            }
        }
        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.x = rightSide ? 100 : - 500;
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
        // let dash = setInterval(() => {
        //     player.m_playerVelocity["Vx"] += (player.m_isFacingRight ? 1 : -1);
        // }, 10)

        // setTimeout(() => {
        //     clearInterval(dash);
        // }, 200);
        player.m_animation.x += this.m_animation.width * (player.m_isFacingRight ? 0.5 : -0.5);

        setTimeout(()=>{
            this.m_canUse = true;
        }, this.m_cd*1000);
    }
}