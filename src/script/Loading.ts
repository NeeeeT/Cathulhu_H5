import MissionManager from "./MissionManager";
import Village from "./Village";

export default class Loading extends Laya.Script{
    resourceLoad = [ 
        "Audio/Bgm/BGM01.mp3", 'Audio/Attack/Attack0.wav', 'Audio/Attack/Attack1.wav', 'Audio/Misc/wind.wav', 'Audio/EnemyHurt/EnemyHurt0.wav', 'Audio/EnemyHurt/EnemyHurt1.wav',
        "Audio/Misc/dash.wav", "Audio/Misc/cat.mp3",
        "font/silver.ttf",
        "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
        "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas","character/Sprint.atlas",
        "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas", "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas",
        "Background(0912)/forest.png",
        "UI/arrP.png", "UI/arrR.png", "UI/skull.png", "UI/reinforce.png", "UI/skip.png", "UI/skip2.png", 'UI/ending/chooseSkill.png', 'UI/ending/skillBox.png', "UI/ending/infoBox.png", 'UI/leftArr.png', 'UI/rightArr.png',
        'UI/ending/ending.png', 'UI/ending/gold.png', 'UI/ending/crystal.png',
        'UI/tutorial/1.png', 'UI/tutorial/2.png', 'UI/tutorial/3.png', 'UI/tutorial/4.png', 'UI/tutorial/5.png', 'UI/tutorial/6.png', 'UI/tutorial/7.png',
    ];

    loadingProgress: Laya.ProgressBar;

    onStart(): void{
        this.setProgressBar();
        Laya.loader.load(this.resourceLoad, null, Laya.Handler.create(this, this.onProgress, null, false))
    }
    setProgressBar(): void{
        this.loadingProgress = new Laya.ProgressBar("comp/prog.png");
        this.loadingProgress.width = 700;
        this.loadingProgress.height = 20;
        this.loadingProgress.sizeGrid = "0,10,0,10";
        this.loadingProgress.pos(333,487);
        this.loadingProgress.value = 0.5;
        // this.loadingProgress.changeHandler = new Laya.Handler(this, this.onChange);
        Laya.stage.addChild(this.loadingProgress);
    }
    onProgress(value: number): void{
        this.loadingProgress.value = value;
        if(this.loadingProgress.value >= 1){
            this.loadingProgress.value = 1;
            new MissionManager().firstEnter();
            if(Village.isNewbie){
                Laya.Scene.open("Newbie.scene");
            }
            this.loadingProgress.destroy();
            return;
        }
    }
}