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
  group: string
  user: string
  content: string
}