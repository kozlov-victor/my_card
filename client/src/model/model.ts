
export interface ItemBase<T> {
    type: string;
    title: string|(()=>string);
    value?: T;
    customValue?:string;
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
    values: ({value:'other'|string,text?:string,isDefault?:true})[];
}

export interface Block {
    title?:string;
    items: (
        TextAreaItem|TextInputItem|
        DateInputItem|CheckBoxTextItem|
        CheckBoxItem|DropDownItem
        )[];
}

export interface Section {
    title: string;
    blocks:Block[];
}
