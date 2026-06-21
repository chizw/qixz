import { LazyPopoverSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
	const layoutStore = useLayoutStore()
	const popoverStore = usePopoverStore()

	const word = ref('')
	const debouncedWord = refDebounced(word)

	function toggle() {
		layoutStore.toggle('search')
	}

	const { open, close } = popoverStore.use(() => h(LazyPopoverSearch, {
		onClose: () => {
			close()
			layoutStore.closeAll()
		},
	}), {
		unique: true,
		duration: 200,
	})

	watch(() => layoutStore.isOpen('search'), (searchOpen) => {
		if (!searchOpen)
			return close()

		word.value = window.getSelection()?.toString().trim() || word.value
		open()
	})

	return {
		word,
		debouncedWord,
		toggle,
	}
})
