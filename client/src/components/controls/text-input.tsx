import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Section, TextInputItem} from "../../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot, trim} from "./base";

export class TextInputComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextInputItem,mainForm:Section[]}) {
        super();
    }

    public static getValue(mainForm:Section[],item:TextInputItem) {
        return item.formula===undefined?
            item.value:
            item.formula!(mainForm);
    }

    private onKeyDown(e:KeyboardEvent) {
        const key = e.key;
        if (['ArrowRight','ArrowLeft','Backspace'].includes(key)) return;
        if (!this.props.item.allowedSymbols?.includes(key)) {
            e.preventDefault();
        }
    }

    render(): JSX.Element {
        const props = this.props;
        const value = TextInputComponent.getValue(this.props.mainForm,this.props.item);
        return (
            <>
                <div>{this.getTitleComponent(this.props)}</div>
                {
                    props.item.expandable ?
                        <textarea disabled={props.item.unchecked || props.item.disabled} className={'input'} value={value}
                                  onkeydown={e=>props.item.allowedSymbols && this.onKeyDown(e)}
                                  onchange={e => this.setValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/> :
                        <input disabled={props.item.unchecked || props.item.disabled} className={'input'} value={value}
                               onkeydown={e=>props.item.allowedSymbols && this.onKeyDown(e)}
                               oninput={e => this.setValue(this.props.item, (e.target as HTMLInputElement).value)}/>
                }
                {props.item.postfix}
            </>
        );
    }

}

export const TextInputPrintComponent = (props: IBaseProps & {item:TextInputItem,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    let value:string|JSX.Element;
    if (props.item.customPrintValue) {
        value = props.item.customPrintValue(props.mainForm);
    }
    else {
        value = trim(TextInputComponent.getValue(props.mainForm,props.item));
        value = removeTailDot(value as string);
        if (props.item.postfix) {
            value+=`${props.item.postfix}`;
            value = removeTailDot(value as string);
        }
        const title = getElementPrintTitle(props.mainForm,props.item);
        value = `${title}${value}`;
    }
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {props.item.customPrintValue && value}
            {!props.item.customPrintValue && `${value}. `}
        </>
    );
}