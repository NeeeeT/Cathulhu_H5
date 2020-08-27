export interface ISkill extends Laya.Script {
  m_name: string;
  m_id: number;
  m_cost: number;
  m_damage: number;

  spell(cost: number): void;
  skillAttack(damage: number): void;
}
