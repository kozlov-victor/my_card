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
                                position: 'fixed',
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
                    <td style={{width:'0.91in'}}>
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