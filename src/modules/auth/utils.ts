import { cookies as getCookies } from "next/headers";

interface Props {
  prifix: string;
  value: string;
}

export const generateAuthCookie = async ({
  prifix,
  value,
}: Props) => {
  const cookies = await getCookies();

  cookies.set({
    name: `${prifix}-token`,
    value: value,
    httpOnly: true,
    path: "/",
  })
}