import { ContractPromise } from "@polkadot/api-contract";
import colorTheInternetAbi from "./abi/color_the_internet.json";
import {
  getGasLimitForNotDeploy,
  checkEventsAndInculueError,
} from "./serviceUtils";
import { ColoredData, PersonalData, XXXData } from "@/types/ColorContractTypes";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const colorAddress =
  String(process.env.NEXT_PUBLIC_COLOR_THE_INTERNET_CONTRACT_ADDRESS) ?? "";
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
): Promise<XXXData | null> => {
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

  console.log("###### getXxxData 1 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return null;
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));

  let ressponse: XXXData = {
    xxxId: json_data.xxxId,
    name: response_json.ok.name,
    tags: json_data.ok.tags,
    owner: json_data.ok.owner,
    secondMember: json_data.ok.secondMember,
    thirdMember: json_data.ok.thirdMember,
    coloredSiteId: json_data.ok.coloredSiteId,
  };

  console.log("###### getXxxData 1 ressponse: ", ressponse);

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

export const createXxx = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  name: string,
  tags: string
): Promise<boolean> => {
  console.log("##### createXxx 1");
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.createXxx(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    name,
    tags
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.createXxx(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    name,
    tags
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

export const addSecondMember = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  xxxId: string,
  secondMember: string
): Promise<boolean> => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.addSecondMember(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    xxxId,
    secondMember
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    console.log("###### addSecondMember output: ", output?.toHuman());
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.addSecondMember(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    xxxId,
    secondMember
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

export const addThirdMember = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  xxxId: string,
  thirdMember: string
): Promise<boolean> => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.addThirdMember(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    xxxId,
    thirdMember
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.addThirdMember(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    xxxId,
    thirdMember
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

export const getColoredList = async (
  api: any,
  peformanceAddress: string,
  xxx_id: string
): Promise<Array<ColoredData>> => {
  let response: ColoredData[] = [];
  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.getColoredDataListForXxx(
    peformanceAddress,
    {
      value: 0,
      gasLimit: gasLimit,
    },
    xxx_id
  );

  console.log("###### getSignUpData 2 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return response;
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));

  console.log("###### getColoredList coloreddata:", json_data)

  for (let i = 0; i < json_data.length; i++) {
    const coloredData: ColoredData = {
      coloredId: json_data[i].coloredId,
      url: json_data[i].url,
      owner_approval: json_data[i].ownerApproval,
      second_member_approval: json_data[i].secondMemberApproval,
      third_member_approval: json_data[i].thirdMemberApproval,
      vote_count: json_data[i].voteCount,
    };
    console.log("###### getColoredList coloreddata:", coloredData)
    response.push(coloredData);
  }

  return response;
};

export const approveColoredData = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  xxxId: string,
  coloredId: string
): Promise<boolean> => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.approveColorTheSite(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    xxxId,
    coloredId
  );

  console.log("###### approveColoredData output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.approveColorTheSite(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    xxxId,
    coloredId
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

export const voteColoredData = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  xxxId: string,
  coloredId: string
): Promise<boolean> => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.voteToColorTheSite(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    xxxId,
    coloredId
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.voteToColorTheSite(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    xxxId,
    coloredId
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

export const proposeColorTheSite = async (
  api: any,
  performingAccount: InjectedAccountWithMeta,
  xxxId: string,
  targetUrl: string
): Promise<boolean> => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");

  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const injector = await web3FromSource(performingAccount.meta.source);
  const { output, gasRequired } = await contract.query.proposeColorTheSite(
    performingAccount.address,
    { value: 0, gasLimit: gasLimit, storageDepositLimit },
    xxxId,
    targetUrl
  );

  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err.toHuman());
    return false;
  }

  const tx = await contract.tx.proposeColorTheSite(
    { value: 0, gasLimit: gasRequired, storageDepositLimit },
    xxxId,
    targetUrl
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
