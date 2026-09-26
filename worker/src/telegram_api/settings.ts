import { Context } from "hono";
import { CONSTANTS } from "../constants";

export class TelegramSettings {
    enableAllowList: boolean;
    allowList: string[];
    miniAppUrl: string;
    enableGlobalMailPush: boolean;
    globalMailPushList: string[];
    autoDeleteMinutes: number;

    constructor(
        enableAllowList: boolean, allowList: string[], miniAppUrl: string,
        enableGlobalMailPush: boolean, globalMailPushList: string[], autoDeleteMinutes = 0
    ) {
        this.enableAllowList = enableAllowList;
        this.allowList = allowList;
        this.miniAppUrl = miniAppUrl;
        this.enableGlobalMailPush = enableGlobalMailPush;
        this.globalMailPushList = globalMailPushList;
        this.autoDeleteMinutes = autoDeleteMinutes;
    }
}

async function getTelegramSettings(c: Context<HonoCustomType>): Promise<Response> {
    const settings = await c.env.KV.get<TelegramSettings>(CONSTANTS.TG_KV_SETTINGS_KEY, "json");
    return c.json(settings || new TelegramSettings(false, [], "", false, []));
}


async function saveTelegramSettings(c: Context<HonoCustomType>): Promise<Response> {
    const settings = await c.req.json<TelegramSettings>();
    settings.autoDeleteMinutes ??= 0;
    if (!Number.isInteger(settings.autoDeleteMinutes) || settings.autoDeleteMinutes < 0 || settings.autoDeleteMinutes >= 2880) {
        return c.json({ error: "autoDeleteMinutes must be between 0 and 2879" }, 400);
    }
    await c.env.KV.put(CONSTANTS.TG_KV_SETTINGS_KEY, JSON.stringify(settings));
    return c.json({ success: true })
}

export default {
    getTelegramSettings,
    saveTelegramSettings,
}
