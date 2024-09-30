import {MainWidget, PrintWidget} from "./main.widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget =
    location.search.indexOf('prepareDocument')===-1?
    new MainWidget():new PrintWidget();
widget.mountTo(new HTMLElementWrap(root));