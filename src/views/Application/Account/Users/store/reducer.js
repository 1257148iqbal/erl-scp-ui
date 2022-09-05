const {
  SET_DEPENDENCIES,
  CHANGE_DEPARTMENT,
  CHANGE_INPUT_FIELDS,
  CHANGE_ROLES,
  CHANGE_PASSWORD_VISIBILITY,
  CHANGE_IMAGE,
  CHANGE_DESIGNATION,
  FILL_DESIGNATIONS
} = require('./actionTypes');

export const initialUserCreateState = {
  id: '',
  employeeID: '',
  fullName: '',
  phoneNumber: '',
  email: '',
  departments: [],
  selectedDepartment: null,
  departmentId: '',
  designations: [],
  selectedDesignation: null,
  designationId: '',
  userName: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  roles: [],
  selectedRoles: [],
  isEnabled: true,
  file: null,
  fileURL: null,
  fileName: '',
  showPassword: false,

  operators: [],
  selectedOperator: null,
  departmentName: '',
  jobTitle: '',
  operatorId: ''
};

export const userCreateReducer = (state = initialUserCreateState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_DEPENDENCIES: {
      const { departments, roles } = payload;
      return {
        ...state,
        departments: departments,
        roles: roles
      };
    }

    case CHANGE_INPUT_FIELDS: {
      return {
        ...state,
        [payload.name]: payload.value
      };
    }

    case CHANGE_DEPARTMENT: {
      return {
        ...state,
        selectedDepartment: payload,
        departmentId: payload.value
      };
    }

    case FILL_DESIGNATIONS: {
      return {
        ...state,
        designations: payload
      };
    }

    case CHANGE_DESIGNATION: {
      return {
        ...state,
        selectedDesignation: payload,
        designationId: payload.value
      };
    }

    case CHANGE_ROLES:
      return {
        ...state,
        selectedRoles: payload
      };

    case CHANGE_PASSWORD_VISIBILITY:
      return {
        ...state,
        showPassword: payload
      };

    case CHANGE_IMAGE:
      const { file, fileURL, fileName } = payload;
      return {
        ...state,
        file,
        fileURL,
        fileName
      };
    default:
      return state;
  }
};
