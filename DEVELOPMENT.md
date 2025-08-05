# Development Guide

This guide provides detailed information for developers working on the ADmyBRAND Insights Dashboard.

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: Version 18.0 or later
- **Package Manager**: npm, yarn, or pnpm
- **Editor**: VS Code recommended with the following extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd project

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Architecture

### Directory Structure

```
project/
├── app/                    # Next.js App Router (13+)
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Layout components (Navbar, Footer)
│   └── ui/               # Reusable UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
└── public/               # Static assets
```

### Key Technologies

- **Next.js 13.5.1**: React framework with App Router
- **TypeScript 5.2.2**: Type safety and better DX
- **Tailwind CSS 3.3.3**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Recharts 2.12.7**: Composable charting library
- **TanStack Table 8.21.3**: Powerful data tables

## 🎨 Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Leverage the `cn()` utility for conditional classes

```tsx
// Good: Using cn() utility for conditional classes
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)} />

// Good: Mobile-first responsive design
<div className="text-sm md:text-base lg:text-lg" />
```

### Theme System

The project uses CSS custom properties for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

## 🧩 Component Development

### Component Structure

```tsx
/**
 * Component documentation
 */
interface ComponentProps {
  // Props with JSDoc comments
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // Implementation
  };
  
  // Render
  return (
    <div className="component-styles">
      {/* JSX */}
    </div>
  );
}
```

### Best Practices

1. **TypeScript**: Always use TypeScript interfaces for props
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Performance**: Use React.memo() for expensive components
4. **Error Boundaries**: Wrap components that might fail
5. **Testing**: Write unit tests for complex logic

### Custom Hooks

```tsx
// hooks/use-example.ts
export function useExample(param: string) {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Effect logic
  }, [param]);
  
  return { state, setState };
}
```

## 📊 Data Management

### Real-Time Data

The dashboard uses a custom hook for real-time metrics:

```tsx
// Usage
const { metrics, isLoading, error } = useRealTimeMetrics(5000);
```

### Mock API

For development, the project includes a mock API that simulates real-time data:

```tsx
// lib/mock-api.ts
export const MockAPI = {
  fetchMetrics: () => Promise<Metric[]>,
  // Other API methods
};
```

### State Management

- **Local State**: useState for component-specific state
- **Shared State**: Custom hooks for shared logic
- **Server State**: Real-time hooks for API data

## 🎯 Adding New Features

### New Dashboard Widget

1. Create component in `components/dashboard/`
2. Add to main dashboard page
3. Include TypeScript interfaces
4. Add responsive styling
5. Write documentation

```tsx
// components/dashboard/NewWidget.tsx
interface NewWidgetProps {
  data: DataType[];
  title: string;
}

export function NewWidget({ data, title }: NewWidgetProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {/* Widget content */}
    </Card>
  );
}
```

### New Chart Type

1. Import from Recharts
2. Create wrapper component
3. Add to ChartWidget
4. Include responsive configuration
5. Add custom tooltips

### New Data Source

1. Create API client in `lib/`
2. Add TypeScript interfaces
3. Create custom hook
4. Handle loading/error states
5. Add to dashboard

## 🧪 Testing

### Unit Tests

```bash
# Run tests (when test setup is added)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Guidelines

1. Test component behavior, not implementation
2. Use React Testing Library
3. Mock external dependencies
4. Test accessibility features
5. Include edge cases

## 🔧 Build and Deployment

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Static Export

The project is configured for static export:

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};
```

## 📱 Mobile Development

### Responsive Design

- Use Tailwind's responsive prefixes
- Test on multiple screen sizes
- Optimize touch interactions
- Consider mobile-specific UX patterns

```tsx
// Mobile-optimized component
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-4 lg:gap-8
">
  {/* Content */}
</div>
```

## 🐛 Debugging

### Common Issues

1. **Hydration Errors**: Check for client/server mismatches
2. **Build Failures**: Verify TypeScript types
3. **Styling Issues**: Check Tailwind class conflicts
4. **Performance**: Use React DevTools Profiler

### Development Tools

- **React DevTools**: Component inspection
- **Tailwind CSS DevTools**: Class debugging
- **TypeScript**: Type checking
- **ESLint**: Code quality

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Recharts Documentation](https://recharts.org/)

### Learning Resources

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Include JSDoc comments for functions
- Use semantic versioning

### Pull Request Process

1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Submit pull request
5. Address review feedback

---

For deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md).
