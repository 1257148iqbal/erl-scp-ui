import { DEPARTMENT } from 'constants/ApiEndPoints/v1';
import { http } from 'services/httpService';

const DepartmentService = {
  getActiveDepartments: async (pageNumber, pageSize, sortedColumn, sortedBy, token) => {
    try {
      const response = await http.get(`${DEPARTMENT.get_all}`, {
        params: {
          pageNumber,
          pageSize,
          sortedColumn,
          sortedBy
        },
        cancelToken: token
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default DepartmentService;
