export default class SceneInit extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        Laya.stage.bgColor = 'gray';
    }
}