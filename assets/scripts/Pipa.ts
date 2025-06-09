import { _decorator, CCFloat, Component, Node, randomRangeInt, Vec3 } from 'cc';
import { Bird } from './Bird';
const { ccclass, property } = _decorator;

@ccclass('Pipa')
export class Pipa extends Component {
    
        private speed:Vec3;
        @property({type: CCFloat})
        private speedX:number = -288;

    private udahNambahScore:boolean = false;
    start() {
        this.speed = new Vec3(this.speedX,0,0);
    }

    update(deltaTime: number) {
        if(Bird.GAME_UDAH_MULAI){
            this.speed.x = this.speedX*deltaTime;
            this.node.translate(this.speed);
            if(this.node.position.x<-288){
                this.node.translate(new Vec3(288,0,0));
            }
            if(this.node.position.x<-182){
                this.udahNambahScore = false;
                if(this.node.position.y<=0){
                    this.node.translate(new Vec3(185+182,randomRangeInt(100,150),0));
                }else{
                    this.node.translate(new Vec3(185+182,randomRangeInt(-50,0),0));
                }
            }
        }
    }

    setUdahNambahScore(value:boolean){
        this.udahNambahScore = value;
    }

    isUdahNambahScore():boolean{
        return this.udahNambahScore;
    }
}


