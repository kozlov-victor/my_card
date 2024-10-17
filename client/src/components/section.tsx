import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {
    CheckBoxItem,
    CheckBoxTextItem,
    ComboSelectItem, DateInputItem,
    ItemBase, StaticTextItem,
    Section,
    TextAreaItem,
    TextInputItem, TextInputDoubleItem
} from "../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";

import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {TextAreaComponent,TextAreaPrintComponent} from "./controls/text-area";
import {TextInputComponent,TextInputPrintComponent} from "./controls/text-input";
import {CheckBoxTextComponent,CheckBoxTextPrintComponent} from "./controls/check-box-text";
import {CheckBoxComponent,CheckBoxPrintComponent} from "./controls/check-box";
import {ComboSelectComponent,ComboSelectPrintComponent} from "./controls/combo-select";
import {DateInputComponent,DateInputPrintComponent} from "./controls/date-input";
import {StaticTextComponent} from "./controls/static-text";
import {TextInputDoubleComponent, TextInputDoublePrintComponent} from "./controls/text-input-double";


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
            <ComboSelectPrintComponent mainForm={mainForm} item={item as ComboSelectItem}/>
        ]
        case 'dateInput': return [
            <DateInputComponent trackBy={trackBy} mainForm={mainForm} item={item as DateInputItem}/>,
            <DateInputPrintComponent mainForm={mainForm} item={item as DateInputItem}/>
        ]
        case 'staticText': return [
            undefined!,
            <StaticTextComponent mainForm={mainForm} item={item as StaticTextItem}/>
        ]
        case 'textInputDouble': return [
            <TextInputDoubleComponent trackBy={trackBy} mainForm={mainForm} item={item as TextInputDoubleItem}/>,
            <TextInputDoublePrintComponent mainForm={mainForm} item={item as TextInputDoubleItem}/>
        ]
        default: throw new Error(`wrong item type: ${item.type}`);
    }
}

export class SectionComponent extends BaseTsxComponent {

    constructor(private props: IBaseProps & {section:Section, mainForm: Section[]}) {
        super();
    }

    @Reactive.Method()
    private triggerExpandable(checked:boolean) {
        this.props.section.expanded = checked;
    }

    render(): JSX.Element {
        const section = this.props.section;

        return (
            <>
                <section>
                    <div className={this.props.section.sub?'sub-title':'title'}>
                        <input
                            id={`${this.props.trackBy}_${this.props.__id}`}
                            onchange={e => this.triggerExpandable((e.target as HTMLInputElement).checked)}
                            type={'checkbox'}
                            checked={this.props.section.expanded}/>
                        <label
                            htmlFor={`${this.props.trackBy}_${this.props.__id}`}>
                            {section.title}
                        </label>
                    </div>
                    <>
                        {section.expanded &&
                            <>
                                {section.items.filter(it=>it.type!=='section').map((block, itemIndex) =>
                                    <div
                                        className={`item ${block.type}`}>
                                        {getComponentItemByType(this.props.mainForm, this.props.section, block, this.props.trackBy + "_" + itemIndex)?.[0]}
                                    </div>
                                )}
                                {section.items.filter(it=>it.type==='section').map((block, itemIndex) =>
                                    <SectionComponent
                                        mainForm={this.props.mainForm}
                                        section={block as Section}
                                        trackBy={this.props.trackBy+'_subsection_'+itemIndex}
                                    />
                                )}
                            </>
                        }
                    </>
                </section>

            </>
        );
    }

}

export const SectionPrintComponent = (props: IBaseProps & { section: Section, mainForm: Section[] }) => {
    if (!props.section.expanded) return <></>;
    const firstChild = props.section.items[0];
    const nextChildren = props.section.items.slice(1);
    return (
        <>
            <div className={'no-break'}>
                <div className={props.section.sub ? 'sub-title' : 'title'}>{props.section.title}</div>
                {
                    props.section.expanded &&
                    <>
                        {props.section.items.filter(it => it.type !== 'section').map(item =>
                            getComponentItemByType(props.mainForm, props.section, item, '')[1]
                        )}
                        {firstChild.type==='section' &&
                            <SectionPrintComponent section={props.section.items[0] as Section}
                               mainForm={props.mainForm}/>
                        }
                    </>
                }
            </div>
            <>
                {nextChildren.filter(it => it.type === 'section').map(item =>
                    <SectionPrintComponent section={item as Section}
                       mainForm={props.mainForm}/>
                )}
            </>
        </>
    );
}