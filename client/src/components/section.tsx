import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {
    CheckBoxItem,
    CheckBoxTextItem,
    DropDownItem,
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
    DropDownComponent,
    DropDownPrintComponent,
    TextAreaComponent,
    TextAreaPrintComponent,
    TextInputComponent,
    TextInputPrintComponent
} from "./componentItems";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";


const getComponentItemByType = (section:Section,item:ItemBase<any>,trackBy:string)=>{
    switch (item.type) {
        case 'textArea': return <TextAreaComponent trackBy={trackBy} item={item as TextAreaItem} section={section}/>
        case 'textInput': return <TextInputComponent trackBy={trackBy} item={item as TextInputItem}/>
        case 'checkBoxText': return <CheckBoxTextComponent trackBy={trackBy} item={item as CheckBoxTextItem}/>
        case 'checkBox': return <CheckBoxComponent trackBy={trackBy} item={item as CheckBoxItem}/>
        case 'dropDown': return <DropDownComponent trackBy={trackBy} item={item as DropDownItem}/>
        default: throw new Error(`wrong item type: ${item.type}`);
    }
}

const getPrintComponentItemByType = (section:Section,item:ItemBase<any>)=>{
    switch (item.type) {
        case 'textArea': return <TextAreaPrintComponent item={item as TextAreaItem} section={section}/>
        case 'textInput': return <TextInputPrintComponent  item={item as TextInputItem}/>
        case 'checkBoxText': return <CheckBoxTextPrintComponent  item={item as CheckBoxTextItem}/>
        case 'checkBox': return <CheckBoxPrintComponent item={item as CheckBoxItem}/>
        case 'dropDown': return <DropDownPrintComponent item={item as DropDownItem}/>
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
                                    className={`item ${block.type}`}>{getComponentItemByType(this.props.section,block, this.props.trackBy + '_' + blockIndex+"_" + itemIndex)}</div>
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
            <div>
                <div className="title">{props.section.title}</div>
                {props.section.blocks.map((block,blockIndex)=>
                    <>
                        <div className="sub-title">{block.title}</div>
                        {block.items.map((block) =>
                           getPrintComponentItemByType(props.section,block)
                        )}
                    </>
                )}
            </div>
        </>
    );
}