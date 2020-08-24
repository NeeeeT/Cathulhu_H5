export default class AtkRange extends Laya.Script{
    constructor(){
        super();
    }
    onStart(){
    }
    onUpdate(){
        let x:Laya.RigidBody = this.owner.getComponent(Laya.RigidBody) as Laya.RigidBody;
        // let y:Laya.CircleCollider = this.owner.getComponent(Laya.CircleCollider) as Laya.CircleCollider;
        x.linearVelocity = {x:0, y:0};
    }
    onTriggerEnter(){
        console.log('哦哦哦哦撞到了!');
    }
}