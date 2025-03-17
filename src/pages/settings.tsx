import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SettingsPage from './settingsPage';

// This file exists to handle the /settings route and render the SettingsPage component
const Settings = () => {
  return <SettingsPage />;
};

export default Settings;
