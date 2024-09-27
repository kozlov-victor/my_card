export interface IRealNode {
    removeSelf():void;
    replaceChild(oldNode:IRealNode,newNode:IRealNode):void;
    appendChild(child:IRealNode):void;
    getChildAt(index:number):IRealNode;
    getParentNode():IRealNode;
    removeChildren():void;
    getChildrenCount():number;
}
