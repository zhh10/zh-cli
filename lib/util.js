const ora = require('ora')
async function sleep(n){
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            resolve()
        },n)
    })
}

async function wrapLoading(fn,message,...args){
    const spinner = ora(message)
    spinner.start() 
    try{
        let repos = await fn(...args)
        spinner.succeed() //成功
        return repos
    }catch(e){
        spinner.fail('request failed,retetch ...')
        await sleep(1000)
        return wrapLoading(fn,message,...args) // 重新进行请求
    }
}

module.exports = {
    sleep,
    wrapLoading
}