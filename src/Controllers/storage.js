const storage = {
    getItem: (key) => {
        let item = localStorage.getItem(key)
        return item
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value)
    },
    removeItem: (key) => {
        localStorage.removeItem(key)
    },
}

export default storage;