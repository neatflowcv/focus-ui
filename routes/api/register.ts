import { define } from "../../utils.ts";

const KEY_STONE_BASE_URL = "http://127.0.0.1:9000";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const formData = await ctx.req.formData();
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();
      const confirmPassword = formData.get("confirmPassword")?.toString();

      if (!username || !password || !confirmPassword) {
        return new Response("모든 필드를 입력해주세요", { status: 400 });
      }

      if (password !== confirmPassword) {
        const headers = new Headers();
        headers.set("Location", "/register?error=password_mismatch");
        return new Response(null, { status: 302, headers });
      }

      // 외부 인증 서비스와 연동
      try {
        const registerResponse = await fetch(
          `${KEY_STONE_BASE_URL}/key-stone/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ username, password }),
          },
        );

        if (registerResponse.ok) {
          let registerData = null;
          if (registerResponse.status !== 204) {
            registerData = await registerResponse.json();
          }
          console.log("Register response:", registerData);

          // 회원가입 성공 시 로그인 페이지로 리다이렉트
          const headers = new Headers();
          headers.set("Location", "/login?message=registration_success");
          return new Response(null, { status: 302, headers });
        } else if (registerResponse.status === 409) {
          const headers = new Headers();
          headers.set("Location", "/register?error=username_exists");
          return new Response(null, { status: 302, headers });
        } else {
          const headers = new Headers();
          headers.set("Location", "/register?error=service_unavailable");
          return new Response(null, { status: 302, headers });
        }
      } catch (error) {
        console.log("회원가입 서비스 연결 오류:", (error as Error).message);
        const headers = new Headers();
        headers.set("Location", "/register?error=service_unavailable");
        return new Response(null, { status: 302, headers });
      }
    } catch (error) {
      console.error("Register error:", error);
      const headers = new Headers();
      headers.set("Location", "/register?error=server_error");
      return new Response(null, { status: 302, headers });
    }
  },
});
