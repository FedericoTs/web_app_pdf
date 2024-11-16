# Overview
We are building a web application that will allow users to extract data from PDF files and visualize it in a user-friendly interface.

# Landing Page (`/`)
## Core Functionalities
- Product features showcase
- Value proposition section
- Call-to-action for free trial signup
- Navigation header with login/signup buttons

## Technical Requirements
- Responsive design using TailwindCSS
- Hero section with animated illustrations (Lucide icons)
- Integration with shadcn/ui components for consistent UI
- Smooth scroll behavior for navigation

# Authentication Pages (`/auth`)
## Login Page (`/auth/login`)
### Core Functionalities
- Email/password login form
- "Forgot password" link
- "Sign up" redirect link
- Error handling display
- Loading states

### Technical Requirements
- Form validation using shadcn forms
- Integration with authentication system
- Protected route handling

## Signup Page (`/auth/signup`)
### Core Functionalities
- Registration form with email/password
- Terms of service acceptance
- Success/error message display
- Redirect to dashboard after signup

### Technical Requirements
- Same technical stack as login page
- Password strength indicator
- Email validation

# Dashboard Page (`/dashboard`)
## Core Functionalities
- Split view layout:
  - Left panel (30%): File upload section
  - Right panel (70%): Schema definition interface

### File Upload Section
- Drag and drop zone for PDFs
- File list with preview buttons
- Upload progress indicators
- File size and type validation
- Immediate file processing status

### Schema Definition Section
- Default schema display
- Interactive schema builder
  - Add/remove fields
  - Define field types
  - Nested group support
- "Start extraction" button
- Schema preview/validation

## Technical Requirements
- React-dropzone for file uploads
- Tailwind Grid/Flex for layout
- shadcn/ui components:
  - Cards
  - Buttons
  - Input fields
  - Dropdown menus
- Loading states and animations
- Error boundary implementation

# Results Page (`/results`)
## Core Functionalities
- Extracted data table view
- Filtering capabilities
- Download options (CSV/Excel)
- Data visualization charts
- Pagination

## Technical Requirements
- Table component from shadcn/ui
- Chart libraries (optional: recharts)
- Export functionality
- Search and filter implementation
- Responsive data grid

# Settings Page (`/dashboard/settings`)
## Core Functionalities
- Account management
- subscription management
- colour palette management
- API keys management in order to connect the web application to other database services and push the data into the company systems directly.

# Shared Components
## Navigation
- Top navigation bar
- User profile menu
- Breadcrumbs
- Mobile-responsive menu

## UI Elements
- Loading spinners
- Error messages
- Success notifications
- Modal dialogs
- Tooltips

## Technical Stack Requirements
- Next.js 13+ with App Router
- TailwindCSS for styling
- shadcn/ui component library
- Lucide icons
- TypeScript for type safety

## Responsive Design Requirements
- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
