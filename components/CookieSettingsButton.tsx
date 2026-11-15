'use client';

export default function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('panvibes:cookie-settings'))}>Cookie settings</button>;
}
