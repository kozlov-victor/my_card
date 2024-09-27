import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {HttpClient} from "../../httpClient";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

interface ITemplate {
    templateName: string;
    content: string;
}

export class ShowMyTemplatesDialog extends BaseTsxComponent {

    private static instance:ShowMyTemplatesDialog;
    private ref:Dialog;

    private templates:ITemplate[] = [];
    private name: string;

    @Reactive.Property() private loading = false;

    @Reactive.Property() private error = false;

    constructor() {
        super();
        ShowMyTemplatesDialog.instance = this;
    }

    public static async open(name:string):Promise<string> {
        this.instance.name = name;
        const result = this.instance.ref.open();
        this.instance.loading = true;
        try {
            this.instance.templates = await HttpClient.post<ITemplate[]>('/get-my-templates',{name});
        }
        catch (e) {
            this.instance.error = true;
        }
        finally {
            this.instance.loading = false;
        }
        return result;
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
                        this.loading && 'Завантаження...'
                    }
                    {
                        !this.loading && this.templates.length>0 &&
                            <ul>
                                {this.templates.map(t=>
                                    <li onclick={_=>this.onTemplateSelected(t.content)}>{t.templateName}</li>
                                )}
                            </ul>
                    }
                    {
                        !this.loading && !this.error && this.templates.length==0 &&
                        'Немає персональних шаблонів'
                    }
                    {
                        this.error && 'Помилка'
                    }
                </Dialog>
            </>
        );
    }

}