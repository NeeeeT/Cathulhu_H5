export default class Raycast extends Laya.Script{
    constructor(){
        super();
    }
    public static _RayCast(startX:number, startY:number, endX:number, endY:number):boolean 
    {
        // var world:*= Laya.Physics.I.world;
        var world = Laya.Physics.I.world;
    
        world.RayCast(function(fixture:number, point:number, normal:number, fraction:number)
        {
            // console.log(fixture);
            // console.log(point);
            // console.log(normal);
            // console.log(fraction);
            console.log("Raycast hit!");
    
            return true;
        },
        {
            x: startX / Laya.Physics.PIXEL_RATIO,
            y: startY / Laya.Physics.PIXEL_RATIO
        },
        {
            x: endX / Laya.Physics.PIXEL_RATIO,
            y: endY / Laya.Physics.PIXEL_RATIO
        });
        return false;
    };
};