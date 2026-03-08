export type AdminLocale = "zh" | "en";

export const adminDict = {
  zh: {
    // Layout / Header
    adminLabel: "后台管理",
    websiteOps: "网站运营",
    viewPublicSite: "查看前台",
    langToggle: "EN",

    // Sidebar
    consoleName: "管理控制台",
    consoleDesc: "双语内容与 SEO 运营中心",
    navDashboard: "数据总览",
    navCms: "内容管理",
    navProducts: "产品目录",
    navArticles: "文章管理",
    navInquiries: "询盘管理",
    navUsers: "用户与角色",

    // Sign-in
    signInTitle: "登录管理后台",
    signInDesc: "此入口保护仪表盘、CMS 模块、产品运营和 SEO 管理工具。",
    signInFeatureTitle: "为双语内容与 SEO 运营而生",
    signInFeatureDesc: "管理后台支持首页 CMS 模块、产品页面、文章发布、询盘管理和基于角色的团队权限，全部基于一套 Next.js 代码库。",
    signInFeatureItems: [
      "首页版块与全局 SEO 默认值",
      "产品目录、规格与双语文案",
      "文章工作流、线索收件箱与数据快照",
    ],
    accountLabel: "账号",
    passwordLabel: "密码",
    signingIn: "登录中…",
    signInBtn: "登录",
    signInError: "账号或密码错误，请重试。",
    signInHint: "默认管理员账号：admin，密码：admin123",

    // Dashboard
    dashboardTitle: "流量与询盘趋势",
    latestInquiries: "最新询盘",
    metricTotal: "询盘总数",
    metricQualified: "已确认线索",
    metricProducts: "已发布产品",
    metricArticles: "已发布文章",

    // Products
    productsTitle: "产品目录管理",
    colProduct: "产品",
    colCategory: "分类",
    colLocale: "语言覆盖",
    colSeo: "SEO 就绪",

    // Articles
    articlesTitle: "文章与案例研究",
    colArticle: "文章",
    colPublished: "发布日期",
    colStatus: "状态",
    statusPublished: "已发布",

    // Inquiries
    inquiriesTitle: "询盘收件箱",
    colContact: "联系人",
    colMarket: "市场 / 产品类型",
    colReceived: "接收时间",

    // Status labels
    statusNew: "新询盘",
    statusQualified: "已确认",
    statusFollowUp: "跟进中",
    statusClosed: "已关闭",

    // Users
    usersTitle: "用户与角色",
    colName: "姓名",
    colEmail: "邮箱",
    colRole: "角色",
    accessDenied: "权限不足，仅超级管理员可访问此页面。",

    // Homepage
    navHomepage: "首页内容",

    // CMS
    cmsModulesTitle: "内容模块",
    cmsSeoTitle: "首页 SEO 默认值",
    labelTitleZh: "页面标题（中文）",
    labelTitleEn: "页面标题（英文）",
    labelDescZh: "描述（中文）",
    labelDescEn: "描述（英文）",
    savingBtn: "保存中…",
    savedBtn: "已保存 ✓",
    saveBtn: "保存更改",
  },
  en: {
    // Layout / Header
    adminLabel: "Admin",
    websiteOps: "Website operations",
    viewPublicSite: "View public site",
    langToggle: "中文",

    // Sidebar
    consoleName: "Admin Console",
    consoleDesc: "SEO-aware content ops for the corporate website.",
    navDashboard: "Dashboard",
    navCms: "CMS",
    navProducts: "Products",
    navArticles: "Articles",
    navInquiries: "Inquiries",
    navUsers: "Users & roles",

    // Sign-in
    signInTitle: "Sign in to the admin console",
    signInDesc: "This entry point protects the dashboard, CMS modules, product operations, and SEO management tools.",
    signInFeatureTitle: "Built for bilingual content and SEO operations",
    signInFeatureDesc: "The admin structure is designed to support homepage CMS blocks, product pages, article publishing, inquiry management, and role-based team access from a single Next.js codebase.",
    signInFeatureItems: [
      "Homepage sections and global SEO defaults",
      "Product catalog, specs, and bilingual copy",
      "Article workflow, lead inbox, and analytics snapshots",
    ],
    accountLabel: "Account",
    passwordLabel: "Password",
    signingIn: "Signing in...",
    signInBtn: "Sign in",
    signInError: "Invalid credentials. Try the demo admin account.",
    signInHint: "Default admin account: admin / admin123",

    // Dashboard
    dashboardTitle: "Traffic and inquiries trend",
    latestInquiries: "Latest inquiries",
    metricTotal: "Total inquiries",
    metricQualified: "Qualified leads",
    metricProducts: "Products published",
    metricArticles: "Articles published",

    // Products
    productsTitle: "Product catalog management",
    colProduct: "Product",
    colCategory: "Category",
    colLocale: "Locale coverage",
    colSeo: "SEO ready",

    // Articles
    articlesTitle: "Articles and case studies",
    colArticle: "Article",
    colPublished: "Published",
    colStatus: "Status",
    statusPublished: "Published",

    // Inquiries
    inquiriesTitle: "Lead inbox",
    colContact: "Contact",
    colMarket: "Market / Product type",
    colReceived: "Received",

    // Status labels
    statusNew: "NEW",
    statusQualified: "QUALIFIED",
    statusFollowUp: "FOLLOW_UP",
    statusClosed: "CLOSED",

    // Users
    usersTitle: "Users and roles",
    colName: "Name",
    colEmail: "Email",
    colRole: "Role",
    accessDenied: "Access denied. Only SUPER_ADMIN can view this page.",

    // Homepage
    navHomepage: "Homepage",

    // CMS
    cmsModulesTitle: "CMS sections",
    cmsSeoTitle: "Homepage SEO defaults",
    labelTitleZh: "Title (ZH)",
    labelTitleEn: "Title (EN)",
    labelDescZh: "Description (ZH)",
    labelDescEn: "Description (EN)",
    savingBtn: "Saving…",
    savedBtn: "Saved ✓",
    saveBtn: "Save changes",
  },
} as const;

export type AdminDict = {
  [K in keyof typeof adminDict.en]: (typeof adminDict.en)[K] extends readonly string[]
    ? readonly string[]
    : string;
};

export function getAdminT(locale: AdminLocale): AdminDict {
  return adminDict[locale] as unknown as AdminDict;
}
