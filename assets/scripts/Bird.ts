import { _decorator, AudioSource, Color, Component, director, EventTouch, game, Game, input, Input, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { Pipa } from './Pipa';
import { GameData } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component {

    static GAME_UDAH_MULAI: boolean = false;
    static AUDIO: boolean = true;

    private nodeImage: Node;
    private btnIcon: Node;
    private curRotation: number = 0;

    private isLagiTurun: boolean = true;
    private kecepatanBurung: number = 50;
    private defaultKecepatan: number = 250;
    private gravitasi: number = 1000;
    private scoreCount: number = 0;
    private highScoreCount: number = 0;
    private isHoldingTouch: boolean = false;

    @property({ type: Node })
    private nodeSekumpulanPipa: Node;

    @property({ type: Node })
    private btnStart: Node;

    @property({ type: Node })
    private btnAudio: Node;

    @property({ type: SpriteFrame })
    private audioOn: SpriteFrame = null;

    @property({ type: SpriteFrame })
    private audioOff: SpriteFrame = null;

    @property({ type: Node })
    private score: Node;
    @property({ type: Label })
    private HighScore: Label;

    @property({ type: SpriteFrame })
    private point0: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point1: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point2: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point3: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point4: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point5: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point6: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point7: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point8: SpriteFrame = null;
    @property({ type: SpriteFrame })
    private point9: SpriteFrame = null;
    @property({ type: Node })
    private fadeEffectNode: Node = null;

    start() {
        this.nodeImage = this.node.getChildByPath("image_bird");
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onLoad() {
        this.highScoreCount = GameData.score;
        Bird.AUDIO = GameData.isMute;
        this.HighScore.string = "" + this.highScoreCount;
    }

    onTouchStart(event: EventTouch) {
        if (event.getID()=== 0) {
            // this.isLagiTurun = false;
            this.isHoldingTouch = true;
            this.kecepatanBurung = this.defaultKecepatan;
            this.nodeImage.getComponent(AudioSource).play();

        }
    }

    onTouchEnd(event: EventTouch) {
        if (event.getID() === 0) {
            this.isHoldingTouch = false;
        }
    }

    onTouchCancel(event: EventTouch) {
        if (event.getID() === 0) {
            this.isHoldingTouch = false;
        }
    }

    clickStart(event, customdata) {
        Bird.GAME_UDAH_MULAI = true;
        this.btnStart.active = false;
        this.btnAudio.active = false;
        this.btnStart.getComponent(AudioSource).play();
    }

    isAudioMute(event, customdata) {
        this.btnIcon = this.btnAudio.getChildByName("Button");
        if (this.btnIcon.name == this.audioOn.name) {
            Bird.AUDIO = true;
        } else {
            Bird.AUDIO = false;
        }
        if (Bird.AUDIO) {
            this.btnStart.getComponent(AudioSource).volume = 1;
            this.nodeImage.getComponent(AudioSource).volume = 1;
            this.nodeSekumpulanPipa.getComponent(AudioSource).volume = 1;
            this.nodeSekumpulanPipa.getChildByName("score_collider").getComponent(AudioSource).volume = 1;
            this.btnIcon.getComponent(Sprite).spriteFrame = this.audioOff;
        } else {
            this.btnStart.getComponent(AudioSource).volume = 0;
            this.nodeImage.getComponent(AudioSource).volume = 0;
            this.nodeSekumpulanPipa.getComponent(AudioSource).volume = 0;
            this.nodeSekumpulanPipa.getChildByName("score_collider").getComponent(AudioSource).volume = 0;
            this.btnIcon.getComponent(Sprite).spriteFrame = this.audioOn;
        }
    }

    update(deltaTime: number) {
        if (Bird.GAME_UDAH_MULAI) {
            let currentSpeed = 0;
            // this.kecepatanBurung -= this.gravitasi * deltaTime;
            if (this.isHoldingTouch) {
                currentSpeed = this.defaultKecepatan;
                // this.node.translate(new Vec3(0, this.kecepatanBurung * deltaTime, 0));

                // if (this.curRotation > -60) {
                //     this.curRotation -= 60 * deltaTime;
                // }
                // this.nodeImage.setRotationFromEuler(new Vec3(0, 0, this.curRotation));
            } else {
                this.kecepatanBurung -= this.gravitasi * deltaTime;
                currentSpeed = this.kecepatanBurung;
                // this.node.translate(new Vec3(0, this.kecepatanBurung * deltaTime, 0));

                // if (this.curRotation < 60) {
                //     this.curRotation += 60 * deltaTime;
                // }
                // this.nodeImage.setRotationFromEuler(new Vec3(0, 0, this.curRotation));
            }
            this.node.translate(new Vec3(0, currentSpeed * deltaTime, 0));

            if (currentSpeed < 0) {
                if (this.curRotation > -60) {
                    this.curRotation -= 120 * deltaTime;
                    if (this.curRotation < -60) this.curRotation = -60;
                }
            } else {
                if (this.curRotation < 30) {
                    this.curRotation += 120 * deltaTime;
                    if (this.curRotation > 30) this.curRotation = 30;
                }
            }
            this.nodeImage.setRotationFromEuler(new Vec3(0, 0, this.curRotation));

            if (this.isNabrakPipa(this.nodeSekumpulanPipa)) {
                this.nodeSekumpulanPipa.getComponent(AudioSource).play();
                
                Bird.GAME_UDAH_MULAI = false;
                if (GameData.score < this.scoreCount) {
                    GameData.setHighScore(this.scoreCount);
                }
                GameData.setisMute(Bird.AUDIO);
                if (this.fadeEffectNode) {
                    this.fadeEffectNode.active = true;
                    const uiOpacity = this.fadeEffectNode.getComponent(UIOpacity);
                    if (uiOpacity) {
                        uiOpacity.opacity = 0;
                        tween(uiOpacity)
                            .to(0.1, { opacity: 255 })
                            .delay(0.2)
                            .to(0.1, { opacity: 0 })
                            .call(() => {
                                this.fadeEffectNode.active = false;
                                alert("gameover");
                                director.loadScene(director.getScene().name); 
                            })
                            .start();
                    }
                }
            }

            if (this.isDapetScore(this.nodeSekumpulanPipa) && !this.nodeSekumpulanPipa.getComponent(Pipa).isUdahNambahScore()) {
                this.nodeSekumpulanPipa.getComponent(Pipa).setUdahNambahScore(true);
                this.scoreCount++;
                let scoreAsset1 = this.score.getChildByPath("score_1").getComponent(Sprite);
                let scoreAsset2 = this.score.getChildByPath("score_2").getComponent(Sprite);
                let scoreAsset3 = this.score.getChildByPath("score_3").getComponent(Sprite);
                this.nodeSekumpulanPipa.getChildByName("score_collider").getComponent(AudioSource).play();
                let tempCountScore = this.scoreCount;
                if (this.scoreCount > 99) {
                    tempCountScore /= 100;
                    tempCountScore = Math.floor(tempCountScore);
                    if (tempCountScore.toString() == this.point1.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point1;
                    } else if (tempCountScore.toString() == this.point2.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point2;
                    } else if (tempCountScore.toString() == this.point3.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point3;
                    } else if (tempCountScore.toString() == this.point4.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point4;
                    } else if (tempCountScore.toString() == this.point5.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point5;
                    } else if (tempCountScore.toString() == this.point6.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point6;
                    } else if (tempCountScore.toString() == this.point7.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point7;
                    } else if (tempCountScore.toString() == this.point8.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point8;
                    } else if (tempCountScore.toString() == this.point9.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point9;
                    } else {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                    }
                    tempCountScore = this.scoreCount;
                    tempCountScore %= 100;
                    if (tempCountScore < 99 && tempCountScore > 9) {
                        tempCountScore /= 10;
                        tempCountScore = Math.floor(tempCountScore);
                        if (tempCountScore.toString() == this.point1.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point1;
                        } else if (tempCountScore.toString() == this.point2.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point2;
                        } else if (tempCountScore.toString() == this.point3.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point3;
                        } else if (tempCountScore.toString() == this.point4.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point4;
                        } else if (tempCountScore.toString() == this.point5.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point5;
                        } else if (tempCountScore.toString() == this.point6.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point6;
                        } else if (tempCountScore.toString() == this.point7.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point7;
                        } else if (tempCountScore.toString() == this.point8.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point8;
                        } else if (tempCountScore.toString() == this.point9.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point9;
                        } else {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point0;
                        }
                        tempCountScore = this.scoreCount;
                        tempCountScore %= 10;
                        if (tempCountScore < 10) {
                            if (tempCountScore.toString() == this.point1.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point1;
                            } else if (tempCountScore.toString() == this.point2.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point2;
                            } else if (tempCountScore.toString() == this.point3.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point3;
                            } else if (tempCountScore.toString() == this.point4.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point4;
                            } else if (tempCountScore.toString() == this.point5.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point5;
                            } else if (tempCountScore.toString() == this.point6.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point6;
                            } else if (tempCountScore.toString() == this.point7.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point7;
                            } else if (tempCountScore.toString() == this.point8.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point8;
                            } else if (tempCountScore.toString() == this.point9.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point9;
                            } else {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                            }
                        }
                    }

                }
                if (this.scoreCount < 99 && this.scoreCount > 9) {
                    tempCountScore %= 100;
                    if (tempCountScore < 99 && tempCountScore > 9) {
                        tempCountScore /= 10;
                        tempCountScore = Math.floor(tempCountScore);
                        if (tempCountScore.toString() == this.point1.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point1;
                        } else if (tempCountScore.toString() == this.point2.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point2;
                        } else if (tempCountScore.toString() == this.point3.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point3;
                        } else if (tempCountScore.toString() == this.point4.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point4;
                        } else if (tempCountScore.toString() == this.point5.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point5;
                        } else if (tempCountScore.toString() == this.point6.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point6;
                        } else if (tempCountScore.toString() == this.point7.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point7;
                        } else if (tempCountScore.toString() == this.point8.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point8;
                        } else if (tempCountScore.toString() == this.point9.name) {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point9;
                        } else {
                            this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point0;
                        }
                        tempCountScore = this.scoreCount;
                        tempCountScore %= 10;
                        if (tempCountScore < 10) {
                            if (tempCountScore.toString() == this.point1.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point1;
                            } else if (tempCountScore.toString() == this.point2.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point2;
                            } else if (tempCountScore.toString() == this.point3.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point3;
                            } else if (tempCountScore.toString() == this.point4.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point4;
                            } else if (tempCountScore.toString() == this.point5.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point5;
                            } else if (tempCountScore.toString() == this.point6.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point6;
                            } else if (tempCountScore.toString() == this.point7.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point7;
                            } else if (tempCountScore.toString() == this.point8.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point8;
                            } else if (tempCountScore.toString() == this.point9.name) {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point9;
                            } else {
                                this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                            }
                        }
                    }

                }
                if (this.scoreCount < 10) {
                    if (tempCountScore.toString() == this.point1.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point1;
                    } else if (tempCountScore.toString() == this.point2.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point2;
                    } else if (tempCountScore.toString() == this.point3.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point3;
                    } else if (tempCountScore.toString() == this.point4.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point4;
                    } else if (tempCountScore.toString() == this.point5.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point5;
                    } else if (tempCountScore.toString() == this.point6.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point6;
                    } else if (tempCountScore.toString() == this.point7.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point7;
                    } else if (tempCountScore.toString() == this.point8.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point8;
                    } else if (tempCountScore.toString() == this.point9.name) {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point9;
                    } else {
                        this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                    }
                }
                if (this.scoreCount % 100 == 0) {
                    this.score.getChildByPath("score_2").getComponent(Sprite).spriteFrame = this.point0;
                    this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                } else if (this.scoreCount % 10 == 0) {
                    this.score.getChildByPath("score_3").getComponent(Sprite).spriteFrame = this.point0;
                }
                if (this.scoreCount % 20 == 0) {
                    scoreAsset1.getComponent(Sprite).color = Color.RED;
                    scoreAsset2.getComponent(Sprite).color = Color.RED;
                    scoreAsset3.getComponent(Sprite).color = Color.RED;
                } else if (this.scoreCount % 10 == 0) {
                    scoreAsset1.getComponent(Sprite).color = Color.BLUE;
                    scoreAsset2.getComponent(Sprite).color = Color.BLUE;
                    scoreAsset3.getComponent(Sprite).color = Color.BLUE;
                }
            }
        }

    }

    isNabrakPipa(nodeSekumpulanPipa: Node): boolean {
        let pipa1 = nodeSekumpulanPipa.getChildByPath("pipa_1");
        let pipa2 = nodeSekumpulanPipa.getChildByPath("pipa_2");

        let wBird = this.nodeImage.getComponent(UITransform).width;
        let hBird = this.nodeImage.getComponent(UITransform).height;
        let curLeftBird = this.nodeImage.worldPosition.x - wBird / 2;
        let curRightBird = this.nodeImage.worldPosition.x + wBird / 2;
        let curTopBird = this.nodeImage.worldPosition.y + hBird / 2;
        let curBottomBird = this.nodeImage.worldPosition.y - hBird / 2;

        let wPipa1 = pipa1.getComponent(UITransform).width;
        let hPipa1 = pipa1.getComponent(UITransform).height;
        let curLeftPipa1 = pipa1.worldPosition.x - wPipa1 / 2;
        let curRightPipa1 = pipa1.worldPosition.x + wPipa1 / 2;
        let curTopPipa1 = pipa1.worldPosition.y + hPipa1 / 2;
        let curBottomPipa1 = pipa1.worldPosition.y - hPipa1 / 2;

        if (curLeftBird <= curRightPipa1 &&
            curRightBird >= curLeftPipa1 &&
            curTopBird > curBottomPipa1 &&
            curBottomBird < curTopPipa1) {
            return true;
        }

        let wPipa2 = pipa2.getComponent(UITransform).width;
        let hPipa2 = pipa2.getComponent(UITransform).height;
        let curLeftPipa2 = pipa2.worldPosition.x - wPipa2 / 2;
        let curRightPipa2 = pipa2.worldPosition.x + wPipa2 / 2;
        let curTopPipa2 = pipa2.worldPosition.y + hPipa2 / 2;
        let curBottomPipa2 = pipa2.worldPosition.y - hPipa2 / 2;

        if (curLeftBird <= curRightPipa2 &&
            curRightBird >= curLeftPipa2 &&
            curTopBird > curBottomPipa2 &&
            curBottomBird < curTopPipa2) {
            return true;
        }

        return false;
    }

    isDapetScore(nodeSekumpulanPipa: Node): boolean {
        let score_collider = nodeSekumpulanPipa.getChildByName("score_collider");

        let wBird = this.nodeImage.getComponent(UITransform).width;
        let hBird = this.nodeImage.getComponent(UITransform).height;
        let curLeftBird = this.nodeImage.worldPosition.x - wBird / 2;
        let curRightBird = this.nodeImage.worldPosition.x + wBird / 2;
        let curTopBird = this.nodeImage.worldPosition.y + hBird / 2;
        let curBottomtBird = this.nodeImage.worldPosition.y - hBird / 2;

        let wSC = score_collider.getComponent(UITransform).width;
        let hSC = score_collider.getComponent(UITransform).height;
        let curLeftSC = score_collider.worldPosition.x - wSC / 2;
        let curRightSC = score_collider.worldPosition.x + wSC / 2;
        let curTopSC = score_collider.worldPosition.y + hSC / 2;
        let curBottomSC = score_collider.worldPosition.y - hSC / 2;

        if (curLeftBird <= curRightSC &&
            curRightBird >= curLeftSC &&
            curTopBird > curBottomSC &&
            curBottomtBird < curTopSC) {
            return true;
        }

        return false;
    }
}


