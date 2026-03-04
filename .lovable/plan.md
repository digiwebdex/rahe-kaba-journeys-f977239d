

## Analysis

The user wants to show **individual payment history with dates** for each booking — specifically when a customer paid and how much on each date, displayed separately (e.g., "19/02/2026 — ৳200,000" and "03/03/2026 — ৳300,000").

The `BookingDetail` component (lines 23-136) already shows an "Installment History" table with columns: #, Amount, Method, Due Date, Paid Date, Status. This data comes from the `payments` table.

However, the issue is that payment dates (`paid_at`) may not be consistently populated, and the display is inside an expandable section that requires clicking "View Details."

## Plan

### 1. Enhance payment history display in BookingDetail

- Add a **"Payment Timeline"** section in `BookingDetail` that shows only **completed** payments in a clean, date-focused format:
  - Each entry: date (formatted as DD/MM/YYYY) + amount + payment method
  - Sorted by `paid_at` ascending
  - Visually distinct with a timeline/list style showing chronological payments

### 2. Add payment summary to booking card (main view)

- On each booking card in the main list (lines 443-451), add a small **payment breakdown** below the existing financial grid
- Show completed payments as compact chips/badges: `19/02/2026: ৳200,000` | `03/03/2026: ৳300,000`
- This requires fetching payments alongside bookings

### 3. Data fetching changes

- In `AdminBookingsPage`, fetch payments for all bookings in a single query and group by `booking_id`
- Pass payment data to each booking card for inline display
- No database changes needed — `payments` table already has `paid_at`, `amount`, `status`

### Technical Details

**Files to modify:**
- `src/pages/admin/AdminBookingsPage.tsx`
  - Add `payments` state and fetch all completed payments grouped by booking_id
  - Add compact payment date list on each booking card
  - Enhance `BookingDetail` to show a clear "Payment Timeline" with dates

