
import type { ExtendedGroupUser, ExtendedSession, Group } from '@/types';
import { reactive } from 'vue';


export default reactive({
  groupUser: <ExtendedGroupUser>{},
  groupUsers: <ExtendedGroupUser[]>[],
  sessions: <ExtendedSession[]>[],
  groups: <Group[]>[]
})

// store.groupUser

// export { groupUser, groupUsers, sessions }