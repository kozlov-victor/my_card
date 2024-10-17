import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import * as logoBase64 from "../assets/logo.png";

export const BrandHeader = ()=> {
    return (
        <>

            <table style={{margin: `0 auto`,textAlign:'center'}}>
                <tbody>
                <tr>
                    <td rowSpan={5}>
                        <img
                            style={{
                                display: 'inline-block',
                                width: '0.91in',
                                height: '0.94in',
                                top: '0',
                                left: '0.61in',
                                zIndex: '1',
                            }}
                            alt='' src={logoBase64}/>
                    </td>
                    <td>
                        <b>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ</b>
                    </td>
                    <td style={{width:'0.93in'}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </td>
                </tr>
                <tr>
                    <td>
                        <b>ЕДЕЛЬВЕЙС МЕДІКС</b>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <b>ЄДРПОУ 41218395</b>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        Адреса: 02002 м. Київ, вул. Р. Окіпної 8-Б
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        Банк ПАТ УкрСиббанк, МФО 351005 П/р 26007654561500
                    </td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <br/>
        </>
    );
}

// export const BrandHeader = ()=> {
//     return (
//         <>
//             <img
//                 style={{
//                     position: 'absolute',
//                     display: 'inline-block',
//                     width: '0.91in',
//                     height: '0.94in',
//                     top: '0.02in',
//                     left: '0.61in',
//                     zIndex: '1',
//                 }}
//                 alt=''
//                 src={logoBase64}/>
//             <div className={'brand-header'}>
//                 <div className={'line'}><b>ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ</b></div>
//                 <div className={'line'}><b>ЕДЕЛЬВЕЙС МЕДІКС</b></div>
//                 <div className={'line'}><b>ЄДРПОУ 41218395</b></div>
//                 <div className={'line'}>Адреса: 02002 м. Київ, вул. Р. Окіпної 8-Б</div>
//                 <div className={'line'}>Банк ПАТ УкрСиббанк, МФО 351005 П/р 26007654561500</div>
//                 <br/>
//             </div>
//         </>
//     );
// }