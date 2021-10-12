import { Pab, withInstanceId } from "../../src/index";

type AvailableContracts = { tag: "Owner" } | { tag: "User" };

type StartAuctionParams = {
  price: number;
  duration: number;
};

type OwnerEndpoints = [
  {
    name: "start";
    params: StartAuctionParams;
    response: { tag: "Started"; lotId: string };
  },
  {
    name: "close";
    params: {
      lotId: string;
    };
    response: { tag: "Closed" };
  }
];

type BidParams = {
  lotId: string;
  price: number;
};

type UserEndpoints = [
  {
    name: "bid";
    params: BidParams;
    response: { tag: "BidSubmitted" };
  }
];

const auctionPab = new Pab<
  AvailableContracts,
  { Owner: OwnerEndpoints; User: UserEndpoints }
>("baseURL");

// find a running contract instance using tag from the available contract types
const ownerInstance = auctionPab.getContracts().then((contracts) => {
  const ownerContract = contracts.find(
    (contract) => contract.cicDefinition.tag === "Owner"
  );

  if (ownerContract === undefined) {
    throw new Error("Owner contract instance not found");
  } else {
    return ownerContract;
  }
});

// get instance id
const ownerInstanceId = ownerInstance.then(
  ({ cicContract: { unContractInstanceId } }) => unContractInstanceId
);

// this helper applies an instance id and a contract type
// to methods that are dependent on them, so you don't have to pass them every time
const ownerHandle = ownerInstanceId.then((contractId) =>
  withInstanceId(auctionPab)<"Owner">(contractId)
);

ownerHandle.then((handle) =>
  handle
    .callEndpoint("start", { price: 10, duration: 10 })
    .then(() => handle.getState())
    .then((state) => {
      switch (state.tag) {
        case "Started":
          console.log("Auction started");
          break;
        case "Closed":
          console.log("Auction closed");
          break;
      }
    })
);

ownerHandle.then((handle) => {
  handle.createSocket();
  handle.subscribe((state) => console.log("new state", state));
});
