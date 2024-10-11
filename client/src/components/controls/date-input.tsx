import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {DateInputItem, Section} from "../../model/model";
import {InputMask} from "../../utils/input-mask";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot} from "./base";

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
                <div>
                    {this.getTitleComponent(this.props)}
                </div>
                <input
                    ref={el => this.input = el}
                    value={this.props.item.value}
                    disabled={this.props.item.unchecked}
                    onchange={e => this.setValue(this.props.item, (e.target as HTMLInputElement).value)}/>
            </>
        );
    }

}


export const DateInputPrintComponent = (props: IBaseProps & {item:DateInputItem,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    let value = props.item.value ?? '';
    value = removeTailDot(value);
    const title = getElementPrintTitle(props.mainForm,props.item);
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {`${title}${value}. `}
        </>
    );
}