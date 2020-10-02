import EnemyHandler from "./EnemyHandler";
import { VirtualSkill } from "./SkillManager";

export class Spike extends VirtualSkill{
  m_name = '突進斬';
  m_damage = 111;
  m_cost = 0;
  m_id = 1;
  m_cd = 3;
    
  /** 技能衝刺的持續時間 */
  m_lasTime: number = 0.2;
  /** 技能給予的衝量大小 */
  m_spikeVec: number = 55.0;

  cast(owner: any, position: object):void{
      if(!this.m_canUse) return;

      let rightSide: boolean = owner.m_isFacingRight;

      this.m_animation = new Laya.Animation()
      this.m_animation.width = 400;
      this.m_animation.height = 200;
      this.m_animation.scaleX = 2;
      this.m_animation.scaleY = 2;
      this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
      
      let offsetX: number = rightSide ? position['x'] : position['x'] - this.m_animation.width;
      let offsetY: number = position['y'] - this.m_animation.height/2 + 20;

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
      
      owner.delayMove(this.m_lasTime);
      owner.m_rigidbody.setVelocity({x: rightSide ? this.m_spikeVec : -this.m_spikeVec, y: 0});
      
      this.attackRangeCheck(owner,
      {
          "x0": offsetX,
          "x1": offsetX + this.m_animation.width,
          "y0": offsetY,
          "y1": offsetY + this.m_animation.height,
      });

      Laya.stage.addChild(this.m_animation);

      setTimeout(() => {
          this.m_animation.destroy();
          this.m_animation.destroyed = true;
      }, 200);
      setTimeout(()=>{
          this.m_canUse = true;
      }, this.m_cd*1000);
  }
  attackRangeCheck(owner: any, pos:object): void{
    let enemy = EnemyHandler.enemyPool;
    let rightSide: boolean = owner.m_isFacingRight;
    let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true && data._ent.m_rigidbody !== null));
    enemyFound.forEach((e) => {
      if(e._ent.m_rigidbody === null || e === null || e._ent === null) {
        console.log("ERROR PREVENT!!!");
        return;
      }
      // e._ent.m_rigidbody.setVelocity({
      //   x: rightSide ? 25:-25,
      //   y: 0,
      // })
      e._ent.delayMove(0.1);
      e._ent.takeDamage(this.m_damage);
      console.log(e);
    });
  }
}