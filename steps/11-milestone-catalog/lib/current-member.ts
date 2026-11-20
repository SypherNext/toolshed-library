// Who is using Toolshed right now? Until the Sign-Up and Login lesson adds real accounts,
// everyone is the demo member Asha. Pages and actions only call getCurrentMember(),
// so swapping in real logins later changes this one file and nothing else.
import "server-only";

export type CurrentMember = {
  id: string;
  name: string;
};

const DEMO_MEMBER: CurrentMember = { id: "member-asha", name: "Asha Patel" };

export async function getCurrentMember(): Promise<CurrentMember> {
  return DEMO_MEMBER;
}
