enum step{
    first,
    preScene1,
    preScene2,
}
export default class Loading2 extends Laya.Script{
    // public static isFirst: boolean;
    public static nextSceneName: string;
    prepared: boolean;
    preparedSeconds: number;
    preparedTimer = null;

    storyInfo: Laya.Text;
    loadingProgress: Laya.ProgressBar;
    anyKeyIcon: Laya.Sprite;

    storyInfoCard: string[] = [
        '８時にヒースロー空港に到着する予定です。 申し訳ないけど長居できないんですよ。 あなたは大変上手にフランス語が話せる。私もあなたと同じくらい上手に話すことができればよいのに。',
    ]


    onKeyDown(): void{
        if(!this.prepared) return;

        this.storyInfo.destroy();
        this.loadingProgress.destroy();
        this.anyKeyIcon.destroy();
        Laya.Scene.open(Loading2.nextSceneName);
    }
    onStart(): void{
        this.prepared = false;
        this.preparedSeconds = 2.5;
        this.setStoryInfoCard();
        this.setProgressBar();
        this.setAnyKeyIcon();
        Laya.stage.on(Laya.Event.CLICK, this, () => {
            if(!this.prepared) return;
            this.storyInfo.destroy();
            this.loadingProgress.destroy();
            this.anyKeyIcon.destroy();
            Laya.Scene.open(Loading2.nextSceneName);
        })

        this.preparedTimer = setInterval(()=>{
            if(this.preparedSeconds <= 0)
            {
                this.prepared = true;
                this.anyKeyIcon.visible = true;
                clearInterval(this.preparedTimer);
                Laya.Tween.to(this.anyKeyIcon, {
                    alpha: 1,
                }, 300, Laya.Ease.linearInOut);
                return;
            }
            this.preparedSeconds -= 0.5;
            Laya.Tween.to(this.loadingProgress, {
                value: this.loadingProgress.value+0.2,
            }, 400, Laya.Ease.linearInOut);
        }, 500)
    }
    setProgressBar(): void{
        this.loadingProgress = new Laya.ProgressBar("comp/prog.png");
        this.loadingProgress.size(700,20);
        this.loadingProgress.sizeGrid = "0,10,0,10";
        this.loadingProgress.pos(338,510);
        this.loadingProgress.value = 0.0;
        Laya.stage.addChild(this.loadingProgress);
    }
    setStoryInfoCard(): void{
        let randomCard: number = Math.floor(Math.random() * this.storyInfoCard.length);
        this.storyInfo = new Laya.Text();
        this.storyInfo.text = this.storyInfoCard[randomCard];
        this.storyInfo.color = "#fff";
        this.storyInfo.stroke = 3;
        this.storyInfo.strokeColor = "#000";
        this.storyInfo.font = "silver";
        this.storyInfo.fontSize = 38;
        this.storyInfo.wordWrap = true;
        this.storyInfo.size(837,180);
        this.storyInfo.pos(267, 230);
        Laya.stage.addChild(this.storyInfo);
    }
    setAnyKeyIcon(): void{
        this.anyKeyIcon = new Laya.Sprite();
        this.anyKeyIcon.loadImage('ui/anykey.png');
        this.anyKeyIcon.pos(587,420);
        this.anyKeyIcon.alpha = 0;
        this.anyKeyIcon.visible = false;
        Laya.stage.addChild(this.anyKeyIcon);
    }
}