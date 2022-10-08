const ASANA_API_URL = "https://app.asana.com/api/1.0/";

const CUSTOM_FIELD_NAME_STATUS = "Status";
const CUSTOM_FIELD_NAME_TICKET_STATUS = "Ticket Status";

const CUSTOM_FIELD_NAMES = [
  CUSTOM_FIELD_NAME_STATUS,
  CUSTOM_FIELD_NAME_TICKET_STATUS,
];

const NO_STATUS = "None";
const IN_REVIEW = "In Review";
const COMPLETE = "Complete";

const ACTION_STATUS_MAP = {
  opened: IN_REVIEW,
  reopened: IN_REVIEW,
  edited: IN_REVIEW,
  closed: COMPLETE,
};

module.exports = {
  ASANA_API_URL,
  CUSTOM_FIELD_NAMES,
  ACTION_STATUS_MAP,
  COMPLETE,
  NO_STATUS,
};
