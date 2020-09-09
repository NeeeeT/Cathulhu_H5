import Raycast from "./Raycast";
import DrawCmd from "./DrawCmd";
import EnemyHandler from "./EnemyHandler";
import OathManager from "./OathManager";

export enum CharacterStatus{
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

export default class CharacterManager extends Laya.Script{
    m_state: number;
    m_name: string;
    m_health: number;
    m_maxHealth: number;
    m_bloodPoint: number;
    m_maxBloodPoint: number;
    m_defense: number;
    m_xMaxVelocity: number;
    m_yMaxVelocity: number;
    m_velocityMultiplier: number;
    m_attackRange: number;

    m_playerVelocity: object;

    m_isFacingRight: boolean = true;
    m_canJump: boolean = true;
    m_canAttack: boolean = true;
    m_animationChanging: boolean;

    public static m_cameraShakingTimer: number = 0;

    m_keyDownList: Array<boolean>;

    m_animation: Laya.Animation;
    m_rigidbody: Laya.RigidBody;
    m_collider: Laya.BoxCollider;
    m_script: Laya.Script;

    spawn(){
        this.m_state = CharacterStatus.idle;

        this.m_animation = new Laya.Animation();
        this.m_animation.scaleX = 1;
        this.m_animation.scaleY = 1;

        this.m_animation.width = 130;
        this.m_animation.height = 130;
        this.m_animation.pivotX = this.m_animation.width / 2;
        this.m_animation.pivotY = this.m_animation.height / 2;

        this.m_animation.pos(1345, 544);
        this.m_animation.autoPlay = true;
        this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
        this.m_animation.interval = 200;
        this.m_animation.loop = true;
        this.m_animation.on(Laya.Event.COMPLETE, this, ()=>{
            this.m_animationChanging = false;
        })
        
        this.m_maxHealth = this.m_health;
        this.m_collider = this.m_animation.addComponent(Laya.BoxCollider);
        this.m_rigidbody = this.m_animation.addComponent(Laya.RigidBody);
        this.m_script = this.m_animation.addComponent(Laya.Script);

        this.m_script.onAwake = () => {
            this.m_playerVelocity = { Vx: 0, Vy: 0 };
            this.listenKeyBoard();
        }
        this.m_script.onUpdate = () => {
            if (this.m_playerVelocity["Vx"] < -this.m_xMaxVelocity) this.m_playerVelocity["Vx"] = -this.m_xMaxVelocity;
            if (this.m_playerVelocity["Vx"] > this.m_xMaxVelocity) this.m_playerVelocity["Vx"] = this.m_xMaxVelocity;
            this.characterMove();
        }
        this.m_script.onTriggerEnter = (col:Laya.BoxCollider | Laya.CircleCollider | Laya.ChainCollider) => {
            if (col.label == "BoxCollider") {
                this.resetMove();
                this.m_canJump = true;
            }
        }
        this.m_script.onKeyUp = (e: Laya.Event) => {
            if (this.m_canJump) {
                this.m_playerVelocity["Vx"] = 0;
                this.applyMoveX();
            }
            delete this.m_keyDownList[e["keyCode"]];
        }
        this.m_script.onKeyDown = (e: Laya.Event) => {
            let keyCode: number = e["keyCode"];
            this.m_keyDownList[keyCode] = true;
        }

        this.m_collider.width = this.m_animation.width;
        this.m_collider.height = this.m_animation.height;
        this.m_collider.x -= 5;
        this.m_collider.y -= 5;
        this.m_collider.tag = 'Player';
        this.m_collider.friction = 0;
        this.m_rigidbody.allowRotation = false;
        this.m_rigidbody.gravityScale = 3;

        Laya.stage.addChild(this.m_animation);

        OathManager.showBloodyPoint(this.m_animation);

        this.CameraFollower();
    }
    private listenKeyBoard(): void {
        this.m_keyDownList = [];
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }
    private characterMove() {
        //Left
        if (this.m_keyDownList[37]) {
          this.m_playerVelocity["Vx"] += -1 * this.m_velocityMultiplier;
          this.m_animation.source = "character/player_run_01.png,character/player_run_02.png,character/player_run_03.png,character/player_run_04.png";
          this.m_animation.interval = 200;
          this.applyMoveX();
          if (this.m_isFacingRight) {
            this.m_playerVelocity["Vx"] = 0;
            this.applyMoveX();
            this.m_animation.skewY = 180;
            this.m_isFacingRight = false;
          }
        }
        //Up
        if (this.m_keyDownList[38]) {
          if (this.m_canJump) {
            this.m_playerVelocity["Vy"] += -10;
            this.applyMoveY();
            this.m_canJump = false;
          }
        }
        //Right
        if (this.m_keyDownList[39]) {
          this.m_playerVelocity["Vx"] += 1 * this.m_velocityMultiplier;
    
          this.m_animation.source = "character/player_run_01.png,character/player_run_02.png,character/player_run_03.png,character/player_run_04.png";
          this.m_animation.interval = 100;
          this.applyMoveX();
          if (!this.m_isFacingRight) {
            this.m_playerVelocity["Vx"] = 0;
            this.applyMoveX();
            this.m_animation.skewY = 0;
            this.m_isFacingRight = true;
          }
        }
        if (this.m_keyDownList[40]) {
          //Down
        }
        if (this.m_keyDownList[32]) {
          let width_offset: number =
            (this.m_animation.width / 2.5) * (this.m_isFacingRight ? 1 : -1);
          let raycast_range: number = 300 * (this.m_isFacingRight ? 1 : -1);
          let random_color: string =
            "#" + (((1 << 24) * Math.random()) | 0).toString(16);
          let direction: number = this.m_isFacingRight ? 1 : 0;
          let Raycast_return: object = Raycast._RayCast(
            this.m_animation.x + width_offset,
            this.m_animation.y,
            this.m_animation.x + width_offset + raycast_range,
            this.m_animation.y,
            direction
          );
          DrawCmd.DrawLine(
            this.m_animation.x + width_offset,
            this.m_animation.y,
            this.m_animation.x + width_offset + raycast_range,
            this.m_animation.y,
            random_color,
            2
          );
          if (Raycast_return["Hit"]) {
            let rig: Laya.RigidBody[] = Raycast_return[
              "Rigidbody"
            ] as Laya.RigidBody[];
            let spr: Laya.Sprite[] = Raycast_return["Sprite"] as Laya.Sprite[];
            let world = Laya.Physics.I.world;
    
            //以下實作Raycast貫穿射線(foreach)，若要單體則取物件index，0為靠最近的，依此類推。
            spr.forEach((e) => {
              e.destroy();
              e.destroyed = true;
            });
          }
          setTimeout(() => {
            Laya.stage.graphics.clear();
            // this.cd_ray = true;
          }, 500);
          //敵人生成測試
        //   EnemyHandler.generator(this.characterSprite, this.isFacingRight ? 1 : 2, 0);
          //誓約系統測試
        //   OathManager.setBloodyPoint(OathManager.getBloodyPoint() - 10);
        }
        if (this.m_keyDownList[17]) {
          if (!this.m_canAttack) return;

          this.m_animation.interval = 100;
          this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
          this.createAttackCircle(this.m_animation);
          this.createAttackEffect(this.m_animation);
          this.m_canAttack = false;
    
          this.m_animation.on(Laya.Event.COMPLETE, this, function () {
            this.m_animation.interval = 200;
            this.m_animation.source = 'character/player_idle_01.png,character/player_idle_02.png,character/player_idle_03.png,character/player_idle_04.png';
          });
          setTimeout(() => {
            this.m_canAttack = true;
          }, 500);
        }
    }
    private createAttackCircle(player: Laya.Sprite) {
        let atkCircle = new Laya.Sprite();
        let x_offset: number = this.m_isFacingRight ? (player.width * 1) / 2 + 3 : (player.width * 5) / 4 + 3;
        let soundNum: number = Math.floor(Math.random() * 2);
        if (this.m_isFacingRight) {
            atkCircle.pos(
            player.x + x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8
            );
        } else {
            atkCircle.pos(
            player.x - x_offset, player.y - (this.m_animation.height * 1) / 2 + (this.m_animation.height * 1) / 8
            );
        }
        let atkBoxCollider: Laya.BoxCollider = atkCircle.addComponent(Laya.BoxCollider) as Laya.BoxCollider;
        let atkCircleRigid: Laya.RigidBody = atkCircle.addComponent(Laya.RigidBody) as Laya.RigidBody;
        let atkCircleScript: Laya.Script = atkCircle.addComponent(Laya.Script) as Laya.Script;

        atkBoxCollider.height = atkBoxCollider.width = this.m_attackRange;
        CharacterManager.setCameraShake(50);
        atkCircleScript.onTriggerEnter = function (col: Laya.BoxCollider) {
            if (col.tag === 'Enemy') {
            let eh = EnemyHandler;//敵人控制器
            let victim = eh.getEnemyByLabel(col.label);
            // eh.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 150));//Math.random() * Max-Min +1 ) + Min
            
            //誓約系統測試
            // OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
              if(!OathManager.isCharging){
                eh.takeDamage(victim, Math.round(Math.floor(Math.random() * 51) + 150));//Math.random() * Max-Min +1 ) + Min
        
                //誓約系統測試
                OathManager.setBloodyPoint(OathManager.getBloodyPoint() + OathManager.increaseBloodyPoint);
              }else{
                OathManager.chargeAttack(col.label);
              }
            }
        };
        this.setSound(0.6, "Audio/Attack/Attack" + soundNum + ".wav", 1);//loop:0為循環播放
        atkBoxCollider.isSensor = true;
        atkCircleRigid.gravityScale = 0;
        atkCircle.graphics.drawRect(0, 0, 100, 100, "gray", "gray", 1);

        Laya.stage.addChild(atkCircle);

        setTimeout(() => {
            atkCircle.destroy();
            atkCircle.destroyed = true;
        }, 100);
    }
    private createAttackEffect(player: Laya.Sprite) {
        let slashEffect: Laya.Animation = new Laya.Animation();
        let colorNum: number = Math.floor(Math.random() * 3) + 2;
        //濾鏡
        let colorMat: Array<number> =
            [
            colorNum, 0, 0, 0, -100, //R
            0, Math.floor(Math.random() * 2) + 1, 0, 0, -100, //G
            0, 0, colorNum, 0, -100, //B
            0, 0, 0, 1, 0, //A
            ];
            let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#9b05ff", 20, 0, 0);
            let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        if(!OathManager.isCharging){
          slashEffect.filters = [colorFilter, glowFilter];
        }else{
          let colorMat_charge: Array<number> =
          [
            5, 0, 0, 0, -100, //R
            5, 0, 0, 0, -100, //G
            0, 0, 0, 0, -100, //B
            0, 0, 0, 1, 0, //A
          ];
          let colorFilter_charge: Laya.ColorFilter = new Laya.ColorFilter(colorMat_charge);
          let glowFilter_charge: Laya.GlowFilter = new Laya.GlowFilter("#F7F706", 20, 0, 0);
          slashEffect.filters = [colorFilter_charge, glowFilter_charge];
        }
        //濾鏡
        if (this.m_isFacingRight) {
            slashEffect.skewY = 0;
            slashEffect.pos(player.x - 100, player.y - 250 + 30);
        } else {
            slashEffect.skewY = 180;
            slashEffect.pos(player.x + 100, player.y - 250 + 30);
        }
        slashEffect.source =
            "comp/SlashEffects/Slash_0030.png,comp/SlashEffects/Slash_0031.png,comp/SlashEffects/Slash_0032.png,comp/SlashEffects/Slash_0033.png,comp/SlashEffects/Slash_0034.png,comp/SlashEffects/Slash_0035.png";
        slashEffect.on(Laya.Event.COMPLETE, this, function () {
            slashEffect.destroy();
            slashEffect.destroyed = true;
        });
        Laya.stage.addChild(slashEffect);
        slashEffect.play();
    }
    private resetMove(): void {
        this.m_playerVelocity["Vx"] = 0;
        this.m_playerVelocity["Vy"] = 0;
        this.applyMoveX();
        this.applyMoveY();
    }
    private applyMoveX(): void {
        this.m_rigidbody.setVelocity({
            x: this.m_playerVelocity["Vx"],
            y: this.m_rigidbody.linearVelocity.y,
        });
    }
    private applyMoveY(): void {
        this.m_rigidbody.setVelocity({
            x: this.m_rigidbody.linearVelocity.x,
            y: this.m_playerVelocity["Vy"],
        });
    }
    private setSound(volume: number, url: string, loop: number) {
        Laya.SoundManager.playSound(url, loop);
        Laya.SoundManager.setSoundVolume(volume, url);
    }
    private CameraFollower(): void {
      let player_pivot_x: number = Laya.stage.width / 2;
      let player_pivot_y: number = Laya.stage.height / 2;

        setInterval(() => {
          if(CharacterManager.m_cameraShakingTimer > 0){
            let randomSign: number = (Math.floor(Math.random() * 2) == 1) ? 1 : -1; //隨機取正負數
            Laya.stage.x = (player_pivot_x - this.m_animation.x) + Math.random() * 10 * randomSign;
            Laya.stage.y = (player_pivot_y - this.m_animation.y) + Math.random() * 10 * randomSign;
            CharacterManager.m_cameraShakingTimer--;
          }else{
            Laya.stage.x = player_pivot_x - this.m_animation.x;
            Laya.stage.y = player_pivot_y - this.m_animation.y;
          }
        }, 10); 
    }
    public static setCameraShake(timer: number){
      CharacterManager.m_cameraShakingTimer = timer;
    }
    private updateAnimation(from: CharacterStatus, to: CharacterStatus, onCallBack: () => void = null, force: boolean = false): void{
        if(this.m_state === to || this.m_animationChanging) return;
        this.m_state = to;
        console.log(from, 'convert to ', to);
        switch(this.m_state){
            case CharacterStatus.attack:
                this.m_animationChanging = true;
                this.m_animation.interval = 100;
                this.m_animation.source = 'goblin/attack_05.png,goblin/attack_06.png,goblin/attack_07.png,goblin/attack_08.png';
                this.m_animation.play();
                break;
            case CharacterStatus.idle:
                this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                break;
            case CharacterStatus.run:
                this.m_animation.source = 'goblin/run_01.png,goblin/run_02.png,goblin/run_03.png,goblin/run_04.png,goblin/run_05.png,goblin/run_06.png,goblin/run_07.png,goblin/run_08.png';
                this.m_animation.interval = 100;
                this.m_animation.play();
                break;
            default:
                this.m_animation.source = 'goblin/idle_01.png,goblin/idle_02.png,goblin/idle_03.png,goblin/idle_04.png';
                break;
        }
        onCallBack();
    }
}