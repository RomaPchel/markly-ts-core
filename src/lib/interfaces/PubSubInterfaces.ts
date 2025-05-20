export interface NotificationDataMessage {
    reportUrl: string,
    clientUuid: string
}

export interface NotifyReportReadyMessage extends NotificationDataMessage {
    organizationUuid: string,
}

export interface NotifyChangeEmailMessage extends NotificationDataMessage {
    email: string,
    token: string,
}

export interface NotifyPasswordRecoveryMessage extends NotificationDataMessage {
    email: string,
    token: string,
}