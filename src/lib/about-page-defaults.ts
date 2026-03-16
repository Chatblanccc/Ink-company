export type AboutStat = {
  value: string;
  labelZh: string;
  labelEn: string;
};

export type AboutTeamMember = {
  src: string;
  nameZh: string;
  nameEn: string;
  roleZh: string;
  roleEn: string;
};

export type AboutValue = {
  icon: string;
  titleZh: string;
  titleEn: string;
  textZh: string;
  textEn: string;
};

export type AboutHero = {
  headingZh: string;
  headingEn: string;
  body1Zh: string;
  body1En: string;
  body2Zh: string;
  body2En: string;
};

export type AboutCta = {
  headingZh: string;
  headingEn: string;
  bodyZh: string;
  bodyEn: string;
};

export type AboutHeroCard = {
  src: string;
  nameZh: string;
  nameEn: string;
  roleZh: string;
  roleEn: string;
};

export type AboutPageData = {
  hero: AboutHero;
  heroCards: AboutHeroCard[];
  stats: AboutStat[];
  team: AboutTeamMember[];
  values: AboutValue[];
  cta: AboutCta;
};

export const aboutPageDefaults: AboutPageData = {
  heroCards: [
    {
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=700&auto=format&fit=crop",
      nameZh: "陈工程师", nameEn: "Dr. Chen Wei",
      roleZh: "色彩科学总监", roleEn: "Head of Color Science",
    },
    {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=700&auto=format&fit=crop",
      nameZh: "Maria Chen", nameEn: "Maria Chen",
      roleZh: "国际客户总监", roleEn: "Client Relations Director",
    },
  ],
  hero: {
    headingZh: "我们的愿景是让每次印刷都稳定可信。",
    headingEn: "Our vision is reliable color, every single run.",
    body1Zh: "从配方研发到批量出货，我们以稳定的色彩表现、严格的质量管控和流畅的双语协同，服务来自全球 28 个以上市场的包装与工业印刷客户。",
    body1En: "From formula development to full-scale delivery, we serve packaging and industrial print customers across 28+ markets with consistent color, rigorous quality control, and bilingual collaboration.",
    body2Zh: "我们的工程师与您的生产团队紧密合作，确保从 Pantone 目标色到每一个量产批次的精准一致。",
    body2En: "Our engineers work alongside your production team to ensure precise consistency from Pantone target to every production batch.",
  },
  stats: [
    { value: "28+",    labelZh: "服务市场",  labelEn: "Markets served" },
    { value: "3,500+", labelZh: "配方库",    labelEn: "Formulas" },
    { value: "72h",    labelZh: "打样交付",  labelEn: "Sampling turnaround" },
  ],
  team: [
    {
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
      nameZh: "张伟博士", nameEn: "Dr. Wei Zhang",
      roleZh: "色彩科学总监", roleEn: "Head of Color Science",
    },
    {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      nameZh: "Maria Chen", nameEn: "Maria Chen",
      roleZh: "国际客户总监", roleEn: "International Accounts",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      nameZh: "王磊", nameEn: "Lei Wang",
      roleZh: "质量管控总监", roleEn: "Quality Director",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
      nameZh: "Sarah K.", nameEn: "Sarah K.",
      roleZh: "区域销售经理", roleEn: "Regional Sales Manager",
    },
    {
      src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop",
      nameZh: "陈阳", nameEn: "Yang Chen",
      roleZh: "配方研发工程师", roleEn: "Formula Engineer",
    },
    {
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      nameZh: "刘芳", nameEn: "Fang Liu",
      roleZh: "色彩开发专员", roleEn: "Color Development Spec.",
    },
    {
      src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      nameZh: "James Liu", nameEn: "James Liu",
      roleZh: "技术支持工程师", roleEn: "Technical Support",
    },
    {
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      nameZh: "林美丽", nameEn: "Mei Lin",
      roleZh: "合规文件专员", roleEn: "Regulatory Specialist",
    },
    {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
      nameZh: "赵博", nameEn: "Bo Zhao",
      roleZh: "生产总监", roleEn: "Production Director",
    },
  ],
  values: [
    {
      icon: "Target",
      titleZh: "配方精准", titleEn: "Formulation precision",
      textZh: "每一个配方都经过严格的实机验证，确保从目标色到量产的精准复现。",
      textEn: "Every formulation is rigorously validated on-press to ensure precise reproduction from target to production.",
    },
    {
      icon: "Zap",
      titleZh: "快速响应", titleEn: "Speed of response",
      textZh: "72 小时完成实机打样，48 小时内给出工程反馈，加速您的决策周期。",
      textEn: "72-hour on-press sampling and 48-hour engineering feedback to accelerate your decision cycle.",
    },
    {
      icon: "ShieldCheck",
      titleZh: "合规为本", titleEn: "Compliance first",
      textZh: "食品接触、REACH 和 RoHS 合规，完整文件体系，满足全球市场监管要求。",
      textEn: "Food-contact, REACH, and RoHS compliance with full documentation for global market access.",
    },
    {
      icon: "Globe",
      titleZh: "全球视野", titleEn: "Global mindset",
      textZh: "服务 28 个以上市场，中英双语支持，适配不同地区的供应链节奏与法规要求。",
      textEn: "Serving 28+ markets with bilingual support, adapted to regional supply chains and regulations.",
    },
    {
      icon: "Users",
      titleZh: "深度协同", titleEn: "Deep collaboration",
      textZh: "与客户生产团队紧密配合，从打样到量产全程支持，确保每批次稳定可控。",
      textEn: "Partnering with your production team from sampling to scale to ensure every batch stays on spec.",
    },
    {
      icon: "Sparkles",
      titleZh: "持续创新", titleEn: "Continuous innovation",
      textZh: "持续投入功能型油墨和工艺创新研究，为客户的未来产品需求储备技术方案。",
      textEn: "Ongoing investment in specialty ink innovation to build solutions for your future product needs.",
    },
  ],
  cta: {
    headingZh: "加入我们的团队",
    headingEn: "Join our team",
    bodyZh: "我们正在寻找对色彩科学、化工工程和国际业务充满热情的人才，共同服务全球客户。",
    bodyEn: "We're looking for people passionate about color science, chemical engineering, and international business to serve customers worldwide.",
  },
};
