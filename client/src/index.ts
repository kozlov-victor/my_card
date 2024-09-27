import {MainWidget} from "./main.widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget = new MainWidget();
widget.mountTo(new HTMLElementWrap(root));