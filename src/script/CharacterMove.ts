import DrawCmd from "./DrawCmd";
import Raycast from "./Raycast";

export default class CharacterMove extends Laya.Script {
  private playerRig: Laya.RigidBody;
  private keyDownList: Array<boolean>;
  private playerVelocity: Object;
  private isFacingRight: boolean = true;
  private canMove: boolean = false;
  private canJump: boolean = false;
  private timestamp: boolean = true;
  private hanlder: TimerHandler;

  private cd_ray: boolean = true;//空白鍵射線CD

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
  }

  onUpdate() {
    if (this.playerVelocity["Vx"] < -this.xMaxVelocity) {
      this.playerVelocity["Vx"] = -this.xMaxVelocity;
    }
    if (this.playerVelocity["Vx"] > this.xMaxVelocity) {
      this.playerVelocity["Vx"] = this.xMaxVelocity;
    }
    this.characterMove();
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
      this.resetMove();
      this.canJump = true;
      this.canMove = true;
    }
  }
  onKeyDown(e: Laya.Event): void {
    var keyCode: number = e["keyCode"];
    this.keyDownList[keyCode] = true;
  }

  onKeyUp(e: Laya.Event): void {
    // this.resetMove();
    // setInterval((this.hanlder = ()=>{
    //   if(this.playerVelocity["Vx"])
    //   {
    //     this.playerVelocity["Vx"]+= -1 * this.velocityMultiplier;
    //   }
    // }),50)

    // 因為friction設為0，為了在平地不會因慣性持續前進，而將x速度做重置
    if (this.canJump) {
      this.playerVelocity["Vx"] = 0;
      this.applyMoveX();
    }
    delete this.keyDownList[e["keyCode"]];
  }

  characterMove() {
    //Left
    if (this.keyDownList[37]) {
      // if (!this.canMove) return;
      // if (this.playerVelocity["Vx"] > -this.xMaxVelocity) {
      this.playerVelocity["Vx"] += -1 * this.velocityMultiplier;
      this.applyMoveX();
      // }
      if (this.isFacingRight) {
        this.playerVelocity["Vx"] = 0;
        this.applyMoveX();
        this.characterSprite.skewY = 180;
        this.isFacingRight = false;
      }
    }
    //Up
    if (this.keyDownList[38]) {
      if (this.canJump) {
        this.playerVelocity["Vy"] += -10;
        this.applyMoveY();
        this.canJump = false;
        // this.canMove = false;
      }
    }
    //Right
    if (this.keyDownList[39]) {
      // if (!this.canMove) return;
      // if (this.playerVelocity["Vx"] < this.xMaxVelocity) {
      this.playerVelocity["Vx"] += 1 * this.velocityMultiplier;
      // console.log(this.playerRig);

      this.applyMoveX();
      // }
      if (!this.isFacingRight) {
        this.playerVelocity["Vx"] = 0;
        this.applyMoveX();
        this.characterSprite.skewY = 0;
        this.isFacingRight = true;
      }
    }
    //Down
    if (this.keyDownList[40]) {
    }
    if (this.keyDownList[32]) {
      if(!this.cd_ray) return;
      
      this.cd_ray = false;

      let width_offset: number = (this.characterSprite.width / 2.5) * ((this.isFacingRight) ? 1:-1);
      let raycast_range: number = 250 * ((this.isFacingRight) ? 1:-1);
      let random_color: string = "#"+((1<<24)*Math.random()|0).toString(16);

      DrawCmd.DrawLine(this.characterSprite.x + width_offset, this.characterSprite.y, this.characterSprite.x + width_offset + raycast_range, this.characterSprite.y, random_color, 2);
      Raycast._RayCast(this.characterSprite.x + width_offset, this.characterSprite.y, this.characterSprite.x + width_offset + raycast_range, this.characterSprite.y, 1);
      
      setTimeout((()=>{
        Laya.stage.graphics.clear();
        this.cd_ray = true;
      }), 2000);
    };
  }
  private resetMove():void {
    this.playerVelocity["Vx"] = 0;
    this.playerVelocity["Vy"] = 0;
    this.applyMoveX();
    this.applyMoveY();
    // setTimeout(this.hanlder, 0.5, () => {
    //   console.log("jk");
    // });
  }
  private applyMoveX():void {
    this.playerRig.setVelocity({
      x: this.playerVelocity["Vx"],
      y: this.playerRig.linearVelocity.y,
    });
  }
  private applyMoveY():void {
    this.playerRig.setVelocity({
      x: this.playerRig.linearVelocity.x,
      y: this.playerVelocity["Vy"],
    });
  }
}
