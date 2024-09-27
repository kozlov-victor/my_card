import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export abstract class AbstractElementCreator<T> {

    public abstract createElementByTagName(node:VirtualNode): T;
    public abstract setProps(model:T,virtualNode:VirtualNode,parent:IRealNode):void;

}
