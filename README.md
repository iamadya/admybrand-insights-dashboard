# ADmyBRAND Insights Dashboard

A modern, responsive marketing analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. Features real-time metrics, interactive charts, and comprehensive campaign management tools.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd project

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
project/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── ChartWidget.tsx    # Chart container component
│   │   ├── DataTable.tsx      # Advanced data table with sorting/filtering
│   │   └── OverviewCard.tsx   # Metric overview cards
│   ├── layout/            # Layout components
│   │   ├── Footer.tsx         # Footer component
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   └── Navbar.tsx         # Navigation bar with theme toggle
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
│   ├── use-real-time-metrics.ts  # Real-time data fetching hook
│   └── use-toast.ts              # Toast notification hook
├── lib/                   # Utility libraries
│   ├── export-utils.ts    # Data export functionality
│   ├── mock-api.ts        # Mock API for real-time data simulation
│   └── utils.ts           # General utility functions
└── public/                # Static assets
```

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3 + shadcn/ui components
- **Charts**: Recharts 2.12.7 for data visualization
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Data Tables**: TanStack Table 8.21.3
- **Icons**: Lucide React 0.446.0
- **Forms**: React Hook Form 7.53.0 with Zod validation

### Key Features

#### 🔄 Real-Time Data Updates
- **Mock API Simulation**: `lib/mock-api.ts` generates realistic metric variations
- **Custom Hook**: `hooks/use-real-time-metrics.ts` handles polling and state management
- **Automatic Refresh**: 5-second intervals with pause on tab visibility change
- **Error Handling**: Graceful fallbacks and error states

#### 📊 Interactive Dashboard
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: System preference detection with manual toggle
- **Chart Widgets**: Line charts, bar charts, and pie charts with animations
- **Data Tables**: Sortable, filterable, and exportable campaign data

#### 🎨 UI Components
- **shadcn/ui**: Modern, accessible component library
- **Consistent Design**: CSS custom properties for theming
- **Animations**: Smooth transitions and loading states
- **Mobile Optimized**: Touch-friendly interface for all screen sizes

### Data Flow

1. **Real-Time Metrics**: `useRealTimeMetrics` hook fetches data from `MockAPI`
2. **State Management**: React hooks manage component state and side effects
3. **UI Updates**: Components re-render automatically when data changes
4. **Export Functionality**: `export-utils.ts` handles CSV/PDF generation

## 🤖 AI Usage Notes

This project demonstrates several AI-enhanced development patterns:

### Intelligent Data Generation
- **Dynamic Metrics**: AI-powered mock data generation with realistic variations
- **Trend Simulation**: Algorithms simulate realistic business metric fluctuations
- **Pattern Recognition**: Data patterns follow real-world marketing analytics

### Code Organization
- **Component Architecture**: Modular, reusable components following React best practices
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Performance Optimization**: Efficient re-rendering and memory management

### Development Workflow
- **Automated Formatting**: ESLint configuration for consistent code style
- **Build Optimization**: Next.js static export for optimal deployment
- **Error Boundaries**: Graceful error handling throughout the application

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Setup**:
   - No environment variables required for basic deployment
   - Static export configuration already set in `next.config.js`

3. **Automatic Deployments**:
   - Push to main branch triggers automatic deployment
   - Preview deployments for pull requests

### Netlify

1. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: out
   ```

2. **Deploy**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Build and deploy
   npm run build
   netlify deploy --prod --dir=out
   ```

### Manual Static Hosting

```bash
# Build static files
npm run build

# The 'out' directory contains all static files
# Upload contents to any static hosting service
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Components**: Add to `components/` directory with TypeScript interfaces
2. **Custom Hooks**: Place in `hooks/` directory for reusable logic
3. **Utilities**: Add helper functions to `lib/utils.ts`
4. **Styling**: Use Tailwind classes and CSS custom properties

### Code Style

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Next.js recommended configuration
- **Prettier**: Automatic code formatting (configure in your editor)
- **Component Naming**: PascalCase for components, camelCase for functions

## 📱 Mobile Optimization

- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Touch Interactions**: Optimized for mobile gestures
- **Performance**: Lazy loading and efficient rendering
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Customization

### Theming
- Modify CSS custom properties in `app/globals.css`
- Update Tailwind config in `tailwind.config.ts`
- Add new color schemes in the theme configuration

### Data Sources
- Replace `MockAPI` in `lib/mock-api.ts` with real API calls
- Update interfaces in component files for new data structures
- Modify chart configurations in dashboard components

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
