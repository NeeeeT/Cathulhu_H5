import * as cSkill from "./SkillCat";
import * as hSkill from "./SkillHuman";
import { VirtualSkill } from "./SkillManager";

export default class SkillList extends Laya.Script{
    public static catSkillList: VirtualSkill[] = [];
    public static humanSkillList: VirtualSkill[] = [];

    onStart(){
        this.updateSkillList();
    }
    updateSkillList(): void{
        SkillList.catSkillList.push(new cSkill.Slam());
        SkillList.catSkillList.push(new cSkill.BlackHole());

        SkillList.humanSkillList.push(new hSkill.Spike());
        SkillList.humanSkillList.push(new hSkill.Behead());
    }
}