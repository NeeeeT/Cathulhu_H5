export default class SceneDestroyer extends Laya.Script{
    public static wake = () => {
        let allScene = Laya.Scene.unDestroyedScenes;
        allScene.forEach((e) => {
            Laya.Scene.destroy(e.url);
        });
        // console.log('刪除所有scene!');
    }
}