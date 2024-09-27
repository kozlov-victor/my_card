import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/_genetic/abstractTsxDOMRenderer";
import {DomElementCreator} from "@engine/renderable/tsx/dom/internal/domElementCreator";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";


export class HtmlTsxDOMRenderer extends AbstractTsxDOMRenderer<HTMLElementWrap> {
    constructor() {
        super(new DomElementCreator());
    }
}
