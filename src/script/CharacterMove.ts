import DrawCmd from "./DrawCmd";
import Raycast from "./Raycast";
import CameraHandler from "./CameraHandler";

export default class CharacterMove extends Laya.Script {
  private playerRig: Laya.RigidBody;
  private keyDownList: Array<boolean>;
  private playerVelocity: Object;
  private isFacingRight: boolean = true;
  private canMove: boolean = false;
  private canJump: boolean = false;
  private timestamp: boolean = true;
  private hanlder: TimerHandler;

  private cd_ray: boolean = true; //空白鍵射線CD

  /** @prop {name:characterNode,tips:"放入角色Node",type:Node}*/
  characterNode: Laya.Node = null;
  characterSprite: Laya.Sprite = null;
  characterAnim: Laya.Animation;

  /** @prop {name:attackNode_Left,tips:"放入攻擊偵測Node(左)",type:Node}*/
  attackNode_Left: Laya.Node = null;
  attackSprite_Left: Laya.Sprite = null;
  attackCollider_Left: Laya.CircleCollider = null;
  /** @prop {name:attackNode_Right,tips:"放入攻擊偵測Node(右)",type:Node}*/
  attackNode_Right: Laya.Node = null;
  attackSprite_Right: Laya.Sprite = null;
  attackCollider_Right: Laya.CircleCollider = null;
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
  onAwake() {
    //   Laya.loader.load([
    //     "character/player_01.png",
    //     "character/player_02.png",
    //     "character/player_walk_01.png",
    //     "character/player_walk_02.png"
    // ], );
  }
  onStart() {
    this.setup();
    CameraHandler.CameraFollower(this.characterSprite); //初始化相機
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
    this.characterAnim = this.characterNode as Laya.Animation;

    this.attackSprite_Left = this.attackNode_Left as Laya.Sprite;
    this.attackSprite_Right = this.attackNode_Right as Laya.Sprite;
    this.attackCollider_Left = this.attackNode_Left.getComponent(
      Laya.CircleCollider
    ) as Laya.CircleCollider;
    this.attackCollider_Right = this.attackNode_Right.getComponent(
      Laya.CircleCollider
    ) as Laya.CircleCollider;
    // this.attackCollider_Right.enabled = false;
    this.attackNode_Right.active = false;
    // this.attackSprite_Right.visible = false;
    // this.attackCollider_Left.enabled = false;
    this.attackNode_Left.active = false;
    // this.attackSprite_Left.visible = false;
    this.characterAnim.source = "character/player_01.png,character/player_02.png";

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
    if (this.canJump /* || this.keyDownList[37] || this.keyDownList[39]*/) {
      this.playerVelocity["Vx"] = 0;
      this.characterAnim.source =
        "character/player_01.png,character/player_02.png";
      this.characterAnim.interval = 500;
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
      this.characterAnim.source =
        "character/player_walk_01.png,character/player_walk_02.png";
      this.characterAnim.interval = 100;
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
      this.characterAnim.source =
        "character/player_walk_01.png,character/player_walk_02.png";
      this.characterAnim.interval = 100;
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
      // CameraHandler.CameraFollower(this.characterSprite);
    }
    if (this.keyDownList[32]) {
      if (!this.cd_ray) return;

      this.cd_ray = false;

      let width_offset: number =
        (this.characterSprite.width / 2.5) * (this.isFacingRight ? 1 : -1);
      let raycast_range: number = 300 * (this.isFacingRight ? 1 : -1);
      let random_color: string =
        "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      let direction: number = this.isFacingRight ? 1 : 0;
      let Raycast_return: object = Raycast._RayCast(
        this.characterSprite.x + width_offset,
        this.characterSprite.y,
        this.characterSprite.x + width_offset + raycast_range,
        this.characterSprite.y,
        direction
      );

      DrawCmd.DrawLine(
        this.characterSprite.x + width_offset,
        this.characterSprite.y,
        this.characterSprite.x + width_offset + raycast_range,
        this.characterSprite.y,
        random_color,
        2
      );

      if (Raycast_return["Hit"]) {
        let rig: Laya.RigidBody[] = Raycast_return[
          "Rigidbody"
        ] as Laya.RigidBody[];
        let spr: Laya.Sprite[] = Raycast_return["Sprite"] as Laya.Sprite[];
        let world = Laya.Physics.I.world;

        // console.log(Raycast_return['Sprite']);

        //以下實作Raycast貫穿射線(foreach)，若要單體則取物件index，0為靠最近的，依此類推。
        rig.forEach((e) => {
          world.DestroyBody(e);
        });
        spr.forEach((e) => {
          console.log(e);
          e.graphics.destroy();
        });
      }
      setTimeout(() => {
        Laya.stage.graphics.clear();
        this.cd_ray = true;
      }, 500);
    }
    if (this.keyDownList[17]) {
      if (this.isFacingRight) {
        // this.attackCollider_Right.enabled = true;
        this.attackNode_Right.active = true;
        this.attackSprite_Right.y = this.characterSprite.y;
        this.attackSprite_Right.x = this.characterSprite.x + 75;
        this.characterAnim.source =
          "Attack/Player_attack_0.png,Attack/Player_attack_1.png,Attack/Player_attack_2.png,Attack/Player_attack_3.png,Attack/Player_attack_4.png,Attack/Player_attack_5.png";
        this.characterAnim.interval = 17;
        if (this.isFacingRight) {
          this.playerVelocity["Vx"] = 0;
          this.characterSprite.skewY = 0;
          this.isFacingRight = true;
        }
        // this.attackSprite_Right.visible = true;
        setTimeout(() => {
          // this.attackCollider_Right.enabled = false;
          this.attackSprite_Right.y = -1000;
          this.attackNode_Right.active = false;
          // this.attackSprite_Right.visible = false;
        }, 100);
      } else {
        // this.attackCollider_Left.enabled = true;
        this.attackNode_Left.active = true;
        this.attackSprite_Left.y = this.characterSprite.y;
        this.attackSprite_Left.x = this.characterSprite.x - 75;
        // this.attackSprite_Left.visible = true;
        this.characterAnim.source =
          "Attack/Player_attack_0.png,Attack/Player_attack_1.png,Attack/Player_attack_2.png,Attack/Player_attack_3.png,Attack/Player_attack_4.png,Attack/Player_attack_5.png";
        this.characterAnim.interval = 17;
        if (this.isFacingRight) {
          this.playerVelocity["Vx"] = 0;
          this.characterSprite.skewY = 180;
          this.isFacingRight = false;
        }
        setTimeout(() => {
          // this.attackCollider_Left.enabled = false;
          this.attackSprite_Left.y = -1000;
          this.attackNode_Left.active = false;
          // this.attackSprite_Left.visible = false;
        }, 100);
      }
    }
  }
  private resetMove(): void {
    this.playerVelocity["Vx"] = 0;
    this.playerVelocity["Vy"] = 0;
    this.applyMoveX();
    this.applyMoveY();
    // setTimeout(this.hanlder, 0.5, () => {
    //   console.log("jk");
    // });
  }
  private applyMoveX(): void {
    this.playerRig.setVelocity({
      x: this.playerVelocity["Vx"],
      y: this.playerRig.linearVelocity.y,
    });
  }
  private applyMoveY(): void {
    this.playerRig.setVelocity({
      x: this.playerRig.linearVelocity.x,
      y: this.playerVelocity["Vy"],
    });
  }
}
