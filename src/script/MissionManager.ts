import { ExtraData } from "./ExtraData";
import EnemyInit from "./EnemyInit";
import Village from "./Village";
import Loading2 from "./Loading2";
import ZOrderManager from "./ZOrderManager";
import SceneInit from "./SceneInit";

export default class MissionManager extends Laya.Script {
    //任務介面
    /** @prop {name:roundAddEnemy,tips:"每輪關卡會增加的敵人數量",type:int,default:5}*/
    roundAddEnemy: number = 5;
    // public static playerMissionData: object = {"round": 0, };
    public static missionRound = 0;
    public static missionDataPool: any = [];
    public static hasSetBtn: boolean = false;

    missionNum: number = 3;

    missionDifficultyArr: number[] = [];
    missionUI: Laya.Sprite = null;
    eliteIcons: Laya.Sprite[] = [];
    difficultyIcons: any = [];
    crystalNums: Laya.Text[] = [];
    moneyNums: Laya.Text[] = [];
    confirmIcons: Laya.Button[] = [];

    // currentBtn: number = 1;

    onStart() {
    }
    public firstEnter(): void{
        MissionManager.missionDataPool = []
        this.generateNewbieData();
        this.sendMissionData(MissionManager.missionDataPool[0]);
    }
    public showMissionUI(): void{
        this.missionUI = new Laya.Sprite();
        this.missionUI.loadImage("UI/chioce_mission.png");
        this.missionUI.width = 1024;
        this.missionUI.height = 576;
        this.missionUI.pos(171, 96);//(1366 - 1024) / 2, (768 - 576) / 2
        this.missionUI.alpha = 1;
        Laya.stage.addChild(this.missionUI);
        ZOrderManager.setZOrder(this.missionUI, 100);
        if (Village.isNewbie) {
            // this.setEliteIcon(0, MissionManager.missionDataPool[0]["eliteNum"]);
            // this.setDifficultyIcon(0, MissionManager.missionDataPool[0]["difficulty"]);
            // this.setRewardInfo(0, MissionManager.missionDataPool[0]["crystal"], MissionManager.missionDataPool[0]["money"]);
            // this.setConfirmIcon(0, MissionManager.missionDataPool[0]);
            
            // Laya.stage.addChild(this.eliteIcons[0]); 
            // Laya.stage.addChild(this.difficultyIcons[0]); 
            // Laya.stage.addChild(this.crystalNums[0]); 
            // Laya.stage.addChild(this.moneyNums[0]); 
            // Laya.stage.addChild(this.confirmIcons[0]); 
        } else {
            for (let i = 0; i < this.missionNum; i++) {
                this.setEliteIcon(i, MissionManager.missionDataPool[i]["eliteNum"]);
                this.setDifficultyIcon(i, MissionManager.missionDataPool[i]["difficulty"]);
                this.setRewardInfo(i, MissionManager.missionDataPool[i]["crystal"], MissionManager.missionDataPool[i]["money"]);
                this.setConfirmIcon(i, MissionManager.missionDataPool[i]);
            }
            
            for (let i = 0; i < this.eliteIcons.length; i++) { 
                Laya.stage.addChild(this.eliteIcons[i]);
                ZOrderManager.setZOrder(this.eliteIcons[i], 101);
             }
            for (let i = 0; i < this.difficultyIcons.length; i++) { 
                Laya.stage.addChild(this.difficultyIcons[i]);
                ZOrderManager.setZOrder(this.difficultyIcons[i], 101);
             }
            for (let i = 0; i < this.crystalNums.length; i++) { 
                Laya.stage.addChild(this.crystalNums[i]);
                ZOrderManager.setZOrder(this.crystalNums[i], 101);
             }
            for (let i = 0; i < this.moneyNums.length; i++) { 
                Laya.stage.addChild(this.moneyNums[i]);
                ZOrderManager.setZOrder(this.moneyNums[i], 101);
             }
            for (let i = 0; i < this.confirmIcons.length; i++) { 
                Laya.stage.addChild(this.confirmIcons[i]);
                ZOrderManager.setZOrder(this.confirmIcons[i], 101);
             }
        }
        // Laya.stage.addChildren(this.eliteIcons);
        // Laya.stage.addChildren(this.difficultyIcons);
        // Laya.stage.addChildren(this.crystalNums);
        // Laya.stage.addChildren(this.moneyNums);
        // Laya.stage.addChildren(this.confirmIcons);
    }

    public clearMissionUI(): void{
        for (let i = 0; i < this.eliteIcons.length; i++) {
            Laya.stage.removeChild(this.eliteIcons[i]);
            this.eliteIcons[i].destroy();
            this.eliteIcons[i] = null;
        }
        for (let i = 0; i < this.difficultyIcons.length; i++) {
            Laya.stage.removeChild(this.difficultyIcons[i]);
            this.difficultyIcons[i].destroy();
            this.difficultyIcons[i] = null;
        }
        for (let i = 0; i < this.crystalNums.length; i++) {
            Laya.stage.removeChild(this.crystalNums[i]);
            this.crystalNums[i].destroy();
            this.crystalNums[i] = null;
        }
        for (let i = 0; i < this.moneyNums.length; i++) {
            Laya.stage.removeChild(this.moneyNums[i]);
            this.moneyNums[i].destroy();
            this.moneyNums[i] = null;
        }
        for (let i = 0; i < this.confirmIcons.length; i++) {
            Laya.stage.removeChild(this.confirmIcons[i]);
            this.confirmIcons[i].destroy();
            this.confirmIcons[i] = null;
        }
        Laya.stage.removeChild(this.missionUI);
        this.missionUI.destroy();
        this.missionUI = null;
    }
    sendMissionData(data: object) {
        EnemyInit.missionEnemyNum = data["enemyNum"];
        EnemyInit.missionRewardCrystalValue = data["crystal"];
        EnemyInit.missionRewardGoldValue = data["money"];
    }

    setEliteIcon(col: number, eliteNum: number): void{
        let eliteIcon: Laya.Sprite = new Laya.Sprite();
        if(eliteNum > 0) eliteIcon.loadImage("UI/skull.png");
        eliteIcon.width = 49;
        eliteIcon.height = 66;
        eliteIcon.pos(171 + 198.5 + col * (256 + 34), 135 + 96); 
        this.eliteIcons.push(eliteIcon);
    }
    setDifficultyIcon(col: number, difficulty: number): void{
        let difficultyStage = 0;
        if (difficulty > 35 && difficulty <= 50) { difficultyStage = 3; }
        else if (difficulty > 20 && difficulty <= 35) { difficultyStage = 2; }
        else if (difficulty >= 5 && difficulty <= 20) { difficultyStage = 1; }
        for (let i = 0; i < difficultyStage; i++) {
            let difficultyIcon_temp: Laya.Sprite = new Laya.Sprite();
            // if (!Village.isNewbie) difficultyIcon_temp.loadImage("UI/star.png");
            difficultyIcon_temp.loadImage("UI/star.png");            
            difficultyIcon_temp.width = 39;
            difficultyIcon_temp.height = 39;
            difficultyIcon_temp.pos(171 + 137.5 + col * (256 + 34) + (131 / (difficultyStage + 1)) * (i + 1) , 308 + 10); //y: 96 + 212
            this.difficultyIcons.push(difficultyIcon_temp);
        }
    }
    setRewardInfo(col: number, crystal: number, money: number): void{
        let crystalNum = new Laya.Text();
        let moneyNum = new Laya.Text();
        crystalNum.font = "silver";
        moneyNum.font = "silver";
        crystalNum.fontSize = 45;
        moneyNum.fontSize = 45;
        crystalNum.text = crystal.toString();
        moneyNum.text = money.toString();
        crystalNum.pos(171 + 252 + 5 + col * (256 + 34), 305 + 96); //x: 262(mid baseline) + 10(offset)
        moneyNum.pos(171 + 252 + 5 + col * (256 + 34), 375 + 96);
        this.crystalNums.push(crystalNum);
        this.moneyNums.push(moneyNum);
    }
    setConfirmIcon(col: number, data: object): void{
        let confirmIcon = new Laya.Button();
        
        confirmIcon.width = 100;
        confirmIcon.height = 50;
        // confirmIcon.loadImage("UI/chioce_mission_button_Bright.png")
        confirmIcon.pos(171 + 173 + col * (256 + 34), 458 + 96);

        


        let switchSceneFunc = () => {
            if (Village.isNewbie) {
                // Laya.Scene.open("Newbie.scene");
                Loading2.nextSceneName = 'Newbie_temp.scene';
                Laya.Scene.open('Loading2.scene', true);
                // Village.isNewbie = false;
            } else {
                let x = Math.round(Math.random());
                if (x > 0.5) {
                    Laya.Scene.closeAll();
                    // Laya.Scene.open("First.scene");
                    Loading2.nextSceneName = 'First.scene';
                    // SceneInit.setBattleMap("RedForest");
                    Laya.Scene.open('Loading2.scene', true);
                } else {
                    Laya.Scene.closeAll();
                    // Laya.Scene.open("Town.scene");
                    Loading2.nextSceneName = 'Town.scene';
                    // SceneInit.setBattleMap("Town");
                    Laya.Scene.open('Loading2.scene', true);
                }
            }
        }
        let confirmFunc = () =>  {
            this.clearMissionUI();
            this.sendMissionData(data);
            switchSceneFunc();
        }
        switch (col) {
            case 0:
                confirmIcon.loadImage("UI/Zbtn.png")
                break;
            case 1:
                confirmIcon.loadImage("UI/Xbtn.png")
                break;
            case 2:
                confirmIcon.loadImage("UI/Cbtn.png")
                break;
            default:
                break;
        }
        confirmIcon.on(Laya.Event.MOUSE_MOVE, this, () => {
            confirmIcon.alpha = 0.5;
        })
        confirmIcon.on(Laya.Event.MOUSE_OUT, this, () => {
            confirmIcon.alpha = 1;
        })
        confirmIcon.off(Laya.Event.CLICK, this, confirmFunc);
        confirmIcon.off(Laya.Event.CLICK, this, confirmFunc);

        confirmIcon.on(Laya.Event.CLICK, this, confirmFunc);
        confirmIcon.on(Laya.Event.KEY_DOWN, this, (e: Laya.Event)=>{
            if(e.keyCode === 90 || e.keyCode === 88 || e.keyCode === 67){
                confirmFunc();
            }
        });
        Laya.stage.focus = confirmIcon;
        this.confirmIcons.push(confirmIcon);
    }
    public generateMissionData(total: number): any[] {
        for (let i = 0; i < total; i++) {
            if (i < total / 3) this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 105);//+35
            if (i >= total / 3 && i < total * 2 / 3) this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 55);//+20
            if(i >= total * 2 / 3) this.missionDifficultyArr.push(Math.floor(Math.random() * 15) + 5);
        }
        this.missionDifficultyArr.sort();
        this.missionDifficultyArr.reverse();
        
        for (let i = 0; i < total; i++) {
            let missionData: object = {
                id: i,
                missionName: "殲滅來犯敵軍",
                difficulty: this.missionDifficultyArr[i],
                enemyNum: Math.round((20 + this.roundAddEnemy * MissionManager.missionRound) * (1 + this.missionDifficultyArr[i] / 100)),
                // enemyNum: 3,
                enemyHp: 1000,
                enemyAtk: 100,
                eliteNum: Math.round(Math.random()),
                eliteHpMultiplier: 1.5,
                eliteAtkMultiplier: 1.5,
                // crystal: Math.round(100 + 100 * (1 + this.missionDifficultyArr[i] / 100)),
                crystal: 0,
                money: Math.round(500 + 500 * (1 + this.missionDifficultyArr[i] / 90)),//origin -> / 100
                map: "forest",
            }
            MissionManager.missionDataPool.push(missionData);
        }
        // console.log(MissionManager.missionDataPool);
        
        return MissionManager.missionDataPool;
    }
    public clearCurrentMissionData(): void{
        MissionManager.missionDataPool = [];
    }
    public generateNewbieData(): any[]{
        let missionData: object = {
            id: 0,
            missionName: "新手教學",
            difficulty: 0,
            enemyNum: 3,
            enemyHp: 5000,
            enemyAtk: 0,
            eliteNum: 0,
            eliteHpMultiplier: 1.5,
            eliteAtkMultiplier: 1.5,
            crystal: 1300,
            money: 500,
            map: "forest",
        }
        MissionManager.missionDataPool.push(missionData);
        // console.log(MissionManager.missionDataPool);
        return MissionManager.missionDataPool;
    }

}