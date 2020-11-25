export default class MainToLoading extends Laya.Script{
    dirtEffect: Laya.Animation;
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
        this.dirtEffect.filters = [colorFilter, glowFilter];
        this.dirtEffect.alpha = 0.5;
        // this.dirtEffect.on(Laya.Event.COMPLETE, this, function () {
        //     this.dirtEffect.destroy();
        //     this.dirtEffect.destroyed = true;
        // });
        Laya.stage.addChild(this.dirtEffect);
        this.dirtEffect.play();
    }
}