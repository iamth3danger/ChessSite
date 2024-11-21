export interface FormInfo {
  account: string;
  startDate: Date;
  endDate: Date;
  isSubmittable : boolean;

  setAccount: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  setSubmittable : React.Dispatch<React.SetStateAction<boolean>>;
}
