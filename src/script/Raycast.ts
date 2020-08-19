export default class Raycast extends Laya.Script{
    constructor(){
        super();
    }
    public static _RayCast(startX:number, startY:number, endX:number, endY:number, type:number):number 
    {
        // 參數5(type)定義: 1返回所有射到的物體(貫穿)；0返回第一個射到的物體(非貫穿)。

        let world = Laya.Physics.I.world;
        let hit:number = 0;//射中的物體數量
    
        world.RayCast(function(fixture, point, normal, fraction)
        {
            // console.log('射線接觸到的物體 -> ' , fixture);
            // console.log('射線交點 ->', point);
            // console.log('射線交點面的法線 ->', normal);
            // console.log('Fraction -> ', fraction);

            world.DestroyBody(fixture.m_body);
            hit++;

            return type;
        },
        {
            x: startX / Laya.Physics.PIXEL_RATIO,
            y: startY / Laya.Physics.PIXEL_RATIO
        },
        {
            x: endX / Laya.Physics.PIXEL_RATIO,
            y: endY / Laya.Physics.PIXEL_RATIO
        });
        console.log('射中物體數: ', hit, '射線類型: ', type?'貫穿':'非貫穿');
        return hit;
    };
};