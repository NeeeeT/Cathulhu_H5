import MissionManager from "./MissionManager";
import Village from "./Village";

export default class Loading extends Laya.Script{
    resourceLoad = [ "Audio/Bgm/BGM1.wav", "font/silver.ttf", "normalEnemy/Attack.atlas", "normalEnemy/Idle.atlas", "normalEnemy/Walk.atlas",
        "character/Idle.atlas", "character/Attack1.atlas", "character/Attack2.atlas", "character/Run.atlas", "character/Slam.atlas",
        "character/Sprint.atlas",
        "comp/BlackHole.atlas", "comp/BlackExplosion.atlas", "comp/NewBlood.atlas", "comp/Slam.atlas", "comp/Target.atlas",
        "comp/NewSlash_1.atlas", "comp/NewSlash_2.atlas", "comp/SlashLight.atlas", "ui/loading.png",
    ];

    // loadingProgress: Laya.ProgressBar;

    onStart(): void{
        Laya.loader.load(this.resourceLoad, Laya.Handler.create(this, ()=>{
            // console.log('讀取完了!!!');
            // Laya.Scene.open("Village.scene");
            // let mission = new MissionManager();
            // mission.generateNewbieData();
            // mission.showMissionUI();
            new MissionManager().firstEnter();
            if(Village.isNewbie){
                Laya.Scene.open("Newbie.scene");
            }
        }))
    }
}