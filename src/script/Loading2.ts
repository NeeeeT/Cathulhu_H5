import ZOrderManager from "./ZOrderManager";

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
    // loadingBg: Laya.Sprite;

    storyInfoCard: string[] = [
        '曾經有這麼一片森林－－它作物叢生，萬物繁榮，是人們賴以維生的『生命之林』。但如今，那裡只剩下會奪走生命的機械。',
        '其實貓貓邪神沒有必要是一隻貓，祂能以邪神之力變換成狗、人類、甚至是巨大的怪物……只不過祂習慣了，和祂平時追趕老鼠的行為一樣。',
        '人類最後的堡壘是一座城鎮，要是失去它，人們就無處可去了。',
        '機械士兵看起來相同，卻又不盡相同。就像每一個血肉生命，都有彼此的不同差異。',
        '獻祭值越多，貓貓邪神就會越興奮－－不過這對你的凡人之軀不一定是好事。',
        '珍惜你的劍，你已經沒有認識的朋友會鍛造武器了。',
        '有些時候比起戰鬥所受的傷，貓貓邪神坐在你頭上所造成的頸部損傷更加讓你痛苦不堪。但你別無他法，你絕不能開口提及祂的體重。',
        '『你應該要造一個神殿，祀奉貓貓邪神，供奉祂一些活祭品之類的喵。』',
        '『要是你膽敢對貓貓邪神的體重有意見，貓貓邪神會把你的頭扯下來喵。』',
        '『在戰鬥的時候你的動作應該要小一點，以免不小心把貓貓邪神甩下頭喵。』',
    ]


    onKeyDown(): void{
        if(!this.prepared) return;

        this.storyInfo.destroy();
        this.loadingProgress.destroy();
        this.anyKeyIcon.destroy();
        // Laya.stage.removeChild(this.loadingBg);
        // Laya.Pool.recover("loadingBg", this.loadingBg);
        Laya.Scene.open(Loading2.nextSceneName);
    }
    onStart(): void{
        this.prepared = false;
        this.preparedSeconds = 2.5;
        
        // this.loadingBg = Laya.Pool.getItemByClass("loadingBg", Laya.Sprite);
        // this.loadingBg.size(1366, 768);
        // this.loadingBg.pos(2732, 0);
        // this.loadingBg.loadImage("Background(0912)/Loading2.png");
        // Laya.stage.addChild(this.loadingBg);
        // ZOrderManager.setZOrder(this.loadingBg, 6);
        
        this.setStoryInfoCard();
        this.setProgressBar();
        this.setAnyKeyIcon();
        Laya.stage.on(Laya.Event.CLICK, this, () => {
            if(!this.prepared) return;
            this.storyInfo.destroy();
            this.loadingProgress.destroy();
            this.anyKeyIcon.destroy();
            // Laya.stage.removeChild(this.loadingBg);
            // Laya.Pool.recover("loadingBg", this.loadingBg);
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
        ZOrderManager.setZOrder(this.loadingProgress, 101);
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
        ZOrderManager.setZOrder(this.storyInfo, 101);
    }
    setAnyKeyIcon(): void{
        this.anyKeyIcon = new Laya.Sprite();
        this.anyKeyIcon.loadImage('UI/anykey.png');
        this.anyKeyIcon.pos(587, 420);
        this.anyKeyIcon.alpha = 0;
        this.anyKeyIcon.visible = false;
        Laya.stage.addChild(this.anyKeyIcon);
        ZOrderManager.setZOrder(this.anyKeyIcon, 102);
    }
}