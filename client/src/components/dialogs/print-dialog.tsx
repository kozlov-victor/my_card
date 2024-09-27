import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

interface IModel {
    name:string;
    content?:string;
    templateName:string;
}

export class PrintDialog extends BaseTsxComponent {

    private static instance:PrintDialog;
    private ref:Dialog;


    constructor() {
        super();
        PrintDialog.instance = this;
    }

    public static async open() {
        return this.instance.ref.open();
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el=>this.ref = el}>
                    <h4>Документ готовий для друку</h4>
                    <a
                        onclick={_=>this.ref.close(undefined)} target={'_blank'} className={'button-like'} href={'/pdf'}>Відкрити pdf</a>
                </Dialog>
            </>
        );
    }

}