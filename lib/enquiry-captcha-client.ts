type Recaptcha = {
  ready(callback: () => void): void;
  execute(key: string, options: { action: string }): Promise<string>;
};

type WaitOptions = { primaryWaitMs?: number; fallbackWaitMs?: number; executeWaitMs?: number };

function availableCaptcha(): Recaptcha | null {
  const captcha = (window as Window & { grecaptcha?: Partial<Recaptcha> }).grecaptcha;
  return captcha && typeof captcha.ready === 'function' && typeof captcha.execute === 'function'
    ? captcha as Recaptcha : null;
}

async function waitForCaptcha(timeoutMs: number): Promise<Recaptcha | null> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const captcha = availableCaptcha();
    if (captcha) return captcha;
    await new Promise(resolve => setTimeout(resolve, Math.min(100, Math.max(1, deadline - Date.now()))));
  }
  return availableCaptcha();
}

function loadAlternateHost(siteKey: string) {
  if (document.getElementById('recaptcha-net-fallback')) return;
  const script = document.createElement('script');
  script.id = 'recaptcha-net-fallback';
  script.async = true;
  script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
  document.head.appendChild(script);
}

export async function getEnquiryCaptchaToken(siteKey: string, options: WaitOptions = {}): Promise<string> {
  let captcha = await waitForCaptcha(options.primaryWaitMs ?? 5000);
  if (!captcha) {
    loadAlternateHost(siteKey);
    captcha = await waitForCaptcha(options.fallbackWaitMs ?? 7000);
  }
  if (!captcha) throw new Error('Spam check could not load. Please allow reCAPTCHA in your browser and try again.');

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      new Promise<string>((resolve, reject) => {
        try {
          captcha.ready(() => {
            try { Promise.resolve(captcha.execute(siteKey, { action: 'enquiry_submit' })).then(resolve, reject); }
            catch (error) { reject(error); }
          });
        } catch (error) { reject(error); }
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Spam check timed out. Please try again.')), options.executeWaitMs ?? 10000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
