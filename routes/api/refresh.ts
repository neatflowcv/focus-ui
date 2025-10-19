import {
  createTokenRefreshResponse,
  define,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  getUsernameFromRequest,
} from "../../utils.ts";

const KEY_STONE_BASE_URL = "http://127.0.0.1:9000";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const accessToken = getAccessTokenFromRequest(ctx.req);
      const refreshToken = getRefreshTokenFromRequest(ctx.req);
      const username = getUsernameFromRequest(ctx.req);

      if (!accessToken || !refreshToken || !username) {
        return new Response(
          JSON.stringify({ error: "Missing tokens or username" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // KEY_STONE의 refresh 엔드포인트 호출
      try {
        const refreshResponse = await fetch(
          `${KEY_STONE_BASE_URL}/key-stone/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
          },
        );

        if (refreshResponse.ok) {
          const tokenData = await refreshResponse.json();
          console.log("Token refresh response:", tokenData);

          // 새로운 토큰들을 받아서 쿠키에 저장
          return createTokenRefreshResponse(
            tokenData.access_token,
            tokenData.refresh_token,
            username,
          );
        } else {
          return new Response(
            JSON.stringify({ error: "Token refresh failed" }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      } catch (error) {
        console.log("토큰 갱신 서비스 연결 오류:", (error as Error).message);
        return new Response(
          JSON.stringify({ error: "Service unavailable" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
