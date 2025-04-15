"use client";

import { AccountSelector } from "@/components/AccountSelector";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { useApi } from "../contexts/ApiContext";
import { useEffect, useState } from "react";
import { getSignUpData } from "@/services/colorTheInternetService";
import { PersonalData } from "@/types/ColorContractTypes";
import { sign } from "crypto";
import Link from "next/link";

export default function Home() {
  const { selectedAccount } = usePolkadot();
  const { api, isReady } = useApi();
  const [signUpData, setSignUpData] = useState<PersonalData | null>(null);
  // const [blockNumber, setBlockNumber] = useState<string>("");

  useEffect(() => {
    if (!api || !isReady) return;
    const _getSignUpData = async () => {
      console.log("###### _getSignUpData 1");
      if (selectedAccount != null) {
        const personalData = await getSignUpData(
          api,
          String(selectedAccount.address) ?? ""
        );
        setSignUpData(personalData);
      } else {
        return;
      }
    };

    _getSignUpData();

    // const fetchBlock = async () => {
    //   const header = await api.rpc.chain.getHeader();
    //   setBlockNumber(header.number.toString());
    // };

    // fetchBlock();
  }, [api, isReady, selectedAccount]);

  return (
    <>
      <div className="text-center">
        <div>
          <main className="p-8">
            {/* <h1 className="text-2xl font-bold">Welcome to My Next.js Dapp</h1> */}
            <AccountSelector />
            {selectedAccount && (
              <div className="mt-4 text-green-600">
                ✅ Selected Address:{" "}
                <span className="font-mono">{selectedAccount.address}</span>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedAccount != null && signUpData == null && (
        <div className="text-center p-8">
          <Link href="/signup">
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-200">
              Sign up
            </button>
          </Link>
        </div>
      )}
      {signUpData != null && (
        <div>
          <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Personal Profile
            </h2>
            <table className="w-full table-auto text-left text-sm text-gray-700">
              <tbody>
                <tr className="border-t border-gray-200">
                  <th className="py-2 font-medium w-1/3">Real Name</th>
                  <td className="py-2">{signUpData.realName}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <th className="py-2 font-medium">Job</th>
                  <td className="py-2">{signUpData.job}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <th className="py-2 font-medium">X (Twitter)</th>
                  <td className="py-2 text-blue-500 hover:underline">
                    <a
                      href={`https://x.com/${signUpData.xAccount}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{signUpData.xAccount}
                    </a>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <th className="py-2 font-medium">BlueSky</th>
                  <td className="py-2 text-blue-500 hover:underline">
                    <a
                      href={`https://bsky.app/profile/${signUpData.blueSkyAccount}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {signUpData.blueSkyAccount}
                    </a>
                  </td>
                </tr>
                <tr className="border-t border-b border-gray-200">
                  <th className="py-2 font-medium">Email</th>
                  <td className="py-2">
                    <a
                      href={`mailto:${signUpData.emailAccount}`}
                      className="text-blue-500 hover:underline"
                    >
                      {signUpData.emailAccount}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center p-8">
            <Link href="/Xxx">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-200">
                Go to XXX
              </button>
            </Link>
          </div>
        </div>
      )}
      {/* <div>
        <h1>Polkadot ブロックチェーン情報</h1>
        {isReady ? (
          <p>最新ブロック番号: {blockNumber}</p>
        ) : (
          <p>API 初期化中...</p>
        )}
      </div> */}
    </>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
