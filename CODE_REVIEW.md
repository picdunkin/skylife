# Code Review Report: Skylife

## 1. Architecture & State Management (`GameContext.jsx`)

### **Critical: Performance Issue with Context Value**
**Observation:** The `value` object passed to `GameContext.Provider` is created on every single render.
```javascript
// Current
const value = { user, gameState, ... }; 

// Problem
// This causes ALL consumers of useGame() to re-render whenever GameContext re-renders, 
// even if the specific data they use hasn't changed.
```
**Recommendation:** Wrap the value in `useMemo`.
```javascript
const value = useMemo(() => ({
    user, gameState, ...
}), [user, gameState, loading, editMode]);
```

### **God Object Pattern**
**Observation:** `GameContext` is handling Auth, Firestore Sync, Quest Logic, Skill Logic, and Sound effects. It is becoming too large (389 lines).
**Recommendation:** Split the context or extract logic into custom hooks:
- `useAuth()` for user/login/logout.
- `useQuests()` for quest/act CRUD.
- `useSkills()` for skill logic.
- `useFirestoreSync()` for the sync effect.

### **Business Logic in Components**
**Observation:** Complex date logic (finding Monday, calculating XP) is inside `checkInSkill` within the context.
**Recommendation:** Move date calculations to `src/utils/dateUtils.js` and XP formulas to `src/utils/gameRules.js`. This makes them unit-testable.

## 2. Styling & CSS

### **Heavy Use of Inline Styles**
**Observation:** Components like `QuestList.jsx` and `SkyrimLayout.jsx` rely heavily on inline styles (e.g., `style={{ padding: '10px 15px...' }}`).
**Drawbacks:**
- Hard to read and maintain.
- No support for media queries or pseudo-classes (:hover) without complex JS logic.
- Performance overhead (JS object creation).
**Recommendation:** Move these styles to `index.css` or use CSS Modules (`QuestList.module.css`).
- Example: Replace the massive `style={{...}}` in `QuestList` with `className="act-header"`.

### **Responsive Design Logic**
**Observation:** `SkyrimLayout.jsx` uses JS state (`hidden-mobile`) to toggle classes.
**Recommendation:** This is actually a good approach for this specific "split-pane" mobile layout, but the CSS implementation in `index.css` could be cleaner using CSS Grid for the desktop layout instead of flexbox with fixed widths.

## 3. Data Persistence

### **Frequent Writes**
**Observation:** `saveState` writes to Firestore on *every* state change.
```javascript
saveState({ ...gameState, metrics: newMetrics });
```
**Risk:** Rapid updates (e.g., dragging a slider or quickly checking boxes) could hit Firestore rate limits or cause UI stutter.
**Recommendation:** Implement debouncing for metrics or frequent updates, or use "Optimistic UI" updates (update local state immediately, sync to server in background).

## 4. Code Quality & Best Practices

### **Error Handling**
**Observation:** The `login` function uses `alert()` for errors.
```javascript
alert('Вы закрыли окно авторизации...');
```
**Recommendation:** Use a non-blocking UI notification (Toast/Snackbar) to maintain the immersive Skyrim aesthetic. Native browser alerts break immersion.

### **Hardcoded Strings**
**Observation:** Strings like "ГЛАВНАЯ", "СКИЛЛЫ" are hardcoded.
**Recommendation:** Move to a constants file or a translation file (`src/data/strings.js`) to make it easier to change text globally.

### **Audio Object Creation**
**Observation:** `sounds.js` creates `new Audio()` instances at the module level.
**Recommendation:** This is generally fine for small apps, but browsers often block autoplay or audio context creation until user interaction. Ensure `playSound` handles the `NotAllowedError` gracefully (it currently catches errors, which is good).

## 5. Security

**Observation:** Firebase config uses `import.meta.env`, which is correct.
**Observation:** Firestore rules are not visible here, but ensure you have rules that restrict `users/{userId}` write access to `request.auth.uid == userId`.

## Summary of Action Items

1.  **Refactor**: Wrap `GameContext` value in `useMemo`.
2.  **Refactor**: Extract inline styles in `QuestList.jsx` to CSS classes.
3.  **Feature**: Replace `alert()` with a custom "Skyrim-style" notification.
4.  **Cleanup**: Move date/XP logic out of `GameContext`.
