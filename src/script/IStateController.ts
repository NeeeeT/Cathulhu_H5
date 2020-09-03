interface IStateController extends Laya.Script{
}

export class CharacterStateController extends Laya.Script implements IStateController{
}

export enum CharacterEnum{
    Idle = 0,
    LeftMove = 1 << 0,
    RightMove = 1 << 1,
    Jump = 1 << 2,
    Hurt = 1 << 3,
    Attack = 1 << 4,
    SpellSkill = 1 << 5,
}

export enum EnemyStatus{
    idle = 0,
    run,
    jump,
    down,
    attack,
    useSkill,
    hurt,
    defend,
    death
}