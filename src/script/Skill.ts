import { ISkill } from "./ISkill";

export class SkillSpike extends Laya.Script implements ISkill {
  m_name = "突刺斬";
  m_id = 1;
  m_cost = 0;
  m_damage = 100;

  spell(cost: number): void {};

  skillAttack(damage: number): void {};
}
