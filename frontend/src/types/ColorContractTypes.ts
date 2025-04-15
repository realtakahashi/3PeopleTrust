export interface PersonalData {
    realName: String;
    job: String;
    xAccount: String;
    blueSkyAccount: String;
    emailAccount: String;
}

export interface XXXData {
    xxxId: Number,
    name: String,
    tags: String,
    owner: String,
    secondMember: String,
    thirdMember: String,
    coloredSiteId: Number,
}

export interface ColoredData {
    coloredId: Number,
    url: string,
    owner_approval: Boolean,
    second_member_approval: Boolean,
    third_member_approval: Boolean,
    vote_count: Number,
}
