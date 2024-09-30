import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";
import {SectionComponent} from "./components/section";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {SerializeUtil} from "./utils/serialize-util";
import {HttpClient} from "./httpClient";
import {Dialogs} from "./components/dialogs/dialogs";
import {PrintDialog} from "./components/dialogs/print-dialog";
import {HtmlRendererUtil} from "./utils/html-renderer-util";
import {TabInteractor} from "./utils/tab-interactor";
import {Section} from "./model/model";
import {createMainForm, getValue, setValue} from "./model/main-form";
import {PromptDialog} from "./components/dialogs/prompt-dialog";


export class MainWidget extends DomRootComponent {

    private serializeUtil = new SerializeUtil();
    private htmlRenderUtil = new HtmlRendererUtil();
    private mainForm:Section[] = [];

    @Reactive.Method()
    override async onMounted() {
        super.onMounted();

        this.mainForm = createMainForm();
        const session = await HttpClient.post<any>('/load-session');
        this.serializeUtil.deserialize(this.mainForm, session);

        setInterval(()=>{
            HttpClient.post('/save-session', this.serializeUtil.serialize(this.mainForm));
        },1000*30);
    }

    @Reactive.Method()
    private async saveSession() {
        await HttpClient.post('/save-session',this.serializeUtil.serialize(this.mainForm));
    }

    @Reactive.Method()
    private async openNewSessionDialog() {
        const agree =
            await PromptDialog.open(
                'Створити нове звернення?'
            );
        if (!agree) return;
        const userName = getValue('Лікар',this.mainForm);
        this.mainForm = createMainForm();
        setValue('Лікар', userName, this.mainForm);
        await HttpClient.post<any>('/save-session',this.serializeUtil.serialize(this.mainForm));
    }

    @Reactive.Method()
    private async openPrintDialog() {
        const printType = await PrintDialog.open();
        if (printType!==undefined) {
            const html = this.htmlRenderUtil.render(this.mainForm, printType);
            console.log(html);
            await HttpClient.post('/save-print-session',{html});
            TabInteractor.trigger();
        }
    }

    render(): JSX.Element {
        return (
            <>
                <button onclick={this.saveSession}>Зберігти сесію</button>
                <button onclick={this.openPrintDialog}>Друк</button>
                <div style={{width:'25px',display:'inline-block'}}/>
                <button onclick={this.openNewSessionDialog}>Нове звернення</button>
                {this.mainForm.map((section,index)=>
                    <SectionComponent
                        mainForm={this.mainForm}
                        trackBy={''+index}
                        section={section}/>)
                }
                <Dialogs/>
            </>
        );
    }
}

export class PrintWidget extends DomRootComponent{

    constructor() {
        super();
        TabInteractor.listen(()=>{
            location.href =
                `${location.protocol}//${location.hostname}:${location.port}/pdf`;
        });

    }

    render(): JSX.Element {
        return (
            <div style={{textAlign: 'center', paddingTop: '300px'}}>
                Готуємо документ до друку...
            </div>
        );
    }

}

