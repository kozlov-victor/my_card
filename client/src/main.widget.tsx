import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";
import {Section} from "./model/model";
import {SectionComponent} from "./components/section";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {SerializeUtil} from "./utils/serialize-util";
import {HttpClient} from "./httpClient";
import {Dialogs} from "./components/dialogs/dialogs";
import {PrintDialog} from "./components/dialogs/print-dialog";
import {HtmlRendererUtil} from "./utils/html-renderer-util";

const mainForm:Section[] = [
    {
        title: 'Паспортна частина',
        blocks: [
            {
                items: [
                    {
                        title: 'Прізвище',
                        type: 'textInput',
                    },
                    {
                        title: 'Ім`я',
                        type: 'textInput',
                    },
                    {
                        title: 'По-батькові',
                        type: 'textInput',
                    },
                ]
            }
        ]
    },
    {
        title: 'Скарги',
        blocks: [
            {
                items: [
                    {
                        title: '',
                        type: 'textArea',
                    },
                ]
            }
        ]
    },
    {
        title: 'Анамнез хвороби',
        blocks: [
            {
                items: [
                    {
                        title: '',
                        type: 'textArea',
                    },
                    {
                        title: 'Приймає препарати',
                        type: 'checkBoxText',
                    },
                ]
            }
        ]
    },
    {
        title: 'Анамнез життя',
        blocks: [
            {
                items: [
                    {
                        title: 'Стать',
                        type: 'dropDown',
                        values: [
                            {value:'ч'},
                            {value:'ж'},
                        ]
                    },
                    {
                        title: 'Група крові',
                        type: 'dropDown',
                        values: [
                            {value:'I'},
                            {value:'II'},
                            {value:'III'},
                            {value:'IV'},
                        ]
                    },
                    {
                        title: 'Алергії',
                        type: 'textInput',
                        value: 'заперечує',
                        expandable: true,
                    },
                    {
                        title: 'Інфекційні захворювання',
                        type: 'textInput',
                        value: 'заперечує',
                        expandable: true,
                    },
                    {
                        title: 'Оперативні втручання',
                        type: 'textInput',
                        value: 'заперечує',
                        expandable: true,
                    },
                    {
                        title: 'Хронічні захворювання',
                        type: 'textInput',
                        value: 'заперечує',
                        expandable: true,
                    },
                    {
                        title: 'Травми',
                        type: 'textInput',
                        value: 'заперечує',
                        expandable: true,
                    },
                    {
                        title: 'Ліки, що приймає регулярно',
                        type: 'textInput',
                        value: 'відсутні',
                        expandable: true,
                    },
                    {
                        title: 'Сімейний анамнез',
                        type: 'textInput',
                        value: 'не обтяжений',
                        expandable: true,
                    },
                ]
            }
        ]
    },
    {
        title: 'Об`єктивний статус',
        blocks: [
            {
                items: [
                    {
                        title: 'Вага тіла',
                        type: 'textInput',
                        value: '',
                        postfix: 'кг',
                    },
                    {
                        title: 'Зріст',
                        type: 'textInput',
                        postfix: 'см',
                    },
                    {
                        title: 'ІМТ',
                        type: 'textInput',
                        formula: ()=>{
                            const w = +getValue('Вага тіла')!;
                            const h = +getValue('Зріст')!;
                            if (isNaN(w) || isNaN(h)) return '-';
                            const hInSm = h / 100;
                            return (w/(hInSm**2)).toFixed(2);
                        },
                    },
                    {
                        title: 'Температура тіла',
                        type: 'textInput',
                        value: '36.6',
                        postfix: '°C'
                    },
                    {
                        title: 'Загальний стан',
                        type: 'dropDown',
                        values: [
                            {value: 'задовільний', isDefault: true},
                            {value: 'середньої важкості'},
                            {value: 'важкий'},
                            {value: 'критичний'},
                            {value: 'other'},
                        ]
                    },
                    {
                        title: 'Свідомість',
                        type: 'dropDown',
                        values: [
                            {value: 'ясна', isDefault: true},
                            {value: 'загальмована'},
                            {value: 'ступор'},
                            {value: 'сопор'},
                            {value: 'кома'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Положення',
                        type: 'dropDown',
                        values: [
                            {value: 'активне', isDefault: true},
                            {value: 'пасивне'},
                            {value: 'вимушене'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Конституція',
                        type: 'dropDown',
                        values: [
                            {value: 'нормостенічна', isDefault: true},
                            {value: 'гіперстенічна'},
                            {value: 'астенічна'},
                        ]
                    },
                    {
                        title: 'Колір шкірних покривів',
                        type: 'dropDown',
                        values: [
                            {value: 'звичайни', isDefault: true},
                            {value: 'субіктеричний'},
                            {value: 'іктеричний'},
                            {value: 'ціанотичний'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Шкіра',
                        type: 'dropDown',
                        values: [
                            {value: 'волога', isDefault: true},
                            {value: 'суха'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Висипи',
                        type: 'checkBoxText',
                    },
                    {
                        title: 'Слизові оболонки',
                        type: 'dropDown',
                        values: [
                            {value: 'звичайні', isDefault: true},
                            {value: 'блідо-рожеві'},
                            {value: 'бліді'},
                            {value: 'субіктеричні'},
                            {value: 'іктеричні'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Підшкірна клітковина розвинена',
                        type: 'dropDown',
                        values: [
                            {value: 'задовільно', isDefault: true},
                            {value: 'слабо'},
                            {value: 'надмірно'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Набряки',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутні', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Кістково-суглобовий та м`язовий апарат',
                        type: 'dropDown',
                        values: [
                            {value: 'без особливостей', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: ()=>{
                            const gender = getValue('Стать');
                            if (!gender) return 'Молочні/грудні залози';
                            else if (gender==='ж') return 'Молочні залози';
                            else return 'Грудні залози';
                        },
                        type: 'dropDown',
                        values: [
                            {value: 'без особливостей', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Лімфатичні вузли',
                        type: 'dropDown',
                        values: [
                            {value: 'не збільшені', isDefault: true},
                            {value: 'збільшені', text: 'інше'},
                        ]
                    },
                    {
                        title: 'При пальпації',
                        type: 'dropDown',
                        values: [
                            {value: 'безболісні', isDefault: true},
                            {value: 'болючі'},
                        ]
                    },
                    {
                        title: 'Зв`язок з оточуючими тканинами',
                        type: 'dropDown',
                        values: [
                            {value: 'так', isDefault: true},
                            {value: 'ні'}
                        ]
                    },
                ]
            },
            {
                title: 'Органи дихання',
                items: [
                    {
                        title: 'Sp02',
                        type: 'textInput',
                    },
                    {
                        title: 'ЧД',
                        type: 'textInput',
                    },
                    {
                        title: 'Грудна клітка',
                        type: 'dropDown',
                        values: [
                            {value: 'нормальна', isDefault: true},
                            {value: 'деформована'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Бере участь в акті дихання',
                        type: 'dropDown',
                        values: [
                            {value: 'симетрично', isDefault: true},
                            {value: 'відстає права половина', isDefault: true},
                            {value: 'відстає ліва половина', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Підшкірна емфізема',
                        type: 'dropDown',
                        values: [
                            {value: 'ні', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Пальпаторна крепітація',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутня', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Пальпаторна крепітація',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутня', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Перкуторний звук',
                        type: 'dropDown',
                        values: [
                            {value: 'ясний', isDefault: true},
                            {value: 'коробковий'},
                            {value: 'вкорочений'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Рухомість легеневого краю',
                        type: 'dropDown',
                        values: [
                            {value: 'нормальна'},
                            {value: 'обмежена'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Аускультація',
                        type: 'dropDown',
                        values: [
                            {value: 'дихання везикулярне', isDefault: true},
                            {value: 'дихання жорстке'},
                            {value: 'дихання ослаблене'},
                            {value: 'дихання бронхіальне'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Сухі хрипи',
                        type: 'checkBoxText',
                    },
                    {
                        title: 'Вологі хрипи',
                        type: 'checkBoxText',
                    },
                ]
            },
            {
                title: 'Органи кровообігу',
                items: [
                    {
                        title: 'Видима пульсація артерій',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутня', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Видима пульсація вен',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутня', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Верхівковий поштовх',
                        type: 'dropDown',
                        values: [
                            {value: 'нормальний', isDefault: true},
                            {value: 'розлитий'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Межі серця. Права',
                        type: 'dropDown',
                        values: [
                            {value: 'в межах норми', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Ліва',
                        type: 'dropDown',
                        values: [
                            {value: 'в межах норми', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Верхня',
                        type: 'dropDown',
                        values: [
                            {value: 'в межах норми', isDefault: true},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Аускультація',
                        type: 'dropDown',
                        values: [
                            {value: 'тони серця чисті', isDefault: true},
                            {value: 'тони серця голосні'},
                            {value: 'тони серця приглушені'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Шуми',
                        type: 'dropDown',
                        values: [
                            {value: 'відсутні', isDefault: true},
                            {value: 'систолічний'},
                            {value: 'діастолічний'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'Акцент I тону',
                        type: 'checkBox',
                    },
                    {
                        title: 'Акцент II тону',
                        type: 'checkBox',
                    },
                    {
                        title: 'Ритм серця',
                        type: 'dropDown',
                        values: [
                            {value: 'правильний', isDefault: true},
                            {value: 'аритмічний'},
                            {value: 'other', text: 'інше'},
                        ]
                    },
                    {
                        title: 'ЧСС',
                        type: 'textInput',
                        postfix: 'уд/хв',
                    },
                    {
                        title: 'Пульс',
                        type: 'textInput',
                        postfix: 'уд/хв',
                    },
                    {
                        title: 'АТ на правій руці',
                        type: 'textInput',
                        postfix: 'мм рт.ст.',
                    },
                    {
                        title: 'АТ на лівій руці',
                        type: 'textInput',
                        postfix: 'мм рт.ст.',
                    },
                ]
            }
        ]
    },
    {
        title: 'План обстеження',
        blocks: [
            {
                items: [
                    {
                        title: '',
                        type: 'textArea',
                    },
                ]
            }
        ]
    },
    {
        title: 'Рекомендації',
        blocks: [
            {
                items: [
                    {
                        title: '',
                        type: 'textArea',
                    },
                ]
            }
        ]
    },
    {
        title: 'План лікування',
        blocks: [
            {
                items: [
                    {
                        title: '',
                        type: 'textArea',
                    },
                ]
            }
        ]
    },
];


const getValue = (name:string)=>{
    for (const s of mainForm) {
        for (const b of s.blocks) {
            for (const i of b.items) {
                if (i.title===name) return i.value;
            }
        }
    }
    return undefined;
}

export class MainWidget extends DomRootComponent {

    private serializeUtil = new SerializeUtil();
    private htmlRenderUtil = new HtmlRendererUtil();

    @Reactive.Method()
    override async onMounted() {
        super.onMounted();

        const session = await HttpClient.post<any>('/load-session');
        this.serializeUtil.deserialize(mainForm, session);

        setInterval(()=>{
            HttpClient.post('/save-session', this.serializeUtil.serialize(mainForm));
        },1000*30);
    }

    @Reactive.Method()
    private async saveSession() {
        await HttpClient.post('/save-session',this.serializeUtil.serialize(mainForm));
    }

    @Reactive.Method()
    private async prepareForPrint() {
        const html = this.htmlRenderUtil.render(mainForm);
        console.log(html);
        await HttpClient.post('/save-print-session',{html});
        await PrintDialog.open();
    }


    render(): JSX.Element {
        return (
            <>
                <button onclick={this.saveSession}>Зберігти сесію</button>
                <button onclick={this.prepareForPrint}>Друк</button>
                {mainForm.map((section,index)=><SectionComponent trackBy={''+index} section={section}/>)}
                <Dialogs/>
            </>
        );
    }


}
