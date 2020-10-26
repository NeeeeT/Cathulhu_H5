import { VirtualSkill } from "./SkillManager";
import * as hSkill from "./SkillHuman";
import * as cSkill from "./SkillCat";

export class ExtraData extends Laya.Script{
    //此處的資料預計request資料庫取得。目前先暫時寫死數值
    e_health: number;
    e_atkDmg: number;
    e_gold: number;
    e_crystal: number;
    e_cSkill: VirtualSkill;//最後應該會以數字來表示，方便儲存
    e_hSkill: VirtualSkill;//最後應該會以數字來表示，方便儲存

    constructor(){
        super();
        this.loadData();//此處用來讀取
    }

    public loadData(): void{
        this.e_health = 500;
        this.e_atkDmg = 500;
        this.e_gold = 1500;
        this.e_crystal = 2000;
        this.e_cSkill = new cSkill.Slam();
        this.e_hSkill = new hSkill.Spike();
    }
}