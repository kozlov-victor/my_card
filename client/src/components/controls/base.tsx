import {ItemBase, Section} from "../../model/model";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";

export const getElementTitle = (mainForm:Section[], item:ItemBase)=>{
    if (item.title!==undefined && (item.title as ()=>string).call!==undefined) {
        return (item.title as (mainForm:Section[])=>string)(mainForm);
    }
    else return item.title as string;
}

export const getElementPrintTitle = (mainForm:Section[], item:ItemBase, withoutTailColumn = false)=>{
    let title:string;
    if (item.title!==undefined && (item.title as ()=>string).call!==undefined) {
        title = (item.title as (mainForm:Section[])=>string)(mainForm);
    }
    else {
        title = item.title as string;
    }
    if (title) {
        if (!withoutTailColumn) title = `${title}: `;
    }
    return title;
}

export const removeTailDot = (word?:string)=>{
    if (!word) return '';
    if (word.endsWith('.')) {
        return word.slice(0, word.length-1);
    }
    else return word;
}


export const trim = (word?:string)=>{
    if (!word) return '';
    return word.trim();
}

export abstract class AbstractInputBase extends BaseTsxComponent {

    @Reactive.Method()
    protected setValue(item:ItemBase & {value?: string}, value?:string) {
        item.value = value;
    }

    @Reactive.Method()
    protected checkUncheck(item: ItemBase, value: boolean) {
        item.unchecked = !value;
    }

    protected getTitleComponent(props:IBaseProps & {mainForm:Section[], item: ItemBase}) {
        const checkboxId = `check_${props.__id}_${props.trackBy}`;
        const title = getElementTitle(props.mainForm, props.item);
        return (
            <>
                <label title={title} className={'control'} htmlFor={checkboxId}>{title}</label>
            <input type='checkbox' checked={!props.item.unchecked}
                id={checkboxId}
                onchange={e => this.checkUncheck(props.item, (e.target as HTMLInputElement).checked)}/>
        </>
    );
    }

}