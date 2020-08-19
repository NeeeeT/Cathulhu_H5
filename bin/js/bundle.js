(function () {
  'use strict';

  class CharacterMove extends Laya.Script {
      constructor() {
          super();
          this.isFacingRight = true;
          this.canMove = false;
          this.canJump = false;
          this.timestamp = true;
          this.characterNode = null;
          this.characterSprite = null;
          this.xMaxVelocity = 1;
          this.yMaxVelocity = 1;
          this.velocityMultiplier = 1;
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
      setup() {
          this.characterSprite = this.characterNode;
          this.playerVelocity = { Vx: 0, Vy: 0 };
          this.playerRig = this.owner.getComponent(Laya.RigidBody);
          this.listenKeyboard();
      }
      listenKeyboard() {
          this.keyDownList = [];
          Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
          Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
      }
      onTriggerEnter(col) {
          if (col.label == "BoxCollider") {
              this.resetMove();
              this.canJump = true;
              this.canMove = true;
          }
      }
      onKeyDown(e) {
          var keyCode = e["keyCode"];
          this.keyDownList[keyCode] = true;
      }
      onKeyUp(e) {
          if (this.canJump) {
              this.playerVelocity["Vx"] = 0;
              this.applyMoveX();
          }
          delete this.keyDownList[e["keyCode"]];
      }
      characterMove() {
          if (this.keyDownList[37]) {
              this.playerVelocity["Vx"] += -1 * this.velocityMultiplier;
              this.applyMoveX();
              if (this.isFacingRight) {
                  this.playerVelocity["Vx"] = 0;
                  this.applyMoveX();
                  this.characterSprite.skewY = 180;
                  this.isFacingRight = false;
              }
          }
          if (this.keyDownList[38]) {
              if (this.canJump) {
                  this.playerVelocity["Vy"] += -10;
                  this.applyMoveY();
                  this.canJump = false;
              }
          }
          if (this.keyDownList[39]) {
              this.playerVelocity["Vx"] += 1 * this.velocityMultiplier;
              this.applyMoveX();
              if (!this.isFacingRight) {
                  this.playerVelocity["Vx"] = 0;
                  this.applyMoveX();
                  this.characterSprite.skewY = 0;
                  this.isFacingRight = true;
              }
          }
          if (this.keyDownList[40]) {
          }
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
          this.playerRig.setVelocity({
              x: this.playerRig.linearVelocity.x,
              y: this.playerVelocity["Vy"],
          });
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/CharacterMove.ts", CharacterMove);
      }
  }
  GameConfig.width = 1000;
  GameConfig.height = 600;
  GameConfig.scaleMode = "showall";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "middle";
  GameConfig.alignH = "center";
  GameConfig.startScene = "First.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = true;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
      }
  }
  new Main();

}());
