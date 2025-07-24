# Fur Finance - Troubleshooting Guide

This document contains the most challenging problems we encountered during development and how we solved them. Keep this for future reference!

## 🚨 Critical Issues & Solutions

### 1. **TypeScript Compilation Errors During Deployment**

**Problem:** Vercel deployment failing with TypeScript errors like:
```
Type 'ExpenseFormData' is not assignable to parameter of type 'Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>'
```

**Root Cause:** Type mismatch between form schema and TypeScript interfaces.

**Solution:**
- Made `description` optional in `Expense` interface: `description?: string;`
- Aligned Zod schema with TypeScript types
- Ensured all new fields (like `recurringType`, `nextDueDate`) are properly typed

**Files Modified:**
- `src/types/index.ts` - Updated Expense interface
- `src/components/forms/ExpenseForm.tsx` - Updated schema validation

### 2. **HTTP 400 Errors When Creating Expenses**

**Problem:** Expenses not being created, getting 400 errors in console.

**Root Cause:** Database schema mismatch - new fields (`recurring_type`, `next_due_date`) didn't exist in Supabase.

**Solution:**
- Created and ran migration script `add-recurring-expenses.sql`
- Added proper field mappings in `toSnakeCase`/`toCamelCase` functions
- Cleaned up empty strings to `undefined` for optional fields

**Migration Script:**
```sql
-- Add recurring_type enum
CREATE TYPE recurring_type AS ENUM ('none', 'monthly', 'quarterly', 'yearly');

-- Add recurring fields to expenses table
ALTER TABLE expenses 
ADD COLUMN recurring_type recurring_type NOT NULL DEFAULT 'none',
ADD COLUMN next_due_date DATE;

-- Add indexes for better performance
CREATE INDEX idx_expenses_recurring_type ON expenses(recurring_type);
CREATE INDEX idx_expenses_next_due_date ON expenses(next_due_date);
```

### 3. **Dropdown Styling Issues**

**Problem:** Dropdowns not showing properly or being unclickable.

**Root Cause:** Inline styles causing z-index and positioning conflicts.

**Solution:**
- Replaced inline styles with Tailwind CSS classes
- Added proper z-index (`z-50`) to dropdown content
- Used consistent hover/focus states

**Before:**
```tsx
style={{ backgroundColor: '#000000', border: '1px solid #333333' }}
```

**After:**
```tsx
className="bg-black border border-gray-700 z-50"
```

### 4. **Form Validation Issues with Optional Fields**

**Problem:** Optional fields still being treated as required.

**Root Cause:** Zod schema not properly handling empty strings vs undefined.

**Solution:**
- Updated schema: `z.string().min(0).optional()`
- Added data cleaning in form submission
- Convert empty strings to `undefined` for optional fields

**Code:**
```tsx
const cleanedData = {
  ...data,
  description: data.description?.trim() || undefined,
  receipt: data.receipt?.trim() || undefined,
  nextDueDate: data.nextDueDate || undefined,
};
```

### 5. **React Hooks Rules Violations**

**Problem:** Deployment failures due to conditional hook calls.

**Root Cause:** Using hooks inside conditional statements or loops.

**Solution:**
- Moved all hooks to the top level of components
- Used conditional rendering instead of conditional hook calls
- Ensured hooks are always called in the same order

### 6. **Data Loading Performance Issues**

**Problem:** App taking 15+ seconds to load expenses.

**Root Cause:** Sequential data loading instead of parallel loading.

**Solution:**
- Implemented parallel loading with `Promise.all()`
- Prioritized critical data (settings, categories) first
- Added performance logging to identify bottlenecks

**Code:**
```tsx
// Load critical data first
await Promise.all([
  loadSettings(),
  loadCategories()
]);

// Then load secondary data in parallel
Promise.all([
  loadPets(),
  loadExpenses(),
  loadBudgets()
]).then(() => {
  console.log('Secondary data loaded');
}).catch(console.error);
```

### 7. **Supabase Field Name Mismatches**

**Problem:** Data not being saved due to camelCase vs snake_case field names.

**Root Cause:** Frontend using camelCase, database using snake_case.

**Solution:**
- Created `toSnakeCase` and `toCamelCase` utility functions
- Added specific field mappings for all fields
- Applied transformations before database operations

**Field Mappings:**
```tsx
case 'recurringType':
  snakeKey = 'recurring_type'
  break
case 'nextDueDate':
  snakeKey = 'next_due_date'
  break
```

### 8. **Missing Default Categories**

**Problem:** Expense form stuck on "Loading expense form..." because no categories existed.

**Root Cause:** New users had no expense categories, causing the form to wait indefinitely.

**Solution:**
- Created `getOrCreateDefault()` method in categories service
- Automatically creates 8 default categories for new users
- Ensures categories are always available

**Code:**
```tsx
async getOrCreateDefault(): Promise<ExpenseCategory[]> {
  const userId = await getCurrentUserId()
  const { data: existingCategories } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('user_id', userId)
  
  if (existingCategories && existingCategories.length > 0) {
    return existingCategories.map(toCamelCase) as ExpenseCategory[]
  }
  
  // Create default categories if none exist
  const defaultCategories = [
    { name: 'Food & Treats', color: '#10b981', icon: '🍖' },
    // ... more categories
  ]
  
  const { data: newCategories } = await supabase
    .from('expense_categories')
    .insert(defaultCategories.map(cat => ({ ...cat, user_id: userId })))
    .select()
  
  return (newCategories || []).map(toCamelCase) as ExpenseCategory[]
}
```

## 🔧 Development Best Practices Learned

### 1. **Database Migrations**
- Always create migration scripts for schema changes
- Test migrations on a copy of production data first
- Include proper indexes for performance

### 2. **Type Safety**
- Keep TypeScript interfaces and Zod schemas in sync
- Use proper optional field handling
- Validate data transformations

### 3. **Error Handling**
- Add detailed error logging for debugging
- Use proper error boundaries in React
- Handle both client and server errors

### 4. **Performance**
- Load critical data first, then secondary data
- Use parallel loading where possible
- Add performance monitoring

### 5. **UI/UX**
- Use Tailwind classes instead of inline styles
- Ensure proper z-index for dropdowns
- Provide fallbacks for missing data

## 🚀 Deployment Checklist

Before deploying to Vercel:

1. ✅ Run `npm run build` locally to catch TypeScript errors
2. ✅ Ensure all database migrations are applied
3. ✅ Check that all required environment variables are set
4. ✅ Verify that all new fields have proper type mappings
5. ✅ Test form submissions with both required and optional fields
6. ✅ Check console for any remaining errors

## 📝 Common Debugging Commands

```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint

# Test database connection
# (Add to your code temporarily)
console.log('Testing Supabase connection...')
```

## 🔍 Debugging Tips

1. **Check the browser console** for detailed error messages
2. **Use the Network tab** to see failed API requests
3. **Add console.log statements** to track data flow
4. **Check Supabase logs** for database errors
5. **Verify environment variables** are set correctly

---

*This document should be updated whenever new major issues are encountered and resolved.* 