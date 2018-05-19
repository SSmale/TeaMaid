module.exports.getOrder = {
  makeArray: payload => {
    const members = payload.val();
    let all = [];

    for (let name in members) {
      let item = {};
      item.name = name;
      let drinks = members[name];
      for (let beverage in drinks) {
        item[beverage] = drinks[beverage];
      }
      all.push(item);
    }
    return all;
  }
};

// const user = all.find(x => x.name == userName);
// if (user) {
//   speechOutput = `${userName} has their ${slotBeverage} ${
//     all.find(x => x.name == userName)[slotBeverage]
//   }`;
// } else {
//   speechOutput = "I cannot find a user by that name";
// }
