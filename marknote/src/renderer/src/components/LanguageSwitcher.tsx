import { useTranslation } from 'react-i18next'
import { FiGlobe } from 'react-icons/fi'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const currentLang = i18n.language
    const newLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      title={i18n.language === 'zh-CN' ? 'Switch to English' : i18n.language === 'en-US' ? '切换到中文' : `Switch to ${i18n.language}`}
    >
      <FiGlobe className="w-4 h-4" />
      <span className="font-medium">
        {i18n.language === 'zh-CN' ? '中文' : i18n.language === 'en-US' ? 'EN' : i18n.language.toUpperCase()}
      </span>
    </button>
  )
}