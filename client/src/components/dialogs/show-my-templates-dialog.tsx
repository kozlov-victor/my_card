import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {AddMyTemplateDialog} from "./add-my-template-dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {PromptDialog} from "./prompt-dialog";
import {HttpClient} from "../../httpClient";

export interface ITemplate {
    templateName: string;
    content: string;
}

export class ShowMyTemplatesDialog extends BaseTsxComponent {

    private static instance:ShowMyTemplatesDialog;
    private ref:Dialog;

    private templates:ITemplate[] = [];
    private category:string;

    constructor() {
        super();
        ShowMyTemplatesDialog.instance = this;
    }

    @Reactive.Method()
    public static async open(category:string, templates:ITemplate[]):Promise<string> {
        this.instance.category = category;
        this.instance.templates = templates;
        return this.instance.ref.open();
    }

    private onTemplateSelected(content: string) {
        this.ref.close(content);
    }

    @Reactive.Method()
    private async editTemplate(template:ITemplate,index:number) {
        this.ref.close(undefined);
        await AddMyTemplateDialog.editTemplate(template,this.category,index);
    }

    @Reactive.Method()
    private async deleteTemplate(template:ITemplate,index:number) {
        if (!(await PromptDialog.open(`Видалити шаблон "${template.templateName}"?`))) {
            return;
        }
        await HttpClient.post('/delete-template',{category:this.category,index});
        this.templates.splice(index,1);
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el=>this.ref = el} title={`Мої шаблони для розділу: ${this.category}`}>
                    {
                        this.templates.length>0 &&
                            <ul>
                                {this.templates.map((t,index)=>
                                    <li title={t.content}>
                                        <button onclick={_=>this.deleteTemplate(t,index)} title={'видалити'} className={'tip-button'}>⌫</button>
                                        <button onclick={_=>this.editTemplate(t,index)} title={'редагувати'} className={'tip-button'}>✎</button>
                                        <span
                                            style={{display:'inline-block',padding:'5px',cursor:'pointer'}}
                                            onclick={_=>this.onTemplateSelected(t.content)}>
                                            {t.templateName}
                                        </span>
                                    </li>
                                )}
                            </ul>
                    }
                    {
                        this.templates.length==0 &&
                        'Персональних шаблонів для цього розділу ще немає'
                    }
                </Dialog>
            </>
        );
    }

}