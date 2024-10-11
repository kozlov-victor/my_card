import {ItemBase, Section, TextInputItem} from "./model";
import {TextInputComponent} from "../components/controls/text-input";

export namespace accessor {

    let cache:Record<string, ItemBase> = {};

    export const getItem = (name:string,mainForm:Section[]):ItemBase=>{
        if (cache[name]) return cache[name];
        for (const s of mainForm) {
            for (const i of s.items) {
                if (i.type==='section') {
                    const possible = getItem(name, [i as Section]);
                    if (possible) return possible;
                }
                else {
                    if (i.title===name) {
                        cache[name] = i;
                        return i;
                    }
                }
            }
        }
        return undefined!;
    }

    export const getValue = (name:string, mainForm:Section[])=>{
        const item = getItem(name,mainForm);
        if (!item) return undefined;
        if ((item as any).valuesList) {
            return (item as any).valuesList[0];
        }
        return (item as any).value;
    }

    export const setValue = (name:string, value:string, mainForm:Section[])=>{
        const item = getItem(name,mainForm);
        if (!item) return;
        (item as any).value = value;
    }

    export const clearCache = ()=>{
        cache = {};
    }

}

export namespace accessorUtils {

    export const getPib = (mainForm:Section[],type:'ui'|'print')=>{
        return [
            accessor.getItem('Прізвище', mainForm),
            accessor.getItem('Ім`я', mainForm),
            accessor.getItem('По-батькові', mainForm)
        ].
        filter(it=>type==='ui' || (!it.unchecked)).
        filter(it=>(it as TextInputItem).value).
        map(it=>(it as TextInputItem).value).
        join(' ');
    }

}