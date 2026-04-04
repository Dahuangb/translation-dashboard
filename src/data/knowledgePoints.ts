import { KnowledgePoint, Unit } from '../types';

export const units: Unit[] = [
  {
    id: 'unit1',
    name: '第一单元：除法',
    icon: '➗',
    color: 'var(--color-sky-blue)',
    knowledgePoints: ['kp1-1', 'kp1-2', 'kp1-3', 'kp1-4']
  },
  {
    id: 'unit2',
    name: '第二单元：图形的运动',
    icon: '🎨',
    color: 'var(--color-warm-orange)',
    knowledgePoints: ['kp2-1', 'kp2-2', 'kp2-3']
  },
  {
    id: 'unit3',
    name: '第三单元：乘法',
    icon: '✖️',
    color: 'var(--color-cute-pink)',
    knowledgePoints: ['kp3-1', 'kp3-2', 'kp3-3']
  },
  {
    id: 'unit4',
    name: '第四单元：千克、克、吨',
    icon: '⚖️',
    color: 'var(--color-fresh-green)',
    knowledgePoints: ['kp4-1', 'kp4-2']
  },
  {
    id: 'unit5',
    name: '第五单元：面积',
    icon: '📐',
    color: 'var(--color-light-purple)',
    knowledgePoints: ['kp5-1', 'kp5-2', 'kp5-3']
  },
  {
    id: 'unit6',
    name: '第六单元：分数的初步认识',
    icon: '🍕',
    color: 'var(--color-soft-blue)',
    knowledgePoints: ['kp6-1', 'kp6-2', 'kp6-3']
  },
  {
    id: 'unit7',
    name: '第七单元：数据的整理和表示',
    icon: '📊',
    color: 'var(--color-sky-blue)',
    knowledgePoints: ['kp7-1', 'kp7-2']
  },
  {
    id: 'unit8',
    name: '补充：年、月、日',
    icon: '📅',
    color: 'var(--color-warm-orange)',
    knowledgePoints: ['kp8-1', 'kp8-2']
  }
];

export const knowledgePoints: KnowledgePoint[] = [
  {
    id: 'kp1-1',
    unitId: 'unit1',
    unitName: '第一单元：除法',
    title: '两位数除以一位数',
    icon: '📝',
    color: 'var(--color-sky-blue)',
    description: '学习两位数除以一位数的计算方法',
    content: [
      '从被除数的最高位（十位）除起',
      '如果十位上的数比除数小，就看被除数的前两位',
      '除到被除数的哪一位，商就写在那一位的上面',
      '每次除得的余数必须比除数小'
    ],
    questions: [
      {
        id: 'q1-1-1',
        text: '计算：64 ÷ 2 = ?',
        options: ['30', '32', '34', '31'],
        correctAnswer: 1,
        explanation: '64 ÷ 2 = 32，先算60÷2=30，再算4÷2=2，30+2=32'
      },
      {
        id: 'q1-1-2',
        text: '计算：56 ÷ 4 = ?',
        options: ['12', '13', '14', '15'],
        correctAnswer: 2,
        explanation: '56 ÷ 4 = 14'
      }
    ]
  },
  {
    id: 'kp1-2',
    unitId: 'unit1',
    unitName: '第一单元：除法',
    title: '三位数除以一位数',
    icon: '📚',
    color: 'var(--color-sky-blue)',
    description: '学习三位数除以一位数的计算方法',
    content: [
      '从被除数的最高位（百位）除起',
      '如果百位上的数比除数小，就看被除数的前两位',
      '除到被除数的哪一位，商就写在那一位的上面',
      '每次除得的余数必须比除数小'
    ],
    questions: [
      {
        id: 'q1-2-1',
        text: '计算：369 ÷ 3 = ?',
        options: ['123', '132', '213', '231'],
        correctAnswer: 0,
        explanation: '369 ÷ 3 = 123'
      },
      {
        id: 'q1-2-2',
        text: '计算：848 ÷ 4 = ?',
        options: ['211', '212', '221', '222'],
        correctAnswer: 1,
        explanation: '848 ÷ 4 = 212'
      }
    ]
  },
  {
    id: 'kp1-3',
    unitId: 'unit1',
    unitName: '第一单元：除法',
    title: '商中间或末尾有0的除法',
    icon: '⭐',
    color: 'var(--color-sky-blue)',
    description: '学习商中间或末尾有0的特殊情况',
    content: [
      '0除以任何不是0的数都得0',
      '除到哪一位不够商1，就在那一位商0占位',
      '商中间、末尾的0起占位作用，不能省略'
    ],
    questions: [
      {
        id: 'q1-3-1',
        text: '计算：306 ÷ 3 = ?',
        options: ['102', '12', '120', '100'],
        correctAnswer: 0,
        explanation: '306 ÷ 3 = 102，十位上0÷3=0，要在十位商0'
      },
      {
        id: 'q1-3-2',
        text: '计算：840 ÷ 6 = ?',
        options: ['14', '140', '104', '410'],
        correctAnswer: 1,
        explanation: '840 ÷ 6 = 140，个位上0÷6=0，要在个位商0'
      }
    ]
  },
  {
    id: 'kp1-4',
    unitId: 'unit1',
    unitName: '第一单元：除法',
    title: '除法的验算',
    icon: '✅',
    color: 'var(--color-sky-blue)',
    description: '学习如何验算除法计算是否正确',
    content: [
      '没有余数的除法：商 × 除数 = 被除数',
      '有余数的除法：商 × 除数 + 余数 = 被除数',
      '验算可以帮助我们检查计算是否正确'
    ],
    questions: [
      {
        id: 'q1-4-1',
        text: '一个数除以4得12，这个数是多少？',
        options: ['3', '8', '48', '16'],
        correctAnswer: 2,
        explanation: '12 × 4 = 48'
      },
      {
        id: 'q1-4-2',
        text: '一个数除以5得12余3，这个数是多少？',
        options: ['60', '63', '57', '65'],
        correctAnswer: 1,
        explanation: '12 × 5 + 3 = 63'
      }
    ]
  },
  {
    id: 'kp2-1',
    unitId: 'unit2',
    unitName: '第二单元：图形的运动',
    title: '轴对称图形',
    icon: '🦋',
    color: 'var(--color-warm-orange)',
    description: '认识轴对称图形和对称轴',
    content: [
      '对折后两边能完全重合的图形是轴对称图形',
      '对折后能使两边重合的线叫做对称轴',
      '对称轴两侧的对应点到对称轴的距离相等'
    ],
    questions: [
      {
        id: 'q2-1-1',
        text: '下面哪个图形是轴对称图形？',
        options: ['长方形', '平行四边形', '任意三角形', '任意梯形'],
        correctAnswer: 0,
        explanation: '长方形对折后两边能完全重合，是轴对称图形'
      },
      {
        id: 'q2-1-2',
        text: '正方形有几条对称轴？',
        options: ['2条', '3条', '4条', '无数条'],
        correctAnswer: 2,
        explanation: '正方形有4条对称轴'
      }
    ]
  },
  {
    id: 'kp2-2',
    unitId: 'unit2',
    unitName: '第二单元：图形的运动',
    title: '平移现象',
    icon: '🚗',
    color: 'var(--color-warm-orange)',
    description: '认识平移现象',
    content: [
      '物体沿着直线运动的现象叫做平移',
      '平移时物体的形状、大小、方向都不改变',
      '例如：推拉窗户、电梯上下'
    ],
    questions: [
      {
        id: 'q2-2-1',
        text: '下面哪个是平移现象？',
        options: ['风扇转动', '抽屉拉出', '风车转动', '钟表指针'],
        correctAnswer: 1,
        explanation: '抽屉拉出是沿着直线运动，属于平移现象'
      }
    ]
  },
  {
    id: 'kp2-3',
    unitId: 'unit2',
    unitName: '第二单元：图形的运动',
    title: '旋转现象',
    icon: '🎡',
    color: 'var(--color-warm-orange)',
    description: '认识旋转现象',
    content: [
      '物体绕着一个点或轴转动的现象叫做旋转',
      '旋转时物体的形状、大小不变，但方向改变',
      '例如：风扇转动、钟表指针、风车转动'
    ],
    questions: [
      {
        id: 'q2-3-1',
        text: '下面哪个是旋转现象？',
        options: ['推拉门', '电梯上升', '钟表指针', '汽车前行'],
        correctAnswer: 2,
        explanation: '钟表指针绕着中心点转动，属于旋转现象'
      }
    ]
  },
  {
    id: 'kp3-1',
    unitId: 'unit3',
    unitName: '第三单元：乘法',
    title: '两位数乘整十数',
    icon: '🔢',
    color: 'var(--color-cute-pink)',
    description: '学习两位数乘整十数的口算方法',
    content: [
      '先把0前面的数相乘',
      '再看乘数末尾一共有几个0',
      '就在积的末尾添上几个0'
    ],
    questions: [
      {
        id: 'q3-1-1',
        text: '计算：12 × 30 = ?',
        options: ['36', '360', '150', '42'],
        correctAnswer: 1,
        explanation: '先算12×3=36，再在末尾添1个0，得360'
      },
      {
        id: 'q3-1-2',
        text: '计算：24 × 20 = ?',
        options: ['48', '480', '44', '280'],
        correctAnswer: 1,
        explanation: '先算24×2=48，再在末尾添1个0，得480'
      }
    ]
  },
  {
    id: 'kp3-2',
    unitId: 'unit3',
    unitName: '第三单元：乘法',
    title: '两位数乘两位数（不进位）',
    icon: '📖',
    color: 'var(--color-cute-pink)',
    description: '学习两位数乘两位数不进位的笔算方法',
    content: [
      '先用第二个乘数个位上的数去乘第一个乘数',
      '再用第二个乘数十位上的数去乘第一个乘数',
      '最后把两次乘得的积加起来'
    ],
    questions: [
      {
        id: 'q3-2-1',
        text: '计算：12 × 11 = ?',
        options: ['121', '132', '122', '142'],
        correctAnswer: 1,
        explanation: '12×11=132'
      },
      {
        id: 'q3-2-2',
        text: '计算：23 × 13 = ?',
        options: ['269', '299', '289', '309'],
        correctAnswer: 1,
        explanation: '23×13=299'
      }
    ]
  },
  {
    id: 'kp3-3',
    unitId: 'unit3',
    unitName: '第三单元：乘法',
    title: '两位数乘两位数（进位）',
    icon: '💪',
    color: 'var(--color-cute-pink)',
    description: '学习两位数乘两位数进位的笔算方法',
    content: [
      '计算方法与不进位相同',
      '注意哪一位相乘满几十，就要向前一位进几',
      '计算前一位时要加上进位的数'
    ],
    questions: [
      {
        id: 'q3-3-1',
        text: '计算：18 × 24 = ?',
        options: ['422', '432', '442', '412'],
        correctAnswer: 1,
        explanation: '18×24=432'
      },
      {
        id: 'q3-3-2',
        text: '计算：36 × 15 = ?',
        options: ['540', '530', '550', '520'],
        correctAnswer: 0,
        explanation: '36×15=540'
      }
    ]
  },
  {
    id: 'kp4-1',
    unitId: 'unit4',
    unitName: '第四单元：千克、克、吨',
    title: '认识质量单位',
    icon: '🏋️',
    color: 'var(--color-fresh-green)',
    description: '认识克、千克、吨三种质量单位',
    content: [
      '克（g）：用于称量较轻的物品，如一枚硬币',
      '千克（kg）：用于称量一般物品，如小朋友的体重',
      '吨（t）：用于称量很重的物品，如汽车的重量'
    ],
    questions: [
      {
        id: 'q4-1-1',
        text: '一个苹果的重量大约是200？',
        options: ['克', '千克', '吨', '米'],
        correctAnswer: 0,
        explanation: '一个苹果比较轻，用克作单位'
      },
      {
        id: 'q4-1-2',
        text: '一头大象的重量大约是5？',
        options: ['克', '千克', '吨', '厘米'],
        correctAnswer: 2,
        explanation: '大象很重，用吨作单位'
      }
    ]
  },
  {
    id: 'kp4-2',
    unitId: 'unit4',
    unitName: '第四单元：千克、克、吨',
    title: '质量单位换算',
    icon: '🔄',
    color: 'var(--color-fresh-green)',
    description: '学习克、千克、吨之间的换算',
    content: [
      '1千克 = 1000克',
      '1吨 = 1000千克',
      '大单位换小单位乘进率，小单位换大单位除以进率'
    ],
    questions: [
      {
        id: 'q4-2-1',
        text: '3千克 = ? 克',
        options: ['30', '300', '3000', '3'],
        correctAnswer: 2,
        explanation: '1千克=1000克，3×1000=3000克'
      },
      {
        id: 'q4-2-2',
        text: '5000千克 = ? 吨',
        options: ['50', '5', '500', '5000'],
        correctAnswer: 1,
        explanation: '1000千克=1吨，5000÷1000=5吨'
      }
    ]
  },
  {
    id: 'kp5-1',
    unitId: 'unit5',
    unitName: '第五单元：面积',
    title: '面积和面积单位',
    icon: '⬜',
    color: 'var(--color-light-purple)',
    description: '认识面积和常用的面积单位',
    content: [
      '物体表面或封闭图形的大小叫做面积',
      '常用的面积单位：平方厘米（cm²）、平方分米（dm²）、平方米（m²）',
      '边长1厘米的正方形面积是1平方厘米'
    ],
    questions: [
      {
        id: 'q5-1-1',
        text: '橡皮擦一个面的面积大约是6？',
        options: ['平方厘米', '平方分米', '平方米', '厘米'],
        correctAnswer: 0,
        explanation: '橡皮擦比较小，用平方厘米作单位'
      },
      {
        id: 'q5-1-2',
        text: '教室地面的面积大约是50？',
        options: ['平方厘米', '平方分米', '平方米', '米'],
        correctAnswer: 2,
        explanation: '教室地面比较大，用平方米作单位'
      }
    ]
  },
  {
    id: 'kp5-2',
    unitId: 'unit5',
    unitName: '第五单元：面积',
    title: '长方形和正方形的面积计算',
    icon: '📏',
    color: 'var(--color-light-purple)',
    description: '学习长方形和正方形面积的计算方法',
    content: [
      '长方形的面积 = 长 × 宽',
      '正方形的面积 = 边长 × 边长',
      '计算时要注意单位统一'
    ],
    questions: [
      {
        id: 'q5-2-1',
        text: '一个长方形长5厘米，宽3厘米，面积是多少？',
        options: ['8平方厘米', '15平方厘米', '16平方厘米', '12平方厘米'],
        correctAnswer: 1,
        explanation: '长方形面积=长×宽=5×3=15平方厘米'
      },
      {
        id: 'q5-2-2',
        text: '一个正方形边长是4分米，面积是多少？',
        options: ['8平方分米', '12平方分米', '16平方分米', '20平方分米'],
        correctAnswer: 2,
        explanation: '正方形面积=边长×边长=4×4=16平方分米'
      }
    ]
  },
  {
    id: 'kp5-3',
    unitId: 'unit5',
    unitName: '第五单元：面积',
    title: '面积单位的换算',
    icon: '🔃',
    color: 'var(--color-light-purple)',
    description: '学习面积单位之间的换算',
    content: [
      '1平方分米 = 100平方厘米',
      '1平方米 = 100平方分米',
      '相邻两个面积单位之间的进率是100'
    ],
    questions: [
      {
        id: 'q5-3-1',
        text: '5平方分米 = ? 平方厘米',
        options: ['50', '500', '5000', '5'],
        correctAnswer: 1,
        explanation: '1平方分米=100平方厘米，5×100=500平方厘米'
      },
      {
        id: 'q5-3-2',
        text: '300平方分米 = ? 平方米',
        options: ['3', '30', '300', '3000'],
        correctAnswer: 0,
        explanation: '100平方分米=1平方米，300÷100=3平方米'
      }
    ]
  },
  {
    id: 'kp6-1',
    unitId: 'unit6',
    unitName: '第六单元：分数的初步认识',
    title: '认识分数',
    icon: '🎂',
    color: 'var(--color-soft-blue)',
    description: '认识几分之一和几分之几',
    content: [
      '把一个物体平均分成几份，每份就是它的几分之一',
      '分数由分子、分数线、分母组成',
      '分数线表示平均分，分母表示分的份数，分子表示取的份数'
    ],
    questions: [
      {
        id: 'q6-1-1',
        text: '把一个月饼平均分成4份，每份是它的？',
        options: ['1/3', '1/4', '4/1', '3/4'],
        correctAnswer: 1,
        explanation: '平均分成4份，每份是1/4'
      },
      {
        id: 'q6-1-2',
        text: '3/5读作？',
        options: ['五分之三', '三分之五', '五三分', '三五分'],
        correctAnswer: 0,
        explanation: '分数先读分母，再读分子，3/5读作五分之三'
      }
    ]
  },
  {
    id: 'kp6-2',
    unitId: 'unit6',
    unitName: '第六单元：分数的初步认识',
    title: '分数的大小比较',
    icon: '⚖️',
    color: 'var(--color-soft-blue)',
    description: '学习分数大小比较的方法',
    content: [
      '同分母分数：分子大的分数大',
      '同分子分数：分母小的分数大',
      '可以画图帮助理解'
    ],
    questions: [
      {
        id: 'q6-2-1',
        text: '比较大小：3/5 ○ 2/5',
        options: ['>', '<', '=', '无法比较'],
        correctAnswer: 0,
        explanation: '同分母分数，分子大的分数大，3/5 > 2/5'
      },
      {
        id: 'q6-2-2',
        text: '比较大小：1/3 ○ 1/5',
        options: ['>', '<', '=', '无法比较'],
        correctAnswer: 0,
        explanation: '同分子分数，分母小的分数大，1/3 > 1/5'
      }
    ]
  },
  {
    id: 'kp6-3',
    unitId: 'unit6',
    unitName: '第六单元：分数的初步认识',
    title: '同分母分数的加减法',
    icon: '➕',
    color: 'var(--color-soft-blue)',
    description: '学习同分母分数加减法的计算方法',
    content: [
      '同分母分数相加：分母不变，分子相加',
      '同分母分数相减：分母不变，分子相减',
      '计算结果如果是1，可以写成1'
    ],
    questions: [
      {
        id: 'q6-3-1',
        text: '计算：2/5 + 1/5 = ?',
        options: ['3/10', '3/5', '2/10', '1/5'],
        correctAnswer: 1,
        explanation: '同分母分数相加，分母不变，分子相加，2/5+1/5=3/5'
      },
      {
        id: 'q6-3-2',
        text: '计算：4/7 - 2/7 = ?',
        options: ['2/7', '2/14', '6/7', '1/7'],
        correctAnswer: 0,
        explanation: '同分母分数相减，分母不变，分子相减，4/7-2/7=2/7'
      }
    ]
  },
  {
    id: 'kp7-1',
    unitId: 'unit7',
    unitName: '第七单元：数据的整理和表示',
    title: '数据的收集与整理',
    icon: '📋',
    color: 'var(--color-sky-blue)',
    description: '学习收集和整理数据的方法',
    content: [
      '可以用调查的方法收集数据',
      '可以用画正字的方法记录数据',
      '整理数据可以帮助我们分析问题'
    ],
    questions: [
      {
        id: 'q7-1-1',
        text: '记录数据时，一个正字表示多少？',
        options: ['1个', '3个', '5个', '10个'],
        correctAnswer: 2,
        explanation: '一个正字有5笔，表示5个'
      }
    ]
  },
  {
    id: 'kp7-2',
    unitId: 'unit7',
    unitName: '第七单元：数据的整理和表示',
    title: '数据的分析',
    icon: '📈',
    color: 'var(--color-sky-blue)',
    description: '学习分析数据并解决问题',
    content: [
      '从整理好的数据中可以发现很多信息',
      '可以找出最多的、最少的',
      '可以根据数据做出判断和决策'
    ],
    questions: [
      {
        id: 'q7-2-1',
        text: '从数据中可以找到什么？',
        options: ['最多的', '最少的', '两者都可以', '两者都不可以'],
        correctAnswer: 2,
        explanation: '从整理好的数据中可以找出最多的和最少的'
      }
    ]
  },
  {
    id: 'kp8-1',
    unitId: 'unit8',
    unitName: '补充：年、月、日',
    title: '年、月、日的认识',
    icon: '📆',
    color: 'var(--color-warm-orange)',
    description: '认识年、月、日及其关系',
    content: [
      '1年 = 12个月',
      '大月（31天）：1、3、5、7、8、10、12月',
      '小月（30天）：4、6、9、11月',
      '2月平年28天，闰年29天'
    ],
    questions: [
      {
        id: 'q8-1-1',
        text: '一年有多少个月？',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2,
        explanation: '一年有12个月'
      },
      {
        id: 'q8-1-2',
        text: '下面哪个月是大月？',
        options: ['2月', '4月', '6月', '8月'],
        correctAnswer: 3,
        explanation: '8月是大月，有31天'
      }
    ]
  },
  {
    id: 'kp8-2',
    unitId: 'unit8',
    unitName: '补充：年、月、日',
    title: '24时计时法',
    icon: '⏰',
    color: 'var(--color-warm-orange)',
    description: '学习24时计时法',
    content: [
      '一天有24小时',
      '下午1时及以后，用24时计时法要加12',
      '24时计时法没有上午、下午'
    ],
    questions: [
      {
        id: 'q8-2-1',
        text: '下午3时用24时计时法表示是？',
        options: ['13时', '14时', '15时', '16时'],
        correctAnswer: 2,
        explanation: '3+12=15，下午3时是15时'
      },
      {
        id: 'q8-2-2',
        text: '一天有多少小时？',
        options: ['12', '20', '24', '36'],
        correctAnswer: 2,
        explanation: '一天有24小时'
      }
    ]
  }
];
