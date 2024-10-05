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
    CompoSelectPrintComponent, DateInputComponent, DateInputPrintComponent, getSectionTitle, StaticTextComponent,
    TextAreaComponent,
    TextAreaPrintComponent,
    TextInputComponent,
    TextInputPrintComponent
} from "./componentItems";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";


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

    @Reactive.Method()
    private triggerCollapsible(checked:boolean) {
        if (this.props.section.collapsible) {
            this.props.section.collapsible.currentValue = checked;
        }
    }

    render(): JSX.Element  {
        const sectionTitle = getSectionTitle(this.props.section.title,'ui');
        return (
            <>
                <section>
                    {sectionTitle && <div className={'title'}>{sectionTitle}</div>}
                    <>
                        {this.props.section.subTitle && <div className={'sub-title'}>
                            {
                                this.props.section.collapsible &&
                                <input
                                    id={`section_${this.props.trackBy}`}
                                    style={{margin: '0px 10px 0 0'}}
                                    onchange={e => this.triggerCollapsible((e.target as HTMLInputElement).checked)}
                                    type={'checkbox'}
                                    checked={this.props.section.collapsible?.currentValue}/>
                            }
                            <label htmlFor={this.props.section.collapsible?`section_${this.props.trackBy}`:undefined}>
                                {this.props.section.subTitle}
                            </label>
                        </div>}
                        {(this.props.section.collapsible === undefined || this.props.section.collapsible.currentValue) &&
                            <>
                                {this.props.section.items.map((block, itemIndex) =>
                                    <div
                                        className={`item ${block.type}`}>
                                        {getComponentItemByType(this.props.mainForm,this.props.section,block, this.props.trackBy +"_" + itemIndex)?.[0]}
                                    </div>
                                )}
                            </>
                        }
                    </>
                </section>
            </>
        );
    }

}

export const SectionPrintComponent = (props: IBaseProps & {section:Section, mainForm: Section[]})=>{
    const sectionTitle = getSectionTitle(props.section.title,'print');
    return (
        <div className={'no-break'}>
            {sectionTitle && <div className={'title'}>{sectionTitle}</div>}
            {
                (props.section.collapsible===undefined || props.section.collapsible.currentValue) &&
                <>
                    {props.section.subTitle && <div className={'sub-title'}>{props.section.subTitle}</div>}
                    {props.section.items.map(item =>
                        getComponentItemByType(props.mainForm, props.section, item, '')[1]
                    )}
                </>
            }
        </div>
    );
}