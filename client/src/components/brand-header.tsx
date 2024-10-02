import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import * as logoBase64 from "../assets/logo.png";

export const BrandHeader = ()=> {
    return (
        <>
            <img className={'logo'} alt='' src={logoBase64}/>
            <div className={'brand-header'}>
                <div className={'line'}><b>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ</b></div>
                <div className={'line'}><b>ЕДЕЛЬВЕЙС МЕДІКС</b></div>
                <div className={'line'}><b>ЄДРПОУ 41218395</b></div>
                <div className={'line'}>Адреса: 02002 м. Київ, вул. Р. Окіпної 8-Б</div>
                <div className={'line'}>Банк ПАТ УкрСиббанк, МФО 351005 П/р 26007654561500</div>
                <br/>
            </div>
        </>
    );
}