# MedExplain AI - Design Document

## 1. Design Philosophy

### 1.1 Core Principles
- **Accessibility First**: Design for the most vulnerable users - elderly, low-literacy, rural populations
- **Voice First**: Prioritize voice interactions over text-based navigation
- **Trust & Security**: Visual indicators of privacy and blockchain verification
- **Simplicity**: Remove complexity, use clear language and intuitive interfaces
- **Cultural Sensitivity**: Respect diverse cultural contexts in medical communication

### 1.2 Design Values
- **Inclusive**: Works for everyone regardless of age, literacy, or technical skill
- **Compassionate**: Empathetic tone in all medical explanations
- **Transparent**: Clear about AI limitations and when to consult doctors
- **Empowering**: Helps users understand and take control of their health

## 2. Visual Design System

### 2.1 Color Palette

#### Primary Colors
- **Medical Green** (#2d7d32)
  - Represents: Healing, clarity, trust, growth
  - Usage: Primary actions, success states, health indicators
  - Shades: 50-900 scale for various UI elements

- **Privacy Black** (#1a1a1a)
  - Represents: Security, professionalism, privacy
  - Usage: Headers, important text, security features
  - Shades: 50-950 scale for backgrounds and text

#### Secondary Colors
- **Success Green**: #4caf50 - Positive health indicators, completed actions
- **Warning Yellow**: #ff9800 - Medium risk, important notices
- **Error Red**: #f44336 - High risk, critical alerts, errors
- **Info Blue**: #2196f3 - Information, links, voice features

#### Neutral Colors
- **Gray Scale**: 50-900 for backgrounds, borders, disabled states
- **White**: #ffffff - Clean backgrounds, cards
- **Off-White**: #f6f6f6 - Subtle backgrounds

### 2.2 Typography

#### Font Family
- **Primary**: Inter (system font fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")
- **Reason**: Excellent readability, supports multiple languages, web-safe

#### Font Sizes (Elder-Friendly Scale)
- **Extra Large**: 28px (elder-2xl) - Main headings
- **Large**: 22px (elder-lg) - Section headings
- **Base**: 18px (elder-base) - Body text, default
- **Medium**: 16px (elder-sm) - Secondary text
- **Small**: 14px - Captions, footnotes (use sparingly)

#### Font Weights
- **Bold** (700): Headings, important information
- **Semibold** (600): Subheadings, emphasis
- **Medium** (500): Buttons, labels
- **Regular** (400): Body text

#### Line Height
- **1.6**: Default for all text (improved readability)
- **1.8**: For long-form medical content

### 2.3 Spacing System

#### Base Unit: 4px
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **elder**: 24px (1.5rem) - Minimum spacing for elder-friendly design
- **elder-lg**: 32px (2rem) - Section spacing
- **elder-xl**: 48px (3rem) - Major section breaks

### 2.4 Touch Targets

#### Minimum Sizes
- **Standard**: 44x44px (WCAG AA requirement)
- **Elder-Friendly**: 60x60px (recommended for primary actions)
- **Spacing**: Minimum 8px between interactive elements

#### Button Sizes
- **Small**: 44px height, 100px min-width
- **Medium**: 50px height, 120px min-width
- **Large**: 60px height, 150px min-width (primary actions)

### 2.5 Iconography

#### Icon Style
- **Type**: Emoji-based for universal recognition
- **Size**: 24px-32px standard, 40px-48px for primary actions
- **Usage**: Always pair with text labels for clarity

#### Common Icons
- 📄 Document/Report
- 💊 Prescription/Medication
- 🎤 Voice Input
- 🔊 Voice Output
- 🔒 Security/Privacy
- ✅ Success/Verified
- ⚠️ Warning
- 🚨 High Risk/Alert
- 📊 Analytics/Timeline
- 🌍 Language Selection

### 2.6 Elevation & Shadows

#### Shadow Levels
- **Level 1** (Cards): 0 1px 3px rgba(0,0,0,0.12)
- **Level 2** (Raised elements): 0 4px 6px rgba(0,0,0,0.1)
- **Level 3** (Modals): 0 10px 25px rgba(0,0,0,0.15)
- **Level 4** (Overlays): 0 20px 40px rgba(0,0,0,0.2)

#### Border Radius
- **Small**: 4px - Input fields, small buttons
- **Medium**: 8px - Cards, standard buttons
- **Large**: 12px - Large cards, containers
- **Extra Large**: 16px - Modal dialogs

## 3. Component Design

### 3.1 Language Selector

#### Layout
```
┌─────────────────────────────────────────┐
│  Select Your Language                    │
│  भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക        │
├─────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ English │  │ हिन्दी  │  │ മലയാളം │ │
│  │   🌍    │  │   🌍    │  │   🌍    │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

#### Specifications
- **Button Size**: 60px height minimum
- **Grid**: 3 columns on desktop, 1 column on mobile
- **Active State**: Green border, green background tint
- **Hover State**: Subtle border color change
- **Focus State**: 4px green ring for keyboard navigation

### 3.2 Voice Control Panel

#### Layout
```
┌─────────────────────────────────────────┐
│  🎤 Voice Command    🎵 Test Voice      │
│  [  Listening...  ]  [  Speaking...  ]  │
└─────────────────────────────────────────┘
```

#### States
- **Idle**: Blue background, static icon
- **Listening**: Red background, pulsing animation
- **Speaking**: Blue background, pulsing animation
- **Error**: Red border, error message below

#### Specifications
- **Button Height**: 50px
- **Icon Size**: 24px
- **Animation**: Pulse effect at 1.5s interval
- **Feedback**: Visual + audio confirmation

### 3.3 Upload Zone

#### Layout
```
┌─────────────────────────────────────────┐
│              📄                          │
│    Drop your medical report here        │
│         or click to browse              │
│                                          │
│      [    Choose Files    ]             │
│                                          │
│  🔒 Your Privacy is Protected           │
│  All files are encrypted end-to-end     │
└─────────────────────────────────────────┘
```

#### States
- **Default**: Dashed border, gray background
- **Drag Over**: Green border, green tint background
- **Uploading**: Progress bar, loading animation
- **Success**: Green checkmark, success message
- **Error**: Red border, error message

#### Specifications
- **Min Height**: 200px
- **Border**: 2px dashed
- **Padding**: 32px
- **Drop Zone**: Full area clickable

### 3.4 Analysis Card

#### Layout
```
┌─────────────────────────────────────────┐
│  AI Analysis Results        🎵 Listen   │
│                          ✅ Low Risk    │
├─────────────────────────────────────────┤
│  Summary                                 │
│  Your blood test results show normal... │
│                                          │
│  Key Findings                            │
│  • Hemoglobin: Normal range             │
│  • Blood sugar: Slightly elevated       │
│                                          │
│  Recommendations                         │
│  → Consult your doctor about...         │
│                                          │
│  ⚠️ Important: This AI analysis is for  │
│  informational purposes only...          │
└─────────────────────────────────────────┘
```

#### Specifications
- **Card Padding**: 24px
- **Section Spacing**: 16px between sections
- **Risk Badge**: Top-right corner, color-coded
- **Listen Button**: Each section has voice playback
- **Disclaimer**: Yellow background, always visible

### 3.5 Blockchain Verification Badge

#### Layout
```
┌─────────────────────────────────────────┐
│  ✅  Blockchain Verified                │
│  Document integrity confirmed on        │
│  Polygon network                         │
│  Hash: 0x1234...  Stored: 2026-02-05   │
│                          [🔄 Verify]    │
└─────────────────────────────────────────┘
```

#### States
- **Verified**: Green background, checkmark
- **Verifying**: Gray background, loading spinner
- **Failed**: Red background, X icon
- **Not Verified**: Yellow background, warning icon

## 4. Screen Designs

### 4.1 Home Screen

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  🏥 MedExplain AI                       │
│  Making health understanding universal  │
├─────────────────────────────────────────┤
│  Language Selector Component            │
├─────────────────────────────────────────┤
│  Voice Control Panel                    │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐              │
│  │Upload│ │Reports│ │Rx  │              │
│  └─────┘ └─────┘ └─────┘              │
│                                          │
│  [Active Tab Content]                   │
└─────────────────────────────────────────┘
```

#### Responsive Behavior
- **Desktop**: 3-column tab layout
- **Tablet**: 3-column tab layout (smaller)
- **Mobile**: Stacked vertical tabs

### 4.2 Dashboard Screen

#### Navigation Tabs
1. **Upload Report** - Primary action
2. **My Reports** - Document history
3. **Prescriptions** - Medication management

#### Tab Content Areas
- **Upload**: Upload zone + recent uploads
- **Reports**: List view with filters
- **Prescriptions**: Medication cards with details

### 4.3 Analysis Screen

#### Layout
```
┌─────────────────────────────────────────┐
│  ← Back to Reports                      │
├─────────────────────────────────────────┤
│  Blood Test Report - Jan 15, 2026      │
│  🔒 Encrypted  ✅ Verified              │
├─────────────────────────────────────────┤
│  Analysis Card Component                │
├─────────────────────────────────────────┤
│  Blockchain Verification Badge          │
├─────────────────────────────────────────┤
│  [Share Report]  [Download PDF]         │
└─────────────────────────────────────────┘
```

### 4.4 Timeline Screen

#### Layout
```
┌─────────────────────────────────────────┐
│  Health Timeline                         │
│  📊 View your health journey            │
├─────────────────────────────────────────┤
│  [Filter: All | Reports | Prescriptions]│
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Feb 2026                         │   │
│  │ ○ Blood Test - Feb 5            │   │
│  │ ○ Prescription - Feb 1          │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Jan 2026                         │   │
│  │ ○ X-Ray Report - Jan 20         │   │
│  │ ○ Blood Test - Jan 15           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 4.5 Privacy Settings Screen

#### Layout
```
┌─────────────────────────────────────────┐
│  Privacy & Permissions                   │
├─────────────────────────────────────────┤
│  Data Sharing                            │
│  ┌─────────────────────────────────┐   │
│  │ Dr. Smith                        │   │
│  │ Access: Blood Tests only         │   │
│  │ Expires: Feb 28, 2026            │   │
│  │ [Revoke Access]                  │   │
│  └─────────────────────────────────┘   │
│                                          │
│  Access History                          │
│  • Dr. Smith viewed Blood Test - Feb 5  │
│  • You uploaded X-Ray - Feb 1           │
│                                          │
│  [Export My Data]  [Delete Account]     │
└─────────────────────────────────────────┘
```

## 5. Interaction Design

### 5.1 Voice Interactions

#### Voice Commands
- "Upload document"
- "Read my latest report"
- "Explain this medication"
- "Show my health timeline"
- "What does [medical term] mean?"
- "Help"

#### Voice Feedback
- Confirmation sounds for actions
- Error sounds for failures
- Progress updates during long operations
- Natural language responses

### 5.2 Animations

#### Micro-interactions
- **Button Press**: Scale down to 0.95, duration 100ms
- **Card Hover**: Lift with shadow, duration 200ms
- **Loading**: Spinner rotation, infinite
- **Success**: Checkmark draw animation, duration 500ms
- **Error**: Shake animation, duration 300ms

#### Page Transitions
- **Fade In**: Opacity 0 to 1, duration 300ms
- **Slide Up**: Transform translateY(20px) to 0, duration 400ms
- **Modal**: Backdrop fade + content scale, duration 300ms

### 5.3 Gestures (Mobile)

#### Supported Gestures
- **Swipe Left/Right**: Navigate between tabs
- **Pull Down**: Refresh content
- **Long Press**: Show context menu
- **Pinch**: Zoom on images (medical scans)
- **Double Tap**: Quick action (e.g., favorite)

## 6. Accessibility Design

### 6.1 Screen Reader Support

#### ARIA Labels
- All interactive elements have descriptive labels
- Form inputs have associated labels
- Dynamic content changes announced
- Navigation landmarks defined

#### Focus Management
- Logical tab order
- Visible focus indicators (4px green ring)
- Skip to main content link
- Focus trap in modals

### 6.2 Keyboard Navigation

#### Shortcuts
- **Tab**: Next element
- **Shift+Tab**: Previous element
- **Enter/Space**: Activate button
- **Escape**: Close modal/cancel
- **Arrow Keys**: Navigate lists/tabs

### 6.3 Color Contrast

#### Ratios (WCAG AA)
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **UI Components**: 3:1 minimum
- **High Contrast Mode**: 7:1 for all text

### 6.4 Alternative Text

#### Images
- All medical images have descriptive alt text
- Decorative images marked as aria-hidden
- Complex images have long descriptions

## 7. Responsive Design

### 7.1 Breakpoints

```
Mobile:    320px - 767px
Tablet:    768px - 1023px
Desktop:   1024px - 1439px
Large:     1440px+
```

### 7.2 Layout Adaptations

#### Mobile (320px-767px)
- Single column layout
- Stacked navigation
- Full-width cards
- Bottom navigation bar
- Collapsible sections

#### Tablet (768px-1023px)
- Two-column layout where appropriate
- Side navigation option
- Grid layouts for cards
- Larger touch targets maintained

#### Desktop (1024px+)
- Multi-column layouts
- Sidebar navigation
- Hover states enabled
- Keyboard shortcuts visible
- Maximum content width: 1200px

## 8. Dark Mode Design

### 8.1 Color Adjustments

#### Dark Mode Palette
- **Background**: #1a1a1a (Privacy Black)
- **Surface**: #2d2d2d
- **Primary**: #4caf50 (Lighter green)
- **Text Primary**: #ffffff
- **Text Secondary**: #cccccc
- **Borders**: #404040

### 8.2 Contrast Considerations
- Increased contrast for text
- Reduced brightness for images
- Adjusted shadow opacity
- Softer accent colors

## 9. Error States & Empty States

### 9.1 Error Messages

#### Structure
```
┌─────────────────────────────────────────┐
│  ❌ Upload Failed                       │
│  The file is too large (max 10MB)      │
│  [Try Again]  [Choose Different File]   │
└─────────────────────────────────────────┘
```

#### Principles
- Clear error icon
- Plain language explanation
- Actionable next steps
- No technical jargon

### 9.2 Empty States

#### Structure
```
┌─────────────────────────────────────────┐
│              📄                          │
│  No reports uploaded yet                │
│  Upload your first medical report to    │
│  get AI-powered insights                │
│                                          │
│  [Upload Report]                        │
└─────────────────────────────────────────┘
```

#### Principles
- Friendly illustration/icon
- Encouraging message
- Clear call-to-action
- Educational hint

## 10. Loading States

### 10.1 Skeleton Screens

#### Usage
- Show content structure while loading
- Animated shimmer effect
- Maintain layout stability
- Reduce perceived wait time

### 10.2 Progress Indicators

#### Types
- **Spinner**: Indeterminate operations
- **Progress Bar**: File uploads, analysis
- **Step Indicator**: Multi-step processes
- **Percentage**: Precise progress tracking

## 11. Notification Design

### 11.1 Toast Notifications

#### Layout
```
┌─────────────────────────────────────────┐
│  ✅ Report uploaded successfully        │
│  AI analysis will be ready in 30s       │
└─────────────────────────────────────────┘
```

#### Specifications
- **Position**: Top-right on desktop, top on mobile
- **Duration**: 5 seconds (dismissible)
- **Animation**: Slide in from right
- **Max Width**: 400px

### 11.2 Alert Banners

#### Types
- **Info**: Blue background, info icon
- **Success**: Green background, checkmark
- **Warning**: Yellow background, warning icon
- **Error**: Red background, error icon

## 12. Design Tokens

### 12.1 Token Structure

```javascript
{
  colors: {
    primary: '#2d7d32',
    secondary: '#1a1a1a',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    elder: '24px',
    'elder-lg': '32px'
  },
  fontSize: {
    'elder-sm': '16px',
    'elder-base': '18px',
    'elder-lg': '22px',
    'elder-xl': '28px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
}
```

## 13. Design Checklist

### 13.1 Before Launch
- [ ] All screens designed for mobile, tablet, desktop
- [ ] Dark mode variants created
- [ ] Accessibility audit completed (WCAG AA)
- [ ] Color contrast verified
- [ ] Touch targets meet minimum sizes
- [ ] Voice interactions tested
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Empty states designed
- [ ] Animations performance tested
- [ ] Multilingual text tested (overflow, wrapping)
- [ ] Screen reader compatibility verified
- [ ] Keyboard navigation tested
- [ ] High contrast mode tested
- [ ] Design tokens documented

### 13.2 Ongoing Maintenance
- [ ] User feedback incorporated
- [ ] Analytics reviewed for UX issues
- [ ] A/B testing results applied
- [ ] Accessibility improvements continuous
- [ ] Performance optimizations ongoing