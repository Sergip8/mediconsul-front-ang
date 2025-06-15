export enum AlertType {
  Success,
  Warning,
  Danger,
  Info,
}

export class Alert{
  message: string = "aaaaaaaaaaasbdakjskjdkajshfkj"
  alertType: AlertType = AlertType.Info
  show: boolean = false
}
export interface AlertRequest{
  isError: boolean
  message: string
}
