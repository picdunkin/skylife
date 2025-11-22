# Implementation Plan - Codebase Refactoring

This plan addresses the issues identified in the code review, focusing on performance, architecture, and maintainability.

## User Review Required

> [!IMPORTANT]
> **Architecture Change**: `GameContext` will be significantly refactored. Logic will be moved to custom hooks (`useAuth`, `useQuests`, `useSkills`). This is a structural change but shouldn't affect functionality.

## Proposed Changes

### 1. Performance Optimization & Architecture Refactor

#### [MODIFY] [GameContext.jsx](file:///home/daniil/projects/skylife/src/context/GameContext.jsx)
- **Goal**: Prevent unnecessary re-renders and reduce "God Object" complexity.
- **Changes**:
    - Extract Auth logic to `useAuth` hook.
    - Extract Firestore Sync logic to `useFirestoreSync` hook.
    - Extract Quest/Act CRUD to `useQuests` hook.
    - Extract Skill logic to `useSkills` hook.
    - Wrap the `value` object in `useMemo`.

#### [NEW] [useAuth.js](file:///home/daniil/projects/skylife/src/hooks/useAuth.js)
- Encapsulate Firebase Auth logic (login, logout, user state).

#### [NEW] [useQuests.js](file:///home/daniil/projects/skylife/src/hooks/useQuests.js)
- Encapsulate Act and Quest CRUD operations.

#### [NEW] [useSkills.js](file:///home/daniil/projects/skylife/src/hooks/useSkills.js)
- Encapsulate Skill CRUD and Check-in logic.

### 2. Logic Extraction & Cleanup

#### [NEW] [dateUtils.js](file:///home/daniil/projects/skylife/src/utils/dateUtils.js)
- Move date calculation logic (e.g., `getMonday`) here.

#### [NEW] [gameRules.js](file:///home/daniil/projects/skylife/src/utils/gameRules.js)
- Move XP calculation and Level Up formulas here.

### 3. UX Improvements (Notifications)

#### [NEW] [NotificationContext.jsx](file:///home/daniil/projects/skylife/src/context/NotificationContext.jsx)
- Create a context for managing toast notifications.

#### [NEW] [NotificationToast.jsx](file:///home/daniil/projects/skylife/src/components/NotificationToast.jsx)
- Create a visual component for notifications (Skyrim style).

#### [MODIFY] [App.jsx](file:///home/daniil/projects/skylife/src/App.jsx)
- Wrap the app in `NotificationProvider`.

#### [MODIFY] [GameContext.jsx](file:///home/daniil/projects/skylife/src/context/GameContext.jsx)
- Replace `alert()` calls with `useNotification()`.

### 4. Styling Refactor

#### [MODIFY] [QuestList.jsx](file:///home/daniil/projects/skylife/src/components/QuestList.jsx)
- Replace inline styles with CSS classes.

#### [MODIFY] [index.css](file:///home/daniil/projects/skylife/src/index.css)
- Add new classes for `QuestList` and other components.

## Verification Plan

### Automated Tests
- Since there are no existing tests, we will rely on manual verification.

### Manual Verification
1.  **Auth**: Verify Login/Logout works.
2.  **Persistence**: Verify data loads correctly from Firestore.
3.  **Quests**: Add/Edit/Delete Acts and Quests. Verify UI updates.
4.  **Skills**: Add/Edit/Delete Skills. Check-in and verify XP/Level up.
5.  **Performance**: Use React DevTools Profiler to verify `GameContext` consumers don't re-render unnecessarily.
6.  **Notifications**: Trigger an error (e.g., cancel login) and verify the custom toast appears.
