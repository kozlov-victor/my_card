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
    unchecked?:boolean;
    printWithNewLine?:true;
    doesNotPrint?:true;
}

export interface TextAreaItem extends ItemBase {
    value?: string;
    type: 'textArea';
}

export interface TextInputItem extends ItemBase {
    value?: string;
    type: 'textInput';
    expandable?: true;
    allowedSymbols?:string[],
    disabled?:true;
    postfix?:string;
    formula?:(mainForm:Section[])=>string;
    customPrintValue?:(mainForm:Section[])=>string|JSX.Element;
}

export interface TextInputDoubleItem extends ItemBase {
    value1?: string;
    value2?: string;
    type: 'textInputDouble';
    allowedSymbols?:string[],
    disabled?:true;
    postfix1?:string;
    postfix2?:string;
    formula1?:(mainForm:Section[])=>string;
    formula2?:(mainForm:Section[])=>string;
}

export interface DateInputItem extends ItemBase {
    value?: string;
    type: 'dateInput';
}

export interface CheckBoxTextItem extends ItemBase {
    type: 'checkBoxText';
    customValue?:string;
}

export interface CheckBoxItem extends ItemBase {
    type: 'checkBox';
}

export interface ComboSelectItem extends ItemBase {
    type: 'comboSelect';
    radioGroups?:SelectItem2[][];
    checks?:SelectItem2[];
    valuesList?:(string|undefined)[];
    valuesMap?:Record<string, string|undefined>;
}

export interface StaticTextItem extends ItemBase {
    type: 'staticText';
    value?:string;
}

export interface Section {
    type: 'section',
    sub?: true,
    title: string;
    expanded: boolean,
    items: (
        TextAreaItem|TextInputItem|
        DateInputItem|CheckBoxTextItem|
        CheckBoxItem|ComboSelectItem|
        TextInputDoubleItem|
        StaticTextItem|Section
        )[];
}
