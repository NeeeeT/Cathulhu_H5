export default class MainToLoading extends Laya.Script{
    onKeyDown(): void{
        Laya.Scene.open('Loading.scene', true);
    }
}