import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";
import {ElementFactory} from "@engine/renderable/tsx/dom/internal/domElementCreator";


export class HTMLElementWrap implements IRealNode {

    public readonly attributes:Record<string, any> = {};

    private _childrenCache:HTMLElementWrap[] = [];

    constructor(public readonly htmlElement:HTMLElement|Comment|Text|SVGElement) {
    }

    public appendChild(child: HTMLElementWrap): void {
        if ((this.htmlElement as any).styleSheet && !(this.htmlElement as any).sheet) { // ie8
            (this.htmlElement as any).styleSheet.cssText=(child.htmlElement as any).data;
        }
        else this.htmlElement.appendChild(child.htmlElement);
    }

    public removeSelf(): void {
        this.htmlElement.parentNode!.removeChild(this.htmlElement);
        ElementFactory.getInstance().onElementRemoved(this.htmlElement);
    }

    public replaceChild(oldNode: HTMLElementWrap, newNode: HTMLElementWrap): void {
        ElementFactory.getInstance().onElementRemoved(oldNode.htmlElement);
        this.htmlElement.replaceChild(newNode.htmlElement,oldNode.htmlElement);
    }

    public getChildAt(index:number):HTMLElementWrap{
        if (this.htmlElement.nodeType===3) return undefined!;
        const c = (this.htmlElement as HTMLElement).childNodes[index];
        return wrap(c as HTMLElement);
    }

    private _getChildren(): HTMLElementWrap[] {
        this._childrenCache.length = 0;
        for (let i:number=0,l:number=this.htmlElement.childNodes.length;i<l;++i) {
            const c = this.htmlElement.childNodes[i];
            this._childrenCache.push(wrap(c as HTMLElement));
        }
        return this._childrenCache;
    }

    public getChildrenCount(): number {
        if (this.htmlElement.nodeType===3) return 0;
        return (this.htmlElement as HTMLElement).childNodes.length;
    }

    public getParentNode(): IRealNode {
        return wrap(this.htmlElement.parentElement as HTMLElement);
    }

    public removeChildren(): void {
        if (this.htmlElement.nodeType===3) {
            (this.htmlElement as Text).data = '';
        }
        (this.htmlElement as HTMLElement).innerHTML = '';
    }


}

const wrap = (htmlElement: HTMLElement):HTMLElementWrap=>{
    return ElementFactory.getInstance().getWrapByElement(htmlElement);
};
