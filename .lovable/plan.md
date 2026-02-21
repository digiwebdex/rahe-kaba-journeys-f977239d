

## Customer Financial Report

### Overview
Add a detailed financial report view when admin clicks on a customer in the Customers page. The report will show all financial data for that customer and include a print-friendly layout.

### Implementation

#### 1. New Component: `src/components/admin/CustomerFinancialReport.tsx`

A dialog/sheet that opens when an admin clicks a customer row, showing:

**A. Customer Info Header**
- Full name, phone, passport number, address, join date

**B. Booking Details Table**
- All bookings for this customer (from `bookings` table where `user_id` matches)
- Columns: Tracking ID, Package Name, Travelers, Total Amount, Paid, Due, Status

**C. Payment History Table**
- All payments for this customer (from `payments` where `user_id` matches)
- Columns: Booking Tracking ID, Installment #, Amount, Due Date, Status, Paid Date

**D. Expenses Assigned**
- All expense transactions assigned to this customer (from `transactions` where `type = 'expense'` and `booking_id` matches customer's bookings)
- Columns: Title, Category, Amount, Date, Linked Booking

**E. Financial Summary Cards**
- Total Revenue (sum of completed payments)
- Total Expenses (sum of assigned expense transactions)
- Net Profit (Revenue - Expenses)
- Total Due (sum of pending payment amounts)

**F. Print Button**
- Uses `window.print()` with a print-specific CSS class that hides the sidebar/nav and formats the report cleanly on paper

#### 2. Update `src/pages/admin/AdminCustomersPage.tsx`

- Make each customer row clickable
- Add state for selected customer
- Render `CustomerFinancialReport` dialog when a customer is selected
- Fetch related data (bookings, payments, transactions) when a customer is selected

#### 3. Print Styles in `src/index.css`

Add `@media print` rules:
- Hide sidebar, nav, and dialog backdrop
- Show only the report content
- Clean formatting for tables and summary cards

### Data Fetching (on customer click)

```
bookings: supabase.from("bookings").select("*, packages(name)").eq("user_id", customer.user_id)
payments: supabase.from("payments").select("*, bookings(tracking_id)").eq("user_id", customer.user_id)
transactions: supabase.from("transactions").select("*").in("booking_id", [customer's booking IDs])
```

### Calculation Logic

- **Total Revenue** = sum of `payments` where `status = 'completed'`
- **Total Expenses** = sum of `transactions` where `type = 'expense'` and `booking_id` is in customer's bookings
- **Net Profit** = Total Revenue - Total Expenses
- **Total Due** = sum of `payments` where `status = 'pending'`
- All values use `Number()` conversion for financial accuracy

### Files Changed

| File | Action |
|------|--------|
| `src/components/admin/CustomerFinancialReport.tsx` | Create |
| `src/pages/admin/AdminCustomersPage.tsx` | Update (add click handler + dialog) |
| `src/index.css` | Add print media styles |

