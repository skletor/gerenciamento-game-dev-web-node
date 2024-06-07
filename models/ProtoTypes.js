const Status = require("./StatusEnum");

const GetStatusEnum = function GetStatusEnum(status) {
    switch (status) {
        case Status.Todo.enum:
          return Status.Todo;
        case Status.Doing.enum:
          return Status.Doing;       
        case Status.Done.enum:
          return Status.Done;
        case Status.Paused.enum:
          return Status.Paused;
      }
};

module.exports = GetStatusEnum;