import { NextResponse } from 'next/server';

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (req: Request, ctx?: RouteContext) => Promise<NextResponse>;

export function withMiddleware(handler: RouteHandler): RouteHandler {
  return async (req: Request, ctx?: RouteContext): Promise<NextResponse> => {
    const requestId = crypto.randomUUID();
    const start = Date.now();
    const { method } = req;
    const pathname = new URL(req.url).pathname;

    console.log(`→ ${method} ${pathname} [${requestId}]`);

    try {
      const res = await handler(req, ctx);
      const ms = Date.now() - start;
      console.log(`← ${method} ${pathname} ${res.status} ${ms}ms [${requestId}]`);
      res.headers.set('X-Request-ID', requestId);
      res.headers.set('X-Response-Time', `${ms}ms`);
      return res;
    } catch (err) {
      const ms = Date.now() - start;
      console.error(`← ${method} ${pathname} 500 ${ms}ms [${requestId}]`, err);
      return NextResponse.json(
        { error: 'Internal server error', requestId },
        {
          status: 500,
          headers: {
            'X-Request-ID': requestId,
            'X-Response-Time': `${ms}ms`,
          },
        },
      );
    }
  };
}
