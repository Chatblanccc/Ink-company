import { type Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type Product = {
  slug: string;
  category: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  heroTag: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  applications: LocalizedText[];
  features: LocalizedText[];
  specifications: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  featured: boolean;
};

export type Article = {
  slug: string;
  category: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  publishedAt: string;
  readTime: number;
  featured: boolean;
};

export type InquiryRecord = {
  id: string;
  name: string;
  company: string;
  email: string;
  market: string;
  status: "NEW" | "QUALIFIED" | "FOLLOW_UP" | "CLOSED";
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR" | "SALES" | "ANALYST";
  region: string;
};

export const homeCopy = {
  eyebrow: {
    zh: "工业级油墨解决方案",
    en: "Industrial ink solutions",
  },
  title: {
    zh: "让包装、标签与商业印刷拥有更稳定的色彩与交付效率",
    en: "Drive packaging, labeling, and commercial print with stable color and faster delivery.",
  },
  description: {
    zh: "油墨公司专注水性、UV 与功能型油墨，为食品包装、日化标签、出版印刷和工业应用提供配方开发、颜色管理与全球交付支持。",
    en: "Ink Company develops water-based, UV, and specialty inks for packaging, labels, publishing, and industrial applications with formulation, color control, and global delivery support.",
  },
  primaryCta: {
    zh: "获取产品方案",
    en: "Get product guidance",
  },
  secondaryCta: {
    zh: "查看产品中心",
    en: "Explore products",
  },
};

export const siteStats = [
  {
    label: { zh: "服务国家/地区", en: "Markets served" },
    value: "28+",
  },
  {
    label: { zh: "年度交付批次", en: "Annual shipments" },
    value: "12,000+",
  },
  {
    label: { zh: "配方数据库", en: "Formula library" },
    value: "3,500+",
  },
  {
    label: { zh: "平均打样周期", en: "Average sampling lead time" },
    value: "72h",
  },
];

export const capabilities = [
  {
    title: { zh: "配方开发", en: "Formulation engineering" },
    description: {
      zh: "围绕附着力、耐摩擦、耐候与迁移要求做精细化配方设计。",
      en: "Fine-tuned ink formulation for adhesion, rub resistance, weatherability, and migration constraints.",
    },
  },
  {
    title: { zh: "颜色管理", en: "Color consistency" },
    description: {
      zh: "建立从潘通目标色到量产色差控制的标准流程，减少跨批次偏差。",
      en: "Standardized Pantone-to-production workflows reduce batch-to-batch color deviation.",
    },
  },
  {
    title: { zh: "应用验证", en: "Application validation" },
    description: {
      zh: "针对凹印、柔印、胶印和数码场景提供基材与设备联调支持。",
      en: "Validation across gravure, flexo, offset, and digital workflows with substrate and equipment guidance.",
    },
  },
  {
    title: { zh: "全球交付", en: "Global delivery" },
    description: {
      zh: "覆盖打样、小批试产与规模化出货，适配海外供应链节奏。",
      en: "Sampling, pilot runs, and scaled production to match international supply chain timelines.",
    },
  },
];

export const industries = [
  {
    title: { zh: "食品与饮料包装", en: "Food and beverage packaging" },
    description: {
      zh: "关注低气味、法规合规与高速生产线适配。",
      en: "Low-odor, regulation-aware systems tuned for high-speed packaging lines.",
    },
  },
  {
    title: { zh: "日化与个护标签", en: "Homecare and personal care labels" },
    description: {
      zh: "强化抗刮与高饱和色表现，兼顾品牌视觉一致性。",
      en: "High saturation, scratch resistance, and stronger shelf impact for branded labels.",
    },
  },
  {
    title: { zh: "出版与商业印刷", en: "Publishing and commercial print" },
    description: {
      zh: "兼顾套印稳定、干燥效率与长版印刷的一致性。",
      en: "Consistent registration, drying, and print stability for long-run production.",
    },
  },
  {
    title: { zh: "工业功能应用", en: "Industrial functional applications" },
    description: {
      zh: "可延展到防伪、导电、耐高温等特种油墨需求。",
      en: "Extendable to anti-counterfeit, conductive, and heat-resistant specialty ink programs.",
    },
  },
];

export const products: Product[] = [
  {
    slug: "water-based-flexo-ink",
    category: { zh: "水性油墨", en: "Water-based inks" },
    title: { zh: "柔印水性包装油墨", en: "Water-based flexo packaging ink" },
    summary: {
      zh: "适用于瓦楞、纸袋与外包装印刷，兼顾高速干燥与色彩稳定。",
      en: "A fast-drying water-based flexo system for corrugates, paper bags, and outer packaging.",
    },
    heroTag: { zh: "适配纸基包装", en: "Built for paper packaging" },
    seoTitle: {
      zh: "柔印水性包装油墨 | 油墨公司",
      en: "Water-based flexo packaging ink | Ink Company",
    },
    seoDescription: {
      zh: "用于瓦楞、纸袋与食品外包装的柔印水性油墨，兼顾干燥效率、色差控制与环保要求。",
      en: "Water-based flexo packaging inks for corrugates and paper packaging with drying efficiency, color control, and compliance support.",
    },
    applications: [
      { zh: "食品外箱", en: "Food outer cartons" },
      { zh: "电商运输箱", en: "E-commerce corrugates" },
      { zh: "品牌纸袋", en: "Retail paper bags" },
    ],
    features: [
      { zh: "低气味体系，适配纸基包装", en: "Low-odor system for paper-based packaging" },
      { zh: "高线速下保持稳定转移与开口性", en: "Stable transfer at high line speeds" },
      { zh: "支持定制专色与基础色库", en: "Custom spot colors and core shade library" },
    ],
    specifications: [
      {
        label: { zh: "推荐设备", en: "Recommended press" },
        value: { zh: "柔版印刷机", en: "Flexographic press" },
      },
      {
        label: { zh: "适配基材", en: "Substrates" },
        value: { zh: "牛卡纸、白卡纸、瓦楞纸", en: "Kraft, SBS, corrugated board" },
      },
      {
        label: { zh: "干燥方式", en: "Drying method" },
        value: { zh: "热风 / IR", en: "Hot air / IR" },
      },
    ],
    featured: true,
  },
  {
    slug: "uv-label-ink",
    category: { zh: "UV 油墨", en: "UV inks" },
    title: { zh: "高附着 UV 标签油墨", en: "High-adhesion UV label ink" },
    summary: {
      zh: "面向日化、酒类与耐磨标签场景，提供更高光泽和附着表现。",
      en: "High-gloss, high-adhesion UV label inks for personal care, beverage, and durable labels.",
    },
    heroTag: { zh: "高饱和与高附着", en: "High saturation and adhesion" },
    seoTitle: {
      zh: "高附着 UV 标签油墨 | 油墨公司",
      en: "High-adhesion UV label ink | Ink Company",
    },
    seoDescription: {
      zh: "适用于日化、酒类和耐磨标签的 UV 标签油墨，具备高附着、高光泽和耐刮擦能力。",
      en: "UV label inks for personal care and beverage packaging with stronger adhesion, gloss, and scratch resistance.",
    },
    applications: [
      { zh: "PET 标签", en: "PET labels" },
      { zh: "透明不干胶", en: "Clear pressure-sensitive labels" },
      { zh: "耐磨警示贴", en: "Durable warning labels" },
    ],
    features: [
      { zh: "适配多种塑料标签基材", en: "Compatible with multiple plastic label stocks" },
      { zh: "高光泽且色密度稳定", en: "Stable density with a higher gloss finish" },
      { zh: "后道烫金与覆膜兼容性更强", en: "Improved foil and lamination compatibility" },
    ],
    specifications: [
      {
        label: { zh: "推荐设备", en: "Recommended press" },
        value: { zh: "窄幅标签机", en: "Narrow-web label press" },
      },
      {
        label: { zh: "适配基材", en: "Substrates" },
        value: { zh: "PET、PP、合成纸", en: "PET, PP, synthetic paper" },
      },
      {
        label: { zh: "固化方式", en: "Curing" },
        value: { zh: "LED UV / 汞灯 UV", en: "LED UV / mercury UV" },
      },
    ],
    featured: true,
  },
  {
    slug: "offset-book-ink",
    category: { zh: "胶印油墨", en: "Offset inks" },
    title: { zh: "出版级胶印书刊油墨", en: "Offset ink for books and publishing" },
    summary: {
      zh: "兼顾网点还原、干燥效率与长版印刷稳定性的出版印刷方案。",
      en: "Offset ink for publishing workflows with clean dot reproduction and stable long-run performance.",
    },
    heroTag: { zh: "稳定套印与干燥", en: "Stable registration and drying" },
    seoTitle: {
      zh: "出版级胶印书刊油墨 | 油墨公司",
      en: "Offset book and publishing ink | Ink Company",
    },
    seoDescription: {
      zh: "面向书刊与商业印刷的胶印油墨，提升网点表现、套印稳定性和长版输出效率。",
      en: "Offset ink solutions for publishing and commercial print with stronger dot control and long-run stability.",
    },
    applications: [
      { zh: "书刊印刷", en: "Book printing" },
      { zh: "宣传册与样本", en: "Brochures and catalogs" },
      { zh: "商业画册", en: "Commercial lookbooks" },
    ],
    features: [
      { zh: "提升网点清晰度与层次", en: "Sharper dots and smoother tonal range" },
      { zh: "适合中长版高稳定输出", en: "Stable across medium and long print runs" },
      { zh: "支持标准四色与定制专色", en: "Available in process sets and custom colors" },
    ],
    specifications: [
      {
        label: { zh: "推荐设备", en: "Recommended press" },
        value: { zh: "单张/轮转胶印机", en: "Sheetfed / web offset press" },
      },
      {
        label: { zh: "适配纸张", en: "Paper stocks" },
        value: { zh: "双胶纸、铜版纸、轻型纸", en: "Woodfree, art paper, lightweight stocks" },
      },
      {
        label: { zh: "干燥方式", en: "Drying method" },
        value: { zh: "渗透氧化", en: "Penetration oxidation" },
      },
    ],
    featured: false,
  },
  {
    slug: "functional-security-ink",
    category: { zh: "功能型油墨", en: "Specialty inks" },
    title: { zh: "防伪与功能型特种油墨", en: "Security and specialty functional ink" },
    summary: {
      zh: "用于防伪、可变信息与工业功能表面的专项油墨开发方案。",
      en: "Specialty programs for anti-counterfeit printing, variable data, and functional surfaces.",
    },
    heroTag: { zh: "面向特种工业场景", en: "Designed for specialty use cases" },
    seoTitle: {
      zh: "防伪与功能型特种油墨 | 油墨公司",
      en: "Security and specialty functional ink | Ink Company",
    },
    seoDescription: {
      zh: "提供防伪、导电、耐高温等功能型油墨开发，适用于特殊工业与品牌保护应用。",
      en: "Security, conductive, and high-temperature specialty ink development for industrial and brand protection programs.",
    },
    applications: [
      { zh: "品牌防伪", en: "Brand protection" },
      { zh: "工业标识", en: "Industrial markings" },
      { zh: "功能涂层", en: "Functional coatings" },
    ],
    features: [
      { zh: "可按场景定制材料体系", en: "Material systems customized by application" },
      { zh: "结合验证工艺与耐久测试", en: "Validated with durability testing workflows" },
      { zh: "适合长期联合开发项目", en: "Designed for longer co-development programs" },
    ],
    specifications: [
      {
        label: { zh: "开发方式", en: "Engagement model" },
        value: { zh: "联合开发 / 打样验证", en: "Co-development / pilot validation" },
      },
      {
        label: { zh: "适配基材", en: "Compatible substrates" },
        value: { zh: "薄膜、纸张、金属、复合材料", en: "Film, paper, metal, composites" },
      },
      {
        label: { zh: "典型周期", en: "Typical lead time" },
        value: { zh: "2-6 周", en: "2-6 weeks" },
      },
    ],
    featured: true,
  },
];

export const articles: Article[] = [
  {
    slug: "how-to-stabilize-color-in-flexo-packaging",
    category: { zh: "技术文章", en: "Insights" },
    title: {
      zh: "柔印包装如何稳定控制色差与批次一致性",
      en: "How to stabilize color consistency in flexo packaging",
    },
    excerpt: {
      zh: "从目标色定义、版辊管理到车间温湿度控制，拆解柔印包装的色差控制关键点。",
      en: "A practical guide to color targets, anilox management, and shop-floor controls for flexo packaging.",
    },
    content: {
      zh: "在包装印刷中，色差不仅影响品牌一致性，也直接影响客户验收效率。稳定色彩的第一步是建立统一的目标色库和配色复核流程。第二步是控制版辊、网纹辊与墨量转移的一致性。第三步是管理生产环境与首件确认，让打样逻辑延续到量产逻辑。",
      en: "In packaging print, color deviation affects both brand consistency and customer approval cycles. The first step is a shared target-color library and a formal color review flow. The second step is consistency across plate, anilox, and ink transfer settings. The third step is disciplined environment control and first-article approval so the proofing logic carries into production.",
    },
    seoTitle: {
      zh: "柔印包装色差控制指南 | 油墨公司",
      en: "Flexo packaging color control guide | Ink Company",
    },
    seoDescription: {
      zh: "了解柔印包装中色差控制的关键流程，包括目标色、网纹辊、环境管理与首件确认。",
      en: "Learn the core flexo color-control workflow across target colors, anilox settings, environment control, and first-article approval.",
    },
    publishedAt: "2026-01-12",
    readTime: 5,
    featured: true,
  },
  {
    slug: "uv-label-ink-selection-checklist",
    category: { zh: "案例洞察", en: "Case study" },
    title: {
      zh: "UV 标签油墨选型清单：从附着到后加工兼容",
      en: "A UV label ink checklist from adhesion to finishing compatibility",
    },
    excerpt: {
      zh: "针对 PET、PP 与合成纸标签，梳理选型时最常见的工艺影响因素。",
      en: "A practical checklist for PET, PP, and synthetic label stocks covering adhesion and downstream finishing.",
    },
    content: {
      zh: "标签油墨选型不能只看色彩表现，还要结合基材表面张力、固化窗口、覆膜与烫金条件。对于品牌标签项目，建议在试样阶段同步验证附着、耐刮、耐酒精和后道兼容性，减少量产返工。",
      en: "Selecting a label ink is not only about color. Surface energy, curing window, lamination, and foil conditions all matter. For branded label programs, validate adhesion, scratch resistance, alcohol resistance, and finishing compatibility during the pilot stage to reduce rework later.",
    },
    seoTitle: {
      zh: "UV 标签油墨选型清单 | 油墨公司",
      en: "UV label ink selection checklist | Ink Company",
    },
    seoDescription: {
      zh: "面向 PET、PP 与合成纸标签的 UV 油墨选型指南，覆盖附着、固化与后加工兼容性。",
      en: "A UV label ink checklist covering adhesion, curing, and finishing compatibility for PET, PP, and synthetic labels.",
    },
    publishedAt: "2025-12-21",
    readTime: 4,
    featured: true,
  },
  {
    slug: "building-a-bilingual-packaging-spec-workflow",
    category: { zh: "新闻动态", en: "News" },
    title: {
      zh: "构建面向海外客户的双语包装油墨规格协同流程",
      en: "Building a bilingual specification workflow for international packaging programs",
    },
    excerpt: {
      zh: "当项目跨团队、跨时区推进时，双语规格体系能显著降低沟通成本和错误率。",
      en: "A bilingual specification workflow reduces mistakes when print programs move across teams and time zones.",
    },
    content: {
      zh: "对于海外市场项目，规格单、样品反馈、颜色目标与法规说明都应采用统一双语结构。这样不仅有利于内部协同，也能让客户在索样和试产阶段快速理解关键限制条件。",
      en: "For export programs, specs, sample feedback, color targets, and regulatory notes should follow a shared bilingual structure. This improves internal collaboration and helps customers understand the critical constraints early in sampling and pilot runs.",
    },
    seoTitle: {
      zh: "双语包装油墨规格协同流程 | 油墨公司",
      en: "Bilingual ink specification workflow | Ink Company",
    },
    seoDescription: {
      zh: "通过双语规格体系提升海外包装项目的沟通效率、样品反馈一致性与量产转化率。",
      en: "Use a bilingual specification workflow to improve communication, feedback accuracy, and pilot-to-production conversion.",
    },
    publishedAt: "2025-11-05",
    readTime: 3,
    featured: false,
  },
  {
    slug: "pantone-color-matching-for-brand-packaging",
    category: { zh: "技术文章", en: "Insights" },
    title: {
      zh: "品牌包装中的 Pantone 目标色建立与量产复现方法",
      en: "Pantone color matching and production reproduction for brand packaging",
    },
    excerpt: {
      zh: "建立标准化的 Pantone 配色流程，是实现跨批次品牌色彩一致性的基础。",
      en: "A standardized Pantone matching workflow is the foundation for consistent brand color across every production run.",
    },
    content: {
      zh: "品牌色彩管理的核心不在于调出一个好看的颜色，而在于让这个颜色在任何批次、任何设备上都能稳定复现。建立 Pantone 目标色库是第一步：将品牌色对应到具体 Pantone 编号，并在实机条件下完成首次对色与数据存档。第二步是建立量产对色流程，包括每批次的首件确认、色差容差范围（ΔE 标准）和返工触发条件。第三步是在供应链层面推广统一的对色标准，确保跨工厂、跨供应商的输出一致。",
      en: "Brand color management is not just about matching a beautiful color once — it's about reproducing that color consistently across every batch and every press. Building a Pantone target library is the first step: mapping brand colors to specific Pantone references and archiving the first on-press match data. The second step is a production color review workflow covering first-article approval, delta-E tolerances, and rework triggers. The third step is propagating unified color standards across the supply chain to ensure consistency across plants and suppliers.",
    },
    seoTitle: {
      zh: "品牌包装 Pantone 配色与量产复现 | 油墨公司",
      en: "Pantone color matching for brand packaging | Ink Company",
    },
    seoDescription: {
      zh: "了解如何为品牌包装建立 Pantone 目标色库、制定量产对色流程与跨厂一致性标准。",
      en: "Learn how to build a Pantone target library, set up a production color workflow, and ensure cross-plant consistency for brand packaging.",
    },
    publishedAt: "2026-02-18",
    readTime: 5,
    featured: true,
  },
  {
    slug: "water-based-ink-trends-2026",
    category: { zh: "行业动态", en: "Industry" },
    title: {
      zh: "2026 年水性油墨技术趋势：绿色合规与高性能并行",
      en: "Water-based ink trends 2026: green compliance meets high performance",
    },
    excerpt: {
      zh: "随着法规收紧和品牌可持续目标升级，水性油墨正在进入更广泛的印刷场景。",
      en: "As regulations tighten and brand sustainability targets rise, water-based inks are entering a wider range of print applications.",
    },
    content: {
      zh: "2026 年，水性油墨的市场渗透率持续提升，驱动力来自两个方向：一是欧盟和北美的包装法规趋严，限制溶剂型油墨在食品接触场景的使用；二是品牌商将可持续包装纳入采购评分体系，水性方案成为供应商资质的重要加分项。从技术层面看，新一代水性配方在高速生产线上的开口性、附着力和耐刮擦性已有显著提升，可覆盖更多此前由 UV 或溶剂型产品主导的应用场景。企业在切换水性体系时，需重点关注基材预处理工艺、烘干系统升级和首件色彩验证流程。",
      en: "In 2026, water-based ink market penetration continues to rise, driven by two forces: increasingly strict EU and North American packaging regulations limiting solvent-based inks in food-contact applications, and brand owners incorporating sustainable packaging into procurement scorecards. On the technical side, new-generation water-based formulations show significant improvements in open time, adhesion, and scratch resistance on high-speed lines, covering applications previously dominated by UV or solvent systems. Companies switching to water-based systems should focus on substrate pretreatment, dryer system upgrades, and first-article color validation workflows.",
    },
    seoTitle: {
      zh: "2026 水性油墨趋势与合规分析 | 油墨公司",
      en: "Water-based ink trends and compliance 2026 | Ink Company",
    },
    seoDescription: {
      zh: "分析 2026 年水性油墨在法规合规、品牌可持续与高性能场景的技术趋势与转型路径。",
      en: "Analysis of 2026 water-based ink trends across regulatory compliance, brand sustainability, and high-performance applications.",
    },
    publishedAt: "2026-02-05",
    readTime: 4,
    featured: false,
  },
  {
    slug: "72h-sampling-turnaround-case-study",
    category: { zh: "案例洞察", en: "Case Study" },
    title: {
      zh: "72 小时打样周期如何缩短 APAC 品牌的量产决策路径",
      en: "How 72h sampling compressed production decision cycles for an APAC brand",
    },
    excerpt: {
      zh: "一个快消品牌的包装项目，通过 72 小时实机验证，将采购决策周期从 3 周压缩到 5 天。",
      en: "A FMCG brand's packaging project compressed its procurement decision cycle from three weeks to five days through 72-hour on-press validation.",
    },
    content: {
      zh: "某 APAC 快消品牌在推进新品包装时，遇到了传统打样周期过长的问题：供应商平均需要 2—3 周才能完成从配方确认到实机出样的全流程，导致品牌方的新品上市节奏严重受阻。在引入我们的 72 小时打样服务后，项目流程被重新梳理：色彩目标在首次沟通后 24 小时内确认，配方初版在 36 小时内完成，实机验证样品在第 72 小时交付。首次对比测试显示 ΔE < 1.5，达到品牌验收标准。从项目启动到采购审批完成，全程仅用 5 个工作日，较行业均值缩短 70%。",
      en: "An APAC FMCG brand encountered lengthy sampling cycles when developing new packaging — suppliers typically needed two to three weeks from formulation confirmation to on-press output, severely delaying new product launch timelines. After introducing our 72-hour sampling service, the workflow was restructured: color targets confirmed within 24 hours of the first call, initial formulation completed within 36 hours, and on-press samples delivered at hour 72. First comparison testing showed ΔE < 1.5, meeting the brand's approval standard. From project kickoff to procurement sign-off took just five working days — 70% faster than the industry average.",
    },
    seoTitle: {
      zh: "72h 打样加速 APAC 品牌量产决策案例 | 油墨公司",
      en: "72h sampling case study for APAC brand decision acceleration | Ink Company",
    },
    seoDescription: {
      zh: "了解 72 小时打样服务如何帮助一个 APAC 快消品牌将采购决策周期从 3 周压缩至 5 天。",
      en: "See how 72-hour sampling helped an APAC FMCG brand compress procurement decision cycles from three weeks to five days.",
    },
    publishedAt: "2026-01-28",
    readTime: 4,
    featured: true,
  },
  {
    slug: "reach-compliance-documentation-guide",
    category: { zh: "法规合规", en: "Compliance" },
    title: {
      zh: "REACH 法规合规文件准备指南：面向欧洲市场印刷采购商",
      en: "REACH compliance documentation guide for European print procurement",
    },
    excerpt: {
      zh: "出口欧洲市场的印刷品采购商，需要提前准备哪些合规文件？本文给出清单与建议。",
      en: "What compliance documents should print procurement teams prepare before entering European markets? This guide provides a checklist and recommendations.",
    },
    content: {
      zh: "REACH 法规（化学品注册、评估、授权和限制）是欧洲最重要的化学品管理法规之一，直接影响印刷油墨的出口合规。采购商在选择油墨供应商时，需要核查以下关键文件：一是供应商的安全数据表（SDS），确认无 SVHC（高度关注物质）超标；二是产品的合规声明，注明适用的欧盟法规编号；三是针对食品接触或儿童产品的附加检测报告（如有）。建议在项目立项阶段就将合规文件纳入供应商评估标准，避免在量产阶段因文件缺失而延误出货。",
      en: "REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals) is one of Europe's most important chemical management regulations and directly affects ink export compliance. Procurement teams should verify the following key documents when selecting an ink supplier: a Safety Data Sheet (SDS) confirming no SVHC (Substance of Very High Concern) exceedances, a compliance declaration referencing the applicable EU regulation numbers, and supplementary test reports for food-contact or children's product applications where applicable. Include compliance documentation in supplier evaluation criteria at the project initiation stage to avoid shipment delays caused by missing documents at the production stage.",
    },
    seoTitle: {
      zh: "REACH 合规文件准备指南 | 油墨公司",
      en: "REACH compliance documentation guide for print | Ink Company",
    },
    seoDescription: {
      zh: "面向欧洲市场的印刷采购商 REACH 合规文件准备指南，涵盖 SDS、SVHC 与合规声明要求。",
      en: "A REACH compliance documentation guide for print procurement targeting European markets, covering SDS, SVHC, and compliance declarations.",
    },
    publishedAt: "2026-01-20",
    readTime: 5,
    featured: false,
  },
  {
    slug: "ink-adhesion-testing-flexible-packaging",
    category: { zh: "技术文章", en: "Insights" },
    title: {
      zh: "软包装油墨附着力测试标准与实机验证方法总结",
      en: "Adhesion testing standards and on-press validation for flexible packaging inks",
    },
    excerpt: {
      zh: "软包装油墨的附着力测试涉及多种标准和方法，本文梳理主流测试方法及其适用场景。",
      en: "Flexible packaging ink adhesion testing involves multiple standards and methods. This article outlines the main approaches and when to use each.",
    },
    content: {
      zh: "软包装油墨的附着力测试是质量管控的核心环节，直接决定了产品在下游覆膜、复合和使用过程中的表现。主流测试方法包括：胶带附着力测试（ASTM D3359），适合快速判断初始附着；耐酒精擦拭测试，用于评估耐溶剂性能；水煮测试，适用于高温蒸煮袋场景；耐刮擦测试，评估印刷面在运输和仓储中的耐久性。实机验证阶段，建议在正式量产前模拟完整的后道工艺（覆膜、复合、分切），以实际工况数据作为附着标准的最终判据。",
      en: "Adhesion testing for flexible packaging inks is a core quality control step that determines performance through downstream lamination, laminating, and end-use. Main test methods include: tape adhesion test (ASTM D3359) for quick initial adhesion assessment; alcohol rub test for solvent resistance; boiling water test for retort pouch applications; and scratch resistance testing for durability through transport and storage. During on-press validation, simulate the complete downstream process (lamination, composite, slitting) before committing to full production, and use real-process data as the final adhesion standard.",
    },
    seoTitle: {
      zh: "软包装油墨附着力测试方法 | 油墨公司",
      en: "Flexible packaging ink adhesion testing methods | Ink Company",
    },
    seoDescription: {
      zh: "梳理软包装油墨附着力测试的主流方法，包括胶带测试、耐酒精、水煮与耐刮擦标准及实机验证建议。",
      en: "An overview of flexible packaging ink adhesion testing methods including tape, alcohol rub, boiling water, and scratch resistance standards with on-press validation guidance.",
    },
    publishedAt: "2026-01-14",
    readTime: 4,
    featured: false,
  },
  {
    slug: "cross-plant-color-consistency",
    category: { zh: "案例洞察", en: "Case Study" },
    title: {
      zh: "跨工厂色彩一致性管理：从配方标准化到现场首件确认",
      en: "Cross-plant color consistency: from formula standardization to first-article sign-off",
    },
    excerpt: {
      zh: "当同一品牌在多个工厂同时生产时，如何保证每个工厂的色彩输出达到相同标准？",
      en: "When a brand runs production across multiple plants simultaneously, how do you ensure every facility hits the same color standard?",
    },
    content: {
      zh: "跨工厂色彩一致性是大型品牌包装项目的核心挑战之一。解决这一问题需要从三个层面入手：第一，配方标准化——为每种品牌色建立唯一的配方档案，包含配比、粘度、pH 范围等关键参数，并向所有工厂同步分发；第二，设备标准化——统一各工厂的网纹辊规格、印刷压力设定和干燥曲线，减少设备差异对色彩的影响；第三，首件确认流程——每个工厂在每次量产开始前，必须完成标准化的首件对色，并将数据提交至统一的色彩管理平台进行比对和归档。通过上述三层管控，某品牌客户在 5 个工厂的跨批次色差（ΔE）从平均 2.8 降至 1.1。",
      en: "Cross-plant color consistency is one of the central challenges for large-scale brand packaging programs. Addressing it requires work at three levels. First, formula standardization: build a unique formula file for each brand color, covering mix ratios, viscosity, pH range, and other critical parameters, and distribute it to all plants. Second, equipment standardization: align anilox roller specifications, impression pressure settings, and drying curves across plants to reduce equipment-driven color variation. Third, first-article approval: every plant must complete a standardized first-article color check before each production run, submitting data to a centralized color management platform for comparison and archiving. Through these three control layers, one brand client reduced average cross-batch color deviation (ΔE) from 2.8 to 1.1 across five plants.",
    },
    seoTitle: {
      zh: "跨工厂色彩一致性管理案例 | 油墨公司",
      en: "Cross-plant color consistency management case study | Ink Company",
    },
    seoDescription: {
      zh: "了解如何通过配方标准化、设备统一和首件确认流程，实现跨工厂品牌色彩一致性管控。",
      en: "Learn how formula standardization, equipment alignment, and first-article approval workflows deliver cross-plant brand color consistency.",
    },
    publishedAt: "2026-01-08",
    readTime: 5,
    featured: false,
  },
];

export const testimonials = [
  {
    quote: {
      zh: "从打样到量产的颜色一致性明显提升，客户验收周期缩短了。",
      en: "Color consistency from proof to production improved noticeably and shortened customer approval cycles.",
    },
    author: "Packaging Procurement Lead",
    company: "FMCG Brand APAC",
  },
  {
    quote: {
      zh: "他们不是只卖油墨，而是把设备、基材和后加工一起考虑。",
      en: "They do more than supply ink. They align the press, substrate, and finishing process as one system.",
    },
    author: "Plant Director",
    company: "Label Converter",
  },
];

export const cmsModules = [
  {
    name: "Hero Banner",
    owner: "Marketing",
    status: "Published",
    updatedAt: "2026-03-05",
  },
  {
    name: "Homepage Product Grid",
    owner: "Product Team",
    status: "Published",
    updatedAt: "2026-03-02",
  },
  {
    name: "Global SEO Defaults",
    owner: "Growth",
    status: "Draft",
    updatedAt: "2026-03-01",
  },
];

export const inquiries: InquiryRecord[] = [
  {
    id: "INQ-1024",
    name: "Sofia Reed",
    company: "Northline Packaging",
    email: "sofia@northlinepack.com",
    market: "Europe",
    status: "NEW",
    createdAt: "2026-03-07 10:30",
  },
  {
    id: "INQ-1023",
    name: "陈川",
    company: "华印包装",
    email: "chenchuan@huayin.com",
    market: "China",
    status: "FOLLOW_UP",
    createdAt: "2026-03-06 17:20",
  },
  {
    id: "INQ-1022",
    name: "Marcus Bell",
    company: "Bluefin Labels",
    email: "mbell@bluefinlabels.com",
    market: "North America",
    status: "QUALIFIED",
    createdAt: "2026-03-05 08:55",
  },
];

export const users: TeamMember[] = [
  {
    id: "USR-01",
    name: "Yolanda Li",
    email: "yolanda@ink-company.com",
    role: "SUPER_ADMIN",
    region: "Global",
  },
  {
    id: "USR-02",
    name: "Jason Wu",
    email: "jason@ink-company.com",
    role: "EDITOR",
    region: "China",
  },
  {
    id: "USR-03",
    name: "Amelia Park",
    email: "amelia@ink-company.com",
    role: "SALES",
    region: "APAC",
  },
  {
    id: "USR-04",
    name: "Daniel Ross",
    email: "daniel@ink-company.com",
    role: "ANALYST",
    region: "Europe",
  },
];

export const trafficSeries = [
  { month: "Oct", visits: 1200, leads: 18 },
  { month: "Nov", visits: 1680, leads: 24 },
  { month: "Dec", visits: 2140, leads: 29 },
  { month: "Jan", visits: 2380, leads: 36 },
  { month: "Feb", visits: 2860, leads: 43 },
  { month: "Mar", visits: 3220, leads: 51 },
];

export const adminMetrics = [
  {
    label: "Monthly sessions",
    value: "32.2K",
    delta: "+18.4%",
  },
  {
    label: "Qualified inquiries",
    value: "51",
    delta: "+12.0%",
  },
  {
    label: "Published product pages",
    value: "24",
    delta: "+4",
  },
  {
    label: "Indexed URLs",
    value: "86",
    delta: "+11",
  },
];

export const seoDefaults = {
  title: {
    zh: "油墨公司 | 工业级油墨、包装印刷与标签应用方案",
    en: "Ink Company | Industrial ink solutions for packaging, labels, and commercial print",
  },
  description: {
    zh: "油墨公司提供水性、UV 与功能型油墨方案，服务包装、标签、商业印刷与工业应用，并支持中英双语内容与全球客户沟通。",
    en: "Ink Company supplies water-based, UV, and specialty ink solutions for packaging, labels, commercial printing, and industrial applications with bilingual content for global markets.",
  },
};

export function t(value: LocalizedText, locale: Locale) {
  return value[locale];
}

export function getFeaturedProducts() {
  return products.filter((item) => item.featured);
}

export function getFeaturedArticles() {
  return articles.filter((item) => item.featured);
}

export function getProductBySlug(slug: string) {
  return products.find((item) => item.slug === slug);
}

export function getArticleBySlug(slug: string) {
  return articles.find((item) => item.slug === slug);
}
