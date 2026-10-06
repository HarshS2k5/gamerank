// ─────────────────────────────────────────────────────────────────────────────
// TechForge & GameRank – Automated Report System Verification Test
// ─────────────────────────────────────────────────────────────────────────────

import {
  sanitizeText,
  createReport,
  getAllReports,
  updateReportStatus,
  deleteReport,
  checkRateLimit,
} from '../lib/reports/report-store.ts'

console.log('=== TEST 1: SANITIZATION & SECURITY ===')
const dirtyInput = '<script>alert("xss")</script>Hello <b>world</b>! <img src="x" onerror="stealCookie()" />'
const clean = sanitizeText(dirtyInput)
console.log(`Original: ${dirtyInput}`)
console.log(`Sanitized: ${clean}`)
if (clean.includes('<script>') || clean.includes('alert') || clean.includes('<img')) {
  throw new Error('Sanitization failed to strip dangerous HTML / scripts!')
}
if (!clean.includes('Hello world!')) {
  throw new Error('Sanitization altered safe plain text!')
}
console.log('✓ XSS & HTML injection successfully sanitized.')

console.log('\n=== TEST 2: VALIDATION RULES ===')
// 2A: Short description (< 10 chars)
const shortRes = createReport({
  kind: 'problem',
  category: 'bug',
  description: 'Too short',
  page: '/pc-builder',
}, 'test-user-1')
if (!shortRes.error) {
  throw new Error('Short description should have been rejected!')
}
console.log(`✓ Short description correctly rejected: "${shortRes.error}"`)

// 2B: Invalid email format
const invalidEmailRes = createReport({
  kind: 'problem',
  category: 'bug',
  description: 'Valid long description for testing invalid email format',
  email: 'not-an-email',
  page: '/pc-builder',
}, 'test-user-2')
if (!invalidEmailRes.error || !invalidEmailRes.error.includes('email')) {
  throw new Error('Invalid email should have been rejected!')
}
console.log(`✓ Invalid email correctly rejected: "${invalidEmailRes.error}"`)

console.log('\n=== TEST 3: VALID REPORT CREATION & PERSISTENCE ===')
const validRes = createReport({
  kind: 'problem',
  category: 'compatibility',
  description: 'The Ryzen 7 7800X3D should recommend a DDR5-6000 kit for sweetspot FCLK ratio.',
  relatedComponent: 'Processor (CPU)',
  page: '/pc-builder',
  email: 'tester@example.com',
}, 'test-user-3')

if (validRes.error || !validRes.report) {
  throw new Error(`Report creation failed: ${validRes.error}`)
}
const reportId = validRes.report.id
console.log(`✓ Created report: ${reportId} (Status: ${validRes.report.status})`)

// Verify report exists in storage
const allReports = getAllReports()
const found = allReports.find(r => r.id === reportId)
if (!found) {
  throw new Error('Report not found in persistent store!')
}
console.log(`✓ Report verified in storage with ${allReports.length} total report(s).`)

console.log('\n=== TEST 4: STATUS LIFECYCLE & ADMIN NOTES ===')
const updatedReview = updateReportStatus(reportId, 'Under Review', 'Verified by dev team')
if (!updatedReview || updatedReview.status !== 'Under Review' || updatedReview.adminNotes !== 'Verified by dev team') {
  throw new Error('Status update to Under Review failed!')
}
console.log(`✓ Status updated to Under Review with admin note: "${updatedReview.adminNotes}"`)

const updatedFixed = updateReportStatus(reportId, 'Fixed', 'Patched in catalog v2.6')
if (!updatedFixed || updatedFixed.status !== 'Fixed') {
  throw new Error('Status update to Fixed failed!')
}
console.log(`✓ Status updated to Fixed (Status: ${updatedFixed.status})`)

console.log('\n=== TEST 5: CLEANUP & DELETION ===')
const deleted = deleteReport(reportId)
if (!deleted) {
  throw new Error('Report deletion failed!')
}
const afterDelete = getAllReports().find(r => r.id === reportId)
if (afterDelete) {
  throw new Error('Report still found after deletion!')
}
console.log(`✓ Report #${reportId} successfully cleaned up.`)

console.log('\nALL REPORT SYSTEM TESTS PASSED SUCCESSFULLY! ✅')
