export type Lifelines = {
  fiftyFifty: boolean;
  askAudience: boolean;
  skip: boolean;
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
  isAnswered?: boolean;
  isChallenge?: boolean;
};

export type Category = {
  id: string;
  name: string;
  questions: Question[];
};

export type Team = {
  id: string;
  name: string;
  score: number;
  lifelines: Lifelines;
};

export const categories: Category[] = [

  {
    id: 'history',
    name: 'تاريخ إسلامي',
    questions: [

      {
        id: 101,
        text: 'من هو أول خليفة في الإسلام؟',
        options: ['عمر بن الخطاب', 'علي بن أبي طالب', 'أبو بكر الصديق', 'عثمان بن عفان'],
        correctAnswerIndex: 2,
        points: 100
      },

      {
        id: 102,
        text: 'أي مدينة كانت عاصمة الدولة الأموية؟',
        options: ['بغداد', 'دمشق', 'القاهرة', 'المدينة'],
        correctAnswerIndex: 1,
        points: 200
      },

      {
        id: 103,
        text: 'في عهد أي خليفة تم جمع القرآن في مصحف واحد؟',
        options: ['أبو بكر الصديق', 'عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب'],
        correctAnswerIndex: 2,
        points: 300
      },

      {
        id: 104,
        text: 'من هو القائد الذي فتح الأندلس عام 92 هـ؟',
        options: ['طارق بن زياد', 'صلاح الدين', 'خالد بن الوليد', 'سعد بن أبي وقاص'],
        correctAnswerIndex: 0,
        points: 400
      },

      {
        id: 105,
        text: 'كم استمرت الخلافة العباسية تقريباً؟',
        options: ['100 سنة', '300 سنة', '500 سنة', 'أكثر من 500 سنة'],
        correctAnswerIndex: 3,
        points: 500,
        isChallenge: true
      }

    ]
  },

  {
    id: 'medicine',
    name: 'طب وجسم الإنسان',
    questions: [

      {
        id: 201,
        text: 'كم عدد عظام جسم الإنسان البالغ؟',
        options: ['106', '206', '306', '406'],
        correctAnswerIndex: 1,
        points: 100
      },

      {
        id: 202,
        text: 'أي عضو مسؤول عن التنفس؟',
        options: ['القلب', 'الرئتان', 'الكبد', 'المعدة'],
        correctAnswerIndex: 1,
        points: 200
      },

      {
        id: 203,
        text: 'ما هو أسرع عضو شفاءً في جسم الإنسان؟',
        options: ['العظم', 'الجلد', 'الكبد', 'الدم'],
        correctAnswerIndex: 1,
        points: 300
      },

      {
        id: 204,
        text: 'كم مرة ينبض القلب تقريباً في الدقيقة عند الإنسان الطبيعي؟',
        options: ['20', '40', '70', '150'],
        correctAnswerIndex: 2,
        points: 400
      },

      {
        id: 205,
        text: 'ما هو الجزء المسؤول عن التوازن في الدماغ؟',
        options: ['المخ', 'المخيخ', 'النخاع', 'القشرة'],
        correctAnswerIndex: 1,
        points: 500,
        isChallenge: true
      }

    ]
  },

  {
    id: 'sports',
    name: 'رياضة عربية',
    questions: [

      {
        id: 301,
        text: 'كم لاعب في فريق كرة القدم داخل الملعب؟',
        options: ['9', '10', '11', '12'],
        correctAnswerIndex: 2,
        points: 100
      },

      {
        id: 302,
        text: 'كم مدة مباراة كرة القدم الرسمية؟',
        options: ['60 دقيقة', '70 دقيقة', '80 دقيقة', '90 دقيقة'],
        correctAnswerIndex: 3,
        points: 200
      },

      {
        id: 303,
        text: 'أي منتخب عربي شارك أول مرة في كأس العالم؟',
        options: ['السعودية', 'مصر', 'المغرب', 'تونس'],
        correctAnswerIndex: 1,
        points: 300
      },

      {
        id: 304,
        text: 'كم مرة فازت السعودية بكأس آسيا؟',
        options: ['1', '2', '3', '4'],
        correctAnswerIndex: 2,
        points: 400
      },

      {
        id: 305,
        text: 'من هو أكثر لاعب عربي تسجيلاً للأهداف الدولية؟',
        options: ['محمد صلاح', 'ماجد عبدالله', 'حسين سعيد', 'علي دائي'],
        correctAnswerIndex: 3,
        points: 500,
        isChallenge: true
      }

    ]
  },

  {
    id: 'geography',
    name: 'جغرافيا الوطن العربي',
    questions: [

      {
        id: 401,
        text: 'ما هي أكبر دولة عربية مساحة؟',
        options: ['مصر', 'السعودية', 'الجزائر', 'السودان'],
        correctAnswerIndex: 2,
        points: 100
      },

      {
        id: 402,
        text: 'ما هي عاصمة السعودية؟',
        options: ['جدة', 'الرياض', 'مكة', 'الدمام'],
        correctAnswerIndex: 1,
        points: 200
      },

      {
        id: 403,
        text: 'أي نهر يمر في مصر؟',
        options: ['دجلة', 'الفرات', 'النيل', 'الأردن'],
        correctAnswerIndex: 2,
        points: 300
      },

      {
        id: 404,
        text: 'كم عدد دول مجلس التعاون الخليجي؟',
        options: ['4', '5', '6', '7'],
        correctAnswerIndex: 2,
        points: 400
      },

      {
        id: 405,
        text: 'أي دولة عربية تحدها 7 دول عربية أخرى؟',
        options: ['العراق', 'السعودية', 'سوريا', 'مصر'],
        correctAnswerIndex: 0,
        points: 500,
        isChallenge: true
      }

    ]
  },

  {
    id: 'literature',
    name: 'أدب ولغة',
    questions: [

      {
        id: 501,
        text: 'كم عدد حروف اللغة العربية؟',
        options: ['26', '28', '30', '32'],
        correctAnswerIndex: 1,
        points: 100
      },

      {
        id: 502,
        text: 'ما عكس كلمة "كبير"؟',
        options: ['طويل', 'صغير', 'واسع', 'ثقيل'],
        correctAnswerIndex: 1,
        points: 200
      },

      {
        id: 503,
        text: 'ما نوع كلمة "يكتب"؟',
        options: ['اسم', 'فعل', 'حرف', 'صفة'],
        correctAnswerIndex: 1,
        points: 300
      },

      {
        id: 504,
        text: 'من صاحب قصيدة "إذا الشعب يوماً أراد الحياة"؟',
        options: ['أحمد شوقي', 'المتنبي', 'أبو القاسم الشابي', 'نزار قباني'],
        correctAnswerIndex: 2,
        points: 400
      },

      {
        id: 505,
        text: 'ما هو بحر الشعر في بيت: قفا نبك من ذكرى حبيب ومنزل؟',
        options: ['الطويل', 'الكامل', 'الوافر', 'البسيط'],
        correctAnswerIndex: 0,
        points: 500,
        isChallenge: true
      }

    ]
  },

  {
    id: 'culture',
    name: 'ثقافة وإسلاميات',
    questions: [

      {
        id: 601,
        text: 'كم عدد أركان الإسلام؟',
        options: ['3', '4', '5', '6'],
        correctAnswerIndex: 2,
        points: 100
      },

      {
        id: 602,
        text: 'كم عدد الصلوات المفروضة يومياً؟',
        options: ['3', '4', '5', '6'],
        correctAnswerIndex: 2,
        points: 200
      },

      {
        id: 603,
        text: 'ما أطول سورة في القرآن؟',
        options: ['يس', 'البقرة', 'النساء', 'الكهف'],
        correctAnswerIndex: 1,
        points: 300
      },

      {
        id: 604,
        text: 'كم عدد سور القرآن الكريم؟',
        options: ['100', '114', '120', '130'],
        correctAnswerIndex: 1,
        points: 400
      },

      {
        id: 605,
        text: 'ما هي السورة التي لا تبدأ بالبسملة؟',
        options: ['الأنفال', 'التوبة', 'الفتح', 'الحجرات'],
        correctAnswerIndex: 1,
        points: 500,
        isChallenge: true
      }

    ]

  }

];