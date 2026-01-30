# Dead Code Analysis Report

**Generated:** 2026-01-31
**Project:** Writing Board

---

## Summary

| Category | Count |
|----------|-------|
| Unused Files | 11 |
| Unused Dependencies | 2 |
| Unused Exports | 6 |

---

## 1. Unused Files (SAFE to remove)

These files are not imported anywhere in the codebase:

| File | Severity | Recommendation |
|------|----------|----------------|
| `src/components/theme-toggle.tsx` | CAUTION | Keep - likely intended for header integration |
| `src/hooks/use-auto-save.ts` | CAUTION | Keep - infrastructure for future use |
| `src/components/ui/avatar.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/card.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/combobox.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/dropdown-menu.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/field.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/input-group.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/label.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/scroll-area.tsx` | SAFE | Remove - shadcn component not used |
| `src/components/ui/textarea.tsx` | SAFE | Remove - shadcn component not used |

---

## 2. Unused Dependencies

| Package | Type | Recommendation |
|---------|------|----------------|
| `@base-ui/react` | dependency | SAFE to remove |
| `@radix-ui/react-scroll-area` | dependency | SAFE to remove |

---

## 3. Unused Exports

These exports exist but are never used:

| File | Export | Recommendation |
|------|--------|----------------|
| `src/lib/validation.ts` | `VALID_CATEGORIES` | Keep - may be used for validation |
| `src/lib/validation.ts` | `VALID_DIFFICULTIES` | Keep - may be used for validation |
| `src/components/ui/badge.tsx` | `badgeVariants` | Keep - shadcn pattern |
| `src/components/ui/button.tsx` | `buttonVariants` | Keep - shadcn pattern |
| `src/components/ui/sidebar.tsx` | `SidebarGroupAction`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarSeparator`, `useSidebar` | Keep - shadcn components |
| `src/components/ui/select.tsx` | `SelectGroup`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator` | Keep - shadcn components |
| `src/components/ui/alert-dialog.tsx` | `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal` | Keep - shadcn components |
| `src/components/ui/sheet.tsx` | `SheetTrigger`, `SheetClose`, `SheetFooter` | Keep - shadcn components |

---

## Proposed Safe Deletions

### Files to Delete (9 files)

```
src/components/ui/avatar.tsx
src/components/ui/card.tsx
src/components/ui/combobox.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/field.tsx
src/components/ui/input-group.tsx
src/components/ui/label.tsx
src/components/ui/scroll-area.tsx
src/components/ui/textarea.tsx
```

### Dependencies to Remove (2 packages)

```bash
npm uninstall @base-ui/react @radix-ui/react-scroll-area
```

---

## Files to Keep

| File | Reason |
|------|--------|
| `src/components/theme-toggle.tsx` | Intended for theme switching UI |
| `src/hooks/use-auto-save.ts` | Infrastructure for auto-save feature |

---

## Notes

- shadcn/ui exports like `buttonVariants` are intentionally exported for composition patterns
- Validation constants may be used in API routes for server-side validation
- Theme toggle and auto-save hooks are intentional infrastructure, not dead code
