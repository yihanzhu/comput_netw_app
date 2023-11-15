// assignmentsContext.js

import { createContext } from 'react';

const AssignmentsContext = createContext({
  assignments: [],
  setAssignments: () => {}
});

export default AssignmentsContext;
