import {Block, ItemBase, Section} from "../model/model";

export class SerializeUtil {

    private calculateKey(s:Section, b: Block, i:ItemBase<any>) {
        const title = (i.title as ()=>string).call!==undefined?
            (i.title as ()=>string).toString().substring(1,5):
            i.title;
        return `${s.title ?? ''}:${b.title ?? ''}:${title ?? ''}`;
    }

    public serialize(mainForm:Section[]) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            for (const b of s.blocks) {
                for (const i of b.items) {
                    const key = this.calculateKey(s,b,i);
                    result[key] = {};
                    result[key].value = i.value;
                    if (i.customValue) {
                        result[key].customValue = i.customValue;
                    }
                }
            }
        }
        return result;
    }

    public deserialize(mainForm: Section[],session:any) {
        const result:Record<string, any> = {};
        for (const s of mainForm) {
            for (const b of s.blocks) {
                for (const i of b.items) {
                    const key = this.calculateKey(s,b,i);
                    const val = session[key];
                    if (!val) continue;
                    if (val.value) {
                        i.value = val.value as string|boolean;
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