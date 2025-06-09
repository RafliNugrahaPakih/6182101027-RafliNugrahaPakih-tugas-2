import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioButton')
export class AudioButton extends Component {
    
    @property({type:SpriteFrame})
    private audioOn: SpriteFrame = null;

    @property({type:SpriteFrame})
    private audioOff: SpriteFrame = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


