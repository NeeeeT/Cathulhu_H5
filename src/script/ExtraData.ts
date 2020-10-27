import { VirtualSkill } from "./SkillManager";
import * as hSkill from "./SkillHuman";
import * as cSkill from "./SkillCat";

export class ExtraData extends Laya.Script{
    //此處的資料預計request資料庫取得。目前先暫時寫死數值
    e_hpLevel: number;
    e_atkDmgLevel: number;
    e_gold: number;
    e_crystal: number;

    e_cSkill: number;//以id來表示，方便儲存
    e_hSkill: number;//以id來表示，方便儲存

    e_cSkillLevel: number;
    e_hSkillLevel: number;

    constructor(){
        super();
        this.loadData();//此處用來讀取
    }

    public loadData(): void{
        this.e_hpLevel = 5;
        this.e_atkDmgLevel = 7;
        this.e_gold = 3500;
        this.e_crystal = 2000;
        this.e_cSkill = 1;
        this.e_hSkill = 1;
    }
}