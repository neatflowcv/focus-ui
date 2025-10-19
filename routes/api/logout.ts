import { createLogoutResponse, define } from "../../utils.ts";

export const handler = define.handlers({
  POST() {
    // 로그아웃 처리 - 세션 쿠키 제거
    return createLogoutResponse();
  },
});
