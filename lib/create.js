const path = require('path')
const fs = require('fs-extra')
const Inquirer = require('inquirer')
const Creator = require('./Creator')

module.exports = async function(projectName,options){
    const cwd = process.cwd()  //获取当前命令执行时的工作目录
    const targetDir = path.join(cwd,projectName) //目标目录
    if(fs.existsSync(targetDir)){
        if(options.force){ // 如果强制创建 就删除已有的
            await fx.remove(targetDir)
        }else{
            let {action} = await Inquirer.promt([ //询问配置的方式
                {
                    name:'action',
                    type:'list',
                    message:'Target directory already exists Pick an action',
                    choices:[
                        {name:"OverWrite",value:'overwrite'},
                        {name:'Cancal',value:false}
                    ]
                }
            ])
            if(!action){
                return ;
            }else if(action === 'OverWrite'){
                await fs.remove('targetDir')
            }
        }
    } 
    // 创建
    const creator = new Creator(projectName,targetDir)
    creator.create()
   
}
