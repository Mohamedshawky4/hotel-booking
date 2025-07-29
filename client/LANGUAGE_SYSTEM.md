# Arabic-English Language Toggle System

This project now includes a complete Arabic-English language toggle system with RTL (Right-to-Left) support.

## Features

- ✅ **Bilingual Support**: English and Arabic translations
- ✅ **RTL Layout**: Automatic right-to-left layout for Arabic
- ✅ **Font Support**: Cairo font for Arabic text
- ✅ **Persistent Language**: Language preference saved in localStorage
- ✅ **Easy Integration**: Simple hooks and components
- ✅ **Responsive**: Works on mobile and desktop

## How to Use

### 1. Basic Translation

```jsx
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, currentLanguage, isRTL } = useTranslation();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <h1 className={isRTL ? 'font-arabic' : ''}>
        {t('hero.title')}
      </h1>
      <p className={isRTL ? 'font-arabic' : ''}>
        {t('hero.subtitle')}
      </p>
    </div>
  );
};
```

### 2. Language Toggle Component

```jsx
import LanguageToggle from '../components/LanguageToggle';

const Header = () => {
  return (
    <header>
      <LanguageToggle />
    </header>
  );
};
```

### 3. RTL Layout Support

```jsx
const { isRTL } = useTranslation();

// Use conditional classes for RTL
<div className={`flex ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
  <span>Left</span>
  <span>Right</span>
</div>

// Text alignment
<p className={isRTL ? 'text-right' : 'text-left'}>
  Content
</p>

// Font family
<h1 className={isRTL ? 'font-arabic' : 'font-inter'}>
  Title
</h1>
```

## File Structure

```
src/
├── context/
│   └── LanguageContext.jsx     # Language state management
├── translations/
│   ├── en.js                   # English translations
│   ├── ar.js                   # Arabic translations
│   └── index.js                # Translation utilities
├── components/
│   ├── LanguageToggle.jsx      # Language toggle button
│   └── LanguageDemo.jsx        # Demo component
├── hooks/
│   └── useTranslation.js       # Custom translation hook
└── index.css                   # RTL styles and Arabic font
```

## Translation Keys

The translation system uses dot notation for nested keys:

```javascript
// In translation files
export const en = {
  nav: {
    home: 'Home',
    hotels: 'Hotels'
  },
  hero: {
    title: 'Discover a World of Luxury',
    subtitle: 'Experience unparalleled comfort...'
  }
};

// Usage in components
t('nav.home')        // "Home"
t('hero.title')      // "Discover a World of Luxury"
```

## RTL CSS Classes

The system includes several RTL-specific CSS classes:

- `rtl-flex-row-reverse`: Reverse flex direction
- `rtl-text-right`: Right-aligned text
- `rtl-text-left`: Left-aligned text
- `rtl-ml-auto`: Auto margin left
- `rtl-mr-auto`: Auto margin right
- `font-arabic`: Arabic font family

## Adding New Translations

1. **Add to English file** (`src/translations/en.js`):
```javascript
export const en = {
  // ... existing translations
  newSection: {
    title: 'New Title',
    description: 'New description'
  }
};
```

2. **Add to Arabic file** (`src/translations/ar.js`):
```javascript
export const ar = {
  // ... existing translations
  newSection: {
    title: 'عنوان جديد',
    description: 'وصف جديد'
  }
};
```

3. **Use in component**:
```jsx
const { t } = useTranslation();
return <h1>{t('newSection.title')}</h1>;
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ RTL support for Arabic
- ✅ Font loading for Arabic text

## Performance

- Translations are loaded once and cached
- Language preference is stored in localStorage
- Minimal re-renders when switching languages
- Efficient RTL layout switching

## Accessibility

- Proper `dir` attribute on HTML element
- Screen reader support for both languages
- Keyboard navigation support
- High contrast support

## Future Enhancements

- [ ] Add more languages (French, Spanish, etc.)
- [ ] Dynamic translation loading
- [ ] Translation management system
- [ ] Auto-detection of user's preferred language
- [ ] Pluralization support
- [ ] Date and number formatting per locale 