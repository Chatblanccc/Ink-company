export type BiLang = { zh: string; en: string };

export type HomepageData = {
  hero: {
    title: BiLang;
  };
  device: {
    label: BiLang;
    value: string;
    metric: BiLang;
    filter: BiLang;
  };
  benefits: {
    eyebrow: BiLang;
    heading: BiLang;
    sub: BiLang;
    cards: Array<{ title: BiLang; text: BiLang }>;
  };
  bigPicture: {
    heading: BiLang;
    sub: BiLang;
    cta: BiLang;
    steps: Array<{ num: string; title: BiLang }>;
  };
  specs: {
    eyebrow: BiLang;
    heading: BiLang;
    sub: BiLang;
    cta: BiLang;
  };
  testimonial: {
    quote: BiLang;
    author: BiLang;
    role: BiLang;
  };
  howTo: {
    heading: BiLang;
    cta: BiLang;
    steps: Array<{ num: string; title: BiLang; text: BiLang }>;
  };
  cta: {
    heading: BiLang;
    sub: BiLang;
    btn: BiLang;
  };
  images: {
    hero: string;
    benefits: string;
    bigPicture: string;
    testimonial: string;
    fullwidth: string;
  };
};

export const homepageDefaults: HomepageData = {
  hero: {
    title: { zh: "色彩稳定，批批如一。", en: "Stable color. Every run." },
  },
  device: {
    label: { zh: "色彩管控 • 概览", en: "Color Control • Overview" },
    value: "99.2%",
    metric: { zh: "批次色差合格率", en: "Batch Pass Rate" },
    filter: { zh: "全部产品线 (8)", en: "All Products (8)" },
  },
  benefits: {
    eyebrow: { zh: "核心优势", en: "Core Advantages" },
    heading: { zh: "让每一次印刷都符合预期。", en: "Color that delivers on its promise." },
    sub: {
      zh: "从配方研发到规模化出货，稳定的色彩表现是我们对每位客户的基本承诺。",
      en: "From formula development to full-scale delivery, consistent color performance is our commitment to every customer.",
    },
    cards: [
      {
        title: { zh: "稳定色彩", en: "Consistent Color" },
        text: {
          zh: "从 Pantone 目标色到量产批次，建立标准化色彩管控流程，减少跨批次色差偏移。",
          en: "Standardized Pantone-to-production workflows minimize batch-to-batch color deviation across every run.",
        },
      },
      {
        title: { zh: "72h 快速打样", en: "72h Sampling" },
        text: {
          zh: "从色彩目标确认到实机验证，72 小时内完成打样交付，加速您的量产决策周期。",
          en: "From color target to on-press proof, sampling is completed within 72 hours to accelerate your production decision.",
        },
      },
      {
        title: { zh: "法规合规", en: "Regulatory Ready" },
        text: {
          zh: "提供食品接触级、REACH 与 RoHS 合规配方，并出具完整的合规文件，满足全球市场要求。",
          en: "Food-contact, REACH, and RoHS-compliant formulations with full regulatory documentation for global market access.",
        },
      },
      {
        title: { zh: "全球交付", en: "Global Delivery" },
        text: {
          zh: "覆盖打样、小批试产与规模化出货，适配海外供应链节奏，服务 28 个以上国家与地区。",
          en: "Sampling, pilot runs, and scaled production shipping aligned to international supply chain timelines across 28+ markets.",
        },
      },
    ],
  },
  bigPicture: {
    heading: { zh: "从配方到量产。", en: "From formula to full run." },
    sub: {
      zh: "我们的工程师与您的生产团队协作，确保打样阶段的色彩表现延续到每一个量产批次。",
      en: "Our engineers work alongside your production team so proof-stage color performance carries into every production batch.",
    },
    cta: { zh: "了解配方服务", en: "Explore formulation" },
    steps: [
      { num: "01", title: { zh: "目标色确认：基于 Pantone 或客户色标建立统一色彩基准。", en: "Color targeting: Establish a shared benchmark from Pantone or your existing color standard." } },
      { num: "02", title: { zh: "配方开发：针对基材、设备与后道工艺进行精细化调配。", en: "Formulation: Fine-tuned for your substrate, press type, and downstream finishing process." } },
      { num: "03", title: { zh: "72h 实机验证：快速完成打样，降低量产前的不确定性。", en: "72h on-press proof: Rapid sampling reduces uncertainty before committing to full production." } },
      { num: "04", title: { zh: "量产色差管控：以打样逻辑驱动量产，保障每批次稳定输出。", en: "Production color control: Proof logic drives production with ongoing deviation monitoring every batch." } },
    ],
  },
  specs: {
    eyebrow: { zh: "产品体系", en: "Product Range" },
    heading: { zh: "为每种场景提供正确的油墨。", en: "The right ink for every application." },
    sub: {
      zh: "水性、UV 与功能型油墨，覆盖包装、标签、出版与工业场景，完整方案，一家提供。",
      en: "Water-based, UV, and specialty inks for packaging, labels, publishing, and industrial applications — all from one partner.",
    },
    cta: { zh: "查看产品中心", en: "View products" },
  },
  testimonial: {
    quote: {
      zh: "从打样到量产，色彩一致性有了显著改善。客户验收周期缩短了近一半——这在以前是很难想象的。",
      en: "Color consistency from proof to production improved dramatically. Our approval cycle shortened by almost half — something we hadn't thought possible before.",
    },
    author: { zh: "陈 总监", en: "Director Chen" },
    role: { zh: "包装采购总监 · 某快消品牌 APAC", en: "Packaging Procurement Director · FMCG Brand APAC" },
  },
  howTo: {
    heading: { zh: "从这里开始合作。", en: "Start your ink program here." },
    cta: { zh: "立即联系", en: "Contact us" },
    steps: [
      {
        num: "01",
        title: { zh: "提交需求", en: "Share your brief" },
        text: { zh: "告诉我们您的基材类型、印刷设备与色彩目标，我们的工程师将在 48 小时内回复。", en: "Tell us your substrate, press type, and color targets. Our engineers will respond within 48 hours." },
      },
      {
        num: "02",
        title: { zh: "获取打样", en: "Receive your sample" },
        text: { zh: "72 小时内完成实机验证，提供色差数据报告，确认配方方向后进入下一阶段。", en: "On-press proof within 72 hours with a full color deviation report before committing to the next stage." },
      },
      {
        num: "03",
        title: { zh: "推进量产", en: "Scale to production" },
        text: { zh: "以打样配方逻辑驱动规模化出货，持续色差管控保障每一批次稳定一致。", en: "Proof-stage formula logic drives scaled delivery with ongoing color control across every production batch." },
      },
    ],
  },
  cta: {
    heading: { zh: "准备好开始了吗？", en: "Ready to get started?" },
    sub: {
      zh: "告诉我们您的印刷场景，工程师将在 48 小时内提供初步配方方向与报价建议。",
      en: "Tell us about your print application and our engineers will respond within 48 hours with an initial formulation recommendation.",
    },
    btn: { zh: "获取产品方案", en: "Get product guidance" },
  },
  images: {
    hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
    benefits: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
    bigPicture: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
    testimonial: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
    fullwidth: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=2000&auto=format&fit=crop",
  },
};
