
export interface mapInfoView {
    name: string,
    type?: 'DATE' | 'DATETIME' | 'BOOLEAN' |'FILE' | 'INFO' | 'CURRENCY' | null,
    isClickable?: boolean,
    viewType? : 'STAFF_EMP_ID' | 'SPONSOR_ID' | 'CROSS_REF_ID' | 'CHURCH_ID' | 'CHILD_ID'
    title: string,
    col?: string,
    invisible?:boolean
  }