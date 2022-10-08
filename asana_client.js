const axios = require("axios");
const { getInput } = require("@actions/core");
const { calcNextStatus, filterCustomFields } = require("./utils");

const { ASANA_API_URL, CUSTOM_FIELD_NAMES, NO_STATUS } = require("./constants");

const asanaClient = axios.create({
  baseURL: ASANA_API_URL,
  headers: {
    Authorization: `Bearer ${getInput("asana-api-token", { required: true })}`,
  },
});

const commonRequestParams = {
  validateStatus: (statusCode) => statusCode < 400,
};

const getTaskStatuses = async (taskIds) => {
  return Promise.all(
    taskIds.map(async (taskId) => {
      const { data } = await asanaClient.get(
        `tasks/${taskId}`,
        commonRequestParams
      );

      const { data: taskData } = data;

      const statusFields = filterCustomFields(taskData);

      if (statusFields === undefined) {
        throw new Error(`No custom field found matching ${CUSTOM_FIELD_NAMES}`);
      }

      const { nextStatusName, nextStatusOptionId, isComplete } = calcNextStatus(
        statusFields.enum_options
      );

      return {
        taskId: taskData.gid,
        customStatusFieldId: statusFields.gid,
        currentStatusName: statusFields.enum_value?.name || NO_STATUS,
        nextStatusName,
        nextStatusOptionId,
        isComplete,
      };
    })
  );
};

const updateTaskStatus = async (
  taskId,
  customStatusFieldId,
  newStatusId,
  isComplete
) => {
  const { data } = await asanaClient.put(`tasks/${taskId}`, {
    ...commonRequestParams,
    data: {
      completed: isComplete,
      custom_fields: {
        [customStatusFieldId]: newStatusId,
      },
    },
  });

  return data;
};

module.exports = { getTaskStatuses, updateTaskStatus };
