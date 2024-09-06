
export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}
export class LogEntity {

    public level: LogSeverityLevel;
    public message: string;
    public createdAt: Date;

    constructor( message:string, level: LogSeverityLevel ) {
        this.message = message;
        this.level = level;
        this.createdAt = new Date();
    }

    // This method converts the log to a JSON string
    static fromJson = (json: string ):LogEntity => {
        const { message, level, createdAt } = JSON.parse(json);
        if ( !message ) throw new Error('message is required');
        if ( !level ) throw new Error('level is required');

        const log = new LogEntity( message, level );
        log.createdAt = new Date(createdAt);
        return log;
    }
}