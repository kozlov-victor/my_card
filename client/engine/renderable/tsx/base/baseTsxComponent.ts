import {VEngineTsxRootHolder} from "@engine/renderable/tsx/_genetic/vEngineTsxRootHolder";


export abstract class BaseTsxComponent implements JSX.Element {

    public static __VEngineTsxComponent = true as const;
    public __shouldBeMounted = true;

    public abstract render():JSX.Element;
    public onMounted() {}

    public _triggerRendering():void{
        VEngineTsxRootHolder.ROOT._triggerRendering();
    }

}
