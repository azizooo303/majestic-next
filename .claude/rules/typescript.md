# TypeScript/JavaScript Rules
# Source: adapted from affaan-m/everything-claude-code (MIT)

## Types and Interfaces

- Add parameter and return types to all exported functions and public methods
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, tuples, utility types
- Prefer string literal unions over `enum`
- Never use `any` — use `unknown` for external input, then narrow safely

```typescript
// WRONG
function formatUser(user) { return `${user.firstName} ${user.lastName}` }

// CORRECT
interface User { firstName: string; lastName: string }
export function formatUser(user: User): string { return `${user.firstName} ${user.lastName}` }
```

## Immutability (CRITICAL)

NEVER mutate — always return new copies:

```typescript
// WRONG: user.name = name
// CORRECT:
function updateUser(user: Readonly<User>, name: string): User {
  return { ...user, name }
}
```

## Error Handling

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unexpected error'
}

async function loadData(): Promise<T> {
  try {
    return await riskyOperation()
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error))
  }
}
```

## Input Validation

Use Zod at system boundaries:

```typescript
import { z } from 'zod'
const schema = z.object({ email: z.string().email() })
type Input = z.infer<typeof schema>
const validated: Input = schema.parse(input)
```

## React Props

```typescript
interface CardProps { user: User; onSelect: (id: string) => void }
function Card({ user, onSelect }: CardProps) { ... }
```

## Naming

- Variables/functions: `camelCase`
- Booleans: `is`, `has`, `should`, `can` prefix
- Interfaces/types/components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Custom hooks: `use` prefix

## No console.log in production code
