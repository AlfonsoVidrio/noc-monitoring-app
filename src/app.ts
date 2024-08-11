import { Server } from "./presentation/server";

( async () => {
    await main();
})();

function main() {
    Server.start();
}

