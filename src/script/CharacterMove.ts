import Raycast from "./Raycast";
import DrawCmd from "./DrawCmd";

export default class CharacterMove extends Laya.Script {
  playerRig: Laya.RigidBody;
  private keyDownList: Array<boolean>;
  private playerVelocity: Object;
  private isFacingRight: boolean = true;
  private canJump: boolean = false;
  private timestamp: boolean = true;
  private hanlder: TimerHandler;
  /** @prop {name:characterNode,tips:"放入角色Node",type:Node}*/
  characterNode: Laya.Node = null;
  characterSprite: Laya.Sprite = null;
  // /** prop {name:groundCheckNode,tips:"放入groundcheck Node",type:Node}*/
  // groundCheckNode: Laya.Node = null;
  // groundCheckCollider: Laya.CircleCollider = null;
  /** @prop {name:xMaxVelocity,tips:"x軸速度上限",type:int,default:1}*/
  xMaxVelocity: number = 1;
  /** @prop {name:yMaxVelocity,tips:"y軸速度上限",type:int,default:1}*/
  yMaxVelocity: number = 1;
  /** @prop {name:velocityMultiplier,tips:"改變角色速度增加幅度",type:int,default:1}*/
  velocityMultiplier: number = 1;
  constructor() {
    super();
  }

  onStart() {
    this.setup();
    // setInterval((()=>{
    //   this.DetectRaycast();
    // }),100);
  }
  onUpdate():void{
  }
  setup(): void {
    this.characterSprite = this.characterNode as Laya.Sprite;
    this.playerVelocity = { Vx: 0, Vy: 0 };
    this.playerRig = this.owner.getComponent(Laya.RigidBody);
    // this.groundCheckCollider = this.groundCheckNode.getComponent(
    //   Laya.CircleCollider
    // );
    this.listenKeyboard();
  }

  listenKeyboard(): void {
    this.keyDownList = [];

    //添加键盘按下事件,一直按着某按键则会不断触发
    Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
    //添加键盘抬起事件
    Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
  }
  onTriggerEnter(col: Laya.BoxCollider) {
    // console.log(col.label);
    if (col.label == "BoxCollider") {
      console.log("Yes");
      this.canJump = true;
    }
  }
  onKeyDown(e: Laya.Event): void {
    var keyCode: number = e["keyCode"];
    this.keyDownList[keyCode] = true;
    this.characterMove();
  }

  onKeyUp(e: Laya.Event): void {
    this.resetMove();

    delete this.keyDownList[e["keyCode"]];
  }

  characterMove() {
    // if (!this.timestamp) return;
    //Left
    if (this.keyDownList[37]) {
      if (this.playerVelocity["Vx"] > -this.xMaxVelocity) {
        this.playerVelocity["Vx"] += -1 * this.velocityMultiplier;
        this.applyMoveX();
      }
      if (this.isFacingRight) {
        this.characterSprite.skewY = 180;
        this.isFacingRight = false;
      }
    }
    //Up
    if (this.keyDownList[38]) {
      this.playerRig.linearVelocity.y = 0;
      if (!this.canJump) return;
      this.playerVelocity["Vy"] += -10;
      this.applyMoveY();
      this.canJump = false;
    }
    //Right
    if (this.keyDownList[39]) {
      if (this.playerVelocity["Vx"] < this.xMaxVelocity) {
        this.playerVelocity["Vx"] += 1 * this.velocityMultiplier;
        this.applyMoveX();
      }
      if (!this.isFacingRight) {
        this.characterSprite.skewY = 0;
        this.isFacingRight = true;
      }
    }
    //Down
    if (this.keyDownList[40]) {
    }
    this.timestamp = false;
    setTimeout(this.hanlder, 0.5, () => {
      this.timestamp = true;
    });
  }
  resetMove() {
    this.playerVelocity["Vx"] = 0;
    this.playerVelocity["Vy"] = 0;
    this.applyMoveX();
    this.applyMoveY();
  }
  applyMoveX() {
    this.playerRig.setVelocity({
      x: this.playerVelocity["Vx"],
      y: this.playerRig.linearVelocity.y,
    });
  }
  applyMoveY() {
    // console.log(this.playerRig.linearVelocity.y);
    this.playerRig.setVelocity({
      x: this.playerRig.linearVelocity.x,
      y: this.playerVelocity["Vy"],
    });
  }
  DetectRaycast():void{
    let wOffset:number = (this.characterSprite.width / 2.5);
    let RaycastRange:number = 200;

    if(this.isFacingRight){
      DrawCmd.DrawLine(this.characterSprite.x + wOffset, this.characterSprite.y, this.characterSprite.x + RaycastRange + wOffset, this.characterSprite.y, '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6), 1);
      Raycast._RayCast(this.characterSprite.x + wOffset, this.characterSprite.y, this.characterSprite.x + RaycastRange + wOffset, this.characterSprite.y);
    }
    else{
      DrawCmd.DrawLine(this.characterSprite.x - wOffset, this.characterSprite.y, this.characterSprite.x - RaycastRange - wOffset, this.characterSprite.y, '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6), 1);
      Raycast._RayCast(this.characterSprite.x - wOffset, this.characterSprite.y, this.characterSprite.x - RaycastRange - wOffset, this.characterSprite.y);
    }
  }
}