#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod color_the_internet {

    const SIGNUP: u128 = 2;
    const CREATEXXX: u128 = 4;
    const PROPOSE: u128 = 4;
    const APPROVE: u128 = 4;
    const VOTE: u128 = 1;

    // const REF_TIME_LIMIT: u64 = 32192353280000000;
    // const PROOF_SIZE_LIMIT: u64 = 1310720000000;
    // const STORAGE_DEPOSIT_LIMIT: Balance = 0;

    use governance_token::governance_token::GovernanceTokenRef;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    use ink::codegen::TraitCallBuilder;

    #[derive(Clone)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, PartialEq, Eq, ink::storage::traits::StorageLayout)
    )]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct PersonData {
        pub real_name: String,
        pub job: String,
        pub x_account: String,
        pub blue_sky_account: String,
        pub email_account: String,
    }
    #[derive(Clone)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, PartialEq, Eq, ink::storage::traits::StorageLayout)
    )]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct XXXData {
        pub name: String,
        pub tags: String,
        pub owner: AccountId,
        pub second_member: Option<AccountId>,
        pub third_member: Option<AccountId>,
        pub colored_site_id: u128,
    }
    #[derive(Clone)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, PartialEq, Eq, ink::storage::traits::StorageLayout)
    )]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ColoredData {
        pub url: String,
        pub owner_approval: bool,
        pub second_member_approval: bool,
        pub third_member_approval: bool,
        pub vote_count: u128,
    }

    #[ink(storage)]
    pub struct ColorTheInternet {
        personal_data_id: u128,
        personal_data_list: Mapping<AccountId, PersonData>,
        personal_data_list_for_id: Mapping<u128, PersonData>,
        xxx_id: u128,
        xxx_data_list: Mapping<u128, XXXData>, //xxxid
        colored_data_list: Mapping<(u128, u128), ColoredData>, //(xxx_id, colored_id)
        vote_list: Mapping<(u128, u128, AccountId), bool>, //(xxx_id, colored_id, AccountId)
        owner: AccountId,
        is_stopped_creating_xxx_for_listing: bool,
        governance_token_address: AccountId,
        governance_token_base_fee: Balance,
    }

    #[ink(event)]
    pub struct Signedup {
        #[ink(topic)]
        personal_data_id: u128,
        #[ink(topic)]
        eoa_address: Option<AccountId>,
        real_name: String,
    }

    #[ink(event)]
    pub struct CreatedXXX {
        #[ink(topic)]
        xxx_id: u128,
        #[ink(topic)]
        owner: AccountId,
        name: String,
        tags: String,
    }

    #[ink(event)]
    pub struct AddedMember {
        #[ink(topic)]
        xxx_id: u128,
        target_member: AccountId,
    }

    #[ink(event)]
    pub struct ProposedColorTheSite {
        #[ink(topic)]
        xxx_id: u128,
        #[ink(topic)]
        colored_id: u128,
        #[ink(topic)]
        proposer: AccountId,
        target_url: String,
    }

    #[ink(event)]
    pub struct ApprovedColorTheSite {
        #[ink(topic)]
        xxx_id: u128,
        #[ink(topic)]
        colored_id: u128,
        #[ink(topic)]
        approver: AccountId,
        target_url: String,
    }

    #[ink(event)]
    pub struct StoppedToCreateXXX {}

    #[ink(event)]
    pub struct Voted {
        #[ink(topic)]
        xxx_id: u128,
        #[ink(topic)]
        colored_id: u128,
        #[ink(topic)]
        voter: AccountId,
        target_url: String,
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[allow(clippy::cast_possible_truncation)]
    pub enum Error {
        /// The user has not signed up yet.
        TheUserDoesNotSignedUpYet,
        /// Same name can not be accepted.
        NameAleadyExists,
        /// Only the owner can call this function.
        OnlyOwnerDoes,
        /// Only the owner of XXX can call this function.
        OnlyXXXOwnerDoes,
        /// Creating xxx is already stopped.
        CreatingXXXIsAlreadyStopped,
        /// The xxx does not exist.
        TheXXXDoesNotExist,
        /// The xxx is not working.
        TheXXXIsNotWorking,
        /// Already set the member.
        AlreadySetTheMember,
        /// Cannot set same member.
        CannotSetSameMember,
        /// Only xxx members can propose color the site.
        OnlyXXXMembersCanPropose,
        /// Only xxx members can agree color the site.
        OnlyXXXMembersCanAgree,
        /// Already proposed
        AlreadyProposed,
        /// The xxx has same site.
        TheXXXHasSameSite,
        /// The site does not exist.
        TheSiteDoesNotExist,
        /// The target site is not approved.
        TheTargetSiteIsNotApproved,
        /// The user has already voted the site.
        TheUserHasAlreadyVoted,
        /// Calling governance token function failed.
        CallingGovernanceTokenFunctionFailed,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl ColorTheInternet {
        #[ink(constructor)]
        pub fn new(governance_toke_fee: Balance) -> Self {
            Self {
                personal_data_id: 0,
                personal_data_list: Mapping::default(),
                personal_data_list_for_id: Mapping::default(),
                xxx_id: 0,
                xxx_data_list: Mapping::default(),
                colored_data_list: Mapping::default(),
                owner: Self::env().caller(),
                is_stopped_creating_xxx_for_listing: false,
                vote_list: Mapping::default(),
                governance_token_address: AccountId::from([0; 32]),
                governance_token_base_fee: governance_toke_fee,
            }
        }

        #[ink(message)]
        pub fn set_governance_token_address(&mut self, contract_address: AccountId) -> Result<()> {
            match self._is_caller_owner() {
                true => {
                    self.governance_token_address = contract_address;
                    Ok(())
                },
                false => return Err(Error::OnlyOwnerDoes),
            }
        }

        #[ink(message)]
        pub fn sign_up(
            &mut self,
            real_name: String,
            job: String,
            x_account: String,
            blue_sky_account: String,
            email_account: String,
        ) -> Result<()> {
            let caller = self.env().caller();
            let person_data = PersonData {
                real_name,
                job,
                x_account,
                blue_sky_account,
                email_account,
            };
            self.personal_data_list.insert(caller, &person_data);
            self.personal_data_list_for_id
                .insert(self.personal_data_id, &person_data);
            self.personal_data_id = self.personal_data_id.saturating_add(1);

            let mut governance_token: GovernanceTokenRef =
                ink::env::call::FromAccountId::from_account_id(self.governance_token_address);
            let amount = self.governance_token_base_fee.saturating_mul(SIGNUP);

            // let call_builder = governance_token.call_mut();
            // call_builder
            //     .transfer(caller, amount)
            //     .ref_time_limit(REF_TIME_LIMIT)
            //     .proof_size_limit(PROOF_SIZE_LIMIT)
            //     .storage_deposit_limit(STORAGE_DEPOSIT_LIMIT)
            //     .invoke();

            // call_builder.transfer(caller, amount).call_v1().invoke();

            match governance_token.transfer(caller, amount) {
                Ok(_) => (),
                Err(_) => {
                    ink::env::debug_println!("########## color_the_internet::sign_up:[1] ");
                    return Err(Error::CallingGovernanceTokenFunctionFailed);
                }
            }
            ink::env::debug_println!("########## color_the_internet::sign_up:[2] ");

            Self::env().emit_event(Signedup {
                personal_data_id: self.personal_data_id,
                eoa_address: Some(caller),
                real_name: person_data.real_name.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn create_xxx(&mut self, name: String, tags: String) -> Result<()> {
            if self.is_stopped_creating_xxx_for_listing == true {
                return Err(Error::CreatingXXXIsAlreadyStopped)
            }
            if self._does_the_user_signed_up(self.env().caller()) == false {
                return Err(Error::TheUserDoesNotSignedUpYet);
            }
            if self._has_same_name_xxx(name.clone()) {
                return Err(Error::NameAleadyExists);
            }
            let caller = self.env().caller();
            let xxx_id = self.xxx_id;
            let xxx_data = XXXData {
                name: name.clone(),
                tags: tags.clone(),
                owner: caller,
                second_member: None,
                third_member: None,
                colored_site_id: 0,
            };
            self.xxx_data_list.insert(self.xxx_id, &xxx_data);
            self.xxx_id = self.xxx_id.saturating_add(1);

            let mut governance_token: GovernanceTokenRef =
                ink::env::call::FromAccountId::from_account_id(self.governance_token_address);
            let amount = self.governance_token_base_fee.saturating_mul(CREATEXXX);
            match governance_token.transfer(caller, amount) {
                Ok(_) => (),
                Err(_) => return Err(Error::CallingGovernanceTokenFunctionFailed),
            }

            self.env().emit_event(CreatedXXX {
                xxx_id: xxx_id,
                owner: caller,
                name: name,
                tags: tags,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn add_second_member(&mut self, xxx_id: u128, target_member: AccountId) -> Result<()> {
            if self._does_the_user_signed_up(target_member) == false {
                return Err(Error::TheUserDoesNotSignedUpYet);
            }
            let xxx_data = match self.xxx_data_list.get(xxx_id) {
                Some(value) => value,
                None => return Err(Error::TheXXXDoesNotExist),
            };
            if self._is_caller_xxx_owner(&xxx_data) == false {
                return Err(Error::OnlyXXXOwnerDoes);
            }
            if xxx_data.second_member.is_some() {
                return Err(Error::AlreadySetTheMember);
            }
            if xxx_data.owner == target_member {
                return Err(Error::CannotSetSameMember);
            }
            if xxx_data.third_member.is_some_and(|f| f == target_member) {
                return Err(Error::CannotSetSameMember);
            }
            self.xxx_data_list.insert(
                xxx_id,
                &XXXData {
                    name: xxx_data.name.clone(),
                    tags: xxx_data.tags.clone(),
                    owner: xxx_data.owner,
                    second_member: Some(target_member),
                    third_member: xxx_data.third_member,
                    colored_site_id: xxx_data.colored_site_id,
                },
            );
            self.env().emit_event(AddedMember {
                xxx_id: xxx_id,
                target_member: target_member,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn add_third_member(&mut self, xxx_id: u128, target_member: AccountId) -> Result<()> {
            if self._does_the_user_signed_up(target_member) == false {
                return Err(Error::TheUserDoesNotSignedUpYet);
            }
            let xxx_data = match self.xxx_data_list.get(xxx_id) {
                Some(value) => value,
                None => return Err(Error::TheXXXDoesNotExist),
            };
            if self._is_caller_xxx_owner(&xxx_data) == false {
                return Err(Error::OnlyXXXOwnerDoes);
            }
            if xxx_data.third_member.is_some() {
                return Err(Error::AlreadySetTheMember);
            }
            if xxx_data.owner == target_member {
                return Err(Error::CannotSetSameMember);
            }
            if xxx_data.second_member.is_some_and(|f| f == target_member) {
                return Err(Error::CannotSetSameMember);
            }
            self.xxx_data_list.insert(
                xxx_id,
                &XXXData {
                    name: xxx_data.name.clone(),
                    tags: xxx_data.tags.clone(),
                    owner: xxx_data.owner,
                    second_member: xxx_data.second_member,
                    third_member: Some(target_member),
                    colored_site_id: xxx_data.colored_site_id,
                },
            );
            self.env().emit_event(AddedMember {
                xxx_id: xxx_id,
                target_member: target_member,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn propose_color_the_site(&mut self, xxx_id: u128, target_url: String) -> Result<()> {
            let xxx_data = match self.xxx_data_list.get(xxx_id) {
                Some(value) => value,
                None => return Err(Error::TheXXXDoesNotExist),
            };
            if self._does_the_xxx_work(&xxx_data) == false {
                return Err(Error::TheXXXIsNotWorking);
            }
            if self._is_caller_xxx_members(&xxx_data) == false {
                return Err(Error::OnlyXXXMembersCanPropose);
            }
            if self._does_the_xxx_has_same_site(xxx_id, &xxx_data, target_url.clone()) {
                return Err(Error::TheXXXHasSameSite);
            }
            let colored_site_id = xxx_data.colored_site_id;
            let colored_data = ColoredData {
                url: target_url.clone(),
                owner_approval: self._is_caller_xxx_owner(&xxx_data),
                second_member_approval: self._is_caller_xxx_second_member(&xxx_data),
                third_member_approval: self._is_caller_xxx_third_member(&xxx_data),
                vote_count: 0,
            };
            self.colored_data_list
                .insert((xxx_id, colored_site_id), &colored_data);
            self.xxx_data_list.insert(
                xxx_id,
                &XXXData {
                    name: xxx_data.name.clone(),
                    tags: xxx_data.tags.clone(),
                    owner: xxx_data.owner,
                    second_member: xxx_data.second_member,
                    third_member: xxx_data.third_member,
                    colored_site_id: colored_site_id.saturating_add(1),
                },
            );

            let caller = self.env().caller();
            let mut governance_token: GovernanceTokenRef =
                ink::env::call::FromAccountId::from_account_id(self.governance_token_address);
            let amount = self.governance_token_base_fee.saturating_mul(PROPOSE);
            match governance_token.transfer(caller, amount) {
                Ok(_) => (),
                Err(_) => return Err(Error::CallingGovernanceTokenFunctionFailed),
            }

            self.env().emit_event(ProposedColorTheSite {
                xxx_id: xxx_id,
                colored_id: colored_site_id,
                proposer: caller,
                target_url: target_url,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn approve_color_the_site(&mut self, xxx_id: u128, colored_id: u128) -> Result<()> {
            let xxx_data = match self.xxx_data_list.get(xxx_id) {
                Some(value) => value,
                None => return Err(Error::TheXXXDoesNotExist),
            };
            if self._does_the_xxx_work(&xxx_data) == false {
                return Err(Error::TheXXXIsNotWorking);
            }
            if self._is_caller_xxx_members(&xxx_data) == false {
                return Err(Error::OnlyXXXMembersCanAgree);
            }
            let colored_site = match self.colored_data_list.get((xxx_id, colored_id)) {
                Some(value) => value,
                None => return Err(Error::TheSiteDoesNotExist),
            };

            let caller = self.env().caller();
            let new_colored_data =  
                if caller == xxx_data.owner {
                    ColoredData {
                        url: colored_site.url.clone(),
                        owner_approval: true,
                        second_member_approval: colored_site.second_member_approval,
                        third_member_approval: colored_site.third_member_approval,
                        vote_count: colored_site.vote_count,
                    }
                }
                else if xxx_data.second_member.is_some() && Some(caller) == xxx_data.second_member {
                    ColoredData {
                        url: colored_site.url.clone(),
                        owner_approval: colored_site.owner_approval,
                        second_member_approval: true,
                        third_member_approval: colored_site.third_member_approval,
                        vote_count: colored_site.vote_count,
                    }
                }
                else {
                    ColoredData {
                        url: colored_site.url.clone(),
                        owner_approval: colored_site.owner_approval,
                        second_member_approval: colored_site.second_member_approval,
                        third_member_approval: true,
                        vote_count: colored_site.vote_count,
                    }
                };
            

            self.colored_data_list
                .insert((xxx_id, colored_id), &new_colored_data);

            let caller = self.env().caller();
            let mut governance_token: GovernanceTokenRef =
                ink::env::call::FromAccountId::from_account_id(self.governance_token_address);
            let amount = self.governance_token_base_fee.saturating_mul(APPROVE);
            match governance_token.transfer(caller, amount) {
                Ok(_) => (),
                Err(_) => return Err(Error::CallingGovernanceTokenFunctionFailed),
            }

            self.env().emit_event(ApprovedColorTheSite {
                xxx_id: xxx_id,
                colored_id: colored_id,
                approver: caller,
                target_url: colored_site.url.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn vote_to_color_the_site(&mut self, xxx_id: u128, colored_id: u128) -> Result<()> {
            let caller = self.env().caller();
            if self._does_the_user_signed_up(caller) == false {
                ink::env::debug_println!("########## color_the_internet::vote_to_color_the_site:[0]");
                return Err(Error::TheUserDoesNotSignedUpYet);
            }
            let colored_site = match self.colored_data_list.get((xxx_id, colored_id)) {
                Some(value) => value,
                None => {
                    ink::env::debug_println!("########## color_the_internet::vote_to_color_the_site:[1]");
                    return Err(Error::TheSiteDoesNotExist);
                }
            };
            if self._is_the_target_site_approved(&colored_site) == false {
                ink::env::debug_println!("########## color_the_internet::vote_to_color_the_site:[2]");
                return Err(Error::TheTargetSiteIsNotApproved);
            }
            if self.vote_list.get((xxx_id, colored_id, caller)).is_some() {
                ink::env::debug_println!("########## color_the_internet::vote_to_color_the_site:[3]");
                return Err(Error::TheUserHasAlreadyVoted);
            }
            let new_colored_data = ColoredData {
                url: colored_site.url.clone(),
                owner_approval: colored_site.owner_approval,
                second_member_approval: colored_site.second_member_approval,
                third_member_approval: colored_site.third_member_approval,
                vote_count: colored_site.vote_count.saturating_add(1),
            };
            self.colored_data_list
                .insert((xxx_id, colored_id), &new_colored_data);
            self.vote_list.insert((xxx_id, colored_id, caller), &true);

            let mut governance_token: GovernanceTokenRef =
                ink::env::call::FromAccountId::from_account_id(self.governance_token_address);
            let amount = self.governance_token_base_fee.saturating_mul(VOTE);
            match governance_token.transfer(caller, amount) {
                Ok(_) => (),
                Err(_) => {
                    ink::env::debug_println!("########## color_the_internet::vote_to_color_the_site:[4]");
                    return Err(Error::CallingGovernanceTokenFunctionFailed);
                }
            }

            self.env().emit_event(Voted {
                xxx_id: xxx_id,
                colored_id: colored_id,
                voter: caller,
                target_url: colored_site.url.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn delete_maricious_xxx(&mut self, xxx_id: u128) -> Result<()> {
            if self._is_caller_owner() == false {
                return Err(Error::OnlyOwnerDoes);
            }
            // if self.is_stopped_creating_xxx_for_listing == true {
            //     return Err(Error::CreatingXXXIsAlreadyStopped);
            // }
            self.xxx_data_list.remove(xxx_id);
            Ok(())
        }

        #[ink(message)]
        pub fn stop_creating_xxx_for_listing(&mut self) -> Result<()> {
            if self.is_stopped_creating_xxx_for_listing == true {
                return Err(Error::CreatingXXXIsAlreadyStopped);
            }
            match self._is_caller_owner() {
                true => {
                    self.is_stopped_creating_xxx_for_listing = true;
                    Self::env().emit_event(StoppedToCreateXXX {});
                    Ok(())
                }
                false => return Err(Error::OnlyOwnerDoes),
            }
        }

        #[ink(message)]
        pub fn get_governance_token_address(&self) -> AccountId {
            self.governance_token_address
        }

        #[ink(message)]
        pub fn get_personal_data(&self, target_account: AccountId) -> Result<PersonData> {
            match self.personal_data_list.get(target_account) {
                Some(value) => Ok(value),
                None => Err(Error::TheUserDoesNotSignedUpYet),
            }
        }

        #[ink(message)]
        pub fn get_personal_data_list(&self) -> Vec<PersonData> {
            let mut personal_data_list = Vec::new();
            for i in 0..self.personal_data_id {
                let personal_data = match self.personal_data_list_for_id.get(i) {
                    Some(value) => personal_data_list.push(value),
                    None => (),
                };
            }
            personal_data_list
        }

        #[ink(message)]
        pub fn get_xxx_data(&self, xxx_id: u128) -> Result<XXXData> {
            match self.xxx_data_list.get(xxx_id) {
                Some(value) => Ok(value),
                None => Err(Error::TheXXXDoesNotExist),
            }
        }

        #[ink(message)]
        pub fn get_xxx_data_list(&self) -> Vec<XXXData> {
            let mut xxx_data_list = Vec::new();
            for i in 0..self.xxx_id {
                let xxx_data = match self.xxx_data_list.get(i) {
                    Some(value) => xxx_data_list.push(value),
                    None => (),
                };
            }
            xxx_data_list
        }

        #[ink(message)]
        pub fn get_colored_data(&self, xxx_id: u128, colored_id: u128) -> Result<ColoredData> {
            match self.colored_data_list.get((xxx_id, colored_id)) {
                Some(value) => Ok(value),
                None => Err(Error::TheSiteDoesNotExist),
            }
        }

        #[ink(message)]
        pub fn get_colored_data_list_for_xxx(&self, xxx_id: u128) -> Vec<ColoredData> {
            let mut colored_data_list = Vec::new();
            for i in 0..self.xxx_data_list.get(xxx_id).unwrap().colored_site_id {
                let colored_data = match self.colored_data_list.get((xxx_id, i)) {
                    Some(value) => colored_data_list.push(value),
                    None => (),
                };
            }
            colored_data_list
        }

        #[ink(message)]
        pub fn get_colored_data_list(&self) -> Vec<ColoredData> {
            let mut colored_data_list = Vec::new();
            for i in 0..self.xxx_id {
                for j in 0..self.xxx_data_list.get(i).unwrap().colored_site_id {
                    let colored_data = match self.colored_data_list.get((i, j)) {
                        Some(value) => colored_data_list.push(value),
                        None => (),
                    };
                }
            }
            colored_data_list
        }

        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        #[ink(message)]
        pub fn get_is_stopped_creating_xxx_for_listing(&self) -> bool {
            self.is_stopped_creating_xxx_for_listing
        }

        fn _does_the_user_signed_up(&self, target_account: AccountId) -> bool {
            match self.personal_data_list.get(target_account) {
                Some(_) => true,
                None => false,
            }
        }

        fn _does_the_xxx_work(&self, xxx_data: &XXXData) -> bool {
            match (xxx_data.second_member, xxx_data.third_member) {
                (Some(_), Some(_)) => true,
                (_, _) => false,
            }
        }

        fn _has_same_name_xxx(&self, name: String) -> bool {
            for i in 0..self.xxx_id {
                let xxx_data = self.xxx_data_list.get(i).unwrap();
                if xxx_data.name == name {
                    return true;
                }
            }
            false
        }

        fn _does_the_xxx_has_same_site(
            &self,
            xxx_id: u128,
            xxx_data: &XXXData,
            target_url: String,
        ) -> bool {
            for i in 0..xxx_data.colored_site_id {
                let colored_data = match self.colored_data_list.get((xxx_id, i)) {
                    Some(value) => {
                        if value.url == target_url {
                            return true;
                        }
                    }
                    None => (),
                };
            }
            false
        }

        fn _is_the_target_site_approved(&self, colored_data: &ColoredData) -> bool {
            if colored_data.owner_approval == true
                && colored_data.second_member_approval == true
                && colored_data.third_member_approval == true
            {
                return true;
            }
            false
        }

        fn _is_caller_owner(&self) -> bool {
            self.env().caller() == self.owner
        }

        fn _is_caller_xxx_owner(&self, xxx_data: &XXXData) -> bool {
            self.env().caller() == xxx_data.owner
        }

        fn _is_caller_xxx_second_member(&self, xxx_data: &XXXData) -> bool {
            match xxx_data.second_member {
                Some(value) => match value == self.env().caller() {
                    true => true,
                    false => false,
                },
                None => false,
            }
        }

        fn _is_caller_xxx_third_member(&self, xxx_data: &XXXData) -> bool {
            match xxx_data.third_member {
                Some(value) => match value == self.env().caller() {
                    true => true,
                    false => false,
                },
                None => false,
            }
        }

        fn _is_caller_xxx_members(&self, xxx_data: &XXXData) -> bool {
            if self._is_caller_xxx_owner(&xxx_data) {
                return true;
            }
            if self._is_caller_xxx_second_member(&xxx_data) {
                return true;
            }
            if self._is_caller_xxx_third_member(&xxx_data) {
                return true;
            }
            false
        }

        // #[ink(message)]
        // pub fn flip(&mut self) {
        //     self.value = !self.value;
        // }

        // #[ink(message)]
        // pub fn get(&self) -> bool {
        //     self.value
        // }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let color_the_internet = ColorTheInternet::default();
            assert_eq!(color_the_internet.get(), false);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut color_the_internet = ColorTheInternet::new(false);
            assert_eq!(color_the_internet.get(), false);
            color_the_internet.flip();
            assert_eq!(color_the_internet.get(), true);
        }
    }

    /// This is how you'd write end-to-end (E2E) or integration tests for ink! contracts.
    ///
    /// When running these you need to make sure that you:
    /// - Compile the tests with the `e2e-tests` feature flag enabled (`--features e2e-tests`)
    /// - Are running a Substrate node which contains `pallet-contracts` in the background
    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// A helper function used for calling contract messages.
        use ink_e2e::ContractsBackend;

        /// The End-to-End test `Result` type.
        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        /// We test that we can upload and instantiate the contract using its default constructor.
        #[ink_e2e::test]
        async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let mut constructor = ColorTheInternetRef::default();

            // When
            let contract = client
                .instantiate("color_the_internet", &ink_e2e::alice(), &mut constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let call_builder = contract.call_builder::<ColorTheInternet>();

            // Then
            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::alice(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), false));

            Ok(())
        }

        /// We test that we can read and write a value from the on-chain contract.
        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let mut constructor = ColorTheInternetRef::new(false);
            let contract = client
                .instantiate("color_the_internet", &ink_e2e::bob(), &mut constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let mut call_builder = contract.call_builder::<ColorTheInternet>();

            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), false));

            // When
            let flip = call_builder.flip();
            let _flip_result = client
                .call(&ink_e2e::bob(), &flip)
                .submit()
                .await
                .expect("flip failed");

            // Then
            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), true));

            Ok(())
        }
    }
}
