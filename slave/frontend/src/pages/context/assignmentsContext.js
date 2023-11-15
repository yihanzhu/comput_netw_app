// assignmentsContext.js

import { createContext } from 'react';

const AssignmentsContext = createContext({
  assignments: [], // Provide a default value
});

export default AssignmentsContext;