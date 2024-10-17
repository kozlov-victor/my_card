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
import {createMainForm} from "./model/main-form";
import {PromptDialog} from "./components/dialogs/prompt-dialog";
import {version} from "./version.json"
import {accessor, accessorUtils} from "./model/accessor";

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
        },1000*60);
    }

    @Reactive.Method()
    private async saveSession() {
        await HttpClient.post('/save-session',this.serializeUtil.serialize(this.mainForm));
    }

    @Reactive.Method()
    private async openNewSessionDialog() {
        const agree =
            await PromptDialog.open(
                'Створити нове звернення? (Попередні дані буде втрачено)'
            );
        if (!agree) return;
        const userName = accessor.getValue('Лікар',this.mainForm);
        this.mainForm = createMainForm();
        accessor.setValue('Лікар', userName, this.mainForm);
        await HttpClient.post<void>('/save-session',this.serializeUtil.serialize(this.mainForm));
    }

    @Reactive.Method()
    private async openPrintDialog() {
        const opts:{printType:'simple'|'branded',documentType:'pdf'|'word'} = await PrintDialog.open();
        if (!opts) return;
        const form = this.mainForm.
            map(it=>({...it,items:[...it.items]})).
            filter(it=>it.expanded);
        const lastItem = form.pop()!;
        form[form.length-1].items.push(...lastItem.items);
        const title =
            accessorUtils.getPib(this.mainForm,'ui') || 'document';
        const html = this.htmlRenderUtil.render(form, title, opts.printType,opts.documentType);
        //console.log(html);
        await HttpClient.post('/save-print-session',{html,title});
        TabInteractor.trigger('onPrintReady');
    }

    render(): JSX.Element {

        if (window.name==='pdf' || window.name==='word') {
            return (
                <>
                    Ця сторінка відкрита некоректно. перезапустіть програму
                </>
            );
        }

        return (
            <>
                <button onclick={this.saveSession}>Зберігти сесію</button>
                <button onclick={this.openPrintDialog}>Друк</button>
                <div style={{width: '25px', display: 'inline-block'}}/>
                <button onclick={this.openNewSessionDialog}>Нове звернення</button>
                <div style={{display: 'inline-block', cssFloat: 'right', fontSize: '10px',color:'gray'}}>{version}</div>
                {this.mainForm.map((section, index) =>
                    <SectionComponent
                        mainForm={this.mainForm}
                        trackBy={'' + index}
                        section={section}/>)
                }
                <Dialogs/>
            </>
        );
    }
}

export class PrintWidget extends DomRootComponent{

    @Reactive.Property()
    private title = '';

    constructor() {
        super();
        this.title =
            (window.name==='pdf' || window.name==='word')?
            'Готуємо документ до друку...':
            'Ця сторінка відкрита некоректно. Закрийте її та скористайтесь кнопкою "Друк"'
        TabInteractor.listen('onPrintReady',()=>{
            location.href =
                `${location.protocol}//${location.hostname}:${location.port}/${window.name}`;
            setTimeout(()=>{
                this.title = 'Готово...';
            },10_000);
            setTimeout(()=>{
                this.title = 'Цю сторінку можна закрити';
            },15_000);
            setTimeout(()=>{
                close();
            },25_000);
        });
    }

    render(): JSX.Element {
        return (
            <div>
                {this.title}
            </div>
        );
    }

}

