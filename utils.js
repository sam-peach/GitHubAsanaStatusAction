const { context } = require("@actions/github");
const {
  ACTION_STATUS_MAP,
  COMPLETE,
  CUSTOM_FIELD_NAMES,
} = require("./constants");

const findAsanaTaskIds = (prBody) =>
  !!prBody ? prBody.match(/(?<=app.asana.com\/.*\/.*\/)\d+/gm) : null;

const filterCustomFields = (taskData) =>
  taskData.custom_fields.find(({ name }) => CUSTOM_FIELD_NAMES.includes(name));

const calcNextStatus = (enumOptions) => {
  const action = context.payload.action;
  const statusOptions = enumOptions.reduce(
    (accum, opt) => ({ ...accum, [opt.name]: opt.gid }),
    {}
  );
  const nextStatus = ACTION_STATUS_MAP[action];

  return {
    nextStatusName: nextStatus,
    nextStatusOptionId: statusOptions[nextStatus] || null,
    isComplete: nextStatus === COMPLETE ? true : false,
  };
};

module.exports = {
  findAsanaTaskIds,
  filterCustomFields,
  calcNextStatus,
};
