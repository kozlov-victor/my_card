
interface ICommonElement<T> {
    className?: string;
    key?:number|string;
    ref?:(el:T)=>void;
    __id?: number;
}



type Font = {
    type: 'Font'
} & {style?:Partial<CSSStyleDeclaration>};

interface INode {
    tagName:string;
    children:INode[];
    type: 'virtualNode'|'virtualFragment';
}

declare namespace JSX {
    // tslint:disable-next-line:interface-name
    export interface IntrinsicElements {
        a: ICommonElement<HTMLAnchorElement> & Partial<Omit<HTMLAnchorElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        abbr: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        address: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        area: ICommonElement<HTMLAreaElement> & Partial<Omit<HTMLAreaElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        article: ICommonElement<HTMLAreaElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        aside: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        audio: ICommonElement<HTMLAudioElement> & Partial<Omit<HTMLAudioElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        b: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        base: ICommonElement<HTMLBaseElement> & Partial<Omit<HTMLBaseElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        bdi: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        bdo: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        big: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        blockquote: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        body: ICommonElement<HTMLBodyElement> & Partial<Omit<HTMLBodyElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        br: ICommonElement<HTMLBRElement> & Partial<Omit<HTMLBRElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        button: ICommonElement<HTMLButtonElement> & Partial<Omit<HTMLButtonElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        canvas: ICommonElement<HTMLCanvasElement> & Partial<Omit<HTMLCanvasElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        caption: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        cite: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        code: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        col: ICommonElement<HTMLTableColElement> & Partial<Omit<HTMLTableColElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        colgroup: ICommonElement<HTMLTableColElement> & Partial<Omit<HTMLTableColElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        data: ICommonElement<HTMLDataElement> & Partial<Omit<HTMLDataElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        datalist: ICommonElement<HTMLDataListElement> & Partial<Omit<HTMLDataListElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        dd: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        del: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        details: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        dfn: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        dialog: ICommonElement<HTMLDialogElement> & Partial<Omit<HTMLDialogElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        div: ICommonElement<HTMLDivElement> & Partial<Omit<HTMLDivElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        dl: ICommonElement<HTMLDListElement> & Partial<Omit<HTMLDListElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        dt: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        em: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        embed: ICommonElement<HTMLEmbedElement> & Partial<Omit<HTMLEmbedElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        fieldset: ICommonElement<HTMLFieldSetElement> & Partial<Omit<HTMLFieldSetElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        figcaption: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        figure: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        footer: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        form: ICommonElement<HTMLFormElement> & Partial<Omit<HTMLFormElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h1: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h2: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h3: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h4: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h5: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        h6: ICommonElement<HTMLHeadingElement> & Partial<Omit<HTMLHeadingElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        head: ICommonElement<HTMLHeadElement> & Partial<Omit<HTMLHeadElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        header: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        hgroup: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        hr: ICommonElement<HTMLHRElement> & Partial<Omit<HTMLHRElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        html: ICommonElement<HTMLHtmlElement> & Partial<Omit<HTMLHtmlElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        i: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        iframe: ICommonElement<HTMLIFrameElement> & Partial<Omit<HTMLIFrameElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        img: ICommonElement<HTMLImageElement> & Partial<Omit<HTMLImageElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        input: ICommonElement<HTMLInputElement> & Partial<Omit<HTMLInputElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        ins: ICommonElement<HTMLModElement> & Partial<Omit<HTMLModElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        kbd: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        keygen: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        // eslint-disable-next-line @typescript-eslint/ban-types
        label: ICommonElement<HTMLLabelElement> & Partial<Omit<HTMLLabelElement,"style"> & {htmlFor?:string|null}> & {style?:Partial<CSSStyleDeclaration>};
        legend: ICommonElement<HTMLLegendElement> & Partial<Omit<HTMLLegendElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        li: ICommonElement<HTMLLIElement> & Partial<Omit<HTMLLIElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        link: ICommonElement<HTMLLinkElement> & Partial<Omit<HTMLLinkElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        main: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        map: ICommonElement<HTMLMapElement> & Partial<Omit<HTMLMapElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        mark: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        menu: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        menuitem: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        meta: ICommonElement<HTMLMetaElement> & Partial<Omit<HTMLMetaElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        meter: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        nav: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        noindex: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        noscript: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        object: ICommonElement<HTMLObjectElement> & Partial<Omit<HTMLObjectElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        ol: ICommonElement<HTMLOListElement> & Partial<Omit<HTMLOListElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        optgroup: ICommonElement<HTMLOptGroupElement> & Partial<Omit<HTMLOptGroupElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        option: ICommonElement<HTMLOptionElement> & Partial<Omit<HTMLOptionElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        output: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        p: ICommonElement<HTMLParagraphElement> & Partial<Omit<HTMLParagraphElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        param: ICommonElement<HTMLParamElement> & Partial<Omit<HTMLParamElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        picture: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        pre: ICommonElement<HTMLPreElement> & Partial<Omit<HTMLPreElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        progress: ICommonElement<HTMLProgressElement> & Partial<Omit<HTMLProgressElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        q: ICommonElement<HTMLQuoteElement> & Partial<Omit<HTMLQuoteElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        rp: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        rt: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        ruby: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        s: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        samp: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        slot: ICommonElement<HTMLSlotElement> & Partial<Omit<HTMLSlotElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        script: ICommonElement<HTMLScriptElement> & Partial<Omit<HTMLScriptElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        section: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        select: ICommonElement<HTMLSelectElement> & Partial<Omit<HTMLSelectElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        small: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        source: ICommonElement<HTMLSourceElement> & Partial<Omit<HTMLSourceElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        span: ICommonElement<HTMLSpanElement> & Partial<Omit<HTMLSpanElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        strong: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        style: ICommonElement<HTMLElement> & Partial<Omit<HTMLStyleElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        sub: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        summary: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        sup: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        table: ICommonElement<HTMLTableElement> & Partial<Omit<HTMLTableElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        template: ICommonElement<HTMLTemplateElement> & Partial<Omit<HTMLTemplateElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        tbody: ICommonElement<HTMLTableSectionElement> & Partial<Omit<HTMLTableSectionElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        td: ICommonElement<HTMLTableDataCellElement> & Partial<Omit<HTMLTableDataCellElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        textarea: ICommonElement<HTMLTextAreaElement> & Partial<Omit<HTMLTextAreaElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        tfoot: ICommonElement<HTMLTableSectionElement> & Partial<Omit<HTMLTableSectionElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        th: ICommonElement<HTMLTableHeaderCellElement> & Partial<Omit<HTMLTableHeaderCellElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        thead: ICommonElement<HTMLTableSectionElement> & Partial<Omit<HTMLTableSectionElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        time: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        title: ICommonElement<HTMLTitleElement> & Partial<Omit<HTMLTitleElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        tr: ICommonElement<HTMLTableRowElement> & Partial<Omit<HTMLTableRowElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        track: ICommonElement<HTMLTrackElement> & Partial<Omit<HTMLTrackElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        u: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        ul: ICommonElement<HTMLUListElement> & Partial<Omit<HTMLUListElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        var: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        video: ICommonElement<HTMLVideoElement> & Partial<Omit<HTMLVideoElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        wbr: ICommonElement<HTMLElement> & Partial<Omit<HTMLElement,"style">> & {style?:Partial<CSSStyleDeclaration>};
        font:ICommonElement<HTMLFontElement>;

        svg:any;
        g:any;
        rect:any;
        circle:any;
        path:any;
        line:any;

    }
    export interface Element {}
}
