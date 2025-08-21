module.exports = `
input cardInput {
    _id:String
    name:String!
    iqama_number:String!
    issue_date:String!
    expiry_date:String!
    certified_as:String!
    company:String!
    examiner:String!
    profile_pic:String
}

type cardListResponse {
    response:[cardFields]
}

type findCardByIdResponse {
    severity:String
    message:String
    response:cardFields
}

type cardFields {
    _id:String
    id:Int
    fk_user_id:Int
    name:String
    iqama_number:String
    issue_date:String
    expiry_date:String
    certified_as:String
    profile_pic:String
    status:String
    company:String
    examiner:String
    createdAt:String
    updateddAt:String
    action:action
}

type Mutation {
    createCard(input:cardInput):generalFormResponse
    updateCard(input:cardInput):generalFormResponse
    changeCardStatus(input:idInput):generalResponse
    removeCard(input:objIdInput):generalResponse
}
type Query {
    cardList:cardListResponse
    findCardById(input:objIdInput):findCardByIdResponse
}
`;
