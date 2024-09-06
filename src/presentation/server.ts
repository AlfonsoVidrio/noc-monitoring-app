import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infraestructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infraestructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";


const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource()
);

export class Server {

    public static start() {

        console.log('Server started...');

        CronService.createJob(
            "*/10 * * * * *",
            () => {
                // const url = 'https://www.google.com';
                const url = 'https://moodle.cualtos.udg.mx';
                new CheckService(
                    fileSystemLogRepository,
                    () => console.log(` ${url} is ok`),
                    (error) => console.error(`Error: ${error}`)
                ).execute(url);
            });
    }

}