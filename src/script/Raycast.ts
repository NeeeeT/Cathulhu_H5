export default class Raycast extends Laya.Script{
    constructor(){
        super();
    }
    public static _RayCast(startX:number, startY:number, endX:number, endY:number, direction:number):object 
    {
        // 參數5(direction)定義: 1為正向(朝右)，0為反向(朝左)。
        let world = Laya.Physics.I.world;
        let hit: number = 0;//射中的物體數量
        // let rigidbody_arr: Laya.RigidBody[] = [];
        
        let sprite_arr: Laya.Sprite[] = [];
        
        world.RayCast(function(fixture, point, normal, fraction)
        {
            /* Here's the raycast callback*/
            let rigidbody:Laya.RigidBody = fixture.m_body as Laya.RigidBody;
            let sprite:Laya.Sprite = fixture.collider.owner as Laya.Sprite;

            // rigidbody_arr.push(rigidbody);
            sprite_arr.push(sprite);
            hit++;
        },
        { x: startX / Laya.Physics.PIXEL_RATIO, y: startY / Laya.Physics.PIXEL_RATIO },
        { x: endX / Laya.Physics.PIXEL_RATIO, y: endY / Laya.Physics.PIXEL_RATIO });

        console.log('射中物體數: ', hit);
        // console.log(sprite_arr.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0));//待熟練此函數
        return {
            'Hit': hit,
            'Sprite': (direction) ? sprite_arr.sort((a, b) => a.x < b.x ? -1 : a.x > b.x ? 1 : 0) : sprite_arr.sort((a, b) => a.x > b.x ? -1 : a.x > b.x ? 1 : 0),
        };
    };
};