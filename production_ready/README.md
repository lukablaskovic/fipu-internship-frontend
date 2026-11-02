# Production preparation

These files describe the deployment configuration; changing them does not deploy services.

## EmailJS configuration

The email image is `lukablaskovic/fp-emailjs-connector-service:latest`, built from `emailjs-connector-service/` by the application-services workflow. The Compose service is `emailjs-connector`, listening on port 8083. Nginx exposes `/api/emailjs-connector/`, matching the dashboard's `VITE_EMAILJS_API_URL` configuration.

Set the following in the deployment's ignored `.env` file:

```dotenv
EMAILJS_CONNECTOR_URL=http://emailjs-connector:8083
EMAILJS_SERVICE_ID=replace-with-service-id
EMAILJS_TEMPLATE_ID=replace-with-template-id
EMAILJS_PUBLIC_KEY=replace-with-public-key
EMAILJS_PRIVATE_KEY=replace-with-private-key
```

Compose maps the four provider values to `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`, and `PRIVATE_KEY`, as expected by the connector. Its EmailJS template receives `message`, `to_email`, and `title`. Remove obsolete provider API-key, sender, per-message-template and port settings. Keep `MAILPIT_URL` unset in production.

Publish the renamed image before rollout. Deploy the dashboard, Nginx configuration, connector service, engine configuration, and authoritative A/B models together, then restart the engine. The models now use connector ID `emailjs`; task IDs, forms, payloads, and event IDs are unchanged. Existing in-memory instances retain their parsed connector URLs until restart. Older exported models or browser drafts need their email connector changed to `emailjs` before reuse.

Validate with `docker compose config --quiet` after supplying the complete deployment environment. This checks configuration only, not image availability, provider credentials, or live delivery.

## Engine and Baserow access control

Roll out the dashboard, engine and Baserow connector together while maintenance is on. The two APIs are served directly by Nginx. On 2026-11-02 an unauthenticated status-only production probe returned 200 for the engine model index and connector health endpoint, 404 for a nonexistent instance and 400 for a nonexistent table. This establishes there was no blanket edge login on these paths; it does not establish the contents of any private record.

- Supply the same randomly generated secret (at least 32 characters; e.g. generate with `openssl rand -hex 32`) as `WORKFLOW_SERVICE_TOKEN` to the engine and Baserow connector. Inject it through the deployment environment or a separate Compose substitution file; the existing service `env_file: .env` is shared with other containers. Never put it in Vite, BPMN variables or browser storage. Rotating it invalidates outstanding evaluation links and process-link receipts.
- Set `COORDINATOR_EMAILS` to the approved comma-separated institutional email addresses. Both the API and the dashboard use the role returned by the connector. The connector checks Google signatures, audience, issuer, expiry, verified email and university hosted domain. `GOOGLE_CLIENT_ID` must match the dashboard's Google client (the existing ID is the default). To retain a previously authorized personal Gmail account, explicitly configure its exact address in `EXTRA_STUDENT_EMAILS`. This exception grants student access only. See [Google ID token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
- Set `BASEROW_CONNECTOR_URL` to the private connector service (e.g. `http://baserow-connector:8082`) and `FRONTEND_URL` to the public HTTPS dashboard origin. The public Nginx routes strip demo headers and the connector's workflow credential. Keep `ALLOW_LOCAL_DEMO=false`. Use `GET /status` on either service for readiness.
- Check existing Student email and process links against enrollment records before rollout: old records predate enforcement. A legacy instance must have a unique current student link for initial access. Unlinked historical instances require coordinator review; the system never grants access based on a form's email or JMBAG. New attempts checkpoint the authenticated owner, and a signed receipt binds the student row to the new instance, model and predecessor.
- Ask users to sign in again. For pending employer evaluations resend the email from the coordinator dashboard: old UUID-only links are no longer credentials. New links are valid for one allocation for up to 14 days and stop working once that evaluation closes. The credential is carried in the URL fragment and sent only to the scoped evaluation endpoint.

After deploying, check that anonymous requests to `/api/python-bpmn-engine/model` and `/api/baserow-connector/api/Student` both return 401. Use designated test accounts to verify student isolation, coordinator actions and a newly issued evaluation link before ending maintenance. This change covers these two APIs; direct PDF/file URLs, the email service and the separate gateway require their own access review.
