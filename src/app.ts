
import { envs } from "./config/plugins/envs.plugin";
import { Server } from "./presentation/server";

( async () => {
    await main();
})();

function main() {
    // Server.start();
    console.log(envs.PORT);
    console.log(envs.MAILER_EMAIL);
    console.log(envs.MAILER_SECRET_KEY);  
    console.log(envs.PROD);
}

