

export interface SelectItem2 {
    value:string;
    hasCustomText?:true;
    isCustomTextOptional?:true;
    initialCustomText?:string;
    isLabelPrintable?:false;
    isDefault?:true;
    isUndefined?:true;
}

export interface ItemBase {
    type: string;
    title: string|((mainForm:Section[])=>string);
}

export interface TextAreaItem extends ItemBase {
    value?: string;
    type: 'textArea';
}

export interface TextInputItem extends ItemBase {
    value?: string;
    type: 'textInput';
    expandable?: true;
    transform?:'capitalize'|'asIs';
    withNewLine?:true;
    postfix?:string;
    formula?:(mainForm:Section[])=>string;
}

export interface DateInputItem extends ItemBase {
    value?: string;
    type: 'dateInput';
}

export interface CheckBoxTextItem extends ItemBase {
    value?: boolean;
    type: 'checkBoxText';
    customValue?:string;
}

export interface CheckBoxItem extends ItemBase {
    type: 'checkBox';
    value?: boolean;
}

export interface ComboSelectItem extends ItemBase {
    type: 'comboSelect';
    radioGroups?:SelectItem2[][];
    checks?:SelectItem2[];
    valuesList?:(string|undefined)[];
    valuesMap?:Record<string, string|undefined>;
}

export interface Section {
    title: string;
    isSubBlock?:true;
    items: (
        TextAreaItem|TextInputItem|
        DateInputItem|CheckBoxTextItem|
        CheckBoxItem|ComboSelectItem
        )[];
}
