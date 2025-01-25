import { useEffect, useState } from 'react'
import './App.css';
import { storeManager } from './utils/chromeAPI';
import { defaultJSLiveTemplate, defaultWSPTemplate, defaultJSONTemplate } from './utils/templates';
import Menu from './components/Menu';
import WSProxy from './components/WSProxy/WSProxy';
import WSClient from './components/WSClient/WSClient';
import WSAbout from './components/WSAbout/WSAbout';

function App() {
  const [settings, setSettings] = useState({
    defaultScreen: 'WSProxy',
    defaultJSLiveTemplate,
    defaultJSONTemplate,
    defaultWSPTemplate
  });

  const [activeMenuItem, setActiveMenuItem] = useState(settings.defaultScreen);
  const handleMenuSelection = (item) => {
    setActiveMenuItem(item);
    setSettings({ ...settings, defaultScreen: item });
  }

  useEffect(() => {
    storeManager.get('settings', (storedValue) => {
      if (storedValue) {
        setSettings({ ...settings, ...storedValue });
        setActiveMenuItem(storedValue.defaultScreen)
      }
    });

    return () => {
      storeManager.set('settings', settings);
    };
  }, []);

  useEffect(() => {
    if (settings) {
      if (Object.keys(settings).length > 0) {
        storeManager.set('settings', settings);
      }
    }
  }, [settings]);

  return (
    <>
      <Menu
        onSelect={handleMenuSelection}
        active={activeMenuItem} />
      {/* Decided to manage components by hiding them, not re rendering. Until I learn how to manage it by saving states correctly */}
      {/* {activeMenuItem === 'WSProxy' && <WSProxy settings={settings} setSettings={setSettings} />} */}
      {/* {activeMenuItem === 'WSClient' && <WSClient defaultJSONTemplate={settings.defaultJSONTemplate} setSettings={setSettings} />} */}
      <WSProxy
        defaultWSPTemplate={settings.defaultWSPTemplate}
        setSettings={setSettings}
        className={activeMenuItem !== 'WSProxy' ? 'hidden' : 'default'}
      />
      <WSClient
        defaultJSONTemplate={settings.defaultJSONTemplate}
        setSettings={setSettings}
        className={activeMenuItem !== 'WSClient' ? 'hidden' : 'default'} />
      <WSAbout className={activeMenuItem !== 'WSAbout' ? 'hidden' : 'default'} />
    </>
  )
}

export default App