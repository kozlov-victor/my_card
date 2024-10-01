import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {IBaseProps} from "@engine/renderable/tsx/_genetic/virtualNode";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";

export class ActionButton extends BaseTsxComponent {

    @Reactive.Property()
    private pending = false;

    constructor(private props:IBaseProps & {action:()=>Promise<any>}) {
        super();
    }

    private async onAction() {
        this.pending = true;
        this.props.action().finally(()=>this.pending = false);
    }

    render(): JSX.Element {
        return (
            <>
                <button className={'tip-button'} onclick={_=>this.onAction()} disabled={this.pending}>{this.props.children}</button>
            </>
        );
    }

}