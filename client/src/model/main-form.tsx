import {Section, TextInputDoubleItem, TextInputItem} from "./model";
import {formatDate, parseDate} from "../utils/date-util";
import {accessor, accessorUtils} from "./accessor";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";

const BASIC_NUMERIC_SYMBOLS = '01234567890,.'.split('');

export const createMainForm = ()=>{
    accessor.clearCache();
    const mainForm:Section[] = [
        {
            title: 'Паспортна частина',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: 'Дата проведення консультації',
                    type: 'dateInput',
                    value: formatDate(new Date()),
                },
                {
                    title: 'Прізвище',
                    type: 'textInput',
                    printWithNewLine: true,
                    customPrintValue:mainForm=>{
                        const pib = accessorUtils.getPib(mainForm,'print');
                        if (!pib) return '';
                        return `Пацієнт: ${pib}`;
                    },
                },
                {
                    title: 'Ім`я',
                    type: 'textInput',
                    doesNotPrint: true,
                },
                {
                    title: 'По-батькові',
                    type: 'textInput',
                    doesNotPrint: true,
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
                    printWithNewLine: true,
                },
                {
                    title: 'Дата народження',
                    type: 'dateInput',
                    printWithNewLine: true,
                },
                {
                    title: 'Вік',
                    type: 'textInput',
                    formula:(mainForm:Section[])=>{
                        const dob = parseDate(accessor.getValue('Дата народження', mainForm));
                        if (!dob) return '';
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
                        let age = currentYear - dob.getFullYear();
                        if(birthdayThisYear > currentDate) {
                            age--;
                        }
                        return age+'';
                    },
                    disabled: true,
                    postfix: ' р.'
                },
            ]
        },
        {
            title: 'Скарги',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: '',
                    type: 'textArea',
                },
            ],
        },
        {
            title: 'Анамнез хвороби',
            type: 'section',
            expanded: true,
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
        },
        {
            title: 'Анамнез життя',
            type: 'section',
            expanded: true,
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
                    title: 'Резус-фактор',
                    type: 'comboSelect',
                    radioGroups: [
                        [
                            {value:'значення не встановлено', isDefault: true, isUndefined: true},
                            {value:'позитивний'},
                            {value:'негативний'},
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
        },
        {
            title: 'Об`єктивний статус',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: 'Вага тіла',
                    type: 'textInput',
                    allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                    value: '',
                    postfix: ' кг',
                },
                {
                    title: 'Зріст',
                    type: 'textInput',
                    allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                    postfix: ' см',
                },
                {
                    title: 'ІМТ',
                    type: 'textInput',
                    formula: (mainForm:Section[]) => {
                        const w = +accessor.getValue('Вага тіла', mainForm)!;
                        const h = +accessor.getValue('Зріст', mainForm)!;
                        if (isNaN(w) || isNaN(h)) return '';
                        const hInSm = h / 100;
                        return (w / (hInSm ** 2)).toFixed(2);
                    },
                    disabled: true,
                },
                {
                    title: 'Температура тіла',
                    type: 'textInput',
                    allowedSymbols: BASIC_NUMERIC_SYMBOLS,
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
                            {value: 'бліді'},
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
                    title: (mainForm:Section[]) => {
                        const gender = accessor.getValue('Стать', mainForm);
                        if (!gender) return 'Молочні/грудні залози';
                        else if (gender === 'ж') return 'Молочні залози';
                        else return 'Грудні залози';
                    },
                    type: 'comboSelect',
                    radioGroups: [
                        [
                            {value: 'без особливостей', isDefault: true},
                            {value: 'описати особливості', isLabelPrintable: false, hasCustomText: true},
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
                {
                    type: 'section',
                    sub: true,
                    title: 'Органи дихання',
                    expanded: true,
                    items: [
                        {
                            title: 'Sp02',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix: '%',
                            type: 'textInput',
                        },
                        {
                            title: 'ЧД',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            type: 'textInput',
                            postfix: ' на хв.'
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
                            type: 'checkBoxText',
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
                    type: 'section',
                    sub: true,
                    expanded: true,
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
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix: ' уд/хв',
                        },
                        {
                            title: 'Пульс',
                            type: 'textInput',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix: ' уд/хв',
                        },
                        {
                            title: 'АТ на правій руці',
                            type: 'textInput',
                            postfix: ' мм рт.ст.',
                        },
                        {
                            title: 'АТ на лівій руці',
                            type: 'textInput',
                            postfix: ' мм рт.ст.',
                        },
                    ]
                },
                {
                    title: 'Органи травлення',
                    type: 'section',
                    sub: true,
                    expanded: true,
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
                        {
                            title: 'Випорожнення',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'нормальні', isDefault: true},
                                    {value: 'запори', hasCustomText: true, isCustomTextOptional: true},
                                    {value: 'діарея', hasCustomText: true, isCustomTextOptional: true},
                                ],
                            ],
                            checks: [
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        },
                        {
                            title: 'Колір калу',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'звичайний', isDefault: true},
                                    {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                                ],
                            ],
                        },
                    ]
                },
                {
                    title: 'Сечостатева система',
                    type: 'section',
                    sub: true,
                    expanded: true,
                    items: [
                        {
                            title: 'Сечовипускання',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'нормальне', isDefault: true},
                                    {value: 'часте'},
                                ],
                                [
                                    {value: 'неутруднене', isDefault: true},
                                    {value: 'утруднене'},
                                ],
                                [
                                    {value: 'безболісне', isDefault: true},
                                    {value: 'болісне'},
                                ],
                            ],
                            checks: [
                                {value: 'різі'},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        },
                        {
                            title: 'Нирки',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'не пальпуються', isDefault: true},
                                    {value: 'пальпуються'},
                                ],
                            ],
                            checks: [
                                {value: 'розміри', hasCustomText: true},
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        },
                        {
                            title: 'Симптом Пастернацього',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'негативний', isDefault: true},
                                    {value: 'позитивний', hasCustomText: true, isCustomTextOptional: true},
                                    {value: 'слабо позитивний', hasCustomText: true, isCustomTextOptional: true},
                                ],
                            ],
                            checks: [
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        }
                    ]
                },
            ],
        },
        {
            title: 'Інструменальні дослідження',
            type: 'section',
            expanded: false,
            items: [
                {
                    title: 'Спірометрія',
                    type: 'section',
                    sub: true,
                    expanded: false,
                    items: [
                        {
                            title: 'Дата',
                            type: 'dateInput',
                            value: formatDate(new Date()),
                        },
                        {
                            title: 'FEV1',
                            type: 'textInputDouble',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix1: 'л',
                            postfix2: '%',
                        },
                        {
                            title: 'FVC',
                            type: 'textInputDouble',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix1: 'л',
                            postfix2: '%',
                        },
                        {
                            title: 'Проведена проба з бронходилятатором',
                            type: 'checkBoxText',
                            unchecked: true,
                            customValue: 'Сальбутамол 400 мкг',
                            printWithNewLine: true,
                        },
                        {
                            title: 'post FEV1',
                            type: 'textInputDouble',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix1: 'л',
                            postfix2: '%',
                            unchecked: true,
                            printWithNewLine: true,
                        },
                        {
                            title: 'post FVC',
                            type: 'textInputDouble',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix1: 'л',
                            postfix2: '%',
                            unchecked: true,
                        },
                        {
                            title: 'Реверсивність',
                            type: 'textInputDouble',
                            postfix1: 'л',
                            postfix2: '%',
                            disabled: true,
                            printWithNewLine: true,
                            formula1: form=>{
                                const self = accessor.getItem('Реверсивність',form) as TextInputDoubleItem;
                                if (self.unchecked) return '';
                                const postFev1 = accessor.getItem('post FEV1',form) as TextInputDoubleItem;
                                const preFev1 = accessor.getItem('FEV1',form) as TextInputDoubleItem;
                                if (!postFev1?.value1 || !preFev1?.value1) return '';
                                const result = Number(postFev1.value1) * 100 / Number(preFev1.value1);
                                if (!isFinite(result)) return '';
                                return result.toFixed(2);
                            },
                            formula2: form=>{
                                const self = accessor.getItem('Реверсивність',form) as TextInputDoubleItem;
                                if (self.unchecked) return '';
                                const postFev1 = accessor.getItem('post FEV1',form) as TextInputDoubleItem;
                                const preFev1 = accessor.getItem('FEV1',form) as TextInputDoubleItem;
                                if (!postFev1?.value2 || !preFev1?.value2) return '';
                                const result = Number(postFev1.value2) * 100 / Number(preFev1.value2) - 100;
                                if (!isFinite(result)) return '';
                                return result.toFixed(2);
                            },
                            unchecked: true,
                        },
                        {
                            title: 'FEV1 reverse',
                            type: 'textInputDouble',
                            disabled: true,
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            postfix1: 'мл',
                            postfix2: '%',
                            formula1:form=>{
                                const self = accessor.getItem('FEV1 reverse',form) as TextInputDoubleItem;
                                if (self.unchecked) return '';
                                const postFev1 = accessor.getItem('post FEV1',form) as TextInputDoubleItem;
                                const preFev1 = accessor.getItem('FEV1',form) as TextInputDoubleItem;
                                if (!postFev1?.value1 || !preFev1?.value1) return '';
                                const result = (Number(postFev1.value1) - Number(preFev1.value1)) * 1000;
                                if (!isFinite(result)) return '';
                                return result.toFixed(2);
                            },
                            formula2:form=>{
                                const self = accessor.getItem('FEV1 reverse',form) as TextInputDoubleItem;
                                if (self.unchecked) return '';
                                const postFev1 = accessor.getItem('post FEV1',form) as TextInputDoubleItem;
                                const preFev1 = accessor.getItem('FEV1',form) as TextInputDoubleItem;
                                if (!postFev1?.value2 || !preFev1?.value2) return '';
                                const result = Number(postFev1.value2) * 100 / Number(preFev1.value2);
                                if (!isFinite(result)) return '';
                                return result.toFixed(2);
                            },
                            unchecked: true,
                        },
                        {
                            title: '',
                            type: 'staticText',
                            value: 'Розглянуто відповідно до вимог ATS/ERS',
                            printWithNewLine: true,
                        },
                        {
                            title: 'Заключення',
                            type: 'textArea',
                            printWithNewLine: true,
                        },
                    ]
                },
                {
                    title: 'ЕКГ',
                    type: 'section',
                    sub: true,
                    expanded: false,
                    items: [
                        {
                            title: 'Електрична вісь',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'нормальне положення', isDefault: true},
                                    {value: 'розташована вертикально'},
                                    {value: 'розташована горизонтально'},
                                ]
                            ],
                            checks: [
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        },
                        {
                            title: 'Ритм',
                            type: 'comboSelect',
                            radioGroups: [
                                [
                                    {value: 'синусовий', isDefault: true},
                                    {value: 'не синусовий'},
                                ],
                                [
                                    {value: 'правильний', isDefault: true},
                                    {value: 'не правильний', hasCustomText: true},
                                ]
                            ],
                            checks: [
                                {value: 'інше', isLabelPrintable: false, hasCustomText: true},
                            ]
                        },
                        {
                            title: 'ЧСС',
                            allowedSymbols: BASIC_NUMERIC_SYMBOLS,
                            type: 'textInput',
                            postfix: ' уд. на хв.'
                        },
                    ]
                },
                {
                    title: 'УЗД',
                    type: 'section',
                    expanded: false,
                    items: [
                        {
                            type: 'textArea',
                            title: '',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Діагноз',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: '',
                    type: 'textArea',
                },
            ]
        },
        {
            title: 'План обстеження',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: '',
                    type: 'textArea',
                },
            ]
        },
        {
            title: 'План лікування',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: '',
                    type: 'textArea',
                },
            ]
        },
        {
            title: 'Рекомендації',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: '',
                    type: 'textArea',
                },
            ]
        },
        {
            title: 'Лікар',
            type: 'section',
            expanded: true,
            items: [
                {
                    title: 'Прізвище лікаря',
                    customPrintValue: mainForm=>{
                        const doctorEl = accessor.getItem('Прізвище лікаря',mainForm) as TextInputItem;
                        const dateEl = accessor.getItem('Дата консультації',mainForm) as TextInputItem;
                        const doctor = doctorEl.doesNotPrint?'':doctorEl.value;
                        const date = doctorEl.doesNotPrint?'':dateEl.value;
                        return (
                            <>
                                <br/>
                                <br/>
                                <table style={{width:'100%', borderCollapse:'collapsed'}}>
                                    <tbody>
                                    <tr>
                                        <td style={{width:'100%'}}>{doctor}</td>
                                        <td>{date}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </>
                        );
                    },
                    type: 'textInput',
                },
                {
                    title: 'Дата консультації',
                    type: 'dateInput',
                    value: formatDate(new Date()),
                    doesNotPrint: true,
                },
            ]
        },
    ];
    return mainForm;
}