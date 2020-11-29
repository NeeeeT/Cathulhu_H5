export default class ZOrderManager extends Laya.Script {
    constructor(parameters) {
        super();
    }
    public static setZOrder(target: Laya.Sprite | Laya.Animation | Laya.ProgressBar | Laya.Text, z: number) {
        target.zOrder = z;
        // target.setChildIndex(target, z);
        Laya.stage.updateZOrder();
    }
}