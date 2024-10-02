import {
    CheckBoxItem,
    CheckBoxTextItem,
    ItemBase, ComboSelectItem,
    Section,
    TextAreaItem,
    TextInputItem, SelectItem2, DateInputItem, StaticTextItem
} from "../model/model";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {AddMyTemplateDialog} from "./dialogs/add-my-template-dialog";
import {HttpClient} from "../httpClient";
import {ITemplate, ShowMyTemplatesDialog} from "./dialogs/show-my-templates-dialog";
import {InputMask} from "../utils/input-mask";
import {ActionButton} from "./action-button";

const getTitle = (mainForm:Section[],item:ItemBase)=>{
    if (item.title!==undefined && (item.title as ()=>string).call!==undefined) {
        return (item.title as (mainForm:Section[])=>string)(mainForm);
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
    protected setValue(item:ItemBase & {value?: string|boolean}, value?:string|boolean) {
        item.value = value;
    }

}

export class TextAreaComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextAreaItem,section:Section,mainForm:Section[]}) {
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
        const templates = await HttpClient.post<ITemplate[]>('/get-my-templates',{name:this.props.section.title})
        const resp = await ShowMyTemplatesDialog.open(this.props.section.title, templates);
        if (!resp) return;
        this.props.item.value = resp;
    }

    render(): JSX.Element {
        return (
            <>
                <div>{getTitle(this.props.mainForm,this.props.item)}</div>
                <textarea value={this.props.item.value} onchange={e=>this.setValue(this.props.item,(e.target as HTMLTextAreaElement).value)}/>

                <ActionButton trackBy={this.props.trackBy} action={()=>this.openSaveAsTemplateDialog()}>Зберегти як шаблон</ActionButton>
                <ActionButton trackBy={this.props.trackBy} action={()=>this.openShowMyTemplatesDialog()}>Мої шаблони</ActionButton>

            </>
        );
    }

}

export class DateInputComponent extends AbstractInputBase {

    private input:HTMLInputElement;

    constructor(private props: IBaseProps & {item:DateInputItem,mainForm:Section[]}) {
        super();
    }

    override onMounted() {
        super.onMounted();
        new InputMask(this.input,'DD.DD.DDDD');
    }

    render(): JSX.Element {
        return (
            <>
                <div>{getTitle(this.props.mainForm,this.props.item)}</div>
                <input
                    ref={el=>this.input = el}
                    value={this.props.item.value}
                    onchange={e=>this.setValue(this.props.item,(e.target as HTMLInputElement).value)}/>
            </>
        );
    }

}


export const DateInputPrintComponent = (props: IBaseProps & {item:DateInputItem,mainForm:Section[]})=>{
    let value = props.item.value;
    if (!value) return <></>;
    value = deCapitalize(removeTailDot(value));
    return (
        <>
            {`${getTitle(props.mainForm,props.item)}: ${value}. `}
        </>
    );
}

export const TextAreaPrintComponent = (props: IBaseProps & {item:TextAreaItem,section:Section,mainForm:Section[]})=>{
    let value = props.item.value;
    value = trim(value);
    if (!value) return <></>;
    return (
        <>
            {getTitle(props.mainForm,props.item)?`${getTitle(props.mainForm,props.item)}: `:''}
            {props.item.value && capitalize(removeTailDot(value))+'. '}
        </>
    );
}

export class TextInputComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextInputItem,mainForm:Section[]}) {
        super();
    }

    public static getValue(mainForm:Section[],item:TextInputItem) {
        return item.formula===undefined?
                item.value:
                item.formula!(mainForm);
    }

    render(): JSX.Element {
        const props = this.props;
        const value = TextInputComponent.getValue(this.props.mainForm,this.props.item);
        return (
            <>
                <div>{getTitle(this.props.mainForm,this.props.item)}</div>
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

export const TextInputPrintComponent = (props: IBaseProps & {item:TextInputItem,mainForm:Section[]})=>{
    let value = TextInputComponent.getValue(props.mainForm,props.item);
    if (props.item.expandable) {
        value = trim(value);
    }
    if (!value) return <></>;
    value = removeTailDot(value);
    if (props.item.transform==='capitalize') {
        value = capitalize(value);
    }
    else if (props.item.transform!=='asIs') {
        value = deCapitalize(value);
    }
    if (props.item.postfix) {
        value+=` ${props.item.postfix}`;
        value = removeTailDot(value);
    }
    return (
        <>
            {props.item.withNewLine && <br/>}
            {`${getTitle(props.mainForm,props.item)}: ${value}. `}
        </>
    );
}


export class CheckBoxTextComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & { item: CheckBoxTextItem,mainForm:Section[] }) {
        super();
    }

    @Reactive.Method()
    private setCustomValue(item: CheckBoxTextItem, value: string) {
        item.customValue = value;
    }


    @Reactive.Method()
    protected override setValue(item: CheckBoxTextItem, value: boolean) {
        item.value = value;
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>
                    {getTitle(this.props.mainForm,this.props.item)}
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

export const CheckBoxTextPrintComponent = (props: IBaseProps & {item:CheckBoxTextItem,mainForm:Section[]})=>{
    if (!props.item.value) return <></>;
    else return (
        <>
            {getTitle(props.mainForm,props.item)}
            {
                props.item.customValue ?
                    <>
                        {`: ${deCapitalize(removeTailDot(props.item.customValue))}. `}
                    </>:'. '
            }
        </>
    );
}

export class CheckBoxComponent extends AbstractInputBase {

    private static cnt = 0;

    private id = CheckBoxComponent.cnt++;

    constructor(private props: IBaseProps & { item: CheckBoxItem, mainForm:Section[] }) {
        super();
    }


    @Reactive.Method()
    protected override setValue(item: CheckBoxItem, value: boolean) {
        item.value = value;
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>
                    <label htmlFor={'el_'+this.id}>{getTitle(this.props.mainForm,this.props.item)}</label>
                </div>
                <input id={'el_'+this.id} type='checkbox' checked={props.item.value}
                       onchange={e => this.setValue(props.item, (e.target as HTMLInputElement).checked)}/>
            </>
        );
    }

}

export const CheckBoxPrintComponent = (props: IBaseProps & {item:CheckBoxItem,mainForm:Section[]})=>{
    if (!props.item.value) return <></>;
    else return (
        <>
            {`${getTitle(props.mainForm,props.item)}. `}
        </>
    );
}

export class ComboSelectComponent extends AbstractInputBase {

    @Reactive.Property()
    private static currentComponent:ComboSelectComponent|undefined;

    static {
        window.addEventListener('click',e=>{
            if ((e.target as HTMLElement).dataset['combo']) {
                return;
            }
            this.currentComponent = undefined;
        });
    }

    constructor(private props: IBaseProps & { item: ComboSelectItem,mainForm:Section[] }) {
        super();
    }

    private setInitialValueIfRequired(item: ComboSelectItem) {
        if (!item.valuesList) {
            item.valuesList = [];
            if (item.radioGroups) {
                for (const group of item.radioGroups) {
                    item.valuesList.push(group.find(it=>it.isDefault)?.value);
                }
            }
        }
        if (!item.valuesMap) {
            item.valuesMap??={};
            if (item.checks) {
                for (const check of item.checks) {
                    if (check.hasCustomText) {
                        item.valuesMap[check.value] = check.initialCustomText;
                    }
                    item.valuesList.push(check.isDefault?check.value:undefined);
                }
            }
            if (item.radioGroups) {
                for (const group of item.radioGroups) {
                    for (const selectItem of group) {
                        if (selectItem.hasCustomText) {
                            item.valuesMap[selectItem.value] = selectItem.initialCustomText;
                        }
                    }
                }
            }
        }
    }

    @Reactive.Method()
    private setRadioValue(groupIndex:number, value: string) {
        this.props.item.valuesList![groupIndex] = value;

        if (
            this.props.item?.radioGroups?.length===1 &&
            !this.props.item.checks
            && !this.props.item.radioGroups[0].find(it=>it.hasCustomText)
        ) {
            ComboSelectComponent.currentComponent = undefined;
        }

    }

    @Reactive.Method()
    private setCheckValue(checkIndex:number, value: string, checked:boolean) {
        const groupsNum = this.props.item.radioGroups?
            this.props.item.radioGroups.length:0;
        this.props.item.valuesList![groupsNum + checkIndex] =
            checked? value: undefined;

    }

    @Reactive.Method()
    private setCustomValue(key:string, value: string) {
        this.props.item.valuesMap![key] = value;
    }

    private static _getTextValue(segments:string[], item: ComboSelectItem, selectItem:SelectItem2) {
        if (item.valuesList!.includes(selectItem.value)) {
            if (selectItem.isUndefined) return;
            if (selectItem.hasCustomText) {
                const customText = item.valuesMap![selectItem.value];
                if (!customText && !selectItem.isCustomTextOptional) return;
                let preparedCustomText = deCapitalize(removeTailDot(customText))!;
                if (selectItem.isLabelPrintable===false && preparedCustomText) segments.push(preparedCustomText);
                else {
                    if (preparedCustomText) {
                        preparedCustomText = ` - ${preparedCustomText}`;
                        segments.push(`${selectItem.value}${preparedCustomText}`);
                    }
                    else {
                        segments.push(selectItem.value);
                    }
                }
            }
            else {
                segments.push(selectItem.value);
            }
        }
    }

    public static getTextValue(item:ComboSelectItem) {
        const segments:string[] = [];
        if (item.radioGroups) {
            for (const radioGroups of item.radioGroups) {
                for (const radioGroup of radioGroups) {
                    if (item.valuesList!.includes(radioGroup.value)) {
                        this._getTextValue(segments, item, radioGroup);
                    }
                }
            }
        }
        if (item.checks) {
            for (const check of item.checks) {
                if (item.valuesList!.includes(check.value)) {
                    this._getTextValue(segments, item, check);
                }
            }
        }
        return segments.join(', ');
    }

    render(): JSX.Element {
        const item = this.props.item;
        this.setInitialValueIfRequired(item);
        const textValue = ComboSelectComponent.getTextValue(item);
        return (
            <>
                <div>
                    {getTitle(this.props.mainForm,this.props.item)}
                    <div style={{position: 'relative'}}>
                        <input
                            style={{
                                paddingRight: '20px',
                                textOverflow: 'ellipsis',
                            }}
                            dataset={{combo: 'true'}}
                            title={textValue}
                            value={textValue}
                            onclick={_ => ComboSelectComponent.currentComponent = this} readOnly={true}/>
                        <div
                            className={`drop-tip ${ComboSelectComponent.currentComponent===this?'opened':''}`}></div>
                    </div>
                </div>
                <div
                    onclick={e => e.stopPropagation()}
                    className={'popup-wrap'}>
                    {
                        ComboSelectComponent.currentComponent === this &&
                        <>
                        <div className={'popup'}>
                                {
                                    item.radioGroups &&
                                    item.radioGroups.map((group, i) =>
                                    <ul style={{
                                        borderBottom:i==item.radioGroups!.length-1?undefined:'1px solid gray',
                                        marginBottom: i==item.radioGroups!.length-1?undefined:'5px',}}>
                                        {
                                            group.map((selectItem,j) =>
                                                <li style={{padding:'0'}}>
                                                    <label
                                                        style={{display:'block'}}
                                                        htmlFor={`radio_id_${i}_${j}`}>
                                                        <input
                                                            onchange={_ => this.setRadioValue(i,selectItem.value)}
                                                            value={selectItem.value}
                                                            checked={item.valuesList?.includes(selectItem.value)}
                                                            type={'radio'} name={`name_${i}`} id={`radio_id_${i}_${j}`}/>
                                                        <span>{selectItem.value}</span>
                                                        {
                                                            selectItem.hasCustomText && item.valuesList?.includes(selectItem.value) &&
                                                            <textarea className={'input'} value={item.valuesMap![selectItem.value]}
                                                                      onchange={e => this.setCustomValue(selectItem.value,(e.target as HTMLTextAreaElement).value)}/>
                                                        }
                                                    </label>
                                                </li>
                                            )
                                        }
                                    </ul>
                                )}
                                {
                                    item.checks &&
                                    <>
                                        <div style={{borderBottom:'1px solid gray', height:'1px'}}></div>
                                        <ul>
                                            {item.checks.map((check, i) =>
                                                <li style={{padding: '0'}}>
                                                    <label
                                                        style={{display: 'block'}}
                                                        htmlFor={`check_id_${i}`}>
                                                        <input
                                                            style={{margin: '5px'}}
                                                            onchange={e => this.setCheckValue(i, check.value, (e.target as HTMLInputElement).checked)}
                                                            value={check.value}
                                                            checked={item.valuesList?.includes(check.value)}
                                                            type={'checkbox'} id={`check_id_${i}`}/>
                                                        <span>{check.value}</span>
                                                    </label>
                                                    {
                                                        check.hasCustomText && item.valuesList?.includes(check.value) &&
                                                        <textarea className={'input'}
                                                              value={item.valuesMap![check.value]}
                                                              onchange={e => this.setCustomValue(check.value, (e.target as HTMLTextAreaElement).value)}/>
                                                    }
                                                </li>
                                            )}
                                        </ul>
                                    </>
                                }
                            </div>
                        </>
                    }
                </div>
            </>
        );
    }


}

export const CompoSelectPrintComponent = (props: IBaseProps & { item: ComboSelectItem, mainForm:Section[] }) => {
    const item = props.item;
    const text = ComboSelectComponent.getTextValue(item);
    if (!text.length) return <></>;
    return (
        <>
            {`${getTitle(props.mainForm,props.item)}: ${text}. `}
        </>
    );
}

export const StaticTextComponent = (props: IBaseProps & { item: StaticTextItem, mainForm:Section[] })=>{
    const item = props.item;
    if (!item.value) return <></>;
    const value = removeTailDot(item.value);
    return (
        <>
            {value+'. '}
        </>
    );
}