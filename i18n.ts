import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'zh'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    
    // Ensure that the locale is valid and fallback if undefined/invalid
    if (!locale || !locales.includes(locale as any)) {
        locale = 'en';
    }

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});