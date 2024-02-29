$(function () {
    let list = $('[src], [href]').map(function() {
        if(this.tagName == "A"){
            return this.href
        }
    })
    .filter((index, value) => {
        return value != "javascript:void(0)"
    })
    .filter((index, value) => {
        return !(value.includes("cdn"))
    })

    let set = new Set(list)
    console.log([...set].join('\n'))
})