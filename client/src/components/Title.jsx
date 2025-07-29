import React from 'react'
import { useLanguage } from '../context/LanguageContext';

const Title = ({title,subTitle,align,font}) => {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`flex flex-col justify-center items-center text-center ${align==="left"&&"md:items-start md:text-left"} ${isRTL ? 'rtl-text-right' : ''}`}>
        <h1 className={` ${font ||"font-playfair"} text-4xl md:text-[40px] ${isRTL ? 'font-arabic' : ''}`}>{title}</h1>
        <p className={`text-sm md:text-base text-gray-500/90 mt-2 max-w-174 ${isRTL ? 'font-arabic' : ''}`}>{subTitle}</p>
    </div>
  )
}

export default Title