import type { Record } from "pocketbase"

export interface BaseUser extends Record {
  username: string
  verified: boolean
  emailVisibility: boolean,
  email: string,
}
export interface Group extends Record {
  type: string
  naam: string
}
export interface GroupUser extends Record {
  user: string
  groep: string
}

export interface Session extends Record {
  user: string
  groep: string
  reps: number
  dag: number
  jaar: number
  tijd: number
}