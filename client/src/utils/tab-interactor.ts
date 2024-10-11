
let cnt = 0;

export class TabInteractor {

    public static listen(key:string,fn:()=>void) {
        console.log('listen to', key);
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
        // setTimeout(()=>{
        //     if (localStorage.getItem(key)) {
        //         localStorage.removeItem(key);
        //         fn();
        //     }
        // },5_000);

    }

    public static trigger(key:string) {
        console.log('triggered');
        localStorage.setItem(key, ''+(cnt++));
    }

}