// Old review links now open the actual responsive website without a device frame.
export function GET() {
  // A relative Location preserves localhost, the phone's LAN URL and the
  // deployed host rather than exposing the development bind address.
  return new Response(null, { status: 307, headers: { Location: '/' } });
}
