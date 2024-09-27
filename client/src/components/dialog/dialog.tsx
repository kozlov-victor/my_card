import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class Dialog extends BaseTsxComponent {

    private opened = false;
    private resolve:(res:any)=>void;

    constructor(private props: IBaseProps & {children?: any}) {
        super();
    }

    @Reactive.Method()
    public async open() {
        this.opened = true;
        return new Promise<any>(resolve => {
            this.resolve = resolve;
        });
    }

    @Reactive.Method()
    public close(result:any) {
        this.opened = false;
        this.resolve(result);
    }

    render(): JSX.Element {
        return (
            <>
                {
                    this.opened &&
                    <>
                        <div className="overlay"></div>
                        <div className="modal-wrap-outer">
                            <div className="modal-wrap-inner">
                                <div className="dialog">
                                    <div className="dialog-head">
                                        <span className="dialog-close" onclick={_=>this.close(undefined)}>✖
                                    </span>
                                </div>
                                <div className="dialog-body">
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                    </>

                }
            </>
        );
    }


}