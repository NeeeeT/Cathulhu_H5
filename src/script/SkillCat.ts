import CharacterInit from "./CharacterInit";
import { CharacterStatus } from "./CharacterStatus";
import EnemyHandler, { VirtualEnemy } from "./EnemyHandler"
import { VirtualSkill } from "./SkillManager";

export class Slam extends VirtualSkill {
    m_name = '猛擊';
    m_info = '強大的範圍傷害';
    m_damage: number;
    m_cost = 50;
    m_id = 2;
    m_cd = 3;

    m_iconA = "ui/icon/slamA.png";
    m_iconB = "ui/icon/slamB.png";

    m_injuredEnemy: VirtualEnemy[] = [];
    
    cast(owner: any, position: object, oathSystemCheck: boolean): void {
        if (!this.m_canUse) return;
        if (!oathSystemCheck) return;
        this.m_canUse = false;

        CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
        this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_slamDmgMultiplier);
        let rightSide: boolean = owner.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 350;
        this.m_animation.height = 350;
        this.m_animation.scaleX = 1.5;
        this.m_animation.scaleY = 1.5;
        //動畫位置需要再調整

        this.m_animation.source = "comp/Slam.atlas";
        this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 700, position['y'] - 550);
        this.m_animation.autoPlay = false;
        this.m_animation.interval = 25;
        this.m_animation.alpha = 0.7;

        let colorMat: Array<number> =
            [
                2, 1, 0, 0, -350, //R
                3, Math.floor(Math.random() * 1) + 2, 1, 0, -350, //G
                1, 3, 1, 0, -350, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#8400ff", 50, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [glowFilter, colorFilter];
        this.m_animation.on(Laya.Event.COMPLETE, this, function () {
            this.m_animation.destroy();
            this.m_animation.destroyed = true;
        });
        Laya.stage.addChild(this.m_animation);
        setTimeout(() => {
            this.m_animation.play();
            let timer = setInterval(() => {
                if (rangeY > offsetInterval) {
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
            }, 50);
        }, 180);


        owner.updateAnimation(owner.m_state, CharacterStatus.slam, null, false, 100);

        let offsetX: number = rightSide ? position['x'] + 65 : position['x'] - this.m_animation.width - 65;
        let offsetY: number = position['y'] - this.m_animation.height - 70;
        let offsetInterval: number = 40;
        let rangeY: number = 0;


        this.castRoar(position);
        this.m_injuredEnemy = [];//暫時用來記憶被此次技能打中的敵人，並忽略此攻擊

        setTimeout(() => {
            this.m_canUse = true;
            Laya.stage.graphics.clear();
        }, this.m_cd * 1000);
        this.updateCdTimer();
    }
    attackRangeCheck(owner: any, pos: object): void {
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectIntersect(pos, data._ent.m_rectangle) === true && this.m_injuredEnemy.indexOf(data._id) === -1));
        enemyFound.forEach((e) => {
            e._ent.delayMove(0.3);
            e._ent.takeDamage(this.m_damage);
            this.m_injuredEnemy.push(e._id);
            owner.setCameraShake(50, 12);
            // CharacterInit.playerEnt.setCameraShake(50,12); //owner.setCameraShake報錯沒有此方法，暫時把此方法及裡面的參數的static刪除
        });
    }
}

export class BlackHole extends VirtualSkill {
    m_name = '深淵侵蝕';
    m_info = '牽引敵人並且造成傷害';
    m_damage: number;
    m_dotDamage: number;
    m_cost = 80;
    m_id = 2;
    m_cd = 5;
    m_lastTime = 2;
    m_radius = 100;//黑洞半徑
    
    m_iconA = "ui/icon/blackholeA.png";
    m_iconB = "ui/icon/blackholeB.png";
    
    cast(owner: any, position: object, oathSystemCheck: boolean): void {
        if (!this.m_canUse) return;
        if (!oathSystemCheck) return;
        this.m_canUse = false;

        CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
        this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_blackHoleDmgMultiplier);
        this.m_dotDamage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_blackHoleDotDmgMultiplier);

        let rightSide: boolean = owner.m_isFacingRight;
        let explosion: Laya.Animation = new Laya.Animation();

        this.m_animation = new Laya.Animation()
        this.m_animation.width = this.m_animation.height = this.m_radius;
        this.m_animation.scaleX = 1;
        this.m_animation.scaleY = 1;
        this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 400, position['y'] - 300);
        this.m_animation.alpha = 0.7;
        //this.m_animation.zOrder = 5;
        //動畫位置需要再調整

        this.m_animation.source = "comp/BlackHole.atlas";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        explosion.source = "comp/BlackExplosion.atlas";
        explosion.scaleX = 1;
        explosion.scaleY = 1;
        explosion.interval = 30;
        explosion.pos(this.m_animation.x, this.m_animation.y);

        let offsetX: number = rightSide ? position['x'] + 140 : position['x'] - this.m_animation.width - 65;
        let offsetY: number = position['y'] - this.m_animation.height / 2;

        this.castRoar(position);

        let colorMat: Array<number> =
            [
                4, 0, 2, 0, -150, //R
                0, 1, 1, 0, -100, //G
                1, 2, 1, 0, -150, //B
                0, 0, 0, 2, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#460075", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [glowFilter, colorFilter];
        let colorFilterex: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        explosion.filters = [glowFilter, colorFilter];

        //Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius, 'black', 'white', 1);
        //Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius + 100, 'black', 'white', 1);

        // this.attackRangeCheck(owner, {
        //     "x": offsetX,
        //     "y": offsetY,
        //     "r": this.m_radius,
        // }, this.m_damage)
        let count: number = 0;

        let timer = setInterval(() => {
            if (count >= this.m_lastTime * 1000) {
                Laya.stage.addChild(explosion);
                explosion.play();
                owner.setCameraShake(100, 12);
                setTimeout(() => {
                    explosion.destroy();
                }, 300);
                this.attackRangeCheck(owner, {
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
            this.attackRangeCheck(owner, {
                "x": offsetX,
                "y": offsetY,
                "r": this.m_radius + 100,
            }, this.m_dotDamage);
            count += 100;
        }, 100);

        setTimeout(() => {
            //Laya.stage.graphics.clear();
            this.m_animation.destroy();
        }, this.m_lastTime * 1000);
        setTimeout(() => {
            this.m_canUse = true;
        }, this.m_cd * 1000);
        Laya.stage.addChild(this.m_animation);
        this.m_animation.play();
        this.updateCdTimer();
    }
    attractRangeCheck(owner: any, pos: object): void {
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            if (e._ent.m_animation.destroyed === true) return;

            // e._ent.delayMove(0.1);
            e._ent.m_rigidbody.setVelocity({
                "x": (pos['x'] - (e._ent.m_rectangle['x0'] + e._ent.m_animation.width / 2)) * 0.1,
                "y": (pos['y'] - (e._ent.m_rectangle['y0'] + e._ent.m_animation.height / 2)) * 0.1,
            });
        });
    }
    attackRangeCheck(owner: any, pos: object, dmg: number): void {
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            // e._ent.delayMove(0.3);
            e._ent.takeDamage(dmg);
        });
    }
}

export class BigExplosion extends VirtualSkill {
    m_name = '魔法大爆射';
    m_info = '造成全場敵人極大的損傷';
    m_damage: number;
    m_dotDamage = 7;
    m_cost = 80;
    m_id = 2;
    m_cd = 15;
    m_lastTime = 2;
    m_radius = 100;//黑洞半徑

    m_iconA = "ui/icon/blackholeA.png";
    m_iconB = "ui/icon/blackholeB.png";

    cast(owner: any, position: object, oathSystemCheck: boolean): void {
        if (!this.m_canUse) return;
        if (!oathSystemCheck) return;
        this.m_canUse = false;

        CharacterInit.playerEnt.m_oathManager.oathCastSkill(this.m_cost);
        this.m_damage = Math.round(CharacterInit.playerEnt.getAtkValue(CharacterInit.playerEnt.m_atkLevel) * CharacterInit.playerEnt.m_bigExplosionDmgMultiplier);

        let rightSide: boolean = owner.m_isFacingRight;
        let explosion: Laya.Animation = new Laya.Animation();

        this.m_animation = new Laya.Animation()
        this.m_animation.width = this.m_animation.height = this.m_radius;
        this.m_animation.scaleX = 0.3;
        this.m_animation.scaleY = 0.3;
        this.m_animation.pos(rightSide ? position['x'] - 100 : position['x'] - 400, position['y'] - 300);
        this.m_animation.alpha = 0.7;
        //this.m_animation.zOrder = 5;

        this.m_animation.source = "comp/FireBall.atlas";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        explosion.source = "comp/BigExplosion.atlas";
        explosion.scaleX = 6;
        explosion.scaleY = 6;
        explosion.interval = 30;
        explosion.pos(this.m_animation.x - 1400, this.m_animation.y - 1500);

        let offsetX: number = rightSide ? position['x'] + 140 : position['x'] - this.m_animation.width - 65;
        let offsetY: number = position['y'] - this.m_animation.height / 2;

        
        this.castRoar(position);

        let colorMat: Array<number> =
            [
                4, 0, 2, 0, -150, //R
                0, 1, 1, 0, -100, //G
                1, 2, 1, 0, -150, //B
                0, 0, 0, 2, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#460075", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.m_animation.filters = [colorFilter];
        let colorFilterex: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        explosion.filters = [glowFilter, colorFilter];

        //Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius, 'black', 'white', 1);
        //Laya.stage.graphics.drawCircle(offsetX, offsetY, this.m_radius + 100, 'black', 'white', 1);

        // this.attackRangeCheck(owner, {
        //     "x": offsetX,
        //     "y": offsetY,
        //     "r": this.m_radius,
        // }, this.m_damage)
        let count: number = 0;

        let timer = setInterval(() => {
            if (count >= this.m_lastTime * 1000) {
                Laya.stage.addChild(explosion);
                explosion.play();
                owner.setCameraShake(100, 12);
                setTimeout(() => {
                    explosion.destroy();
                }, 300);
                this.attackRangeCheck(owner, {
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
            this.attackRangeCheck(owner, {
                "x": offsetX,
                "y": offsetY,
                "r": this.m_radius + 100,
            }, this.m_dotDamage);
            count += 100;
        }, 100);

        setTimeout(() => {
            //Laya.stage.graphics.clear();
            this.m_animation.destroy();
        }, this.m_lastTime * 1000);
        setTimeout(() => {
            this.m_canUse = true;
        }, this.m_cd * 1000);
        Laya.stage.addChild(this.m_animation);
        this.m_animation.play();
        this.updateCdTimer();
    }
    attractRangeCheck(owner: any, pos: object): void {
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        // setInterval(() => {
        //     this.m_animation.x++;
        // }, 20);
        // enemyFound.forEach((e) => {
        //     if (e._ent.m_animation.destroyed === true) return;

        //     // e._ent.delayMove(0.1);
        //     e._ent.m_rigidbody.setVelocity({
        //         "x": (pos['x'] - (e._ent.m_rectangle['x0'] + e._ent.m_animation.width / 2)) * 0.1,
        //         "y": (pos['y'] - (e._ent.m_rectangle['y0'] + e._ent.m_animation.height / 2)) * 0.1,
        //     });
        // });
    }
    attackRangeCheck(owner: any, pos: object, dmg: number): void {
        let enemy = EnemyHandler.enemyPool;
        let enemyFound = enemy.filter(data => (this.rectCircleIntersect(pos, data._ent.m_rectangle) === true));
        enemyFound.forEach((e) => {
            // e._ent.delayMove(0.3);
            e._ent.takeDamage(dmg);
        });
    }
}

export class None extends VirtualSkill{
    m_name = '無';
    m_info = '無';
    m_damage = 0;
    m_cost = 0;
    m_id = -1;
    m_cd = 0;

    m_iconA = "";
    m_iconB = "";
}