export class ExtraData extends Laya.Script{
    //此處的資料預計request資料庫取得。目前先暫時寫死數值
    public static currentData:object = {};

    e_atkDmgLevel: number;
    e_hpLevel: number;
    e_gold: number;
    e_crystal: number;

    e_cSkill: number;//以id來表示，方便儲存
    e_hSkill: number;//以id來表示，方便儲存

    e_cSkillLevel: number;
    e_hSkillLevel: number;

    constructor(){
        super();
        this.loadData();//此處用來讀取
    }
    public loadData(): void{
        // this.getJsonFromURL("https://run.mocky.io/v3/a431643d-23c5-42a6-8cee-a7152ac59470");

        this.e_atkDmgLevel = 1;
        this.e_hpLevel = 1;
        this.e_gold = 0;
        this.e_crystal = 0;
        this.e_cSkill = 1;
        this.e_hSkill = 1;


        ExtraData.currentData = {
            "atkDmgLevel": this.e_atkDmgLevel,
            "hpLevel": this.e_hpLevel,
            "gold": this.e_hpLevel,
            "crystal": this.e_crystal,
            "catSkill": this.e_cSkill,
            "humanSkill": this.e_hSkill,
            "catSkillLevel": this.e_cSkillLevel,
            "humanSkillLevel": this.e_hSkillLevel,
        }
    }
    setCooike(key: string, value: any){
        // document.cookie = `${key}=${value}`;
        // document.cookie = 'test=' + encodeURIComponent(value);
        document.cookie = "test=123";
    }
    parseCookie() {
        let cookieObj = {};
        let cookieAry = document.cookie.split(';');
        let cookie;
        
        for (let i=0, l=cookieAry.length; i<l; ++i) {
            cookie = String(cookieAry[i]).trim();
            cookie = cookie.split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        return cookieObj;
    }
    getCookieByName(name) {
        var value = this.parseCookie()[name];
        if (value) {
            value = decodeURIComponent(value);
        }

        return value;
    }
    getJsonFromURL(url: string){
        fetch(url).then(res => res.json()).then((out) =>{
            console.log("CHECK THIS JSON! ", out);
        }).catch(err =>{
            throw err
        });
    }
}