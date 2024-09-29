
const separator = '.';
const MIN_YEAR_TO_ACCEPT = 1900;

const leadZero = (val: number):string=> {
    let s = '' + val;
    if (s.length < 2) s = `0${s}`;
    return s;
}

const _parseDate = (val:string):{day:number,month:number,year:number}|undefined=> {
    if (!val) return undefined;
    const segments = val.split(separator);
    if (segments.length!==3) return undefined;
    const day = +segments[0];
    const month = +segments[1];
    const year = +segments[2];
    return {day,month,year}
}

export const parseDate = (val:string)=>{
    if (!isValidDate(val)) return undefined;
    return constructDate(_parseDate(val)!);
}

const constructDate = (d:{day:number,month:number,year:number}):Date=> {
    return new Date(d.year,d.month-1,d.day);
}

export const formatDate = (value:Date)=> {
    const year:number = value.getFullYear();
    const month:number = value.getMonth() + 1;
    const day:number = value.getDate();
    return `${leadZero(day)}${separator}${leadZero(month)}${separator}${year}`;
}

export const isValidDate = (val:string)=>{
    if (!val?.length) return null;
    const parsedDate = _parseDate(val);
    if (!parsedDate) {
        return false;
    }
    if (parsedDate.year<=MIN_YEAR_TO_ACCEPT) {
        return false;
    }
    const date = constructDate(parsedDate);
    return val === formatDate(date);
}