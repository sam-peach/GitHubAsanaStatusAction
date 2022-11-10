const core = require("@actions/core");
const { context } = require("@actions/github");
const { getTaskStatuses, updateTaskStatus } = require("./asana_client");
const { findAsanaTaskIds, shouldMoveStatus } = require("./utils");

const main = async () => {
  try {
    const prBody = context.payload.pull_request.body;

    if (!shouldMoveStatus(prBody)) {
      core.info(">> Opted out of auto status update. Exiting quietly.");
      return;
    }

    const foundIds = findAsanaTaskIds(prBody);

    if (!foundIds || foundIds.length === 0) {
      core.info(">> No Asana task IDs found! Moving on 🏃");
      return;
    }

    core.info(">> Found Asana task IDs:", foundIds);

    const tasksData = await getTaskStatuses(foundIds);

    tasksData.forEach(async (taskData) => {
      core.info(
        `>> Current status of ${taskData.taskId} is ${taskData.currentStatusName}`
      );
      core.info(
        `>> Next status of ${taskData.taskId} is ${taskData.nextStatusName}`
      );
      if (taskData.currentStatusName !== taskData.nextStatusName) {
        core.info(
          `>> Moving ${taskData.taskId} from '${taskData.currentStatusName}' to '${taskData.nextStatusName}' and marking complete as '${taskData.isComplete}' ...`
        );

        await updateTaskStatus(
          taskData.taskId,
          taskData.customStatusFieldId,
          taskData.nextStatusOptionId,
          taskData.isComplete
        );

        core.info(`>> 🎉 Moving complete 🎉`);
      } else {
        core.info(`>> No updated needed! Moving on 🏃`);
      }
    });
  } catch (error) {
    core.warning(`
  💀🚨💀🚨💀🚨💀🚨💀🚨💀
  A problem occured!
  ---
  ${error.message}
  ---
  Exiting quietly.`);
    return;
  }
};

main();
