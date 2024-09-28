
export interface ItemBase<T> {
    type: string;
    title: string|(()=>string);
    value?: T;
    customValue?:string;
}

export interface SelectItem {
    value?:'other'|string;
    text?:string;
    isDefault?:true;
}

export interface SelectItem2 {
    value:'other'|string;
    text?:string;
    isDefault?:true;
}

export interface TextAreaItem extends ItemBase<string> {
    type: 'textArea';
}

export interface TextInputItem extends ItemBase<string> {
    type: 'textInput';
    expandable?: true;
    postfix?:string;
    formula?:()=>string;
}

export interface DateInputItem extends ItemBase<string> {
    type: 'dateInput';
}

export interface CheckBoxTextItem extends ItemBase<boolean> {
    type: 'checkBoxText';
}

export interface CheckBoxItem extends ItemBase<boolean> {
    type: 'checkBox';
}

export interface DropDownItem extends ItemBase<string> {
    type: 'dropDown';
    values: SelectItem[];
}

export interface ComboSelectItem extends ItemBase<string> {
    type: 'comboSelect';
    radioGroups?:SelectItem2[][];
    checks?:SelectItem2[];
    values?:(string|undefined)[];
    customValue?:string;
}

export interface Block {
    title?:string;
    items: (
        TextAreaItem|TextInputItem|
        DateInputItem|CheckBoxTextItem|
        CheckBoxItem|DropDownItem|
        ComboSelectItem
        )[];
}

export interface Section {
    title: string;
    blocks:Block[];
}
