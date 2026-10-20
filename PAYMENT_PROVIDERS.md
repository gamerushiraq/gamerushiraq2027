# GameRush Iraq — Payment Provider Setup

Provider options remain disabled until merchant onboarding and production/sandbox credentials are configured and end-to-end tests pass. Do not enable an option just to display it to customers.

## Current implementation status
- `fib-create-payment` and `fib-webhook` Supabase Edge Functions have been deployed. They fail closed while `FIB_CLIENT_ID` and `FIB_CLIENT_SECRET` are absent.
- The GameRush frontend routes `fib` to its own FIB endpoint; it no longer routes FIB through QiCard.
- FIB payment verification re-queries the authenticated FIB payment-status endpoint before marking an order paid; callback body status alone is not trusted.
- The existing QiCard endpoint remains separate. `superqi` must not be mapped to QiCard unless its actual provider integration is implemented.

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
