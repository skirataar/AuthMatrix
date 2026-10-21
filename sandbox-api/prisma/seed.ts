import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const TEST_CREDENTIALS = {
  alice: {
    id: 'usr_alice_alpha',
    email: 'alice@corp.local',
    password: 'Password123!',
    name: 'Alice Henderson',
    role: 'USER',
    tenantId: 'tenant-alpha',
  },
  bob: {
    id: 'usr_bob_beta',
    email: 'bob@corp.local',
    password: 'Password123!',
    name: 'Bob Vance',
    role: 'USER',
    tenantId: 'tenant-beta',
  },
  eve: {
    id: 'usr_eve_gamma',
    email: 'eve@corp.local',
    password: 'Password123!',
    name: 'Eve Adams (Auditor Persona)',
    role: 'USER',
    tenantId: 'tenant-gamma',
  },
  mallory: {
    id: 'usr_mallory_admin',
    email: 'mallory@corp.local',
    password: 'AdminPass2026!',
    name: 'Mallory Kane (System Admin)',
    role: 'ADMIN',
    tenantId: 'tenant-system',
  },
};

export const TEST_DOCUMENTS = [
  {
    id: 'doc_alice_financials_01',
    title: 'Q3 Financial Projections & M&A Strategy',
    content: 'CONFIDENTIAL: Project Phoenix acquisition target valuation at $42.5M. Wire instructions enclosed in internal vault.',
    classification: 'RESTRICTED',
    ownerId: 'usr_alice_alpha',
    tenantId: 'tenant-alpha',
  },
  {
    id: 'doc_alice_notes_02',
    title: 'Alice Personal Expense Receipts',
    content: 'Corporate card expenses for Singapore compliance conference. Total: $4,320.',
    classification: 'INTERNAL',
    ownerId: 'usr_alice_alpha',
    tenantId: 'tenant-alpha',
  },
  {
    id: 'doc_bob_architecture_01',
    title: 'NextGen Core Crypto & Vault HSM Specification',
    content: 'CRITICAL INFRASTRUCTURE: HSM Slot 4 partition master backup seed. Access strictly restricted to SecOps root.',
    classification: 'CONFIDENTIAL',
    ownerId: 'usr_bob_beta',
    tenantId: 'tenant-beta',
  },
  {
    id: 'doc_mallory_audit_01',
    title: 'Executive System Audit & Vulnerability Summary',
    content: 'Root keys rotated 2026-09. Access control monitoring active across all tenant partitions.',
    classification: 'RESTRICTED',
    ownerId: 'usr_mallory_admin',
    tenantId: 'tenant-system',
  },
];

async function main() {
  console.log('[SEED] Resetting database tables...');
  await prisma.auditLog.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('[SEED] Creating deterministic user personas...');
  const saltRounds = 10;

  for (const user of Object.values(TEST_CREDENTIALS)) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    });
    console.log(`  -> Created persona: ${user.name} (${user.email}) [Role: ${user.role}, Tenant: ${user.tenantId}]`);
  }

  console.log('[SEED] Populating test documents for BOLA verification...');
  for (const doc of TEST_DOCUMENTS) {
    await prisma.document.create({
      data: doc,
    });
    console.log(`  -> Created document: "${doc.title}" [ID: ${doc.id}, Owner: ${doc.ownerId}]`);
  }

  console.log('[SEED] Seeding baseline audit log entry...');
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_INITIALIZATION',
      actorId: TEST_CREDENTIALS.mallory.id,
      securityMode: 'vulnerable',
      status: 'ALLOWED',
      details: 'Deterministic seed executed successfully with test personas and sensitive documents.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('[SEED] Database seeding complete.');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
