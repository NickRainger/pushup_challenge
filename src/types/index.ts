import type { Record } from "pocketbase"

export interface BaseUser extends Record {
  username: string
  verified: boolean
  emailVisibility: boolean,
  email: string,
}
export interface Group extends Record {
  type: "public" | "invite" | "private"
  naam: string
}
export interface GroupUser extends Record {
  user: string
  group: string
}

export interface Session extends Record {
  groupuser: string
  reps: number
  dag: number
  jaar: number
  tijd: number
}
export interface Message extends Record {
  groupuser: string
  content: string
}






// export interface ExtendedGroupUser extends GroupUser {
//   expand: {
//     group: Group,
//   }
// }

export interface ExtendedGroupUser extends GroupUser {
  completedTime?: number
  totalReps?: number
  expand: {
    user: BaseUser
    group: Group
  }
}

export interface ExtendedSession extends Session {
  expand: {
    groupuser: ExtendedGroupUser
  }
}