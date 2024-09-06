import fs from 'fs';
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDatasource {

    private readonly logPath = 'logs/';
    private readonly allLogsPath = 'logs/logs-all.log';
    private readonly mediumLogsPath = 'logs/logs-medium.log';
    private readonly highLogsPath = 'logs/logs-high.log';

    constructor() {
        this.createLogsFiles();
    }

    // This method creates the logs directory if it does not exist
    private createLogsFiles = () => {
        // Create the logs directory if it does not exist
        if ( !fs.existsSync( this.logPath) ) {
            fs.mkdirSync( this.logPath );
        }

        // Create the log files if they do not exist
        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach( path => {
            if ( fs.existsSync( path ) ) return;

            fs.writeFileSync( path, '');
        });
    }

    // This method saves a log in the corresponding file
    async saveLog( newLog: LogEntity): Promise<void> {
        
        const logAsJson = `${ JSON.stringify(newLog)} \n`;

        // Save the log in the all logs file
        fs.appendFileSync( this.allLogsPath, logAsJson );

        // If the log is low, do not save it in the other files
        if( newLog.level === LogSeverityLevel.low ) return;

        // If the log is medium, save it in the medium file
        if ( newLog.level === LogSeverityLevel.medium ) {
            fs.appendFileSync( this.mediumLogsPath, logAsJson );
            return;
        // If the log is high, save it in the high file
        } else {
            fs.appendFileSync( this.highLogsPath, logAsJson );
        }

    }

    // This method reads the logs from a file
    private getLogsFromFile = ( path: string ): LogEntity[] => {
        // Read the content of the file
        const content = fs.readFileSync( path, 'utf-8');
        // Split the content by lines and convert each line to a LogEntity json
        const logs = content.split('\n').map(
            log => LogEntity.fromJson(log)
        );
        
        return logs;
    };

    // This method returns all logs of a certain severity level
    async getLogs(severityLevel: LogSeverityLevel): 
    Promise<LogEntity[]> {
        
        switch( severityLevel ) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile( this.allLogsPath );  
            case LogSeverityLevel.medium:
                return this.getLogsFromFile( this.mediumLogsPath );  
            case LogSeverityLevel.high:
                return this.getLogsFromFile( this.highLogsPath );  
            default:
                throw new Error(`${ severityLevel} not implemented`);
        }
    }

}