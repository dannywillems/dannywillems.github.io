---
layout: post
title: "A history of web authentication: methods, trade-offs, and practice"
date: 2026-07-14 00:00:00 +0000
author: Danny Willems
tags: [security, web, authentication, sessions, history, engineering]
---

Web applications have spent thirty years answering one question: who is this
caller, and how do we keep knowing across requests. HTTP forgets between
requests, so every method here is a way to re-establish an identity the protocol
itself throws away. The arc is a steady effort to send the password fewer times,
store it in fewer places, prove identity with something harder to steal, and add
accountability at each step. This post walks that history, from HTTP Basic to
passkeys, and states where practice stands today.

<!--more-->

This article was written with the help of an AI assistant, working from my own
notes and the primary sources linked at the end. Mentioning it is not a novelty
claim; it is that "AI helped write it" does not exempt the claims below from the
usual scrutiny. Every non-trivial statement is cited. If something looks wrong,
check the references.

## HTTP has no memory: the core problem

HTTP is stateless: each request is independent and carries no memory of the last
one. That is excellent for caching and scale, but it means an application has no
built-in way to know that the request asking to "delete my account" comes from
the same person who logged in a moment ago. Every mechanism in this post is a
way to re-establish, on each request, an identity that the protocol forgets.

Two sub-problems fall out of this, and it is worth separating them because they
have different histories and different failure modes:

- Authentication: proving who the caller is (the login event).
- Session management: carrying that proof across the many stateless requests
  that follow, without re-proving it every time.

The OWASP Session Management Cheat Sheet defines session management as "the
process by which a server maintains the state of an entity interacting with it."
Most real-world "authentication" bugs are in fact session-management bugs: the
login was fine, but the token that represented it was guessable, stealable, or
never expired.

## 1996: HTTP Basic and Digest

The first standardized answer was built into the protocol. HTTP Basic
authentication was specified alongside HTTP/1.0 in RFC 1945 (1996) and later
given its own document, RFC 7617 (September 2015). The scheme is minimal: the
client sends `Authorization: Basic <base64(username:password)>` on every
request. base64 is an encoding, not encryption, so Basic sends the password, in
recoverable form, on every single request. Over plain HTTP that is a cleartext
credential on the wire; even over TLS it means the password is transmitted
constantly rather than once.

HTTP Digest authentication (RFC 2069 in 1997, revised by RFC 2617 in 1999, and
finally RFC 7616 in 2015) tried to fix the cleartext problem without requiring
TLS. Instead of sending the password, the client sends a hash (historically MD5)
of the password combined with a server nonce. The password never crosses the
wire directly, and the nonce defends against simple replay. But Digest forces
the server to store the password in a reversible or hash-equivalent form (which
defeats modern password hashing), its MD5 core is weak, and it never handled the
login UX that applications wanted.

Both schemes share the property that pushed the industry away from them: the
browser, not the application, owns the credential prompt and the "session."
There is no application-controlled logout, no branded login form, no "remember
me," and nowhere to run logic like lockout or MFA. Basic and Digest survive
today mostly for machine-to-machine APIs behind TLS, not for user-facing login.
My rule of thumb: never use them for human login, and if Basic is used for an
API, it is over TLS only and the server still stores the credential with a real
password hash, which Digest by design cannot do.

## 1994 onward: cookies and server-side sessions

The mechanism that actually let applications own login was the cookie. Lou
Montulli, an engineer at Netscape, introduced the idea in June 1994, and cookie
support shipped in Mosaic Netscape 0.9beta on 13 October 1994. Cookies were
standardized much later: RFC 2109 (1997), then RFC 2965, and the version in use
today, RFC 6265 (April 2011).

The pattern that emerged is the server-side session:

1. The user submits a login form once, over TLS.
2. The server verifies the password, creates a random, opaque session
   identifier, stores the real session state server-side keyed by that id, and
   returns the id in a `Set-Cookie` header.
3. The browser attaches the cookie automatically on every subsequent same-origin
   request, and the server looks up the state.

This solved everything Basic and Digest could not: the password is sent once,
the application controls the login page and logout, and arbitrary logic
(lockout, MFA, roles) runs at the login event. It became, and remains, the
default for server-rendered web applications.

Its security reduces to two things: the id must be unguessable, and the cookie
must be handled carefully. OWASP requires a session id with at least 64 bits of
entropy; with that entropy, 10,000 guesses per second against 100,000 live
sessions still takes on the order of 585 years to hit one. The cookie hygiene
rules (`Secure`, `HttpOnly`, `SameSite`, the `__Host-` prefix, regeneration on
login) are covered near the end.

A variant is worth calling out, because it changes the threat model: the signed
client-side session. Some frameworks (Ruby on Rails `CookieStore`, the Go Revel
framework, and many "JWT in a cookie" designs) keep no state on the server. They
serialize the session data into the cookie and authenticate it with an HMAC
signature using an application secret. The benefit is no session store. The
costs are significant and often missed in review: the signing secret becomes a
total compromise target, since anyone with it can forge any session including an
admin one, and there is no natural server-side revocation, so "log out
everywhere" and "invalidate sessions on password reset" must be built by hand,
often crudely (for example a global version counter that invalidates every
session at once). In my view a committed signing secret is the single worst
finding you can have in such an app: it is a skeleton key to every account, and
the only fix is to rotate it, which logs everyone out.

## The password itself: from plaintext to memory-hard hashing

Independent of how the session is carried, there is the question of how the
password is stored. This has its own history of escalating defenses, each driven
by a large breach.

- Plaintext: the original sin. One database read hands the attacker every
  credential, and users reuse passwords across sites.
- Unsalted fast hash (MD5, SHA-1): stores `H(password)`. Broken by precomputed
  rainbow tables and, because the hash is fast, by billions of GPU guesses per
  second.
- Salted fast hash: a unique random salt per password defeats rainbow tables but
  not GPU brute force, because the hash is still fast. OWASP is explicit that
  fast algorithms such as SHA-256 are unsuitable for password storage.
- Deliberately slow, memory-hard key derivation: the current answer. Slow makes
  each guess expensive; memory-hard makes GPU and ASIC parallelism expensive
  too.

Current OWASP recommended parameters (from the 2024/2025 rewrite of the Password
Storage Cheat Sheet):

- Preferred: Argon2id, with a minimum of 19 MiB of memory, 2 iterations, and
  parallelism 1; a stronger common profile is roughly 46 to 64 MiB, 1 to 3
  iterations, parallelism 1, tuned to a few hundred milliseconds on production
  hardware.
- Acceptable: scrypt; bcrypt with a work factor of 10 or more (noting bcrypt's
  72-byte input limit); or PBKDF2 with a high iteration count and HMAC-SHA-256
  in FIPS-constrained environments.

The policy around passwords changed as much as the storage. NIST Special
Publication 800-63B, whose current revision 800-63B-4 was finalized on 31 July
2025, reversed decades of counterproductive advice. It requires a minimum length
of 8 characters and support for at least 64, forbids mandatory composition rules
("must contain a symbol"), forbids forced periodic rotation, requires that paste
be allowed so password managers work, and requires screening candidate passwords
against lists of known-breached values. The shift is from "make the human
perform complexity rituals" to "make length easy, screen for known-bad, and
store it properly."

Two notes for practitioners. On bcrypt versus Argon2id: bcrypt is battle-tested
and fine at a sufficient work factor, but it caps input at 72 bytes and is not
memory-hard, whereas Argon2id's memory-hardness resists the GPU and ASIC
cracking that bcrypt does not, which is why it is the current default
recommendation. And comparison must be constant-time: use the library's own
verify (`bcrypt.CompareHashAndPassword`, `password_verify`,
`hmac.compare_digest`); a hand-rolled `==` on a hash or token is a timing
oracle.

## 2005 onward: federation and delegated auth

Cookies and sessions answer "how do I log a user into my application." A second
question arose as the web grew: how does a user log into many applications
without a separate password for each, and how does application A get permission
to act on a user's data held by application B, without A ever seeing B's
password.

- SAML (Security Assertion Markup Language), with SAML 2.0 standardized by OASIS
  in 2005, addressed enterprise single sign-on. An identity provider issues a
  signed XML assertion ("this is Alice, authenticated at 10:00") that a service
  provider trusts. It still dominates corporate SSO.
- OpenID (2005 onward) was an early attempt at decentralized consumer login;
  largely superseded by the OAuth-based stack below.
- OAuth 2.0, standardized as RFC 6749 in October 2012, solved delegated
  authorization: it lets a user grant application A limited, scoped access to
  their data at provider B by way of access tokens, without sharing a password.
  OAuth is often misused as if it were a login protocol; it is an authorization
  framework.
- OpenID Connect (OIDC, 2014) is the thin identity layer on top of OAuth 2.0
  that adds a standard, verifiable ID token describing the authenticated user.
  "Sign in with Google/Apple/Microsoft" is OIDC.

The recurring pitfalls here are specific and well-catalogued: public clients
(SPAs, mobile) must use PKCE to prevent authorization-code interception;
`redirect_uri` values must be matched exactly against an allowlist, never by
prefix or wildcard; the `state` parameter must be present and verified to
prevent callback CSRF; and the deprecated implicit flow (token in the URL
fragment) leaks tokens and should not be used.

## 2015: stateless tokens and JWT

As applications split into single-page front ends talking to APIs, and into many
small services, the server-side session store became an awkward shared
dependency. The response was the self-contained token: put the identity claims
into the token itself, sign them, and let any service verify the signature
without a central lookup.

The JSON Web Token (JWT), RFC 7519 (May 2015), is the dominant format. A JWT is
three base64url parts (header, payload, signature). The server signs the header
and payload; a verifier checks the signature and reads the claims (subject,
expiry, audience, issuer). Because verification needs only the key, JWTs scale
horizontally without a session database.

The trade-offs are real and are a steady source of vulnerabilities:

- A JWT is signed, not encrypted. The payload is readable by anyone; never put
  secrets in it.
- Revocation is hard. A valid, unexpired token cannot be un-issued without
  adding back the server-side state JWTs were meant to avoid (a denylist). The
  mitigation is short lifetimes plus refresh tokens.
- Implementation bugs cluster around the algorithm field. The `alg: none` attack
  strips the signature and asks the server to trust an unsigned token. The
  RS256-to-HS256 algorithm-confusion attack exploits libraries that verify with
  an algorithm-agnostic call: an attacker changes the header to HS256 and signs
  with the server's RSA public key (often exposed at `/.well-known/jwks.json`)
  used as the HMAC secret. Both are defeated by pinning an explicit algorithm
  allowlist on every verification call. New JWT-library CVEs in this class
  appear essentially every year, so the specific library version must be checked
  against advisories, not just the calling code.

The practical guidance that emerged, and the one I follow: prefer opaque
server-side sessions for first-party web apps where you control both ends and
want easy revocation; reach for JWTs when statelessness across services
genuinely pays for its costs, and then validate the algorithm, signature, and
every claim.

## Second factors: OTP, TOTP, and push

Passwords are a single factor (something you know) and are phishable and
reusable. Multi-factor authentication adds something you have or something you
are. The mechanisms arrived roughly in this order:

- HOTP (HMAC-based One-Time Password), RFC 4226 (2005): a counter-based one-time
  code.
- TOTP (Time-based One-Time Password), RFC 6238 (2011): the code is derived from
  a shared secret and the current time in 30-second steps. This is what
  authenticator apps implement, and what most "2FA app" support means.
- SMS OTP: a code texted to the user. Widely deployed for its reach, but
  phishable in real time and defeated by SIM-swapping; NIST restricts its use as
  a factor, and it should not be the only second factor.
- Push-based approval: the service pushes a prompt to a trusted device. Better
  UX than typing codes, but vulnerable to "MFA fatigue" (spamming approvals
  until a tired user accepts) unless number-matching is used.

The important points for implementation: MFA must be enforced on every login
path (not just the web UI while the API skips it), verified server-side (a
client "mfa_passed" flag is not verification), rate-limited (a 6-digit code is
only 10^6 possibilities; NIST caps online guessing at 100 attempts), and free of
information leaks (a distinct "wrong OTP" error confirms the password was
correct). None of TOTP, SMS, or push is phishing-resistant, however: a
convincing proxy phishing page can relay the code in real time. That limitation
is what motivated the next generation.

## 2018 to 2019: WebAuthn, FIDO2, and passkeys

The current frontier removes the shared secret entirely and makes the credential
phishing-resistant by binding it to the origin. This is the FIDO2 stack.

WebAuthn (the Web Authentication API) is the browser-facing standard, developed
by the W3C with the FIDO Alliance. WebAuthn Level 1 became a W3C Recommendation
on 4 March 2019, and Level 2 followed on 8 April 2021. FIDO2, the umbrella
program combining WebAuthn with the CTAP protocol to hardware authenticators,
launched across Chrome, Edge, and Firefox in 2018, with Safari and iOS adopting
it by 2020.

The mechanism is public-key cryptography. On registration, the authenticator (a
security key, or the phone or laptop's secure enclave) generates a key pair
bound to the site's origin, keeps the private key on the device, and gives the
server the public key. On login, the server sends a random challenge; the
authenticator signs it with the private key; the server verifies with the stored
public key. Because the signature is bound to the real origin, a phishing site
at a different origin cannot obtain a usable signature, and because the private
key never leaves the device, there is no shared secret in a database to steal.
That is why WebAuthn is phishing-resistant in a way OTP is not.

Passkeys, a term that gained currency in 2022, are the consumer-friendly
packaging: FIDO credentials that live on and sync across a user's devices via
the platform's cloud keychain, rather than requiring a separate hardware key. In
2023 the FIDO Alliance broadened "passkey" to mean any FIDO credential.

Two caveats from a reviewer's seat: the relying-party server must actually
verify the signature, the freshness and single use of the challenge, the origin,
and the RP ID (a "passkey" feature with no server-side verification is
decorative), and a weaker fallback (password-only, or SMS OTP) left enabled
quietly reintroduces the phishing exposure the passkey was meant to remove.

## Cross-cutting defenses: CSRF, transport, and session hygiene

Independent of the primary method, three defenses recur because they address the
consequences of ambient, automatically-sent credentials (chiefly cookies).

Cross-Site Request Forgery. Because the browser attaches the session cookie to
any request to your origin, including one triggered by a malicious third-party
page, an attacker can cause state-changing requests to ride the victim's
session. The layered defenses, per the OWASP CSRF Prevention Cheat Sheet, are:
an unpredictable per-session anti-CSRF token (the synchronizer pattern, or the
signed double-submit variant); the `SameSite=Lax` or `Strict` cookie attribute,
which browsers now default to Lax; validating the `Origin` or `Sec-Fetch-Site`
header on state-changing endpoints; and requiring something an attacker's page
cannot send (a custom header, which triggers a CORS preflight, or bearer-token
auth, which the browser does not attach automatically). Two common
misconceptions worth stating plainly: CORS is not a CSRF defense (the
same-origin policy blocks reading the response, not sending the request), and a
CSRF token does not survive XSS (an attacker running script on your origin reads
the token straight out of the DOM).

Transport. Every credential and session token must travel only over TLS, with
HTTP redirected to HTTPS and HSTS set so the first request cannot be downgraded.
The session cookie must carry `Secure` (HTTPS only) and `HttpOnly` (not readable
by JavaScript, so XSS cannot steal it), and ideally the `__Host-` name prefix,
which forces `Secure`, `Path=/`, and no `Domain`.

Session lifecycle. The id must be regenerated on login and on any privilege
change, to defeat session fixation. Sessions need both an idle timeout (commonly
15 to 30 minutes, tighter for high-value apps) and an absolute timeout (commonly
4 to 8 hours), enforced server-side. Logout must terminate the session
server-side, not merely clear the client cookie; and a password reset must
invalidate existing sessions, or an attacker who already had access keeps it.

## Where practice stands today

The recommended baseline for a new web application, drawn from the sources
throughout this post:

- Store passwords with Argon2id (or bcrypt at work factor 10 or more), unique
  salt, constant-time verify; screen new passwords against breach lists; follow
  NIST 800-63B-4 policy (length over complexity, no forced rotation, allow
  paste).
- For a first-party web app, use opaque, high-entropy server-side sessions in a
  cookie marked `Secure`, `HttpOnly`, `SameSite=Lax`, ideally `__Host-`
  prefixed; regenerate on login; enforce idle and absolute timeouts and real
  server-side logout. Reach for JWTs only when cross-service statelessness
  justifies the revocation and algorithm-handling costs.
- Layer CSRF defenses (token plus SameSite plus origin check) on cookie-based
  state-changing endpoints.
- Offer MFA, verified server-side and rate-limited, on every login path; move
  toward phishing-resistant WebAuthn/passkeys as the strong factor, and do not
  let a weak fallback undo it.
- For third-party login and delegated access, use OAuth 2.0 and OIDC correctly:
  PKCE for public clients, exact `redirect_uri` allowlisting, verified `state`,
  and full validation of every token.

The direction of travel is clear: away from shared secrets sent repeatedly, and
toward origin-bound public-key credentials that cannot be phished or replayed.
Passwords are not gone, but the recommended role for them is shrinking to a
fallback behind a passkey, stored and screened well, and never trusted alone for
anything valuable.

## Sources

Standards and specifications:

- RFC 1945, Hypertext Transfer Protocol -- HTTP/1.0 (1996):
  [rfc-editor.org/rfc/rfc1945](https://www.rfc-editor.org/rfc/rfc1945)
- RFC 7617, The 'Basic' HTTP Authentication Scheme (2015):
  [rfc-editor.org/rfc/rfc7617](https://www.rfc-editor.org/rfc/rfc7617)
- RFC 7616, HTTP Digest Access Authentication (2015):
  [rfc-editor.org/rfc/rfc7616.html](https://www.rfc-editor.org/rfc/rfc7616.html)
- RFC 6265, HTTP State Management Mechanism (2011):
  [rfc-editor.org/rfc/rfc6265.html](https://www.rfc-editor.org/rfc/rfc6265.html)
- RFC 6749, The OAuth 2.0 Authorization Framework (2012):
  [rfc-editor.org/rfc/rfc6749.html](https://www.rfc-editor.org/rfc/rfc6749.html)
- RFC 7519, JSON Web Token (2015):
  [rfc-editor.org/rfc/rfc7519.html](https://www.rfc-editor.org/rfc/rfc7519.html)
- RFC 4226, HOTP (2005):
  [rfc-editor.org/rfc/rfc4226](https://www.rfc-editor.org/rfc/rfc4226)
- RFC 6238, TOTP (2011):
  [rfc-editor.org/rfc/rfc6238](https://www.rfc-editor.org/rfc/rfc6238)
- W3C, Web Authentication (WebAuthn) Level 2:
  [w3.org/TR/webauthn-2](https://www.w3.org/TR/webauthn-2/)
- NIST SP 800-63B-4, Digital Identity Guidelines (final, 31 July 2025):
  [pages.nist.gov/800-63-4/sp800-63b.html](https://pages.nist.gov/800-63-4/sp800-63b.html)

OWASP guidance:

- Web Security Testing Guide (WSTG):
  [owasp.org/www-project-web-security-testing-guide](https://owasp.org/www-project-web-security-testing-guide/latest/)
- Authentication Cheat Sheet:
  [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- Session Management Cheat Sheet:
  [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- Password Storage Cheat Sheet:
  [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- CSRF Prevention Cheat Sheet:
  [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

History and analysis:

- Wikipedia, "HTTP cookie":
  [en.wikipedia.org/wiki/HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
- History of Information, "Louis Montulli II Invents the HTTP Cookie":
  [historyofinformation.com](https://www.historyofinformation.com/detail.php?id=2102)
- Wikipedia, "WebAuthn":
  [en.wikipedia.org/wiki/WebAuthn](https://en.wikipedia.org/wiki/WebAuthn)
- FIDO Alliance, "W3C and FIDO Alliance Finalize Web Standard for Passwordless
  Logins":
  [fidoalliance.org](https://fidoalliance.org/w3c-and-fido-alliance-finalize-web-standard-for-secure-passwordless-logins/)
- PortSwigger Web Security Academy, "JWT attacks":
  [portswigger.net/web-security/jwt](https://portswigger.net/web-security/jwt)
