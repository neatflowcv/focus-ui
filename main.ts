import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import authMiddleware from "./middleware/auth.ts";

export const app = new App<State>();

app.use(staticFiles());

// 인증 미들웨어 등록
app.use(authMiddleware);

// Include file-system based routes here
app.fsRoutes();
