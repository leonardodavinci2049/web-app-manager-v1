# Design Document

## Overview

This design addresses critical security vulnerabilities in the authentication system that emerged after the Next.js 16 migration. The primary issues are:

1. The `use-user-data.ts` hook provides mocked user data ("Admin Dashboard") when no valid session exists, creating a security bypass
2. The logout/login flow has issues that cause authentication errors on subsequent login attempts

The solution involves:
- Removing all mocked user fallback data from the authentication flow
- Ensuring proper session cleanup on logout
- Strengthening server-side session validation in the dashboard layout
- Improving error handling and user feedback

## Architecture

### Current Architecture Issues

```
┌─────────────────┐
│   User Request  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Proxy (proxy.ts)│ ← Cookie check only (optimistic)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dashboard Layout│ ← Has session validation but...
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ use-user-data   │ ← PROBLEM: Returns mocked data!
└─────────────────┘
```

### Proposed Architecture

```
┌─────────────────┐
│   User Request  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Proxy (proxy.ts)│ ← Cookie check (optimistic)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dashboard Layout│ ← ENFORCED: Full session validation
│  (Server-side)  │    Redirect if invalid
└────────┬────────┘
         │ (session valid)
         ▼
┌─────────────────┐
│ use-user-data   │ ← FIXED: No mocked data
│  (Client-side)  │    Returns null if no session
└─────────────────┘
```

## Components and Interfaces

### 1. User Data Hook (`use-user-data.ts`)

**Current Implementation Problem:**
```typescript
// SECURITY ISSUE: Falls back to mocked data
else if (!isPending && !session) {
  setUser({
    name: "Admin Dashboard",
    email: "admin@dashboard.com",
    // ... mocked data
  });
}
```

**Fixed Implementation:**
```typescript
interface UserData {
  name: string;
  email: string;
  avatar: string;
  id?: string;
  role?: string;
}

interface UseUserDataReturn {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserData(): UseUserDataReturn {
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      // Valid session - set user data
      setUser({
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || generateAvatarUrl(session.user.name),
        id: session.user.id,
      });
      setError(null);
    } else if (!isPending && !session) {
      // No session - clear user and set error
      setUser(null);
      setError("No active session");
    }
  }, [session, isPending]);

  return { user, isLoading: isPending, error };
}
```

### 2. Dashboard Layout (`src/app/dashboard/layout.tsx`)

**Current State:** Already has session validation (good!)

**Enhancement Needed:** Ensure it handles all edge cases properly

```typescript
export default async function DashboardLayout({ children }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Strict validation - no session means no access
    if (!session?.user) {
      redirect("/sign-in");
    }

    // Optional: Add session data to context for child components
    // This prevents client components from needing to re-fetch
    
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    
    // Log error for debugging
    console.error("Dashboard session validation error:", error);
    redirect("/sign-in");
  }

  // ... rest of layout
}
```

### 3. Logout Flow

**Current Implementation:** Uses `authClient.revokeSessions()`

**Enhancement Needed:** Ensure complete cleanup and proper redirect

```typescript
async function handleLogout() {
  setLoading(true);
  
  try {
    // Revoke session on server
    const { error } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Clear any client-side state
          // Force router refresh to clear cached data
          router.refresh();
          router.push("/sign-in");
        }
      }
    });

    if (error) {
      toast.error(error.message || "Failed to log out");
      setLoading(false);
      return;
    }

    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("An error occurred during logout");
    setLoading(false);
  }
}
```

### 4. Proxy Middleware (`src/proxy.ts`)

**Current Implementation:** Good - performs optimistic cookie check

**No changes needed** - The proxy correctly checks for session cookie and redirects if missing. The real validation happens in the layout.

## Data Models

### Session Data Flow

```typescript
// Server-side (Better-Auth)
interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    emailVerified: boolean;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    activeOrganizationId?: string;
  };
}

// Client-side (use-user-data hook)
interface UserData {
  name: string;
  email: string;
  avatar: string;
  id?: string;
  role?: string;
}

// Hook return type
interface UseUserDataReturn {
  user: UserData | null;  // null when no session
  isLoading: boolean;     // true while checking session
  error: string | null;   // error message if validation fails
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: No mocked data fallback
*For any* authentication state, when no valid session exists, the user data hook should return null user data and never provide mocked or fake user information.
**Validates: Requirements 1.2, 1.3**

### Property 2: Session validation consistency
*For any* request to protected routes, if the session cookie is missing or invalid, the system should redirect to the sign-in page without rendering protected content.
**Validates: Requirements 1.1, 1.4, 4.1, 4.2**

### Property 3: Logout cleanup completeness
*For any* logout operation, all session data (server-side session, client-side cache, cookies) should be completely cleared before redirecting to the login page.
**Validates: Requirements 2.1, 2.3**

### Property 4: Post-logout authentication independence
*For any* login attempt after logout, the authentication should process with fresh credentials without any interference from previous session state.
**Validates: Requirements 2.2, 2.4**

### Property 5: Error state clarity
*For any* authentication error, the system should set a descriptive error message and maintain null user state without masking the error with fallback data.
**Validates: Requirements 3.1, 3.3, 3.4**

### Property 6: Layout-level session enforcement
*For any* dashboard layout render, the server-side session validation should complete before any child components render, and redirect to sign-in if validation fails.
**Validates: Requirements 5.1, 5.2, 5.4, 5.5**

## Error Handling

### Error Categories

1. **No Session Error**
   - Condition: User attempts to access protected route without session
   - Handling: Redirect to `/sign-in`
   - User Feedback: None (silent redirect)
   - Logging: Not needed (expected behavior)

2. **Session Validation Error**
   - Condition: Session exists but validation fails (expired, invalid, corrupted)
   - Handling: Clear session, redirect to `/sign-in`
   - User Feedback: Toast message "Session expired, please log in again"
   - Logging: Log error details for debugging

3. **Logout Error**
   - Condition: Server fails to revoke session
   - Handling: Show error, keep user on current page
   - User Feedback: Toast error with message
   - Logging: Log full error stack

4. **Login After Logout Error**
   - Condition: Login fails after logout due to state issues
   - Handling: Clear all client state, retry authentication
   - User Feedback: Show specific error from auth system
   - Logging: Log authentication error details

### Error Handling Implementation

```typescript
// In use-user-data.ts
useEffect(() => {
  if (session?.user) {
    setUser(mapSessionToUserData(session.user));
    setError(null);
  } else if (!isPending && !session) {
    setUser(null);
    setError("No active session");
  } else if (!isPending && session && !session.user) {
    // Edge case: session exists but no user data
    setUser(null);
    setError("Invalid session data");
    console.error("Session exists but user data is missing");
  }
}, [session, isPending]);

// In dashboard layout
try {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }
} catch (error) {
  if (isRedirectError(error)) {
    throw error;
  }
  
  // Log for debugging but don't expose details to user
  console.error("Dashboard session validation error:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  redirect("/sign-in");
}
```

## Testing Strategy

### Unit Tests

1. **use-user-data Hook Tests**
   - Test: Hook returns null when no session exists
   - Test: Hook returns user data when valid session exists
   - Test: Hook sets error state when session is invalid
   - Test: Hook never returns mocked data
   - Test: Loading state is true while session is pending

2. **Logout Flow Tests**
   - Test: Logout clears session cookie
   - Test: Logout redirects to sign-in page
   - Test: Logout shows success toast on success
   - Test: Logout shows error toast on failure
   - Test: Logout handles network errors gracefully

3. **Dashboard Layout Tests**
   - Test: Layout redirects when no session exists
   - Test: Layout renders children when session is valid
   - Test: Layout handles session validation errors
   - Test: Layout doesn't render protected content before validation

### Property-Based Tests

Property-based testing will verify the correctness properties defined above:

1. **Property Test: No mocked data fallback**
   - Generate: Various session states (null, undefined, invalid)
   - Verify: Hook always returns null user data when session is invalid
   - Library: @fast-check/vitest (for TypeScript/React)

2. **Property Test: Session validation consistency**
   - Generate: Various cookie states and session states
   - Verify: Protected routes always redirect when session is invalid
   - Library: @fast-check/vitest

3. **Property Test: Logout cleanup completeness**
   - Generate: Various pre-logout states
   - Verify: All session data is cleared after logout
   - Library: @fast-check/vitest

### Integration Tests

1. **Full Authentication Flow**
   - Test: Login → Access Dashboard → Logout → Login Again
   - Verify: Each step works correctly without errors
   - Verify: No mocked data appears at any point

2. **Session Expiration Flow**
   - Test: Login → Wait for expiration → Access Dashboard
   - Verify: Redirects to login
   - Verify: No mocked data fallback

3. **Multiple Logout Scenarios**
   - Test: Logout from one device
   - Test: Logout from all devices
   - Test: Logout then immediate login
   - Verify: All scenarios work correctly

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Access dashboard successfully
- [ ] Logout and verify redirect to login
- [ ] Login again immediately after logout
- [ ] Verify no "Admin Dashboard" mocked user appears
- [ ] Try accessing dashboard without login
- [ ] Verify proper redirect to login
- [ ] Check browser console for errors
- [ ] Verify session cookie is cleared on logout
- [ ] Test with expired session cookie

## Implementation Notes

### Key Changes Required

1. **src/hooks/use-user-data.ts**
   - Remove mocked user data fallback
   - Return null when no session
   - Set appropriate error message

2. **src/app/(auth)/logout/logout-everywhere-button.tsx**
   - Use `authClient.signOut()` instead of `revokeSessions()`
   - Add router.refresh() before redirect
   - Improve error handling

3. **src/app/dashboard/layout.tsx**
   - Already good, but verify error handling is complete
   - Consider adding session data to React context

### Migration Considerations

- This is a breaking change for any code that relies on the mocked user data
- Components using `useUserData()` must handle `null` user state
- Add proper loading states in UI components
- Update any tests that expect mocked data

### Security Improvements

- Eliminates unauthorized access through mocked data
- Enforces proper authentication at multiple layers
- Provides clear audit trail through error logging
- Prevents session state pollution between login attempts
