# Application Form Modals - PhsarDesign Frontend

This document describes the reusable application form modals implemented for the PhsarDesign platform, supporting both artist-to-client job applications and client-to-artist service contacts.

## Overview

The application modal system consists of:

1. **MultiStepApplicationModal** - The main modal container that conditionally renders form types
2. **JobApplicationForm** - Form component for artists applying to jobs
3. **ServiceContactForm** - Form component for clients contacting artists for services

## Components

### MultiStepApplicationModal

Main modal component that handles routing between different application types.

**Props:**

- `isOpen` (boolean) - Controls modal visibility
- `onClose` (function) - Callback when modal is closed
- `post` (object) - Post/service data (job post or artist availability)
- `onSuccess` (function) - Callback when application is successfully submitted
- `applicationType` (string) - Either "artist_to_job" or "client_to_service"

**Usage:**

```jsx
import { MultiStepApplicationModal } from "../ui/multi-step-application-modal";

<MultiStepApplicationModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  post={jobPostData}
  applicationType="artist_to_job"
  onSuccess={() => console.log("Application sent!")}
/>;
```

### JobApplicationForm

Form for artists applying to client job posts.

**Required Fields:**

- `subject` - Brief title (max 255 chars)
- `message` - Cover letter (50-2000 chars)
- `proposedBudget` - Artist's rate ($0-$100,000)
- `proposedDeadline` - When they can deliver

**Optional Fields:**

- `proposedStartDate` - Preferred start date
- `experience` - Relevant experience description
- `portfolio` - Portfolio links (max 10 items)
- `pastProjects` - Similar project descriptions
- `additionalNotes` - Additional information

### ServiceContactForm

Form for clients contacting artists for services.

**Required Fields:**

- `subject` - Brief description (max 255 chars)
- `message` - Project description (20-1500 chars)
- `proposedBudget` - Project budget ($0-$50,000)

**Optional Fields:**

- `proposedDeadline` - Preferred completion date
- `proposedStartDate` - Preferred start date
- `applicationType` - Priority level (urgent/standard/flexible)
- `additionalNotes` - Additional requirements

## API Integration

### Endpoints

- **POST /api/applications/job** - Submit job application (artist → client)
- **POST /api/applications/service** - Submit service contact (client → artist)
- **GET /api/applications/received** - Get received applications
- **GET /api/applications/sent** - Get sent applications

### Job Application Payload

```javascript
{
  jobPostId: number,
  receiverId: number,
  subject: string,
  message: string,
  proposedBudget: number,
  proposedDeadline: string,
  proposedStartDate?: string,
  experience?: string,
  portfolio?: string,
  additionalNotes?: string,
  pastProjects?: string
}
```

### Service Contact Payload

```javascript
{
  availabilityPostId: number,
  receiverId: number,
  subject: string,
  message: string,
  proposedBudget: number,
  proposedDeadline?: string,
  proposedStartDate?: string,
  applicationType?: string,
  additionalNotes?: string
}
```

## Form Validation

### Job Application Validation

- Subject: Required, max 255 characters
- Message: Required, 50-2000 characters
- Budget: Required, $0-$100,000
- Deadline: Required, cannot be in past
- Portfolio: Max 10 items
- Other fields: Optional with reasonable limits

### Service Contact Validation

- Subject: Required, max 255 characters
- Message: Required, 20-1500 characters
- Budget: Required, $0-$50,000
- Deadline: Optional, cannot be in past
- Priority: Optional, enum values (urgent/standard/flexible)
- Other fields: Optional with reasonable limits

## Error Handling

The forms include comprehensive error handling:

1. **Real-time validation** - Fields are validated as the user types
2. **Visual feedback** - Error messages appear below fields
3. **Submit validation** - Final check before submission
4. **API error handling** - Network and server errors are displayed
5. **Character counters** - Show remaining characters for text fields

## Success Flow

1. User fills out and submits form
2. Form validation passes
3. API request is made
4. Success toast notification appears: "Your application has been sent successfully!"
5. Confirmation modal is shown
6. Modal auto-closes after 3 seconds
7. Form state is reset

## Styling

The components follow the existing PhsarDesign dark theme:

- Background: `bg-gray-900`
- Accent color: `#A95BAB` (purple brand color)
- Text: White and gray variants
- Borders: Semi-transparent white
- Consistent rounded corners and spacing

## File Structure

```
src/
├── components/
│   ├── marketplace/
│   │   ├── JobApplicationForm.jsx
│   │   ├── ServiceContactForm.jsx
│   │   └── ApplicationModalDemo.jsx
│   └── ui/
│       └── multi-step-application-modal.jsx
├── lib/
│   └── api.js (updated with new endpoints)
```

## Usage Examples

### Artist Applying to Job

```jsx
// Job post data
const jobPost = {
  id: 1,
  jobId: 1,
  title: "Logo Design Project",
  description: "Need a modern logo...",
  clientId: 123,
  budget: "$500-1000"
}

<MultiStepApplicationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  post={jobPost}
  applicationType="artist_to_job"
  onSuccess={() => console.log("Applied!")}
/>
```

### Client Contacting Artist

```jsx
// Artist availability post
const artistPost = {
  id: 2,
  postId: 2,
  title: "Graphic Design Services",
  description: "Professional designer available...",
  artistId: 456
}

<MultiStepApplicationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  post={artistPost}
  applicationType="client_to_service"
  onSuccess={() => console.log("Contacted!")}
/>
```

## Testing

To test the components, use the `ApplicationModalDemo` component which provides example data and demonstrates both modal types.

## Dependencies

- React hooks (useState)
- Lucide React icons
- Existing UI components (Button, Input, Textarea)
- Toast notification system
- Redux store for user authentication
- Axios for API calls

## Future Enhancements

Potential improvements for future versions:

- File upload support for portfolio attachments
- Draft saving functionality
- Application templates
- Rich text editor for longer descriptions
- Real-time collaboration features
- Application status tracking
