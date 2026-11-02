# Production preparation

These files describe the deployment configuration; changing them does not deploy services.

Baserow is pinned to 2.4.1. Before upgrading a 1.20.2 installation, stop its writers, keep
a verified cold copy of the complete data directory, and upgrade the embedded PostgreSQL
11 database to 15 on a separate copy. Check table counts and uploaded files before
switching over. See the [Baserow Docker upgrade procedure](https://baserow.io/docs/installation/install-with-docker).

## 2026/2027 database and workflow storage

The production cutover on 2 November 2026 kept database 92 as
`[ARHIVA] FIPU Praksa (25-26)`. Database 208, `FIPU Praksa (26-27)`, uses tables
845–852, including the separate staff table `Djelatnik`. The production connector
uses those table and field IDs. First login creates the profile in the appropriate
table using the verified coordinator allowlist.

The active engine uses PostgreSQL database `bpmn_engine_2026_2027`. Set
`POSTGRES_DB1_NAME=bpmn_engine_2026_2027` when deploying with this Compose example.
Keep `bpmn_engine_db` for the old instances and events. Preserve the production
certificate mount at `/app/potvrde` across image replacements.

The VM keeps the previous Compose file, workflow dumps and certificate backup in
`/home/ntankovic/praksa/rollover-26-27/`. The Baserow data volume contains the
verified database export and uploads in `backups/praksa-before-26-27/`. To roll back
while maintenance is enabled, preserve any new submissions first, restore the
previous connector, engine, PDF image and database selection together, then test
and gracefully reload the edge proxy. Verify the selected database and protected
API routes before allowing writes again.

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

The public email proxy verifies the dashboard user's coordinator access against the
engine before forwarding a request. The engine calls the email service privately.

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

## Test frontend

While university DNS and OAuth configuration are pending, testers can open
[`/privatni-test/`](https://fipu-praksa.unipu.hr/privatni-test/) on the existing HTTPS site.
The preview proxy challenges for a tester password and sets a secure, HTTP-only host
cookie for eight hours. A fresh browser still gets the maintenance build. Tester
access selects a frontend; Google sign-in and backend permissions still apply.
Use a private window on a shared computer.

The VM runs the two frontend containers on its internal network. Only the public
frontend vhost proxies through the preview service. To reproduce the gate, mount
`preview.nginx.conf.template` at `/etc/nginx/templates/default.conf.template` in
the official Nginx image, `preview.html` at `/usr/share/nginx/preview.html`, and
a server-side htpasswd file at `/etc/nginx/preview.htpasswd`. Set
`PRAKSA_PREVIEW_COOKIE` to a random 64-character hex value and
`NGINX_ENVSUBST_FILTER=^PRAKSA_PREVIEW_COOKIE$`. Keep the password verifier and
cookie value outside Git. Rotate both and recreate the preview service to revoke
existing tester sessions. To disable this entry entirely, point the public frontend
vhost back at the maintenance frontend and reload Nginx.

A read-only check for the private entry follows. Curl prompts for the tester
password. A fresh request must see a different frontend from the tester session.

```sh
set -eu
site=https://fipu-praksa.unipu.hr
jar=$(mktemp); trap 'rm -f "$jar"' EXIT
test "$(curl -sS -o /dev/null -w '%{http_code}' "$site/privatni-test/")" = 401
curl -fsS -u tester -c "$jar" "$site/privatni-test/" >/dev/null
public=$(curl -fsS "$site/prijava" | grep -oE '/assets/index\.[a-f0-9]+\.js')
tester=$(curl -fsS -b "$jar" "$site/prijava" | grep -oE '/assets/index\.[a-f0-9]+\.js')
test -n "$public" && test -n "$tester" && test "$public" != "$tester"
```

Push the dashboard revision to the `test` branch to publish the Docker Hub
`:test` image. The test build opens the dashboard during production maintenance.
Google login and the API endpoints are the production ones. Submitting a form
can change live records and send real emails. Links generated by the test
frontend use its own origin. Backend-generated links use the engine's configured
production origin.

Before first activation, point `fipu-praksa-test.unipu.hr` at the existing
production ingress. Provision and renew a TLS certificate under the hostname's
Let's Encrypt lineage used in `nginx.test.conf`. Register
`https://fipu-praksa-test.unipu.hr` as an authorized JavaScript origin on the
dashboard's Google OAuth client and allow the origin in any API CORS allowlist.

On the production Compose host, install the two test configuration files next
to the existing Compose file. Use the same project name and environment as the
running stack. Include both files in subsequent stack administration commands.

```sh
export COMPOSE_FILE=docker-compose.yml:docker-compose.test.yml
docker compose config --quiet
docker compose pull fipu-praksa-test-frontend
docker compose up -d --no-deps fipu-praksa-test-frontend
docker compose run --rm --no-deps nginx nginx -t
docker compose up -d --no-deps nginx
curl -fsS https://fipu-praksa-test.unipu.hr/prijava >/dev/null
```

For later test releases, repeat only the pull and up commands for
`fipu-praksa-test-frontend`. Verify Google sign-in with a designated account.

### BPMN Studio

The production Compose stack builds Studio from the sibling Studio repository and serves it at `https://fipu-praksa.unipu.hr/studio/`. Google Identity Services must allow the dashboard HTTPS origin. The Studio server verifies Google's signature, issuer, client ID, expiry, verified email and Workspace domain. Only `lblaskovi@unipu.hr` can open the editor or use its model API.

Before first startup or migration, create `./studio-models` next to the deployed Compose file and copy the **running engine's** entire `/app/models/.` into it, including any history. Compare the A/B checksums against the running engine before recreating it. Grant the Studio container user (UID 1000) directory write access and the engine read access. An empty bind mount hides the engine's bundled definitions. Preserve and back up this directory across releases. Verify the engine model list and Studio sign-in after rollout.
