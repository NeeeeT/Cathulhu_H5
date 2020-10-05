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

    cast(owner: any, position: object): void{ 
    };
    castRoar(pos): void{
        let roarText = new Laya.Text();

        roarText.pos(pos['x'] - 30, pos['y'] - 130);
        roarText.bold = true;
        roarText.align = "left";
        roarText.alpha = 1;

        roarText.fontSize = 50;
        roarText.color = '#FF3333'
        roarText.text = this.m_name;
        roarText.font = "opensans-bold";

        Laya.stage.addChild(roarText);

        Laya.Tween.to(roarText, { alpha: 0.55, fontSize: roarText.fontSize + 30, }, 350, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(roarText, { alpha: 0, fontSize: roarText.fontSize - 13, y: roarText.y - 50 }, 350, Laya.Ease.linearInOut, null, 0);
            }), 0);

        setTimeout((() => {
            if (roarText.destroyed) return;

            roarText.destroy();
            roarText.destroyed = true;
        }), 700);
    }
    /** 兩個矩形碰撞檢測 r1、r2分別傳入object類型x0, x1, y0, y1*/
    rectIntersect(r1, r2): boolean{
        let aLeftOfB:boolean = r1.x1 < r2.x0;
        let aRightOfB:boolean = r1.x0 > r2.x1;
        let aAboveB:boolean = r1.y0 > r2.y1;
        let aBelowB:boolean = r1.y1 < r2.y0;
        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }
    /** 矩形和圓形碰撞檢測 circle、rect分別傳入object類型{x,y,r}、{x,y,w,h}*/
    rectCircleIntersect(circle, rect){
        let distX = Math.abs(circle.x - rect.x0-rect.w/2);
        let distY = Math.abs(circle.y - rect.y0-rect.h/2);
    
        if (distX > (rect.w/2 + circle.r)) { return false; }
        if (distY > (rect.h/2 + circle.r)) { return false; }
    
        if (distX <= (rect.w/2)) { return true; } 
        if (distY <= (rect.h/2)) { return true; }
    
        var dx=distX-rect.w/2;
        var dy=distY-rect.h/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
    }
}