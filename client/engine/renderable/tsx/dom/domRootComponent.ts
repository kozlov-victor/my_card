import {VEngineTsxComponent} from "@engine/renderable/tsx/_genetic/vEngineTsxComponent";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/internal/htmlTsxDOMRenderer";

export abstract class DomRootComponent extends VEngineTsxComponent {
    constructor() {
        super(new HtmlTsxDOMRenderer());
    }
}
