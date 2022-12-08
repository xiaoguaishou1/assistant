import { defineStore, acceptHMRUpdate } from 'pinia';

export const Store = defineStore('index', {
    persist: true,
    state: () => ({
        count: 0
    })
})

//热更新
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(Store, import.meta.hot))
}