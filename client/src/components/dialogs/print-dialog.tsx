import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class PrintDialog extends BaseTsxComponent {

    private static instance:PrintDialog;
    private ref:Dialog;

    @Reactive.Property()
    private printType:'simple'|'branded' = 'branded';


    constructor() {
        super();
        PrintDialog.instance = this;
    }

    public static async open() {
        return this.instance.ref.open();
    }

    render(): JSX.Element {
        return (
            <>
                <Dialog ref={el => this.ref = el} title={'Друк документу'}>
                    Оберіть тип бланку
                    <ul style={{margin: '0 auto', width: '100px'}}>
                        {
                            [{type: 'branded', text: 'Фірмовий'} as const, {
                                type: 'simple',
                                text: 'Звичайний'
                            } as const].map(it =>
                                <li
                                    style={{padding: '0'}}
                                >
                                    <label
                                        style={{display: 'block'}}
                                        htmlFor={`radio_id_${it.type}`}>
                                        <input
                                            id={`radio_id_${it.type}`}
                                            onchange={_ => this.printType = it.type}
                                            value={it.type}
                                            checked={this.printType === it.type}
                                            type={'radio'} name={`printType`}/>
                                        <span>{it.text}</span>
                                    </label>
                                </li>
                            )
                        }
                    </ul>
                    <a
                        onclick={_ => this.ref.close({printType:this.printType,documentType:'pdf'})}
                        target={'pdf'}
                        className={'button-like'}
                        href={'/?prepareDocument&type=pdf'}>
                        Сформувати pdf
                    </a>
                    <a
                        onclick={_ => this.ref.close({printType:this.printType,documentType:'word'})}
                        target={'word'}
                        className={'button-like'}
                        href={'/?prepareDocument&type=word'}>
                        Сформувати word
                    </a>
                </Dialog>
            </>
        );
    }

}