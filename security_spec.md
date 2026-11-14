# Security Specification & Red-Team TDD Matrix

## 1. Data Invariants
1. **Default Deny Catch-All**: Every path not explicitly matched under `/databases/{database}/documents` is denied for both read and write (`allow read, write: if false;`).
2. **Email Spoofing Guard**: Every authenticated or admin rule strictly enforces `request.auth.token.email_verified == true`.
3. **PII Isolation**: Emails, phone numbers, and member profile records live exclusively in `/members/{memberId}` and `/admin_vault/{docId}` — readable ONLY by `isAdmin()` or `existing().ownerUid == request.auth.uid`.
4. **Public Directory Zero-PII**: `/public_directory/state` contains ONLY non-PII referral labels, `deletedMemberIds` tombstones, and salted one-way SHA-256 hex password digests (`allow get` only; `allow list: if false;`).
5. **Privilege Escalation Prevention**: Non-admin users creating a `/members/{memberId}` document can ONLY create `membershipState == 'FREE_MEMBER'`, `kycStatus == 'UNVERIFIED'`, and `ownerUid == request.auth.uid`. They can NEVER self-upgrade to `ACTIVE_LIFETIME_MEMBER` or `VERIFIED`.
6. **Temporal Integrity & Immutability**: `createdAt` and `updatedAt` are strictly checked against `request.time`. `createdAt` and `ownerUid` are immutable on updates.

## 2. "Dirty Dozen" Adversarial Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated Write to Public Directory**: Write to `/public_directory/state` when `request.auth == null`.
2. **Non-Admin Write to Public Directory**: Authenticated regular user writes to `/public_directory/state`.
3. **Directory List Scraping**: `list` query against `/public_directory`.
4. **Email Spoof Admin Escalation**: `request.auth.token.email == 'xay.raxa@gmail.com'` with `email_verified == false` attempts read/write on `/admin_vault/super_admin_config`.
5. **PII Blanket List Read**: Authenticated non-admin user runs `list` on `/members` without `where('ownerUid', '==', uid)`.
6. **PII Cross-User Get**: Authenticated User B attempts `get` on `/members/DMC-LA-00101` owned by User A.
7. **Self-Assigned Privilege Escalation**: Non-admin creates `/members/DMC-LA-00999` with `membershipState: 'ACTIVE_LIFETIME_MEMBER'`.
8. **Member Update Escalation**: Non-admin owner updates `membershipState` or `kycStatus` on their own `/members/{id}` doc.
9. **Shadow / Ghost Field Injection**: Write includes extra unexpected key `isVerified: true` (blocked by `hasOnly(...)`).
10. **Resource / ID Poisoning**: Document creation with 1,500-char ID or invalid characters (`../hack`) blocked by `isValidId()`.
11. **Temporal Forgery**: Write supplies backdated client timestamp `createdAt: Timestamp(2020)` instead of `request.time`.
12. **Admin Registry Tampering**: Any user attempts `create`/`update`/`delete` on `/admins/{uid}`.
