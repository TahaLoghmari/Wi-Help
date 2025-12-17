# Patient Reviews Implementation

## Overview

Implemented bidirectional review system allowing professionals to review patients, mirroring the existing patient-to-professional review functionality.

## Backend Changes

### Domain Layer

- **ReviewType Enum** (`Modules.Reviews.Domain/Enums/ReviewType.cs`)

  - `ProfessionalReview = 1` (Patient reviews Professional)
  - `PatientReview = 2` (Professional reviews Patient)

- **Review Entity** (`Modules.Reviews.Domain/Entities/Review.cs`)

  - Added `ReviewType Type` property
  - Updated constructor to require ReviewType parameter

- **Database Configuration** (`Modules.Reviews.Infrastructure/Database/Configurations/ReviewConfiguration.cs`)
  - Updated unique index: `(PatientId, ProfessionalId, Type)` ensures one review per reviewer-reviewee-type combination

### Features Layer

- **SubmitPatientReview**

  - Command, CommandHandler, Endpoint
  - Allows professionals (with "Professional" role) to submit reviews for patients
  - Validates patient and professional existence
  - Creates review with `ReviewType.PatientReview`

- **GetPatientReviews**

  - Query, QueryHandler, DTO, Endpoint
  - Retrieves paginated reviews for a specific patient
  - Filters by `ReviewType.PatientReview`
  - Returns professional information with each review

- **GetPatientReviewStats**

  - Query, QueryHandler, DTO, Endpoint
  - Calculates average rating and total review count for patient
  - Filters by `ReviewType.PatientReview`

- **Updated Existing Features**
  - `SubmitReview` - filters by `ReviewType.ProfessionalReview`
  - `GetProfessionalReviews` - filters by `ReviewType.ProfessionalReview`
  - `GetProfessionalReviewStats` - filters by `ReviewType.ProfessionalReview`

### Database Migration

- Created migration: `AddReviewTypeToReviews`
- Adds `Type` column (int) to Reviews table
- Updates existing data to use `ReviewType.ProfessionalReview` (value = 1)

## Frontend Changes

### Hooks

- **GetPatientReviews** (`features/reviews/hooks/GetPatientReviews/`)

  - Fetches paginated reviews for a patient
  - Query key: `["patient-reviews", patientId, page, pageSize]`

- **GetPatientReviewStats** (`features/reviews/hooks/GetPatientReviewStats/`)

  - Fetches review statistics for a patient
  - Query key: `["patient-review-stats", patientId]`

- **SubmitPatientReview** (`features/reviews/hooks/SubmitPatientReview/`)

  - Mutation hook for professionals to submit patient reviews
  - Invalidates patient-reviews and patient-review-stats queries

- **Updated Mutation Hooks**
  - LikeReview, UnlikeReview, ReplyToReview, UpdateReview, DeleteReview
  - All updated to invalidate both professional-reviews and patient-reviews query keys

### Components

- **PatientReviewsList** (`features/reviews/components/PatientReviewsList/`)

  - Displays patient's reviews with stats
  - Shows review submission form for professionals
  - Handles pagination

- **PatientReviewCard** (`features/reviews/components/PatientReviewsList/PatientReviewCard.tsx`)

  - Individual review card component
  - Displays professional information
  - Shows rating, comment, likes, replies
  - Edit/delete actions for review owner

- **SubmitPatientReviewForm** (`features/reviews/components/SubmitPatientReviewForm/`)
  - Form for professionals to submit reviews
  - Star rating input
  - Comment textarea with character limit (500)
  - Displays patient name

### UI Updates

- **Patient Profile Layout** (`features/patient/components/profile/ProfileLayout.tsx`)

  - Added tabbed interface: Overview | Reviews
  - Patient can view their own reviews from professionals

- **Professional Patient View** (`routes/professional/patient.$patientId.tsx`)
  - Added tabbed interface: Overview | Reviews
  - Professional can view patient info and submit reviews

### Translations

Added i18n keys in both English and French (`frontend/src/locales/en|fr/translation.json`):

- `reviews.patientReviewsTitle`
- `reviews.patientReviewsDescription`
- `reviews.patientReviewsEmpty`
- `reviews.patientBadge`
- `reviews.deleteConfirm`
- `reviews.form.patientReviewTitle`
- `reviews.form.patientReviewDescription`
- `reviews.form.patientReviewPlaceholder`
- `reviews.form.fallbackPatientName`
- `patient.profile.tabs.overview`
- `patient.profile.tabs.reviews`

## Features

✅ Professionals can submit reviews for patients
✅ Patients can view reviews on their profile
✅ Patients can reply to reviews they receive
✅ Both patients and professionals can like/unlike reviews
✅ Review owners can edit/delete their reviews
✅ Paginated review lists
✅ Review statistics (average rating, total count)
✅ Bidirectional review system (Patient ↔ Professional)
✅ Proper query invalidation across all mutations
✅ i18n support (English/French)

## Build Verification

✅ Backend: `dotnet build` - **Success** (0 errors)
✅ Frontend: `npm run build` - **Success** (0 errors)

## Architecture Compliance

- ✅ Separation of concerns maintained
- ✅ Modular boundaries respected
- ✅ CQRS pattern followed
- ✅ Entity Framework conventions observed
- ✅ TanStack Query patterns followed
- ✅ Consistent API client usage
- ✅ Type safety maintained throughout

## Testing Recommendations

1. Test professional submitting review for patient
2. Test patient viewing their reviews
3. Test patient replying to professional's review
4. Test like/unlike functionality on patient reviews
5. Test pagination with multiple reviews
6. Test review statistics calculation
7. Verify proper authorization (only professionals can submit patient reviews)
8. Test duplicate review prevention (same professional reviewing same patient)
