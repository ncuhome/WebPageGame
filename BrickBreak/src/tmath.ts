import { Vec2 } from "kaboom";


function Normalized(vec:Vec2):Vec2{
    let tmp=Math.sqrt(1/vec.x*vec.x+vec.y*vec.y);
    return new Vec2(vec.x*tmp,vec.y*tmp);
}

//Get Pos Normal vector
function GetNormalVector(posA:Vec2,posB:Vec2 ):Vec2{
    return new Vec2(posA.x-posB.x,posA.y-posB.y);
}
//Get reflection vector
function GetReflectionVector(vec:Vec2,normalvec:Vec2):Vec2{
    vec=Normalized(vec);
    normalvec=Normalized(normalvec);
    let tmpT=2*(vec.x*normalvec.x+vec.y*normalvec.y);
    return new Vec2(vec.x-normalvec.x*tmpT,vec.y-normalvec.y*tmpT);
}