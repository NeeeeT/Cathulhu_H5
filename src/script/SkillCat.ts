import CharacterInit from "./CharacterInit";
import { VirtualSkill } from "./SkillManager";

export class Spike extends VirtualSkill{
    m_name = '猛擊';
    m_damage = 1;
    m_cost = 0;
    m_id = 2;
    m_cd = 3;

    cast(position: object):void{
        if(!this.m_canUse) return;

        let player = CharacterInit.playerEnt;
        let rightSide: boolean = player.m_isFacingRight;

        this.m_animation = new Laya.Animation()
        this.m_animation.width = 400;
        this.m_animation.height = 200;
        this.m_animation.scaleX = 2;
        this.m_animation.scaleY = 2;
        this.m_animation.pos(rightSide ? position['x'] + 3 : position['x'] + 100, position['y'] - 130);
        this.m_animation.source = "";
        this.m_animation.autoPlay = true;
        this.m_animation.interval = 20;

        this.m_canUse = false;

        setTimeout(()=>{
            this.m_canUse = true;
        }, this.m_cd*1000);
    }
}