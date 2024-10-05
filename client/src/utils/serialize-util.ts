import {ItemBase, Section} from "../model/model";

export class SerializeUtil {

    private readonly fnBodyHashStart = 8;
    private readonly fnBodyHashEnd = 8;

    private calculateSectionKey(s:Section): string {
        const title = (s.title as ()=>string)?.call!==undefined?
            (s.title as ()=>string).toString().substring(this.fnBodyHashStart,this.fnBodyHashStart+this.fnBodyHashEnd): s.title;
        return (title as string) ?? s.subTitle ?? '';
    }

    private calculateItemKey(s:Section, i:ItemBase) {
        const title = (i.title as ()=>string).call!==undefined?
            (i.title as ()=>string).toString().substring(this.fnBodyHashStart,this.fnBodyHashStart+this.fnBodyHashEnd):
            i.title;
        return `${this.calculateSectionKey(s) ?? ''}:${title ?? ''}`;
    }

    private copyItemProperties(from:any,to:any) {
        if (from.value) {
            to.value = from.value;
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
        if (from.collapsible) {
            to.collapsible = from.collapsible;
        }
    }

    public serialize(mainForm:Section[]) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            const sectionKey = this.calculateSectionKey(s);
            result[sectionKey] = {};
            this.copySectionProperties(s, result[sectionKey]);
            for (const i of s.items as any[]) {
                const itemKey = this.calculateItemKey(s,i);
                result[itemKey] = {};
                this.copyItemProperties(i,result[itemKey]);
            }
        }
        return result;
    }

    public deserialize(mainForm: Section[],session:any) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            const sectionKey = this.calculateSectionKey(s);
            const sectionValue = session[sectionKey];
            if (sectionValue) {
                this.copySectionProperties(sectionValue,s);
            }
            for (const i of s.items as any[]) {
                const itemKey = this.calculateItemKey(s,i);
                const itemValue = session[itemKey];
                if (!itemValue) continue;
                this.copyItemProperties(itemValue,i);
                if (itemValue.value) {
                    i.value = itemValue.value;
                }
                if (itemValue.valuesList) {
                    i.valuesList = itemValue.valuesList;
                }
                if (itemValue.valuesMap) {
                    i.valuesMap = itemValue.valuesMap;
                }
                if (itemValue.customValue) {
                    i.customValue = itemValue.customValue;
                }
            }
        }
        return result;
    }

}