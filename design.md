# Wi-Help Design System

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Design Patterns](#component-design-patterns)
5. [Visual Effects & Motion](#visual-effects--motion)
6. [Icons & Imagery](#icons--imagery)
7. [Voice & Tone](#voice--tone-of-the-design)
8. [AI Usage Instructions](#-instructions-for-ai-assistants)

---

## Color System

### CSS Custom Properties (Semantic Tokens)

All semantic colors are defined as `oklch` values and toggled between `:root` (light) and `.dark` scopes.

| Token                    | Light Mode (oklch)      | Dark Mode (oklch)      | Approx. Hex (light) |
| ------------------------ | ----------------------- | ---------------------- | ------------------- |
| `--background`           | `oklch(1 0 0)`          | `oklch(0.145 0 0)`     | `#ffffff`           |
| `--foreground`           | `oklch(0.145 0 0)`      | `oklch(0.985 0 0)`     | `#171717`           |
| `--card`                 | `oklch(1 0 0)`          | `oklch(0.205 0 0)`     | `#ffffff`           |
| `--card-foreground`      | `oklch(0.145 0 0)`      | `oklch(0.985 0 0)`     | `#171717`           |
| `--popover`              | `oklch(1 0 0)`          | `oklch(0.205 0 0)`     | `#ffffff`           |
| `--popover-foreground`   | `oklch(0.145 0 0)`      | `oklch(0.985 0 0)`     | `#171717`           |
| `--primary`              | `oklch(0.205 0 0)`      | `oklch(0.922 0 0)`     | `#262626`           |
| `--primary-foreground`   | `oklch(0.985 0 0)`      | `oklch(0.205 0 0)`     | `#fafafa`           |
| `--secondary`            | `oklch(0.97 0 0)`       | `oklch(0.269 0 0)`     | `#f5f5f5`           |
| `--secondary-foreground` | `oklch(0.205 0 0)`      | `oklch(0.985 0 0)`     | `#262626`           |
| `--muted`                | `oklch(0.97 0 0)`       | `oklch(0.269 0 0)`     | `#f5f5f5`           |
| `--muted-foreground`     | `oklch(0.556 0 0)`      | `oklch(0.708 0 0)`     | `#737373`           |
| `--accent`               | `oklch(0.97 0 0)`       | `oklch(0.269 0 0)`     | `#f5f5f5`           |
| `--accent-foreground`    | `oklch(0.205 0 0)`      | `oklch(0.985 0 0)`     | `#262626`           |
| `--destructive`          | `oklch(0.35 0.065 213)` | `oklch(0.25 0.05 196)` | `#00546e`           |
| `--border`               | `oklch(0.922 0 0)`      | `oklch(1 0 0 / 10%)`   | `#e5e5e5`           |
| `--input`                | `oklch(0.922 0 0)`      | `oklch(1 0 0 / 15%)`   | `#e5e5e5`           |
| `--ring`                 | `oklch(0.708 0 0)`      | `oklch(0.556 0 0)`     | `#a3a3a3`           |

### Brand Colors (Custom Palette)

These are the primary brand identity colors, defined in `@theme` and available as Tailwind utilities (`text-brand-dark`, `bg-brand-teal`, etc.).

| Token                     | Hex Value | Tailwind Class    | Semantic Role                                                   |
| ------------------------- | --------- | ----------------- | --------------------------------------------------------------- |
| `--color-brand-dark`      | `#00394a` | `brand-dark`      | Primary brand — headings, active nav, dark CTA buttons          |
| `--color-brand-secondary` | `#00546e` | `brand-secondary` | Secondary text, hover state of dark elements                    |
| `--color-brand-blue`      | `#3fa6ff` | `brand-blue`      | Accent, info, icon highlights                                   |
| `--color-brand-teal`      | `#14d3ac` | `brand-teal`      | Primary CTA, success states, active badges, verification checks |
| `--color-brand-light`     | `#00e984` | `brand-light`     | Hover state for teal buttons                                    |
| `--color-brand-cream`     | `#ffecb4` | `brand-cream`     | Warning / pending badge background, star ratings                |
| `--color-brand-bg`        | `#fbfbfb` | `brand-bg`        | Default page / body background                                  |

### Sidebar Colors

| Token                  | Light                          | Dark                                |
| ---------------------- | ------------------------------ | ----------------------------------- |
| `--sidebar`            | `oklch(0.985 0 0)` ≈ `#fafafa` | `oklch(0.205 0 0)` ≈ `#262626`      |
| `--sidebar-foreground` | `oklch(0.145 0 0)`             | `oklch(0.985 0 0)`                  |
| `--sidebar-primary`    | `oklch(0.205 0 0)`             | `oklch(0.488 0.243 264.376)` (blue) |
| `--sidebar-accent`     | `oklch(0.97 0 0)`              | `oklch(0.269 0 0)`                  |
| `--sidebar-border`     | `oklch(0.922 0 0)`             | `oklch(1 0 0 / 10%)`                |

### Feedback / Semantic Colors (Alert Component)

| Variant       | Background          | Text                   | Border                 | Icon Color             |
| ------------- | ------------------- | ---------------------- | ---------------------- | ---------------------- |
| `default`     | `bg-card`           | `text-card-foreground` | `border`               | —                      |
| `destructive` | `bg-card`           | `text-destructive`     | default                | `text-destructive`     |
| `success`     | `bg-brand-teal/10`  | `text-brand-dark`      | `border-brand-teal/30` | `text-brand-teal`      |
| `warning`     | `bg-brand-cream/20` | `text-brand-dark`      | `border-brand-cream`   | `text-brand-secondary` |
| `info`        | `bg-brand-blue/10`  | `text-brand-dark`      | `border-brand-blue/30` | `text-brand-blue`      |

### Appointment Urgency Badge Colors

| Urgency  | Background          | Border                 | Text                   |
| -------- | ------------------- | ---------------------- | ---------------------- |
| `High`   | `bg-brand-dark/10`  | `border-brand-dark/20` | `text-brand-dark`      |
| `Medium` | `bg-brand-cream/20` | `border-brand-cream`   | `text-brand-secondary` |
| `Low`    | `bg-brand-blue/10`  | `border-brand-blue/40` | `text-brand-dark`      |

### Chart Colors (light / dark)

| Token       | Light                                           | Dark                                            |
| ----------- | ----------------------------------------------- | ----------------------------------------------- |
| `--chart-1` | `oklch(0.72 0.15 175)` — teal (`#14d3ac`)       | `oklch(0.65 0.14 210)` — blue (`#3fa6ff`)       |
| `--chart-2` | `oklch(0.82 0.16 150)` — light (`#00e984`)      | `oklch(0.35 0.065 213)` — secondary (`#00546e`) |
| `--chart-3` | `oklch(0.52 0.10 210)` — blue (`#3fa6ff` shade) | `oklch(0.85 0.10 90)` — cream (`#ffecb4`)       |
| `--chart-4` | `oklch(0.85 0.10 90)` — cream (`#ffecb4`)       | `oklch(0.25 0.05 196)` — dark (`#00394a`)       |
| `--chart-5` | `oklch(0.25 0.05 196)` — dark (`#00394a`)       | `oklch(0.72 0.15 175)` — teal (`#14d3ac`)       |

### Scrollbar Colors

```css
scrollbar-color: var(--muted-foreground) var(--background);
/* thumb: ~#737373 on #ffffff (light), ~#a3a3a3 on #171717 (dark) */
scrollbar-width: auto; /* via @supports (scrollbar-color) */
/* webkit thumb: border-radius: 10px */
```

### Text Selection

```css
::selection {
  background-color: #14d3ac; /* brand-teal */
  color: #00394a; /* brand-dark */
}
```

---

## Typography

### Font Families

| Variable             | CSS Stack                                                | Weights Loaded     | Role                                                                                         | Source       |
| -------------------- | -------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- | ------------ |
| `--font-inter-tight` | `"Inter Tight", ui-sans-serif, system-ui, sans-serif, …` | 300, 400, 500, 600 | **Primary / body font** — used on `<body>` globally                                          | Google Fonts |
| `--font-geist`       | `"Geist", ui-sans-serif, system-ui, sans-serif, …`       | 300, 400, 500, 600 | **Display / heading accent** — dashboard numbers, footer headlines, testimonials, stat cards | Google Fonts |
| `--font-inter`       | `"Inter", ui-sans-serif, system-ui, sans-serif, …`       | system fallback    | Utility alias                                                                                | —            |

#### Body Default

```html
<!-- set on <body> in index.html -->
<body
  class="font-inter-tight text-brand-secondary"
  style="font-feature-settings: 'cv11', 'ss01'; -webkit-font-smoothing: antialiased;"
></body>
```

### Font Size Scale (Tailwind defaults + application usage)

| Label    | Class         | px equiv | Used For                                                              |
| -------- | ------------- | -------- | --------------------------------------------------------------------- |
| `[10px]` | `text-[10px]` | 10px     | Stat sub-labels, bar chart labels, tiny metadata                      |
| `[11px]` | `text-[11px]` | 11px     | Badge text, table meta, pagination, status dot labels                 |
| `xs`     | `text-xs`     | 12px     | Table headers (uppercase), card sub-labels, nav links, sidebar slogan |
| `sm`     | `text-sm`     | 14px     | Button labels, dropdown items, body text in modals, form labels       |
| `base`   | `text-base`   | 16px     | Standard paragraph text, auth headings                                |
| `lg`     | `text-lg`     | 18px     | Hero description paragraph, dashboard page title (sm screens)         |
| `xl`     | `text-xl`     | 20px     | Dashboard page title, sidebar brand name, auth brand name             |
| `2xl`    | `text-2xl`    | 24px     | Stat card numbers, section sub-headings (features, profile)           |
| `3xl`    | `text-3xl`    | 30px     | Section headings (features, testimonials)                             |
| `4xl`    | `text-4xl`    | 36px     | CTA section heading                                                   |
| `5xl`    | `text-5xl`    | 48px     | Hero h1 (mobile)                                                      |
| `7xl`    | `text-7xl`    | 72px     | Hero h1 (desktop)                                                     |

### Font Weights

| Weight          | Value | Usage                                                                |
| --------------- | ----- | -------------------------------------------------------------------- |
| `font-light`    | 300   | Hero subtitle, description paragraphs, decorative secondary text     |
| `font-normal`   | 400   | Body text (default)                                                  |
| `font-medium`   | 500   | Nav links, tags, button labels, form labels, secondary headings      |
| `font-semibold` | 600   | Primary headings (h1–h3), card titles, active nav items, key numbers |
| `font-bold`     | 700   | Dashboard sidebar brand name, stat sub-values                        |

### Heading Hierarchy

| Element              | Size                       | Weight                       | Color                             | Tracking         | Example                       |
| -------------------- | -------------------------- | ---------------------------- | --------------------------------- | ---------------- | ----------------------------- |
| `h1` (landing)       | `text-5xl` / `lg:text-7xl` | `font-semibold`              | `text-brand-dark`                 | `tracking-tight` | "Find Care, On Your Terms"    |
| `h2` (section)       | `text-3xl` / `md:text-5xl` | `font-semibold`              | `text-brand-dark`                 | `tracking-tight` | Features / Testimonials title |
| `h2` (CTA)           | `text-4xl` / `md:text-5xl` | `font-semibold`              | `text-brand-dark`                 | `tracking-tight` | CTA section                   |
| `h3` (card)          | `text-2xl`                 | `font-semibold`              | `text-brand-dark` or `text-white` | default          | Feature card titles           |
| `h4` (card sub)      | `text-sm`                  | `font-semibold`              | `text-brand-dark`                 | `tracking-tight` | Profile card inner headers    |
| Dashboard page title | `text-lg sm:text-xl`       | `font-semibold`              | `text-brand-dark`                 | `tracking-tight` | "Appointments Overview"       |
| Stat number          | `text-2xl`                 | `font-semibold` (font-geist) | `text-brand-dark`                 | `tracking-tight` | "42"                          |

### Special Text Treatments

- **Uppercase labels**: `text-[10px] font-medium tracking-wide uppercase` — used for table column headers and stat sub-labels
- **Hero subtitle**: `font-light text-brand-secondary/50` — visual weight contrast with the bold h1 above it
- **Section eyebrow labels**: `text-sm font-medium tracking-tight text-brand-blue` (or `text-brand-teal`)
- **Muted meta text**: `text-[11px] text-brand-secondary/60` — used throughout tables, cards, profile sub-info
- **Footer section headers**: `text-xs font-medium tracking-wider uppercase text-white/40` (font-geist)
- **Font feature settings**: `cv11`, `ss01` applied globally for stylistic alternates

---

## Spacing & Layout

### Spacing Scale (Key Values in Use)

| Tailwind Token | px Value          | Common Usage                                       |
| -------------- | ----------------- | -------------------------------------------------- |
| `p-1` / `py-1` | 4px               | Badge padding, tiny button padding                 |
| `p-2` / `py-2` | 8px               | Small icon buttons, dropdown items                 |
| `p-3`          | 12px              | Table cell padding (compact), small card inner p   |
| `p-4`          | 16px              | Default card padding, header px, sidebar section p |
| `p-5`          | 20px              | Glassmorphism floating card                        |
| `p-6`          | 24px              | Card component default (`py-6 px-6`)               |
| `p-8`          | 32px              | Feature card padding (mobile), CTA card            |
| `p-12`         | 48px              | Feature card padding (desktop: `md:p-12`)          |
| `p-20`         | 80px              | CTA section (desktop: `md:p-20`)                   |
| `py-24`        | 96px (top+bottom) | Standard section vertical padding                  |
| `gap-1`        | 4px               | Tight flex gaps (badge icon)                       |
| `gap-2`        | 8px               | Icon + text in buttons, form groups                |
| `gap-3`        | 12px              | Button groups, avatar + text                       |
| `gap-4`        | 16px              | Standard card internal gap                         |
| `gap-5`        | 20px              | Dashboard main layout gap                          |
| `gap-6`        | 24px              | Card component `flex flex-col gap-6`               |
| `gap-8`        | 32px              | Grid gaps, footer column gap                       |
| `gap-12`       | 48px              | Footer section grid gaps                           |

### Breakpoints

| Name  | Breakpoint | Source                                         |
| ----- | ---------- | ---------------------------------------------- |
| `psm` | `480px`    | Custom — `@theme { --breakpoint-psm: 480px }`  |
| `bsm` | `550px`    | Custom — `@theme { --breakpoint-bsm: 550px }`  |
| `sm`  | `640px`    | Tailwind default                               |
| `md`  | `768px`    | Tailwind default                               |
| `lg`  | `1024px`   | Tailwind default                               |
| `xl`  | `1280px`   | Tailwind default (sidebar collapse breakpoint) |
| `2xl` | `1536px`   | Tailwind default                               |
| `3xl` | `1850px`   | Custom — `@theme { --breakpoint-3xl: 1850px }` |

### Grid Patterns

```
Landing hero:          lg:grid-cols-2, gap-30, max-w-[1300px]
Landing features:      lg:grid-cols-2, gap-8, max-w-7xl
Appointments stats:    grid-cols-1 md:grid-cols-3, gap-4
Feature mini-cards:    grid-cols-2, gap-3
Footer inner:          lg:grid-cols-3 (newsletter + 2 link columns)
Footer outer:          lg:grid-cols-4, gap-12
```

### Container Widths & Centering

| Context               | Max-Width                                        | Padding            | Center    |
| --------------------- | ------------------------------------------------ | ------------------ | --------- |
| Landing page sections | `max-w-7xl` (1280px)                             | `px-6`             | `mx-auto` |
| Hero section          | `max-w-[1300px]`                                 | `px-6`             | `mx-auto` |
| CTA section           | `max-w-5xl` (1024px)                             | `p-12` / `md:p-20` | `mx-auto` |
| Auth forms            | `max-w-md` (narrow) / `max-w-[590px]` (register) | `p-6 md:p-10`      | `mx-auto` |
| Nav                   | `max-w-7xl`                                      | `px-6`             | `mx-auto` |

### Page / Section Layout Patterns

- **Dashboard layout**: `flex` row — fixed sidebar + `flex-1` content column; sidebar width transitions: `w-14` (collapsed) → `w-[287px]` (expanded); `transition-[width] duration-200`
- **Dashboard header**: `h-16` fixed strip, `border-b`, `px-4 lg:px-6`
- **Dashboard content area**: `flex h-svh flex-col overflow-hidden`
- **Dashboard page body**: `bg-brand-bg px-4 sm:px-8 py-5 overflow-auto`
- **Nav bar**: `h-20`, `sticky top-0 z-50`, `bg-brand-bg/80 backdrop-blur-md`, `border-b border-brand-secondary/15`

---

## Component Design Patterns

### Cards

#### Default / Surface Card (shadcn `Card`)

```
background:    bg-card (#ffffff light)
border:        1px solid var(--border) ≈ #e5e5e5
border-radius: rounded-xl (12px)
shadow:        shadow-sm
padding:       py-6 (vertical), px-6 (content/header/footer)
text:          text-card-foreground
```

#### Stats Card (Dashboard)

```
background:    bg-white
border:        1px solid border-brand-secondary/15
border-radius: rounded-2xl (16px)
shadow:        shadow-sm shadow-brand-secondary/5
padding:       p-4
gap:           gap-3
```

- Title: `text-xs font-medium tracking-tight text-brand-secondary/80`
- Number: `text-2xl font-semibold tracking-tight text-brand-dark font-geist`
- Divider: `border-t border-dashed border-brand-secondary/15 pt-2`
- Dot indicator: `inline-block h-2 w-2 rounded-full bg-{color}`

#### Feature Cards (Landing Page)

- **Light variant**: `rounded-[2.5rem] border border-brand-secondary/10 bg-brand-bg p-8 md:p-12`; `hover:shadow-soft`; `transition-all duration-300`
- **Dark variant**: `rounded-[2.5rem] border border-white/5 bg-brand-dark p-8 md:p-12`; teal glow blur in top-right corner

#### Glassmorphism Floating Cards (Hero)

```
background:    bg-white/70
border:        border border-white/60
border-radius: rounded-2xl (16px)
shadow:        shadow-card (0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04))
backdrop-blur: backdrop-blur-xl
padding:       p-5
```

#### Experience / Education Cards (Profile)

```
background:    bg-brand-bg (#fbfbfb)
border:        border border-brand-dark/10; hover:border-brand-dark/20
border-radius: rounded-xl
padding:       p-4
transition:    transition-all
```

- Icon container: `h-10 w-10 rounded-lg bg-brand-dark/10 text-brand-dark`

#### Testimonial Cards

```
background:    bg-white/5; hover:bg-white/10
border:        border border-white/10
border-radius: rounded-2xl
padding:       p-6
transition:    transition-colors
```

#### Table / List Container

```
background:    bg-white
border:        border border-brand-secondary/15
border-radius: rounded-2xl
Header strip:  bg-brand-secondary/5 border-b border-brand-secondary/15 pt-3 pr-4 pb-2 pl-4
Footer strip:  bg-brand-secondary/5 border-t border-brand-secondary/15 pt-3 pr-4 pb-3 pl-4
Row hover:     hover:bg-brand-secondary/5
Row divider:   divide-y divide-brand-secondary/10
```

### Buttons

#### Primary (dark, shadcn `default` variant)

```css
background:    bg-primary (#262626 / brand-dark)
color:         text-primary-foreground (#fafafa)
border-radius: rounded-md
height:        h-9 (default), h-8 (sm), h-10 (lg)
padding:       px-4 py-2 (default), px-3 (sm), px-6 (lg)
font:          text-sm font-medium
hover:         hover:bg-primary/90
disabled:      disabled:opacity-50 disabled:pointer-events-none
focus:         focus-visible:ring-[3px] focus-visible:ring-ring/50
transition:    transition-all
```

#### Brand Teal CTA (landing hero primary button)

```css
background:    bg-brand-teal (#14d3ac)
color:         text-brand-dark (#00394a)
border-radius: rounded-2xl
padding:       px-8 py-4
font:          text-sm font-semibold
shadow:        shadow-xl shadow-brand-teal/20
hover:         hover:bg-brand-teal/80
transition:    transition-all
```

#### Brand Dark CTA (landing secondary CTA)

```css
background:    bg-brand-dark (#00394a)
color:         text-white
border-radius: rounded-xl
padding:       px-8 py-4
font:          text-sm font-semibold
shadow:        shadow-xl shadow-brand-dark/10
hover:         hover:bg-brand-secondary (#00546e)
transition:    transition-all
```

#### Secondary / Outline CTA (landing page)

```css
background:    bg-white
border:        border border-brand-secondary/15 (or border-brand-dark/10)
color:         text-brand-dark
border-radius: rounded-2xl (hero) / rounded-xl (CTA section)
padding:       px-8 py-4
font:          text-sm font-medium (or font-semibold)
hover:         hover:bg-brand-secondary/5
```

#### Destructive (shadcn)

```css
background:    bg-destructive
color:         text-white
hover:         hover:bg-destructive/90
focus:         focus-visible:ring-destructive/20
```

#### Ghost (shadcn)

```css
background:    transparent
hover:         hover:bg-accent hover:text-accent-foreground
dark hover:    dark:hover:bg-accent/50
```

#### Table Action Button — Accept (inline pill)

```css
background:    bg-brand-dark
border:        border border-brand-dark
color:         text-white
border-radius: rounded-full
padding:       px-2 py-1
font:          text-[11px]
hover:         hover:bg-brand-secondary
disabled:      disabled:opacity-50 disabled:cursor-not-allowed
transition:    transition-colors
```

#### Table Action Button — Cancel (inline pill)

```css
background:    bg-white
border:        border border-brand-dark/20
color:         text-brand-dark
border-radius: rounded-full
padding:       px-2 py-1
font:          text-[11px]
hover:         hover:border-brand-dark/30 hover:bg-brand-dark/5
transition:    transition-colors
```

#### Table Action Button — View (inline pill)

```css
background:    bg-white
border:        border border-brand-secondary/15
color:         text-brand-secondary
border-radius: rounded-full
padding:       px-2 py-1
font:          text-[11px]
hover:         hover:border-brand-blue/70 hover:bg-brand-blue/5
transition:    transition-colors
```

#### Icon-only Sizes

```
icon:    size-9 (36×36px)
icon-sm: size-8 (32×32px)
icon-lg: size-10 (40×40px)
```

#### Empty State Action Button

```css
background:    bg-brand-dark
color:         text-white
border-radius: rounded-full
padding:       px-4 py-2
font:          text-sm font-medium
hover:         hover:bg-brand-secondary
focus:         focus:ring-2 focus:ring-brand-secondary/40 focus:ring-offset-2
```

### Inputs, Textareas, Selects

#### Input

```
height:        h-9
border:        1px solid var(--border-input)
border-radius: rounded-md
padding:       px-3 py-1
font:          text-base md:text-sm
background:    bg-transparent (dark: bg-input/30)
shadow:        shadow-xs
placeholder:   text-muted-foreground
focus:         focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
disabled:      disabled:opacity-50 disabled:cursor-not-allowed
invalid:       aria-invalid:border-destructive aria-invalid:ring-destructive/20
transition:    transition-[color,box-shadow]
```

#### Textarea

```
min-height:    min-h-[60px]
border:        same as Input
border-radius: rounded-md
padding:       px-3 py-2
font:          text-base md:text-sm
shadow:        shadow-xs
focus:         same as Input
```

#### Select Trigger

```
height:        h-9 (default) / h-8 (sm)
border:        border border-input
border-radius: rounded-md
padding:       px-3 py-2 gap-2
font:          text-sm
shadow:        shadow-xs
focus:         focus-visible:ring-[3px] focus-visible:ring-ring/50
```

#### Checkbox

```
size:          h-4 w-4
border:        border border-brand-secondary/20 bg-white
border-radius: rounded-sm
shadow:        shadow-xs
checked:       border-brand-dark bg-brand-dark; checkmark: text-white h-3.5 w-3.5
focus:         peer-focus-visible:ring-2 peer-focus-visible:ring-brand-dark/30 peer-focus-visible:ring-offset-2
```

#### Switch

```
height:        h-[1.15rem] (≈18px)
width:         w-8 (32px)
border-radius: rounded-full
checked:       data-[state=checked]:bg-primary
unchecked:     data-[state=unchecked]:bg-input
thumb:         size-4 rounded-full bg-background
transition:    transition-all
```

#### Footer Newsletter Input (dark surface)

```
height:        h-12
border:        border border-white/10
background:    bg-white/5 backdrop-blur
border-radius: rounded-xl
padding:       px-4
font:          text-sm text-white placeholder-white/30
focus:         focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal/50
transition:    transition-all
```

### Badges and Tags

#### shadcn Badge (pill shape)

```
border-radius: rounded-full
padding:       px-2 py-0.5
font:          text-xs font-medium
border:        1px solid (variant-specific)
```

| Variant       | Background       | Text                        | Border          |
| ------------- | ---------------- | --------------------------- | --------------- |
| `default`     | `bg-primary`     | `text-primary-foreground`   | transparent     |
| `secondary`   | `bg-secondary`   | `text-secondary-foreground` | transparent     |
| `destructive` | `bg-destructive` | `text-white`                | transparent     |
| `outline`     | transparent      | `text-foreground`           | `var(--border)` |

#### Inline Status Badges (custom)

- **"Today" badge**: `border-brand-cream bg-brand-cream/70 text-brand-dark rounded-full border px-2 py-0.5 text-[11px]`
- **Eyebrow/section badge**: `rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium backdrop-blur`
- **Active hero badge**: `rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm border-brand-dark/10 text-brand-secondary`
  - Includes a `h-2 w-2 rounded-full bg-brand-teal animate-pulse` dot

#### Table Cell Badges (custom, pill)

```
Common structure:  rounded-full border px-2.5 py-1 text-[10px] font-medium
Uses brand colors per context (urgency, status, time range)
```

### Tooltips and Popovers

#### Popover

```
background:    bg-popover
text:          text-popover-foreground
border:        1px solid var(--border)
border-radius: rounded-md
padding:       p-4
shadow:        shadow-md
width:         w-72
animation:     animate-in/animate-out (fade + zoom, 4 slide directions)
z-index:       z-50
```

#### Dropdown Menu

```
background:    bg-popover
border:        1px solid var(--border)
border-radius: rounded-md
padding:       p-1 (container), px-2 py-1.5 (item)
shadow:        shadow-md
item font:     text-sm
item hover:    focus:bg-accent focus:text-accent-foreground
item radius:   rounded-sm
z-index:       z-50
animation:     same fade+zoom as popover
```

#### Language Dropdown (landing nav, custom)

```
background:    bg-white
border:        border border-brand-secondary/10
border-radius: rounded-xl
padding:       py-1 container; px-4 py-2.5 item
shadow:        shadow-card
min-width:     min-w-[120px]
item active:   text-brand-teal bg-brand-secondary/5
item hover:    hover:text-brand-dark hover:bg-brand-secondary/5
```

### Modals and Drawers

#### Dialog (Modal)

```
background:    bg-background
border:        1px solid var(--border)
border-radius: rounded-lg
padding:       p-6
shadow:        shadow-lg
max-width:     sm:max-w-lg (or calc(100%-2rem) on mobile)
overlay:       bg-black/50 fixed inset-0 z-50
z-index:       z-50
animation:     fade-in/fade-out + zoom-in-95/zoom-out-95, duration-200
gap:           gap-4 (internal grid)
close button:  absolute top-4 right-4; rounded-xs; opacity-70 hover:opacity-100
```

#### Sheet (Drawer)

```
background:    bg-background
border:        border-l (side=left) / border-r (side=right)
shadow:        shadow-lg
overlay:       bg-black/50
width:         w-3/4 sm:max-w-sm (right/left sides)
animation:     slide-in/slide-out (direction-specific), duration 300ms (close) / 500ms (open)
transition:    ease-in-out
z-index:       z-50
```

### Navigation

#### Top Nav Bar (Landing Page)

```
height:           h-20
background:       bg-brand-bg/80 (#fbfbfb at 80% opacity)
border-bottom:    border-b border-brand-secondary/15
backdrop-blur:    backdrop-blur-md
position:         sticky top-0 z-50
logo:             h-10 image + "Wi-Help" text-lg font-semibold tracking-tight text-brand-dark
nav links:        text-sm font-medium text-brand-secondary/60 hover:text-brand-dark transition-colors
```

#### Dashboard Sidebar

```
background:       bg-background (white light / #262626 dark)
border-right:     border-r (desktop)
width-open:       w-[287px]
width-closed:     w-14
transition:       transition-[width,height,margin,padding] duration-200
header height:    h-16 border-b
logo:             h-10 image
brand name:       text-xl font-bold
brand tagline:    text-muted-foreground text-xs
```

#### Sidebar Nav Items

```
container:     px-3 py-4, gap-1
item base:     flex items-center rounded-md px-3 py-2
active state:  bg-brand-cream/30 text-brand-dark font-semibold
               + left accent bar: h-7 w-1 rounded-full bg-brand-dark
inactive:      hover:bg-sidebar-accent text-brand-secondary/50
icon:          h-4 w-4; active: text-brand-dark; inactive: text-brand-secondary/50 group-hover:text-brand-dark
label:         text-sm (hidden when sidebar collapsed)
```

#### Dashboard Header

```
height:        h-16
border-bottom: border-b
padding:       px-4 lg:px-6
page title:    text-lg sm:text-xl font-semibold tracking-tight text-brand-dark
toggle button: h-7 w-7 rounded-md hover:bg-accent
wallet chip:   bg-brand-bg border border-brand-secondary/15 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 text-xs text-brand-secondary
```

#### Custom Pill Tabs (Appointments Table)

```
container:  flex items-center gap-1 overflow-x-auto pb-1 whitespace-nowrap
tab base:   rounded-full border px-3 py-1.5 text-xs font-medium transition-colors shrink-0
active:     border-brand-secondary/15 bg-white text-brand-dark
            + h-1.5 w-1.5 rounded-full bg-brand-blue dot
inactive:   border-transparent text-brand-secondary/60 hover:border-brand-secondary/15 hover:bg-white
            + h-1.5 w-1.5 rounded-full bg-brand-secondary/30 dot
```

#### shadcn Tabs

```
TabsList:    bg-muted text-muted-foreground h-10 rounded-md p-1 inline-flex
TabsTrigger: rounded-sm px-3 py-1.5 text-sm font-medium
             active: bg-background text-foreground shadow-sm rounded-sm
             transition: transition-all
TabsContent: mt-2
```

### Tables

```
container:   overflow-x-auto min-w-full
header row:  bg-white border-b border-brand-secondary/15
th:          text-[11px] font-medium tracking-wide text-brand-secondary/60 uppercase
             padding: pt-2.5 pr-4 pb-2.5 pl-4 sm:px-5
tbody:       divide-y divide-brand-secondary/10
tr hover:    hover:bg-brand-secondary/5
td:          px-4 py-3.5 text-xs sm:px-5
avatar in row: h-8 w-8 rounded-full border border-brand-secondary/15 object-cover
```

---

## Visual Effects & Motion

### Border-Radius Scale

```css
--radius-sm: calc(var(--radius) - 4px) = 6px → rounded-sm = 2px (Tailwind) /
  custom usage --radius-md: calc(var(--radius) - 2px) = 8px → rounded-md ≈ 8px
  --radius-lg: var(--radius) = 10px → rounded-lg ≈ 10px
  --radius-xl: calc(var(--radius) + 4px) = 14px → rounded-xl = 12px;
```

In practice (Tailwind classes as used in code):

| Class              | px Value | Usage                                                                       |
| ------------------ | -------- | --------------------------------------------------------------------------- |
| `rounded-sm`       | 2px      | Dropdown items, close button                                                |
| `rounded-md`       | 6px      | Inputs, buttons (default), select, nav toggle                               |
| `rounded-lg`       | 8px      | Dialog / modal                                                              |
| `rounded-xl`       | 12px     | Card component, experience cards, language dropdown                         |
| `rounded-2xl`      | 16px     | Stats cards, table container, glassmorphism cards, sheet width, empty-state |
| `rounded-3xl`      | 24px     | Trust section trust card                                                    |
| `rounded-[2.5rem]` | 40px     | Feature cards, CTA box, footer dark block                                   |
| `rounded-4xl`      | 32px     | Hero doctor image                                                           |
| `rounded-full`     | 9999px   | Pill badges, avatar, progress bar, nav dots, sidebar accent bar             |

### Box Shadows

```css
/* Custom shadows defined in @theme */
--shadow-soft: 0 4px 20px -2px rgba(0, 57, 74, 0.05);
/* Used as: shadow-soft — subtle lift, brand-colored tint */

--shadow-card: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04);
/* Used as: shadow-card — glassmorphism floating cards, language dropdown */

/* Tailwind shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) */
/* Used on: stat cards, trust icon buttons, avatar ring equivalents */

/* Tailwind shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1) */
/* Used on: dropdown, popover, sheet */

/* Tailwind shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1) */
/* Used on: dialog, sheet */

/* Tailwind shadow-xl: with brand tint */
/* shadow-xl shadow-brand-teal/20: hero CTA button */
/* shadow-xl shadow-brand-dark/10: landing secondary CTA */
/* shadow-2xl shadow-brand-dark/10: hero doctor image */
```

### Gradients

| Location                        | Type          | Value                                                                                   |
| ------------------------------- | ------------- | --------------------------------------------------------------------------------------- |
| Hero background accent          | Radial-blend  | `bg-linear-to-tr from-brand-teal/5 via-brand-blue/5 to-transparent opacity-60 blur-3xl` |
| Feature card dark glow          | Radial blur   | `bg-brand-teal/10 absolute top-0 right-0 h-64 w-64 blur-3xl rounded-full`               |
| CTA section blobs               | Radial blur   | `bg-brand-teal/5 blur-3xl` + `bg-brand-blue/5 blur-3xl`                                 |
| Trust section highlight         | Radial blur   | `bg-brand-teal/20 absolute h-20 w-20 blur-xl rounded-full`                              |
| Testimonials section glow blobs | Same pattern  | `bg-brand-teal/10`                                                                      |
| Hero doctor image mask          | Gradient mask | `mask-gradient-b` (fades image at bottom)                                               |

### Backdrop Blur

- `backdrop-blur-xl` — glassmorphism floating hero cards, landing nav
- `backdrop-blur-md` — sticky navigation bar
- `backdrop-blur` — footer newsletter input

### Overlay

```css
/* Modal/Sheet/AlertDialog overlays */
background: bg-black/50;
/* z-50, fixed inset-0 */
```

### Transition Durations & Easing

| Duration                        | Easing        | Used For                                                     |
| ------------------------------- | ------------- | ------------------------------------------------------------ |
| `duration-200`                  | default       | Sidebar width, dialog animation, most interactive components |
| `duration-300`                  | `ease-in-out` | Sheet close animation                                        |
| `duration-500`                  | `ease-in-out` | Sheet open animation; feature card hover (translate-y)       |
| `transition-all`                | —             | Feature cards, buttons (generic)                             |
| `transition-colors`             | —             | Nav links, badge tabs, table rows, nav items, footer links   |
| `transition-[color,box-shadow]` | —             | Inputs, select triggers, badges                              |
| `transition-opacity`            | —             | Dialog/sheet close button                                    |
| `transition`                    | —             | Footer links, newsletter button                              |

### Keyframe Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
/* Class: .animate-float — hero dashboard revenue card */

@keyframes float-reverse {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(10px); }
}
/* Class: .animate-float-reverse (implied for second hero card) */

/* Radix UI data-state animations (via tw-animate-css) */
data-[state=open]:animate-in
data-[state=closed]:animate-out
fade-in-0 / fade-out-0
zoom-in-95 / zoom-out-95
slide-in-from-top-2 / slide-in-from-bottom-2 / etc.

/* Spinner */
.animate-spin — on Spinner component (border-t-brand-dark border-brand-secondary/20)

/* Pulse dot */
.animate-pulse — on status indicator dots (brand-teal, brand-blue)
```

---

## Icons & Imagery

### Icon Libraries

| Library                 | Import Path           | Usage Scope                                                                               |
| ----------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| **Lucide React**        | `lucide-react`        | Primary icon library — used everywhere across landing, dashboard, and feature components  |
| **@tabler/icons-react** | `@tabler/icons-react` | Secondary — used in sidebar user nav (`IconDotsVertical`, `IconLogout`, `IconUserCircle`) |

### Standard Icon Sizes

| Context                             | Size    | Class                                                 |
| ----------------------------------- | ------- | ----------------------------------------------------- |
| Button icon (default)               | 16×16px | `[&_svg:not([class*='size-'])]:size-4` (auto-applied) |
| Inline / table                      | 16×16px | `h-4 w-4`                                             |
| Nav toggle / header                 | 16×16px | `h-4 w-4`                                             |
| Feature section icons               | 24×24px | `h-6 w-6`                                             |
| CTA section icon                    | 28×28px | `h-7 w-7`                                             |
| Trust step icons                    | 20×20px | `h-5 w-5`                                             |
| Experience/Education icon container | 40×40px | `h-10 w-10 rounded-lg` (icon inside: `h-5 w-5`)       |
| Feature card icon container         | 48×48px | `h-12 w-12 rounded-2xl` (icon inside: `h-6 w-6`)      |
| Trust icon container                | 40×40px | `h-10 w-10 rounded-full`                              |
| Sidebar nav icon                    | 16×16px | `h-4 w-4`                                             |
| Dashboard header                    | 14×14px | `h-3.5 w-3.5` (wallet icon)                           |
| Alert icon                          | 16×16px | `[&>svg]:size-4`                                      |
| Tabler sidebar user                 | 16×16px | `size-4`                                              |

### Common Lucide Icons Used

`Search`, `ArrowRight`, `Menu`, `X`, `XIcon`, `ChevronDown`, `PanelRight`, `Calendar`, `CalendarDays`, `Activity`, `HeartPulse`, `Stethoscope`, `CheckCircle2`, `CheckCircle`, `Shield`, `GraduationCap`, `Briefcase`, `MapPin`, `Mail`, `Phone`, `DollarSign`, `Star`, `Upload`, `FileText`, `FileBadge`, `Award`, `BookOpen`, `Building2`, `Facebook`, `Instagram`, `Twitter`, `Globe`, `Wallet`, `Loader2`

### Images

- **Avatar/Profile images**: `h-8 w-8 rounded-full` (table, sidebar), `h-10 w-10 rounded-full` (testimonials), `h-11 w-11 rounded-full` (feature card profile)
- **Avatar border**: `border-2 border-white` (hero stacked avatars), `ring-2 ring-white shadow-sm` (feature card), `ring-2 ring-brand-teal/50` (testimonials)
- **Avatar fallback**: `bg-muted flex size-full items-center justify-center rounded-full` — initials 2-char
- **Hero doctor image**: `h-full w-full rounded-4xl object-cover shadow-2xl mask-gradient-b`
- **Logo mark**: `h-10` image (`Icon-2.png` local asset) throughout nav, sidebar, auth
- **App store badges**: fixed widths (132px Apple, 148.5px Google)

---

## Voice & Tone of the Design

### Overall Aesthetic

**Clean, minimal, professional with warm brand accents.** The design falls between "corporate SaaS" and "modern consumer health app." It avoids clinical coldness with warm brand colors (`#14d3ac` teal, `#ffecb4` cream) while maintaining high legibility and information density appropriate for a medical scheduling platform.

### Key Visual Identity Signals

1. **Primary brand color** `#00394a` (deep teal-dark) used consistently for headings, active states, and primary CTAs — creates trust/authority association.
2. **Accent teal** `#14d3ac` signals success, health, and "go" — used for verification badges, primary hero CTA, and animated pulse dots.
3. **Cream** `#ffecb4` appears only for warm/pending/amber states — softens warnings.
4. **Light page backgrounds**: `#fbfbfb` body, `bg-brand-bg` dashboard content — "off-white, never pure white for surfaces."

### Visual Hierarchy Strategy

- **Size + weight contrast**: Hero h1 is enormous (`text-7xl font-semibold`) paired with light-weight subtitle (`font-light text-brand-secondary/50`) — eye goes to headline first.
- **Color contrast**: Dark brand headings on near-white backgrounds. Teal accent draws eye to CTAs.
- **Depth via blurs**: Hero uses `blur-3xl` background orbs and `backdrop-blur-xl` glassmorphism cards to create layered depth.
- **Subtle elevation**: `shadow-sm shadow-brand-secondary/5` on dashboard stat cards; `shadow-card` on floating UI elements.

### Recurring Design Motifs

1. **Pill shapes**: Badges, tab filters, and small action buttons all use `rounded-full` — creates a friendly, modern feel.
2. **Glassmorphism accent cards**: `bg-white/70 backdrop-blur-xl border-white/60` — used in hero section floating cards.
3. **Dashed dividers**: `border-t border-dashed border-brand-secondary/15` — used inside stat cards to separate data from sub-labels.
4. **Animated pulse dot**: `h-2 w-2 rounded-full bg-brand-teal animate-pulse` — "live/online" status indicator, used in hero badge and feature card.
5. **Large radius feature blocks**: `rounded-[2.5rem]` on landing section cards and footer — gives a "cards floating on a page" feel.
6. **Dark section alternation**: Landing page alternates between `bg-white`, `bg-brand-secondary/5`, and `bg-brand-dark` sections for visual rhythm.
7. **Active nav indicator**: Left-edge accent bar (`h-7 w-1 rounded-full bg-brand-dark`) on active sidebar items.
8. **Active sidebar item background** is specifically `bg-brand-cream/30` — a warm cream tone that references `brand-cream`, tying the active state to the brand.

---

---

## Mobile Design System (React Native / Expo / NativeWind)

> Source: `/mobile`. The mobile app is a React Native (Expo) application using **NativeWind v4** (Tailwind CSS for RN) and **react-native-reanimated** for animations. Brand colors are identical to the web; component patterns share the same visual language but are implemented with RN primitives.

### Mobile Technology Stack

| Layer           | Library                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| Framework       | Expo (Expo Router file-based routing)                                               |
| Styling         | NativeWind v4 (`className` props on RN Views/Text/Pressable)                        |
| Tailwind config | `tailwind.config.js` — `presets: [require("nativewind/preset")]`                    |
| Animations      | `react-native-reanimated` (shared values, `withRepeat`/`withSequence`/`withTiming`) |
| Icons           | `@expo/vector-icons` — **Ionicons** exclusively                                     |
| Toast           | `react-native-toast-message` (custom config)                                        |
| Forms           | `react-hook-form` + `zod`                                                           |

---

### Mobile Color Tokens

Brand colors are defined in `tailwind.config.js` `theme.extend.colors` and are **100% identical to the web palette**:

| Token             | Hex       | Tailwind Class                                          |
| ----------------- | --------- | ------------------------------------------------------- |
| `brand-dark`      | `#00394a` | `text-brand-dark`, `bg-brand-dark`, `border-brand-dark` |
| `brand-secondary` | `#00546e` | `text-brand-secondary`                                  |
| `brand-blue`      | `#3fa6ff` | `text-brand-blue`, `bg-brand-blue`                      |
| `brand-teal`      | `#14d3ac` | `bg-brand-teal`, `text-brand-teal`, `border-brand-teal` |
| `brand-light`     | `#00e984` | `text-brand-light` (icon color in welcome screen)       |
| `brand-cream`     | `#ffecb4` | `bg-brand-cream`                                        |
| `brand-bg`        | `#fbfbfb` | `bg-brand-bg` (default screen background)               |

Additional hardcoded values used in `StyleSheet.create` (not Tailwind):

| Purpose                    | Hex                                        |
| -------------------------- | ------------------------------------------ |
| Welcome screen glow circle | `#e6fbf6`                                  |
| Logo inner container bg    | `#f4fcf9`                                  |
| Input placeholder text     | `rgba(0,84,110,0.45)` (brand-secondary/45) |
| Toast title color          | `#00394a` (brand-dark)                     |
| Toast subtitle color       | `rgba(0,84,110,0.60)` (brand-secondary/60) |
| Checkbox unchecked border  | `border-brand-secondary/15` / `bg-white`   |
| Form field border          | `border-brand-secondary/15`                |
| Select backdrop            | `rgba(0,0,0,0.4)`                          |

No dark mode is implemented in the mobile app.

---

### Mobile Typography

The mobile app uses the **system default font stack** (no custom Google Fonts loaded). All typography is expressed via NativeWind Tailwind text utilities applied directly to `<Text>` components.

| Usage                      | Classes                                                                      | Notes                             |
| -------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| Screen main heading        | `text-3xl font-semibold tracking-tight text-brand-dark`                      | Login/Register h1, Welcome title  |
| Brand name inline          | `text-xl font-semibold tracking-tight text-brand-dark`                       | Logo lockup                       |
| Body/description text      | `text-base text-brand-secondary opacity-80`                                  | Auth sub-heading                  |
| Form field label           | `text-base font-medium text-brand-dark`                                      | All Input/Select/DateInput labels |
| Small body text            | `text-sm font-medium text-brand-secondary/60`                                | Welcome tagline                   |
| Step indicator             | `text-sm font-medium text-brand-secondary`                                   | Register multi-step label         |
| Step breadcrumb — active   | `text-xs font-medium text-brand-dark`                                        |                                   |
| Step breadcrumb — inactive | `text-xs text-brand-secondary/50`                                            |                                   |
| Error text                 | `text-sm text-brand-secondary`                                               | Below Input/Select on error       |
| Role switcher — active     | `text-sm font-semibold text-brand-dark`                                      |                                   |
| Role switcher — inactive   | `text-sm font-semibold text-brand-secondary/50`                              |                                   |
| Remember me / link text    | `text-base text-brand-secondary`                                             |                                   |
| Language toggle label      | `text-sm font-medium text-brand-secondary`                                   |                                   |
| Toast title                | `fontSize: 14, fontWeight: "600", color: "#00394a"` (StyleSheet)             |                                   |
| Toast subtitle             | `fontSize: 13, fontWeight: "400", color: "rgba(0,84,110,0.60)"` (StyleSheet) |                                   |
| Home screen heading        | `text-2xl font-semibold text-brand-dark`                                     |                                   |
| Home screen sub            | `text-base text-brand-secondary`                                             |                                   |
| Select heading (sheet)     | `text-lg font-semibold text-brand-dark`                                      |                                   |

---

### Mobile Spacing & Layout

#### Screen Structure

All authenticated and auth screens follow this pattern:

```
<SafeAreaView className="flex-1 bg-brand-bg">
  <View className="flex-1 px-6 pb-8">
    {/* content */}
  </View>
</SafeAreaView>
```

- **Horizontal screen padding**: `px-6` (24px each side)
- **Bottom padding**: `pb-8` (32px)
- **Top padding**: `pt-2` (language toggle area), `pt-6` (form area after back button)
- **Back button top margin**: `mt-14` (56px — clears status bar + buffer)

#### Form Layout

```
gap-y-5  — between form fields
gap-y-1.5 — between label and input within a field group
mt-6     — between last field group and action buttons
gap-y-3  — between stacked buttons (Welcome screen)
gap-x-3  — between side-by-side buttons (Register back/next)
mb-10    — branding block bottom margin (Login)
mb-8     — branding block bottom margin (Register)
mb-6     — role switcher + progress bar bottom margin
```

---

### Mobile Component Patterns

#### Button

```
Base:     flex-row items-center justify-center rounded-full active:opacity-80
Disabled: opacity-60

default:  bg-brand-dark / text-white font-semibold
outline:  border border-brand-dark bg-transparent / text-brand-dark font-semibold
ghost:    bg-transparent / text-brand-dark font-semibold
destructive: bg-brand-dark / text-white font-semibold

sm:       px-4 py-2 / text-sm
default:  px-6 py-3.5 / text-base
lg:       px-8 py-4 / text-lg

Loading:  ActivityIndicator (color: white for default/destructive, #00394a for outline/ghost)
```

#### Input

```
Container:   w-full
Label:       text-base font-medium text-brand-dark mb-1.5
Field:       w-full rounded-xl border border-brand-secondary/15 bg-brand-bg px-4 py-3.5 text-base text-brand-dark
Error state: border-brand-dark
Error text:  mt-1 text-sm text-brand-secondary
Placeholder: rgba(0,84,110,0.45) (hardcoded via placeholderTextColor prop — brand-secondary at 45%)
Icon inset:  left icon at: absolute left-3.5 top-3.5; field gets pl-11
             right icon: absolute right-3.5 top-3.5; field gets pr-11
```

#### Card (base component)

```
rounded-2xl border border-brand-secondary/10 bg-white p-4 shadow-sm
```

#### Select (bottom-sheet picker)

```
Trigger:     w-full flex-row items-center justify-between rounded-xl border border-brand-secondary/15 bg-brand-bg px-4 py-3.5
             Disabled: opacity-50
             Error:    border-brand-dark
Chevron:     Ionicons "chevron-down" size=18 color=rgba(0,84,110,0.45)
Label:       same as Input label pattern (mb-1.5)

Bottom sheet modal:
  Backdrop:  rgba(0,0,0,0.4) animated opacity (spring in, timing out)
  Sheet:     rounded-t-2xl bg-white px-4 pb-8 pt-4 / maxHeight: 560
  Animation: spring in translateY (toValue:0, damping:28, stiffness:220) from translateY:600
             timing out (250ms)
  Header:    text-lg font-semibold text-brand-dark + close Ionicons "close" size=24 color=#00394a
  Search:    mb-3 rounded-xl border border-brand-secondary/15 bg-brand-bg px-4 py-3 text-base text-brand-dark
  List item: border-b border-brand-secondary/10 px-2 py-3.5 / selected: bg-brand-bg
             selected text: font-semibold text-brand-dark
             checkmark: Ionicons "checkmark" size=20 color=#3fa6ff
```

#### DateInput

```
Wrapper:  gap-y-1.5
Label:    text-base font-medium text-brand-dark
Field:    Input with pl-11; icon: Ionicons "calendar-outline" size=20 color=rgba(0,84,110,0.45) at absolute left-3.5 top-3.5
Mask:     DD/MM/YYYY auto-format (numeric keyboard, maxLength:10)
```

#### ProgressBar

```
Track:    h-2 w-full overflow-hidden rounded-full bg-brand-secondary/15
Fill:     h-full rounded-full bg-brand-teal (width = % via inline style)
```

#### Checkbox (inline, Login screen)

```
Container:  h-5 w-5 rounded-md border-2; items-center justify-center
Unchecked:  border-brand-secondary/15 bg-white
Checked:    border-brand-teal bg-brand-teal; Ionicons "checkmark" size=12 color=white
```

#### Role Switcher (segmented control, Register screen)

```
Outer:    flex-row rounded-2xl bg-brand-secondary/10 p-1 mb-6
Option:   flex-1 items-center rounded-xl py-2.5
Active:   bg-white shadow-sm / text-sm font-semibold text-brand-dark
Inactive: bg-transparent / text-sm font-semibold text-brand-secondary/50
```

#### Back Button

```
ml-6 mt-14 h-10 w-10 items-center justify-center rounded-full bg-brand-secondary/10
Icon: Ionicons "chevron-back" size=20 color=#00394a
```

#### Language Toggle (Welcome & Register screens)

```
flex-row items-center gap-x-1.5 rounded-full border border-brand-secondary/15 bg-white px-3 py-1.5
Icon: Ionicons "globe-outline" size=15 color=#00546e
Text: text-sm font-medium text-brand-secondary
```

---

### Mobile Toast Notifications

Custom `react-native-toast-message` config with three types (`success`, `error`, `info`):

```javascript
// StyleSheet values (not Tailwind)
container: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#ffffff",
  borderRadius: 14,
  borderLeftWidth: 4,        // Left-accent stripe — color varies by type
  paddingVertical: 12,
  paddingHorizontal: 14,
  marginHorizontal: 16,
  gap: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 6,
  minWidth: 280,
  maxWidth: 360,
}
```

| Type      | Border-left color           | Icon                            | Icon color |
| --------- | --------------------------- | ------------------------------- | ---------- |
| `success` | `#14d3ac` (brand-teal)      | `checkmark-circle` (Ionicons)   | `#14d3ac`  |
| `error`   | `#00546e` (brand-secondary) | `close-circle` (Ionicons)       | `#00546e`  |
| `info`    | `#3fa6ff` (brand-blue)      | `information-circle` (Ionicons) | `#3fa6ff`  |

---

### Mobile Visual Effects & Motion

#### Welcome Screen Illustration

```
Outer container:    h-64 w-64, items: center, justify: center
Glow circle:         StyleSheet.absoluteFillObject, borderRadius: 9999,
                     backgroundColor: "#e6fbf6", opacity: 0.7
Center circle:       h-40 w-40 rounded-full border-white bg-[#f4fcf9]
Logo card inner:     h-24 w-24 rounded-2xl border-brand-secondary/10 bg-white
                     transform: [{ rotate: "3deg" }]
                     shadowColor: "#14d3ac", shadowOffset: {0,4}, shadowOpacity: 0.06, shadowRadius: 10
Logo image:          h-14 w-14 resizeMode="contain"
```

#### Floating Elements (react-native-reanimated)

Three animated elements float independently using `useBounce` (custom hook):

| Element                         | Icon              | Size                     | Color                   | Duration | Delay  |
| ------------------------------- | ----------------- | ------------------------ | ----------------------- | -------- | ------ |
| Heart (top-right)               | `heart-outline`   | 22                       | `#14d3ac`               | 3000ms   | 0ms    |
| Pulse/stethoscope (bottom-left) | `pulse-outline`   | 18                       | `#00e984` (brand-light) | 4000ms   | 500ms  |
| Blue dot (mid-right)            | solid circle view | 8×8px / `#3fa6ff` op 0.8 | —                       | 3500ms   | 1000ms |

**Animation curve**: `Easing.inOut(Easing.sin)` — half duration up (translateY: 0 → -10), half down (→ 0). Repeats infinite (`-1`).

```javascript
// Shared float shadow style (all floating cards)
floatShadow: {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
}
```

Floating icon containers: `rounded-full border border-brand-secondary/10 bg-white p-3` (heart), `p-2.5` (pulse), `p-1.5` (dot)

#### Screen Transitions

Navigation uses Expo Router `<Stack>` with `headerShown: false`. No custom transition overrides — uses platform defaults (iOS slide, Android fade).

---

### Mobile Icons

**Icon library**: `@expo/vector-icons` — **Ionicons only** (no Lucide, no Tabler).

| Context               | Icon name                         | Size | Color                 |
| --------------------- | --------------------------------- | ---- | --------------------- |
| Back button           | `chevron-back`                    | 20   | `#00394a`             |
| Language globe        | `globe-outline`                   | 15   | `#00546e`             |
| Email field           | `mail-outline`                    | 20   | `rgba(0,84,110,0.45)` |
| Password field        | `lock-closed-outline`             | 20   | `rgba(0,84,110,0.45)` |
| Show/hide password    | `eye-outline` / `eye-off-outline` | 20   | `rgba(0,84,110,0.45)` |
| Calendar / date field | `calendar-outline`                | 20   | `rgba(0,84,110,0.45)` |
| Select chevron        | `chevron-down`                    | 18   | `rgba(0,84,110,0.45)` |
| Select close          | `close`                           | 24   | `#00394a`             |
| Select checkmark      | `checkmark`                       | 20   | `#3fa6ff`             |
| Checkbox checked      | `checkmark`                       | 12   | `white`               |
| Toast success         | `checkmark-circle`                | 22   | `#14d3ac`             |
| Toast error           | `close-circle`                    | 22   | `#00546e`             |
| Toast info            | `information-circle`              | 22   | `#3fa6ff`             |
| Welcome heart         | `heart-outline`                   | 22   | `#14d3ac`             |
| Welcome pulse         | `pulse-outline`                   | 18   | `#00e984`             |

---

### Mobile vs Web: Key Differences

| Concern                  | Web (frontend/)                                                  | Mobile (mobile/)                                                                                 |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Styling engine           | Tailwind CSS v4 (browser CSS)                                    | NativeWind v4 (React Native StyleSheet)                                                          |
| Font family              | Inter Tight (custom, Google Fonts)                               | System default (no custom font loaded)                                                           |
| Dark mode                | Full dark mode via `.dark` class                                 | Not implemented                                                                                  |
| Icons                    | Lucide React + @tabler/icons-react                               | @expo/vector-icons Ionicons only                                                                 |
| Shadows                  | `box-shadow` / Tailwind shadow utilities                         | `StyleSheet` shadow props (shadowColor, shadowOffset, shadowOpacity, shadowRadius) + `elevation` |
| Border radius on buttons | `rounded-md` (web), or `rounded-2xl`/`rounded-full` contextually | `rounded-full` on ALL buttons (never rectangular)                                                |
| Modal/drawer             | Radix UI Dialog + Sheet                                          | React Native `Modal` with custom `Animated` bottom sheet                                         |
| Toasts                   | Sonner library                                                   | `react-native-toast-message` (custom config)                                                     |
| Navigation header        | Custom `DashboardHeader` component                               | Hidden (`headerShown: false`), custom back button                                                |
| Select/Dropdown          | Radix UI SelectPrimitive                                         | Custom Modal bottom-sheet with animated slide                                                    |
| Glassmorphism            | `backdrop-blur-xl bg-white/70`                                   | Not used (no CSS backdrop-filter in RN)                                                          |
| Progress                 | `@radix-ui/react-progress`                                       | Custom `ProgressBar` component                                                                   |

---

## 🤖 Instructions for AI Assistants

You are generating UI code for **Wi-Help**, a medical home-care marketplace. Strictly follow this design system:

**Colors**: Use **only** the defined brand tokens — `brand-dark` (`#00394a`), `brand-secondary` (`#00546e`), `brand-teal` (`#14d3ac`), `brand-blue` (`#3fa6ff`), `brand-light` (`#00e984`), `brand-cream` (`#ffecb4`), `brand-bg` (`#fbfbfb`) — and their tints/shades expressed via Tailwind opacity modifiers (`/5`, `/10`, `/15`, `/20`, `/30`, `/40`, `/50`, `/60`, `/70`, `/80`) or `rgba()` equivalents. Never use `red`, `yellow`, `green`, `blue`, `orange`, `purple`, `slate`, `gray`, or any other Tailwind color scale. For neutral/secondary text use `text-brand-secondary/60` (muted), `text-brand-secondary/80` (secondary), `text-brand-dark` (primary). For subtle borders use `border-brand-secondary/10` or `border-brand-secondary/15`. For hover/subtle backgrounds use `bg-brand-secondary/5` or `bg-brand-secondary/10`. For status states: success → `brand-teal`; warning/pending → `brand-cream`; info → `brand-blue`; error/destructive → `brand-dark`. The same brand hex palette applies to both web and mobile.

**Typography (web)**: Default body font is `font-inter-tight`; use `font-geist` for display numbers, footer headlines, and prominent UI stat values. Never introduce a new font family. Headings use `text-brand-dark font-semibold tracking-tight`. Muted labels use `text-[11px] text-brand-secondary/60` or `text-xs text-muted-foreground`.

**Typography (mobile)**: No custom font is loaded — use system default. Apply the same semantic patterns: screen headings are `text-3xl font-semibold tracking-tight text-brand-dark`, form labels are `text-base font-medium text-brand-dark`, muted secondary text is `text-base text-brand-secondary opacity-80` or `text-sm text-brand-secondary/60`.

**Spacing**: Adhere to the Tailwind spacing scale; do not use arbitrary px values except for the established patterns (`w-[287px]`, `max-w-[1300px]`, `max-w-[590px]`, `rounded-[2.5rem]`, `text-[10px]`, `text-[11px]` on web; `mt-14`, `py-3.5`, `px-3.5` on mobile).

**Web components**: Build all interactive primitives (buttons, inputs, dialogs, tabs, badges) on top of the existing shadcn/Radix components. Use `rounded-2xl` for dashboard cards, `rounded-full` for pills and badges, `rounded-[2.5rem]` for large landing-page feature blocks. Follow the exact padding, shadow, and border patterns documented above.

**Mobile components**: Use the existing `Button`, `Input`, `Card`, `Select`, `ProgressBar`, `DateInput` primitives. Buttons are **always** `rounded-full`. Inputs and selects use `rounded-xl border border-brand-secondary/15 bg-brand-bg`. Use Ionicons exclusively — never Lucide or other icon libraries. Use `react-native-reanimated` for animations, not `Animated` API unless already established. Never implement glassmorphism or backdrop-blur in mobile.

**Aesthetic**: Clean, minimal, and professional with warm teal/cream accents. Never deviate from the color token system by hardcoding hex values outside the brand palette. Never introduce new font families, shadow definitions, or animation patterns not present in the codebase. On web, never use inline styles except the three established global body styles. On mobile, use `StyleSheet.create` for values that cannot be expressed via NativeWind (shadows, absolute positions, complex transforms).
