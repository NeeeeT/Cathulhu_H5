export class ExtraData extends Laya.Script{

    public static currentData:object;

    public static loadData(): void{
        let data = Laya.LocalStorage.getItem("gameData");
        if(data){
            let Data = JSON.parse(data);
            ExtraData.currentData = {
                "atkDmgLevel": Data.atkDmgLevel,
                "hpLevel": Data.hpLevel,
                "gold": Data.gold,
                "crystal": Data.crystal,
                "catSkill": 1,
                "humanSkill": 1,
                "catSkillLevel": Data.catSkillLevel,
                "humanSkillLevel": Data.humanSkillLevel,
            }
            console.log('成功讀取檔案!');
            return;
        }
        else{
            ExtraData.currentData = {
                "atkDmgLevel": 0,
                "hpLevel": 0,
                "gold": 0,
                "crystal": 0,
                "catSkill": 1,
                "humanSkill": 1,
                "catSkillLevel": 0,
                "humanSkillLevel": 0,
            }
            ExtraData.saveData();
            console.log('創建了新的檔案');
            return;
        }
    }
    public static saveData(){
        let data = JSON.stringify(ExtraData.currentData);
        Laya.LocalStorage.setItem("gameData", data);
        console.log('儲存資料完畢');
    }

    getJsonFromURL(url: string){
        fetch(url).then(res => res.json()).then((out) =>{
            console.log("CHECK THIS JSON! ", out);
        }).catch(err =>{
            throw err
        });
    }
}