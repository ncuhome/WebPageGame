//by tsukuYomi

namespace pool{
    export interface IPoolObject{
        poolId:number;
        //reset self and hidden
        ResetSelf():void;
    }


    export class ObjectPool<T extends IPoolObject>{
        private nullPoolPtrArray:Array<number>;
        private objectPool:Array<T>; 
        private nullPtrHead:number;
        private poolSize:number;
        
        c: {new(): T; }

        public constructor(){
            this.nullPoolPtrArray=Array<number>(0);
            this.objectPool=Array<T>(0);
            this.poolSize=0;
            this.nullPtrHead=0;
        }

        public GetObject():T{
            if(this.nullPtrHead==this.poolSize){
                this.poolSize=this.objectPool.push(new this.c());
                this.objectPool[this.nullPtrHead].ResetSelf();
                this.objectPool[this.nullPtrHead].poolId=this.nullPtrHead;
                this.nullPoolPtrArray.push(this.poolSize);
                return this.objectPool[this.nullPtrHead++];
            }else{
                let tmpPtr=this.nullPtrHead;
                this.nullPtrHead=this.nullPoolPtrArray[this.nullPtrHead];
                return this.objectPool[tmpPtr];
            }
        }

        public DestroyObject(tmp:T):void{
            tmp.ResetSelf();
            this.nullPoolPtrArray[tmp.poolId]=this.nullPtrHead;
            this.nullPtrHead=tmp.poolId;
        }
    }
}

