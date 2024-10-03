import { redirect } from 'next/navigation';

export async function GET() {
  const baseURL = 'https://github.com/login/oauth/authorize';
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: 'read:user,user:email',
    allow_signup: 'true',
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${baseURL}?${formattedParams}`;
  return redirect(finalURL);
}
