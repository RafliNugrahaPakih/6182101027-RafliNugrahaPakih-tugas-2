import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData{
    static score: number=0;
    static isMute: boolean=false;

    static setHighScore(value:number){
        GameData.score = value;
    }

    static setisMute(value:boolean){
        GameData.isMute = value;
    }

}


