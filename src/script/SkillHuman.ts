import CharacterInit from "./CharacterInit";
import { CharacterStatus } from "./CharacterStatus";
import EnemyHandler from "./EnemyHandler";
import { VirtualSkill } from "./SkillManager";
import ZOrderManager from "./ZOrderManager";

export class Spike extends VirtualSkill {
    m_name = '突進斬';
    m_info = '向前位移，並且擊退敵人';
    m_damage: number;
    m_cost = 30;
    m_id = 1;
    m_cd = 3;

    m_iconA = "UI/icon/spikeA.png";
    m_iconB = "UI/icon/spikeB.png";

    /** 技能衝刺的持續時間 */
    m_lastTime: number = 0.2;
    /** 技能給予的衝量大小 */
    m_spikeVec: number = 55.0;

    cast(owner: any, position: object, oathSystemCheck: boolean): void {
        if (!this.m_canUse) return;
        if (!oathSystemCheck) return;
        this.m_canUse = false;

        CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
        this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_spikeDmgMultiplier);
        let rightSide: boolean = owner.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 400;
        this.m_animation.height = 200;
        this.m_animation.scaleX = 1.2;
        this.m_animation.scaleY = 1.2;
        this.m_animation.interval = 35;
        this.m_animation.alpha = 0.45;
        this.m_animation.pos(rightSide ? position['x'] - 520 : position['x'] + 500, position['y'] - 300);

        let offsetX: number = rightSide ? position['x'] : position['x'] - this.m_animation.width;
        let offsetY: number = position['y'] - this.m_animation.height / 2 + 20;

        this.m_animation.source = "comp/Spike/Spike_0003.png,comp/Spike/Spike_0004.png,comp/Spike/Spike_0005.png,comp/Spike/Spike_0006.png,comp/Spike/Spike_0007.png,comp/Spike/Spike_0008.png";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        this.castRoar(position);

        let colorMat: Array<number> =
            [
                1, 1, 3, 0, -100, //R
                0, 2, 1, 0, -100, //G
                2, 0, 3, 0, -100, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);

        this.m_animation.filters = [colorFilter];
        this.m_animation.skewY = rightSide ? 0 : 180;

        owner.delayMove(this.m_lastTime);
        // owner.m_rigidbody.setVelocity({ x: rightSide ? this.m_spikeVec : -this.m_spikeVec, y: 0 });
        owner.m_rigidbody.linearVelocity = {x: rightSide?this.m_spikeVec:-this.m_spikeVec};

        owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 150);
        owner.hurtedEvent(2.0);

        this.attackRangeCheck(owner,
            {
                "x0": offsetX,
                "x1": offsetX + this.m_animation.width,
                "y0": offsetY,
                "y1": offsetY + this.m_animation.height,
            });

        Laya.stage.addChild(this.m_animation);
        ZOrderManager.setZOrder(this.m_animation, 60);

        setTimeout(() => {
            Laya.stage.removeChild(this.m_animation);
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
        }, 200);
        setTimeout(() => {
            this.m_canUse = true;
            // console.log("技能可使用");
            
        }, this.m_cd * 1000);
        this.updateCdTimer();
    }
    attackRangeCheck(owner: any, pos: object): void {
        let enemy = EnemyHandler.enemyPool;
        let rightSide: boolean = owner.m_isFacingRight;
        let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            if (e._ent.m_animation.destroyed === true) return;

            e._ent.takeDamage(this.m_damage);
            e._ent.delayMove(0.05);
            e._ent.m_rigidbody.linearVelocity = {x:rightSide?this.m_spikeVec/3:-this.m_spikeVec/3};
        });
    }
}

export class Behead extends VirtualSkill {
    m_name = '攻其不備';
    m_info = '製造破綻，瞬移並攻擊隨機敵人';
    m_damage: number;
    m_cost = 10;
    m_id = 2;
    m_cd = 3;

    m_iconA = "UI/icon/beheadA.png";
    m_iconB = "UI/icon/beheadB.png";

    /** 技能的準備時間 */
    m_preTime: number = 0.2;

    cast(owner: any, position: object, oathSystemCheck: boolean): void {
        if (!this.m_canUse) return;
        if (!oathSystemCheck) return;
        this.m_canUse = false;

        CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
        this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_beheadDmgMultiplier);
        let rightSide: boolean = owner.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = owner.m_animation.width;
        this.m_animation.height = owner.m_animation.height;
        this.m_animation.scaleX = 1.5;
        this.m_animation.scaleY = 1.5;
        this.m_animation.pos(rightSide ? position['x'] - 380 : position['x'] - 380, position['y'] - 400);

        let offsetX: number = rightSide ? position['x'] : position['x'] - this.m_animation.width;
        let offsetY: number = position['y'] - this.m_animation.height / 2 + 20;

        this.m_animation.source = "comp/Target.atlas";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 30;
        this.m_animation.alpha = 0.8;
        // this.m_animation.zOrder = 5;
        ZOrderManager.setZOrder(this.m_animation, 5);

        this.castRoar(position);

        if(owner.m_moveDelayValue <= 0)
            owner.delayMove(this.m_preTime);
        owner.m_rigidbody.linearVelocity = {x:0.0,y:0.0};

        owner.updateAnimation(owner.m_state, CharacterStatus.attackOne, null, false, 125);
        // owner.
        let colorMat: Array<number> =
        [
            3, 2, 2, 0, -250, //R
            1, 6, 1, 0, -250, //G
            2, 1, 4, 0, -250, //B
            0, 0, 0, 2, 0, //A
        ];
    let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#0065ff", 8, 0, 0);
    let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
    this.m_animation.filters = [colorFilter, glowFilter];
        this.m_animation.on(Laya.Event.COMPLETE, this, function () {
            Laya.stage.removeChild(this.m_animation);
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
        });


        Laya.stage.addChild(this.m_animation);
        ZOrderManager.setZOrder(this.m_animation, 60);
        // this.m_animation.play();

        setTimeout(() => {
            owner.m_rigidbody.linearVelocity = {x:0.0, y: 10.0};
            this.attackRangeCheck(owner,
                {
                    "x0": offsetX,
                    "x1": offsetX + this.m_animation.width,
                    "y0": offsetY,
                    "y1": offsetY + this.m_animation.height,
                });
            //this.m_animation.play();
        }, this.m_preTime * 1000);
        setTimeout(() => {
            this.m_canUse = true;
        }, this.m_cd * 1000);
        this.updateCdTimer();
    }
    attackRangeCheck(owner: any, pos: object): void {
        let enemy = EnemyHandler.enemyPool;
        // let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true));

        let targetEnemy: number = Math.floor(Math.random() * enemy.length);
        // let rightSide: boolean = owner.m_isFacingRight;

        if (enemy.length === 0 || (enemy[targetEnemy]._ent.m_animation.x <= 300 || enemy[targetEnemy]._ent.m_animation.x > 3800)) {
            return;
        }

        // console.log('攻擊標記(目前隨機)敵人: ', targetEnemy, enemy[targetEnemy]);
        owner.m_animation.x = enemy[targetEnemy]._ent.m_animation.x + (enemy[targetEnemy]._ent.m_animation.skewY === 0 ? -50 : 50);
        owner.m_animation.y = enemy[targetEnemy]._ent.m_animation.y;
        //this.m_animation.pos(owner.m_animation.x, owner.m_animation.y);

        setTimeout(() => {
            this.targetSlash(owner,
                {
                    x: owner.m_animation.x,
                    y: owner.m_animation.y,
                });
       }, 15);
       setTimeout(() => {
        enemy[targetEnemy]._ent.takeDamage(this.m_damage);
       }, 80);
       enemy[targetEnemy]._ent.takeDamage(this.m_damage);
    }
    targetSlash(owner: any, position: object): void {
        let slash : Laya.Animation = new Laya.Animation;
        let rightSide: boolean = owner.m_isFacingRight;

        slash = new Laya.Animation();
        slash.scaleX = 1.15;
        slash.scaleY = 1.15;
        slash.pos(rightSide ? position['x'] - 150 : position['x'] - 400, position['y'] - 450);


        slash.source = "comp/TargetSlash.atlas";
        slash.autoPlay = true;
        slash.interval = 20;
        slash.alpha = 0.83;
        // slash.zOrder = 5;
        ZOrderManager.setZOrder(slash, 5);
        // owner.
        let colorMat: Array<number> =
        [
            3, 2, 2, 0, -250, //R
            1, 4, 1, 0, -250, //G
            3, 1, 5, 0, -250, //B
            0, 0, 0, 2, 0, //A
        ];
    let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#0065ff", 8, 0, 0);
    let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
    slash.filters = [glowFilter, colorFilter];
        slash.on(Laya.Event.COMPLETE, this, function () {
            Laya.stage.removeChild(slash);
            slash.destroy();
            slash.destroyed = true;
        });
        Laya.stage.addChild(slash);
        ZOrderManager.setZOrder(slash, 60);
    }
}
export class None extends VirtualSkill{
    m_name = '無';
    m_info = '無';
    m_damage = 0;
    m_cost = 0;
    m_id = 0;
    m_cd = 0;

    m_iconA = "";
    m_iconB = "";
}