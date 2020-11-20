import value from "*.glsl";
import MissionManager from "./MissionManager";
import Village from "./Village";

export default class Loading extends Laya.Script{
    resourceLoad = [ 
        "Audio/Bgm/BGM01.wav", 'Audio/Attack/Attack0.wav', 'Audio/Attack/Attack1.wav', 'Audio/EnemyHurt/EnemyHurt0.wav', 'Audio/EnemyHurt/EnemyHurt1.wav',
        "font/silver.ttf",
        "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
        "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas","character/Sprint.atlas",
        "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas", "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas",
        "ui/arrP.png", "ui/arrR.png", "ui/skull.png", "ui/reinforce.png", "ui/skip.png", "ui/skip2.png", 'ui/ending/chooseSkill.png', 'ui/ending/skillBox.png', "ui/ending/infoBox.png", 'ui/leftArr.png', 'ui/rightArr.png',
        'ui/ending/ending.png', 'ui/ending/gold.png', 'ui/ending/crystal.png',
        'ui/tutorial/1.png', 'ui/tutorial/2.png', 'ui/tutorial/3.png', 'ui/tutorial/4.png', 'ui/tutorial/5.png', 'ui/tutorial/6.png', 'ui/tutorial/7.png'
    ];

    loadingProgress: Laya.ProgressBar;

    onStart(): void{
        this.setProgressBar();
        Laya.loader.load(this.resourceLoad, null, Laya.Handler.create(this, this.onProgress, null, false))
    }
    setProgressBar(): void{
        this.loadingProgress = new Laya.ProgressBar("comp/loading.png");
        this.loadingProgress.width = 700;
        this.loadingProgress.height = 20;
        this.loadingProgress.sizeGrid = "5,5,5,5";
        this.loadingProgress.pos(333,487);
        this.loadingProgress.value = 0
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
    // onChange(value: number): void{
    //     console.log(Math.floor(value*100));
    // }
}