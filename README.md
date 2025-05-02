# For Polkadot Scalability Hackathon
# Project title and its concise description (3-4 sentences)

“Color The Internet”

This dApp is aimed to create new use case of web3. By using web3 power(transparency & token economics) this dApp will improve the search engine eco system.  To make this dApp sustainable I use “DAO Oriented Protocol” which I developed in another hackathon. 

# A comprehensive description of the project and its implementation (more on this in the judging criteria)

I have wrote an article which is explained the details of this dApp.

https://realtakahashi-work.medium.com/color-the-internet-20b3ae6f966f

https://realtakahashi-work.medium.com/re-dao-oriented-protocol-a8e9bc0b42f3

# Links to the source code

I developed 2 version of “Color The Internet”. 1st version is stand alone version. It means not using “DAO Oriented Protocol”. 2nd version is “DAO Oriented Protocol version”.

- 1st version
    
    https://github.com/realtakahashi/color_the_internet
    
- 2nd version
    
    https://github.com/realtakahashi/dao_oriented_protocol/tree/migrateTo5_0/example/color_the_internet
    

# List of AI tools used (if any)

- Github copilot

# References and citations to the documentation followed

- https://use.ink/docs/v5/how-it-works/
- https://substrate.stackexchange.com/questions/tagged/ink?tab=Votes
- https://github.com/use-ink/ink-examples

# Attribution to the code (re)used from other sources

- For 2nd version, I reused “DAO Oriented Protocol”. I have developed this protocol in 2023.
    - https://github.com/realtakahashi/dao_oriented_protocol/tree/migrateTo5_0/protocol

# A brief writeup on the devex of smart contracts on Pokadot

- Pros
    - I think “ink!” is very powerful tool than solidity when we develop dApps because this language is implemented by rust.
    - For example safe, string operation, efficiency of coding, error handling & etc in every scene rust is very powerful for all developers.
    - Especially for enterprise, I think solidity is not enough to develop complex functions on smart contract and ink! is enough.
- Cons
    - We do not have development tool like “hardhat”. (Maybe 2 years ago Astar team have implemented “swanky” but the implementation is stopped.)
    - We do not have ecosystem project like “OpenZeppelin”(Maybe 2 years ago Brush farm team have implemented “openbrush” but the implementation is stopped.)

# Suggestions/feedback on Polkadot tooling and developer documentation

- “ink!” is quite excellent!
- Similar tool of “hardhat” is needed for “ink!” ecosystem.
- Similar project of “OpenZeppelin” is needed for “ink!” ecosystem.

# An optional video walkthrough of the project with a maximum run length of 3 mins

https://youtu.be/1JdXpcdLyKE

-- The following contents are just memo --

# Color the internet
## 3rd version
### Idea
- The basic philosophy is not changed with 1st version.
- Additional idea
  - Providing gas
    - When people use this dApp, a very few native token is provided by dApp.
    - When the dApp is deployed, the deployer deposite native tokens.  
  - This dApp has governance token which represent the value of the power of informations that trusted poepole gather.
    - When people finish the milesone, the governance tokens are provided.
      - Milestones
        - Sign up *2
        - Create XXX *4
        - Propose the site *4
        - Approve the site *2
        - Vote the site *1   
---
## 2nd version
### Idea
- The basic philosophy is not changed with 1st version.
### Functions
- The basic functions are not changed with 1st version.
- Additional functions
  - "XXX" can be created until the native token(governance token) will be listed on the crpto exchange.
  - When the native token is listed, the election of "XXX" will be held.
    - The group which can not be get the votes will be deleted.  
---
## 1st version
### Idea
- This application is the smart contract which can be deployed to pallet_contract on substrate.
- When you sign up, you have to register "real name", "job", "community which you are belong to" & etc.
- We can create a specific group but the group can have only 3 members. It is named "XXX".
- This group can be used by marking the information, for example blog, news, & any other informations which are on the internet.
- We can express the power of trust of the pepople.
- This idea is depends on the conversation of the member of Open Guild which is the community of Polkadot. 
### Functions
- Creating "XXX".
  - This "XXX" should be had 3 members.
  - If the "XXX" have 3 members, the "XXX" can start to work.
- Invite members to "XXX".
  - The owner can invite the member.(2 members)
  - If you can get other 2 members, this "XXX" has 3 members.
  - And 3 members can get a few native tokens for gas.
- Propose the useful information.
  - The members can be propose the usefunl web page for other members.
- Agree the information
  - If other members agee the usefulness for the web page which was proposed by other members, the member can show the agreement for the proposal.
  - If all members agree the web page, the web page is marked as the confirmed page by this "XXX".
  - When all members confirm, 3 members can get a few native tokens.
- Vote the information
  - People who is not the member of the "XXX" can vote when they thought the confirmed page is useful.
  - When pepole vote, they can get a few native tokens.
