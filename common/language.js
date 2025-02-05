import { getItem, setItem } from "../pages/util/storageHelper";
import { locale } from "../manifest.json"
console.log("默认设置",locale);
const supportedLanguages = ['zh-CN', 'zh-TW', 'en']; 
const defaultLanguage = locale; // 默认语言

// 获取系统语言
function getSystemLanguage() {
  const language = navigator.language || navigator.userLanguage;
  return language;
}

// 从缓存中获取上次设置的语言
function getCachedLanguage() {
  return getItem("lang");
}

// 设置当前语言
function setLanguage(language) {
  if (supportedLanguages.includes(language)) {
    setItem('lang', language); // 缓存当前语言
  } else {
    console.warn(`不支持的语言：${language}`);
  }
}

// 每次初始化时设置语言
function initializeLanguage() {
    console.log("initializeLanguage");
  const cachedLanguage = getCachedLanguage();
  const systemLanguage = getSystemLanguage();
  
  // 优先级：缓存语言 > 系统语言 > 默认语言
  const currentLanguage = 
    cachedLanguage && supportedLanguages.includes(cachedLanguage)
      ? cachedLanguage
      : supportedLanguages.includes(systemLanguage)
      ? systemLanguage
      : defaultLanguage;

  // 设置缓存的语言
  setLanguage(currentLanguage);

  return currentLanguage;
}

export { setLanguage, getCachedLanguage, initializeLanguage };