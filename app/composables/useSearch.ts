export interface SearchDoc {
    title: string
    path: string
    category: string
    tags: string[]
    description: string
}

let indexPromise: Promise<SearchDoc[]> | null = null

function loadIndex() {
    if(!indexPromise){
        indexPromise = $fetch<SearchDoc[]>('/search-index.json')
    }
    return indexPromise
}

function isMatch(doc:SearchDoc, keyword:string){
    const haystack = [doc.title, doc.category, doc.description, ...doc.tags].join(' ').toLowerCase()

    return haystack.includes(keyword)
}

export function useSearch() {
    const query = ref('')
    const results = ref<SearchDoc[]>([])

    watch(query, async (value) => {
        const keyword = value.trim().toLowerCase()
        if(!keyword){
            results.value = []
            return
        }

        const docs = await loadIndex()
        results.value = docs.filter(doc => isMatch(doc, keyword)).slice(0, 8)
    })

    function clear() {
        query.value = ''
        results.value = []
    }

    
    return {
        query,
        results,
        clear
    }
}