import { expect } from "chai";
import { getOrder } from "../controllers/getOrder.js";

const payload = {
  val: function() {
    return {
      dan: {
        coffee: "blue",
        tea: "black"
      },
      kayleigh: {
        tea: "Black like her soul"
      },
      tim: {
        coffee: "brown",
        tea: "red"
      }
    };
  }
};

describe("GetOrder", () => {
  it("should return a users drink", () => {
    const result = getOrder.makeArray(payload);
    console.log(result);

    expect(result).to.deep.equal([
      {
        name: "dan",
        coffee: "blue",
        tea: "black"
      },
      {
        name: "kayleigh",
        tea: "Black like her soul"
      },
      {
        name: "tim",
        coffee: "brown",
        tea: "red"
      }
    ]);
  });
});
