import { ContractPromise } from "@polkadot/api-contract";
import governanceTokenAbi from "./abi/governance_token.json";
import {
  getGasLimitForNotDeploy,
  checkEventsAndInculueError,
} from "./serviceUtils";
import { PersonalData, XXXData } from "@/types/ColorContractTypes";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const governanceTokenAddress =
  String(process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_CONTRCT_ADDRESS) ?? "";
const storageDepositLimit = null;

export const getBalance = async (
  api: any,
  peformanceAddress: string
): Promise<string> => {
  const contract = new ContractPromise(api, governanceTokenAbi, governanceTokenAddress);
  const gasLimit: any = getGasLimitForNotDeploy(api);

  const { output } = await contract.query.balanceOf(
    peformanceAddress,
    {
      value: 0,
      gasLimit: gasLimit,
    },
    peformanceAddress
  );

  console.log("###### getBalance 1 output: ", output?.toHuman());
  if (output?.toHuman()?.Ok.Err != undefined) {
    alert("Error is occured: " + output?.toHuman()?.Ok.Err);
    return "0";
  }
  let response_json = output.toJSON().ok;
  let json_data = JSON.parse(JSON.stringify(response_json));


  return json_data;
};
