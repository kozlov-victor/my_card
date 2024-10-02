import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {
    CheckBoxItem,
    CheckBoxTextItem,
    ComboSelectItem, DateInputItem,
    ItemBase, StaticTextItem,
    Section,
    TextAreaItem,
    TextInputItem
} from "../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {
    CheckBoxComponent,
    CheckBoxPrintComponent,
    CheckBoxTextComponent,
    CheckBoxTextPrintComponent,
    ComboSelectComponent,
    CompoSelectPrintComponent, DateInputComponent, DateInputPrintComponent, StaticTextComponent,
    TextAreaComponent,
    TextAreaPrintComponent,
    TextInputComponent,
    TextInputPrintComponent
} from "./componentItems";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";


const getComponentItemByType = (mainForm:Section[],section:Section,item:ItemBase,trackBy:string):[JSX.Element,JSX.Element]=>{
    switch (item.type) {
        case 'textArea': return [
            <TextAreaComponent trackBy={trackBy} mainForm={mainForm} item={item as TextAreaItem} section={section}/>,
            <TextAreaPrintComponent mainForm={mainForm} item={item as TextAreaItem} section={section}/>
        ]
        case 'textInput': return [
            <TextInputComponent trackBy={trackBy} mainForm={mainForm} item={item as TextInputItem}/>,
            <TextInputPrintComponent mainForm={mainForm} item={item as TextInputItem}/>
        ]
        case 'checkBoxText': return [
            <CheckBoxTextComponent trackBy={trackBy} mainForm={mainForm} item={item as CheckBoxTextItem}/>,
            <CheckBoxTextPrintComponent mainForm={mainForm} item={item as CheckBoxTextItem}/>
        ]
        case 'checkBox': return [
            <CheckBoxComponent trackBy={trackBy} mainForm={mainForm} item={item as CheckBoxItem}/>,
            <CheckBoxPrintComponent mainForm={mainForm} item={item as CheckBoxItem}/>
        ]
        case 'comboSelect': return [
            <ComboSelectComponent trackBy={trackBy} mainForm={mainForm} item={item as ComboSelectItem}/>,
            <CompoSelectPrintComponent mainForm={mainForm} item={item as ComboSelectItem}/>
        ]
        case 'dateInput': return [
            <DateInputComponent trackBy={trackBy} mainForm={mainForm} item={item as DateInputItem}/>,
            <DateInputPrintComponent mainForm={mainForm} item={item as DateInputItem}/>
        ]
        case 'staticText': return [
            undefined!,
            <StaticTextComponent mainForm={mainForm} item={item as StaticTextItem}/>
        ]
        default: throw new Error(`wrong item type: ${item.type}`);
    }
}

export class SectionComponent extends BaseTsxComponent {

    constructor(private props: IBaseProps & {section:Section, mainForm: Section[]}) {
        super();
    }

    render(): JSX.Element  {
        return (
            <>
                <section>
                    <div className={this.props.section.isSubBlock?'':'title'}>{this.props.section.title}</div>
                    <>
                        {this.props.section.items.map((block, itemIndex) =>
                            <div
                                className={`item ${block.type}`}>{getComponentItemByType(this.props.mainForm,this.props.section,block, this.props.trackBy +"_" + itemIndex)?.[0]}</div>
                        )}
                    </>
                </section>
            </>
        );
    }

}

export const SectionPrintComponent = (props: IBaseProps & {section:Section, mainForm: Section[]})=>{
    return (
        <div className={'no-break'}>
            <div className={props.section.isSubBlock?'sub-title':'title'}>{props.section.title}</div>
            {props.section.items.map(item =>
                getComponentItemByType(props.mainForm, props.section, item, '')[1]
            )}
        </div>
    );
}