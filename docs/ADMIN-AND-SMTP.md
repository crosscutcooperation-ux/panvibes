# Enquiry email and administrator setup

The website saves enquiries to SQLite before attempting Google SMTP delivery. SMTP notifications go from `SMTP_FROM` to `ENQUIRY_RECIPIENT`, with the buyer's email in Reply-To. Delivery status is saved separately. Duplicate request IDs reuse the saved enquiry and do not send a second successful notification. Failed messages remain available in `/admin` with a retry action.

Open `/admin` directly; it is deliberately absent from public navigation and the sitemap. Login uses a salted scrypt password hash and server-side sessions. Session cookies are HttpOnly and SameSite Strict, with Secure enabled away from localhost. Sessions expire after eight hours. Reset codes go only to `ADMIN_RESET_EMAIL`, expire after ten minutes, allow five attempts, and are single use. Resetting the password invalidates all sessions. Login and code requests have rate limits.

Required server-only environment variables:

- `SQLITE_PATH`: persistent writable file location; default `./data/panvibes.sqlite`.
- `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.
- `SMTP_USER`, `SMTP_PASSWORD`: the Google Workspace mailbox and its app password.
- `SMTP_FROM`: the authorized sending mailbox.
- `ENQUIRY_RECIPIENT`: the internal sales recipient.
- `ADMIN_USERNAME`, `ADMIN_INITIAL_PASSWORD_HASH`, `ADMIN_RESET_EMAIL`.

The initial password hash format is `salt:scryptHex`, with a random 16-byte hexadecimal salt and 64-byte scrypt output. The environment hash bootstraps the account only once; password resets update SQLite and persist across restarts. Keep the database and environment files private. Credentials are configured in the local ignored `.env.local`; a production host must receive these variables through its environment settings. A persistent Node.js server and writable persistent disk are required for this SQLite setup.

Do not expose `SMTP_PASSWORD`, administrator hashes or mailbox settings through `NEXT_PUBLIC_` variables. The CSV endpoint requires a valid administrator session, exports all saved enquiry form fields, and neutralizes spreadsheet formula cells.

Verification: `node scripts/check-admin-smtp.mjs` starts a separate preview and a local SMTP capture server with a disposable SQLite database. It tests delivery routing, duplicate suppression, failed email retention and retry, authentication, CSV data and formula protection, password reset delivery and expiry behavior, session revocation, persistence and mobile layouts. Test messages stay inside the capture server. Set `PLAYWRIGHT_MODULE` when the browser runtime is outside the project.

Run `node scripts/verify-smtp.mjs` to verify Google SMTP authentication without sending mail. Add `--send-test` only when you want one internal setup message sent to the configured recipient.

The PDF update script is `scripts/update-download-pdfs.py`. It preserves original source pages from Git commit `d4a3eaa`, rebuilds product pages from the live catalogue JSON, replaces the brochure cover photograph, and projects the transparent brand onto the long container wall in both closing photographs. It requires PyMuPDF, Pillow, NumPy and ReportLab. Final downloads retain their stable URLs under `public/documents/`.
