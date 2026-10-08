# UI Wireframes — YieldSense AI (Milestone-1)

All wireframes below are low-fidelity ASCII mockups for the onboarding flow and the base dashboard shell. High-fidelity visuals will be produced in Figma in a later milestone; these define layout and content hierarchy.

## 1. Welcome / Role Selection (Step 1)
┌──────────────────────────────────────────┐
│                                            │
│              🌾  YieldSense AI            │
│         Welcome to Smart Farming          │
│                                            │
│   Who are you?                            │
│                                            │
│   ( ● ) Farmer                            │
│   ( ○ ) Cooperative Member                │
│   ( ○ ) Agribusiness                      │
│   ( ○ ) Government Officer                │
│                                            │
│                              [ Next → ]   │
│                                            │
│   ● ○ ○   (step 1 of 3)                   │
└──────────────────────────────────────────┘
## 2. Farm Location (Step 2)
┌──────────────────────────────────────────┐
│  ← Back                                   │
│                                            │
│   Where is your farm?                     │
│                                            │
│   State                                   │
│   ┌────────────────────────────────────┐ │
│   │ Select state ▾                      │ │
│   └────────────────────────────────────┘ │
│                                            │
│   District                                │
│   ┌────────────────────────────────────┐ │
│   │ Select district ▾                   │ │
│   └────────────────────────────────────┘ │
│                                            │
│                              [ Next → ]   │
│                                            │
│   ○ ● ○   (step 2 of 3)                   │
└──────────────────────────────────────────┘
## 3. Crop Selection + Account Creation (Step 3)
┌──────────────────────────────────────────┐
│  ← Back                                   │
│                                            │
│   What crops do you grow?                 │
│                                            │
│   [✔ Rice ]   [ Cotton ]                  │
│   [ Wheat ]   [ Maize  ]                  │
│   (multi-select chips)                    │
│                                            │
│   Create your account                     │
│   ┌────────────────────────────────────┐ │
│   │ Full name                           │ │
│   └────────────────────────────────────┘ │
│   ┌────────────────────────────────────┐ │
│   │ Email                               │ │
│   └────────────────────────────────────┘ │
│   ┌────────────────────────────────────┐ │
│   │ Password (min 8 characters)         │ │
│   └────────────────────────────────────┘ │
│                                            │
│     [ Start My Smart Farming Journey 🚜 ] │
│                                            │
│   ○ ○ ●   (step 3 of 3)                   │
└──────────────────────────────────────────┘
## 4. Dashboard Shell (Post-Onboarding — scaffold only)
┌───────────────────────────────────────────────────────────┐
│  🌾 YieldSense AI     Dashboard   Predictions   Profile ▾  │
├───────────────────────────────────────────────────────────┤
│  Welcome back, Ramesh 👋   |  Krishna District, Telangana  │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │  Predicted     │  │  Land Size     │  │  Active Crops │  │
│  │  Yield (Rice)  │  │  2.4 ha        │  │  Rice, Cotton │  │
│  │  4,120 kg/ha   │  │                │  │               │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │        Yield Trend (last 5 seasons) — Chart          │   │
│  │        [line/bar chart placeholder — Recharts]       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  Recommendations (coming in Milestone-2)                    │
└───────────────────────────────────────────────────────────┘
## 5. Login (existing users only)
┌──────────────────────────────────────────┐
│              🌾  YieldSense AI            │
│                                            │
│   Email                                   │
│   ┌────────────────────────────────────┐ │
│   │                                      │ │
│   └────────────────────────────────────┘ │
│   Password                                │
│   ┌────────────────────────────────────┐ │
│   │                                      │ │
│   └────────────────────────────────────┘ │
│                                            │
│              [   Log In   ]               │
│                                            │
│   New here? [ Start onboarding → ]        │
└──────────────────────────────────────────┘
## 6. Responsive Behavior

- **Mobile (< 480px):** single-column stepper, full-width buttons, sticky progress dots at bottom.
- **Tablet (481–1024px):** onboarding card centered, max-width 480px.
- **Desktop (> 1024px):** dashboard grid becomes 3-column; onboarding remains centered modal-style card (doesn't stretch full width — see `design-system.md` for spacing tokens).