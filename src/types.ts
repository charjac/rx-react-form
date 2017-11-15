import { Observable, Subject } from 'rxjs'

export type FieldValue = string | number | boolean
export type FieldValueFunc<Props> = (props: Props) => FieldValue

export interface RxFormParams<Props> {
  fields: Fields<Props>
  valueChangeObs?: boolean
  debounce?: number
  throttle?: number
}

export interface Fields<Props> {
  [key: string]: Field<Props>
}

export interface FieldProp {
  dirty?: boolean
  error?: string
  touched?: boolean
  value: FieldValue
}

export interface Field<Props> {
  value?: FieldValue | FieldValueFunc<Props>
  validation?: (value: FieldValue, state: FormValues, props: Props) => string | undefined
  customInput?: boolean
}

export interface RequiredProps {
  onSubmit: (formValues: FormSubmitValues) => any
  onError?: (error: FormErrors) => any
}

export interface RxFormProps {
  ref?: any
  valueChange$?: Subject<FormValues> | null
  formSubmit$?: Observable<FormSubmitValues>
  setValue?: (state: any) => void
  valid?: boolean
  submitted?: boolean
}

export interface RxFormState {
  formValue: FormValues
  dirty: boolean
  submitted: boolean
}

export interface FormValues {
  [key: string]: FieldProp
}

export interface FormSubmitValues {
  [key: string]: FieldValue
}

export interface FormErrors {
  [key: string]: string
}

// Event

export interface InputEventTarget {
  name: string
  value: FieldValue
  checked?: boolean
}

export interface InputEvent {
  target: InputEventTarget
}
