import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * 아직 root 페이지 준비안되어서 무건 resume 으로 redirect
 * @param request 
 * @returns 
 */
export async function middleware(request: NextRequest) {
  return NextResponse.redirect(
      new URL("/resume", request.url)
    );
}

// matcher에 매칭되는 경로로 접근하는 경우, middleware 실행
export const config = {
// 배열(string[]) 혹은 단일 경로(string)가 가능하다.
  matcher: "/"
};