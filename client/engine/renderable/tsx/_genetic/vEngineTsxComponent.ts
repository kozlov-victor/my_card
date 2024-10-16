import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/_genetic/abstractTsxDOMRenderer";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {VEngineTsxRootHolder} from "@engine/renderable/tsx/_genetic/vEngineTsxRootHolder";

export abstract class VEngineTsxComponent extends BaseTsxComponent {

    private rootNativeElement:IRealNode;
    private rootVirtualElement:VirtualNode;
    private rendering:boolean = false;
    private tid:any;


    protected constructor(
        private tsxDOMRenderer:AbstractTsxDOMRenderer<any>
    ) {
        super();
        if (VEngineTsxRootHolder.ROOT) {
            // collect garbage from old root component
            VEngineTsxFactory.clean();
        }
        VEngineTsxRootHolder.ROOT = this;
    }

    public override _triggerRendering():void{
        clearTimeout(this.tid);
        this.tid = setTimeout(()=>{
            if (this.rendering) return;
            this.rendering = true;
            if (this.rootNativeElement!==undefined) {
                this.rootVirtualElement = this.tsxDOMRenderer.render(this,this.rootNativeElement);
            }
            this.rendering = false;
            this.tid = undefined;
        },1);
    }

    public mountTo(root:IRealNode):void {
        root.removeChildren();
        this.rootNativeElement = root;
        this._triggerRendering();
        this.onMounted();
    }

}
