import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Section, TextAreaItem} from "../../model/model";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {AddMyTemplateDialog} from "../dialogs/add-my-template-dialog";
import {HttpClient} from "../../httpClient";
import {ITemplate, ShowMyTemplatesDialog} from "../dialogs/show-my-templates-dialog";
import {ActionButton} from "../action-button";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot, trim} from "./base";

export class TextAreaComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & { item: TextAreaItem, section: Section, mainForm: Section[] }) {
        super();
    }

    @Reactive.Method()
    private async openSaveAsTemplateDialog() {
        const resp = await AddMyTemplateDialog.open(this.props.section.title, this.props.item.value);
        if (!resp) return;
        await HttpClient.post('/save-as-template',resp);
    }

    @Reactive.Method()
    private async openShowMyTemplatesDialog() {
        const name = this.props.section.title;
        const templates = await HttpClient.post<ITemplate[]>('/get-my-templates',{name})
        const resp = await ShowMyTemplatesDialog.open(name, templates);
        if (!resp) return;
        this.props.item.value = resp;
    }

    render(): JSX.Element {
        const shouldHideCheckBox =
            this.props.section.items.length===1 ||
            this.props.section.items.indexOf(this.props.item)===0;
        const titleComponent =
            shouldHideCheckBox?
                {title:getElementTitle(this.props.mainForm, this.props.item),disabled:false}:
                {title:this.getTitleComponent(this.props),disabled: this.props.item.unchecked};
        return (
            <>
                <div>{titleComponent.title}</div>
                <textarea value={this.props.item.value}
                      disabled={titleComponent.disabled}
                      onchange={e => this.setValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/>
                <ActionButton trackBy={this.props.trackBy} action={()=>this.openSaveAsTemplateDialog()}>Зберегти як шаблон</ActionButton>
                <ActionButton trackBy={this.props.trackBy} action={()=>this.openShowMyTemplatesDialog()}>Мої шаблони</ActionButton>
            </>
    );
    }

}

export const TextAreaPrintComponent = (props: IBaseProps & {item:TextAreaItem,section:Section,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    let value = props.item.value;
    value = removeTailDot(trim(value));
    if (!value) return <></>;
    const title = getElementPrintTitle(props.mainForm,props.item);
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {title}
            <div style={{whiteSpace:'pre'}}>
                {`${value}.`}
            </div>
    </>
);
}