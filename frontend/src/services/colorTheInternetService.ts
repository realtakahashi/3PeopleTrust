import { ContractPromise } from "@polkadot/api-contract";
import colorTheInternetAbi from "./abi/color_the_internet.json";
import {
  getGasLimitForNotDeploy,
  checkEventsAndInculueError,
} from "./serviceUtils";
import { PersonalData, XXXData } from "@/types/ColorContractTypes";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const colorAddress =
  String(process.env.NEXT_PUBLIC_DAO_ORIENTED_FLIPPER_CONTRACT_ADDRESS) ?? "";
const storageDepositLimit = null;

export const getSignUpData = async (
  api: any,
  peformanceAddress: string
): Promise<PersonalData | null> => {
  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.getPersonalData(
    peformanceAddress,
    {
      value: 0,
      gasLimit: gasLimit,
    },
    peformanceAddress
  );

  console.log("###### getSignUpData 2 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return null;
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));

  const res: PersonalData = {
    realName: json_data.ok.realName,
    job: json_data.ok.job,
    xAccount: json_data.ok.xAccount,
    blueSkyAccount: json_data.ok.blueSkyAccount,
    emailAccount: json_data.ok.emailAccount,
  };

  return res;
};

export const signUp = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  personalData: PersonalData
): Promise<boolean> => {
  console.log("##### signUp 1");
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.signUp(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    personalData.realName,
    personalData.job,
    personalData.xAccount,
    personalData.blueSkyAccount,
    personalData.emailAccount
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.signUp(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    personalData.realName,
    personalData.job,
    personalData.xAccount,
    personalData.blueSkyAccount,
    personalData.emailAccount
  );
  if (injector !== undefined) {
    const unsub = await tx.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      ({ status, events = [] }) => {
        if (status.isFinalized) {
          if (checkEventsAndInculueError(events)) {
            alert("Transaction is failure.");
          }
          unsub();
        }
      }
    );
  }
  return true;
};

export const getXxxData = async (
  api: any,
  peformanceAddress: string,
  xxxId: Number
): Promise<XXXData> => {
  let ressponse: XXXData = {
    xxxId: 0,
    name: "",
    tags: "",
    owner: "",
    secondMember: "",
    thirdMember: "",
    coloredSiteId: 0,
  };
  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.getXxxData(
    peformanceAddress,
    {
      value: 0,
      gasLimit: gasLimit,
    },
    xxxId
  );

  console.log("###### getSignUpData 2 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return ressponse;
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));

  ressponse.xxxId = json_data.xxxId;
  ressponse.name = json_data.name;
  ressponse.tags = json_data.tags;
  ressponse.owner = json_data.owner;
  ressponse.secondMember = json_data.secondMember;
  ressponse.thirdMember = json_data.thirdMember;
  ressponse.coloredSiteId = json_data.coloredSiteId;

  return ressponse;
};

export const getXxxList = async (
  api: any,
  peformanceAddress: string
): Promise<Array<XXXData>> => {
  let response: XXXData[] = [];
  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.getXxxDataList(peformanceAddress, {
    value: 0,
    gasLimit: gasLimit,
  });

  console.log("###### getSignUpData 2 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return response;
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));
  for (let i = 0; i < json_data.length; i++) {
    const xxxData: XXXData = {
      xxxId: json_data[i].xxxId,
      name: json_data[i].name,
      tags: json_data[i].tags,
      owner: json_data[i].owner,
      secondMember: json_data[i].secondMember,
      thirdMember: json_data[i].thirdMember,
      coloredSiteId: json_data[i].coloredSiteId,
    };
    response.push(xxxData);
  }

  return response;
};
