import {ItemBase, Section} from "../model/model";

export class SerializeUtil {

    private readonly fnBodyHashStart = 8;
    private readonly fnBodyHashEnd = 8;


    private calculateItemKey(s:Section, i:ItemBase) {
        const title = (i.title as ()=>string).call!==undefined?
            (i.title as ()=>string).toString().substring(this.fnBodyHashStart,this.fnBodyHashStart+this.fnBodyHashEnd):
            i.title;
        return `${s.title}:${title ?? ''}`;
    }

    private copyItemProperties(from:any,to:any) {
        if (from.unchecked!==undefined) {
            to.unchecked = from.unchecked;
        }
        if (from.value) {
            to.value = from.value;
        }
        if (from.value1) {
            to.value1 = from.value1;
        }
        if (from.value2) {
            to.value2 = from.value2;
        }
        if (from.valuesList) {
            to.valuesList = from.valuesList;
        }
        if (from.valuesMap) {
            to.valuesMap = from.valuesMap;
        }
        if (from.customValue) {
            to.customValue = from.customValue;
        }
    }

    private copySectionProperties(from:any,to:any) {
        to.expanded = from.expanded;
    }

    public serialize(mainForm:Section[],result:Record<string, any> = {}) {
        for (const s of mainForm) {
            const sectionKey = s.title;
            result[sectionKey] = {};
            this.copySectionProperties(s, result[sectionKey]);
            for (const i of s.items as any[]) {
                if (i.type==='section') {
                    this.serialize([i  as Section], result);
                }
                else {
                    const itemKey = this.calculateItemKey(s,i);
                    result[itemKey] = {};
                    this.copyItemProperties(i,result[itemKey]);
                }

            }
        }
        return result;
    }

    public deserialize(mainForm: Section[],session:any) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            const sectionKey = s.title;
            const sectionValue = session[sectionKey];
            if (sectionValue) {
                this.copySectionProperties(sectionValue,s);
            }
            for (const i of s.items as any[]) {
                if (i.type==='section') {
                    this.deserialize([i  as Section],session);
                }
                else {
                    const itemKey = this.calculateItemKey(s,i);
                    const itemValue = session[itemKey];
                    if (!itemValue) continue;
                    this.copyItemProperties(itemValue,i);
                }
            }
        }
        return result;
    }

}