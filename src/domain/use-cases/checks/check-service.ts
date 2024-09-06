import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

// This use case checks if a service is available
interface CheckServiceUseCase {
    execute( url: string ): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;

export class CheckService implements CheckServiceUseCase{

    // The constructor receives the log repository, a success callback and an error callback
    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ) {}
    
    // This method checks if a service is available
    async execute( url: string ): Promise<boolean> {

        try {
            const req = await fetch( url );
            
            if ( !req.ok ) {
                throw new Error(`Error on check service ${ url }`);
            }
            // If the service is available, save a log with low severity    
            const log = new LogEntity(`Service ${ url } working`, LogSeverityLevel.low );
            this.logRepository.saveLog( log )

            // Call the success callback
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {
            const errorMessage = `${ url } is not ok. ${ error }`;
            // If the service is not available, save a log with high severity
            const log = new LogEntity( errorMessage , LogSeverityLevel.high );
            this.logRepository.saveLog( log );

            // Call the error callback
            this.errorCallback && this.errorCallback( `${error}` );
            return false;
        }
    }

}
