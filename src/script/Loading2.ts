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

    storyInfoCard: string[] = [
        '貓咪邪神：真身未明，形象為一隻黑色、手腳「著白襪」、有著藍色瞳孔的胖貓。據其所言，原本只是無意識的天地游靈留宿於貓的身上，但藉由薩德里地區人們的負面情緒及腐敗的血肉漸漸污染靈魂而成為邪神。無名的他希望藉由「載體」發揮他的力量，積極獲取力量的來源，成為邪神之王。',
        '主角：白色短髮微微遮住左眼，瞳孔棕色，長相清秀的一名小男孩。相較與一般人，右手只剩下一小部分，且遮住的左眼完全失明。孤兒，從小由一名年長的薩滿婆婆扶養長大，平時沉默寡言。雖然身體患有缺陷，但在狩獵時十分擅長利用陷阱以及環境，在村中也被視為戰力的一員。',
        '舊勢力為純樸的社會，信奉自然神祇，學習魔法知識以運用自然之力，因各人悟性不同，能施展的魔法因人而異，普通人僅能使用讓生活更加便利的小型魔法，但具天賦者將可施展毀滅性的大型魔法，因此人民普遍期待具備強大力量的英雄來領導。',
        '新勢力發展科技，運用機械的力量，完成過往需依靠自然之力才能辦到的事，因此在文化上深植「人定勝天」的意識，視舊勢力對神祇的信仰為迷信，試圖透過殖民制度實行教育，對大陸上的舊勢力發動大規模攻勢，先進的武裝優勢使軍隊勢如破竹，巨幅擴張的行動讓資源供應需求暴增，新勢力更加強化榨取自然資源的力道，連帶導致自然神祇的力量被削弱。',
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
        ZOrderManager.setZOrder(this.loadingProgress, 101);
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
        ZOrderManager.setZOrder(this.storyInfo, 101);
        Laya.stage.addChild(this.storyInfo);
    }
    setAnyKeyIcon(): void{
        this.anyKeyIcon = new Laya.Sprite();
        this.anyKeyIcon.loadImage('ui/anykey.png');
        this.anyKeyIcon.pos(587, 420);
        ZOrderManager.setZOrder(this.anyKeyIcon, 102);
        this.anyKeyIcon.alpha = 0;
        this.anyKeyIcon.visible = false;
        Laya.stage.addChild(this.anyKeyIcon);
    }
}