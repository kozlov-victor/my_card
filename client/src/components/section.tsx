import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {
    CheckBoxItem,
    CheckBoxTextItem,
    ComboSelectItem, DateInputItem,
    ItemBase,
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
    CompoSelectPrintComponent, DateInputComponent, DateInputPrintComponent,
    TextAreaComponent,
    TextAreaPrintComponent,
    TextInputComponent,
    TextInputPrintComponent
} from "./componentItems";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";


const getComponentItemByType = (section:Section,item:ItemBase,trackBy:string):[JSX.Element,JSX.Element]=>{
    switch (item.type) {
        case 'textArea': return [
            <TextAreaComponent trackBy={trackBy} item={item as TextAreaItem} section={section}/>,
            <TextAreaPrintComponent item={item as TextAreaItem} section={section}/>
        ]
        case 'textInput': return [
            <TextInputComponent trackBy={trackBy} item={item as TextInputItem}/>,
            <TextInputPrintComponent  item={item as TextInputItem}/>
        ]
        case 'checkBoxText': return [
            <CheckBoxTextComponent trackBy={trackBy} item={item as CheckBoxTextItem}/>,
            <CheckBoxTextPrintComponent  item={item as CheckBoxTextItem}/>
        ]
        case 'checkBox': return [
            <CheckBoxComponent trackBy={trackBy} item={item as CheckBoxItem}/>,
            <CheckBoxPrintComponent item={item as CheckBoxItem}/>
        ]
        case 'comboSelect': return [
            <ComboSelectComponent trackBy={trackBy} item={item as ComboSelectItem}/>,
            <CompoSelectPrintComponent item={item as ComboSelectItem}/>
        ]
        case 'dateInput': return [
            <DateInputComponent trackBy={trackBy} item={item as DateInputItem}/>,
            <DateInputPrintComponent item={item as DateInputItem}/>
        ]
        default: throw new Error(`wrong item type: ${item.type}`);
    }
}

export class SectionComponent extends BaseTsxComponent {

    constructor(private props: IBaseProps & {section:Section}) {
        super();
    }

    render(): JSX.Element  {
        return (
            <>
                <section>
                    <div className="title">{this.props.section.title}</div>
                    {this.props.section.blocks.map((block,blockIndex)=>
                        <>
                            <h3>{block.title}</h3>
                            {block.items.map((block, itemIndex) =>
                                <div
                                    className={`item ${block.type}`}>{getComponentItemByType(this.props.section,block, this.props.trackBy + '_' + blockIndex+"_" + itemIndex)[0]}</div>
                            )}
                        </>
                    )}
                </section>
            </>
        );
    }

}

export const SectionPrintComponent = (props: IBaseProps & {section:Section})=>{
    return (
        <>
            <div className={'section'}>
                <div className="title">{props.section.title}</div>
                {props.section.blocks.map((block,blockIndex)=>
                    <>
                        <div className="sub-title">{block.title}</div>
                        {block.items.map((block) =>
                            getComponentItemByType(props.section,block,'')[1]
                        )}
                    </>
                )}
            </div>
        </>
    );
}