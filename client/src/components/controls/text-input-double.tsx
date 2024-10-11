import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot} from "./base";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Section, TextInputDoubleItem} from "../../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class TextInputDoubleComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & {item:TextInputDoubleItem,mainForm:Section[]}) {
        super();
    }

    private onKeyDown(e:KeyboardEvent) {
        const key = e.key;
        if (['ArrowRight','ArrowLeft','Backspace'].includes(key)) return;
        if (!this.props.item.allowedSymbols?.includes(key)) {
            e.preventDefault();
        }
    }

    @Reactive.Method()
    private setValue1Or2(item:TextInputDoubleItem & {value?: string}, key:'value1'|'value2',value:string) {
        item[key] = value;
    }

    public static getValue1Or2(item:TextInputDoubleItem, mainForm:Section[], key:'value1'|'value2') {
        const possibleFormula =
            key==='value1'?item.formula1:item.formula2;
        if (possibleFormula) {
            return possibleFormula(mainForm);
        }
        else return item[key];
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>{this.getTitleComponent(this.props)}</div>
                {
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                        <tbody>
                        <tr>
                            <td>
                                <input disabled={props.item.disabled || props.item.unchecked} className={'input'}
                                       value={TextInputDoubleComponent.getValue1Or2(this.props.item,this.props.mainForm,'value1')}
                                       onkeydown={e => props.item.allowedSymbols && this.onKeyDown(e)}
                                       oninput={e => this.setValue1Or2(this.props.item, 'value1',(e.target as HTMLInputElement).value)}/>
                            </td>
                            <td>
                                {props.item.postfix1}&nbsp;
                            </td>
                            <td>
                                <input disabled={props.item.disabled || props.item.unchecked} className={'input'}
                                       value={TextInputDoubleComponent.getValue1Or2(this.props.item,this.props.mainForm,'value2')}
                                       onkeydown={e => props.item.allowedSymbols && this.onKeyDown(e)}
                                       oninput={e => this.setValue1Or2(this.props.item, 'value2',(e.target as HTMLInputElement).value)}/>
                            </td>
                            <td>
                                {props.item.postfix2}&nbsp;
                            </td>
                        </tr>
                        </tbody>
                    </table>
                }
            </>
        );
    }

}

export const TextInputDoublePrintComponent = (props: IBaseProps & {item:TextInputDoubleItem,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    const title = getElementPrintTitle(props.mainForm,props.item);
    let value:string;
    value = removeTailDot(TextInputDoubleComponent.getValue1Or2(props.item,props.mainForm,'value1')) ?? '';
    value = removeTailDot(value);
    if (props.item.postfix1) {
        value+=`${props.item.postfix1}, `;
    }
    value += removeTailDot(TextInputDoubleComponent.getValue1Or2(props.item,props.mainForm,'value2'));
    if (props.item.postfix2) {
        value+=`${props.item.postfix2}`;
    }
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {`${title}${value}. `}
        </>
    );
}