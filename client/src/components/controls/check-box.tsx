import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {CheckBoxItem, Section} from "../../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {AbstractInputBase, getElementPrintTitle, getElementTitle} from "./base";

export class CheckBoxComponent extends AbstractInputBase {

    private static cnt = 0;

    private id = CheckBoxComponent.cnt++;

    constructor(private props: IBaseProps & { item: CheckBoxItem, mainForm:Section[] }) {
        super();
    }

    render(): JSX.Element {
        const props = this.props;
        return (
            <>
                <div>
                    <label htmlFor={'el_'+this.id}>{getElementTitle(this.props.mainForm,this.props.item)}</label>
                </div>
                <input id={'el_'+this.id} type='checkbox' checked={!props.item.unchecked}
                       onchange={e => this.checkUncheck(props.item, (e.target as HTMLInputElement).checked)}/>
            </>
        );
    }

}

export const CheckBoxPrintComponent = (props: IBaseProps & {item:CheckBoxItem,mainForm:Section[]})=>{
    if (props.item.unchecked || props.item.doesNotPrint) return <></>;
    const title = getElementPrintTitle(props.mainForm,props.item, true);
    if (!title) return <></>;
    return (
        <>
            {`${title}. `}
        </>
    );
}