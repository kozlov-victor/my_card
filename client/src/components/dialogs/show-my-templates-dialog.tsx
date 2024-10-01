import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";

export interface ITemplate {
    templateName: string;
    content: string;
}

export class ShowMyTemplatesDialog extends BaseTsxComponent {

    private static instance:ShowMyTemplatesDialog;
    private ref:Dialog;

    private templates:ITemplate[] = [];
    private name: string;

    constructor() {
        super();
        ShowMyTemplatesDialog.instance = this;
    }

    public static async open(name:string, templates:ITemplate[]):Promise<string> {
        this.instance.name = name;
        this.instance.templates = templates;
        return this.instance.ref.open();
    }

    private onTemplateSelected(content: string) {
        this.ref.close(content);
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el=>this.ref = el}>
                    <h4>Мої шаблони для розділу: {this.name}</h4>
                    {
                        this.templates.length>0 &&
                            <ul>
                                {this.templates.map(t=>
                                    <li onclick={_=>this.onTemplateSelected(t.content)}>{t.templateName}</li>
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