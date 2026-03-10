export const productsPageDefaults = {
  hero: {
    titleZh: "探索产品系列。",
    titleEn: "Explore Our Ink Range.",
    subtitleZh: "水性、UV 与功能型油墨，为每种印刷场景精准配方。",
    subtitleEn: "Water-based, UV, and specialty inks — precisely formulated for every print application.",
    ctaZh: "获取打样",
    ctaEn: "Request a sample",
    bgImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
  },
  categories: [
    {
      labelZh: "包装印刷", labelEn: "Packaging",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop",
      href: "/products/all",
    },
    {
      labelZh: "标签印刷", labelEn: "Labels",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
      href: "/products/all",
    },
    {
      labelZh: "出版印刷", labelEn: "Publishing",
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop",
      href: "/products/all",
    },
    {
      labelZh: "工业应用", labelEn: "Industrial",
      img: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=400&auto=format&fit=crop",
      href: "/products/all",
    },
    {
      labelZh: "特种功能", labelEn: "Specialty",
      img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
      href: "/products/all",
    },
  ],
  productLines: [
    {
      titleZh: "水性油墨", titleEn: "Water-based Inks",
      subZh: "纸基包装 · 瓦楞 · 食品外箱", subEn: "Paper packaging · Corrugated · Cartons",
      ctaZh: "查看产品", ctaEn: "Shop now",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop",
      slug: "water-based-flexo-ink",
    },
    {
      titleZh: "UV 油墨", titleEn: "UV Inks",
      subZh: "标签 · 日化 · 高光泽表面", subEn: "Labels · Personal care · High gloss",
      ctaZh: "查看产品", ctaEn: "Shop now",
      img: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=900&auto=format&fit=crop",
      slug: "uv-label-ink",
    },
    {
      titleZh: "特种油墨", titleEn: "Specialty Inks",
      subZh: "防伪 · 功能型 · 工业标识", subEn: "Security · Functional · Industrial",
      ctaZh: "查看产品", ctaEn: "Shop now",
      img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=900&auto=format&fit=crop",
      slug: "functional-security-ink",
    },
  ],
  banner: {
    eyebrowZh: "精准配方承诺", eyebrowEn: "Formulation promise",
    headlineZh: "为每种基材精准配方。", headlineEn: "Formulated precisely for every substrate.",
    ctaZh: "咨询配方方案", ctaEn: "Discuss your application",
    bgImage: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=2000&auto=format&fit=crop",
  },
  testimonial: {
    quoteZh: "从打样到量产，色彩一致性有了显著改善。客户验收周期缩短了近一半——这在以前是很难想象的。",
    quoteEn: "Color consistency from proof to production improved dramatically. Our approval cycle shortened by almost half — something we hadn't thought possible before.",
    authorZh: "陈 总监", authorEn: "Director Chen",
    roleZh: "包装采购总监 · 某快消品牌 APAC",
    roleEn: "Packaging Procurement Director · FMCG Brand APAC",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop",
  },
  editorialPanels: [
    {
      labelZh: "配方定制开发", labelEn: "Custom Formulation",
      ctaZh: "了解更多", ctaEn: "Learn more",
      href: "/contact",
      img: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=900&auto=format&fit=crop",
    },
    {
      labelZh: "全球交付与合规", labelEn: "Global Delivery",
      ctaZh: "了解更多", ctaEn: "Learn more",
      href: "/contact",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop",
    },
  ],
  promises: [
    {
      icon: "Clock",
      titleZh: "72h 打样交付", titleEn: "72h Sampling",
      descZh: "从色彩目标确认到实机验证，72 小时内交付。",
      descEn: "From color target to on-press proof within 72 hours.",
    },
    {
      icon: "FlaskConical",
      titleZh: "配方定制研发", titleEn: "Custom Formulation",
      descZh: "针对基材与设备精细调配，逐批次稳定复现。",
      descEn: "Fine-tuned for your substrate and press, batch after batch.",
    },
    {
      icon: "ShieldCheck",
      titleZh: "法规合规文件", titleEn: "Regulatory Docs",
      descZh: "REACH、RoHS 与食品接触级合规，完整文件支持。",
      descEn: "REACH, RoHS, and food-contact compliance with full documentation.",
    },
    {
      icon: "Globe",
      titleZh: "全球 28+ 市场", titleEn: "28+ Markets",
      descZh: "适配国际供应链节奏，覆盖亚太、欧洲与美洲。",
      descEn: "Aligned to international supply chain timelines across APAC, Europe, and the Americas.",
    },
  ],
};

export type ProductsPageData = typeof productsPageDefaults;
