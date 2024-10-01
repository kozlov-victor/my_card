import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Dialog} from "../dialog/dialog";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class PrintDialog extends BaseTsxComponent {

    private static instance:PrintDialog;
    private ref:Dialog;

    @Reactive.Property()
    private printType:'simple'|'branded' = 'simple';


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
                <Dialog ref={el=>this.ref = el}>
                    <h4>Друк документу</h4>
                    Оберіть тип бланку
                    <ul style={{margin:'0 auto', width: '100px'}}>
                        {
                            [{type:'simple',text:'Звичайний'} as const,{type:'branded',text:'Фірмовий'} as const].map(it=>
                                <li
                                    style={{padding:'0'}}
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
                        onclick={_ => this.ref.close(this.printType)}
                        target={'pdf'}
                        className={'button-like'}
                        href={'/?prepareDocument'}>
                        Сформувати pdf
                    </a>
                </Dialog>
            </>
        );
    }

}