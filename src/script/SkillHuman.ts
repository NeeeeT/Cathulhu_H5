import { CharacterStatus } from "./CharacterStatus";
import EnemyHandler from "./EnemyHandler";
import { VirtualSkill } from "./SkillManager";

export class Spike extends VirtualSkill{
  m_name = '突進斬';
  m_damage = 111;
  m_cost = 0;
  m_id = 1;
  m_cd = 3;
    
  /** 技能衝刺的持續時間 */
  m_lastTime: number = 0.2;
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
      this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 195);
      
      let offsetX: number = rightSide ? position['x'] : position['x'] - this.m_animation.width;
      let offsetY: number = position['y'] - this.m_animation.height/2 + 20;

      this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
      this.m_animation.autoPlay = true;
      this.m_animation.interval = 20;

      this.m_canUse = false;
      this.castRoar(position);

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
      
      owner.delayMove(this.m_lastTime);
      owner.m_rigidbody.setVelocity({x: rightSide ? this.m_spikeVec : -this.m_spikeVec, y: 0});

      owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 130);
      
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
    let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true));
    enemyFound.forEach((e) => {
      if(e._ent.m_animation.destroyed === true) return;

      e._ent.takeDamage(this.m_damage);
      e._ent.delayMove(0.1);

      // if(e._ent.m_health - this.m_damage > 0){
      //   e._ent.m_rigidbody.setVelocity({
      //     "x": rightSide ? 25:-25,
      //     "y": 0,
      //   });
      // }
    });
  }
}

export class Behead extends VirtualSkill{
  m_name = '攻其不備';
  m_damage = 99999;
  m_cost = 0;
  m_id = 1;
  m_cd = 3;
    
  /** 技能的準備時間 */
  m_preTime: number = 1.5;

  cast(owner: any, position: object):void{
      if(!this.m_canUse) return;

      let rightSide: boolean = owner.m_isFacingRight;

      this.m_animation = new Laya.Animation()
      this.m_animation.width = owner.m_animation.width;
      this.m_animation.height = owner.m_animation.height;
      this.m_animation.scaleX = 1;
      this.m_animation.scaleY = 1;
      this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 195);
      
      let offsetX: number = rightSide ? position['x'] : position['x'] - this.m_animation.width;
      let offsetY: number = position['y'] - this.m_animation.height/2 + 20;

      this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
      this.m_animation.autoPlay = true;
      this.m_animation.interval = 20;

      this.m_canUse = false;
      this.castRoar(position);
      
      owner.delayMove(this.m_preTime);
      owner.m_rigidbody.setVelocity({x:0,y:0});
      owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false)
      // owner.

      
      Laya.stage.addChild(this.m_animation);
      
      setTimeout(()=>{
        this.attackRangeCheck(owner,
        {
            "x0": offsetX,
            "x1": offsetX + this.m_animation.width,
            "y0": offsetY,
            "y1": offsetY + this.m_animation.height,
        });
      }, this.m_preTime*1000);

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
    // let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true));
    
    let targetEnemy: number = Math.floor(Math.random() * enemy.length);
    // let rightSide: boolean = owner.m_isFacingRight;

    if(enemy.length === 0){
      console.log('目前沒有敵人，無法使用 ', this.m_name);
      return;
    }

    console.log('攻擊標記(目前隨機)敵人: ', targetEnemy, enemy[targetEnemy]);
    owner.m_animation.x = enemy[targetEnemy]._ent.m_animation.x + (enemy[targetEnemy]._ent.m_animation.skewY === 0 ? 50 : -50);
    owner.m_animation.y = enemy[targetEnemy]._ent.m_animation.y - 70;
    enemy[targetEnemy]._ent.takeDamage(this.m_damage);
  }
}