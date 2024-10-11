import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {CheckBoxTextItem, Section} from "../../model/model";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle, removeTailDot} from "./base";

export class CheckBoxTextComponent extends AbstractInputBase {

    constructor(private props: IBaseProps & { item: CheckBoxTextItem,mainForm:Section[] }) {
        super();
    }

    @Reactive.Method()
    private setCustomValue(item: CheckBoxTextItem, value: string) {
        item.customValue = value;
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>{this.getTitleComponent(this.props)}</div>
        {
            <textarea className={'input'} value={props.item.customValue}
            disabled={props.item.unchecked}
            onchange={e => this.setCustomValue(this.props.item, (e.target as HTMLTextAreaElement).value)}/>
        }
        </>
    );
    }


}

export const CheckBoxTextPrintComponent = (props: IBaseProps & {item:CheckBoxTextItem,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    const title = getElementPrintTitle(props.mainForm,props.item);
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {title}
            {
                props.item.customValue ?
                    <>
                        {`${removeTailDot(props.item.customValue)}. `}
                    </>:'. '
            }
    </>
);
}