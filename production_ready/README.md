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
