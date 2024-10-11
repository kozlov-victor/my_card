import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {ComboSelectItem, Section, SelectItem2} from "../../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot} from "./base";

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
                let preparedCustomText = removeTailDot(customText)!;
                preparedCustomText = preparedCustomText.trim().split('\n').join(' ');
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
                    {this.getTitleComponent(this.props)}
                    <div style={{position: 'relative'}}>
                        <input
                            style={{
                                paddingRight: '20px',
                                textOverflow: 'ellipsis',
                            }}
                            dataset={{combo: 'true'}}
                            title={textValue}
                            value={textValue}
                            disabled={this.props.item.unchecked}
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

export const ComboSelectPrintComponent = (props: IBaseProps & { item: ComboSelectItem, mainForm:Section[] }) => {
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    const item = props.item;
    const value = ComboSelectComponent.getTextValue(item);
    const title = getElementPrintTitle(props.mainForm,props.item);
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {`${title}${value}. `}
        </>
    );
}