# `sec-portfolio-suite`

A production-grade Cybersecurity Engineering Portfolio Monorepo demonstrating OWASP API Security Top 10 automated compliance auditing, microservice hardening, and DevSecOps posture telemetry.

---

## 🏗️ Monorepo Architecture

```text
sec-portfolio-suite/
├── sandbox-api/          # Express + TypeScript + Prisma (SQLite) dual-mode microservice (Port 4000)
├── auth-auditor/         # TypeScript/Node compliance test runner & OpenAPI schema analyzer (Phase 3-4)
├── dashboard/            # Next.js (App Router) + Tailwind CSS security posture & code-diff UI (Phase 5)
└── .github/workflows/    # DevSecOps CI/CD pipeline: Semgrep SAST, Trivy SCA, regression runner (Phase 6)
```

---

## 🗓️ 6-Phase Engineering Sprint Roadmap

- [x] **Phase 1: Monorepo Foundation & Sandbox API Architecture Setup** *(Completed & Verified)*
  - Monorepo workspace configuration (`npm workspaces`).
  - Express + TypeScript microservice with Prisma ORM and SQLite data store.
  - Multi-tenant data model (`User`, `Document`, `AuditLog`) with deterministic seed personas (Alice, Bob, Eve, Mallory).
  - Runtime Security Mode Engine supporting real-time toggling (`vulnerable` vs `patched`) via `x-security-mode` headers or query parameters.
  - Real-time health, database connectivity, and telemetry probe (`GET /health`).

- [ ] **Phase 2: OWASP API Security Controls (Vulnerable vs Patched Handlers)**
  - `API1:2023 - Broken Object Level Authorization (BOLA/IDOR)`
  - `API2:2023 - Broken Authentication` (JWT RFC 7519 validation & signature enforcement)
  - `API5:2023 - Broken Function Level Authorization (BFLA)` (RBAC & administrative boundary enforcement)

- [ ] **Phase 3: Automated Access Control Compliance Engine (`auth-auditor`)**
  - Standalone TypeScript test runner performing non-destructive compliance assertions against `localhost:4000`.
  - Structured SARIF and JSON report generation with OWASP risk scoring.

- [ ] **Phase 4: Contract Auditing & Static Route Analysis**
  - OpenAPI 3.0 specification contract generation.
  - AST-based Express route analyzer detecting unshielded endpoints and missing authorization middleware.

- [ ] **Phase 5: Security Posture Telemetry Dashboard (`dashboard`)**
  - Next.js (App Router) + Tailwind CSS dark-mode dashboard.
  - Interactive "Vulnerable vs. Patched" code-diff explorer and live compliance score tracking.

- [ ] **Phase 6: DevSecOps CI/CD & Pipeline Hardening**
  - GitHub Actions workflow running Semgrep SAST, Trivy vulnerability scans, and the live compliance suite.

---

## 🚀 Running Phase 1 (Sandbox API)

### 1. Install Dependencies & Generate Prisma Database
```bash
npm install
npm run prisma:generate --workspace=sandbox-api
npm run db:setup --workspace=sandbox-api
```

### 2. Run the Development Server
```bash
npm run dev:sandbox
# Server starts on http://localhost:4000
```

### 3. Verify Health & Security Mode Toggling
```bash
# Default mode (Vulnerable)
curl -i http://localhost:4000/health

# Patched mode (via HTTP header)
curl -i -H "X-Security-Mode: patched" http://localhost:4000/health

# Patched mode (via query parameter)
curl -i "http://localhost:4000/health?mode=patched"
```
