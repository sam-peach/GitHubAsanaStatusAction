const { context } = require("@actions/github");
const {
  ACTION_STATUS_MAP,
  COMPLETE,
  CUSTOM_FIELD_NAMES,
} = require("./constants");

const shouldMoveStatus = (prBody) => {
  if (!!prBody) {
    const moveStatusMatch = prBody.match(
      /(?<=(<!--\s+AsanaBot:MoveStatus:))\w+(?=\s+-->)/gm
    );

    return !!moveStatusMatch ? moveStatusMatch.pop() === "true" : false;
  }

  return false;
};

const findAsanaTaskIds = (prBody) =>
  !!prBody
    ? prBody.match(/(?<=app.asana.com\/.*\/.*\/)\d+(?=(\/f$|$))/gm)
    : null;

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
  shouldMoveStatus,
  findAsanaTaskIds,
  filterCustomFields,
  calcNextStatus,
};
