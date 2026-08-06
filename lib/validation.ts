export type ValidationType =
  | "email"
  | "url"
  | "phone"
  | "slug"
  | "required"
  | "notEmpty"
  | "youtubeUrl"
  | "vimeoUrl"
  | "videoUrl"
  | "password"
  | "numeric"
  | "alphanumeric"
  | "minLength"
  | "maxLength";

export type ValidationResult = {
  valid: boolean;
  message: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRe = /^https?:\/\/.+/i;
const phoneRe = /^[\d\+\-\s\(\)]{7,20}$/;
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const numericRe = /^\d+$/;
const alphanumericRe = /^[a-zA-Z0-9]+$/;
const youtubeRe = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
const vimeoRe = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/i;

const messages: Record<string, string> = {
  email: "Enter a valid email address",
  url: "Enter a valid URL (must start with http:// or https://)",
  phone: "Enter a valid phone number",
  slug: "Must be lowercase with hyphens (e.g. my-slug)",
  required: "This field is required",
  notEmpty: "This field is required",
  youtubeUrl: "Enter a valid YouTube URL",
  vimeoUrl: "Enter a valid Vimeo URL",
  videoUrl: "Enter a valid YouTube or Vimeo URL",
  password: "Must be at least 6 characters",
  numeric: "Must contain only digits",
  alphanumeric: "Must contain only letters and numbers",
  minLength: "Value is too short",
  maxLength: "Value is too long",
};

export function validate(
  value: string,
  type: ValidationType,
  length?: number,
): ValidationResult {
  if (typeof value !== "string") {
    return { valid: false, message: messages[type] || "Invalid value" };
  }

  switch (type) {
    case "email":
      return emailRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.email };

    case "url":
      return urlRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.url };

    case "phone":
      return phoneRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.phone };

    case "slug":
      return slugRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.slug };

    case "required":
    case "notEmpty":
      return value.trim().length > 0
        ? { valid: true, message: "" }
        : { valid: false, message: messages.required };

    case "youtubeUrl":
      return youtubeRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.youtubeUrl };

    case "vimeoUrl":
      return vimeoRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.vimeoUrl };

    case "videoUrl":
      return youtubeRe.test(value) || vimeoRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.videoUrl };

    case "password":
      return value.length >= 6
        ? { valid: true, message: "" }
        : { valid: false, message: messages.password };

    case "numeric":
      return numericRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.numeric };

    case "alphanumeric":
      return alphanumericRe.test(value)
        ? { valid: true, message: "" }
        : { valid: false, message: messages.alphanumeric };

    case "minLength":
      return typeof length === "number" && value.length >= length
        ? { valid: true, message: "" }
        : { valid: false, message: `Must be at least ${length} characters` };

    case "maxLength":
      return typeof length === "number" && value.length <= length
        ? { valid: true, message: "" }
        : { valid: false, message: `Must be at most ${length} characters` };

    default:
      return { valid: false, message: "Invalid value" };
  }
}
