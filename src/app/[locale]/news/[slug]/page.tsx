import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, ArrowUpRight } from "lucide-react";

import { FadeIn, FadeInGroup } from "@/components/fade-in";
import { getLocaleFromString, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { articles } from "@/lib/demo-data";

/* ─── Hero images per slug ─────────────────────────────────────────── */
const HERO_IMAGES: Record<string, string> = {
  "how-to-stabilize-color-in-flexo-packaging":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
  "uv-label-ink-selection-checklist":
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
  "building-a-bilingual-packaging-spec-workflow":
    "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=1600&auto=format&fit=crop",
  "pantone-color-matching-for-brand-packaging":
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=1600&auto=format&fit=crop",
  "water-based-ink-trends-2026":
    "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1600&auto=format&fit=crop",
  "72h-sampling-turnaround-case-study":
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600&auto=format&fit=crop",
  "reach-compliance-documentation-guide":
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
  "ink-adhesion-testing-flexible-packaging":
    "https://images.unsplash.com/photo-1553877522-43269d4ea9849?q=80&w=1600&auto=format&fit=crop",
  "cross-plant-color-consistency":
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
};

/* ─── Extended article body ─────────────────────────────────────────── */
type ArticleBody = {
  section1Title: { zh: string; en: string };
  section1: { zh: string; en: string };
  col1Title: { zh: string; en: string };
  col1: { zh: string; en: string };
  col2Title: { zh: string; en: string };
  col2: { zh: string; en: string };
  section2Title: { zh: string; en: string };
  section2: { zh: string; en: string };
};

const ARTICLE_BODIES: Record<string, ArticleBody> = {
  "how-to-stabilize-color-in-flexo-packaging": {
    section1Title: { zh: "建立目标色库", en: "Building a Target Color Library" },
    section1: {
      zh: "目标色库的建立是所有色彩一致性工作的起点。每一种品牌色都需要对应到可测量的标准——通常是 Pantone 编号或分光光度计数据——并记录在一个所有相关部门都能访问的共享平台上。当调色工程师、质检员和客户服务团队都使用同一份标准时，沟通成本和误差率会大幅降低。",
      en: "A target color library is the starting point for all color consistency work. Every brand color needs to map to a measurable standard — typically a Pantone reference or spectrophotometer data — recorded in a shared platform accessible to all relevant departments. When formulators, QC staff, and customer service teams all work from the same standard, communication costs and error rates drop significantly.",
    },
    col1Title: { zh: "网纹辊与墨量管理", en: "Anilox & Ink Transfer Management" },
    col1: {
      zh: "网纹辊的线数和容量直接决定了墨量转移的一致性。在量产中，网纹辊的磨损、堵孔和清洁状态都会影响最终色彩输出。建议建立定期检测制度，并在生产记录中标注每次使用的网纹辊参数，以便在色差出现时快速溯源。",
      en: "Anilox line count and cell volume directly determine ink transfer consistency. In production, anilox wear, clogging, and cleaning condition all affect final color output. Establish a regular inspection schedule and log anilox parameters in production records so color deviations can be traced quickly when they appear.",
    },
    col2Title: { zh: "车间环境与首件确认", en: "Environment Control & First Article" },
    col2: {
      zh: "温度和湿度的变化会影响油墨粘度和干燥速率，进而影响色彩表现。高精度色彩管控项目建议在生产记录中同步记录环境参数。每批次量产前的首件确认是防止大规模色差的最后一道防线，务必在设定条件下完成并留存样品。",
      en: "Temperature and humidity fluctuations affect ink viscosity and drying rate, which in turn affect color performance. High-precision color programs should log environment parameters alongside production data. First-article approval before each production run is the last line of defense against large-scale color deviation — always complete it under set conditions and retain the approved sample.",
    },
    section2Title: { zh: "让打样逻辑延续到量产", en: "Carrying the Proof Logic into Production" },
    section2: {
      zh: "打样与量产的一致性不是自然发生的，需要主动设计。从配方记录、工艺参数到设备状态，每一个在打样中被控制的变量，都应该在量产中有对应的复核机制。当打样和量产之间的工艺差距被系统性地缩小，色彩输出的可预测性才能真正提升，客户验收效率也会随之改善。",
      en: "Consistency between proofing and production does not happen by itself — it must be actively designed. Every variable controlled during proofing, from formula records and process parameters to equipment condition, should have a corresponding verification mechanism in production. When the process gap between proofing and production is systematically narrowed, color output predictability genuinely improves and customer approval efficiency follows.",
    },
  },
  "uv-label-ink-selection-checklist": {
    section1Title: { zh: "基材与表面张力", en: "Substrate & Surface Energy" },
    section1: {
      zh: "UV 标签油墨的附着性能首先取决于基材的表面张力。PET、PP 和合成纸的表面能差异显著，直接影响油墨润湿和附着。在选型阶段，应获取基材的达因值（dyne level）数据，并与油墨供应商确认配方是否与该表面能范围匹配。必要时，可通过电晕处理提升基材表面能，但需注意处理后的衰减时间窗口。",
      en: "UV label ink adhesion starts with substrate surface energy. PET, PP, and synthetic paper have significantly different surface energy levels that directly affect ink wetting and adhesion. During selection, obtain dyne level data for the substrate and confirm with the ink supplier that the formulation is compatible with that surface energy range. Corona treatment can boost surface energy when needed, but note the decay time window after treatment.",
    },
    col1Title: { zh: "固化窗口与灯功率", en: "Curing Window & Lamp Power" },
    col1: {
      zh: "UV 油墨的固化完整性对附着力和后道加工兼容性至关重要。固化不足会导致表面残留活性单体，影响覆膜附着；固化过度则可能导致脆化和表面氧化。在选型时，应明确生产线的灯功率、车速和油墨配方的固化窗口范围，三者的匹配是稳定质量的前提。",
      en: "UV ink cure completeness is critical for adhesion and finishing compatibility. Undercuring leaves active monomers at the surface, compromising lamination adhesion; overcuring can cause embrittlement and surface oxidation. During selection, clarify the line's lamp power, press speed, and the ink formulation's curing window — the match between all three is the prerequisite for stable quality.",
    },
    col2Title: { zh: "覆膜与烫金兼容性", en: "Lamination & Foil Compatibility" },
    col2: {
      zh: "标签后道工艺中，覆膜和烫金是最常见的两道工序，也是 UV 油墨兼容性测试的重点场景。对于覆膜兼容性，需要测试不同覆膜类型（哑膜、亮膜、软触膜）下的附着强度；对于烫金，需要确认油墨层的表面平整度和温度耐受性。建议在正式量产前，委托供应商完成全套后道模拟测试并出具报告。",
      en: "Lamination and foil stamping are the most common downstream processes for labels and the key scenarios for UV ink compatibility testing. For lamination compatibility, test adhesion strength across different film types (matte, gloss, soft-touch). For foil stamping, verify the ink layer's surface flatness and temperature tolerance. Before committing to full production, ask the supplier to complete a full downstream simulation test and provide a report.",
    },
    section2Title: { zh: "试样阶段的完整验证清单", en: "A Complete Validation Checklist for the Pilot Stage" },
    section2: {
      zh: "标签项目的试样阶段应覆盖以下验证项：初始附着力（胶带测试）、耐酒精擦拭、耐刮擦、耐高温（如有）、覆膜附着、烫金兼容、长期储存色彩稳定性（加速老化）。只有将这些测试整合进标准的试样流程，才能在量产前发现并解决潜在的工艺问题，避免大规模返工带来的损失。",
      en: "The pilot stage for a label program should cover the following validation items: initial adhesion (tape test), alcohol rub, scratch resistance, high temperature resistance (if applicable), lamination adhesion, foil compatibility, and long-term color stability (accelerated aging). Only by integrating all these tests into the standard pilot workflow can you identify and resolve potential process issues before full production, avoiding the cost of large-scale rework.",
    },
  },
  "building-a-bilingual-packaging-spec-workflow": {
    section1Title: { zh: "规格文件的双语结构设计", en: "Designing a Bilingual Specification Structure" },
    section1: {
      zh: "双语规格文件的核心不是简单翻译，而是确保两个语言版本的信息结构完全对应，消除歧义。建议采用固定的模板格式，将关键参数（色彩目标、基材、工艺条件、容差范围）以表格形式呈现，中英文并排，确保任何一方的工程师都能快速定位所需信息，而无需依赖对方的语言版本。",
      en: "A bilingual specification document is not simply a translation — it ensures the information structure of both language versions corresponds exactly, eliminating ambiguity. Use a fixed template format that presents key parameters (color targets, substrate, process conditions, tolerance ranges) in a table with Chinese and English side by side, so engineers on either side can locate the information they need without relying on the other language version.",
    },
    col1Title: { zh: "样品反馈的标准化表单", en: "Standardized Sample Feedback Forms" },
    col1: {
      zh: "跨语言的样品反馈是海外项目沟通中最容易出现信息丢失的环节。建议设计标准化的双语反馈表单，涵盖色彩对比结果、工艺问题描述、修改建议和下一步行动项，并明确每一项的中英文对应措辞，减少因翻译差异导致的误解。",
      en: "Cross-language sample feedback is the communication step most prone to information loss in international programs. Design standardized bilingual feedback forms covering color comparison results, process issue descriptions, revision recommendations, and next action items, with agreed Chinese-English wording for each field to reduce misunderstandings from translation differences.",
    },
    col2Title: { zh: "颜色目标的跨语言统一表达", en: "Cross-Language Color Target Expression" },
    col2: {
      zh: "颜色目标的表达方式（Pantone 编号、分光数据、色差容差）本身就是一种通用语言，应优先使用数值化的标准替代描述性语言。当必须使用描述性表达时（如『偏暖』『偏红』），应在项目启动时建立双语词汇对照表，确保团队双方对描述词汇有一致的理解。",
      en: "Color target expression (Pantone reference, spectral data, delta-E tolerance) is itself a universal language — prioritize numeric standards over descriptive language. When descriptive terms are necessary (such as 'warmer tone' or 'more red'), establish a bilingual vocabulary reference at project kickoff so both teams share a consistent understanding of descriptive terms.",
    },
    section2Title: { zh: "从试样到量产的双语协同", en: "Bilingual Collaboration from Sampling to Production" },
    section2: {
      zh: "双语规格体系的价值在于贯穿项目全周期。在试样阶段，它帮助海外客户快速理解样品限制条件和修改建议；在量产阶段，它确保生产工人和质检人员在操作标准上与客户方的期望完全一致。对于跨时区推进的项目，完整的双语文档还能减少因沟通延迟带来的决策停滞，让每一方都能在各自的工作时间内独立推进工作。",
      en: "The value of a bilingual specification system lies in spanning the entire project lifecycle. In the sampling phase, it helps international customers quickly understand sample constraints and revision recommendations. In production, it ensures operators and QC staff share the same operating standards as the customer's expectations. For projects moving across time zones, complete bilingual documentation also reduces decision paralysis caused by communication delays, allowing each party to advance work independently during their own business hours.",
    },
  },
  "pantone-color-matching-for-brand-packaging": {
    section1Title: { zh: "建立 Pantone 目标色档案库", en: "Building a Pantone Target Color Archive" },
    section1: {
      zh: "Pantone 目标色档案的建立不仅是一次性的配色工作，而是构建品牌色彩记忆的长期投资。每种品牌色在完成首次对色后，应将实测分光数据、使用配比、网纹辊参数和验收标准一并归档，并与 Pantone 编号绑定。当未来遇到批次切换、供应商变更或工厂迁移时，可以直接调取档案，快速复原而无需重新配色。",
      en: "Building a Pantone target color archive is not a one-time task but a long-term investment in brand color memory. After the first on-press match for each brand color, archive the measured spectral data, formula ratios, anilox parameters, and acceptance standards alongside the Pantone reference. When batch changes, supplier switches, or plant relocations arise in the future, you can pull the archive directly and restore the color quickly without reformulating.",
    },
    col1Title: { zh: "ΔE 容差的设定原则", en: "Setting Delta-E Tolerance Principles" },
    col1: {
      zh: "不同的印刷场景对色差容差的要求差异显著。品牌色的视觉一致性通常要求 ΔE < 2.0（CIEDE2000），关键品牌色（如 Tiffany 蓝、Coca-Cola 红）可能要求 ΔE < 1.0。建议在项目启动时与客户就容差标准达成书面共识，避免在量产阶段因标准模糊而引发争议。",
      en: "Different printing scenarios have significantly different delta-E tolerance requirements. Visual consistency for brand colors typically requires ΔE < 2.0 (CIEDE2000), while key brand colors (such as Tiffany Blue or Coca-Cola Red) may require ΔE < 1.0. Reach a written agreement on tolerance standards with the client at project kickoff to avoid disputes over ambiguous standards during production.",
    },
    col2Title: { zh: "跨厂商的标准传递", en: "Passing Standards Across Suppliers" },
    col2: {
      zh: "当同一品牌色需要在多个油墨供应商或多家印刷工厂同时生产时，统一的标准传递机制至关重要。建议以实物标准样（在标准光源 D50 下验证）为主，电子档案（L*a*b* 数据）为辅，双重确认，减少设备和基材差异带来的理解偏差。",
      en: "When the same brand color must be produced by multiple ink suppliers or printing plants simultaneously, a unified standard transfer mechanism is critical. Use physical standard samples (verified under standard illuminant D50) as the primary reference, with digital archives (L*a*b* data) as a secondary check, to reduce interpretation differences caused by equipment and substrate variation.",
    },
    section2Title: { zh: "量产首件：色彩标准的最终验证", en: "First Article in Production: Final Color Validation" },
    section2: {
      zh: "量产首件确认是品牌色彩标准传递的最后一道闸门。无论前期打样效果多好，真正决定产品质量的是在实际生产线、实际基材、实际速度下的输出结果。建议将首件确认纳入标准生产流程，设定明确的通过/失败判定标准，并在首件样品上注明测量数据，作为同批次产品的参考基准。",
      en: "First-article approval in production is the final gateway for brand color standard transfer. No matter how good the pre-production proof looks, what truly determines product quality is the output on the actual production line, actual substrate, and actual press speed. Make first-article approval a standard part of the production workflow, with clear pass/fail criteria, and annotate the approved sample with measurement data to serve as the reference benchmark for the entire batch.",
    },
  },
  "water-based-ink-trends-2026": {
    section1Title: { zh: "法规收紧对水性油墨的推动", en: "Regulatory Tightening Driving Water-Based Adoption" },
    section1: {
      zh: "2026 年，欧盟和北美的包装化学品法规进入新一轮执行周期，对溶剂型油墨中的 VOC 排放和迁移物质的限制更加严格。这一背景下，水性油墨在食品接触包装、儿童产品包装和可再生包装材料中的市场份额持续增长。品牌商和印刷企业正在加速完成从溶剂体系向水性体系的转型，不仅是为了满足法规要求，更是为了提前布局未来的监管环境。",
      en: "In 2026, EU and North American packaging chemical regulations entered a new enforcement cycle with stricter limits on VOC emissions and migrating substances in solvent-based inks. Against this backdrop, water-based inks are gaining market share in food-contact packaging, children's product packaging, and recyclable packaging materials. Brand owners and printers are accelerating the transition from solvent to water-based systems, not only to meet current regulations but also to position ahead of future regulatory environments.",
    },
    col1Title: { zh: "性能提升：新配方突破", en: "Performance Gains: New Formulation Breakthroughs" },
    col1: {
      zh: "新一代水性配方在高速印刷线的适应性上有了显著进步。改进的流变控制技术使水性油墨在高速条件下的飞墨和起泡问题大幅减少；改进的树脂体系则提升了在非极性基材（如 BOPP）上的附着力。这些技术进步使水性油墨能够覆盖此前只能由溶剂型产品胜任的场景。",
      en: "New-generation water-based formulations show significant improvements in adaptability to high-speed print lines. Improved rheology control technology has greatly reduced misting and foaming issues at high speeds, while improved resin systems have enhanced adhesion on non-polar substrates like BOPP. These technical advances allow water-based inks to cover applications that previously required solvent-based products.",
    },
    col2Title: { zh: "转型路径与常见挑战", en: "Transition Pathways & Common Challenges" },
    col2: {
      zh: "从溶剂体系转向水性体系，并非简单地替换油墨。需要同步评估的变量包括：烘干系统能力（水性需要更大风量和热量）、基材预处理方式（电晕处理或底涂）、印刷车速适配，以及色彩曲线的重新标定。建议与油墨供应商合作制定分阶段的切换计划，优先从技术风险较低的产品线入手，逐步积累转型经验。",
      en: "Transitioning from solvent to water-based systems is not simply a matter of replacing the ink. Variables to evaluate simultaneously include: dryer system capacity (water-based requires greater airflow and heat), substrate pretreatment (corona treatment or primer), press speed adjustment, and color curve recalibration. Work with your ink supplier to develop a phased switch plan, starting with product lines that carry lower technical risk, and build transition experience progressively.",
    },
    section2Title: { zh: "2026 年水性油墨的增长机会", en: "Water-Based Ink Growth Opportunities in 2026" },
    section2: {
      zh: "从市场机会看，水性油墨在标签印刷、纸张包装和柔性软包装三个细分市场的增长最为明显。标签市场受消费品品牌的可持续承诺驱动；纸张包装受电商包装绿色化趋势推动；软包装市场则受食品接触法规的直接约束。对于印刷企业和油墨供应商而言，在这三个领域建立可验证的水性解决方案能力，将是未来 2—3 年最重要的竞争差异化来源之一。",
      en: "Looking at market opportunity, water-based ink growth is most pronounced in three segments: label printing, paper packaging, and flexible soft packaging. Label markets are driven by consumer brand sustainability commitments; paper packaging by the greening trend in e-commerce packaging; and soft packaging by direct food-contact regulatory constraints. For printers and ink suppliers, building verifiable water-based solution capabilities in these three areas will be one of the most important sources of competitive differentiation in the next two to three years.",
    },
  },
  "72h-sampling-turnaround-case-study": {
    section1Title: { zh: "传统打样流程的瓶颈", en: "Bottlenecks in Traditional Sampling Workflows" },
    section1: {
      zh: "在传统的油墨打样流程中，从客户提出色彩目标到交付实机验证样品，通常需要经历：需求确认（1—2 天）、内部配方设计（3—5 天）、样品制作（1—2 天）、物流运输（2—3 天），总计 7—12 个工作日。这个周期对于需要快速决策的品牌包装项目来说往往是不可接受的瓶颈，尤其是在季节性新品上市或展会前的赶工场景中。",
      en: "In a traditional ink sampling workflow, the process from customer color targets to delivery of on-press validation samples typically involves: requirements confirmation (1–2 days), internal formulation design (3–5 days), sample production (1–2 days), and logistics transit (2–3 days) — totaling 7–12 working days. For brand packaging projects that require rapid decision-making, this cycle is often an unacceptable bottleneck, especially for seasonal new product launches or pre-exhibition rush situations.",
    },
    col1Title: { zh: "72 小时服务的流程重构", en: "Workflow Redesign for 72-Hour Turnaround" },
    col1: {
      zh: "72 小时打样服务的实现依赖于流程重构而非单纯提速。关键改变包括：将需求确认前置至销售阶段（0 小时）；建立快速配方数据库，使 80% 的常规色彩可在 4 小时内完成配方初版；将内部审批流程压缩至单一决策人；并在主要市场建立本地交付网络，消除长途物流的时间损耗。",
      en: "Achieving 72-hour sampling depends on workflow redesign, not simply moving faster. Key changes include: moving requirements confirmation to the sales stage (hour 0); building a rapid formula database so 80% of common colors have an initial formula within 4 hours; compressing internal approval to a single decision-maker; and establishing local delivery networks in major markets to eliminate long-distance logistics delays.",
    },
    col2Title: { zh: "客户端的配合要求", en: "Client-Side Cooperation Requirements" },
    col2: {
      zh: "72 小时服务的成功同样取决于客户端的配合效率。关键前提包括：在第一次沟通前准备好具体的色彩目标（Pantone 编号或参考样品）、明确基材规格（材质、达因值）和印刷工艺参数（速度、压力、后道工序）。这些信息的提前准备可以将需求确认阶段从 1—2 天压缩至 1—2 小时，是实现 72 小时目标的关键前提。",
      en: "The success of 72-hour service also depends on client-side cooperation efficiency. Key prerequisites include: having specific color targets ready before the first call (Pantone reference or physical sample), defined substrate specifications (material, dyne level), and printing process parameters (speed, pressure, downstream processes). Preparing this information in advance can compress the requirements confirmation stage from 1–2 days to 1–2 hours — a critical prerequisite for meeting the 72-hour target.",
    },
    section2Title: { zh: "从打样速度到量产信心", en: "From Sampling Speed to Production Confidence" },
    section2: {
      zh: "72 小时打样不只是时间优化，更是品牌方对量产决策信心的重建。快速、准确的实机验证样品让品牌方能够在内部评审会上展示真实的效果，而非依赖电子屏幕上的数字模拟。从案例数据来看，采用 72 小时打样服务的项目，在完成试样后进入正式采购决策的转化率比传统流程高出约 35%，这与决策周期缩短后买家信心提升直接相关。",
      en: "72-hour sampling is not just time optimization — it rebuilds brand owners' confidence in production decision-making. Fast, accurate on-press validation samples allow brand teams to show real results in internal review meetings, rather than relying on digital simulations on screens. Case data shows that projects using 72-hour sampling have approximately 35% higher conversion rates from sampling to formal procurement decisions compared to traditional workflows, directly correlated with the confidence boost from shorter decision cycles.",
    },
  },
  "reach-compliance-documentation-guide": {
    section1Title: { zh: "REACH 法规的核心要求", en: "Core Requirements of REACH Regulation" },
    section1: {
      zh: "REACH 法规（EC No 1907/2006）是欧盟对化学物质进行管理的基础性法规，要求所有在欧盟市场使用或进口的化学物质（包括油墨中的成分）进行注册、评估和授权。对于印刷油墨采购商而言，最关键的合规要求是：确保所用油墨不含 SVHC（高度关注物质）候选清单中的物质超限，并在供应商提供的 SDS 中获得明确说明。",
      en: "REACH Regulation (EC No 1907/2006) is the EU's foundational chemical management regulation, requiring all chemical substances used or imported into the EU market (including ink components) to be registered, evaluated, and authorized. For print procurement teams, the most critical compliance requirement is: ensuring that inks used do not contain substances on the SVHC (Substance of Very High Concern) candidate list above threshold levels, with clear documentation in the supplier's SDS.",
    },
    col1Title: { zh: "SDS 文件的核查要点", en: "Key Points for SDS Document Review" },
    col1: {
      zh: "安全数据表（SDS）是 REACH 合规的核心文件。审查 SDS 时，需重点核查以下内容：第 3 章（成分信息）是否完整列出所有化学成分及其 CAS 编号；第 15 章（法规信息）是否明确注明适用的欧盟法规及合规状态；以及是否有明确的 SVHC 声明。有效的 SDS 应为 16 章格式，且在近 3 年内更新。",
      en: "The Safety Data Sheet (SDS) is the core document for REACH compliance. When reviewing an SDS, focus on: Section 3 (Composition) — does it list all chemical components and CAS numbers completely; Section 15 (Regulatory Information) — does it clearly state applicable EU regulations and compliance status; and whether there is an explicit SVHC declaration. A valid SDS should be in 16-section format and updated within the last three years.",
    },
    col2Title: { zh: "食品接触与儿童产品的附加要求", en: "Additional Requirements for Food Contact & Children's Products" },
    col2: {
      zh: "对于食品接触包装和儿童产品，REACH 的基础合规之外还需叠加额外的监管要求。食品接触包装需符合欧盟（EC）No 1935/2004 框架法规及特定材料法规（如印刷油墨的 SwissOrdinance 或德国 BfR 建议）；儿童产品需符合欧盟玩具安全指令（EN 71-3）中的化学品迁移限制。采购商在立项时应明确产品最终用途，提前向供应商明示所需的合规等级。",
      en: "For food-contact packaging and children's products, REACH base compliance must be supplemented with additional regulatory requirements. Food-contact packaging must comply with EU Framework Regulation (EC) No 1935/2004 and specific material regulations (such as the Swiss Ordinance or German BfR recommendations for printing inks); children's products must comply with chemical migration limits in the EU Toy Safety Directive (EN 71-3). Procurement teams should clarify the product's end use at project initiation and communicate the required compliance level to suppliers upfront.",
    },
    section2Title: { zh: "将合规文件纳入采购评估体系", en: "Integrating Compliance Documents into Procurement Evaluation" },
    section2: {
      zh: "最有效的合规风险管理方式，是将文件核查前置至供应商评估阶段，而非等到量产装运前才发现问题。建议在供应商评估表中增加合规文件核查项，要求供应商在投标阶段提交最新版 SDS、SVHC 声明和产品合规证书；同时在合同条款中明确供应商的持续合规义务和违规赔偿条款，形成完整的风险闭环。",
      en: "The most effective approach to compliance risk management is moving document verification to the supplier evaluation stage, rather than discovering issues just before production shipment. Add compliance document verification items to your supplier evaluation form, requiring suppliers to submit the latest SDS, SVHC declaration, and product compliance certificate at the tender stage. Also include in contract terms the supplier's ongoing compliance obligations and penalty clauses for non-compliance, forming a complete risk management loop.",
    },
  },
  "ink-adhesion-testing-flexible-packaging": {
    section1Title: { zh: "软包装附着力的影响因素", en: "Factors Affecting Adhesion in Flexible Packaging" },
    section1: {
      zh: "软包装油墨的附着力受到多个变量的共同影响：基材表面能（达因值）、油墨配方与基材的化学相容性、印刷工艺参数（车速、压力、温度）、固化或干燥的完整性，以及后道覆膜和复合工艺的影响。理解这些变量的交互关系，是建立有效附着力测试体系的前提。单一的胶带测试不能全面反映软包装在实际使用条件下的附着性能。",
      en: "Flexible packaging ink adhesion is influenced by multiple variables simultaneously: substrate surface energy (dyne level), chemical compatibility between ink formulation and substrate, printing process parameters (speed, pressure, temperature), completeness of curing or drying, and the effects of downstream lamination and laminating processes. Understanding the interaction of these variables is a prerequisite for building an effective adhesion testing system. A single tape test cannot fully reflect flexible packaging adhesion performance under actual end-use conditions.",
    },
    col1Title: { zh: "主流测试方法对比", en: "Comparison of Main Testing Methods" },
    col1: {
      zh: "胶带附着力测试（ASTM D3359 B 法）是最快速的初步筛选工具，适合在打样阶段快速判断配方方向，但对终态附着力（覆膜后）的预测能力有限。耐酒精擦拭测试（通常为 50—75% 酒精，200 次以上摩擦）适合评估油墨固化完整性和耐溶剂性。水煮测试（100°C，30 分钟）模拟蒸煮袋在高温使用场景下的附着耐久性。耐刮擦测试（Sutherland Rub Tester）评估印刷面在运输和仓储中的机械耐久性。",
      en: "The tape adhesion test (ASTM D3359 Method B) is the fastest initial screening tool, suitable for quickly judging formulation direction during proofing, but has limited predictive power for final adhesion state (after lamination). The alcohol rub test (typically 50–75% alcohol, 200+ strokes) assesses ink cure completeness and solvent resistance. The boiling water test (100°C, 30 minutes) simulates adhesion durability for retort pouches in high-temperature use scenarios. The Sutherland Rub Test evaluates the mechanical durability of printed surfaces through transport and storage.",
    },
    col2Title: { zh: "实机验证的场景设计", en: "Scenario Design for On-Press Validation" },
    col2: {
      zh: "附着力测试的最终可靠性来自于对实际使用场景的模拟。在设计实机验证计划时，应明确产品的全部后道工序（覆膜类型、复合方式、分切工艺），并在模拟样品上按照真实顺序依次执行这些工序，最后在工序完成后的样品上进行附着力测量。这样得到的数据才能真正代表产品在量产条件下的附着性能基线。",
      en: "The ultimate reliability of adhesion testing comes from simulating actual end-use scenarios. When designing an on-press validation plan, identify all downstream processes for the product (lamination film type, composite method, slitting process), and sequentially execute these processes on simulation samples in the actual production order, then measure adhesion on the post-process samples. Only data obtained this way truly represents the adhesion performance baseline under production conditions.",
    },
    section2Title: { zh: "建立标准化的软包装附着验证档案", en: "Building a Standardized Flexible Packaging Adhesion Validation Archive" },
    section2: {
      zh: "对于长期合作的软包装项目，建议建立标准化的附着验证档案，记录每种基材-油墨-后道组合的测试结果、通过/失败判定依据和历史批次数据。当基材供应商或工艺参数发生变化时，可以快速调取历史档案进行对比，判断是否需要重新验证。这种系统化的档案管理方式，可以将每次变更带来的验证成本降到最低，同时保持质量管控的连续性。",
      en: "For long-term flexible packaging programs, build a standardized adhesion validation archive documenting test results, pass/fail criteria, and historical batch data for each substrate-ink-downstream combination. When substrate suppliers or process parameters change, you can quickly pull historical records for comparison and determine whether revalidation is needed. This systematic archive management approach minimizes the validation cost of each change while maintaining continuous quality control.",
    },
  },
  "cross-plant-color-consistency": {
    section1Title: { zh: "跨厂色差的根本成因", en: "Root Causes of Cross-Plant Color Deviation" },
    section1: {
      zh: "跨厂色差的来源是多层次的。第一层是配方层面：不同工厂使用了成分相近但不完全相同的原材料，或者配方记录不够精确导致每次配制时存在误差累积。第二层是设备层面：不同工厂的网纹辊规格、印刷机型和干燥系统的差异，会导致相同配方在不同环境下产生不同的色彩输出。第三层是操作层面：操作员之间的调色习惯差异和首件确认的严格程度不一，会放大配方和设备层面的固有误差。",
      en: "Cross-plant color deviation has multilayered sources. The first layer is formulation: different plants use raw materials that are similar but not identical, or formula records lack precision and allow error accumulation with each preparation. The second layer is equipment: differences in anilox specifications, press models, and drying systems across plants cause the same formula to produce different color outputs in different environments. The third layer is operations: differences in operator color adjustment habits and varying rigor in first-article approval amplify the inherent errors from formulation and equipment layers.",
    },
    col1Title: { zh: "配方标准化的执行细节", en: "Implementation Details of Formula Standardization" },
    col1: {
      zh: "配方标准化不等于使用完全相同的配方——因为设备差异决定了单一配方无法在所有工厂产生相同的色彩输出。真正的标准化是建立基准配方与工厂专属修正参数的组合体系：以中央实验室验证的基准配方为起点，再为每家工厂建立基于其设备特性的修正参数库（如粘度补偿、转移量校正），确保最终的色彩输出在统一的 ΔE 容差范围内收敛。",
      en: "Formula standardization does not mean using exactly the same formula everywhere — equipment differences mean a single formula cannot produce the same color output at all plants. True standardization means building a combined system of baseline formulas and plant-specific correction parameters: start with a baseline formula validated by a central laboratory, then build a correction parameter library for each plant based on its equipment characteristics (such as viscosity compensation and transfer volume correction), ensuring final color output converges within a unified delta-E tolerance range.",
    },
    col2Title: { zh: "色彩管理平台的角色", en: "The Role of a Color Management Platform" },
    col2: {
      zh: "集中式色彩管理平台是实现跨厂一致性的技术基础设施。平台的核心功能包括：存储每种品牌色的分光数据标准；汇聚各工厂的首件测量数据；自动计算 ΔE 并触发超差预警；以及生成跨批次、跨工厂的色彩趋势报告。当色彩偏差出现时，平台能够快速定位是配方、设备还是操作层面的问题，大幅缩短根因分析的时间。",
      en: "A centralized color management platform is the technical infrastructure for cross-plant consistency. Core platform functions include: storing spectral data standards for each brand color; aggregating first-article measurement data from all plants; automatically calculating delta-E and triggering out-of-tolerance alerts; and generating cross-batch, cross-plant color trend reports. When color deviations occur, the platform can quickly identify whether the issue is at the formula, equipment, or operations level, dramatically shortening root-cause analysis time.",
    },
    section2Title: { zh: "建立跨厂色彩治理体系", en: "Building a Cross-Plant Color Governance System" },
    section2: {
      zh: "从单点色彩管控到跨厂体系治理，需要的不只是技术工具，更需要组织机制的配套。建议设立专职的色彩治理角色（Color Governance Manager），负责跨厂标准的制定、传递和持续改进；建立定期的跨厂色彩审核会议，比较各工厂的长期色彩趋势数据；并将色彩一致性指标纳入各工厂的绩效考核体系，让品牌色彩质量成为一项有组织保障的系统性工程，而非依赖个别岗位的个人能力。",
      en: "Moving from single-point color control to cross-plant governance requires not just technical tools but also complementary organizational mechanisms. Recommend establishing a dedicated Color Governance Manager role responsible for developing, transmitting, and continuously improving cross-plant standards; hold regular cross-plant color review meetings comparing long-term color trend data across plants; and incorporate color consistency metrics into plant performance evaluation systems, making brand color quality a systemically guaranteed engineering discipline rather than relying on the individual capabilities of specific positions.",
    },
  },
  default: {
    section1Title: { zh: "核心挑战与背景", en: "Core Challenge & Context" },
    section1: {
      zh: "在现代印刷包装行业，精准的工艺管控和高效的沟通协同是决定项目成败的关键因素。随着供应链全球化和品牌标准的持续提升，每一个环节都需要系统化的方法论支撑，而非依赖个人经验的临时应对。本文将从实践角度深入探讨关键技术点和最佳实践路径。",
      en: "In modern print packaging, precise process control and efficient collaboration are the decisive factors in project success. As supply chains globalize and brand standards continue to rise, every step needs systematic methodology rather than ad-hoc responses based on individual experience. This article takes a practical look at key technical points and best-practice paths.",
    },
    col1Title: { zh: "技术实施要点", en: "Key Implementation Points" },
    col1: {
      zh: "技术实施层面，需要关注工艺参数的标准化、检测方法的一致性以及数据记录的完整性。系统化的工艺管控不仅能降低质量风险，还能在出现问题时快速定位根因，缩短问题解决周期，保障量产的连续性和稳定性。",
      en: "At the technical implementation level, focus on standardizing process parameters, ensuring measurement method consistency, and maintaining complete data records. Systematic process control not only reduces quality risk but also enables fast root-cause identification when issues arise, shortening resolution cycles and protecting production continuity and stability.",
    },
    col2Title: { zh: "跨部门协同机制", en: "Cross-Department Collaboration" },
    col2: {
      zh: "跨部门协同是项目高效推进的组织保障。建议在项目启动时明确各部门的职责边界和沟通节点，建立定期的项目状态同步机制，并利用标准化的文档模板降低跨团队沟通的信息损耗。明确的责任人和清晰的升级路径是防止问题积压的关键。",
      en: "Cross-department collaboration is the organizational foundation for efficient project execution. Define departmental responsibility boundaries and communication checkpoints at project kickoff, establish regular project status synchronization, and use standardized document templates to minimize information loss across teams. Clear ownership and escalation paths are key to preventing issues from accumulating.",
    },
    section2Title: { zh: "结语与行动建议", en: "Conclusion & Recommended Actions" },
    section2: {
      zh: "无论是色彩管控、合规认证还是跨境协同，系统化的工作方法都优于碎片化的经验积累。建议企业从标准化文档入手，逐步建立可复用的工艺知识库，将隐性经验转化为显性标准，让每一个项目都能在更高的基线上起步，实现持续的质量改进。",
      en: "Whether it's color management, compliance certification, or cross-border collaboration, systematic working methods outperform fragmented experience accumulation. Start with standardized documentation, then progressively build a reusable process knowledge base that converts tacit knowledge into explicit standards. This lets every project start from a higher baseline and achieve continuous quality improvement.",
    },
  },
};

function getArticleBody(slug: string): ArticleBody {
  return ARTICLE_BODIES[slug] ?? ARTICLE_BODIES.default;
}

/* ─── Metadata ──────────────────────────────────────────────────────── */

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeStr, slug } = await params;
  const locale = getLocaleFromString(localeStr);
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return buildMetadata({
    locale,
    pathname: `/news/${slug}`,
    title: article.seoTitle[locale],
    description: article.seoDescription[locale],
  });
}

export async function generateStaticParams() {
  const locales = ["zh", "en"];
  return locales.flatMap((locale) =>
    articles.map((a) => ({ locale, slug: a.slug }))
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale: localeStr, slug } = await params;
  const locale = getLocaleFromString(localeStr) as Locale;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const heroImage = HERO_IMAGES[slug] ?? HERO_IMAGES["how-to-stabilize-color-in-flexo-packaging"];
  const body = getArticleBody(slug);
  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);

  const dateFormatted =
    locale === "zh"
      ? article.publishedAt.replace(/-/g, " 年 ").replace(/-/, " 月 ") + " 日"
      : new Date(article.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

  return (
    <main className="min-h-screen bg-white">
      {/* ── Back link ──────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0 pt-[100px] lg:pt-[120px] pb-[28px]">
        <FadeIn>
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-[6px] text-[13px] font-mono text-[#888] hover:text-[#000] transition-colors duration-200"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            {locale === "zh" ? "返回新闻列表" : "Back to News"}
          </Link>
        </FadeIn>
      </div>

      {/* ── Article header ─────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0 pb-[36px]">
        <FadeIn delay={0.05}>
          <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#888] mb-[16px]">
            {article.category[locale]}
          </p>
          <h1 className="font-display text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.0] tracking-[-0.03em] text-[#000]">
            {article.title[locale]}
          </h1>
        </FadeIn>
      </div>

      {/* ── Hero image ─────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0 pb-[32px]">
        <FadeIn delay={0.1}>
          <div
            className="w-full rounded-[20px] overflow-hidden"
            style={{ aspectRatio: "16/8" }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          </div>
        </FadeIn>
      </div>

      {/* ── Meta bar ───────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0 pb-[32px]">
        <FadeIn delay={0.15}>
          <div className="flex items-center justify-between gap-[16px] py-[18px] border-t border-b border-[#E8E8E8]">
            <div className="flex items-center gap-[20px] flex-wrap">
              <span className="flex items-center gap-[6px] text-[12px] font-mono text-[#666]">
                <Calendar size={13} strokeWidth={1.6} />
                {dateFormatted}
              </span>
              <span className="flex items-center gap-[6px] text-[12px] font-mono text-[#666]">
                <Clock size={13} strokeWidth={1.6} />
                {locale === "zh"
                  ? `${article.readTime} 分钟阅读`
                  : `${article.readTime} min read`}
              </span>
              <span className="text-[12px] font-mono text-[#000] bg-[#F4F4F2] px-[10px] py-[4px] rounded-full">
                {locale === "zh" ? "油墨公司" : "Ink Company"}
              </span>
            </div>
            <button className="flex items-center gap-[6px] text-[12px] font-mono text-[#666] hover:text-[#000] transition-colors duration-200 shrink-0">
              <Share2 size={14} strokeWidth={1.6} />
              {locale === "zh" ? "分享" : "Share"}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* ── Article body ───────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0 pb-[60px]">
        {/* Opening / Excerpt */}
        <FadeIn delay={0.2}>
          <p className="text-[17px] leading-[1.85] text-[#222] font-medium mb-[32px]">
            {article.excerpt[locale]}
          </p>
        </FadeIn>

        {/* Main intro content */}
        <FadeIn delay={0.25}>
          <p className="text-[15px] leading-[1.85] text-[#444] mb-[44px]">
            {article.content[locale]}
          </p>
        </FadeIn>

        {/* Section 1 */}
        <FadeIn delay={0.28}>
          <h2 className="font-display text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.025em] text-[#000] mb-[16px]">
            {body.section1Title[locale]}
          </h2>
          <p className="text-[15px] leading-[1.85] text-[#444] mb-[44px]">
            {body.section1[locale]}
          </p>
        </FadeIn>

        {/* Two-column insight block */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[32px] mb-[44px] p-[32px] bg-[#F6F5F3] rounded-[16px]">
            <div>
              <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.02em] text-[#000] mb-[12px]">
                {body.col1Title[locale]}
              </h3>
              <p className="text-[14px] leading-[1.8] text-[#555]">
                {body.col1[locale]}
              </p>
            </div>
            <div>
              <h3 className="font-display text-[18px] leading-[1.2] tracking-[-0.02em] text-[#000] mb-[12px]">
                {body.col2Title[locale]}
              </h3>
              <p className="text-[14px] leading-[1.8] text-[#555]">
                {body.col2[locale]}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Section 2 */}
        <FadeIn delay={0.33}>
          <h2 className="font-display text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.025em] text-[#000] mb-[16px]">
            {body.section2Title[locale]}
          </h2>
          <p className="text-[15px] leading-[1.85] text-[#444] mb-[20px]">
            {body.section2[locale]}
          </p>
        </FadeIn>

        {/* CTA block */}
        <FadeIn delay={0.36}>
          <div className="mt-[48px] rounded-[16px] bg-[#0F0F0D] px-[36px] py-[32px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[20px]">
            <div>
              <p className="font-display text-[20px] leading-[1.2] tracking-[-0.025em] text-white mb-[6px]">
                {locale === "zh"
                  ? "有项目想要讨论？"
                  : "Have a project to discuss?"}
              </p>
              <p className="text-[13px] font-mono text-white/55">
                {locale === "zh"
                  ? "我们的工程师可以在 24 小时内回复您。"
                  : "Our engineers will respond within 24 hours."}
              </p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-[8px] bg-white text-[#000] text-[13px] font-mono rounded-full px-[22px] py-[12px] hover:bg-[#E8E8E4] transition-colors duration-200 shrink-0"
            >
              {locale === "zh" ? "联系我们" : "Get in touch"}
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* ── Related articles ───────────────────────────────────── */}
      <section className="border-t border-[#E8E8E8] bg-[#FAFAF8] py-[60px] lg:py-[80px]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-0">
          <FadeIn>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#888] mb-[28px]">
              {locale === "zh" ? "相关阅读" : "Related Articles"}
            </p>
          </FadeIn>
          <FadeInGroup>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px]">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/news/${r.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-[12px] overflow-hidden mb-[14px]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      style={{
                        backgroundImage: `url(${
                          HERO_IMAGES[r.slug] ??
                          HERO_IMAGES[
                            "how-to-stabilize-color-in-flexo-packaging"
                          ]
                        })`,
                      }}
                    />
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-[#888] mb-[8px]">
                    {r.category[locale]}
                  </p>
                  <p className="font-display text-[16px] leading-[1.2] tracking-[-0.02em] text-[#000] group-hover:opacity-70 transition-opacity duration-200">
                    {r.title[locale]}
                  </p>
                </Link>
              ))}
            </div>
          </FadeInGroup>
        </div>
      </section>
    </main>
  );
}
