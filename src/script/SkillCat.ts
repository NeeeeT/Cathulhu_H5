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
        this.castRoar(position);
        this.m_injuredEnemy = [];//暫時用來記憶被此次技能打中的敵人，並忽略此攻擊

        // Laya.stage.graphics.drawRect(offsetX, offsetY, this.m_animation.width, this.m_animation.height, 'yellow', 'yellow');
        // 攻擊範圍畫圖

        let timer = setInterval(()=>{
            if(rangeY > offsetInterval){
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
        });
    }
}

export class BlackHole extends VirtualSkill{
    m_name = '深淵侵蝕';
    m_damage = 130;
    m_dotDamage = 7;
    m_cost = 0;
    m_id = 2;
    m_cd = 3;
    m_lastTime = 5;
    m_radius = 100;//黑洞半徑

    cast(owner: any, position: object):void{
        if(!this.m_canUse) return;

        let rightSide: boolean = owner.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = this.m_animation.height = this.m_radius;
        this.m_animation.scaleX = 2;
        this.m_animation.scaleY = 2;
        this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
        //動畫位置需要再調整

        this.m_animation.source = "comp/Spike/Spike_0001.png,comp/Spike/Spike_0002.png,comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        let offsetX: number = rightSide ? position['x'] + 140: position['x'] - this.m_animation.width - 65;
        let offsetY: number = position['y'] - this.m_animation.height/2;

        this.m_canUse = false;
        this.castRoar(position);

        Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius, 'black', 'white', 1);
        Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius + 100, 'black', 'white', 1);

        // this.attackRangeCheck(owner, {
        //     "x": offsetX,
        //     "y": offsetY,
        //     "r": this.m_radius,
        // }, this.m_damage)
        let count: number = 0;

        let timer = setInterval(()=>{
            if(count >= this.m_lastTime*1000){
                this.attackRangeCheck(owner,{
                    "x": offsetX,
                    "y": offsetY,
                    "r": this.m_radius, 
                }, this.m_damage);
                clearInterval(timer);
            }
            this.attractRangeCheck(owner, {
                "x": offsetX,
                "y": offsetY,
                "r": this.m_radius + 100,
            });
            this.attackRangeCheck(owner,{
                "x": offsetX,
                "y": offsetY,
                "r": this.m_radius + 100,
            }, this.m_dotDamage);
            count += 100;
        }, 100);

        setTimeout(()=>{
            Laya.stage.graphics.clear();
        }, this.m_lastTime*1000);
        setTimeout(()=>{
            this.m_canUse = true;
        }, this.m_cd*1000);
    }
    attractRangeCheck(owner: any, pos: object): void{
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            if(e._ent.m_animation.destroyed === true) return;
            
            // e._ent.delayMove(0.1);
            e._ent.m_rigidbody.setVelocity({
                "x": (pos['x'] - (e._ent.m_rectangle['x0'] + e._ent.m_animation.width/2)) * 0.25,
                "y": (pos['y'] - (e._ent.m_rectangle['y0'] + e._ent.m_animation.height/2)) * 0.25,
            });
        });
    }
    attackRangeCheck(owner: any, pos: object, dmg: number): void{
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            // e._ent.delayMove(0.3);
            e._ent.takeDamage(dmg);
        });
    }
}