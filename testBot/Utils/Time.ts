export function formatMS_HHMMSS(num:number) {
    const h = Math.floor(num / 3.6e6);
    const m = Math.floor((num - (h * 3.6e6)) / 60);
    const s = num - (h * 3.6e6) - (m * 60);
    return `${h < 10 ? `0${h <= 0 ? 0 : h}:`: h}:${m < 10 ? `0${m <= 0 ? 0 : m}:`: m}:${s < 10 ? `0${s <= 0 ? 0 : s}:`: s}:`;
}

export const delay = async (ms) => new Promise(r => setTimeout(() => r(true), ms));