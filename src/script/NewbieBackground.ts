import CharacterInit from "./CharacterInit";

export default class NewbieBackground extends Laya.Script{
    bg1: Laya.Sprite;
    bg2: Laya.Sprite;
    bg3: Laya.Sprite;

    bg2LastX: number = 0;

    onStart(): void{
        this.backgroundImageInit();
        // Laya.timer.frameLoop(1, this, this.backgroundImageHandler);


        //以下這段僅是讓它移動
        setInterval(()=>{
            Laya.Tween.to(this.bg2, {
                x: this.bg2LastX - 5,
            }, 50, Laya.Ease.linearInOut, Laya.Handler.create(this, ()=>{
                this.bg2LastX = this.bg2.x;
            }))
        }, 50)
    }
    // onDestroy(): void{
    //     this.bg1.destroy();
    //     this.bg2.destroy();
    //     this.bg3.destroy();
    // }
    backgroundImageInit(): void{
        this.bg1 = new Laya.Sprite();
        this.bg2 = new Laya.Sprite();
        this.bg3 = new Laya.Sprite();

        this.bg1.pos(0,0);
        this.bg2.pos(0,-50);
        this.bg3.pos(0,-70)

        this.bg1.loadImage('Background/nBg1.png');
        this.bg2.loadImage('Background/nBg2.png');
        this.bg3.loadImage('Background/nBg3.png');

        Laya.stage.addChild(this.bg2);
        Laya.stage.addChild(this.bg3); 
        Laya.stage.addChild(this.bg1);
    }
    backgroundImageHandler(): void{
        //此處尚未使用到
        let player = CharacterInit.playerEnt.m_animation;
        Laya.Tween.to(this.bg2, {
            x: player.x - 500,
        }, 50, Laya.Ease.linearInOut, null);
        Laya.Tween.to(this.bg1, {
            x: player.x - 500,
        }, 10, Laya.Ease.linearInOut, null);
    }
}