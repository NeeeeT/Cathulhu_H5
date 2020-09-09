export default class Character extends Laya.Script{
    m_name: string;
    m_health: number;
    m_maxHealth: number;
    m_bloodPoint: number;
    m_maxBloodPoint: number;
    m_defense: number;

    m_playerVelocity: object;
    m_isFacingRight: boolean;
    m_canJump: boolean;
    m_canAttack: boolean;

    m_keyDownList: Array<boolean>;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_collider: Laya.BoxCollider;
    m_script: Laya.Script;

    constructor(){
        super();
    }
}