
class Stream<T> {

    private pointer = 0;

    constructor(private arr:T[]) {
    }

    public isEof() {
        return this.pointer === this.arr.length;
    }

    public getNext() {
        if (this.isEof()) throw new Error(`unexpected end of stream`);
        return this.arr[this.pointer++];
    }

    public lookNext() {
        if (this.isEof()) throw new Error(`unexpected end of stream`);
        return this.arr[this.pointer];
    }

}

const isDigit = (char:string)=>{
    return '0123456789'.indexOf(char)!==-1;
}

interface IAsIsMaskChar {
    type:'asIs',
    value:string;
}

interface ISpecialMaskChar {
    type:'special',
    test:(char:string)=>boolean;
}


type tMaskChar = IAsIsMaskChar|ISpecialMaskChar;

export class InputMask {

    private mask:tMaskChar[];
    private static readonly specialMaskChars:Record<string, (char:string)=>boolean> = {
        D: isDigit,
    };


    constructor(private el:HTMLInputElement, mask:string) {
        this.mask = this.compileMask(mask);
        this.listenToInput();
    }

    private compileMask (mask:string) {
        const result:tMaskChar[] = [];
        for (const char of mask) {
            if (InputMask.specialMaskChars[char]!==undefined) {
                result.push({
                    type: 'special',
                    test: InputMask.specialMaskChars[char]
                })
            }
            else {
                result.push({
                    type: 'asIs',
                    value: char
                })
            }
        }
        return result;
    }

    private listenToInput() {
        const el = this.el;
        el.addEventListener('keyup',e=>{
            if (
                [
                    37,39, // cursor left right
                    8 // backspace
                ].indexOf(e.keyCode)>-1
            ) return;
            const value = el.value;
            const cursorPosition = this.getCursorPosition();
            const isCursorOnTheLastChar = cursorPosition===value.length;
            el.value = this.maskValue(value);
            if (isCursorOnTheLastChar) return;
            setTimeout(()=>{
                this.setCursorPosition(cursorPosition);
            },10);
        });
        el.addEventListener('blur',e=>{
            el.value = this.maskValue(el.value);
        });
    }

    private getCursorPosition() {
        return this.el.selectionStart!;
    }

    private setCursorPosition(pos:number) {
        if (pos===null) return;
        this.el.setSelectionRange(pos, pos);
    }

    public maskValue(raw:string) {
        const rawCharStream = new Stream(raw.split(''));
        const maskCharStream = new Stream(this.mask);
        const out:string[] = [];
        while (!rawCharStream.isEof()) {
            if (maskCharStream.isEof()) break;
            const possibleNextMaskChar = maskCharStream.lookNext();
            if (possibleNextMaskChar.type==='asIs') {
                const nextMaskChar = maskCharStream.getNext() as IAsIsMaskChar;
                out.push(nextMaskChar.value);
            }
            else {
                const nextRawChar = rawCharStream.getNext();
                if (possibleNextMaskChar.test(nextRawChar)) {
                    out.push(nextRawChar);
                    maskCharStream.getNext();
                }
            }
        }
        return out.join('');
    }

}

// const m = new InputMask(undefined!,'DD.DD.DDDD');
// console.log(m.maskValue('cv12m,12dsdfsdf3456')); // 12.12.3456
// console.log(m.maskValue('12.12....3456')); // 12.12.3456
// console.log(m.maskValue('12123456')); // 12.12.3456
// console.log(m.maskValue('================12123456')); // 12.12.3456
// console.log(m.maskValue('sd12')); // 12

