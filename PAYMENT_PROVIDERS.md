# GameRush Iraq — Payment Provider Setup

Provider options remain disabled until merchant onboarding and production/sandbox credentials are configured and end-to-end tests pass. Do not enable an option just to display it to customers.

## Current implementation status
- `fib-create-payment` and `fib-webhook` Supabase Edge Functions have been deployed. They fail closed while `FIB_CLIENT_ID` and `FIB_CLIENT_SECRET` are absent.
- The GameRush frontend routes `fib` to its own FIB endpoint; it no longer routes FIB through QiCard.
- FIB payment verification re-queries the authenticated FIB payment-status endpoint before marking an order paid; callback body status alone is not trusted.
- The existing QiCard endpoint remains separate. `superqi` must not be mapped to QiCard unless its actual provider integration is implemented.

## ZainCash wallet gateway
- Official integration docs: https://docs.zaincash.iq/
- The v2 gateway supports wallet payments through a hosted redirect flow and requires merchant onboarding credentials: `ZAINCASH_CLIENT_ID`, `ZAINCASH_CLIENT_SECRET`, and the separate API key used to verify signed JWT callbacks.
- Test base: `https://pg-api-uat.zaincash.iq`; production base is provided during onboarding.
- Use `POST /oauth2/token`, then `POST /api/v2/payment-gateway/transaction/init`; always verify callback signatures and confirm final status through the transaction inquiry endpoint before marking orders paid.
- Register a separate production webhook URL with ZainCash. UAT webhooks are not supported according to their docs.
- Existing `zain_cash` is a manual-transfer option. Do not replace it with the gateway or enable an online method until credentials and end-to-end tests are complete.

## SuperQi through QiCard
- Official developer docs: https://developers-gate.qi.iq/docs/getting-started/payment-gateway-intro
- The checkout route is prepared to send `superqi` to the existing QiCard payment function and to record the selected method separately from the provider (`qicard`).
- This remains disabled until QiCard confirms the merchant account supports SuperQi, credentials are configured, and hosted checkout plus webhook/status verification pass end to end.

## Mobile carrier billing (Zain Iraq / Asiacell)
- Direct Carrier Billing (DCB) is separate from ZainCash wallet payments and QiCard/SuperQi.
- Zain Iraq and Asiacell must approve GameRush Iraq as a digital-content merchant/partner and provide the official API/aggregator contract, service identifiers, pricing/commission terms, and test credentials.
- Do not simulate a carrier-billing payment or mark an order paid based on a phone number alone. Keep these options out of checkout until the operator or approved aggregator confirms onboarding and provides integration docs.

## FastPay Iraq
- Official web integration: https://www.fast-pay.iq/integrate-web
- Developer portal: https://developer.fast-pay.iq/
- Merchant account required. Obtain the merchant credentials and current API/IPN documentation directly from FastPay.
- Implement payment creation, server-side amount/order validation, provider status validation, and signed/verified IPN handling in a Supabase Edge Function. Never trust the browser redirect alone.

## First Iraqi Bank (FIB)
- Official web-payments docs: https://fib.iq/ar/integrations/web-payments/
- Official gateway overview: https://fib.iq/ar/fib-payment-gateway/
- Register for the sandbox, test create/status/cancel flows, then submit the official integration request for production credentials.
- Configure Edge Function secrets: `FIB_CLIENT_ID`, `FIB_CLIENT_SECRET`; optionally `FIB_API_BASE`, `FIB_AUTH_URL`, and `FIB_CALLBACK_URL`. Sandbox defaults are used unless production endpoints are explicitly configured.
- Keep the client secret server-side. The deployed create function creates an IQD payment and redirects to the FIB Business/Corporate app link. The callback re-checks status with FIB before changing the order.

## NassWallet / NASS E-Payment
- Merchant partnership: https://www.nw.iq/become-partner
- Payment solutions: https://nass.iq/
- Complete merchant onboarding and obtain the current official API documentation and credentials before implementing production calls.

## Go-live checklist
1. Merchant onboarding accepted and production credentials issued.
2. Store secrets only in Supabase Edge Function secrets, never in browser code or Git.
3. Implement a dedicated server-side adapter and webhook/IPN validation for each provider.
4. Verify the order, exact amount (IQD), currency, provider transaction ID, and final paid status server-side; make callbacks idempotent.
5. Test success, failure, cancellation, duplicate callbacks, expired sessions, and incorrect amounts in sandbox.
6. Only then set the matching `payment_methods.active = true` and add real customer instructions if the method uses manual transfer.
