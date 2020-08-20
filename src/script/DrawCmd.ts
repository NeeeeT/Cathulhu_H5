export default class DrawCmd extends Laya.Script{
    constructor(){
        super();
    }
    public static DrawLine(startX:number, startY:number, endX:number, endY:number, color:string, width:number):void{
        //畫出一條線在Laya場景上，並持續存在
        Laya.stage.graphics.drawLine(startX, startY, endX, endY, color, width);
    }
};