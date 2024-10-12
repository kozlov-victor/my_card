import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {HttpClient} from "../../httpClient";
import {PromptDialog} from "./prompt-dialog";
import {AlertDialog} from "./alert-dialog";

export interface ITemplate {
    content?:string;
    templateName:string;
}

export class AddMyTemplateDialog extends BaseTsxComponent {

    private static instance:AddMyTemplateDialog;
    private ref:Dialog;

    private template:ITemplate = {} as ITemplate;
    private category:string;
    private index?:number;

    constructor() {
        super();
        AddMyTemplateDialog.instance = this;
    }

    @Reactive.Method()
    public static async open(template:ITemplate,category:string,index?:number):Promise<ITemplate & {template:ITemplate,extra:{category:string,index?:number,force:boolean}}> {
        this.instance.template = template;
        this.instance.category = category;
        this.instance.index = index;
        return this.instance.ref.open();
    }

    @Reactive.Method()
    public static async editTemplate(template:ITemplate,category:string,index?:number) {
        const model = await AddMyTemplateDialog.open(template,category,index);
        if (!model) return;
        let resp = await HttpClient.post<{result:'ok'|'duplication'}>('/save-as-template',model);
        if (resp.result==='duplication') {
            if ((await PromptDialog.open(`Запис "${model.template.templateName}" вже існує. Перезаписати?`))) {
                model.extra.force = true;
                resp = await HttpClient.post<{result:'ok'|'duplication'}>('/save-as-template',model);
                if (resp.result!=='ok') {
                    await AlertDialog.open('Помилка збереження!');
                }
            }
            else {
                await AddMyTemplateDialog.editTemplate(model.template,category,index);
            }
        }
    }

    @Reactive.Method()
    private setTemplateName(val:string) {
        this.template.templateName = val;
    }

    @Reactive.Method()
    private setContent(val:string) {
        this.template.content = val;
    }

    @Reactive.Method()
    private save() {
        return this.ref.close({template:this.template,extra:{category:this.category,index:this.index,force:false}});
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el=>this.ref = el} title={`${this.index===undefined?'Створення':'Редагування'} шаблону для розділу: ${this.category}`}>

                    <input
                        value={this.template.templateName}
                        oninput={e => this.setTemplateName((e.target as HTMLInputElement).value)}/>

                    <hr/>

                    <textarea
                        style={
                            {
                                width:'100%',
                                height: '100px'
                            }
                        }
                        value={this.template.content} onchange={e=>this.setContent((e.target as HTMLTextAreaElement).value)}/>

                    <button disabled={!this.template.templateName} onclick={_=>this.save()}>Зберегти</button>
                </Dialog>
            </>
        );
    }

}