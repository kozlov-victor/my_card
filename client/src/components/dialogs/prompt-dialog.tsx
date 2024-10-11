import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Dialog} from "../dialog/dialog";

export class PromptDialog extends BaseTsxComponent {

    private static instance:PromptDialog;
    private ref:Dialog;
    private text: string;
    private buttons:[string,string] = ['',''];

    constructor() {
        super();
        PromptDialog.instance = this;
    }

    public static async open(text:string,buttons:[string,string] = ['Так','Ні']):Promise<boolean> {
        this.instance.text = text;
        this.instance.buttons = buttons;
        return this.instance.ref.open();
    }

    render(): JSX.Element {
        return (
            <Dialog ref={el=>this.ref = el} title={'Увага!'}>
                <h3>{this.text}</h3>
                <div>
                    <button onclick={_=>this.ref.close(true)}>{this.buttons[0]}</button>
                    <button onclick={_=>this.ref.close(false)}>{this.buttons[1]}</button>
                </div>
            </Dialog>
        );
    }



}