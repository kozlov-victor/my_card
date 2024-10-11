import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

interface IModel {
    name:string;
    content?:string;
    templateName:string;
}

export class AddMyTemplateDialog extends BaseTsxComponent {

    private static instance:AddMyTemplateDialog;
    private ref:Dialog;

    private model:IModel = {} as IModel;

    constructor() {
        super();
        AddMyTemplateDialog.instance = this;
    }

    public static async open(name:string,content?:string) {
        this.instance.model = {name,content,templateName:'Новий шаблон'};
        return this.instance.ref.open();
    }

    @Reactive.Method()
    private setTemplateName(val:string) {
        this.model.templateName = val;
    }

    @Reactive.Method()
    private setContent(val:string) {
        this.model.content = val;
    }

    @Reactive.Method()
    private save() {
        return this.ref.close(this.model);
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el=>this.ref = el} title={`Створення шаблону для розділу: ${this.model.name}`}>

                    <input
                        value={this.model.templateName}
                        oninput={e => this.setTemplateName((e.target as HTMLInputElement).value)}/>

                    <hr/>

                    <textarea
                        style={
                            {
                                width:'100%',
                                height: '100px'
                            }
                        }
                        value={this.model.content} onchange={e=>this.setContent((e.target as HTMLTextAreaElement).value)}/>

                    <button disabled={!this.model.templateName} onclick={_=>this.save()}>Зберегти</button>
                </Dialog>
            </>
        );
    }

}