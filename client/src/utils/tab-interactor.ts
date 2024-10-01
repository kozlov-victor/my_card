
const key = 'tabInteractor::key';
let cnt = 0;

export class TabInteractor {

    public static listen(fn:()=>void) {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            fn();
        }
        else {
            window.addEventListener('storage', e => {
                if (e.key===key) {
                    localStorage.removeItem(key);
                    fn();
                }
            });
        }

        // and maybe fallback
        setInterval(()=>{
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                fn();
            }
        },5_000);

    }

    public static trigger() {
        localStorage.setItem(key, ''+(cnt++));
    }

}