import MissionManager from "./MissionManager";
import Village from "./Village";
import ZOrderManager from "./ZOrderManager";

export default class Loading extends Laya.Script{
    resourceLoad = [
        //Audio
        'Audio/Attack/Attack0.wav',
        'Audio/Attack/Attack1.wav',
        "Audio/Bgm/BGM01.mp3",
        'Audio/EnemyHurt/EnemyHurt0.wav',
        'Audio/EnemyHurt/EnemyHurt1.wav',
        'Audio/Misc/wind.wav',
        "Audio/Misc/dash.wav",
        "Audio/Misc/cat.mp3",
        "Audio/Misc/blackhole.wav",
        //Font
        "font/silver.ttf",
        //Background
        // "Background(0912)/forest.png",
        "Background(0912)/Red Forest/Red Forest(0912).png",
        "Background(0912)/gray town(1126).png",
        "Background(0912)/Loading2.png",
        //Character
        "character/Idle.atlas",
        "character/Attack1.atlas",
        "character/Attack2.atlas",
        "character/Erosion.atlas",
        "character/Run.atlas",
        "character/Slam.atlas",
        "character/Sprint.atlas",
        "comp/WalkEffects.atlas",
        "comp/Hurt.atlas",
        //Skill
        "comp/BlackHole.atlas",
        "UI/icon/blackholeA.png",
        "UI/icon/blackholeB.png",
        "comp/BlackExplosion.atlas",
        "UI/icon/blackholeA.png",
        "UI/icon/blackholeB.png",
        "comp/NewBlood.atlas",
        "comp/Slam.atlas",
        "UI/icon/slamA.png",
        "UI/icon/slamB.png",
        "comp/Target.atlas",
        "comp/TargetSlash.atlas",
        "UI/icon/beheadA.png",
        "UI/icon/beheadB.png",
        "comp/Spike.atlas",
        "UI/icon/spikeA.png",
        "UI/icon/spikeB.png",
        "comp/NewSlash_1.atlas",
        "comp/NewSlash_2.atlas",
        "comp/SlashLight.atlas",
        "comp/FireBall.atlas",
        //Enemy
        "normalEnemy/Attack.atlas",
        "normalEnemy/Idle.atlas",
        "normalEnemy/Walk.atlas",
        "comp/NewSlahLight.atlas",
        "comp/NewSlashLight90.atlas",
        "comp/NewSlashLight-43.5.atlas",
        //UI
        'UI/mobileLeftBtn.png',
        'UI/mobileRightBtn.png',
        'UI/mobileAtkBtn.png',
        'UI/mobileSprintBtn.png',
        'UI/mobileHumanSkillBtn.png',
        'UI/mobileCatSkillBtn.png',
        'UI.png',
        "UI/Zbtn.png",
        "UI/Xbtn.png",
        "UI/Cbtn.png",
        "UI/reinforce.png",
        "UI/hp.png",
        "comp/progress.png",
        "comp/prog.png",
        "UI/arrP.png",
        "UI/arrR.png",
        "UI/reinforce.png",
        "UI/skip.png",
        "UI/skip2.png",
        'UI/ending/chooseSkill.png',
        'UI/ending/skillBox.png',
        "UI/ending/infoBox.png",
        'UI/leftArr.png',
        'UI/rightArr.png',
        'UI/ending/ending.png',
        'UI/ending/gold.png',
        'UI/ending/crystal.png',
        'UI/anykey.png',
        //Oath
        "UI/bp_100.png",
        "UI/bp_150.png",
        "UI/Box.png",
        "UI/icon/sprint.png",
        "UI/Gold.png",

        //Mission
        "UI/chioce_mission.png",
        "UI/skull.png",
        "UI/star.png",
        "UI/chioce_mission_button_Bright.png",
        "UI/chioce_mission_button_Dark.png",
        //Tutorial
        'UI/tutorial/1.png',
        'UI/tutorial/2.png',
        'UI/tutorial/3.png',
        'UI/tutorial/4.png',
        'UI/tutorial/5.png',
        'UI/tutorial/6.png',
        'UI/tutorial/7.png',
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
        ZOrderManager.setZOrder(this.loadingProgress, 101);
    }
    onProgress(value: number): void{
        this.loadingProgress.value = value;
        if(this.loadingProgress.value >= 1){
            this.loadingProgress.value = 1;
            new MissionManager().firstEnter();
            if(Village.isNewbie){
                Laya.Scene.open("Newbie_temp1.scene");
            }
            Laya.stage.removeChild(this.loadingProgress);
            this.loadingProgress.destroy();
            return;
        }
    }
}