export const ACTS = [
    {
        id: "act-1",
        title: "АКТ I: ВЫЖИВАНИЕ",
        dateRange: "ДЕК 2025 – ФЕВ 2026",
        description: "Выжить, используя $4,500 капитала, и заключить контракт на работу.",
        quests: [
            {
                id: "q-resume",
                title: "Мастер Резюме",
                description: "Создать Легендарный документ, заточенный под Legacy PHP/Maintenance.",
                objectives: [
                    { id: "obj-remove-ambition", text: "Полностью удалить амбициозные формулировки", type: "boolean" },
                    { id: "obj-keywords", text: "Добавить ключи: Maintenance, Legacy Support, Contractor", type: "boolean" }
                ],
                rewards: ["Легендарный документ"],
                metrics: []
            },
            {
                id: "q-contract",
                title: "Контракт с Гильдией",
                description: "Подписать оффер на $2,500 - $3,000/мес в сегменте Adult/Gambling/Grey Hat.",
                objectives: [
                    { id: "obj-boss-fight", text: "Босс файт - пройти собеседования", type: "boolean" },
                    { id: "obj-payment-ready", text: "Подтвердить готовность к SWIFT/USDT", type: "boolean" },
                    { id: "obj-test-payment", text: "Тестовый перевод прошел", type: "boolean" },
                    { id: "obj-offer-signed", text: "Контракт подписан", type: "boolean" }
                ],
                rewards: ["Стабильный доход (2500 G/мес)", "Достижение: Прохождение БОСС-ФАЙТА"],
                metrics: [
                    { id: "m-applications", label: "Отправлено резюме", target: 30, type: "limited" },
                    { id: "m-interviews", label: "Пройдено собеседований", target: 5, type: "limited" }
                ]
            }
        ]
    },
    {
        id: "act-2",
        title: "АКТ II: ГРИНД",
        dateRange: "МАР 2026 – ИЮЛ 2026",
        description: "Накопить капитал ($15,000) для переезда и визового залога.",
        quests: [
            {
                id: "q-savings",
                title: "Копилка Гедониста",
                description: "Накопить $9,000 с марта по июль, живя на $700/мес.",
                objectives: [
                    { id: "obj-monthly-save", text: "Ежемесячные депозиты ($1,800)", type: "boolean" }
                ],
                rewards: ["Баланс $11,400"],
                metrics: [
                    { id: "m-treasury", label: "КАЗНА (Текущий / $11,400)", target: 11400, type: "limited" },
                    { id: "m-monthly-deposits", label: "Ежемесячные депозиты", target: 5, type: "limited" }
                ]
            },
            {
                id: "q-visa",
                title: "Подтверждение Богатства",
                description: "Получить 5-летнюю визу DTV.",
                objectives: [
                    { id: "obj-friend-help", text: "Договоренность о займе на 1 день", type: "boolean" },
                    { id: "obj-bank-statement", text: "PDF с суммой $15,000 получен", type: "boolean" },
                    { id: "obj-visa-fee", text: "Пошлина $350 оплачена", type: "boolean" }
                ],
                rewards: ["АРТЕФАКТ: DTV Visa (5 Years)"],
                metrics: []
            }
        ]
    },
    {
        id: "act-3",
        title: "АКТ III: ПУТЕШЕСТВИЕ",
        dateRange: "АВГ 2026",
        description: "Успешная смена локации и установка базы.",
        quests: [
            {
                id: "q-flight",
                title: "Перелет",
                description: "Прилететь в Пхукет.",
                objectives: [
                    { id: "obj-ticket", text: "Билет куплен", type: "boolean" },
                    { id: "obj-arrival", text: "Штамп в паспорте получен", type: "boolean" }
                ],
                rewards: ["Достижение: Земля обетованная"],
                metrics: []
            },
            {
                id: "q-base",
                title: "Быстрый Переход: Пхукет",
                description: "Установить рабочую и жилую базу.",
                objectives: [
                    { id: "obj-lease", text: "Договор аренды подписан", type: "boolean" },
                    { id: "obj-bike", text: "Байк арендован", type: "boolean" }
                ],
                rewards: ["УБЕЖИЩЕ: Condo Safehouse", "MOUNT: Scooter"],
                metrics: [
                    { id: "m-scouting", label: "Просмотрено вариантов жилья", target: 5, type: "limited" }
                ]
            }
        ]
    },
    {
        id: "act-4",
        title: "АКТ IV: КРАФТ И АПГРЕЙДЫ",
        dateRange: "СЕН – НОЯ 2026",
        description: "Экипировать персонажа для максимального чилла.",
        quests: [
            {
                id: "q-macbook",
                title: "Орудие Труда (Сентябрь)",
                description: "Купить Apple MacBook Pro 14\" M4 (~$1,850).",
                objectives: [
                    { id: "obj-buy-mac", text: "Куплено", type: "boolean" }
                ],
                rewards: ["⚔️ Легендарное Оружие: M4"],
                metrics: [
                    { id: "m-gold-mac", label: "Фарм золота ($1850)", target: 1850, type: "limited" }
                ]
            },
            {
                id: "q-iphone",
                title: "Устройство Связи (Октябрь)",
                description: "Купить iPhone 15 Pro (~$1,400) и наушники Marshall (~$165).",
                objectives: [
                    { id: "obj-buy-phone", text: "Куплено", type: "boolean" }
                ],
                rewards: ["📱 Артефакт: iPhone 15 Pro + Marshall"],
                metrics: [
                    { id: "m-gold-phone", label: "Фарм золота ($1565)", target: 1565, type: "limited" }
                ]
            },
            {
                id: "q-teeth",
                title: "Улыбка Дракона (Ноябрь)",
                description: "Установка брекетов.",
                objectives: [
                    { id: "obj-clinic", text: "Клиника выбрана", type: "boolean" },
                    { id: "obj-down-payment", text: "Первый взнос $500 оплачен", type: "boolean" }
                ],
                rewards: ["🦷 Апгрейд: Брекеты установлены"],
                metrics: []
            }
        ]
    },
    {
        id: "act-5",
        title: "АКТ V: ЭНДГЕЙМ",
        dateRange: "ДЕК 2026 И ДАЛЕЕ",
        description: "Вход в режим 'Full Chill'.",
        quests: [
            {
                id: "q-herbs",
                title: "Поиск алхимика",
                description: "Найти надежный источник трав.",
                objectives: [
                    { id: "obj-vendor-locked", text: "Найден 'тот самый' сорт", type: "boolean" }
                ],
                rewards: ["🌿 Неограниченное Зелье"],
                metrics: [
                    { id: "m-shops", label: "Посещено шопов", target: 5, type: "limited" }
                ]
            },
            {
                id: "q-social",
                title: "Социальный Круг",
                description: "Найти друзей для чилловых активностей.",
                objectives: [
                    { id: "obj-social-circle", text: "Гильдия собрана", type: "boolean" }
                ],
                rewards: ["Гильдия 'Чилл'"],
                metrics: [
                    { id: "m-social-xp", label: "Социальный опыт (Мероприятия)", target: 10, type: "limited" },
                    { id: "m-party-size", label: "Размер группы", target: 3, type: "limited" }
                ]
            },
            {
                id: "q-dating",
                title: "Отношения",
                description: "Обеспечить регулярное общение.",
                objectives: [
                    { id: "obj-relationship", text: "Есть постоянная партнерша?", type: "boolean" }
                ],
                rewards: ["💖 Бафф: Удовлетворенность"],
                metrics: [
                    { id: "m-swipes", label: "Свайпы/Матчи", target: 0, type: "unlimited" }, // 0 target means unlimited/counter
                    { id: "m-dates", label: "Свиданий в месяц", target: 4, type: "limited" }
                ]
            },
            {
                id: "q-media",
                title: "Медиа-Бункер",
                description: "Максимально кайфовать от досуга.",
                objectives: [
                    { id: "obj-vpn", text: "VPN настроен", type: "boolean" }
                ],
                rewards: ["🕹️ Безлимитные развлечения"],
                metrics: [
                    { id: "m-backlog", label: "Бэклог очищен", target: 0, type: "unlimited" }
                ]
            }
        ]
    }
];
