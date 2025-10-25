// Hugging Face Token Configuration (ENV-first)
const FALLBACK = "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";
const HF_TOKEN = process.env.HF_TOKEN && process.env.HF_TOKEN.trim() !== "" ? process.env.HF_TOKEN : FALLBACK;
export { HF_TOKEN };
