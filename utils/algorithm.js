var munkres = require('munkres-js');
exports.assignAlgoMax = (input)=>{
    // let input = [
    //     [400, 150, 400],
    //     [400, 450, 600],
    //     [300, 225, 300]
    //   ]

    
    let array = []
    input.forEach(elem =>{
       array = [...array,...elem] 
    })
    let max = Math.max(...array)
    let reversedInput = input.map(elem => {
        return elem.map(subElem =>{
            return max-subElem
        })
    })
    
    return munkres(reversedInput)
    
}
exports.assignAlgoMin = (input)=>{
    return  munkres(input)
}
