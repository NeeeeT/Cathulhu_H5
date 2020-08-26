import DrawCmd from "./DrawCmd";
import Raycast from "./Raycast";
import CameraHandler from "./CameraHandler";
import { EnemyNormal } from "./EnemyNormal";

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
  private cd_atk: boolean = true;

  /** @prop {name:characterNode,tips:"放入角色Node",type:Node}*/
  characterNode: Laya.Node = null;
  characterSprite: Laya.Sprite = null;
  characterAnim: Laya.Animation;

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
    this.characterAnim.source =
      "character/player_01.png,character/player_02.png";

    this.playerVelocity = { Vx: 0, Vy: 0 };
    this.playerRig = this.owner.getComponent(Laya.RigidBody);

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
    // 因為friction設為0，為了在平地不會因慣性持續前進，而將x速度做重置
    if (this.canJump) {
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
      this.playerVelocity["Vx"] += -1 * this.velocityMultiplier;
      this.characterAnim.source =
        "character/player_walk_01.png,character/player_walk_02.png";
      this.characterAnim.interval = 100;
      this.applyMoveX();
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
      }
    }
    //Right
    if (this.keyDownList[39]) {
      this.playerVelocity["Vx"] += 1 * this.velocityMultiplier;

      this.characterAnim.source =
        "character/player_walk_01.png,character/player_walk_02.png";
      this.characterAnim.interval = 100;
      this.applyMoveX();
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
          e.destroyed = true;
          // e.active = false;
        });
      }
      setTimeout(() => {
        Laya.stage.graphics.clear();
        this.cd_ray = true;
      }, 500);

      let enenmyNormal: EnemyNormal = new EnemyNormal();
      enenmyNormal.spawn(this.characterSprite);
    }
    if (this.keyDownList[17]) {
      if (!this.cd_atk) return;
      this.createAttackCircle(this.characterSprite);
      this.createEffect(this.characterSprite);
      this.cd_atk = false;
      setTimeout(() => {
        this.cd_atk = true;
      }, 100);
    }
  }
  private resetMove(): void {
    this.playerVelocity["Vx"] = 0;
    this.playerVelocity["Vy"] = 0;
    this.applyMoveX();
    this.applyMoveY();
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

  private createAttackCircle(player: Laya.Sprite) {
    let atkCircle = new Laya.Sprite();
    atkCircle.width = 100;
    atkCircle.height = 100;
    if (this.isFacingRight) {
      atkCircle.pos(player.x + 100, player.y);
    } else {
      atkCircle.pos(player.x - 100, player.y);
    }
    let atkCircleCollider: Laya.CircleCollider = atkCircle.addComponent(
      Laya.CircleCollider
    ) as Laya.CircleCollider;
    let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(
      Laya.RigidBody
    ) as Laya.RigidBody;
    let atkCircleScript: Laya.Script = atkCircle.addComponent(
      Laya.Script
    ) as Laya.Script;

    atkCircleScript.onTriggerEnter = function () {
      console.log("攻擊攻擊攻擊");
    };
    atkCircleCollider.isSensor = true;
    atkCircleRigid.gravityScale = 0;

    Laya.stage.addChild(atkCircle);
    atkCircle.graphics.drawRect(0, 0, 100, 100, "gray", "gray", 1);

    setTimeout(() => {
      Laya.Physics.I.world.DestroyBody(atkCircleRigid);
      atkCircle.graphics.destroy();
      atkCircle.destroyed = true;
    }, 100);
  }

  private createEffect(player: Laya.Sprite) {
    let slashEffect: Laya.Animation = new Laya.Animation();
    if (this.isFacingRight) {
      slashEffect.skewY = 0;
      slashEffect.pos(player.x, player.y - 250);
    } else {
      slashEffect.skewY = 180;
      slashEffect.pos(player.x, player.y - 250);
    }
    slashEffect.source =
      "comp/SlashEffects/Slash_0030.png,comp/SlashEffects/Slash_0031.png,comp/SlashEffects/Slash_0032.png,comp/SlashEffects/Slash_0033.png,comp/SlashEffects/Slash_0034.png,comp/SlashEffects/Slash_0035.png";
    slashEffect.on(Laya.Event.COMPLETE, this, function () {
      console.log("動畫消除");
      slashEffect.clear();
    });
    Laya.stage.addChild(slashEffect);
    slashEffect.play();
  }
}
