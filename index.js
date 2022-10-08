const core = require("@actions/core");
const { context } = require("@actions/github");
const { getTaskStatuses, updateTaskStatus } = require("./asana_client");
const { findAsanaTaskIds } = require("./utils");

const main = async () => {
  const foundIds = findAsanaTaskIds(context.payload.pull_request.body);

  if (foundIds.length === 0) {
    console.log(">> No Asana task IDs found! Moving on 🏃");
    return;
  }

  console.log(">> Found Asana task IDs:", foundIds);

  const tasksData = await getTaskStatuses(foundIds);

  tasksData.forEach(async (taskData) => {
    console.log(
      `>> Current status of ${taskData.taskId} is ${taskData.currentStatusName}`
    );
    console.log(
      `>> Next status of ${taskData.taskId} is ${taskData.nextStatusName}`
    );
    if (taskData.currentStatusName !== taskData.nextStatusName) {
      console.log(
        `>> Moving ${taskData.taskId} from '${taskData.currentStatusName}' to '${taskData.nextStatusName}' and marking complete as '${taskData.isComplete}' ...`
      );

      await updateTaskStatus(
        taskData.taskId,
        taskData.customStatusFieldId,
        taskData.nextStatusOptionId,
        taskData.isComplete
      );

      console.log(`>> 🎉 Moving complete 🎉`);
    } else {
      console.log(`>> No updated needed! Moving on 🏃`);
    }
  });
};

try {
  main();
} catch (error) {
  core.warning(`
  👁👄👁
  A problem occured!
  ---
  ${error.message}
  ---
  Exiting quietly.`);
}
