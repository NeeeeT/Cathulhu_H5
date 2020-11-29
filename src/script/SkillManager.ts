export abstract class VirtualSkill extends Laya.Script{
    /** 技能名稱 */
    abstract m_name: string;
    /** 技能說明 */
    abstract m_info: string;
    /** 技能傷害 */
    abstract m_damage: number;
    /** 技能獻祭值消耗 */
    abstract m_cost: number;
    /** 技能ID */
    abstract m_id: number;
    /** 技能冷卻時間 */
    abstract m_cd: number;
    /** 技能icon A  */
    abstract m_iconA: string;
    /** 技能icon B */
    abstract m_iconB: string;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_script: Laya.Script;
    m_collider: Laya.BoxCollider;

    m_canUse: boolean = true;

    m_cdTimer;
    m_cdCount: number;

    cast(owner: any, position: object, oathSystemCheck: boolean): void{ 
    };
    castRoar(pos): void{
        let roarText = new Laya.Text();

        roarText.pos(pos['x'] - 10, pos['y'] - 200);
        roarText.bold = true;
        roarText.align = "left";
        roarText.alpha = 1;
        
        roarText.width = 300;
        roarText.wordWrap = false;

        roarText.fontSize = 70;
        roarText.color = '#FF3333'
        
        let temp_name = "";
        for(let i = 0; i < this.m_name.length; i++){
            temp_name += this.m_name[i];
            temp_name += " ";
        }

        roarText.text = temp_name;
        roarText.font = "silver";
        roarText.strokeColor = "#fff"
        roarText.stroke = 3

        Laya.stage.addChild(roarText);

        Laya.Tween.to(roarText, { alpha: 0.55, fontSize: roarText.fontSize + 30, }, 450, Laya.Ease.linearInOut,
            Laya.Handler.create(this, () => {
                Laya.Tween.to(roarText, { alpha: 0, fontSize: roarText.fontSize - 18, y: roarText.y - 50 }, 450, Laya.Ease.linearInOut,
                Laya.Handler.create(this, ()=> { roarText.destroy() }), 0);
            }), 0);
    }
    /** 兩個矩形碰撞檢測 r1、r2分別傳入object類型{x0, x1, y0, y1}*/
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
    updateCdTimer(): void{
        this.m_cdCount = this.m_cd;
        this.m_cdTimer = setInterval(()=>{
            if(this.m_canUse){
                clearInterval(this.m_cdTimer);
                this.m_cdTimer = null;
                this.m_cdCount = 0;
                return;
            }
            this.m_cdCount = !this.m_canUse ? (this.m_cdCount - 1):0;
        }, 1000);
    }
    setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
}