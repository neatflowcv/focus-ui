import { createTokenResponse, define } from "../../utils.ts";

const KEY_STONE_BASE_URL = "http://127.0.0.1:9000";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const formData = await ctx.req.formData();
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();

      if (!username || !password) {
        return new Response("사용자 이름과 비밀번호를 입력해주세요", {
          status: 400,
        });
      }

      // 외부 인증 서비스와 연동
      try {
        const authResponse = await fetch(
          `${KEY_STONE_BASE_URL}/key-stone/auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ username, password }),
          },
        );

        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log("Auth response:", authData);

          // KEY_STONE에서 받은 토큰을 그대로 사용
          const accessToken = authData.access_token;
          const refreshToken = authData.refresh_token;

          // 리디렉션 URL 확인
          let redirectUrl = "/";
          try {
            const url = new URL(ctx.req.url);
            const redirectParam = url.searchParams.get("redirect");
            redirectUrl = redirectParam
              ? decodeURIComponent(redirectParam)
              : "/";
          } catch (error) {
            console.error("URL parsing error:", error);
          }

          console.log("Creating token response with:", {
            accessToken: accessToken ? "present" : "missing",
            refreshToken: refreshToken ? "present" : "missing",
            username,
            redirectUrl,
          });

          return createTokenResponse(
            accessToken,
            refreshToken,
            username,
            redirectUrl,
          );
        } else if (authResponse.status === 401) {
          const headers = new Headers();
          headers.set("Location", "/login?error=invalid_credentials");
          return new Response(null, { status: 302, headers });
        } else {
          const headers = new Headers();
          headers.set("Location", "/login?error=service_unavailable");
          return new Response(null, { status: 302, headers });
        }
      } catch (error) {
        console.log("인증 서비스 연결 오류:", (error as Error).message);
        const headers = new Headers();
        headers.set("Location", "/login?error=service_unavailable");
        return new Response(null, { status: 302, headers });
      }
    } catch (error) {
      console.error("Login error:", error);
      const headers = new Headers();
      headers.set("Location", "/login?error=server_error");
      return new Response(null, { status: 302, headers });
    }
  },
});
