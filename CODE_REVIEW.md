# Code Review Report: Skylife (Updated)

## 1. Architecture & Improvements
**Status: Excellent Progress**
- **Context Split**: You have successfully refactored `GameContext` by extracting logic into `useSkills`, `useQuests`, and `useSidequests`. This makes the context much cleaner and easier to maintain.
- **Memoization**: The `value` in `GameContext` is now correctly wrapped in `useMemo`, preventing unnecessary re-renders.
- **Notification**: You replaced `alert()` with `showNotification`, improving the user experience significantly.

## 2. Code Duplication (DRY Principle)
**Observation:** There is some logic duplication that should be cleaned up to avoid inconsistencies.

- **XP Calculation**:
  - `src/utils/gameRules.js` contains the source of truth for `xpToNextLevel`.
  - `src/components/SkillDetail.jsx` re-implements the same formula manually: `Math.floor(Math.pow(skill.level * 1.2, 1.5) * 100)`.
  - **Recommendation**: Export `xpToNextLevel` from `gameRules.js` and use it in `SkillDetail.jsx`.

- **Date Utilities**:
  - `src/utils/dateUtils.js` likely contains `getMonday`.
  - `src/components/SkillDetail.jsx` re-defines `getMonday` locally.
  - **Recommendation**: Import `getMonday` from `../utils/dateUtils` in `SkillDetail.jsx`.

## 3. Logic & Edge Cases
**Observation:** The `daysDone` calculation in `useSkills.js` might be inaccurate with legacy data.

- **Current Logic**: `const daysDone = thisWeekCheckIns.length;`
- **Issue**: If, historically, a user managed to check in twice in one day (before we added the "once per day" check), `daysDone` would count both, potentially inflating the multiplier.
- **Recommendation**: Filter `thisWeekCheckIns` to count *unique days* only.
  ```javascript
  const uniqueDays = new Set(thisWeekCheckIns.map(h => new Date(h.date).toDateString())).size;
  ```

## 4. Styling
**Observation:** Heavy use of inline styles persists, particularly in `SkillDetail.jsx`.
- **Issue**: Inline styles (e.g., `style={{ border: '1px solid #555'... }}`) make the JSX hard to read and are less performant than classes.
- **Recommendation**: Continue moving these to `index.css` or a CSS module. For example, the "calendar-day" styles are already in a `<style jsx>` block, which is a step in the right direction, but consistency is key.

## 5. Performance
- **State Updates**: `saveState` updates the entire `gameState` object. While fine for now, as the app grows, you might want to split `gameState` into separate contexts (e.g., `QuestContext`, `SkillContext`) to avoid re-rendering the Quest list when updating a Skill.

## 6. Security
- **Firestore**: Ensure your Firestore security rules allow users to only read/write their own document (`users/{userId}`).
  ```
  match /users/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

## Summary of Action Items
1.  **Refactor**: Import `xpToNextLevel` and `getMonday` in `SkillDetail.jsx` instead of redefining them.
2.  **Fix**: Update `daysDone` calculation in `useSkills.js` to count unique days.
3.  **Cleanup**: Move inline styles from `SkillDetail.jsx` to CSS classes.
