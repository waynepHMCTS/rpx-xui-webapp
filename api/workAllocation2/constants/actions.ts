import { Action } from '../interfaces/task';

const ASSIGN: Action = {
  id: 'assign',
  title: 'Assign task',
};
const CANCEL: Action = {
  id: 'cancel',
  title: 'Cancel task',
};
const CLAIM: Action = {
  id: 'claim',
  title: 'Assign to me',
};
const COMPLETE: Action = {
  id: 'complete',
  title: 'Mark as done',
};
const RELEASE: Action = {
  id: 'unclaim',
  title: 'Unassign task',
};
const CLAIM_AND_GO: Action = {
  id: 'claim-and-go',
  title: 'Assign to me and go to case',
};
const GO: Action = {
  id: 'go',
  title: 'Go to task',
};

/**
 * This should become "assign" as there's no actual "reassign" API call.
 */
const REASSIGN: Action = {
  id: 'reassign',
  title: 'Reassign task',
};

export const ACTIONS: Action[] = [
  ASSIGN,
  CANCEL,
  CLAIM,
  COMPLETE,
  REASSIGN,
  RELEASE,
];

export const TASK_ACTIONS = {
  ACTIVE: [REASSIGN, RELEASE, GO],
  ALL_WORK: {
    ASSIGNED: [REASSIGN, RELEASE, GO],
    UNASSIGNED: [ASSIGN, GO],
  },
  AVAILABLE: [CLAIM, CLAIM_AND_GO],
  CANCEL: [CANCEL],
  EXECUTE: [COMPLETE],
  // TODO: Remove MANAGER once ALL_WORK used for UI actions
  MANAGER: {
    ASSIGNED: [REASSIGN, RELEASE, COMPLETE, CANCEL],
    UNASSIGNED: [ASSIGN, COMPLETE, CANCEL],
  },
  MY: [REASSIGN, RELEASE, GO],
};

export enum ActionViews {
  MY = 'MyTasks',
  AVAILABLE = 'AvailableTasks',
  MANAGER = 'TaskManager',
  ACTIVE = 'ActiveTasks',
  ALL_WORK = 'AllWork',
}

export enum TaskPermission {
  READ = 'Read',
  REFER = 'Refer',
  MANAGE = 'Manage',
  OWN = 'Own',
  EXECUTE = 'Execute',
  CANCEL = 'Cancel',
}