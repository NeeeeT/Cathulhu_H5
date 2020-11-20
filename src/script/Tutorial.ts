import CharacterInit from "./CharacterInit";
import EnemyHandler from "./EnemyHandler";
import EnemyInit from "./EnemyInit";
import Village from "./Village";

enum turtorialHintStep{
    none,
    tryMove,
    trySprint,
    tryAttack,
    trySkill,
    seeInfoA,
    seeInfoB,
    seeInfoC,
}

export default class Turtorial extends Laya.Script{
    currentHintStep: number;
    moveLeft: boolean = false;
    moveRight: boolean = false;
    stepChanging: boolean = false;

    currentHintUI: Laya.Sprite = new Laya.Sprite();
    
    // tryMoveLeft: Laya.Sprite = new Laya.Sprite();
    // tryMoveRight: Laya.Sprite = new Laya.Sprite();

    hintTimer = null;

    onStart(): void{
        this.resetTutorial();
    }
    // onKeyUp(e: Laya.Event): void{
    //     if(this.stepChanging) return;
    //     switch (this.currentHintStep){
    //         case turtorialHintStep.tryMove:
    //             if(e.keyCode === 37){
    //                 this.tryMoveLeft.alpha = 1;
    //             }
    //             else if(e.keyCode === 39){
    //                 this.tryMoveRight.alpha = 1;
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }
    onKeyDown(e: Laya.Event): void{
        if(this.stepChanging) return;
        switch (this.currentHintStep) {
            case turtorialHintStep.tryMove:
                if(e.keyCode === 37){
                    this.moveLeft = true;
                }
                else if(e.keyCode === 39){
                    this.moveRight = true;
                }
                if(this.moveRight && this.moveLeft){
                    this.setHintStep(turtorialHintStep.trySprint);
                }
                break;
            case turtorialHintStep.trySprint:
                if(e.keyCode === 16){
                    if(CharacterInit.playerEnt.m_canSprint)
                        this.setHintStep(turtorialHintStep.tryAttack);
                }
                break;
            case turtorialHintStep.tryAttack:
                if(EnemyInit.enemyLeftCur <= 0){
                    this.setHintStep(turtorialHintStep.trySkill);
                }
                break;
            case turtorialHintStep.trySkill:
                if(EnemyInit.enemyLeftCur <= 0){
                    this.setHintStep(turtorialHintStep.seeInfoA);
                }
                break;
            case turtorialHintStep.seeInfoA:
                if(e.keyCode === 32){
                    this.setHintStep(turtorialHintStep.seeInfoB);
                }
                break;
            case turtorialHintStep.seeInfoB:
                if(e.keyCode === 32){
                    this.setHintStep(turtorialHintStep.seeInfoC);
                }
                break;
            case turtorialHintStep.seeInfoC:
                if(e.keyCode === 32){
                    EnemyInit.newbieDone = true;
                    this.currentHintUI.destroy();
                    this.currentHintUI.destroyed = true;
                }
                break;
            default:
                break;
        }
    }
    resetTutorial(): void{
        let player = CharacterInit.playerEnt.m_animation;

        this.currentHintStep = turtorialHintStep.none;
        this.setHintStep(turtorialHintStep.tryMove);
        EnemyInit.enemyLeftCur = 0;
        this.currentHintUI.destroyed = false;

        this.hintTimer = setInterval(()=>{
            if(player.destroyed || !Village.isNewbie){
                clearInterval(this.hintTimer);
                this.hintTimer = null;
                if(!this.currentHintUI.destroyed)
                    this.currentHintUI.destroy();
                return;
            }
            if (Laya.stage.x < -250 && Laya.stage.x > -2475) {
                this.currentHintUI.pos(player.x - 150, 160);
            }
            if (Laya.stage.x >= -250) {
                this.currentHintUI.pos(935 - 150, 160);
            }
            if (Laya.stage.x <= -2475) {
                this.currentHintUI.pos(3155 - 150, 160);
            }
        })
        Laya.stage.addChild(this.currentHintUI);
    }
    setHintStep(step: number):void{
        if(this.currentHintStep === turtorialHintStep.none){
            this.currentHintUI.loadImage('ui/tutorial/1.png');
            this.currentHintStep = step;
            return;
        }
        if(step === turtorialHintStep.tryAttack || step === turtorialHintStep.trySkill){
            EnemyInit.enemyLeftCur = 3;
            let i = 0;
            let timer = setInterval(()=>{
                if(i >= 3){
                    clearInterval(timer);
                    return;
                }
                EnemyHandler.generator(CharacterInit.playerEnt.m_animation, 4, 0);
                i++;
            }, 1500);
        }
        this.currentHintStep = step;
        this.stepChanging = true;
        Laya.Tween.to(this.currentHintUI, {alpha: 0}, 1000, Laya.Ease.linearOut,
            Laya.Handler.create(this, ()=>{
                this.currentHintUI.loadImage('ui/tutorial/'+step+'.png');
                Laya.Tween.to(this.currentHintUI, {alpha: 1}, 1500, Laya.Ease.linearIn, Laya.Handler.create(this, ()=>{
                    this.stepChanging = false;
                }), 0);
        }), 0);
    }
}