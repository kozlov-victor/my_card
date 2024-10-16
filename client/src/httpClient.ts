

declare const setTimeout:(f:()=>void,t:number)=>number;

interface IKeyVal<T> {
    [key:string]:T;
}

const noop = (...args:any[])=>{};

const objectToQuery = (o:string|number|FormData|IKeyVal<string|number|boolean>):string|FormData=> {
    if (o===undefined || o===null) return '';
    if (o instanceof FormData) return o;
    const paramsArr:([string,string|number|boolean])[] = [];
    if (typeof o==='string' || typeof o==='number')
        return o.toString();
    Object.keys(o).forEach(key=>{
        paramsArr.push([key,encodeURIComponent(o[key])]);
    });
    return paramsArr.map((item)=>[item[0]+'='+item[1]]).join('&');
};

interface IRequestData<T> {
    method: string;
    data?: string|number|FormData|IKeyVal<string|number|boolean>;
    url: string;
    contentType?: 'multipart/form-data'|'application/json'|'application/x-www-form-urlencoded'|string;
    timeout?: number;
    ontimeout?: ()=>void;
    headers?:Record<string, string>;
}


export namespace HttpClient {

    export const request = <T>(data:IRequestData<T>):Promise<T>=> {
        let abortTmr:number;
        let resolved = false;
        data.method = data.method || 'get';
        if (data.data && data.method==='get') data.url+='?'+objectToQuery(data.data);
        const xhr=new XMLHttpRequest();
        let resolveFn = noop as (arg:T)=>void, rejectFn = noop;
        let promise;
        if ('Promise' in window) {
            promise = new Promise<T>((resolve,reject)=>{
                resolveFn = resolve;
                rejectFn = reject;
            });
        }
        xhr.onreadystatechange=()=> {
            if (xhr.readyState===4) {
                if ( (xhr.status>=200 && xhr.status<=299) || xhr.status===0) {
                    let resp = xhr.responseText;
                    const contentType = xhr.getResponseHeader("Content-Type")||'';
                    if (contentType.toLowerCase().indexOf('json')>-1 && resp?.substr!==undefined) {
                        try {
                            resp = JSON.parse(resp);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    resolveFn(resp as unknown as T);
                } else {
                    let response:any;
                    try{
                        response = JSON.parse(xhr.response);
                    } catch (e) {
                        response = xhr.response;
                    }
                    rejectFn(response);
                }
                clearTimeout(abortTmr);
                resolved = true;
            }
        };
        xhr.open(data.method,data.url,true);
        if (data.contentType) {
            if (data.contentType!=='multipart/form-data') // in this case header needs to be auto generated
                xhr.setRequestHeader("Content-Type", data.contentType);
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        if (data.headers!==undefined) {
            Object.keys(data.headers).forEach(key=>{
                xhr.setRequestHeader(key,data.headers![key]);
            });
        }
        if (data.contentType==='application/json')
            data.data = data.data && JSON.stringify(data.data);
        xhr.send(data.data as unknown as string);
        if (data.timeout) {
            abortTmr = setTimeout(()=>{
                if (resolved) return;
                xhr.abort();
                if (data.ontimeout) data.ontimeout();
                rejectFn('timeout');
            },data.timeout);
        }
        return promise as Promise<T>;
    };

    export const get = <T>(url:string,data?:IKeyVal<string|number|boolean>, contentType = undefined, headers:Record<string, string> = {}):Promise<T>=>{
        return request<T>({
            method:'get',
            url,
            data,
            contentType,
            headers
        });
    };

    export const post = <T>(url:string,data?:any, contentType = 'application/json', headers:Record<string, string> = {}):Promise<T>=>{
        return request<T>({
            method:'post',
            url,
            data,
            contentType,
            headers
        });
    };

    export const postMultiPart = <T>(url:string,file:File,data:IKeyVal<string|number|boolean>, contentType = 'multipart/form-data', headers:Record<string, string> = {}):Promise<T>=>{
        const formData = new FormData();
        Object.keys(data).forEach((key)=>{
            formData.append(key,data[key] as string);
        });
        formData.append('file',file);
        formData.append('fileName',file.name);
        return request({
            method:'post',
            url,
            data: formData,
            contentType,
            headers
        });
    };

}
