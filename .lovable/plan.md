

## Expanded CMS System

### Current State
The CMS already manages 6 sections via the `site_content` table: hero, services, about, contact, footer, navbar. The `AdminCmsEditor` component renders a config-driven accordion UI. The `PackagesSection` on the homepage is hardcoded (not CMS-driven). There are no banners, announcements, or special notice sections.

### Plan

#### 1. Database -- Insert new `site_content` rows

Insert 4 new rows into `site_content` for the new sections. No schema changes needed -- the existing JSONB `content` column handles any structure.

```sql
INSERT INTO site_content (section_key, content) VALUES
('packages_section', '{"section_label":"Our Packages","heading":"Choose Your","heading_highlight":"Journey","description":"Flexible packages designed for every budget — installment payment available","items":[{"name":"Umrah Economy","price":"৳85,000","duration":"10 Days","popular":false,"features":["Return Air Ticket","3-Star Hotel","Visa Processing","Ground Transport","Ziyara Tour","Meal Included"]},{"name":"Umrah Premium","price":"৳1,50,000","duration":"14 Days","popular":true,"features":["Return Air Ticket","5-Star Hotel Near Haram","Visa Processing","VIP Transport","Full Ziyara","All Meals","Personal Guide","Laundry Service"]},{"name":"Hajj Package","price":"৳6,50,000","duration":"40 Days","popular":false,"features":["Return Air Ticket","Premium Accommodation","Visa Processing","Full Transport","Complete Ziyara","All Meals","Experienced Guide","Training Sessions"]}]}'),
('banners', '{"items":[]}'),
('announcements', '{"items":[]}'),
('notices', '{"hajj_registration":{"enabled":false,"title":"Hajj Registration Open","description":"Register now for Hajj 2026. Limited seats available.","badge":"New","link":"/packages"},"ramadan_packages":{"enabled":false,"title":"Special Ramadan Umrah","description":"Perform Umrah during the blessed month of Ramadan.","badge":"Ramadan","link":"/packages"}}');
```

#### 2. Expand `SECTION_CONFIG` in `AdminCmsEditor.tsx`

Add 4 new section configs to the existing `SECTION_CONFIG` object:

**packages_section** -- Section heading text + package items (array with name, price, duration, popular toggle, features as newline-separated text)

**banners** -- Array of banner items with: title, description, image URL, link URL, enabled toggle

**announcements** -- Array of announcement items with: title, description, type (info/warning/success), enabled toggle, date

**notices** -- Hajj Registration Notice (enabled, title, description, badge, link) and Ramadan Packages Notice (same fields)

Also add a new field type `"toggle"` to the `FieldConfig` interface, rendered as a checkbox/switch for boolean fields like `enabled` and `popular`.

#### 3. Update `PackagesSection.tsx` to use CMS data

Replace the hardcoded `packages` array with `useSiteContent("packages_section")`. Fall back to current hardcoded data if no CMS content exists.

#### 4. Add Banners + Announcements to Homepage (`Index.tsx`)

Create two small components:

**`src/components/AnnouncementBar.tsx`** -- A thin bar at the top of the page (below navbar) showing enabled announcements in a dismissable strip. Reads from `useSiteContent("announcements")`.

**`src/components/NoticeSection.tsx`** -- Renders enabled notices (Hajj registration, Ramadan packages) as highlighted cards on the homepage between packages and about sections. Reads from `useSiteContent("notices")`.

Banners from `useSiteContent("banners")` will render as a carousel/slider between the hero and services sections if any enabled banners exist.

#### 5. Files Changed

| File | Action |
|------|--------|
| `src/components/AdminCmsEditor.tsx` | Add 4 new section configs + toggle field type |
| `src/components/PackagesSection.tsx` | Use CMS content with fallback |
| `src/components/AnnouncementBar.tsx` | New -- dismissable announcement strip |
| `src/components/NoticeSection.tsx` | New -- Hajj/Ramadan notice cards |
| `src/pages/Index.tsx` | Add AnnouncementBar, banner carousel, NoticeSection |
| Database (data insert) | 4 new rows in `site_content` |

### How It Works

- Admin goes to CMS page, sees all sections including the 4 new ones
- Edits banners, announcements, notices, or package display text
- Clicks Save -- content updates in database instantly
- Frontend components read from `useSiteContent()` with React Query (5-min stale time), so changes reflect on next page load or refresh
- All new sections have sensible defaults/fallbacks so the site works even if CMS rows are empty

### Technical Notes

- No new database tables or columns needed -- leverages existing `site_content` JSONB structure
- The toggle field type renders as a styled checkbox that stores `true`/`false` in the JSONB content
- RLS already covers these rows (admin write, public read)
- The `staleTime` of 5 minutes in `useSiteContent` means changes appear within 5 minutes without manual refresh, or instantly on hard refresh

