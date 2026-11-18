# Enquiry spam protection

The enquiry API rejects a populated hidden `website` field, checks required fields and obvious junk, and permits two valid submission attempts per source IP in a rolling minute. The IP limit is stored in the private SQLite database, so it survives website restarts. Nginx overwrites `X-Real-IP` with the connecting address; the application uses that header for the limit.

Google reCAPTCHA v3 is wired into the form but activates only after both keys are installed. The site key is public and compiled into the Next.js build. The secret stays only in `/etc/panvibes.env` on the server. Enquiries are rejected if verification fails, the score is below 0.5, the action is not `enquiry_submit`, or the verified hostname differs from the request hostname. A missing secret leaves the other three checks active.

To activate reCAPTCHA v3:

1. Create a **Score based (v3)** key for `panvibes.com` at the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create). Include `www.panvibes.com` if Google asks for subdomains separately.
2. Provide the **site key** and **secret key** through a secure channel. Do not add the secret to GitHub.
3. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` for the production build and `RECAPTCHA_SECRET_KEY` in the private server environment, then rebuild and deploy a new release. Keep the existing enquiry recipient and SMTP sender settings.
4. Verify a real form submission, a missing-token rejection and a low-score rejection. Review scores after real traffic before changing the 0.5 threshold.

The hidden field and rate limit protect the form while the keys are pending. They cannot prove that every accepted enquiry is legitimate.
