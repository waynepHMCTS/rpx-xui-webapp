interface TaskList {
    tasks: Task[]
  }

/**
 * Adjusted to mirror the Swagger documentation.
 */
export interface Task {
    assignee: string,
    auto_assigned: true,
    case_category: string,
    case_id: string,
    case_name: string,
    case_type_id: string,
    created_date: string,
    due_date: string,
    execution_type: string,
    id: string,
    jurisdiction: string,
    location: string,
    location_name: string,
    name: string,
    region: string,
    security_classification: string,
    task_state: string,
    task_system: string,
    task_title: string,
    type: string
}

interface Assignee {
    id: string
    userName: string
}

interface CaseData {
    category: string
    location: LocationSummary
    name: string
    reference: string
}

interface LocationSummary {
    id: string
    locationName: string
}

interface Location {
    id: string
    locationName: string
    services: string[]
}

interface Caseworker {
    firstName: string
    lastName: string
    idamId: string
    location: Location
}
