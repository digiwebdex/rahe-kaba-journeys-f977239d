

## Complete Accounting System

### Current State
- The `transactions` table already exists in the database with columns: `type`, `category`, `booking_id` (nullable FK to bookings), `user_id`, `amount`, `date`, `note`. RLS is admin-only for writes.
- The `expenses` table is a separate, simpler table used by the current accounting page.
- The current `AdminAccountingPage.tsx` only supports adding basic expenses -- no income, no booking/customer assignment, no profit calculations.

### Plan

#### 1. Database Migration -- Add `customer_id` column to `transactions`

Add a nullable `customer_id` (uuid) column to the `transactions` table so expenses/income can be assigned to a specific customer (profile). This enables "profit per customer" calculations.

```sql
ALTER TABLE public.transactions ADD COLUMN customer_id uuid;
```

No new RLS policies needed -- existing admin-only policy covers this.

#### 2. Rewrite `AdminAccountingPage.tsx`

Replace the current expense-only page with a full accounting interface containing:

**A. Summary Cards (top row)**
- Total Income
- Total Expenses  
- Net Revenue (Income - Expenses)

**B. Tabbed Interface**
- **All Transactions** tab: Combined list of income and expenses, filterable by type
- **Per Booking Profit** tab: Table showing each booking with its total income (completed payments) vs assigned expenses, calculating profit per booking
- **Per Customer Profit** tab: Table grouped by customer showing aggregated income vs expenses

**C. Add Transaction Form**
- Type selector: Income / Expense
- Title, Amount, Category
- Optional: Assign to Booking (dropdown of bookings with tracking IDs)
- Optional: Assign to Customer (dropdown of customer profiles)
- Note field
- All calculations use `Number()` with proper rounding to guarantee financial accuracy

**D. Transaction List**
- Each row shows: title, type badge (green for income, red for expense), category, assigned booking tracking ID (if any), assigned customer name (if any), amount, date
- Delete button for each transaction

#### 3. Calculation Logic (client-side, from fetched data)

All computed from the `transactions` table plus `payments` table:

- **Revenue** = Sum of all transactions where `type = 'income'`
- **Total Expenses** = Sum of all transactions where `type = 'expense'`
- **Net Revenue** = Revenue - Total Expenses
- **Profit per Booking** = (completed payments for that booking) - (sum of expense transactions assigned to that booking)
- **Profit per Customer** = (completed payments for that customer's bookings) - (sum of expense transactions assigned to that customer)

Negative values are displayed but clearly styled (red) -- they represent losses, which is valid accounting unlike the payment due system.

#### 4. Data Fetching

The page will fetch:
- `transactions` table with joins to `bookings(tracking_id)` 
- `payments` table (completed only) with joins to `bookings(tracking_id, user_id)`
- `bookings` with `packages(name)` and `profiles(full_name)` for dropdowns and profit tables
- `profiles` for customer dropdown

#### 5. Files Changed

| File | Action |
|------|--------|
| `src/pages/admin/AdminAccountingPage.tsx` | Full rewrite |
| Database migration | Add `customer_id` column to `transactions` |

### Technical Notes

- The existing `expenses` table remains untouched (used by dashboard/reports). The `transactions` table is the single source of truth for the accounting module.
- Financial accuracy is guaranteed by using `Number()` conversions consistently and `toLocaleString()` for display formatting.
- All data is protected by existing RLS policies (admin-only on `transactions`).
