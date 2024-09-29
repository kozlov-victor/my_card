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
                        capitalize: true,
                    },
                    {
                        title: 'Ім`я',
                        type: 'textInput',
                        capitalize: true,
                    },
                    {
                        title: 'По-батькові',
                        type: 'textInput',
                        capitalize: true,
                    },
                    {
                        title: 'Стать',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value:'ч'},
                                {value:'ж'},
                            ]
                        ],
                    },
                    {
                        title: 'Дата народження',
                        type: 'dateInput',
                    },
                    {
                        title: 'Вік',
                        type: 'textInput',
                        formula:()=>{
                            const dobString = getValue('Дата народження');
                            if (!dobString) return '';
                            const splited = dobString.split('.');
                            const dob = new Date(splited[2],splited[1]-1,splited[0]);
                            const currentDate = new Date();
                            const currentYear = currentDate.getFullYear();
                            const birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
                            let age = currentYear - dob.getFullYear();
                            if(birthdayThisYear > currentDate) {
                                age--;
                            }
                            return age+'';
                        },
                        postfix: 'р.'
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
                        title: 'Група крові',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value:'значення не встановлено', isDefault: true, isUndefined: true},
                                {value:'I'},
                                {value:'II'},
                                {value:'III'},
                                {value:'IV'},
                            ]
                        ]
                    },
                    {
                        title: 'Алергії',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не відмічає', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Інфекційні захворювання',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'заперечує', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Оперативні втручання',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'заперечує', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Хронічні захворювання',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'заперечує', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Травми',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'заперечує', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Ліки, що приймає регулярно',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'відсутні', isDefault: true},
                                {value: 'перелік', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Сімейний анамнез',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не обтяжений', isDefault: true},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
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
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'задовільний', isDefault: true},
                                {value: 'середньої важкості'},
                                {value: 'важкий'},
                                {value: 'критичний'},
                            ]
                        ]
                    },
                    {
                        title: 'Свідомість',
                        type: 'comboSelect',
                        radioGroups: [
                            [{value: 'ясна', isDefault: true},
                                {value: 'загальмована'},
                                {value: 'ступор'},
                                {value: 'сопор'},
                                {value: 'кома'},

                            ]
                        ],
                    },
                    {
                        title: 'Положення',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'активне', isDefault: true},
                                {value: 'пасивне'},
                                {value: 'вимушене', hasCustomText: true, isCustomTextOptional: true},
                            ]
                        ],
                    },
                    {
                        title: 'Конституція',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'нормостенічна', isDefault: true},
                                {value: 'гіперстенічна'},
                                {value: 'астенічна'},
                            ]
                        ],
                    },
                    {
                        title: 'Шкірні покриви',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'звичайного кольору', isDefault: true},
                                {value: 'субіктеричні'},
                                {value: 'іктеричні'},
                                {value: 'ціанотичні'},
                            ],
                            [
                                {value: 'вологі', isDefault: true},
                                {value: 'сухі'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Висипи',
                        type: 'checkBoxText',
                    },
                    {
                        title: 'Слизові оболонки',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'звичайні', isDefault: true},
                                {value: 'блідо-рожеві'},
                                {value: 'бліді'},
                                {value: 'субіктеричні'},
                                {value: 'іктеричні'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Підшкірна клітковина розвинена',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'достатньо', isDefault: true},
                                {value: 'слабо'},
                                {value: 'надмірно'},
                            ]
                        ],
                    },
                    {
                        title: 'Набряки',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'відсутні', isDefault: true},
                                {value: 'описати', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ]
                    },
                    {
                        title: 'Кістково-суглобовий та м`язовий апарат',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'без особливостей', isDefault: true},
                                {value: 'описати особливості', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ]
                    },
                    {
                        title: ()=>{
                            const gender = getValue('Стать');
                            if (!gender) return 'Молочні/грудні залози';
                            else if (gender==='ж') return 'Молочні залози';
                            else return 'Грудні залози';
                        },
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'без особливостей', isDefault: true},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        ],
                    },
                    {
                        title: 'Лімфатичні вузли',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не збільшені', isDefault: true},
                                {value: 'збільшені'},
                            ],
                            [
                                {value: 'безболісні при пальпації', isDefault: true},
                                {value: 'болючі при пальпації'},
                            ],
                            [
                                {value: 'не зв`язані з оточуючими тканинами', isDefault: true},
                                {value: 'зв`язані з оточуючими тканинами'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
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
                        postfix: 'на хв.'
                    },
                    {
                        title: 'Грудна клітка',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'нормальна', isDefault: true},
                                {value: 'деформована'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
                    },
                    {
                        title: 'Бере участь в акті дихання',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'симетрично', isDefault: true},
                                {value: 'відстає права половина'},
                                {value: 'відстає ліва половина'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
                    },
                    {
                        title: 'Підшкірна емфізема',
                        type: 'checkBoxText',
                    },
                    {
                        title: 'Пальпаторна крепітація',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'відсутня', isDefault: true},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
                    },
                    {
                        title: 'Перкуторний звук',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'ясний', isDefault: true},
                                {value: 'коробковий'},
                                {value: 'вкорочений'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
                    },
                    {
                        title: 'Рухомість легеневого краю',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'нормальна', isDefault: true},
                                {value: 'обмежена'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
                    },
                    {
                        title: 'Аускультація',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'дихання везикулярне', isDefault: true},
                                {value: 'дихання жорстке'},
                                {value: 'дихання ослаблене'},
                                {value: 'дихання бронхіальне'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ],
                        ],
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
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'немає', isDefault: true},
                                {value: 'відмічається'},
                            ]
                        ],
                    },
                    {
                        title: 'Видима пульсація вен',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'немає', isDefault: true},
                                {value: 'відмічається'},
                            ]
                        ],
                    },
                    {
                        title: 'Верхівковий поштовх',
                        type: 'comboSelect',
                        radioGroups: [
                           [
                               {value: 'нормальний', isDefault: true},
                               {value: 'розлитий'},
                           ]
                        ],
                        checks: [
                            {value: 'зміщений', hasCustomText: true},
                        ],
                    },
                    {
                        title: 'Межі серця',
                        type: 'comboSelect',
                        checks: [
                            {value: 'права', isDefault: true, hasCustomText: true, initialCustomText: 'в межах норми'},
                            {value: 'ліва', isDefault: true, hasCustomText: true, initialCustomText: 'в межах норми'},
                            {value: 'верхня', isDefault: true, hasCustomText: true, initialCustomText: 'в межах норми'},
                        ],
                    },
                    {
                       title: 'Аускультація',
                       type: 'comboSelect',
                       radioGroups: [
                           [
                               {value: 'тони серця чисті', isDefault: true},
                               {value: 'тони серця голосні'},
                               {value: 'тони серця приглушені'},
                           ]
                       ],
                       checks: [
                           {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                       ]
                    },
                    {
                        title: 'Шуми',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'відсутні', isDefault: true},
                                {value: 'систолічний', hasCustomText: true, isCustomTextOptional: true},
                                {value: 'діастолічний', hasCustomText: true, isCustomTextOptional: true},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
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
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'правильний', isDefault: true},
                                {value: 'аритмічний'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
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
            },
            {
                title: 'Органи травлення',
                items: [
                    {
                        title: 'Зів',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'без особливостей', isDefault: true},
                                {value: 'гіперемований'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Миглалики',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не збільшені', isDefault: true},
                                {value: 'збільшені'},
                                {value: 'видалені'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Язик',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'вологий', isDefault: true},
                                {value: 'сухий'},
                            ]
                        ],
                        checks: [
                            {value: 'обкладений нальотом', hasCustomText: true, isCustomTextOptional: true},
                        ]
                    },
                    {
                        title: 'Живіт',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value:'симетричний', isDefault: true},
                                {value:'асиметричний'},
                            ]
                        ],
                        checks: [
                            {value: 'бере участь в акті дихання', isDefault: true},
                            {value: 'втягнений'},
                            {value: 'напружений'},
                            {value: 'здутий'},
                            {value: 'збільшений за рахунок', hasCustomText: true},
                        ]
                    },
                    {
                        title: 'При пальпації живіт',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value:'м`який', isDefault: true},
                                {value:'напружений'},
                            ],
                            [
                                {value:'безболісний', isDefault: true},
                                {value:'болісний'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Ознаки асциту',
                        type: 'checkBox',
                    },
                    {
                        title: 'Печінка',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не збільшена', isDefault: true},
                                {value: 'збільшена', hasCustomText: true, isCustomTextOptional: true},
                            ],
                            [
                                {value:'не виступає з-під краю реберної дуги', isDefault: true},
                                {value:'виступає з-під краю реберної дуги', hasCustomText: true, isCustomTextOptional: true},
                            ],
                            [
                                {value:'нижній край м`який', isDefault: true},
                                {value:'нижній край ущільнений'},
                            ],
                            [
                                {value:'при пальпації безболісна', isDefault: true},
                                {value:'при пальпації болюча'},
                            ]
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Жовчний міхур',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value:'не збільшений', isDefault: true},
                                {value:'збільшений', hasCustomText: true},
                            ],
                            [
                                {value:'безболісний', isDefault: true},
                                {value:'болючий'},
                            ],
                        ],
                        checks: [
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                    {
                        title: 'Селезінка',
                        type: 'comboSelect',
                        radioGroups: [
                            [
                                {value: 'не збільшена', isDefault: true},
                                {value: 'збільшена'},
                            ],
                            [
                                {value: 'безболісна', isDefault: true},
                                {value: 'болісна'},
                            ]
                        ],
                        checks: [
                            {value: 'розміри', hasCustomText: true},
                            {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                        ]
                    },
                ]
            }
        ]
    },
    {
        title: 'Діагноз',
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
                if (i.title===name) return (i as any).value;
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
