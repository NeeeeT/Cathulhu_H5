import ZOrderManager from "./ZOrderManager";

export default class MainToLoading extends Laya.Script{
    dirtEffect: Laya.Animation;
    windBgm: string = 'Audio/Misc/wind.wav';
    onAwake(): void{
        Laya.loader.load(this.windBgm, Laya.Handler.create(this, ()=>{
            Laya.SoundManager.playMusic(this.windBgm, 0);
            Laya.SoundManager.setMusicVolume(0.8);
        }));
    }
    onKeyDown(): void{
        this.dirtEffect.destroy();
        Laya.Scene.open('Loading.scene', true);
    }
    onStart(): void
    {
        this.createDirtEffect();
        //for mobile start
        Laya.stage.on(Laya.Event.CLICK, this, () => {
            this.dirtEffect.destroy();
            Laya.Scene.open('Loading.scene', true);
        })
        // Laya.stage.frameOnce(90, this, ()=>{
        //     Laya.SoundManager.playMusic('Audio/Misc/wind.wav', 0);
        //     Laya.SoundManager.setMusicVolume(0.8);
        // });
    }
    public createDirtEffect() {
        this.dirtEffect = new Laya.Animation();
        this.dirtEffect.source = "comp/DirtEffect.atlas";
        this.dirtEffect.scaleX = 3.4;
        this.dirtEffect.scaleY = 2;
        let posX: number = 20;
        let posY: number = -100;
        this.dirtEffect.interval = 45;
        this.dirtEffect.pos(posX , posY);
        // console.log(this.dirtEffect.pos);
        //濾鏡
        let colorMat: Array<number> =
            [
                1, 0, 0, 0, 500, //R
                0, 1, 0, 0, 500, //G
                0, 0, 1, 0, 500, //B
                0, 0, 0, 1, 0, //A
            ];
        let glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ffffff", 10, 0, 0);
        let colorFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMat);
        this.dirtEffect.filters = [colorFilter];
        this.dirtEffect.alpha = 0.5;
        // this.dirtEffect.on(Laya.Event.COMPLETE, this, function () {
        //     this.dirtEffect.destroy();
        //     this.dirtEffect.destroyed = true;
        // });
        ZOrderManager.setZOrder(this.dirtEffect, 100);
        Laya.stage.addChild(this.dirtEffect);
        this.dirtEffect.play();
    }
}