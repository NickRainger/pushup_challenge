import type { Record } from "pocketbase"

export interface BaseUser extends Record {
  username: string
  verified: boolean
  emailVisibility: boolean,
  email: string,
  groups: string[]
}
export type Groep = Record & {
  type: string
  naam: string
}

export type Session = Record & {
  user: string
  groep: string
  reps: number
  dag: number
  jaar: number
}