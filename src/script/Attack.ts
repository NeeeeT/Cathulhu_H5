export default class Attack extends Laya.Script {
  /** @prop {name:characterNode,tips:"放入角色Node",type:Node}*/
  characterNode: Laya.Node = null;
  characterSprite: Laya.Sprite = null;
  characterAnim: Laya.Animation;
  constructor() {
    super();
  }
  onStart() {}
}
