const WA_ASSIGN = {
    id: 'assign',
    title: 'Assign task',
  };
  const WA_CANCEL = {
    id: 'cancel',
    title: 'Cancel task',
  };
  const WA_CLAIM = {
    id: 'claim',
    title: 'Assign to me',
  };
  const WA_COMPLETE = {
    id: 'complete',
    title: 'Mark as done',
  };
  const WA_RELEASE = {
    id: 'unclaim',
    title: 'Unassign task',
  };
  const WA_CLAIM_AND_GO = {
    id: 'claim-and-go',
    title: 'Assign to me and go to tasks',
  };
  const WA_GO = {
    id: 'go',
    title: 'Go to task',
  };
  
  /**
   * This should become "assign" as there's no actual "reassign" API call.
   */
  const WA_REASSIGN = {
    id: 'reassign',
    title: 'Reassign task',
  };
  
  export const WA_ACTIONS = {
    WA_ASSIGN,
    WA_CANCEL,
    WA_CLAIM,
    WA_COMPLETE,
    WA_REASSIGN,
    WA_RELEASE,
  };
  
  export const WA_TASK_ACTIONS = {
    AVAILABLE: [WA_CLAIM, WA_CLAIM_AND_GO],
    ACTIVE: [WA_REASSIGN, WA_RELEASE, WA_ASSIGN],
    MANAGER: {
      ASSIGNED: [WA_REASSIGN, WA_RELEASE, WA_COMPLETE, WA_CANCEL],
      UNASSIGNED: [WA_ASSIGN, WA_COMPLETE, WA_CANCEL],
    },
    ALL_WORK: {
      ASSIGNED: [WA_COMPLETE],
      UNASSIGNED: [WA_COMPLETE],
    },
    WA_CANCEL: {
      ASSIGNED: [WA_CANCEL],
      UNASSIGNED: [WA_CANCEL],
    },
    MY: [WA_REASSIGN, WA_RELEASE, WA_GO],
  };
  
  export enum WA_ActionViews {
    MY = 'MyTasks',
    AVAILABLE = 'AvailableTasks',
    ACTIVE = 'ActiveTasks',
    ALL_WORK = 'TaskManager',
  }
  