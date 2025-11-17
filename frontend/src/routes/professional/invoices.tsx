import { ContentLoading } from '@/components'
import { ROUTE_PATHS } from '@/config/routes'
import { Invoices } from '@/features/professional'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.INVOICES)({
  component: Invoices,
  pendingComponent: ContentLoading
})
