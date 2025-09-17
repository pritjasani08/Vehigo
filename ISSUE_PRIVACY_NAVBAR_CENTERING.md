# Issue: Privacy Policy Page Missing Navbar and Dark Mode Support

## 🐛 Bug Description
The privacy policy page (`privacypolicy.html`) previously had no functional navbar and lacked dark mode compatibility. This caused navigation inconsistency across the site and poor UX in dark mode.

## 📋 Current Behavior
- No or incomplete navbar on `privacypolicy.html`
- Missing theme toggle, login/logout actions
- Dark mode styles not applied; colors did not adapt with theme
- Inconsistent layout compared to the homepage

## ✅ Expected Behavior
- Fully functional navbar matching `index.html` (logo, links, theme toggle, login/logout)
- Responsive behavior with Bootstrap nav toggler
- Dark mode support across the whole page (navbar, body, cards, buttons)
- Links use correct relative paths consistently

## 🔧 Technical Details
- **File affected**: `privacypolicy.html`
- **Issue type**: Feature/UI Parity
- **Priority**: High
- **Components**: Navbar/Header, Theme/Dark Mode

## 🎯 Proposed Solution
- Add standardized Bootstrap navbar from `index.html`
- Add theme toggle button with `localStorage` persistence
- Implement dark theme via CSS variables; ensure navbar, text, cards, and buttons adapt
- Ensure correct relative links: Home, Explore cars (`featured-car.html`), About, Blog, Contact, Offline Centers, Rent

## ✅ Acceptance Criteria
- Navbar renders and functions on desktop and mobile
- Theme switch toggles dark/light and persists on reload
- All nav items navigate correctly
- Visual parity with `index.html`

## 🏷️ Labels
- `bug`
- `ui/ux`
- `enhancement`
- `dark-mode`
- `privacy-policy`

## 👤 Assignee
@amit0

## 📅 Created
$(date)
