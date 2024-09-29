import {Block, ItemBase, Section} from "../model/model";

export class SerializeUtil {

    private calculateKey(s:Section, b: Block, i:ItemBase) {
        const title = (i.title as ()=>string).call!==undefined?
            (i.title as ()=>string).toString().substring(1,5):
            i.title;
        return `${s.title ?? ''}:${b.title ?? ''}:${title ?? ''}`;
    }

    private copyProperties(from:any,to:any) {
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

    public serialize(mainForm:Section[]) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            for (const b of s.blocks) {
                for (const i of b.items as any[]) {
                    const key = this.calculateKey(s,b,i);
                    result[key] = {};
                    this.copyProperties(i,result[key]);
                }
            }
        }
        return result;
    }

    public deserialize(mainForm: Section[],session:any) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            for (const b of s.blocks) {
                for (const i of b.items as any[]) {
                    const key = this.calculateKey(s,b,i);
                    const val = session[key];
                    if (!val) continue;
                    this.copyProperties(val,i);
                    if (val.value) {
                        i.value = val.value;
                    }
                    if (val.valuesList) {
                        i.valuesList = val.valuesList;
                    }
                    if (val.valuesMap) {
                        i.valuesMap = val.valuesMap;
                    }
                    if (val.customValue) {
                        i.customValue = val.customValue;
                    }
                }
            }
        }
        return result;
    }

}