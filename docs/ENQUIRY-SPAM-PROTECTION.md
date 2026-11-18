# Enquiry spam protection

The enquiry API rejects a populated hidden `website` field, checks required fields and obvious junk, and permits two valid submission attempts per source IP in a rolling minute. The IP limit is stored in the private SQLite database, so it survives website restarts. Nginx overwrites `X-Real-IP` with the connecting address; the application uses that header for the limit.

Google reCAPTCHA v3 was activated on 18 November 2026 for `panvibes.com` using the two keys supplied by the owner. The site key is public and compiled into the Next.js build. The secret stays only in `/etc/panvibes.env` on the server. Enquiries are rejected if verification fails, the score is below 0.5, the action is not `enquiry_submit`, or the verified hostname differs from the request hostname. A missing secret leaves the other three checks active.

To activate reCAPTCHA v3:

1. Create a **Score based (v3)** key for `panvibes.com` at the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create). Include `www.panvibes.com` if Google asks for subdomains separately.
2. Provide the **site key** and **secret key** through a secure channel. Do not add the secret to GitHub.
3. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` for the production build and `RECAPTCHA_SECRET_KEY` in the private server environment, then rebuild and deploy a new release. Keep the existing enquiry recipient and SMTP sender settings.
4. Verify a real form submission, a missing-token rejection and a low-score rejection. Review scores after real traffic before changing the 0.5 threshold.

The live API rejected a populated trap field, the reported junk-lead pattern, a missing reCAPTCHA token, and a third attempt from one IP. The public site route check passed. A real browser submission with a valid token was not completed because browser automation was unavailable in this session; that is the remaining verification step. These controls cannot prove that every accepted enquiry is legitimate.

## Key rotation — 18 November 2026

The owner supplied a replacement key pair. Google accepted the new secret during a server-side check, and the new public site key was compiled into release `2683a98e24c3049256caa49b7774774f973c3f6e-recaptcha-r2`. The prior public key and both secrets were absent from the new release files. The live API rejected a missing token with HTTP 403; the site route check and service health passed. A genuine browser token and successful enquiry remain to be verified because browser automation was unavailable.
