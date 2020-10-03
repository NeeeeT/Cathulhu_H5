import EnemyHandler, { VirtualEnemy } from "./EnemyHandler"
import { VirtualSkill } from "./SkillManager";

export class Slam extends VirtualSkill{
    m_name = '猛擊';
    m_damage = 125;
    m_cost = 0;
    m_id = 2;
    m_cd = 1;
    m_injuredEnemy: VirtualEnemy[] = [];

    cast(owner: any, position: object):void{
        if(!this.m_canUse) return;

        let rightSide: boolean = owner.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 350;
        this.m_animation.height = 200;
        this.m_animation.scaleX = 2;
        this.m_animation.scaleY = 2;
        this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
        //動畫位置需要再調整

        this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        let offsetX: number = rightSide ? position['x'] + 65: position['x'] - this.m_animation.width - 65;
        let offsetY: number = position['y'] - this.m_animation.height - 70;
        let offsetInterval: number = 40;
        let rangeY: number = 0;

        this.m_canUse = false;
        this.m_injuredEnemy = [];

        // Laya.stage.graphics.drawRect(offsetX, offsetY, this.m_animation.width, this.m_animation.height, 'yellow', 'yellow');

        let timer = setInterval(()=>{
            if(rangeY > offsetInterval){
                console.log('Stopped');
                clearInterval(timer);
            }
            offsetY += rangeY;
            Laya.stage.graphics.drawRect(offsetX, offsetY, this.m_animation.width, this.m_animation.height, 'red', 'red');
            this.attackRangeCheck(owner, {
                "x0": offsetX,
                "x1": offsetX + this.m_animation.width,
                "y0": offsetY,
                "y1": offsetY + this.m_animation.height,
            })
            rangeY += 5;
            
        }, 100);
        setTimeout(()=>{
            this.m_canUse = true;
            Laya.stage.graphics.clear();
        }, this.m_cd*1000);
    }
    attackRangeCheck(owner: any, pos:object): void{
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true && this.m_injuredEnemy.indexOf(data._id) === -1));
        enemyFound.forEach((e) => {
          e._ent.delayMove(0.3);
          e._ent.takeDamage(this.m_damage);
          this.m_injuredEnemy.push(e._id);
          console.log(this.m_injuredEnemy);
        });
      }
}