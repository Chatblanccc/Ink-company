"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

import { inquiryFormSchema, type InquiryFormValues } from "@/lib/forms";
import { type Locale } from "@/lib/i18n";

type ContactFormProps = {
  locale: Locale;
};

const inputClass =
  "w-full bg-[#F3F3F3] rounded-[8px] px-[16px] py-[14px] text-[14px] text-[#000] placeholder:text-[#AAAAAA] border-0 outline-none focus:bg-[#EBEBEB] transition-colors duration-150 appearance-none";

const labelClass =
  "block text-[13px] lg:text-[14px] font-medium leading-[1.3] text-[#000] mb-[8px]";

const errorClass = "text-[12px] text-red-500 mt-[5px]";

export function ContactForm({ locale }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const zh = locale === "zh";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
  });

  const onSubmit = async (values: InquiryFormValues) => {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, language: locale }),
    });

    if (!res.ok) {
      return;
    }

    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-[20px] py-[80px] text-center">
        <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#DFECC6]">
          <Check className="size-[24px] text-[#485C11]" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="font-display text-[24px] lg:text-[28px] leading-[1.1] tracking-[-0.03em] text-[#000]">
            {zh ? "感谢您的联系！" : "Message received!"}
          </p>
          <p className="text-[14px] leading-[1.6] text-[#6F6F6F] max-w-[360px]">
            {zh
              ? "我们的工程师将在 48 小时内与您取得联系。"
              : "Our engineers will get back to you within 48 hours."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px] lg:gap-[22px]">

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          {zh ? "姓名" : "Name"}
        </label>
        <input
          id="name"
          type="text"
          className={inputClass}
          placeholder={zh ? "您的姓名" : "Your name"}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          placeholder={zh ? "您的邮箱地址" : "your@email.com"}
          {...register("email")}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Product type — dropdown */}
      <div>
        <label htmlFor="productType" className={labelClass}>
          {zh ? "您感兴趣的产品类型" : "What product are you looking for"}
        </label>
        <div className="relative">
          <select
            id="productType"
            className={`${inputClass} pr-[40px] cursor-pointer`}
            {...register("productType")}
            defaultValue=""
          >
            <option value="" disabled>
              {zh ? "请选择产品类型" : "Select product type"}
            </option>
            <option value="water-based">{zh ? "水性油墨" : "Water-based ink"}</option>
            <option value="uv">{zh ? "UV 油墨" : "UV ink"}</option>
            <option value="specialty">{zh ? "功能型油墨" : "Specialty ink"}</option>
            <option value="other">{zh ? "其他 / 不确定" : "Other / Not sure"}</option>
          </select>
          {/* Chevron icon */}
          <svg
            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[#AAAAAA]"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
          >
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {errors.productType && <p className={errorClass}>{errors.productType.message}</p>}
      </div>

      {/* Volume — dropdown */}
      <div>
        <label htmlFor="volume" className={labelClass}>
          {zh ? "预期采购量" : "Expected volume"}
        </label>
        <div className="relative">
          <select
            id="volume"
            className={`${inputClass} pr-[40px] cursor-pointer`}
            {...register("volume")}
            defaultValue=""
          >
            <option value="" disabled>
              {zh ? "请选择采购量" : "Select expected volume"}
            </option>
            <option value="sample">{zh ? "样品试用" : "Sample / Trial"}</option>
            <option value="small">{zh ? "小批量（< 500 kg）" : "Small (< 500 kg)"}</option>
            <option value="medium">{zh ? "中批量（500–2,000 kg）" : "Medium (500–2,000 kg)"}</option>
            <option value="large">{zh ? "大批量（> 2,000 kg）" : "Large (> 2,000 kg)"}</option>
          </select>
          <svg
            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[#AAAAAA]"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
          >
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {errors.volume && <p className={errorClass}>{errors.volume.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {zh ? "项目需求" : "Message"}
        </label>
        <textarea
          id="message"
          rows={6}
          className={`${inputClass} resize-none`}
          placeholder={
            zh
              ? "请描述您的基材类型、印刷设备、颜色要求或交付地区…"
              : "Tell us about your substrate, press type, color targets, or delivery region…"
          }
          {...register("message")}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#000] text-white text-[14px] font-bold leading-[1.4] tracking-[-0.015em] py-[16px] rounded-[8px] hover:bg-[#1a1a1a] disabled:opacity-60 transition-colors duration-150 mt-[4px]"
      >
        {isSubmitting
          ? zh ? "发送中…" : "Sending…"
          : zh ? "发送询盘" : "Submit"}
      </button>
    </form>
  );
}
