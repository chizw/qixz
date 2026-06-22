import type { FeedGroup } from '../types/feed'

interface FriendStatusEntry {
	link: string
	reachable: boolean
	latency: number
}

export interface FriendStatusData {
	link_data?: FriendStatusEntry[]
}

function normalizeFriendLink(link: string) {
	return link.replace(/\/+$/, '')
}

export function withFriendStatuses(groups: FeedGroup[], statusData?: FriendStatusData | null): FeedGroup[] {
	const statuses = new Map(
		statusData?.link_data?.map(status => [normalizeFriendLink(status.link), status]),
	)

	return groups.map(group => ({
		...group,
		entries: group.entries.map((entry) => {
			const status = statuses.get(normalizeFriendLink(entry.link))

			if (!status)
				return { ...entry }

			return {
				...entry,
				reachable: status.reachable,
				latency: status.latency,
			}
		}),
	}))
}
