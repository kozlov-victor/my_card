import {Section} from "../model/model";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {VirtualCommentNode, VirtualNode, VirtualTextNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {SectionPrintComponent} from "../components/section";
import {BrandHeader} from "../components/brand-header";

export class HtmlRendererUtil {

    private selfClosed = ['img', 'input', 'br'];

    private renderToString(node:VirtualNode, indentNum: number, out: string[]):void {
        const indent = new Array(indentNum).fill('').join('    ');
        if (node instanceof VirtualTextNode) {
            if (!node.text) return;
            out.push(node.text);
            return;
        }
        if (node instanceof VirtualCommentNode) {
            return;
        }
        const attr:string[] = [];
        if (node.props.className) {
            attr.push(`class="${node.props.className}"`);
        }
        if (node.props.src) {
            attr.push(`src="${node.props.src}"`);
        }
        let attrFull = attr.join(' ');
        if (attrFull) attrFull = ' ' + attrFull;
        out.push(`\n${indent}<${node.tagName}${attrFull}>`);
        node.children.map(c=>this.renderToString(c,indentNum+1, out));
        const lastChild = node.children[node.children.length-1];
        if (!this.selfClosed.includes(node.tagName)) {
            const needIndentationOfClosingTag = lastChild && !(lastChild instanceof VirtualTextNode);
            out.push(`${needIndentationOfClosingTag?'\n'+indent:''}</${node.tagName}>`);
        }
    }

    public render(mainForm:Section[], printType:'simple'|'branded') {
        //language=CSS
        const css = `
            @page {
                margin: 0.59in 0.5in 0.5in 0.59in;
                size: A4 portrait;
            }

            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                border: none;
                outline: none;
                font-size: 12pt;
            }

            body {
                text-align: justify;
            }
            
            .brand-header {
                text-align: center;
                z-index: 2;
            }
            
            .logo {
                position: absolute;
                display: inline-block;
                width: 0.91in;
                height: 0.94in;
                top: 0;
                left: 0.61in;
                z-index: 1;
            }

            .no-break {
                page-break-inside: avoid;
            }

            .title {
                font-weight: bold;
                background-color: #e1e1e1;
            }

            .sub-title {
                font-style: italic;
            }

            .item {
                display: inline-block;
                vertical-align: baseline;
            }
        `;
        const node =  (
            <html lang="en">
                <head>
                    <title></title>
                    <style>{css}</style>
                </head>
                <body>
                {printType==='branded' && <BrandHeader/>}
                {mainForm.map(section=>
                    <SectionPrintComponent mainForm={mainForm} section={section}/>
                )}
                </body>
            </html>
        );
        const out:string[] = ['<!DOCTYPE html>\n'];
        this.renderToString(node as VirtualNode,0, out);
        return out.join('');
        
    }
    
}