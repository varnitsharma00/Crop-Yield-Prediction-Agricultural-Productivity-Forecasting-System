# Design System — YieldSense AI

## 1. Design Principles

- **Farmer-first clarity** — large tap targets, minimal jargon, icon-supported labels.
- **Trustworthy & calm** — earthy greens and warm neutrals over saturated, alarm-like colors.
- **Progressive disclosure** — show only what's needed at each onboarding step.

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-700` | `#1B5E20` | Primary brand green — headers, primary buttons |
| `--color-primary-500` | `#2E7D32` | Default interactive green — links, active states |
| `--color-primary-100` | `#E8F5E9` | Light green surface — cards, selected chip background |
| `--color-accent-amber` | `#F9A825` | Highlights, "harvest" accent, warnings (non-critical) |
| `--color-secondary-brown` | `#6D4C31` | Earth tone — secondary icons, soil-related UI |
| `--color-neutral-900` | `#1A1A1A` | Primary text |
| `--color-neutral-600` | `#5F6368` | Secondary text |
| `--color-neutral-200` | `#E0E0E0` | Borders, dividers |
| `--color-surface` | `#FFFFFF` | Card/page background |
| `--color-background` | `#F7F9F6` | App background (slight green tint) |
| `--color-success` | `#2E7D32` | Success states |
| `--color-error` | `#C62828` | Error/validation states |
| `--color-info` | `#1565C0` | Informational banners |

All text/background pairings meet WCAG 2.1 AA contrast (≥ 4.5:1 for body text).

## 3. Typography

| Token | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `--font-heading` | Inter / system-ui | 28px / 1.2 | 700 | Page titles ("Welcome to YieldSense AI") |
| `--font-subheading` | Inter / system-ui | 20px / 1.3 | 600 | Step titles ("What crops do you grow?") |
| `--font-body` | Inter / system-ui | 16px / 1.5 | 400 | Body copy, form labels |
| `--font-caption` | Inter / system-ui | 13px / 1.4 | 400 | Helper text, step counters |
| `--font-button` | Inter / system-ui | 16px / 1 | 600 | Button labels |

## 4. Spacing Scale
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
## 5. Component Hierarchy
DesignSystem
├── Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Iconography (outline-style agricultural icon set: 🌾 🚜 💧 🌱)
│
├── Primitives
│   ├── Button (Primary / Secondary / Ghost)
│   ├── Input (Text / Select / SearchableSelect)
│   ├── Chip (SelectableChip — used for crop multi-select)
│   ├── RadioCard (used for role selection)
│   ├── ProgressDots (step indicator)
│   └── Badge (role/status labels)
│
├── Composite Components
│   ├── OnboardingStepper (wraps Step 1–3, manages progress state)
│   ├── FormField (Label + Input + ErrorText)
│   ├── StatCard (used on dashboard: Predicted Yield, Land Size, Active Crops)
│   ├── TrendChartCard (wraps Recharts/Chart.js line or bar chart)
│   └── AppShellNav (top navigation: logo, nav links, profile menu)
│
└── Page Templates
├── OnboardingLayout (centered card, progress dots, back button)
├── AuthLayout (centered card, logo, form)
└── DashboardLayout (top nav + grid content area)
## 6. Button States

| State | Style |
|-------|-------|
| Default | `--color-primary-500` background, white text |
| Hover | `--color-primary-700` background |
| Disabled | `--color-neutral-200` background, `--color-neutral-600` text, no pointer events |
| Loading | Spinner replaces label, button width preserved (no layout shift) |

## 7. Iconography Guidelines

- Use outline-style icons at 24px default size, 32px for primary CTAs (e.g., 🚜 on the final onboarding button).
- Icons always paired with text labels — never icon-only for primary actions (accessibility + low digital literacy considerations).

## 8. Grid & Layout

- Base grid: 12-column, 24px gutter on desktop; 4-column, 16px gutter on mobile.
- Onboarding/Auth cards: fixed max-width 480px, centered, `--space-6` internal padding.
- Dashboard: 3-column stat card row on desktop → 1-column stack on mobile.
