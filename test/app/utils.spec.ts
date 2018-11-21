import { expect } from "chai";
import sinon from "sinon";
import { traverseLeafs } from "../../src/app/utils";

describe("traverseLeafs", () => {
  it("executes the provided visitor for every final value", () => {
    const data = {
      aBoolean: true,
      aNumber: 123,
      aString: "string",
      anObject: { aNestedNumber: 123, aNestedString: "string", aNestedArray: ["string", 123] },
      anArray: ["string", 123, { aNestedNumber: 123, aNestedString: "string" }],
    };
    const visitor = sinon.stub();
    traverseLeafs(data, visitor);
    const expectedCalls = [
      [data.aBoolean, "aBoolean"],
      [data.aNumber, "aNumber"],
      [data.aString, "aString"],
      [data.anObject.aNestedNumber, "anObject.aNestedNumber"],
      [data.anObject.aNestedString, "anObject.aNestedString"],
      [data.anObject.aNestedArray[0], "anObject.aNestedArray.0"],
      [data.anObject.aNestedArray[1], "anObject.aNestedArray.1"],
      [data.anArray[0], "anArray.0"],
      [data.anArray[1], "anArray.1"],
      [(data.anArray[2] as any).aNestedNumber, "anArray.2.aNestedNumber"],
      [(data.anArray[2] as any).aNestedString, "anArray.2.aNestedString"],
    ];
    const actualCalls = visitor.getCalls().map((c) => c.args);
    expect(expectedCalls).to.deep.equal(actualCalls);
  });
  it("returns an object with the values returned by the visitor", () => {
    const data = {
      aBoolean: true,
      aNumber: 123,
      aString: "string",
      anObject: { aNestedNumber: 123, aNestedString: "string", aNestedArray: ["string", 123] },
      anArray: ["string", 123, { aNestedNumber: 123, aNestedString: "string" }],
    };
    const visitor = (k: any) => `${k}`.split("").reverse().join("");
    const expectedData = {
      aBoolean: visitor(true),
      aNumber: visitor(123),
      aString: visitor("string"),
      anObject: {
        aNestedNumber: visitor(123),
        aNestedString: visitor("string"),
        aNestedArray: [visitor("string"), visitor(123)],
      },
      anArray: [
        visitor("string"),
        visitor(123),
        {
          aNestedNumber: visitor(123),
          aNestedString: visitor("string"),
        },
      ],
    };
    const actualData = traverseLeafs(data, visitor);
    expect(actualData).to.deep.equal(expectedData);
  });
});
