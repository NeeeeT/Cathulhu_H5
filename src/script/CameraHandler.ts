export default class CameraHandler extends Laya.Script {
  constructor() {
    super();
  }
  public static CameraFollower(sprite: Laya.Sprite): void {
    setInterval(() => {
      let player_pivot_x: number = Laya.stage.width / 2;
      let player_pivot_y: number = Laya.stage.height / 2;
      Laya.stage.x = player_pivot_x - sprite.x;
      Laya.stage.y = player_pivot_y - sprite.y;
    }, 10);
  }
}