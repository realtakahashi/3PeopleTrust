import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { ContractPromise, CodePromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";
import assert from "assert";

import ColorContract from "./contract_files/color_the_internet.contract.json";
import ColorContractAbi from "../color_the_internet/target/ink/color_the_internet.json";
import GovernanceContract from "./contract_files/governance_token.contract.json";
import GovernanceContractAbi from "../governance_token/target/ink/governance_token.json";

let api: any;
let deployer: any;
let keyring: any;
const storageDepositLimit = null;

let next_scenario: number = 1;

let colorContractAddress = "";
let governanceContractAddress = "";

const checkEventsAndInculueError = (events: any[]): boolean => {
  let ret = false;
  events.forEach(({ event: { data } }) => {
    // console.log("### data.methhod:", data.method);
    if (String(data.method) == "ExtrinsicFailed") {
      console.log("### check ExtrinsicFailed");
      ret = true;
    }
  });
  // console.log("### ret is:", ret);
  return ret;
};

export const getGasLimitForNotDeploy = (api: any): any => {
  const gasLimit: any = api.registry.createType("WeightV2", {
    refTime: new BN("100000000000"),
    proofSize: new BN("100000000000"),
    // refTime: 6219235328,
    // proofSize: 131072,
  });
  return gasLimit;
};

const test_controller = async () => {
  switch (next_scenario) {
    case 1:
      await deployColorTheInternet(test_controller);
      break;
    case 2:
      await deployGovernanceToken(test_controller);
      break;
    case 3:
        await setGovernanceTokenAddress(test_controller);
    default:
      api.disconnect();
      console.log("# End executeAllTest");
      break;
  }
  next_scenario++;
};

export const executeAllTest = async () => {
  console.log("Start executeAllTest");

  const wsProvider = new WsProvider("ws://127.0.0.1:9944");
  api = await ApiPromise.create({ provider: wsProvider });
  keyring = new Keyring({ type: "sr25519" });
  deployer = keyring.addFromUri("//Alice");

  await test_controller();
};

// deployGovernanceToken
const deployGovernanceToken = async (callBack: () => void) => {
    console.log("## Start deployGovernanceToken");
  
    const contractWasm = GovernanceContract.source.wasm;
    const contract = new CodePromise(api, GovernanceContractAbi, contractWasm);
    const gasLimit: any = api.registry.createType("WeightV2", {
      refTime: 3219235328,
      proofSize: 131072,
    });
  
    const tx = contract.tx.new(
      { gasLimit, storageDepositLimit },
      999999999999999,
      colorContractAddress,
  );
  
    //@ts-ignore
    const unsub = await tx.signAndSend(
      deployer,
      //@ts-ignore
      ({ events = [], status, contract }) => {
        if (status.isFinalized) {
          if (checkEventsAndInculueError(events)) {
            console.log("Transaction is failure.");
          } else {
            governanceContractAddress = contract.address.toString();
          }
          unsub();
          console.log("### governanceContractAddress:", governanceContractAddress);
          console.log("## End deployGovernanceToken");
          callBack();
        }
      }
    );
  };
  

// deployColorTheInternet
const deployColorTheInternet = async (callBack: () => void) => {
  console.log("## Start deployColorTheInternet");

  const contractWasm = ColorContract.source.wasm;
  const contract = new CodePromise(api, ColorContractAbi, contractWasm);
  const gasLimit: any = api.registry.createType("WeightV2", {
    refTime: 3219235328,
    proofSize: 131072,
  });

  const tx = contract.tx.new(
    { gasLimit, storageDepositLimit },
    100
);

  //@ts-ignore
  const unsub = await tx.signAndSend(
    deployer,
    //@ts-ignore
    ({ events = [], status, contract }) => {
      if (status.isFinalized) {
        if (checkEventsAndInculueError(events)) {
          console.log("Transaction is failure.");
        } else {
          colorContractAddress = contract.address.toString();
        }
        unsub();
        console.log("### colorContractAddress:", colorContractAddress);
        console.log("## End deployColorTheInternet");
        callBack();
      }
    }
  );
};

const main = () => {
  console.log("# Start executeAllTest");
  executeAllTest();
};

main();
