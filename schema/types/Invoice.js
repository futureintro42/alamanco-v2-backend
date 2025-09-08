module.exports = `
input invoiceInput {
    _id:String
    sticker_number:String!
    reference_number:String!
    equipment_type:String!
    equipment_description:String!
    make:String!
    serial_number:String!
    year_of_manufacturing:String!
    plant_number:String!
    location_of_equipment:String!
    owner_business_name:String!
    owner_business_address:String!
    details:String!
    standard_specification:String!
    business_name:String!
    business_address:String!
    inspection_date:String!
    inspection_next_date:String!
    inspector_name:String!
    resultStatus:String!
}

input objSearchInput {
  attribute: String
  value: String!
}

type findInvoiceByIDResponse {
    message:String
    severity:String
    response:invoiceFields
}

type invoiceListResponse {
    response:[invoiceFields]
}

type invoiceFields {
    _id:String
    id:Int
    fk_user_id:Int
    user:String
    sticker_number:String
    reference_number:String
    equipment_type:String
    equipment_description:String
    make:String
    serial_number:String
    year_of_manufacturing:String
    plant_number:String
    location_of_equipment:String
    owner_business_name:String
    owner_business_address:String
    details:String
    standard_specification:String
    business_name:String
    business_address:String
    inspection_date:String
    inspection_next_date:String
    inspector_name:String
    status:String
    createdAt:String
    updatedAt:String
    resultStatus:String
    action:action
}

type Mutation {
    createInvoice(input:invoiceInput):generalFormResponse
    updateInvoice(input:invoiceInput):generalFormResponse
    changeInvoiceStatus(input:idInput):generalResponse
    removeInvoice(input:objIdInput):generalResponse
}
type Query {
    findInvoiceByID(input:objIdInput):findInvoiceByIDResponse
    findInvoiceBySearch(input:objSearchInput):findInvoiceByIDResponse
    invoiceList:invoiceListResponse
}
`;
