//by tsukuYomi
import { GameObj, KaboomCtx, Vec2 } from "kaboom";

declare let origin:KaboomCtx['origin'];

class Buttle implements pool.IPoolObject{
    public static BULLTE_SPRITE_ID="hatjsgdsdcndy";
    public static BULLTE_SPEED=10;//per frame pixel
    public static BULLTE_TAIL_SHADOW_NUM=5;
    public poolId: number;
    public gameObject=add([
        "Buttle",
        sprite(Buttle.BULLTE_SPRITE_ID),
        pos(),
        area({shape:"circle"}),
        origin("center"),
        {
            towardVec:vec2(0,0),
        }
    ]);
    public bullteShadowArray=Array<GameObj>(Buttle.BULLTE_TAIL_SHADOW_NUM);
    constructor(){
        for(let i=0;i<Buttle.BULLTE_TAIL_SHADOW_NUM;++i){
            this.bullteShadowArray[i]=add([
                sprite(Buttle.BULLTE_SPRITE_ID),
                pos(),
                opacity(Buttle.BULLTE_TAIL_SHADOW_NUM),
                origin("center"),
            ])
        }
    }
    public ResetSelf(): void {
        this.gameObject.hidden=true;
    }
    public Init(pos:Vec2,face:Vec2){
        this.gameObject.hidden=false;
        this.gameObject.moveTo(pos);
        this.gameObject.towardVec=face;
    }
    public ButtleUpdate():void{
        this.gameObject.moveBy(
            this.gameObject.towardVec.x*Buttle.BULLTE_SPEED,
            this.gameObject.towardVec.y*Buttle.BULLTE_SPEED
        );
    }
}

