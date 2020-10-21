export enum DebuffType{
    none = 0,
    blind = 1 << 0, //失明
    bodyCrumble = 1 << 1, //肢體崩壞
    insane = 1 << 2, //理智喪失
    predator = 1 << 3, //掠食者
    decay = 0 << 4,//侵蝕
}