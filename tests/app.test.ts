import test from "node:test";
import assert from "node:assert/strict";
import { StorageService } from "../lib/db";

// Mock localStorage for node environment if not present
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => store.set(key, String(val)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    length: store.size,
  };
}

test("LaporKampus Core Business Logic & Security Audit Tests", async (t) => {
  const db = new StorageService();
  db.resetToDefault();

  const users = db.getUsers();
  const studentAhmad = users.find((u) => u.email === "mahasiswa@kampus.ac.id")!;
  const studentSiti = users.find((u) => u.email === "siti.nurhaliza@kampus.ac.id")!;
  const adminBudi = users.find((u) => u.email === "admin@kampus.ac.id")!;
  const officerAgus = users.find((u) => u.email === "petugas.sarpras@kampus.ac.id")!;

  assert.ok(studentAhmad, "Mahasiswa Ahmad Fauzi exists");
  assert.ok(studentSiti, "Mahasiswa Siti Nurhaliza exists");
  assert.ok(adminBudi, "Admin Budi Santoso exists");
  assert.ok(officerAgus, "Petugas Agus exists");

  await t.test("1. Ticket Generation & Complaint Creation", () => {
    const complaint = db.createComplaint({
      user: studentAhmad,
      category_id: "c0000000-0000-0000-0000-000000000001",
      title: "Proyektor Ruang 201 Tidak Mau Menyala",
      description: "Proyektor mati total saat mata kuliah Struktur Data jam 10.",
      location: "Gedung C Lantai 2 Ruang 201",
      is_anonymous: false,
    });

    assert.ok(complaint.ticket_number.startsWith("LPK-"), "Ticket number format starts with LPK-");
    assert.match(
      complaint.ticket_number,
      /^LPK-\d{8}-\d{4}$/,
      "Ticket follows exact format LPK-YYYYMMDD-XXXX"
    );
    assert.equal(complaint.status, "dikirim", "Initial status is 'dikirim'");
    assert.equal(complaint.user_id, studentAhmad.id, "Owner matches creator");
  });

  await t.test("2. RBAC Data Isolation: Student cannot access other student complaints", () => {
    // Ahmad's complaint: d0000000-0000-0000-0000-000000000001
    const ahmadReport = db.getComplaintById("d0000000-0000-0000-0000-000000000001", studentAhmad);
    assert.ok(ahmadReport, "Ahmad can view his own complaint");

    // Siti attempts to view Ahmad's complaint:
    const forbiddenReport = db.getComplaintById("d0000000-0000-0000-0000-000000000001", studentSiti);
    assert.equal(forbiddenReport, null, "Siti cannot view Ahmad's complaint (Blocked)");

    // Admin can view any complaint:
    const adminReport = db.getComplaintById("d0000000-0000-0000-0000-000000000001", adminBudi);
    assert.ok(adminReport, "Admin can view any complaint");
  });

  await t.test("3. Confidentiality: Internal Staff Notes are never exposed to students", () => {
    // Report d0000000-0000-0000-0000-000000000002 has an internal staff note (is_internal: true)
    const reportForStudent = db.getComplaintById("d0000000-0000-0000-0000-000000000002", studentAhmad);
    assert.ok(reportForStudent, "Report fetched for student owner");

    const hasInternalNotes = reportForStudent?.responses?.some((r) => r.is_internal === true);
    assert.equal(hasInternalNotes, false, "Internal notes are completely stripped for student view");

    // Admin or Staff view includes internal notes
    const reportForAdmin = db.getComplaintById("d0000000-0000-0000-0000-000000000002", adminBudi);
    const adminHasInternal = reportForAdmin?.responses?.some((r) => r.is_internal === true);
    assert.equal(adminHasInternal, true, "Internal notes are visible to admin/staff");
  });

  await t.test("4. Administrative Action Guard: Student cannot execute administrative status updates", () => {
    // Student Ahmad tries to arbitrarily resolve complaint d0000000-0000-0000-0000-000000000003
    const result = db.updateComplaintStatus({
      complaintId: "d0000000-0000-0000-0000-000000000003",
      newStatus: "selesai",
      actor: studentAhmad,
      note: "Saya selesaikan sendiri",
    });

    assert.equal(result.success, false, "Student status update to 'selesai' must be rejected");
    assert.match(result.error || "", /tidak memiliki kewenangan/i, "Appropriate forbidden error message");
  });

  await t.test("5. Status Transition Rules: Reject requires reason, Resolve requires summary", () => {
    // 5a. Admin rejects without reason
    const rejectNoReason = db.updateComplaintStatus({
      complaintId: "d0000000-0000-0000-0000-000000000003",
      newStatus: "ditolak",
      actor: adminBudi,
      note: "   ",
    });
    assert.equal(rejectNoReason.success, false, "Rejection without note must be rejected");

    // 5b. Admin rejects with reason
    const rejectWithReason = db.updateComplaintStatus({
      complaintId: "d0000000-0000-0000-0000-000000000003",
      newStatus: "ditolak",
      actor: adminBudi,
      note: "Laporan duplikat dengan tiket LPK-20261025-0001.",
    });
    assert.equal(rejectWithReason.success, true, "Rejection with note succeeds");
    assert.equal(rejectWithReason.complaint?.status, "ditolak", "Status becomes ditolak");

    // 5c. Terminal state cannot be changed
    const terminalChange = db.updateComplaintStatus({
      complaintId: "d0000000-0000-0000-0000-000000000003",
      newStatus: "sedang_diproses",
      actor: adminBudi,
      note: "Membuka kembali",
    });
    assert.equal(terminalChange.success, false, "Terminal status cannot be altered");
  });

  await t.test("6. Rating Constraints: Only resolved complaints, only owner, 1-5 stars", () => {
    // Ahmad's resolved complaint d0000000-0000-0000-0000-000000000001 already has rating rate-1
    // Siti tries to rate Ahmad's complaint:
    const sitiRate = db.addRating({
      complaintId: "d0000000-0000-0000-0000-000000000001",
      user: studentSiti,
      rating: 5,
    });
    assert.equal(sitiRate.success, false, "Non-owner cannot rate complaint");

    // Ahmad tries to rate duplicate
    const duplicateRate = db.addRating({
      complaintId: "d0000000-0000-0000-0000-000000000001",
      user: studentAhmad,
      rating: 4,
    });
    assert.equal(duplicateRate.success, false, "Duplicate rating is rejected");
  });

  await t.test("7. Self-Registration Privilege Escalation Guard: Role is forced to mahasiswa", () => {
    const reg = db.registerStudent({
      name: "Doni Pratama",
      email: "doni@kampus.ac.id",
      nim: "2201010999",
      department: "Sistem Informasi",
    });

    assert.equal(reg.success, true, "Registration successful");
    assert.equal(reg.user?.role, "mahasiswa", "Registered user role is strictly 'mahasiswa'");

    // Duplicate email registration fails
    const dup = db.registerStudent({
      name: "Doni Kloning",
      email: "doni@kampus.ac.id",
      nim: "2201010998",
      department: "Sistem Informasi",
    });
    assert.equal(dup.success, false, "Duplicate email registration rejected");
  });
});

