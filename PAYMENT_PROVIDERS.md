# GameRush Iraq — Payment Provider Setup

These providers are prepared in the `payment_methods` table but intentionally disabled until merchant onboarding and server-side integration are complete. Do not enable them just to display an option to customers.

## FastPay Iraq
- Official web integration: https://www.fast-pay.iq/integrate-web
- Developer portal: https://developer.fast-pay.iq/
- Merchant account required. Obtain the merchant credentials and current API/IPN documentation directly from FastPay.
- Implement payment creation, server-side amount/order validation, provider status validation, and signed/verified IPN handling in a Supabase Edge Function. Never trust the browser redirect alone.

## First Iraqi Bank (FIB)
- Official web-payments docs: https://fib.iq/ar/integrations/web-payments/
- Official gateway overview: https://fib.iq/ar/fib-payment-gateway/
- Register for the sandbox, test create/status/cancel flows, then submit the official integration request for production credentials.
- Keep client secret on the server; create payments and verify status server-side. Use the provider callback to reconcile final status.

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
