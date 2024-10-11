import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Section, StaticTextItem} from "../../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {removeTailDot} from "./base";

export const StaticTextComponent = (props: IBaseProps & { item: StaticTextItem, mainForm:Section[] })=>{
    const item = props.item;
    if (!item.value) return <></>;
    const value = removeTailDot(item.value);
    return (
        <>
            {props.item.printWithNewLine && <br/>}
            {value+'. '}
        </>
    );
}