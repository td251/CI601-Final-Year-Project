const sql = require("./db.js");
const e = require("cors");
const Group = function (group) {
  this.UserCreated = group.UserCreated,
    this.GroupStartDate = group.GroupStartDate,
    this.GroupTimeStart = group.GroupTimeStart,
    this.GroupName = group.GroupName,
    this.NumberOfMembers = group.NumberOfMembers,
    this.Description = group.Description
};
Group.Create = async function create(newGroup, result) {
  var usersInGroup = newGroup.NumberOfMembers;


  newGroup.NumberOfMembers = await numberOfPeopleInGroup(newGroup.NumberOfMembers);
  sql.query("INSERT INTO GroupInfo SET ?", newGroup, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (newGroup.NumberOfMembers > 0) {
      addMembersToSeperateTable(newGroup, usersInGroup, res.insertId);
    }
    result(err, {
      id: res.insertId,
      ...newGroup
    });

  });
}


async function numberOfPeopleInGroup(membersInGroup) {
  return new Promise(function name(resolve, reject) {
    var num = membersInGroup.length;
    if (membersInGroup) {

      resolve(num);
    }
  })
}
async function addMembersToSeperateTable(newGroup, userAdded, id) {
  var startDate = newGroup.GroupStartDate;
  var groupName = newGroup.GroupName;
  for (i = 0; i < userAdded.length; i++) {
    var sqlCommand = "INSERT INTO usergroupinfo(ID, groupID, GroupName, UserName, DateAdded) VALUES (" + null + "," + id + "," + "'" + groupName + "'" + "," + "'" + userAdded[i] + "'" + "," + startDate + ")";
    sql.query(sqlCommand, function (err, result) {
      if (err) throw err;
    })
  }
}
Group.addMembers = async function addMembers(members, groupId, groupName, result) {
  for (i = 0; i < members.length; i++) {
    var sqlCommand = "INSERT INTO usergroupinfo( groupID, GroupName, UserName) VALUES (" + sql.escape(groupId) + "," + "'" + sql.escape(groupName) + "'" + "," + "'" + sql.escape(members[i]) + "'" + ")";
    sql.query(sqlCommand, (err, res) => {
      if (err) {
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({
          kind: "not_found"
        }, null);
        return;
      } else {
        result(null, res);
        return;
      }
    });
  }
}
async function getGroupByGroupId(groupId) {
  var group;
  sql.query(`SELECT * FROM groupinfo where groupId =` + sql.escape(groupId), function (err, result) {
    if (err) {
      result(null, err);
      return;
    }
    resolve(result);
  });
  return group;
}

Group.leave = (groupId, userName, result) => {
  sql.query(`DELETE FROM usergroupinfo WHERE groupId = ` + sql.escape(groupId) `AND  UserName =` + sql.escape(userName), (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    } else {
      result(null, res);
      return;
    }
  });
}
Group.remove = (groupId, result) => {
  var cmd = "DELETE FROM groupinfo WHERE GroupId = ?";
  sql.query(cmd, [groupId], (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, res);
    return;
  });
}
Group.membersInGroup = (groupId, result) => {
  sql.query(`SELECT UserName FROM usergroupinfo WHERE groupId =`+ sql.escape(groupId), groupId, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, res);
    return;

  })
}
Group.getGroupsUsersAddedIn = (userName, result) => {
  sql.query(`SELECT GroupName, GroupId, Description FROM usergroupinfo WHERE UserName =` +  sql.escape(userName), (err, res) => {
    if (err) {
      if (err.kind == "not_found") {
        result(err, null);
        return;
      } else {
        result(err, null);
        return;
      }
    }
    if (res.affectedRows == 0 || res.length == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, res);
    return;

  })
}
async function deleteBookingMembers(groupId) {
  sql.query(`DELETE FROM usergroupinfo WHERE usergroupinfo = ` + sql.escape(groupId), groupId, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

  });
}
Group.findGroups = (UserCreated, result) => {
  sql.query(`SELECT * FROM GroupInfo WHERE UserCreated= ` + sql.escape(UserCreated) + ` ORDER BY GroupStartDate DESC, GroupTimeStart DESC`, (err, res) => {
    if (err) {
      if (err.kind == "not_found") {
        result(err, null);
        return;
      } else {
        result(err, null);
        return;
      }
    }
    if (res.length > 0) {
      result(null, res);
      return;
    }
    result({
      kind: "not_found"
    }, null);
    return;

  });
}
module.exports = Group;