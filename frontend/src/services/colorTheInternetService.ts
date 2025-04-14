import { ContractPromise } from "@polkadot/api-contract";
import colorTheInternetAbi from "./abi/color_the_internet.json";
import { getGasLimitForNotDeploy } from "./serviceUtils";
import { PersonalData } from "@/types/ColorContractTypes";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export const getSignUpData = async (
  api: any,
  peformanceAddress: string
): Promise<PersonalData | null> => {
  const colorAddress =
    String(process.env.NEXT_PUBLIC_DAO_ORIENTED_FLIPPER_CONTRACT_ADDRESS) ?? "";
  const contract = new ContractPromise(api, colorTheInternetAbi, colorAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.getPersonalData(peformanceAddress, {
    value: 0,
    gasLimit: gasLimit,
  });

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
  }

  return res;
};

export const signUp = async (
    api:any,
    performingAccount: InjectedAccountWithMeta,
    personalData: PersonalData
): Promise<boolean> => {
    
}
