import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class AlertDialog extends BaseTsxComponent {

    private static instance:AlertDialog;
    private ref:Dialog;
    private text: string;

    constructor() {
        super();
        AlertDialog.instance = this;
    }

    @Reactive.Method()
    public static async open(text:string):Promise<boolean> {
        this.instance.text = text;
        return this.instance.ref.open();
    }

    render(): JSX.Element {
        return (
            <Dialog ref={el=>this.ref = el} title={'Увага!'}>
                <h3>{this.text}</h3>
                <div>
                    <button onclick={_=>this.ref.close(false)}>Ok</button>
                </div>
            </Dialog>
        );
    }



}