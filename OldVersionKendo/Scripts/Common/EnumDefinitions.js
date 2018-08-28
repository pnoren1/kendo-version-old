var YesNoEnum = {
    All: 0,
    Yes: 1,
    No: 2,
};

var FeeActivityType = {
    TravelExpenses: 4,
    PreparingCombinationFile: 15
};

var FeeActivityCategory = {
    HearingsInHearings: 1,
    VisitsInHearings: 2,
    TravelsToVisitsInHearings: 3,
    TravelExpensesHearings: 5,
    OtherExpensesHearings: 6,
    CallsInShiftAndCalls: 7,
    ShiftsInShiftAndCalls: 8,
    TravelExpensesInShiftAndCalls: 9,
    TravelsToCallsInShiftAndCalls: 10,
};


var FeeActivityTypeClassification = {
    Base: 1,
    PercentageAddition: 2,
    Offsetting: 3,
    FullyOffsetBase: 4,
    FullyOffsetPercentageAddition: 5,
};

var FeeRequestHandlingState = {
    Nominator: 3,
};

var FeeRequestDistanceResponseEnum = {
    IdenticalPlaces: 0,
    NoCity: -1,
};

var FeeRequestLineDetailType = {
    SubmissionDetails: 1,
    ExaminationDetails: 2,
    ApprovalDetails: 3,
    Snapshot: 4,
};

var CallResults = {
    CandidateAgreed: 1,
};

var MerkavaCheckmentEnum = {
    ErrNominationTypeNotAllowedFeeRequest: 1,
    ErrNoSameEmploymentTypes : 2,
    WrnHearingModuleHasNotBusinessEntityMerkava : 3,
    WrnHearingModuleHaveMoreThanOneBusinessEntityMerkava: 4,
    WrnFeeRequestEmploymentTypeNotExist: 5,
    WrnShiftModuleHasNotBusinessEntityMerkava: 6,
};

var FeeRequestPlaceType = {
    ManagedPlace: 1,
    OtherPlace: 2
};

var NominationStatusEnum = {
    Active: 1,
    NoActive: 3,
};
var RoundTypeEnum = {
    NominationCandidate: 1,
    Nomination: 2,
};
var ProcessTypeEnum = {
    PoliceInvestigationAdviceBeforeInquiry: 1,
    PoliceInvestigationAdviceAfterInquiry: 2,
    PsychiatricCommittee: 37,
    CriminalCase: 18
};

var ProcessCategoryEnum = {
    ParoleBoard: 5
};

var PoliceIncidentNumberType = {
    PoliceIncidentNumber: 1,
    ProsecutionFile: 2,
};

var FeeActivityTravelDirectionsEnum = {
    OneWay: 1,
    TwoWay: 2,
};

var FeeRequestTypeEnum = {

    Meetings: 1,
    ShiftsAndOnCalls: 2
};

var FeeActivityIndicationEnum = {

    AccordingToKM: 10,
    InSpecialTaxi: 11
};

// TODO 2=Guest, code relying on Persons.AdvocateTypeId.Internal must be changed
var AdvocateFeatureEnum = {
    Normal: 1,
    Internal: 2,
};

var NominationTypeEnum = {
    Retainer: 2,
    Internal: 7,
    ToranutHakraot: 3,
    ToranutMahatzarim: 4,

};

var GroupByIndexex = {
    Process: 1,
    Shift: 2,
    Contact: 3,
    ProcessNumberForDisplay: 4,
};

var ContactTypeEnum = {
    Applicant: 1,
    Expert: 2,
    Advocate: 3,
    Location: 4,
    Office: 5
};

var ModuleEnum = {
    Applicant: 1,
    Expert: 2,
    Advocate: 3,
    Location: 4,
    Office: 5,
    Process: 6,
    PDOFile: 7
};

var ContentTypeEnum = {
    Management: 5,
    Administration: 6,
    Usage: 7,
    AdvocateModul: 8,
    ApplicantModul: 9,
    ProcessModul: 10,
    NominationModul: 11,
    FeeModule: 12,
    PDOFileModule: 13,
    ReportModule: 14,
    ShiftModule: 15,
}

var EntityContentTypeEnum = {
    Applicant: 1,
    Process: 2,
    Advocate: 3,
    Nomination: 4,
    CandidateForm: 5,
    FeeRequestHearing: 6,
    PDOFile: 7,
    FeeRequestShiftsCalls: 8,
    Shift: 9
};


var ApplicantStateEnum = {
    New: 1,
    InjectedID: 2,
    InjectedIDOther: 3,
    ExistingID: 4,
    ExistingIDOther: 5,
    ExistingNoID: 6,
    ExistingNoData: 7,
};

var GridRowState = {
    Added: 2,
    Modified : 4,
    Deleted: 8,
};

var PersonIdTypesEnum = {
    IdentityNumber: 1,
    Passport: 2,
    Palestinian: 3,
    Prisoner: 4,
    OtherNumberId: 255,
    NoneNumberId: 100, // remove
    NoData: 101, // remove
};

var PersonIdNumberStatusEnum = {
    Verified: 1,
    NotVerified: 2,
    NotChecked: 3,
    NotValid: 4,
};

var CountryEnum = {
    IsraelCode: 376,
};

var ShiftTypeEnum = {
    Readings : 3,
    };

var InteriorMinistryInquiryResults = {
    Success : 0,
    CheckDigitIsWrong: 1,
    DataNotAvailable: 2,
    ServiceNotAvailable: 3,
};
var PopulationRegistrationSymbolsEnum = {
    PreviousAddress: 1,
    CurrentAddress: 2,
};
/*
var AddressStatesEnum = {
    NoAddress: 1,
    UpdatedAddress: 2,
    NoChangesInAddress: 3,
    UpdateAddress: 4,
    NewAddress: 5,
};*/

var DuplicationPerson = {
    Error: 0,
    NotExist: 1,
    IdNumberExist: 2,
    FullNameExist: 3,
};

var LocationTypeEnum = {
    PrivateHouse: 1,
    KnownPlace: 2,
};

var PlaceTypeEnum = {
    InstitutionRehab: 1,
    Prison: 2,
    DetentionHouse: 3,
    PsychiatricHospital: 4,
    CareCenter: 5,
    ClosedCareCenter: 6,
    Court: 7,
    PoliceStation: 8,
    Other: 999,
};

var Released = {
    No: 0,
    Yes: 1
};

var ConsultationTypes = {
    PoliceConsultation: 1,
};

var NominationCauseEnum = {
    CalledAdvocate: 3,
};

var SearchProcessResponseTypeEnum = {
    Error: 0,
    ProcessesExist: 1,
    OnlyProcessExist: 2,
    NoExist: 3
};

var BusinessEntityType = {
    SoleProprietorship: 1,
    //Partnership: 2,
    Company: 2 //3
};

var AdvocateType = {
    External: 1,
    Internal: 2,
    Special: 3
};

var AdvocateStatusType = {
    Candidate: 1,
    Rejected: 2,
    PendingClassification: 3,
    PendingDistrictAttorneyApproval: 4,
    Active: 5,
    ActiveNotForNomination: 6,
    InactiveEmploymentEnded: 7,
    InactiveStandardRemoval: 8,
    InactiveAdministrativeRemoval: 9
};

var MemoEntityType = {
    Process: 1,
    Hearing: 2,
    Advocate: 3,
    AdmissionRequest: 4,
    Applicant: 6,
    PDOFile: 7,
    Nomination: 8,
    //FeeRequest: 9,
    FeeSubmition: 10,
    District: 11,
    AttachedPDOFile: 12,
    FeeHearingRequest: 9,
    FeeShiftRequest: 13,
};

var MemoKind = {
    Reminder: 1,
    Memo: 2,
    Mail: 3,
    Task: 4,
};

var CourtType = {
    MagistratesCourt: 1,
    DistrictCourt: 2,
    HighCourt: 3,
    MinorMagistratesCourt: 6,
    MinorDistrictCourt: 7,
};

var FieldDisplayOption = {
    NotDisplayed: 1,
    DisplayedOptional: 2,
    DisplayedMandatory: 3
};

var CourtLevel = {
    Magistrates: 1,
    District: 2,
    High: 3,
};

var NominationGroundStatus = {
    Eligible: 1,
    NotEligible: 2,
    Checking: 3,
    AdministrativeClose: 4,
};

var NominationGroundStatusReason = {
    Inquiry: 7
};

var HearingPeriod = {
    FutureHearing: 1,
    Hearing: 2
};

var AdmissionRequestStatusType = {
    PendingInterview: 3,
};

var CandidateFormStatus = {
    Accepted: 4,
};

var ProcessConnectionType = {
    ProcessAccompanying: 1,
    ProcessAttachment: 2,
    ProcessAdditional: 3
};
var EmploymentType = {
    SelfEmployment: 1,
    Employee: 2,
}

var PredefinedQueries = {
    InvestigationProcessesBroughtToCourt: 4,
}

var BusinessType = {
    SoleProprietorship: 1,
    Company: 2,
}
var AddressLocationType = {
    Home: 1,
    Office: 2,
}
var ContractStatus = {
    Active: 2,
    History: 3,
};

var NonActiveAdvocateStatus = {
    Allowed: 1,
    AllowedWithWarning: 2,
    Disallowed: 3,
};

var AdvocateContractType = {
    Retainer: 1,
    Readings: 2,
    Hours: 3,
};

var ProcessStatusReason = {
    CheckedForEligibility: 2,
    AdministrativeClosure: 11,
   
};

var RecommenderType = {
    Advocate: 1,
    Supervisor: 2,
};

var AdvocateAssociationStatuses = {
    Active: 1,
    NotExist: 3,
};

var SubscriptionEvents = {
    Lookup: 0,
    ExternalLookup: 1,
    DD: 3,
    AdvocateLookup: 6,
    Parameters: 7,
    ApplicantFeeSettings: 8,
    FeeSettings: 9,
    UsersCache: 10,
    GlobalNotification: 11,
    Distances: 12,
    GenericDocuments: 13
};

var ApplicantFeeActionType = {
    Fee: 1,
    Exemption: 2,
    SubmittedRequestExemption: 3,
    RequestAdditionalDocuments: 4,
    Discount: 5,
    RejectionRequestExemption: 6,
    WaitingForDecision: 7,
    ReceiveMailReturns: 8,
    SentFeeByRegisteredMail: 9,
    RegisteredMailReturns: 10,
    Freeze: 11,
    UnFreeze: 12
};

var FeeRequestLineDecisionType = {
    Approval: 1,
    Rejection: 2,
    TransferSupervisor: 3,
};

var FeeRequestLineStatus = {
    InReceiving: 1,
    Received: 2,
    InChecking: 3,
    Confirmed: 5,
    Rejected: 6,
    ChargeDecision: 7,
    ConfirmedByCharge: 8,
    RejectedByCharge: 9,
    FinalConfirmed: 10,
    DelayedPayment: 11,

    FinalRejected: 12,
    ConfirmedForShipment: 13,
    SentToMerkava: 14,
    FailedToMerkava: 15,
    OnHold: 18,
    OnHoldForNominationChange: 19
};

var FeeRequestLineSource = {
    Checking: 2
};

var GlobalParameters = {
    FeeRequestCallDays: 5
};