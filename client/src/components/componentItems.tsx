import {
    CheckBoxItem,
    CheckBoxTextItem,
    DropDownItem,
    ItemBase,
    Section,
    TextAreaItem,
    TextInputItem
} from "../model/model";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {AddMyTemplateDialog} from "./dialogs/add-my-template-dialog";
import {HttpClient} from "../httpClient";
import {ShowMyTemplatesDialog} from "./dialogs/show-my-templates-dialog";

const getTitle = (item:ItemBase<any>)=>{
    if (item.title!==undefined && (item.title as ()=>string).call!==undefined) {
        return (item.title as ()=>string)();
    }
    else return item.title;
}

const capitalize = (word?:string)=>{
    if (!word) return word;
    return word.charAt(0).toUpperCase()
    + word.slice(1);
}

const deCapitalize = (word?:string)=>{
    if (!word) return word;
    return word.charAt(0).toLowerCase()
        + word.slice(1);
}

const removeTailDot = (word?:string)=>{
    if (!word) return word;
    if (word.endsWith('.')) {
        return word.slice(0, word.length-1);
    }
    else return word;
}

const trim = (word?:string)=>{
    if (!word) return word;
    return word.trim();
}

abstract class AbstractInputBase extends BaseTsxComponent {

    @Reactive.Method()
    protected setValue(item:ItemBase<any>, value: string|boolean) {
        item.value = value;
    }

}

export class TextAreaComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextAreaItem,section:Section}) {
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
        const resp = await ShowMyTemplatesDialog.open(this.props.section.title);
        if (!resp) return;
        this.props.item.value = resp;
    }

    render(): JSX.Element {
        return (
            <>
                <div>{getTitle(this.props.item)}</div>
                <textarea value={this.props.item.value} onchange={e=>this.setValue(this.props.item,(e.target as HTMLTextAreaElement).value)}/>

                <button className={'tip-button'} onclick={_=>this.openSaveAsTemplateDialog()}>Зберегти як шаблон</button>
                <button className={'tip-button'} onclick={_=>this.openShowMyTemplatesDialog()}>Мої шаблони</button>

            </>
        );
    }

}

export const TextAreaPrintComponent = (props: IBaseProps & {item:TextAreaItem,section:Section})=>{
    let value = props.item.value;
    value = trim(value);
    if (!value) return <></>;
    return (
        <>
            {getTitle(props.item)?`${getTitle(props.item)}: `:''}
            {props.item.value && capitalize(removeTailDot(value))+'. '}
        </>
    );
}

export class TextInputComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextInputItem}) {
        super();
    }

    render(): JSX.Element {
        const props = this.props;
        const value =
            props.item.formula===undefined?
                props.item.value:
                props.item.formula();
        return (
            <>
                <div>{getTitle(this.props.item)}</div>
                {
                    props.item.expandable ?
                        <textarea disabled={props.item.formula !== undefined} className={'input'} value={value}
                                  onchange={e => this.setValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/> :
                        <input disabled={props.item.formula !== undefined} className={'input'} value={value}
                               oninput={e => this.setValue(this.props.item, (e.target as HTMLInputElement).value)}/>
                }
                {props.item.postfix}
            </>
        );
    }

}

export const TextInputPrintComponent = (props: IBaseProps & {item:TextInputItem})=>{
    let value = props.item.value;
    if (props.item.expandable) {
        value = trim(value);
    }
    if (!value) return <></>;
    value = deCapitalize(removeTailDot(value));
    if (props.item.postfix) {
        value+=` ${props.item.postfix}`;
        value = removeTailDot(value);
    }
    return (
        <>
            {`${getTitle(props.item)}: ${value}. `}
        </>
    );
}

export class DropDownComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & { item: DropDownItem }) {
        super();
    }

    @Reactive.Method()
    private setCustomValue(item:DropDownItem, value: string) {
        item.customValue = value;
    }

    render(): JSX.Element {
        const props = this.props;
        if (props.item.value===undefined) {
            props.item.value = props.item.values.find(it=>it.isDefault)?.value;
        }
        return (
            <>
                <div>{getTitle(this.props.item)}</div>
                <select
                    onchange={e => this.setValue(this.props.item, (e.target as HTMLSelectElement).value)}>
                    <option value={''}>Значення не введено</option>
                    {props.item.values.map(option =>
                        <option
                            value={option.value}
                            selected={option.isDefault || props.item.value === option.value}>{option.text ?? option.value}</option>
                    )}
                </select>
                {
                    props.item.value === 'other' &&
                    <textarea className={'input'} value={props.item.customValue}
                              onchange={e => this.setCustomValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/>
                }
            </>
        );
    }

}

export const DropDownPrintComponent = (props: IBaseProps & {item:DropDownItem})=>{
    let value = props.item.value;
    if (value==='other') {
        value = deCapitalize(removeTailDot(props.item.customValue));
    }
    if (!value) return <></>;
    return (
        <>
            {`${getTitle(props.item)}: ${value}. `}
        </>
    );
}

export class CheckBoxTextComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & { item: CheckBoxTextItem }) {
        super();
    }

    @Reactive.Method()
    private setCustomValue(item:CheckBoxTextItem, value: string) {
        item.customValue = value;
    }


    @Reactive.Method()
    protected override setValue(item: CheckBoxTextItem, value: boolean) {
        if (!value) {
            item.customValue = undefined;
        }
        item.value = value;
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>
                    {getTitle(this.props.item)}
                    <input type='checkbox' checked={props.item.value}
                           onchange={e => this.setValue(props.item, (e.target as HTMLInputElement).checked)}/>
                </div>
                {
                    <textarea className={'input'} value={props.item.customValue}
                              disabled={!props.item.value}
                              onchange={e => this.setCustomValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/>
                }
            </>
        );
    }


}

export const CheckBoxTextPrintComponent = (props: IBaseProps & {item:CheckBoxTextItem})=>{
    if (!props.item.value) return <></>;
    else return (
        <div className={'item'}>
            {getTitle(props.item)}
            {
                props.item.customValue ?
                    <>
                        {`: ${removeTailDot(props.item.customValue)}. `}
                    </>:'. '
            }
        </div>
    );
}

export class CheckBoxComponent extends AbstractInputBase {

    private static cnt = 0;

    private id = CheckBoxComponent.cnt++;

    constructor(private props: IBaseProps & { item: CheckBoxItem }) {
        super();
    }


    @Reactive.Method()
    protected override setValue(item: CheckBoxItem, value: boolean) {
        if (!value) {
            item.customValue = undefined;
        }
        item.value = value;
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>
                    <label htmlFor={'el_'+this.id}>{getTitle(this.props.item)}</label>
                </div>
                <input id={'el_'+this.id} type='checkbox' checked={props.item.value}
                       onchange={e => this.setValue(props.item, (e.target as HTMLInputElement).checked)}/>
            </>
        );
    }

}

export const CheckBoxPrintComponent = (props: IBaseProps & {item:CheckBoxItem})=>{
    if (!props.item.value) return <></>;
    else return (
        <>
            {`${getTitle(props.item)}. `}
        </>
    );
}