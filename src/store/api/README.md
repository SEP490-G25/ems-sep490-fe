# API Configuration Guide

## Naming Convention Setup

The TypeScript types are defined in **camelCase** (standard TypeScript/JavaScript convention).

```typescript
// TypeScript types (camelCase)
interface UserInfoDTO {
  fullName: string;  // camelCase
  accessToken: string;
}
```

### If Backend Returns camelCase (Default Spring Boot)

✅ **No transformation needed!** Current setup works out of the box.

```json
// Backend response (camelCase)
{
  "accessToken": "...",
  "user": {
    "fullName": "John Doe"
  }
}
```

### If Backend Returns snake_case

⚠️ **Transformation required!** Update `authApi.ts`:

```typescript
import { toCamelCase } from './apiUtils';

// In authApi.ts, add transformResponse:
login: builder.mutation<LoginResponseDTO, LoginRequestDTO>({
  query: (credentials) => ({
    url: '/auth/login',
    method: 'POST',
    body: credentials,
  }),
  transformResponse: (response: unknown) => {
    // Convert snake_case to camelCase
    return toCamelCase<LoginResponseDTO>(response);
  },
}),
```

Backend response (snake_case):
```json
{
  "access_token": "...",
  "user": {
    "full_name": "John Doe"
  }
}
```

Will be transformed to camelCase automatically.

## How to Check Backend Convention

1. **Test login endpoint** and inspect response in browser DevTools Network tab
2. Look at response JSON:
   - If you see `"fullName"` → camelCase ✅ No change needed
   - If you see `"full_name"` → snake_case ⚠️ Enable transformResponse

## Current Configuration

- **Base URL**: `http://localhost:8080/api/v1`
- **Auth endpoint**: `/auth/login`
- **Assumed convention**: **camelCase** (default Spring Boot)

If backend uses snake_case, uncomment the `transformResponse` in `authApi.ts`.
