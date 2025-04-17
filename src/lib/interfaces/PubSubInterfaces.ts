export interface NotificationDataMessage {
    reportUrl: string,
    clientUuid: string
}

export interface NotifyReportReadyMessage extends NotificationDataMessage {
    organizationUuid: string,
}
