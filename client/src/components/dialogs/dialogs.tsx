import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {AddMyTemplateDialog} from "./add-my-template-dialog";
import {ShowMyTemplatesDialog} from "./show-my-templates-dialog";
import {PrintDialog} from "./print-dialog";

export class Dialogs extends BaseTsxComponent {


    render(): JSX.Element {
        return (
            <>
                <AddMyTemplateDialog/>
                <ShowMyTemplatesDialog/>
                <PrintDialog/>
            </>
        );
    }



}